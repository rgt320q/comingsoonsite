// =================================================================================
// OYUN YÖNETİCİSİ (RENDERER VE INPUT HANDLER)
// =================================================================================

// Helper functions for time formatting (must be defined before GameManager)
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatShortTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const playerList = document.getElementById('player-list');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayText = document.getElementById('overlay-text');

    window.gameManager = {
        players: [],
        coins: [],
        currentPlayerIndex: 0,
        gameState: 'setup',
            lastTurnOwnerUid: null,
            hostUid: null,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        dragEnd: { x: 0, y: 0 },
        selectedCoin: null,
        woodPattern: null,
        physicsTimer: null,
        animationFrameId: null,
        lastMovedCoinId: null,
        ackButton: null,
        rematchButton: null,
        waitingText: null,
        fireworksCanvas: null,
        fireworksCtx: null,
        coinImages: [], // Array of all coin images
        coinImageAssignments: {}, // Which image each coin uses {coinId: imageIndex}
        imagesLoaded: false,

        LOGICAL_WIDTH: 600,
        LOGICAL_HEIGHT: 1000,
        COIN_DIAMETER_RATIO: 0.1,
        GOAL_WIDTH_RATIO: 0.3,

        // Authoritative state update from Firebase
        updateState(newState) {
            const gameOverlay = document.getElementById('game-overlay');

            this.players = newState.players || this.players;
            
            // Save host UID if provided
            if (newState.hostUid) {
                this.hostUid = newState.hostUid;
            }
            
            // Direct update - no interpolation (client runs own physics)
            // IMPORTANT: Always update coins when entering 'playing' or 'awaiting_ack' state to reset positions
            const shouldUpdateCoins = newState.coins && (
                !this.physicsTimer || 
                newState.status === 'playing' || 
                newState.status === 'awaiting_ack'
            );
            
            if (shouldUpdateCoins) {
                this.coins = JSON.parse(JSON.stringify(newState.coins));
                this.draw();
            }
            
            this.currentPlayerIndex = newState.currentPlayerIndex !== undefined ? newState.currentPlayerIndex : this.currentPlayerIndex;
            
            // Check if game is restarting (from gameOver to playing)
            const wasGameOver = this.gameState === 'gameOver';
            this.gameState = newState.status || this.gameState;
            const isNowPlaying = this.gameState === 'playing';
            
            // Force scoreboard rebuild when game restarts
            if (wasGameOver && isNowPlaying && playerList) {
                playerList.removeAttribute('data-initialized');
                
                // Hide rematch status container when new game starts
                const statusContainer = document.getElementById('rematch-status-container');
                if (statusContainer) {
                    statusContainer.classList.add('hidden');
                    statusContainer.innerHTML = '';
                }
                
                // Clear any animations from previous game
                const overlayAnimation = document.getElementById('overlay-animation');
                if (overlayAnimation) {
                    overlayAnimation.innerHTML = '';
                }
            }
            
            this.lastMovedCoinId = newState.lastMovedCoinId;
            
            // Save path foul state
            if (newState.isPathFoulActive !== undefined) {
                this.isPathFoulActive = newState.isPathFoulActive;
            }
            
            this.updateScoreboard();

            // Handle overlay messages and game over state
            if (this.gameState === 'gameOver') {
                // Force show overlay for game over state
                if (gameOverlay) {
                    gameOverlay.classList.remove('hidden');
                } else {
                    console.error('🎮 ERROR: gameOverlay element not found!');
                }
                
                // Show game over message - always try to show it in gameOver state
                const overlayText = document.getElementById('overlay-text');
                if (overlayText) {
                    // First try to use overlayMessage from state
                    if (newState.overlayMessage && newState.overlayMessage.text) {
                        overlayText.innerHTML = newState.overlayMessage.text;
                    }
                    // If overlay text is still empty, show a generic message
                    else if (!overlayText.innerHTML || overlayText.innerHTML.trim() === '') {
                        const winner = this.players.reduce((prev, current) => 
                            (prev.score > current.score) ? prev : current
                        );
                        overlayText.innerHTML = `🏆 Oyun Bitti!<br>Kazanan: ${winner.name} 🏆`;
                    }
                    
                    // Ensure text is always visible
                    if (!overlayText.innerHTML || overlayText.innerHTML.trim() === '') {
                        overlayText.innerHTML = '🏆 Oyun Bitti! 🏆';
                    }
                } else {
                    console.error('🎮 ERROR: overlay-text element not found!');
                }
                
                // Show player status if there's rematch data, otherwise show rematch button
                if (newState.rematchReady && Object.keys(newState.rematchReady).length > 0) {
                    // Update player status display
                    this.updateRematchStatus(newState.rematchReady);
                } else {
                    // No one has clicked yet, show rematch button
                    const statusContainer = document.getElementById('rematch-status-container');
                    if (statusContainer) statusContainer.classList.add('hidden');
                    
                    if (this.rematchButton) {
                        this.rematchButton.classList.remove('hidden');
                    } else {
                        console.error('🎮 ERROR: rematchButton is null!');
                    }
                    
                    if (this.waitingText) this.waitingText.classList.add('hidden');
                }
                
                // Always show rematch button for game over
                if (this.rematchButton) {
                    this.rematchButton.classList.remove('hidden');
                }
            } else if (newState.overlayMessage && newState.overlayMessage.text) {
                // Handle other overlay messages (goals, fouls, etc.)
                this.showOverlay(newState.overlayMessage.text, newState.overlayMessage.type, newState.overlayMessage.requiresAck, false);
            } else {
                // Show a passive grey overlay automatically when it's NOT my turn
                // Update turn tracking
                const currentTurnUid = this.players[this.currentPlayerIndex]?.uid;
                if (currentTurnUid && currentTurnUid !== this.lastTurnOwnerUid) {
                    this.lastTurnOwnerUid = currentTurnUid;
                }
                
                const isMyTurn = this.players[this.currentPlayerIndex]?.uid === auth.currentUser.uid;
                const isAwaitingAck = this.gameState === 'awaiting_ack';
                const isAckTurnForMe = isAwaitingAck && isMyTurn; // I should see ACK UI, not passive overlay
                const shouldWatch = !isMyTurn && (this.gameState === 'playing' || this.gameState === 'simulating' || isAwaitingAck);

                if (shouldWatch && !isAckTurnForMe) {
                    const activeName = (this.players && this.players[this.currentPlayerIndex]) ? (this.players[this.currentPlayerIndex].name || 'diğer oyuncu') : 'diğer oyuncu';
                    if (overlayText) {
                        const suffix = isAwaitingAck ? ' (onay bekleniyor...)' : '';
                        overlayText.innerHTML = `Sıra ${activeName}\'da${suffix}`;
                        overlayText.style.opacity = '0.85';
                    }
                    if (gameOverlay) {
                        gameOverlay.classList.remove('hidden');
                        // Grey filter look for not-my-turn state
                        gameOverlay.style.background = 'rgba(100,116,139,0.35)'; // slate-500/35
                        gameOverlay.style.backdropFilter = 'blur(1px)';
                    }
                    
                    // Clear animation when showing watcher overlay
                    const overlayAnimation = document.getElementById('overlay-animation');
                    if (overlayAnimation) {
                        overlayAnimation.innerHTML = '';
                    }
                    
                    if (this.ackButton) this.ackButton.classList.add('hidden');
                    if (this.rematchButton) this.rematchButton.classList.add('hidden');
                    if (this.waitingText) this.waitingText.classList.add('hidden');
                    
                    // Practice mode button'u da gizle
                    const practiceMenuBtn = document.getElementById('practice-menu-button');
                    if (practiceMenuBtn) practiceMenuBtn.classList.add('hidden');
                    
                    this.stopFireworks();
                } else {
                    // My turn - vibrate to notify
                    if (isMyTurn && this.gameState === 'playing') {
                        if (navigator.vibrate) {
                            navigator.vibrate([50, 30, 50]); // Quick double tap
                        }
                    }
                    
                    if (gameOverlay) {
                        gameOverlay.classList.add('hidden');
                        // Reset any inline styling so goal/foul overlays use default gradient
                        gameOverlay.style.background = '';
                        gameOverlay.style.backdropFilter = '';
                    }
                    if (overlayText) overlayText.style.opacity = '';
                    
                    // Clear animation when hiding overlay
                    const overlayAnimation = document.getElementById('overlay-animation');
                    if (overlayAnimation) {
                        overlayAnimation.innerHTML = '';
                    }
                    
                    if (this.ackButton) this.ackButton.classList.add('hidden');
                    if (this.rematchButton) this.rematchButton.classList.add('hidden');
                    if (this.waitingText) this.waitingText.classList.add('hidden');
                    this.stopFireworks();
                }
            }
        },

        // Host-only: Starts a smooth local rendering loop
        startLocalRender(getCoins) {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            const renderLoop = () => {
                this.coins = getCoins(); // Get the latest positions from the local simulation
                this.draw();
                this.animationFrameId = requestAnimationFrame(renderLoop);
            };
            this.animationFrameId = requestAnimationFrame(renderLoop);
        },

        stopLocalRender() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        },

        updateScoreboard() {
            const playerListElement = document.getElementById('player-list');
            if (!playerListElement) return;
            
            // Check if we need to rebuild the entire scoreboard
            const needsRebuild = !playerListElement.hasAttribute('data-initialized') || 
                                 playerListElement.children.length !== this.players.length;
            
            if (needsRebuild) {
                // Full rebuild
                playerListElement.innerHTML = '';
                const hostUid = this.hostUid || (this.players && this.players[0] && this.players[0].uid) || null;
                const isPracticeMode = window.practiceMode && window.practiceMode.active;
                
                this.players.forEach((p, i) => {
                    const isHost = hostUid ? (p.uid === hostUid) : (i === 0);
                    const hostIcon = String.fromCodePoint(0x1F5A5, 0xFE0F); 
                    const clientIcon = String.fromCodePoint(0x1F464); 
                    const roleBadge = !isPracticeMode ? (isHost ? `<span class="ml-2 inline-flex items-center text-blue-400" title="Host">${hostIcon}</span>` : `<span class="ml-2 inline-flex items-center text-slate-300/80" title="Client">${clientIcon}</span>`) : '';
                    
                    const playerCard = document.createElement('div');
                    playerCard.className = 'p-3 rounded-lg transition-all duration-300';
                    playerCard.setAttribute('data-player-uid', p.uid);
                    playerCard.setAttribute('data-player-index', i);
                    
                    // Practice mode: Farklı layout
                    if (isPracticeMode) {
                        playerCard.innerHTML = `
                            <h3 class="font-bold text-lg text-shadow flex items-center justify-between">
                                <span>${p.name}</span>
                                <span class="text-amber-300 font-semibold player-total-time">00:00</span>
                            </h3>
                            <div class="flex items-center justify-between text-sm mt-2">
                                <p class="text-shadow">Gol: <span class="font-semibold player-score">${p.score || 0}</span></p>
                                <p class="text-shadow player-fouls">Faul: <span class="font-semibold">0</span></p>
                            </div>
                            <div class="text-center mt-2">
                                <p class="text-shadow player-lives">Can: ${'❤️'.repeat(p.lives || 0)}</p>
                            </div>
                        `;
                    } else {
                        // Normal mode: Eski layout
                        playerCard.innerHTML = `
                            <h3 class="font-bold text-lg text-shadow flex items-center">
                                ${p.name}${roleBadge}
                                <span class="ml-auto text-amber-300 font-semibold player-turn-time">00:00</span>
                            </h3>
                            <div class="flex items-center justify-between text-sm mt-2">
                                <p class="text-shadow">Skor: <span class="font-semibold player-score">${p.score || 0}</span></p>
                                <p class="text-shadow player-lives">Can: ${'❤️'.repeat(p.lives || 0)}</p>
                            </div>
                        `;
                    }
                    
                    playerListElement.appendChild(playerCard);
                });
                
                playerListElement.setAttribute('data-initialized', 'true');
            }
            
            // Update only the dynamic parts (faster)
            this.players.forEach((p, i) => {
                const playerCard = playerListElement.querySelector(`[data-player-uid="${p.uid}"]`);
                if (!playerCard) return;
                
                const isActive = (i === this.currentPlayerIndex && (this.gameState === 'playing' || this.gameState === 'simulating' || this.gameState === 'awaiting_ack'));
                
                // Update card styling for active player
                if (isActive) {
                    playerCard.className = 'p-3 rounded-lg transition-all duration-300 bg-amber-500/30 border-l-4 border-amber-400';
                } else {
                    playerCard.className = 'p-3 rounded-lg transition-all duration-300 bg-slate-700/50';
                }
                
                // Update time (practice mode: total time, normal mode: turn time)
                const isPracticeMode = window.practiceMode && window.practiceMode.active;
                
                if (isPracticeMode) {
                    // Practice mode: Show total elapsed time
                    const totalTime = window.gameStats && window.gameStats.gameStartTime 
                        ? Date.now() - window.gameStats.gameStartTime 
                        : 0;
                    const totalTimeElement = playerCard.querySelector('.player-total-time');
                    if (totalTimeElement) {
                        totalTimeElement.textContent = formatShortTime(totalTime);
                    }
                } else {
                    // Normal mode: Show turn time
                    const turnTime = window.gameStats && window.gameStats.playerTurnTimes[p.uid] 
                        ? window.gameStats.playerTurnTimes[p.uid] 
                        : 0;
                    
                    let displayTurnTime = turnTime;
                    if (isActive && window.gameStats && window.gameStats.currentTurnStartTime && window.gameStats.currentTurnUid === p.uid) {
                        displayTurnTime += Date.now() - window.gameStats.currentTurnStartTime;
                    }
                    
                    const turnTimeElement = playerCard.querySelector('.player-turn-time');
                    if (turnTimeElement) {
                        turnTimeElement.textContent = formatShortTime(displayTurnTime);
                    }
                }
                
                // Update score
                const scoreElement = playerCard.querySelector('.player-score');
                if (scoreElement && scoreElement.textContent !== String(p.score || 0)) {
                    scoreElement.textContent = p.score || 0;
                }
                
                // Update fouls (practice mode only)
                if (isPracticeMode) {
                    const foulsElement = playerCard.querySelector('.player-fouls span');
                    if (foulsElement) {
                        const foulCount = window.practiceMode.fouls || 0;
                        foulsElement.textContent = foulCount;
                    }
                }
                
                // Update lives
                const livesElement = playerCard.querySelector('.player-lives');
                if (livesElement) {
                    const livesCount = p.lives || 0;
                    
                    // Practice mode: Show infinity symbol instead of 999 hearts
                    if (window.practiceMode && window.practiceMode.active && livesCount >= 100) {
                        livesElement.innerHTML = `Can: <span class="text-green-400 font-bold">∞ (Sınırsız)</span>`;
                    } else if (livesCount > 0) {
                        livesElement.innerHTML = `Can: ${'❤️'.repeat(livesCount)}`;
                    } else {
                        livesElement.innerHTML = 'Can: <span class="text-red-500 font-bold">ELENDİ</span>';
                    }
                }
            });
            
            // Update game timer display
            if (window.updateGameTimerUI) {
                window.updateGameTimerUI();
            }
        },

        showOverlay(message, type = 'info', requiresAck = false, isGameOver = false) {
            const overlayText = document.getElementById('overlay-text');
            const overlayAnimation = document.getElementById('overlay-animation');
            const gameOverlay = document.getElementById('game-overlay');
            if (!overlayText || !gameOverlay || !this.ackButton) return;

            

            // Ensure default overlay styling (override any passive watcher grey filter)
            try {
                gameOverlay.style.background = '';
                gameOverlay.style.backdropFilter = '';
                overlayText.style.opacity = '';
            } catch (_) {}

            // Clear previous animation
            if (overlayAnimation) {
                overlayAnimation.innerHTML = '';
            }

            // Add animation based on message type
            if (overlayAnimation && type === 'foul') {
                const foulAnimation = this.getFoulAnimation(message);
                if (foulAnimation) {
                    overlayAnimation.innerHTML = foulAnimation;
                }
                // Vibrate for foul warning
                if (navigator.vibrate) {
                    navigator.vibrate([400]); // Single long vibration for warning
                }
            }

            overlayText.innerHTML = message;
            gameOverlay.classList.remove('hidden');
            this.ackButton.classList.add('hidden'); // Hide by default
            
            if (this.rematchButton) this.rematchButton.classList.add('hidden');
            if (this.waitingText) this.waitingText.classList.add('hidden');

            // Start fireworks if it's a goal message
            if (type === 'goal') {
                this.startFireworks();
                // Vibrate for goal celebration
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200, 100, 200]); // Celebration pattern
                }
            } else {
                this.stopFireworks();
            }

            // Show rematch button if game is over
            if ((isGameOver || type === 'gameOver')) {
                // Practice mode: Show menu button instead
                if (window.practiceMode && window.practiceMode.active) {
                    const practiceMenuBtn = document.getElementById('practice-menu-button');
                    if (practiceMenuBtn) {
                        practiceMenuBtn.classList.remove('hidden');
                    }
                } else if (this.rematchButton) {
                    this.resetRematchButton(); // Reset button state for new game
                    
                    // Clear any old rematch ready status from previous game
                    if (window.currentGameId) {
                        const rematchRef = database.ref(`games/${window.currentGameId}/rematchReady`);
                        rematchRef.once('value', (snapshot) => {
                            if (snapshot.exists()) {
                                rematchRef.remove();
                            }
                        });
                    }
                    
                    this.rematchButton.classList.remove('hidden');
                }
                return; // Don't show ack button
            }

            const myTurnToAck = this.players[this.currentPlayerIndex]?.uid === auth.currentUser.uid;

            if (requiresAck && myTurnToAck) {
                this.ackButton.classList.remove('hidden');
            }
        },
        
        getFoulAnimation(message) {
            // Determine animation based on foul message
            if (message.includes('Çarpışma')) {
                return `
                    <div class="collision-animation">
                        <div class="collision-coin-left"></div>
                        <div class="collision-coin-right"></div>
                    </div>
                `;
            } else if (message.includes('masadan düştü')) {
                return `
                    <div class="fall-animation">
                        <div class="fall-coin"></div>
                        <div class="fall-table-edge"></div>
                    </div>
                `;
            } else if (message.includes('Başlangıçtan direkt') || message.includes('direkt gol')) {
                return `
                    <div class="direct-goal-animation">
                        <div class="goal-net"></div>
                        <div class="direct-coin"></div>
                    </div>
                `;
            } else if (message.includes('iki para arasından') || message.includes('geçmelisin')) {
                return `
                    <div class="path-animation">
                        <div class="path-coin-moving"></div>
                        <div class="path-coins-pair">
                            <div class="path-coin-static"></div>
                            <div class="path-coin-static"></div>
                        </div>
                    </div>
                `;
            } else if (message.includes('Tüm paralar oynanmadan')) {
                return `
                    <div class="all-coins-animation">
                        <div class="coin"></div>
                        <div class="coin"></div>
                        <div class="coin"></div>
                    </div>
                `;
            }
            return '';
        },
        
        resetRematchButton() {
            if (!this.rematchButton) return;
            
            // Reset button text
            this.rematchButton.innerHTML = `
                <span class="flex items-center gap-3 text-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Hazırım
                </span>
            `;
            
            // Reset button styles
            this.rematchButton.disabled = false;
            this.rematchButton.classList.remove('from-blue-500', 'to-blue-600', 'cursor-not-allowed');
            this.rematchButton.classList.add('animate-pulse', 'from-green-500', 'to-emerald-600', 'hover:from-green-600', 'hover:to-emerald-700', 'hover:scale-110');
            
            // Clear rematch status display
            if (this.waitingText) {
                this.waitingText.classList.add('hidden');
            }
            
            const statusContainer = document.getElementById('rematch-status-container');
            if (statusContainer) {
                statusContainer.innerHTML = '';
                statusContainer.classList.add('hidden'); // Hide the container
            }
        },
        
        updateRematchStatus(rematchReady) {
            const statusContainer = document.getElementById('rematch-status-container');
            if (!statusContainer) return;
            
            const currentUid = auth.currentUser.uid;
            
            // Show status container
            statusContainer.classList.remove('hidden');
            statusContainer.innerHTML = '';
            
            // Create status card for each player
            this.players.forEach(player => {
                const isReady = rematchReady && rematchReady[player.uid];
                const isCurrentUser = player.uid === currentUid;
                
                const statusCard = document.createElement('div');
                statusCard.className = `
                    flex items-center justify-between p-4 rounded-xl transition-all duration-300
                    ${isReady 
                        ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500' 
                        : 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-2 border-slate-500'}
                    ${isCurrentUser ? 'ring-2 ring-amber-400' : ''}
                `;
                
                statusCard.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br ${
                            isReady ? 'from-green-400 to-emerald-600' : 'from-slate-500 to-slate-700'
                        } flex items-center justify-center text-white font-bold">
                            ${player.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-white flex items-center gap-2">
                                ${player.name}
                                ${isCurrentUser ? '<span class="text-xs bg-amber-500 px-2 py-0.5 rounded-full">Sen</span>' : ''}
                            </div>
                            <div class="text-sm ${isReady ? 'text-green-300' : 'text-slate-400'}">
                                ${isReady ? '✓ Tekrar oynamak istiyor' : 'Bekleniyor...'}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${isReady 
                            ? '<span class="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">Hazır</span>' 
                            : '<span class="px-3 py-1 bg-slate-600 text-slate-300 text-sm font-semibold rounded-full">Bekliyor</span>'
                        }
                    </div>
                `;
                
                statusContainer.appendChild(statusCard);
            });
            
            // Update button state based on current user's ready status
            if (rematchReady && rematchReady[currentUid]) {
                // User has clicked, change button to confirmed state
                if (this.rematchButton) {
                    this.rematchButton.innerHTML = `
                        <span class="flex items-center gap-3 text-lg">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Hazır! ✓
                        </span>
                    `;
                    this.rematchButton.classList.remove('hidden', 'animate-pulse', 'from-green-500', 'to-emerald-600', 'hover:from-green-600', 'hover:to-emerald-700', 'hover:scale-110');
                    this.rematchButton.classList.add('from-blue-500', 'to-blue-600', 'cursor-not-allowed');
                    this.rematchButton.disabled = true;
                }
                
                // Show waiting message
                if (this.waitingText) {
                    const waitingCount = this.players.filter(p => !rematchReady[p.uid]).length;
                    if (waitingCount > 0) {
                        this.waitingText.classList.remove('hidden');
                        this.waitingText.querySelector('span').textContent = `${waitingCount} oyuncu daha bekleniyor...`;
                    } else {
                        this.waitingText.classList.add('hidden');
                    }
                }
            } else {
                // User hasn't clicked yet, ensure button is in default state
                if (this.rematchButton && !this.rematchButton.disabled) {
                    this.resetRematchButton();
                }
            }
        },

        draw() {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.save();
            ctx.fillStyle = this.woodPattern ? '#a0522d' : '#8B4513';
            ctx.fillRect(0, 0, w, h);
            if (this.woodPattern) { ctx.globalAlpha = 0.2; ctx.fillStyle = this.woodPattern; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1.0; }
            const goalScreenX = (0.5 - this.GOAL_WIDTH_RATIO / 2) * w;
            const goalScreenWidth = this.GOAL_WIDTH_RATIO * w;
            const goalHeight = 40;
            
            // Draw coins that are NOT in goal first (behind goal net)
            const goalXStart = 0.5 - this.GOAL_WIDTH_RATIO / 2;
            const goalXEnd = 0.5 + this.GOAL_WIDTH_RATIO / 2;
            
            this.coins.forEach(coin => {
                // Only draw coins outside goal area
                if (coin.y > 0 || coin.x < goalXStart || coin.x > goalXEnd) {
                    this.drawCoin(coin);
                }
            });
            
            // Futbol kalesi
            // Kale arka planı (koyu gölge)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(goalScreenX, 0, goalScreenWidth, goalHeight);
            
            // Kale file ağı
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1;
            // Yatay fileler
            for (let y = 0; y <= goalHeight; y += 8) {
                ctx.beginPath();
                ctx.moveTo(goalScreenX, y);
                ctx.lineTo(goalScreenX + goalScreenWidth, y);
                ctx.stroke();
            }
            // Dikey fileler
            for (let x = goalScreenX; x <= goalScreenX + goalScreenWidth; x += 8) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, goalHeight);
                ctx.stroke();
            }
            
            // Kale direkleri (sağ ve sol)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(goalScreenX - 3, 0, 3, goalHeight + 3); // Sol direk
            ctx.fillRect(goalScreenX + goalScreenWidth, 0, 3, goalHeight + 3); // Sağ direk
            
            // Kale üst çıta
            ctx.fillRect(goalScreenX - 3, 0, goalScreenWidth + 6, 3);
            
            // Draw coins that ARE in goal (on top of goal net)
            this.coins.forEach(coin => {
                // Only draw coins inside goal area
                if (coin.y <= 0 && coin.x >= goalXStart && coin.x <= goalXEnd) {
                    this.drawCoin(coin);
                }
            });
            
            if (this.isDragging && this.selectedCoin) this.drawAimingLine();
            ctx.restore();
        },

        loadCoinImages() {
            // Load 6 different coin images
            const imageCount = 6;
            let loadedCount = 0;
            
            for (let i = 1; i <= imageCount; i++) {
                const img = new Image();
                const imgIndex = i - 1; // 0-5
                
                img.onload = () => {
                    loadedCount++;
                    
                    if (loadedCount === imageCount) {
                        this.imagesLoaded = true;
                        
                        this.assignRandomCoinImages(); // Assign random images to coins
                        this.draw();
                    }
                };
                
                img.onerror = () => {
                    loadedCount++;
                    
                    if (loadedCount === imageCount) {
                        if (this.coinImages.length > 0) {
                            this.imagesLoaded = true;
                            this.assignRandomCoinImages();
                            this.draw();
                        } else {
                            
                            this.imagesLoaded = false;
                        }
                    }
                };
                
                img.src = `images/ancient-coin0${i}.png`;
                this.coinImages[imgIndex] = img;
            }
        },
        
        assignRandomCoinImages() {
            // Randomly assign images to each coin (0, 1, 2)
            if (this.coinImages.length === 0) return;
            
            // Ensure each coin gets a different image if possible
            const availableIndices = [...Array(this.coinImages.length).keys()];
            
            for (let coinId = 0; coinId < 3; coinId++) {
                if (availableIndices.length === 0) {
                    // If we run out, refill the pool
                    availableIndices.push(...Array(this.coinImages.length).keys());
                }
                
                // Pick random image index
                const randomIdx = Math.floor(Math.random() * availableIndices.length);
                const imageIndex = availableIndices[randomIdx];
                
                // Remove from available pool to avoid duplicates
                availableIndices.splice(randomIdx, 1);
                
                this.coinImageAssignments[coinId] = imageIndex;
            }
        },

        drawCoin(coin) {
            const w = canvas.width;
            const screenX = coin.x * w;
            const screenY = coin.y * w;
            const screenRadius = (this.COIN_DIAMETER_RATIO / 2) * w;
            const diameter = screenRadius * 2;
            
            // Use image if loaded, otherwise fall back to gradient
            if (this.imagesLoaded && this.coinImages.length > 0) {
                // Get assigned image for this coin
                const imageIndex = this.coinImageAssignments[coin.id] || 0;
                const image = this.coinImages[imageIndex];
                
                if (!image || !image.complete) {
                    // Fallback if image not ready
                    this.drawGradientCoin(coin, screenX, screenY, screenRadius);
                    return;
                }
                
                ctx.save();
                
                // Draw circular shadow
                ctx.beginPath();
                ctx.arc(screenX + 2, screenY + 2, screenRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fill();
                
                // Create circular clipping path for the coin
                ctx.beginPath();
                ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
                ctx.clip();
                
                // Draw background (base metal color)
                ctx.fillStyle = coin.color || '#c0c0c0';
                ctx.fillRect(screenX - screenRadius, screenY - screenRadius, diameter, diameter);

                // Draw coin image using COVER mode - fills entire circle
                const imgW = image.naturalWidth || image.width;
                const imgH = image.naturalHeight || image.height;
                // Math.max ensures image covers the entire circle
                const scale = Math.max(diameter / imgW, diameter / imgH);
                const drawW = imgW * scale;
                const drawH = imgH * scale;
                const dx = screenX - drawW / 2;
                const dy = screenY - drawH / 2;
                ctx.drawImage(image, dx, dy, drawW, drawH);
                
                // Add subtle border for definition
                ctx.beginPath();
                ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.restore();
            } else {
                // Fallback: Original gradient rendering
                this.drawGradientCoin(coin, screenX, screenY, screenRadius);
            }
        },
        
        drawGradientCoin(coin, screenX, screenY, screenRadius) {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(screenX - screenRadius*0.2, screenY - screenRadius*0.2, screenRadius*0.1, screenX, screenY, screenRadius);
            gradient.addColorStop(0, coin.highlight || coin.color);
            gradient.addColorStop(1, coin.color);
            ctx.fillStyle = gradient;
            ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
            ctx.fill();
        },

        drawAimingLine() {
            const w = canvas.width;
            const coinScreenX = this.selectedCoin.x * w;
            const coinScreenY = this.selectedCoin.y * w;
            const aimX = coinScreenX - (this.dragEnd.x - this.dragStart.x);
            const aimY = coinScreenY - (this.dragEnd.y - this.dragStart.y);
            
            const dx = aimX - coinScreenX;
            const dy = aimY - coinScreenY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) return; // Don't draw if too short
            
            // Calculate power (0-1)
            const maxPower = w * 0.3; // Maximum drag distance
            const power = Math.min(distance / maxPower, 1);
            
            // Color based on power (green -> yellow -> red)
            let lineColor, glowColor;
            if (power < 0.33) {
                lineColor = `rgba(74, 222, 128, ${0.9})`; // green-400
                glowColor = 'rgba(74, 222, 128, 0.3)';
            } else if (power < 0.66) {
                lineColor = `rgba(251, 191, 36, ${0.9})`; // amber-400
                glowColor = 'rgba(251, 191, 36, 0.3)';
            } else {
                lineColor = `rgba(239, 68, 68, ${0.9})`; // red-500
                glowColor = 'rgba(239, 68, 68, 0.3)';
            }
            
            // Draw glow effect
            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 15;
            
            // Draw main line with gradient
            const gradient = ctx.createLinearGradient(coinScreenX, coinScreenY, aimX, aimY);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, lineColor);
            
            ctx.beginPath();
            ctx.moveTo(coinScreenX, coinScreenY);
            ctx.lineTo(aimX, aimY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Draw dashed line for trajectory preview
            ctx.setLineDash([10, 10]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(coinScreenX, coinScreenY);
            ctx.lineTo(aimX, aimY);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw arrow head
            const angle = Math.atan2(dy, dx);
            const arrowLength = 15;
            const arrowWidth = 10;
            
            ctx.beginPath();
            ctx.moveTo(aimX, aimY);
            ctx.lineTo(
                aimX - arrowLength * Math.cos(angle - Math.PI / 6),
                aimY - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                aimX - arrowLength * Math.cos(angle + Math.PI / 6),
                aimY - arrowLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = lineColor;
            ctx.fill();
            
            // Draw power indicator circle at aim point
            ctx.beginPath();
            ctx.arc(aimX, aimY, 8, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw power percentage text
            const powerPercent = Math.round(power * 100);
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textX = coinScreenX + dx * 0.5;
            const textY = coinScreenY + dy * 0.5 - 15;
            ctx.strokeText(`${powerPercent}%`, textX, textY);
            ctx.fillText(`${powerPercent}%`, textX, textY);
            
            ctx.restore();
        },

        resizeCanvas() {
            const rect = container.getBoundingClientRect();
            const w = rect.width;
            const h = w * (this.LOGICAL_HEIGHT / this.LOGICAL_WIDTH);
            canvas.width = w;
            canvas.height = h;
            this.draw();
            this.resizeFireworksCanvas(); // Ensure fireworks canvas is also resized
        },

        resizeFireworksCanvas() {
            if (this.fireworksCanvas) {
                const rect = container.getBoundingClientRect();
                this.fireworksCanvas.width = rect.width;
                this.fireworksCanvas.height = rect.height;
            }
        },

        // --- Fireworks Logic ---
        fireworks: [],
        fireworksAnimationFrameId: null,
        fireworksHue: 0, // New property for hue

        startFireworks() {
            if (!this.fireworksCanvas || !this.fireworksCtx) {
                return;
            }
            this.fireworks = [];
            this.fireworksHue = 0; // Initialize the property

            const createParticle = (x, y, hue) => {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 10 + 5;
                return {
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    decay: Math.random() * 0.03 + 0.015,
                    color: `hsl(${hue}, 100%, 50%)`
                };
            };

            const launchFirework = () => {
                const x = Math.random() * this.fireworksCanvas.width;
                const y = this.fireworksCanvas.height; // Launch from bottom
                const initialVx = (Math.random() - 0.5) * 10;
                const initialVy = -(Math.random() * 15 + 20); // Go upwards
                const fireworkHue = this.fireworksHue;
                this.fireworksHue = (this.fireworksHue + 10) % 360;

                let rocket = {
                    x: x,
                    y: y,
                    vx: initialVx,
                    vy: initialVy,
                    alpha: 1,
                    color: `hsl(${fireworkHue}, 100%, 50%)`,
                    life: 60, // frames
                    exploded: false,
                    explosionParticles: []
                };
                this.fireworks.push(rocket);
            };

            launchFirework(); // Launch first firework immediately

            const animateFireworks = () => {
                this.fireworksAnimationFrameId = requestAnimationFrame(animateFireworks);
                this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);

                for (let i = this.fireworks.length - 1; i >= 0; i--) {
                    const p = this.fireworks[i];

                    if (!p.exploded) {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.5; // Gravity
                        p.alpha -= 0.01;

                        if (p.vy >= 0 || p.alpha <= 0.1 || p.life <= 0) { // Explode when starts falling or fades
                            p.exploded = true;
                            for (let j = 0; j < 50; j++) { // Create explosion particles
                                p.explosionParticles.push(createParticle(p.x, p.y, this.fireworksHue));
                            }
                        }
                    } else {
                        for (let j = p.explosionParticles.length - 1; j >= 0; j--) {
                            const ep = p.explosionParticles[j];
                            ep.x += ep.vx;
                            ep.y += ep.vy;
                            ep.vy += 0.2; // Gravity for explosion particles
                            ep.alpha -= ep.decay;

                            if (ep.alpha <= ep.decay) {
                                p.explosionParticles.splice(j, 1);
                            }
                        }
                    }

                    if (p.exploded && p.explosionParticles.length === 0) {
                        this.fireworks.splice(i, 1);
                    }

                    // Draw
                    this.fireworksCtx.save();
                    this.fireworksCtx.globalAlpha = p.alpha;
                    this.fireworksCtx.fillStyle = p.color;
                    this.fireworksCtx.beginPath();
                    this.fireworksCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    this.fireworksCtx.fill();
                    this.fireworksCtx.restore();

                    if (p.exploded) {
                        for (const ep of p.explosionParticles) {
                            this.fireworksCtx.save();
                            this.fireworksCtx.globalAlpha = ep.alpha;
                            this.fireworksCtx.fillStyle = ep.color;
                            this.fireworksCtx.beginPath();
                            this.fireworksCtx.arc(ep.x, ep.y, 2, 0, Math.PI * 2);
                            this.fireworksCtx.fill();
                            this.fireworksCtx.restore();
                        }
                    }
                }

                // Launch new firework periodically
                if (Math.random() < 0.05) { // Adjust frequency
                    launchFirework();
                }
            };

            if (this.fireworksAnimationFrameId) cancelAnimationFrame(this.fireworksAnimationFrameId);
            this.fireworksAnimationFrameId = requestAnimationFrame(animateFireworks);
        },

        stopFireworks() {
            if (this.fireworksAnimationFrameId) {
                cancelAnimationFrame(this.fireworksAnimationFrameId);
                this.fireworksAnimationFrameId = null;
            }
            if (this.fireworksCtx) {
                this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
            }
            this.fireworks = [];
        },
        getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            const clientX = evt.clientX || (evt.touches && evt.touches[0].clientX);
            const clientY = evt.clientY || (evt.touches && evt.touches[0].clientY);
            return { x: clientX - rect.left, y: clientY - rect.top };
        },

        handleStart(evt) {
            if (this.gameState !== 'playing') return;
            if (this.physicsTimer) return;
            
            const myTurn = this.players[this.currentPlayerIndex]?.uid === auth.currentUser.uid;
            if (!myTurn) return;
            const pos = this.getMousePos(evt);
            const w = canvas.width;
            const screenRadius = (this.COIN_DIAMETER_RATIO / 2) * w;
            for (const coin of this.coins) {
                const coinScreenX = coin.x * w;
                const coinScreenY = coin.y * w;
                const dx = coinScreenX - pos.x;
                const dy = coinScreenY - pos.y;
                if (Math.sqrt(dx * dx + dy * dy) < screenRadius) {
                    if (coin.id === this.lastMovedCoinId) {
                        const container = document.getElementById('game-container');
                        if (!container) return;
                        
                        const tempOverlay = document.createElement('div');
                        tempOverlay.textContent = 'Aynı parayla üst üste oynayamazsın!';
                        tempOverlay.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-800/90 text-white p-4 rounded-lg text-2xl z-50 pointer-events-none';
                        container.appendChild(tempOverlay);
                        setTimeout(() => tempOverlay.remove(), 1500);
                        
                        return;
                    }
                    this.selectedCoin = coin;
                    this.isDragging = true;
                    this.dragStart = pos;
                    this.dragEnd = pos;
                    
                    // Vibrate when coin is selected
                    if (navigator.vibrate) {
                        navigator.vibrate(10); // Very short tap feedback
                    }
                    
                    evt.preventDefault();
                    document.body.classList.add('scrolling-disabled');
                    break;
                }
            }
        },

        handleMove(evt) {
            if (!this.isDragging) return;
            evt.preventDefault();
            this.dragEnd = this.getMousePos(evt);
            this.draw();
        },

        handleEnd(evt) {
            if (!this.isDragging || !this.selectedCoin) return;
            document.body.classList.remove('scrolling-disabled');
            this.isDragging = false;
            const flickVectorPix = { x: this.dragEnd.x - this.dragStart.x, y: this.dragEnd.y - this.dragStart.y };
            if(Math.sqrt(flickVectorPix.x**2 + flickVectorPix.y**2) < 10) { this.selectedCoin = null; this.draw(); return; }
            
            // Vibrate on flick
            if (navigator.vibrate) {
                const flickStrength = Math.sqrt(flickVectorPix.x**2 + flickVectorPix.y**2);
                const vibrationDuration = Math.min(Math.floor(flickStrength / 2), 50); // Max 50ms
                navigator.vibrate(vibrationDuration); // Haptic feedback based on flick strength
            }
            
            const logicalVx = -flickVectorPix.x / canvas.width * 0.125;
            const logicalVy = -flickVectorPix.y / canvas.width * 0.125;
            const flickData = { coinId: this.selectedCoin.id, vx: logicalVx, vy: logicalVy, madeBy: auth.currentUser.uid };
            
            // Practice mode: Run simulation locally
            if (window.practiceMode && window.practiceMode.active) {
                const currentState = {
                    players: this.players,
                    coins: this.coins,
                    currentPlayerIndex: this.currentPlayerIndex,
                    status: this.gameState,
                    lastMovedCoinId: this.lastMovedCoinId,
                    isPathFoulActive: this.isPathFoulActive,
                    collisionOccurredDuringSim: false,
                    hostUid: this.hostUid
                };
                
                // Store for later access (hoisting solution)
                window.practiceMode.pendingFlick = { flickData, currentState };
                
                // Dispatch custom event to trigger simulation (after runHostSimulation is defined)
                document.dispatchEvent(new CustomEvent('practiceFlickReady'));
            } else {
                database.ref(`games/${window.currentGameId}/activeFlick`).set(flickData);
            }
            
            this.selectedCoin = null;
            this.draw();
        },

        init() {
            this.ackButton = document.getElementById('ack-button');
            this.rematchButton = document.getElementById('rematch-button');
            this.waitingText = document.getElementById('waiting-text');
            
            // Bind event handlers to this instance for proper cleanup
            this.boundHandleStart = (e) => this.handleStart(e);
            this.boundHandleMove = (e) => this.handleMove(e);
            this.boundHandleEnd = (e) => this.handleEnd(e);
            this.boundResizeCanvas = () => this.resizeCanvas();
            this.boundAckClick = () => {
                const myTurnToAck = this.players[this.currentPlayerIndex]?.uid === auth.currentUser.uid;
                if (this.gameState === 'awaiting_ack' && myTurnToAck) {
                    // Practice mode: Local update
                    if (window.practiceMode && window.practiceMode.active) {
                        const currentState = {
                            players: this.players,
                            coins: this.coins,
                            currentPlayerIndex: this.currentPlayerIndex,
                            status: this.gameState,
                            lastMovedCoinId: this.lastMovedCoinId,
                            isPathFoulActive: this.isPathFoulActive,
                            collisionOccurredDuringSim: false,
                            hostUid: this.hostUid,
                            overlayMessage: this.overlayMessage
                        };
                        
                        // Store for later access (hoisting solution)
                        window.practiceMode.pendingAck = currentState;
                        
                        // Dispatch custom event
                        document.dispatchEvent(new CustomEvent('practiceAckReady'));
                        
                        this.ackButton.classList.add('hidden');
                        this.stopFireworks();
                    } else {
                        database.ref(`games/${window.currentGameId}/acknowledgedTurn`).set(auth.currentUser.uid);
                        // Overlay durumunu updateState() içindeki mantık yönetsin - elle gizleme
                        this.ackButton.classList.add('hidden');
                        this.stopFireworks(); // Stop fireworks when acknowledged
                    }
                }
            };
            
            this.fireworksCanvas = document.getElementById('fireworksCanvas');
            if (this.fireworksCanvas) {
                this.fireworksCtx = this.fireworksCanvas.getContext('2d');
            } else {
                
            }
            this.resizeCanvas();
            this.resizeFireworksCanvas(); // New function to resize fireworks canvas
            this.loadCoinImages(); // Load coin textures
            const woodTexture = new Image();
            woodTexture.src = 'https://www.transparenttextures.com/patterns/wood-pattern.png';
            woodTexture.onload = () => { this.woodPattern = ctx.createPattern(woodTexture, 'repeat'); this.draw(); };
            
            // Add event listeners with bound handlers
            canvas.addEventListener('mousedown', this.boundHandleStart);
            canvas.addEventListener('mousemove', this.boundHandleMove);
            canvas.addEventListener('mouseup', this.boundHandleEnd);
            canvas.addEventListener('mouseleave', this.boundHandleEnd);
            canvas.addEventListener('touchstart', this.boundHandleStart, { passive: false });
            canvas.addEventListener('touchmove', this.boundHandleMove, { passive: false });
            canvas.addEventListener('touchend', this.boundHandleEnd);
            window.addEventListener('resize', this.boundResizeCanvas);

            if (this.ackButton) {
                this.ackButton.addEventListener('click', this.boundAckClick);
            }

            // Initialize rematch button state
            if (this.rematchButton) {
                this.resetRematchButton();
            }
        },

        resetRematchButton() {
            if (!this.rematchButton) return;
            
            this.rematchButton.innerHTML = `
                <span class="flex items-center gap-3 text-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Hazırım! 🎮
                </span>
            `;
            this.rematchButton.classList.remove('from-blue-500', 'to-blue-600', 'cursor-not-allowed');
            this.rematchButton.classList.add('animate-pulse', 'from-green-500', 'to-emerald-600', 'hover:from-green-600', 'hover:to-emerald-700', 'hover:scale-110');
            this.rematchButton.disabled = false;
        },

        cleanup() {
            // Note: Canvas event listeners are kept active since gameManager is a singleton
            // Only cleanup animations and temporary listeners
            
            // Stop any running animations
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            
            // Stop fireworks
            this.stopFireworks();
            
            // Reset game state
            this.isDragging = false;
            this.selectedCoin = null;
        }
    };
    window.gameManager.init();
});


// =================================================================================
// OTURUM VE LOBİ YÖNETİCİSİ
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Fail-safe: if environment checks flagged an error, skip init
    if (window.SKIP_APP_INIT) {
        return;
    }

    // Defensive checks for Firebase presence to avoid runtime crashes when CDN blocked
    if (typeof window.firebase === 'undefined' || typeof auth === 'undefined' || typeof database === 'undefined') {
        try {
            const banner = document.getElementById('fatal-error-banner');
            if (!banner) {
                const el = document.createElement('div');
                el.id = 'fatal-error-banner';
                el.style.position = 'fixed';
                el.style.inset = '0';
                el.style.background = 'rgba(127,29,29,0.96)';
                el.style.color = 'white';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.zIndex = '9999';
                el.style.padding = '24px';
                el.innerHTML = '<div style="max-width:700px;text-align:center;font-family:system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial;">\
                    <h2 style="font-size:26px;margin-bottom:10px;">Bağlantı Sorunu</h2>\
                    <p style="font-size:15px;line-height:1.6;margin-bottom:12px;">Firebase SDK veya yapılandırması yüklenemedi. İnternet/kurumsal ağ engellerini kontrol edin. Gerekirse yerel sunucu ile çalıştırın.</p>\
                    <code style="background:rgba(255,255,255,0.1);padding:6px 10px;border-radius:6px;display:inline-block;">Failed to load Firebase SDK (ERR_EMPTY_RESPONSE?)</code>\
                </div>';
                document.body.appendChild(el);
            }
        } catch (_) {}
        console.error('Firebase not available. Aborting app bootstrap.');
        return;
    }

    const authScreen = document.getElementById('auth-screen');
    if (!authScreen) return;

    window.currentGameId = null;
    let gameListener = null, gameStateListener = null, activeFlickListener = null, ackListener = null, gameStatusListener = null, chatListener = null, rematchListener = null;

    // Chat notification system
    let unreadMessageCount = 0;
    let isChatVisible = false;
    let chatNotificationSound = null;
    
    // Initialize chat notification sound
    const initChatNotificationSound = () => {
        if (!chatNotificationSound) {
            chatNotificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKvl8bllHQU3k9nzzn0vBSl+zPLaizsKElyx6OyrWBYKQ5zd8sFuJAUqgM7y2Ik2CBxqu/DjnE4NEFWs5/K3ZB4EOpXb88yAMQUng8/y2Ys5ChJctOrtrVkXCkGb3PLCcCUFK4DN8tiKNQgbarvw45xPDBBUq+fyt2QeBTuU2/POgDEFJ4PP8tyLOQoTXLPq7axZGApCnNzywnAmBSuAzvLYijUIHGq68OOcTwwQVKzn8rdkHwU7lNvzzn8xBSiEz/LcizsKElyx6u2sWRgLQpvb88JwJgUrgc7y2Yo2CBxquvDjnE4MEFSr5/G4ZR4FPJXZ886BMQUohM/y3Is7ChJctOrtq1kXC0Ka3PLCbyYFK4HO8tmJNggbarvw4pxOCxFVrOjxtmQeBD2V2fPOgDAFKYTP8tyLOQoSXLPq7axYGApDnN3yw28mBSt/zvHYijUIHGm68OKcTQwRVavk8LZkHgQ9lNnzznwwBSmFz/LaizoKElux6OyrWBgKQ5va88NwJwUrfszx2IszCBxouO/hmk0MEFWq5PC2Yx4EPZTa886AMgUphc/y2os6ChBbsOjsqVcXCkKZ2/LBbyYFK3/N8dmJNwgcaLrv4ZpMDRBWrOTwtmQeBDyS2/LNfzEFKIXP8tqLOwoSXLDp7alXFgtDmtvywW8lBSuAzfHYiTcJGmm77+GaTQ0PVqzk8LVkHgQ8lNvzzX8yBSeEz/Laizr7xo+N'); 
        }
    };

    // Game statistics and timers
    window.gameStats = {
        started: false,
        gameStartTime: null,
        currentTurnStartTime: null,
        playerTurnTimes: {}, // { uid: totalMs }
        currentTurnUid: null,
        timerInterval: null,
        statsUpdated: {} // { gameCode: true } - prevent double updates
    };

    const screens = { 
        auth: authScreen, 
        profile: document.getElementById('profile-screen'),
        mainMenu: document.getElementById('main-menu-screen'), 
        lobby: document.getElementById('lobby-screen'), 
        game: document.getElementById('main-game-screen') 
    };
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const userWelcome = document.getElementById('user-welcome');
    const logoutButton = document.getElementById('logout-button');
    const practiceModeButton = document.getElementById('practice-mode-button');
    const practiceMenuButton = document.getElementById('practice-menu-button');
    const createGameButton = document.getElementById('create-game-button');
    const joinGameInput = document.getElementById('join-game-input');
    const joinGameButton = document.getElementById('join-game-button');
    const profileSettingsButton = document.getElementById('profile-settings-button');
    const lobbyGameCode = document.getElementById('lobby-game-code');
    const lobbyPlayerList = document.getElementById('lobby-player-list');
    const leaveLobbyButton = document.getElementById('leave-lobby-button');
    const readyButton = document.getElementById('ready-button');
    const startGameFromLobbyButton = document.getElementById('start-game-from-lobby-button');

    // Chat elements
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatBox = document.getElementById('chat-box');

    // Profile form elements
    const profileForm = document.getElementById('profile-form');
    const profileFirstname = document.getElementById('profile-firstname');
    const profileLastname = document.getElementById('profile-lastname');
    const profileNickname = document.getElementById('profile-nickname');
    const profilePhone = document.getElementById('profile-phone');
    const profileEmailDisplay = document.getElementById('profile-email-display');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const newPasswordConfirm = document.getElementById('new-password-confirm');
    const displayRealname = document.getElementById('display-realname');
    const displayNickname = document.getElementById('display-nickname');
    const profileError = document.getElementById('profile-error');
    const profileSuccess = document.getElementById('profile-success');

    const showScreen = (screenId) => Object.keys(screens).forEach(key => screens[key] && screens[key].classList.toggle('hidden', key !== screenId));
    const generateGameCode = (length = 5) => Array.from({ length }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))).join('');
    const setButtonLoading = (button, isLoading) => { 
        if (!button) return; 
        const spinner = button.querySelector('.spinner'); 
        const text = button.querySelector('.button-text'); 
        if (isLoading) { 
            button.disabled = true; 
            if (spinner) spinner.classList.remove('hidden'); 
            if (text) text.style.visibility = 'hidden'; 
        } else { 
            button.disabled = false; 
            if (spinner) spinner.classList.add('hidden'); 
            if (text) text.style.visibility = 'visible'; 
        } 
    };
    const setFormError = (errorElement, message) => { 
        if (errorElement) { 
            // Check if error element has the new structure (with icon)
            const textSpan = errorElement.querySelector('span.flex-1');
            if (textSpan) {
                textSpan.textContent = message;
            } else {
                errorElement.textContent = message;
            }
            errorElement.classList.toggle('hidden', !message); 
        } 
    };
    
    // User-friendly error messages
    const getAuthErrorMessage = (errorCode, errorMessage = '') => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Geçersiz email adresi formatı.';
            case 'auth/user-disabled':
                return 'Bu hesap devre dışı bırakılmış.';
            case 'auth/email-already-in-use':
                return 'Bu email adresi zaten kullanımda.';
            case 'auth/weak-password':
                return 'Şifre çok zayıf. En az 6 karakter olmalıdır.';
            case 'auth/network-request-failed':
                return 'İnternet bağlantınızı kontrol edin.';
            case 'auth/too-many-requests':
                return 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
            case 'auth/operation-not-allowed':
                return 'Email/şifre girişi etkinleştirilmemiş. Firebase Console\'dan etkinleştirin.';
            case 'auth/requires-recent-login':
                return 'Bu işlem için tekrar giriş yapmanız gerekiyor.';
            case 'auth/missing-password':
                return 'Lütfen şifrenizi girin.';
            case 'auth/missing-email':
                return 'Lütfen email adresinizi girin.';
            case 'auth/invalid-api-key':
                return 'Firebase API anahtarı geçersiz. Yapılandırmayı kontrol edin.';
            case 'auth/app-deleted':
                return 'Firebase uygulaması bulunamadı.';
            // Giriş hataları - genel mesaj (güvenlik nedeniyle spesifik bilgi verilmiyor)
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
            case 'auth/invalid-login-credentials':
            case 'auth/internal-error':
                return 'Email adresinizi veya şifrenizi kontrol edin.';
            default:
                console.error('Unhandled auth error:', errorCode, errorMessage);
                return 'Giriş yapılamadı. Bilgilerinizi kontrol edip tekrar deneyin.';
        }
    };

    // Admin-only: Cleanup stale game rooms
    const cleanupStaleGames = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        // Check if user is admin
        const userRef = database.ref(`users/${currentUser.uid}/isAdmin`);
        const isAdminSnapshot = await userRef.once('value');
        const isAdmin = isAdminSnapshot.val();
        
        if (!isAdmin) {
            return; // Only admins can cleanup
        }
        
        const gamesRef = database.ref('games');
        const snapshot = await gamesRef.limitToLast(200).once('value');
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
        
        // Collect all delete promises
        const deletePromises = [];
        snapshot.forEach(gameSnapshot => {
            const game = gameSnapshot.val();
            if (!game) return;
            
            const gameIsEmpty = !game.players || Object.keys(game.players).length === 0;
            if (gameIsEmpty) {
                const isOld = game.createdAt && game.createdAt < twoHoursAgo;
                if (game.status === 'lobby' || isOld) {
                    deletePromises.push(gameSnapshot.ref.remove());
                }
            }
        });
        
        // Wait for all deletions to complete
        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
        }
    };

    // Player presence tracking to handle disconnections
    let presenceListeners = {};
    let presenceInitialized = {};
    
    const trackPlayerPresence = (gameCode) => {
        const gameRef = database.ref(`games/${gameCode}`);
        
        // First get the current game state
        gameRef.once('value', snapshot => {
            const game = snapshot.val();
            if (!game || !game.players) return;
            
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            
            
            
            
            // First, set own presence
            const ownPresenceRef = database.ref(`games/${gameCode}/presence/${currentUser.uid}`);
            ownPresenceRef.set(true);
            ownPresenceRef.onDisconnect().remove();
            
            
            // Set up presence tracking for each player
            Object.keys(game.players).forEach(uid => {
                if (presenceListeners[uid]) {
                    
                    return; // Already tracking
                }
                
                const presenceRef = database.ref(`games/${gameCode}/presence/${uid}`);
                
                // Read initial presence state before setting up listener
                presenceRef.once('value', initialSnapshot => {
                    const initialPresence = initialSnapshot.val();
                    
                    // Mark as initialized if presence already exists or it's own UID
                    if (initialPresence === true || uid === currentUser.uid) {
                        presenceInitialized[uid] = true;
                        
                    } else {
                        presenceInitialized[uid] = false;
                        
                    }
                    
                    // Now set up the listener
                    presenceListeners[uid] = presenceRef.on('value', snapshot => {
                        const isOnline = snapshot.val();
                        
                        // If presence becomes true, mark as initialized
                        if (isOnline === true && !presenceInitialized[uid]) {
                            presenceInitialized[uid] = true;
                            
                            return;
                        }
                        
                        // Only trigger disconnect if:
                        // 1. Presence was previously initialized (not first time seeing null)
                        // 2. Value is now null (player disconnected)
                        // 3. This is not our own UID (we handle our own disconnect elsewhere)
                        if (presenceInitialized[uid] && isOnline === null && uid !== currentUser.uid) {
                            
                            handlePlayerDisconnect(gameCode, uid);
                        }
                    });
                });
            });
            
            // After 10 seconds, mark all remaining uninitialized presences as initialized
            // This handles cases where a player never set their presence
            setTimeout(() => {
                Object.keys(presenceInitialized).forEach(uid => {
                    if (!presenceInitialized[uid]) {
                        
                        presenceInitialized[uid] = true;
                    }
                });
            }, 10000);
        });
    };
    
    const handlePlayerDisconnect = (gameCode, disconnectedUid) => {
        const gameRef = database.ref(`games/${gameCode}`);
        
        gameRef.once('value', snapshot => {
            const game = snapshot.val();
            if (!game) {
                
                return;
            }
            
            const currentUser = auth.currentUser;
            if (!currentUser) {
                
                return;
            }
            
            // Don't handle if current user is the one who disconnected
            if (disconnectedUid === currentUser.uid) {
                
                return;
            }
            
            // Only handle disconnection if game is in progress or waiting
            if (game.status !== 'in-progress' && game.status !== 'waiting') {
                
                return;
            }
            
            // Find the disconnected player's name
            let disconnectedPlayerName = 'Rakip';
            if (game.gameState && game.gameState.players) {
                const player = game.gameState.players.find(p => p.uid === disconnectedUid);
                if (player) disconnectedPlayerName = player.name;
            } else if (game.players && game.players[disconnectedUid]) {
                disconnectedPlayerName = game.players[disconnectedUid].displayName || 'Rakip';
            }
            
            
            
            // End the game for all players
            gameRef.update({
                status: 'ended',
                endReason: 'player_disconnected',
                disconnectedPlayer: disconnectedUid
            }).then(() => {
                // Clean up listeners
                cleanupPresenceListeners();
                
                // Show message and return to main menu
                if (window.gameManager) {
                    window.gameManager.showOverlay(
                        `❌ Oyuncu Ayrıldı<br><br>${disconnectedPlayerName} oyundan ayrıldı.<br>Oyun sonlandırıldı.`,
                        'info',
                        false,
                        false
                    );
                }
                
                // Delete the game room after a delay
                setTimeout(() => {
                    deleteGameRoom(gameCode, 'player_disconnected');
                }, 2000);
                
                // Return to main menu after 3 seconds
                setTimeout(() => {
                    handleReturnToMainMenu();
                }, 3000);
            });
        });
    };
    
    const deleteGameRoom = (gameCode, reason = 'manual') => {
        const gameRef = database.ref(`games/${gameCode}`);
        
        gameRef.remove()
            .then(() => {
                
            })
            .catch(error => {
                console.error('❌ Error deleting game room:', error);
            });
    };
    
    const cleanupPresenceListeners = () => {
        if (!window.currentGameId) return;
        
        
        
        Object.keys(presenceListeners).forEach(uid => {
            const presenceRef = database.ref(`games/${window.currentGameId}/presence/${uid}`);
            if (presenceListeners[uid]) {
                presenceRef.off('value', presenceListeners[uid]);
            }
        });
        presenceListeners = {};
        presenceInitialized = {};
    };
    
    const handleReturnToMainMenu = () => {
        // Clean up all listeners
        cleanupPresenceListeners();
        cleanupChatListener();
        
        // Stop and reset game timers
        stopGameTimers();
        resetGameTimers();
        
        if (gameListener) {
            const gameRef = database.ref(`games/${window.currentGameId}`);
            gameRef.off('value', gameListener);
            gameListener = null;
        }
        
        if (gameStateListener) {
            const gameStateRef = database.ref(`games/${window.currentGameId}/gameState`);
            gameStateRef.off('value', gameStateListener);
            gameStateListener = null;
        }
        
        if (gameStatusListener) {
            const gameRef = database.ref(`games/${window.currentGameId}`);
            gameRef.child('status').off('value', gameStatusListener);
            gameStatusListener = null;
        }
        
        if (activeFlickListener) {
            const flickRef = database.ref(`games/${window.currentGameId}/activeFlick`);
            flickRef.off('value', activeFlickListener);
            activeFlickListener = null;
        }
        
        if (ackListener) {
            const ackRef = database.ref(`games/${window.currentGameId}/acknowledgedTurn`);
            ackRef.off('value', ackListener);
            ackListener = null;
        }
        
        // Stop any running physics
        if (window.gameManager) {
            if (window.gameManager.physicsTimer) {
                clearInterval(window.gameManager.physicsTimer);
                window.gameManager.physicsTimer = null;
            }
            if (window.gameManager.animationFrameId) {
                cancelAnimationFrame(window.gameManager.animationFrameId);
                window.gameManager.animationFrameId = null;
            }
            window.gameManager.stopFireworks();
            // Clean up event listeners to prevent memory leaks
            window.gameManager.cleanup();
        }
        
        // Delete the game room if returning from a game
        if (window.currentGameId) {
            const gameCode = window.currentGameId;
            const gameRef = database.ref(`games/${gameCode}`);
            
            // Check game status before deleting
            gameRef.once('value', snapshot => {
                const game = snapshot.val();
                if (game) {
                    // Delete if game is over or ended
                    if (game.status === 'gameOver' || game.status === 'ended') {
                        
                        deleteGameRoom(gameCode, 'game_completed');
                    }
                }
            });
        }
        
        window.currentGameId = null;
        showScreen('mainMenu');
    };

    // Chat functions
    const setupChatListener = (gameCode) => {
        const chatRef = database.ref(`games/${gameCode}/chat`);
        
        // Clear existing messages
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        // Remove old listener if exists
        if (chatListener) {
            chatRef.off('child_added', chatListener);
        }
        
        // Reset unread count when setting up chat
        unreadMessageCount = 0;
        updateChatNotificationBadge();
        
        // Listen for new messages
        let isFirstLoad = true;
        chatListener = chatRef.limitToLast(50).on('child_added', snapshot => {
            const message = snapshot.val();
            if (!message) return;
            
            displayChatMessage(message);
            
            // Don't notify for initial load or own messages
            const currentUser = auth.currentUser;
            const isOwnMessage = currentUser && message.uid === currentUser.uid;
            
            if (!isFirstLoad && !isOwnMessage) {
                showChatNotification();
            }
            
            isFirstLoad = false;
        });
        
        
    };
    
    const showChatNotification = () => {
        // Increment unread count
        unreadMessageCount++;
        updateChatNotificationBadge();
        
        // Play notification sound
        initChatNotificationSound();
        if (chatNotificationSound) {
            chatNotificationSound.volume = 0.3;
            chatNotificationSound.play().catch(() => {}); // Ignore errors if autoplay blocked
        }
        
        // Vibrate phone (if supported)
        // Pattern: [vibrate, pause, vibrate] in milliseconds
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]); // Two short pulses
        }
        
        // Add shake animation to chat box
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.classList.add('animate-shake');
            setTimeout(() => {
                chatBox.classList.remove('animate-shake');
            }, 500);
        }
    };
    
    const updateChatNotificationBadge = () => {
        const badge = document.getElementById('chat-notification-badge');
        if (!badge) return;
        
        if (unreadMessageCount > 0) {
            badge.textContent = unreadMessageCount > 99 ? '99+' : unreadMessageCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    };
    
    const clearChatNotifications = () => {
        unreadMessageCount = 0;
        updateChatNotificationBadge();
    };
    
    const displayChatMessage = (message) => {
        if (!chatMessages) return;
        
        const currentUser = auth.currentUser;
        const isOwnMessage = currentUser && message.uid === currentUser.uid;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`;
        
        const time = new Date(message.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="max-w-[80%] ${isOwnMessage ? 'bg-amber-600' : 'bg-slate-700'} rounded-lg px-3 py-2">
                <div class="flex items-baseline gap-2 mb-1">
                    <span class="font-semibold text-sm ${isOwnMessage ? 'text-white' : 'text-amber-300'}">${message.senderName}</span>
                    <span class="text-xs opacity-70">${time}</span>
                </div>
                <p class="text-sm text-white break-words">${escapeHtml(message.text)}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    const sendChatMessage = async (text) => {
        if (!window.currentGameId || !text.trim()) return;
        
        const user = auth.currentUser;
        if (!user) return;
        
        const displayName = await getUserDisplayName(user);
        
        const message = {
            uid: user.uid,
            senderName: displayName,
            text: text.trim(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        const chatRef = database.ref(`games/${window.currentGameId}/chat`);
        await chatRef.push(message);
        
        
    };
    
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    };
    
    const cleanupChatListener = () => {
        if (!window.currentGameId) return;
        
        if (chatListener) {
            const chatRef = database.ref(`games/${window.currentGameId}/chat`);
            chatRef.off('child_added', chatListener);
            chatListener = null;
            
        }
        
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        // Clear chat notifications
        clearChatNotifications();
    };

    // ==============================================
    // GAME STATISTICS & TIMER FUNCTIONS
    // ==============================================
    // Note: formatTime and formatShortTime are defined at the top of the file
    
    const startGameTimers = (players, currentPlayerIndex = 0) => {
        if (!window.gameStats) return;
        
        // If already started, reset first (for rematch scenario)
        if (window.gameStats.started) {
            
            resetGameTimers();
        }
        
        window.gameStats.started = true;
        window.gameStats.gameStartTime = Date.now();
        window.gameStats.playerTurnTimes = {};
        
        // Initialize turn times for all players
        if (players) {
            players.forEach(p => {
                window.gameStats.playerTurnTimes[p.uid] = 0;
            });
            
            // Start the timer for the first/current player
            if (players[currentPlayerIndex]) {
                window.gameStats.currentTurnUid = players[currentPlayerIndex].uid;
                window.gameStats.currentTurnStartTime = Date.now();
            }
        }
        
        // Start timer interval for UI updates
        if (window.gameStats.timerInterval) {
            clearInterval(window.gameStats.timerInterval);
        }
        
        window.gameStats.timerInterval = setInterval(() => {
            updateGameTimerUI();
            // Also update scoreboard to show live player turn times
            if (window.gameManager && window.gameManager.updateScoreboard) {
                window.gameManager.updateScoreboard();
            }
        }, 1000);
        
        
    };
    
    const stopGameTimers = () => {
        if (!window.gameStats) return;
        
        // Finalize current turn time
        if (window.gameStats.currentTurnUid && window.gameStats.currentTurnStartTime) {
            const elapsed = Date.now() - window.gameStats.currentTurnStartTime;
            window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] = 
                (window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] || 0) + elapsed;
        }
        
        if (window.gameStats.timerInterval) {
            clearInterval(window.gameStats.timerInterval);
            window.gameStats.timerInterval = null;
        }
        
        
    };
    
    const resetGameTimers = () => {
        stopGameTimers();
        if (!window.gameStats) return;
        
        window.gameStats.started = false;
        window.gameStats.gameStartTime = null;
        window.gameStats.currentTurnStartTime = null;
        window.gameStats.playerTurnTimes = {};
        window.gameStats.currentTurnUid = null;
        
        // Clear UI
        const timerEl = document.getElementById('game-timer');
        if (timerEl) timerEl.textContent = '00:00:00';
        
        
    };
    
    const updateGameTimerUI = () => {
        const timerEl = document.getElementById('game-timer');
        if (!timerEl || !window.gameStats || !window.gameStats.gameStartTime) return;
        
        const elapsed = Date.now() - window.gameStats.gameStartTime;
        timerEl.textContent = formatTime(elapsed);
    };
    
    // Make updateGameTimerUI globally accessible
    window.updateGameTimerUI = updateGameTimerUI;
    
    const trackTurnChange = (state) => {
        if (!window.gameStats || !window.gameStats.started || !state) return;
        
        const newTurnUid = state.players && state.players[state.currentPlayerIndex] 
            ? state.players[state.currentPlayerIndex].uid 
            : null;
        
        if (!newTurnUid) return;
        
        // If this is the first turn (no current turn set), just start the timer
        if (!window.gameStats.currentTurnUid) {
            window.gameStats.currentTurnUid = newTurnUid;
            window.gameStats.currentTurnStartTime = Date.now();
            return;
        }
        
        // If same player, nothing to do (timer already running)
        if (newTurnUid === window.gameStats.currentTurnUid) {
            return;
        }
        
        // Turn changed, accumulate previous player's time
        if (window.gameStats.currentTurnStartTime) {
            const elapsed = Date.now() - window.gameStats.currentTurnStartTime;
            window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] = 
                (window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] || 0) + elapsed;
        }
        
        // Start new turn timer
        window.gameStats.currentTurnUid = newTurnUid;
        window.gameStats.currentTurnStartTime = Date.now();
    };
    
    const updatePlayerStats = async (gameCode, gameState) => {
        if (!auth.currentUser || !gameState) return;
        if (window.gameStats.statsUpdated[gameCode]) return; // Prevent double update
        
        // Practice mode: Don't save stats to Firebase
        if (window.practiceMode && window.practiceMode.active) {
            return;
        }
        
        window.gameStats.statsUpdated[gameCode] = true;
        
        // Stop timers and save final times
        stopGameTimers();
        
        const myUid = auth.currentUser.uid;
        const players = gameState.players || [];
        
        // Calculate total game time
        const totalGameTime = window.gameStats.gameStartTime 
            ? Date.now() - window.gameStats.gameStartTime 
            : 0;
        
        // Get my turn time
        const myTurnTime = window.gameStats.playerTurnTimes[myUid] || 0;
        
        // Determine winner(s) and calculate points
        const maxScore = Math.max(...players.map(p => p.score || 0));
        const winners = players.filter(p => (p.score || 0) === maxScore);
        
        let myPoints = 0;
        const iWon = winners.find(w => w.uid === myUid);
        
        if (iWon) {
            myPoints = winners.length === 1 ? 3 : 1; // 3 points for win, 1 for draw
        }
        
        
        // Update user stats in Firebase
        const statsRef = database.ref(`users/${myUid}/stats`);
        
        try {
            await statsRef.transaction(currentStats => {
                const stats = currentStats || {};
                
                stats.totalPoints = (stats.totalPoints || 0) + myPoints;
                stats.totalGameTime = (stats.totalGameTime || 0) + totalGameTime;
                stats.totalTurnTime = (stats.totalTurnTime || 0) + myTurnTime;
                stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
                
                if (myPoints === 3) {
                    stats.wins = (stats.wins || 0) + 1;
                } else if (myPoints === 1) {
                    stats.draws = (stats.draws || 0) + 1;
                }
                
                stats.lastUpdated = Date.now();
                
                return stats;
            });
            
            
            
            // Don't reset timers here - they should stay visible in game over screen
            // Timers will be reset when a new game starts
        } catch (error) {
            console.error('❌ Error updating player stats:', error);
        }
    };

    // Profile management functions
    const loadUserProfile = async (user) => {
        const profileRef = database.ref(`users/${user.uid}/profile`);
        const snapshot = await profileRef.once('value');
        return snapshot.val();
    };

    const saveUserProfile = async (user, profileData) => {
        const profileRef = database.ref(`users/${user.uid}/profile`);
        await profileRef.set(profileData);
    };

    const getUserDisplayName = async (user) => {
        const profile = await loadUserProfile(user);
        if (!profile) return user.email.split('@')[0];
        
        if (profile.displayPreference === 'realname' && profile.firstname && profile.lastname) {
            return `${profile.firstname} ${profile.lastname}`;
        } else if (profile.nickname) {
            return profile.nickname;
        }
        return user.email.split('@')[0];
    };

    const showProfileScreen = async (user) => {
        showScreen('profile');
        profileEmailDisplay.value = user.email;
        
        // Clear password fields
        currentPassword.value = '';
        newPassword.value = '';
        newPasswordConfirm.value = '';
        
        // Clear messages
        setFormError(profileError, '');
        setFormError(profileSuccess, '');
        
        // Load existing profile
        const profile = await loadUserProfile(user);
        if (profile) {
            profileFirstname.value = profile.firstname || '';
            profileLastname.value = profile.lastname || '';
            profileNickname.value = profile.nickname || '';
            profilePhone.value = profile.phone || '';
            
            if (profile.displayPreference === 'realname') {
                displayRealname.checked = true;
            } else {
                displayNickname.checked = true;
            }
        }
        
        // Load and display user stats
        try {
            const statsRef = database.ref(`users/${user.uid}/stats`);
            const statsSnapshot = await statsRef.once('value');
            const stats = statsSnapshot.val() || {};
            
            const pointsEl = document.getElementById('stat-total-points');
            const gameTimeEl = document.getElementById('stat-total-game-time');
            const turnTimeEl = document.getElementById('stat-total-turn-time');
            
            if (pointsEl) pointsEl.textContent = stats.totalPoints || 0;
            if (gameTimeEl) gameTimeEl.textContent = formatTime(stats.totalGameTime || 0);
            if (turnTimeEl) turnTimeEl.textContent = formatTime(stats.totalTurnTime || 0);
            
            
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    };

    // Change password function
    const changePassword = async (currentPwd, newPwd) => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error('Kullanıcı oturumu bulunamadı');
        }

        // Re-authenticate user with current password
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPwd);
        
        try {
            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPwd);
            return true;
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                throw new Error('Mevcut şifre yanlış');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Yeni şifre çok zayıf (en az 6 karakter)');
            }
            throw error;
        }
    };

    // Set up Firebase Auth Persistence - Always use LOCAL (keep logged in)
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    auth.onAuthStateChanged(async user => { 
        if (user) {
            // Check if user has profile
            const profile = await loadUserProfile(user);
            
            if (!profile || !profile.nickname) {
                // First time user or incomplete profile - show profile screen
                await showProfileScreen(user);
            } else {
                // Existing user with complete profile
                if (!window.currentGameId) showScreen('mainMenu');
                const displayName = await getUserDisplayName(user);
                userWelcome.textContent = `Hoş geldin, ${displayName}`;
                
                // Admin users can cleanup stale games after login
                setTimeout(cleanupStaleGames, 7000);
            }

        } else { 
            showScreen('auth');
            
            // Clean up game manager when user logs out
            if (window.gameManager) {
                window.gameManager.cleanup();
            }
            
            if (gameListener && window.currentGameId) database.ref(`games/${window.currentGameId}`).off('value', gameListener); 
            if (gameStateListener && window.currentGameId) database.ref(`games/${window.currentGameId}/gameState`).off('value', gameStateListener); 
            window.currentGameId = null; 
        } 
    });
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginForm.classList.add('hidden'); registerForm.classList.remove('hidden'); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerForm.classList.add('hidden'); loginForm.classList.remove('hidden'); });
    
    // Password validation functions
    const validatePassword = (password) => {
        return {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        };
    };
    
    const isPasswordValid = (requirements) => {
        return requirements.length && requirements.uppercase && requirements.lowercase && requirements.number;
    };
    
    const updatePasswordRequirements = (password) => {
        const requirements = validatePassword(password);
        const requirementsDiv = document.getElementById('password-requirements');
        
        // Show/hide requirements panel
        if (password.length > 0) {
            requirementsDiv.classList.remove('hidden');
        } else {
            requirementsDiv.classList.add('hidden');
            return;
        }
        
        // Update each requirement
        const updateRequirement = (id, isMet) => {
            const element = document.getElementById(id);
            const icon = element.querySelector('.requirement-icon');
            
            if (isMet) {
                element.classList.remove('text-slate-400');
                element.classList.add('text-green-400');
                icon.textContent = '✓';
                icon.classList.add('font-bold');
            } else {
                element.classList.remove('text-green-400');
                element.classList.add('text-slate-400');
                icon.textContent = '○';
                icon.classList.remove('font-bold');
            }
        };
        
        updateRequirement('req-length', requirements.length);
        updateRequirement('req-uppercase', requirements.uppercase);
        updateRequirement('req-lowercase', requirements.lowercase);
        updateRequirement('req-number', requirements.number);
    };
    
    // Password input event listener
    const registerPasswordInput = document.getElementById('register-password');
    if (registerPasswordInput) {
        registerPasswordInput.addEventListener('input', (e) => {
            updatePasswordRequirements(e.target.value);
        });
        
        registerPasswordInput.addEventListener('focus', () => {
            const requirementsDiv = document.getElementById('password-requirements');
            if (registerPasswordInput.value.length > 0) {
                requirementsDiv.classList.remove('hidden');
            }
        });
    }
    
    registerForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        const email = document.getElementById('register-email').value; 
        const password = document.getElementById('register-password').value; 
        const passwordConfirm = document.getElementById('register-password-confirm').value; 
        const button = registerForm.querySelector('button'); 
        setFormError(registerError, ''); 
        
        // Validate password requirements
        const requirements = validatePassword(password);
        if (!isPasswordValid(requirements)) {
            let missingReqs = [];
            if (!requirements.length) missingReqs.push('en az 6 karakter');
            if (!requirements.uppercase) missingReqs.push('büyük harf');
            if (!requirements.lowercase) missingReqs.push('küçük harf');
            if (!requirements.number) missingReqs.push('rakam');
            
            setFormError(registerError, `Şifre gereksinimleri karşılanmıyor: ${missingReqs.join(', ')}`);
            return;
        }
        
        if (password !== passwordConfirm) { 
            setFormError(registerError, 'Şifreler eşleşmiyor.'); 
            return; 
        } 
        setButtonLoading(button, true); 
        auth.createUserWithEmailAndPassword(email, password)
            .catch(error => {
                
                const errorMessage = getAuthErrorMessage(error.code, error.message);
                setFormError(registerError, errorMessage);
            })
            .finally(() => setButtonLoading(button, false)); 
    });
    
    loginForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        const email = document.getElementById('login-email').value; 
        const password = document.getElementById('login-password').value; 
        const button = loginForm.querySelector('button'); 
        setFormError(loginError, ''); 
        setButtonLoading(button, true); 
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            
            
            let errorMessage;
            
            // Giriş ile ilgili genel hatalar - güvenlik nedeniyle Firebase spesifik bilgi vermiyor
            if (error.code === 'auth/invalid-credential' || 
                error.code === 'auth/invalid-login-credentials' ||
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/internal-error') {
                
                errorMessage = 'Email adresinizi veya şifrenizi kontrol edin.';
                
            } else {
                // Diğer hatalar için standart mesajları kullan
                errorMessage = getAuthErrorMessage(error.code, error.message);
            }
            
            setFormError(loginError, errorMessage);
        } finally {
            setButtonLoading(button, false);
        }
    });
    
    // Profile form submit
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        setFormError(profileError, '');
        setFormError(profileSuccess, '');

        const nickname = profileNickname.value.trim();
        if (!nickname) {
            setFormError(profileError, 'Takma ad gereklidir.');
            return;
        }

        const profileData = {
            firstname: profileFirstname.value.trim(),
            lastname: profileLastname.value.trim(),
            nickname: nickname,
            phone: profilePhone.value.trim(),
            displayPreference: displayRealname.checked ? 'realname' : 'nickname',
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };

        try {
            // Save profile data
            await saveUserProfile(user, profileData);
            
            // Check if password change is requested
            const currentPwd = currentPassword.value.trim();
            const newPwd = newPassword.value.trim();
            const newPwdConfirm = newPasswordConfirm.value.trim();
            
            if (currentPwd || newPwd || newPwdConfirm) {
                // Password change requested
                if (!currentPwd) {
                    setFormError(profileError, 'Mevcut şifrenizi girmelisiniz.');
                    return;
                }
                if (!newPwd) {
                    setFormError(profileError, 'Yeni şifrenizi girmelisiniz.');
                    return;
                }
                if (newPwd !== newPwdConfirm) {
                    setFormError(profileError, 'Yeni şifreler eşleşmiyor.');
                    return;
                }
                
                // Validate new password requirements
                const requirements = validatePassword(newPwd);
                if (!isPasswordValid(requirements)) {
                    let missingReqs = [];
                    if (!requirements.length) missingReqs.push('en az 6 karakter');
                    if (!requirements.uppercase) missingReqs.push('büyük harf');
                    if (!requirements.lowercase) missingReqs.push('küçük harf');
                    if (!requirements.number) missingReqs.push('rakam');
                    
                    setFormError(profileError, `Yeni şifre gereksinimleri karşılanmıyor: ${missingReqs.join(', ')}`);
                    return;
                }
                
                try {
                    await changePassword(currentPwd, newPwd);
                    // Clear password fields
                    currentPassword.value = '';
                    newPassword.value = '';
                    newPasswordConfirm.value = '';
                    setFormError(profileSuccess, '✓ Profil ve şifre kaydedildi!');
                } catch (error) {
                    setFormError(profileError, error.message);
                    return;
                }
            } else {
                setFormError(profileSuccess, '✓ Profil kaydedildi!');
            }
            
            // Navigate to main menu
            setTimeout(async () => {
                showScreen('mainMenu');
                const displayName = await getUserDisplayName(user);
                userWelcome.textContent = `Hoş geldin, ${displayName}`;
            }, 1000);
        } catch (error) {
            setFormError(profileError, `Kayıt hatası: ${error.message}`);
        }
    });

    // Profile settings button
    profileSettingsButton.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (user) {
            await showProfileScreen(user);
        }
    });

    logoutButton.addEventListener('click', () => {
        // Clean up game manager before logout
        if (window.gameManager) {
            window.gameManager.cleanup();
        }
        auth.signOut();
    });

    const handlePracticeMode = async () => {
        const user = auth.currentUser;
        const displayName = await getUserDisplayName(user);
        
        // Set practice mode flag
        window.practiceMode = {
            active: true,
            goals: 0,
            fouls: 0,
            attempts: 0
        };
        
        // Hide chat box for practice mode
        if (chatBox) {
            chatBox.style.display = 'none';
        }
        
        // Force scoreboard rebuild for practice mode layout
        const playerListElement = document.getElementById('player-list');
        if (playerListElement) {
            playerListElement.removeAttribute('data-initialized');
            playerListElement.innerHTML = ''; // Temizle
        }
        
        // Create single player game state
        const practicePlayer = {
            uid: user.uid,
            name: displayName,
            score: 0,
            lives: 999, // Sınırsız can
            initialLives: 999,
            turnCount: 0
        };
        
        const LOGICAL_HEIGHT_RATIO = window.gameManager.LOGICAL_HEIGHT / window.gameManager.LOGICAL_WIDTH;
        const COIN_DIAMETER_RATIO = window.gameManager.COIN_DIAMETER_RATIO;
        const startY = LOGICAL_HEIGHT_RATIO - LOGICAL_HEIGHT_RATIO * 0.1;
        const coinRadius = COIN_DIAMETER_RATIO / 2;
        
        const initialCoins = [
            { id: 0, x: 0.5, y: startY, vx: 0, vy: 0, color: '#c0c0c0', highlight: '#f0f0f0' },
            { id: 1, x: 0.5 - (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#b87333', highlight: '#e69138' },
            { id: 2, x: 0.5 + (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#ffd700', highlight: '#fff200' }
        ];
        
        const initialGameState = {
            status: 'playing',
            players: [practicePlayer],
            coins: initialCoins,
            currentPlayerIndex: 0,
            lastMovedCoinId: null,
            isPathFoulActive: false,
            collisionOccurredDuringSim: false,
            hostUid: user.uid
        };
        
        // Show game screen
        showScreen('game');
        
        // Initialize game manager (sets up canvas, event listeners, etc.)
        if (!window.gameManager.ackButton) {
            window.gameManager.init();
        }
        
        // Set practice mode game state
        window.gameManager.updateState(initialGameState);
        window.gameManager.assignRandomCoinImages();
        window.gameManager.resizeCanvas();
        window.gameManager.draw();
        
        // Initialize timers
        resetGameTimers();
        startGameTimers(initialGameState.players, 0);
    };

    const handleCreateGame = async () => { 
        const gameCode = generateGameCode(); 
        const user = auth.currentUser; 
        const displayName = await getUserDisplayName(user);
        const gameRef = database.ref(`games/${gameCode}`); 
        const newGame = { 
            host: user.uid, 
            status: 'lobby', 
            createdAt: firebase.database.ServerValue.TIMESTAMP, 
            players: { 
                [user.uid]: { 
                    email: user.email, 
                    displayName: displayName,
                    ready: false 
                } 
            } 
        }; 
        gameRef.set(newGame).then(() => enterLobby(gameCode)); 
    };

    const handleJoinGame = async () => { 
        const gameCode = joinGameInput.value.toUpperCase(); 
        if (!gameCode) return; 
        const gameRef = database.ref(`games/${gameCode}`); 
        gameRef.once('value', async snapshot => { 
            if (snapshot.exists() && snapshot.val().status === 'lobby') { 
                const user = auth.currentUser; 
                const displayName = await getUserDisplayName(user);
                database.ref(`games/${gameCode}/players/${user.uid}`).set({ 
                    email: user.email, 
                    displayName: displayName,
                    ready: false 
                }).then(() => enterLobby(gameCode)); 
            } else { 
                alert("Oyun bulunamadı veya çoktan başlamış."); 
            } 
        }); 
    };
    
    const enterLobby = (gameCode) => {
        window.currentGameId = gameCode;
        showScreen('lobby');
        const gameRef = database.ref(`games/${window.currentGameId}`);
        if (gameListener) gameRef.off('value', gameListener);

        // Automatically remove player on disconnect to prevent stale players in lobbies.
        const user = auth.currentUser;
        if (user) {
            const playerRef = database.ref(`games/${gameCode}/players/${user.uid}`);
            playerRef.onDisconnect().remove();
        }

        gameListener = gameRef.on('value', snapshot => {
            const gameData = snapshot.val();
            if (!gameData) {
                handleLeaveLobby(true);
                return;
            }

            // Everyone listens to flicks (both host and clients run simulation)
            listenForFlicks(window.currentGameId);
            
            if (auth.currentUser.uid === gameData.host) {
                listenForAcks(window.currentGameId); // HOST ONLY: Listen for turn acknowledgments
            }

            if (gameData.status === 'in-progress' && gameData.gameState) {
                showScreen('game');
                setupChatListener(window.currentGameId);
                
                // Start presence tracking for all players
                trackPlayerPresence(window.currentGameId);
                
                if(window.gameManager) {
                    window.gameManager.resizeCanvas();
                    window.gameManager.updateState(gameData.gameState);
                }
                if (gameListener) gameRef.off('value', gameListener);
                listenToGameState(window.currentGameId);
                return;
            }
            updateLobbyUI(gameData);
        });
    };

    const updateLobbyUI = (gameData) => { 
        const user = auth.currentUser; 
        lobbyGameCode.textContent = window.currentGameId; 
        if (!lobbyPlayerList) return; 
        lobbyPlayerList.innerHTML = ''; 
        let allReady = true; 
        if (!gameData.players) return; 
        
        Object.entries(gameData.players).forEach(([uid, playerData]) => { 
            const isHost = (uid === gameData.host); 
            const isMe = (uid === user.uid); 
            const displayName = playerData.displayName || playerData.email.split('@')[0];
            
            lobbyPlayerList.innerHTML += `
                <div class="flex justify-between items-center p-2 rounded ${isMe ? 'bg-blue-900/50' : 'bg-slate-700/50'}">
                    <span>${displayName} ${isHost ? '👑' : ''}</span>
                    <span class="font-bold ${playerData.ready ? 'text-green-400' : 'text-yellow-400'}">
                        ${playerData.ready ? 'Hazır' : 'Bekleniyor'}
                    </span>
                </div>
            `; 
            if (!playerData.ready) allReady = false; 
        }); 
        
        if (user.uid === gameData.host && Object.keys(gameData.players).length > 0 && allReady) { 
            startGameFromLobbyButton.classList.remove('hidden'); 
        } else { 
            startGameFromLobbyButton.classList.add('hidden'); 
        } 
    };
    const handleReadyClick = () => { const user = auth.currentUser; const playerReadyRef = database.ref(`games/${window.currentGameId}/players/${user.uid}/ready`); playerReadyRef.once('value', snapshot => { playerReadyRef.set(!snapshot.val()); }); };
    
    const handleLeaveLobby = (hostLeft = false) => {
        if (window.currentGameId) {
            const currentGameCode = window.currentGameId;
            const isHost = !hostLeft; // If not forced by host, we are voluntarily leaving
            
            if (!hostLeft) {
                const playerRef = database.ref(`games/${currentGameCode}/players/${auth.currentUser.uid}`);
                playerRef.remove();
                
                // Check if we are the host and this is our own action
                const gameRef = database.ref(`games/${currentGameCode}`);
                gameRef.once('value', snapshot => {
                    const game = snapshot.val();
                    if (game && game.host === auth.currentUser.uid) {
                        // Host is leaving, delete the game room
                        
                        deleteGameRoom(currentGameCode, 'host_left_lobby');
                    } else if (game) {
                        // Check if there are no players left
                        const playersCount = game.players ? Object.keys(game.players).length : 0;
                        if (playersCount === 0) {
                            
                            deleteGameRoom(currentGameCode, 'all_players_left');
                        }
                    }
                });
            }
            
            if (gameListener) database.ref(`games/${currentGameCode}`).off('value', gameListener);
            if (gameStateListener) database.ref(`games/${currentGameCode}/gameState`).off('value', gameStateListener);
            if (gameStatusListener) database.ref(`games/${currentGameCode}`).child('status').off('value', gameStatusListener);
            if (activeFlickListener) database.ref(`games/${currentGameCode}/activeFlick`).off('value', activeFlickListener);
            if (ackListener) database.ref(`games/${currentGameCode}/acknowledgedTurn`).off('value', ackListener);
            
            // Clean up presence listeners
            cleanupPresenceListeners();
            
            // Clean up game manager event listeners
            if (window.gameManager) {
                window.gameManager.cleanup();
            }
        }
        window.currentGameId = null;
        showScreen('mainMenu');
        if(hostLeft) alert("Oyun kurucu tarafından kapatıldı.");
    };

    const handleStartGame = () => { 
        const gameRef = database.ref(`games/${window.currentGameId}`); 
        gameRef.once('value', snapshot => { 
            const gameData = snapshot.val(); 
            if (gameData.host !== auth.currentUser.uid) return; 
            showScreen('game'); 
            window.gameManager.resizeCanvas(); 
            const playerUIDs = Object.keys(gameData.players); 
            const hostIndex = playerUIDs.findIndex(uid => uid === gameData.host); 
            
            const initialPlayers = playerUIDs.map((uid, index) => ({ 
                uid: uid, 
                name: gameData.players[uid].displayName || gameData.players[uid].email.split('@')[0] || `Oyuncu ${index + 1}`, 
                score: 0, 
                lives: 3, 
                initialLives: 3, 
                turnCount: 0 
            })); 
            
            const LOGICAL_HEIGHT_RATIO = window.gameManager.LOGICAL_HEIGHT / window.gameManager.LOGICAL_WIDTH; 
            const COIN_DIAMETER_RATIO = window.gameManager.COIN_DIAMETER_RATIO; 
            const startY = LOGICAL_HEIGHT_RATIO - LOGICAL_HEIGHT_RATIO * 0.1; 
            const coinRadius = COIN_DIAMETER_RATIO / 2; 
            const initialCoins = [ 
                { id: 0, x: 0.5, y: startY, vx: 0, vy: 0, color: '#c0c0c0', highlight: '#f0f0f0' }, 
                { id: 1, x: 0.5 - (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#b87333', highlight: '#e69138' }, 
                { id: 2, x: 0.5 + (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#ffd700', highlight: '#fff200' } 
            ];
            
            const initialGameState = { 
                status: 'playing', 
                players: initialPlayers, 
                coins: initialCoins, 
                currentPlayerIndex: hostIndex >= 0 ? hostIndex : 0, 
                lastMovedCoinId: null, 
                isPathFoulActive: false, 
                collisionOccurredDuringSim: false, 
                hostUid: gameData.host 
            };
            
            gameRef.update({ status: 'in-progress', gameState: initialGameState }); 
            setupChatListener(window.currentGameId);
            
            // Assign random coin images for this game
            if (window.gameManager && window.gameManager.imagesLoaded) {
                window.gameManager.assignRandomCoinImages();
                window.gameManager.draw();
            }
            
            // Initialize game timers with the initial player index
            resetGameTimers();
            startGameTimers(initialGameState.players, initialGameState.currentPlayerIndex);
        }); 
    };
    const listenToGameState = (gameCode) => { 
        const gameStateRef = database.ref(`games/${gameCode}/gameState`); 
        if(gameStateListener) gameStateRef.off('value', gameStateListener); 
        
        gameStateListener = gameStateRef.on('value', snapshot => { 
            const state = snapshot.val(); 
            
            if(state && window.gameManager) {
                // Initialize timers if not started yet
                if (!window.gameStats.started && (state.status === 'playing' || state.status === 'simulating')) {
                    const currentPlayerIndex = state.currentPlayerIndex !== undefined ? state.currentPlayerIndex : 0;
                    startGameTimers(state.players, currentPlayerIndex);
                    
                    // Vibrate when game starts
                    if (navigator.vibrate) {
                        navigator.vibrate([150, 50, 150]); // Game start notification
                    }
                }
                
                // Track turn changes
                trackTurnChange(state);
                
                // Update game state
                window.gameManager.updateState(state);
                
                // If game over, update stats
                if (state.status === 'gameOver') {
                    updatePlayerStats(gameCode, state);
                    
                    // Vibrate for game over
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 100, 100, 100, 500]); // Game over pattern
                    }
                }
            }
        });
        
        // Listen for game status changes (ended, etc)
        const gameRef = database.ref(`games/${gameCode}`);
        if (gameStatusListener) gameRef.child('status').off('value', gameStatusListener);
        
        gameStatusListener = gameRef.child('status').on('value', snapshot => {
            const status = snapshot.val();
            
            
            if (status === 'ended') {
                // Game was ended (probably due to disconnect)
                gameRef.once('value', gameSnapshot => {
                    const game = gameSnapshot.val();
                    if (!game) return;
                    
                    let message = '❌ Oyun Sonlandırıldı<br><br>Oyun beklenmedik şekilde sonlandı.';
                    
                    if (game.endReason === 'player_disconnected' && game.disconnectedPlayer) {
                        // Find player name
                        let playerName = 'Bir oyuncu';
                        if (game.gameState && game.gameState.players) {
                            const player = game.gameState.players.find(p => p.uid === game.disconnectedPlayer);
                            if (player) playerName = player.name;
                        }
                        message = `❌ Oyuncu Ayrıldı<br><br>${playerName} oyundan ayrıldı.<br>Oyun sonlandırıldı.`;
                    }
                    
                    cleanupPresenceListeners();
                    
                    if (window.gameManager) {
                        window.gameManager.showOverlay(message, 'info', false, false);
                    }
                    
                    setTimeout(() => {
                        handleReturnToMainMenu();
                    }, 3000);
                });
            }
        });
        
        // Listen for rematch readiness
        listenForRematch(gameCode);
        
        // Track player presence during game
        trackPlayerPresence(gameCode);
    };

    const getNextStateForTurnEnd = (currentSimState) => {
        let finalPlayers = JSON.parse(JSON.stringify(currentSimState.players));
        const activePlayers = finalPlayers.filter(p => p.lives > 0);
        let nextPlayerIndex = currentSimState.currentPlayerIndex;
        let gameStatus = 'playing';
        let overlayMessage = null;

        
        
        
        // Game ends only when ALL players have 0 lives
        if (activePlayers.length === 0) {
            gameStatus = 'gameOver';
            // Winner is the player with highest score
            const sortedPlayers = [...finalPlayers].sort((a, b) => b.score - a.score);
            const maxScore = sortedPlayers[0].score;
            const winners = sortedPlayers.filter(p => p.score === maxScore);
            
            // Build detailed game over message
            let resultText = '';
            let pointsAwarded = '';
            
            if (winners.length === 1) {
                // Solo winner
                resultText = `🏆 <span class="text-3xl font-bold">Kazanan: ${winners[0].name}</span> 🏆`;
                pointsAwarded = `<div class="mt-3 text-amber-300">+3 Puan</div>`;
            } else {
                // Draw
                resultText = `🤝 <span class="text-3xl font-bold">Berabere!</span> 🤝`;
                const winnerNames = winners.map(w => w.name).join(' & ');
                resultText += `<div class="mt-2 text-2xl">${winnerNames}</div>`;
                pointsAwarded = `<div class="mt-3 text-amber-300">+1 Puan (Her Oyuncu)</div>`;
            }
            
            // Finalize timers before calculating (include current active time)
            // This ensures the last player's turn time is included
            if (window.gameStats && window.gameStats.currentTurnUid && window.gameStats.currentTurnStartTime) {
                const elapsed = Date.now() - window.gameStats.currentTurnStartTime;
                window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] = 
                    (window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] || 0) + elapsed;
            }
            
            // Calculate game times
            const totalGameTime = window.gameStats.gameStartTime 
                ? Date.now() - window.gameStats.gameStartTime 
                : 0;
            
            const timeText = `<div class="mt-4 text-lg">⏱️ Toplam Süre: <span class="font-semibold">${formatTime(totalGameTime)}</span></div>`;
            
            // Build player times
            let playerTimesText = '<div class="mt-3 space-y-1">';
            finalPlayers.forEach(p => {
                const turnTime = window.gameStats.playerTurnTimes[p.uid] || 0;
                playerTimesText += `<div class="text-sm">👤 ${p.name}: <span class="font-semibold text-amber-200">${formatTime(turnTime)}</span></div>`;
            });
            playerTimesText += '</div>';
            
            overlayMessage = { 
                text: `${resultText}${pointsAwarded}${timeText}${playerTimesText}`, 
                type: 'gameOver', 
                requiresAck: false 
            };
            
            
            
        } else {
            // Find next active player
            nextPlayerIndex = (currentSimState.currentPlayerIndex + 1) % finalPlayers.length;
            let attempts = 0;
            while (finalPlayers[nextPlayerIndex].lives <= 0 && attempts < finalPlayers.length) {
                nextPlayerIndex = (nextPlayerIndex + 1) % finalPlayers.length;
                attempts++;
            }
            
            // If no active players found, game should end
            if (finalPlayers[nextPlayerIndex].lives <= 0) {
                gameStatus = 'gameOver';
                const sortedPlayers = [...finalPlayers].sort((a, b) => b.score - a.score);
                const maxScore = sortedPlayers[0].score;
                const winners = sortedPlayers.filter(p => p.score === maxScore);
                
                // Build detailed game over message (same as above)
                let resultText = '';
                let pointsAwarded = '';
                
                if (winners.length === 1) {
                    resultText = `🏆 <span class="text-3xl font-bold">Kazanan: ${winners[0].name}</span> 🏆`;
                    pointsAwarded = `<div class="mt-3 text-amber-300">+3 Puan</div>`;
                } else {
                    resultText = `🤝 <span class="text-3xl font-bold">Berabere!</span> 🤝`;
                    const winnerNames = winners.map(w => w.name).join(' & ');
                    resultText += `<div class="mt-2 text-2xl">${winnerNames}</div>`;
                    pointsAwarded = `<div class="mt-3 text-amber-300">+1 Puan (Her Oyuncu)</div>`;
                }
                
                const totalGameTime = window.gameStats.gameStartTime 
                    ? Date.now() - window.gameStats.gameStartTime 
                    : 0;
                
                const timeText = `<div class="mt-4 text-lg">⏱️ Toplam Süre: <span class="font-semibold">${formatTime(totalGameTime)}</span></div>`;
                
                let playerTimesText = '<div class="mt-3 space-y-1">';
                finalPlayers.forEach(p => {
                    const turnTime = window.gameStats.playerTurnTimes[p.uid] || 0;
                    playerTimesText += `<div class="text-sm">👤 ${p.name}: <span class="font-semibold text-amber-200">${formatTime(turnTime)}</span></div>`;
                });
                playerTimesText += '</div>';
                
                overlayMessage = { 
                    text: `${resultText}${pointsAwarded}${timeText}${playerTimesText}`, 
                    type: 'gameOver', 
                    requiresAck: false 
                };
                
                
            }
        }

        const COIN_DIAMETER_RATIO = window.gameManager.COIN_DIAMETER_RATIO;
        const LOGICAL_HEIGHT_RATIO = window.gameManager.LOGICAL_HEIGHT / window.gameManager.LOGICAL_WIDTH;
        const startY = LOGICAL_HEIGHT_RATIO - LOGICAL_HEIGHT_RATIO * 0.1;
        const coinRadius = COIN_DIAMETER_RATIO / 2;

        const newCoins = [
                                                    { id: 0, x: 0.5, y: startY, vx: 0, vy: 0, color: '#c0c0c0', highlight: '#f0f0f0', inGoal: false, movedThisTurn: false },
                                                    { id: 1, x: 0.5 - (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#b87333', highlight: '#e69138', inGoal: false, movedThisTurn: false },
                                                    { id: 2, x: 0.5 + (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#ffd700', highlight: '#fff200', inGoal: false, movedThisTurn: false }        ];

        // Practice mode: Keep path foul active after first move
        const isPracticeMode = window.practiceMode && window.practiceMode.active;
        const pathFoulActive = isPracticeMode ? true : false; // Practice mode always has path foul active
        
        return {
            status: gameStatus,
            players: finalPlayers,
            coins: newCoins,
            currentPlayerIndex: nextPlayerIndex,
            lastMovedCoinId: null,
            overlayMessage: overlayMessage,
            isPathFoulActive: pathFoulActive,
            collisionOccurredDuringSim: false,
            hostUid: currentSimState.hostUid || (currentSimState.players && currentSimState.players[0] && currentSimState.players[0].uid) // Preserve host info, fallback to first player
        };
    };

    const listenForAcks = (gameCode) => {
        const ackRef = database.ref(`games/${gameCode}/acknowledgedTurn`);
        if (ackListener) ackRef.off('value', ackListener);

        ackListener = ackRef.on('value', snapshot => {
            const ackUid = snapshot.val();
            if (!ackUid) return;

            const gameStateRef = database.ref(`games/${gameCode}/gameState`);
            gameStateRef.once('value', (stateSnapshot) => {
                const currentState = stateSnapshot.val();
                if (!currentState || currentState.status !== 'awaiting_ack' || currentState.players[currentState.currentPlayerIndex]?.uid !== ackUid) {
                    return;
                }
                
                const nextState = getNextStateForTurnEnd(currentState);
                
                gameStateRef.set(nextState);
                ackRef.remove();
            });
        });
    };

    const listenForFlicks = (gameCode) => {
        const flickRef = database.ref(`games/${gameCode}/activeFlick`);
        if (activeFlickListener) flickRef.off('value', activeFlickListener);
        activeFlickListener = flickRef.on('value', snapshot => {
            const flickData = snapshot.val();
            if (!flickData) return;
            const gm = window.gameManager;
            const gameStateRef = database.ref(`games/${gameCode}/gameState`);
            gameStateRef.once('value', (stateSnapshot) => {
                const currentState = stateSnapshot.val();
                if (!currentState || currentState.players[currentState.currentPlayerIndex]?.uid !== flickData.madeBy) return;
                
                const isHost = currentState.players[0]?.uid === auth.currentUser.uid;
                
                if (isHost) {
                    // Host runs authoritative simulation
                    runHostSimulation(flickData, currentState, gameCode);
                    flickRef.remove(); // Only host removes the flick after processing
                } else {
                    // Client runs local simulation (no Firebase writes)
                    runClientSimulation(flickData, currentState, gameCode);
                    // Client doesn't remove - host will do it
                }
            });
        });
    };

    // Client-side physics simulation (no Firebase writes, just local rendering)
    const runClientSimulation = (flickData, initialState, gameCode) => {
        const gm = window.gameManager;
        if (gm.physicsTimer) clearInterval(gm.physicsTimer);

        let simState = JSON.parse(JSON.stringify(initialState));
        
        const LOGICAL_HEIGHT_RATIO = gm.LOGICAL_HEIGHT / gm.LOGICAL_WIDTH;
        const COIN_RADIUS = gm.COIN_DIAMETER_RATIO / 2;
        const GOAL_WIDTH = gm.GOAL_WIDTH_RATIO;
        const GOAL_X = 0.5 - GOAL_WIDTH / 2;
        const GOAL_DEPTH = COIN_RADIUS * 3;
        const FRICTION = 0.985;

        const targetCoin = simState.coins.find(c => c.id === flickData.coinId);
        if (!targetCoin) return;

        targetCoin.vx = flickData.vx;
        targetCoin.vy = flickData.vy;
        
        // Update local gameManager state with a DEEP COPY to avoid reference issues
        gm.coins = JSON.parse(JSON.stringify(simState.coins));
        gm.startLocalRender(() => gm.coins);

        gm.physicsTimer = setInterval(() => {
            let isMoving = false;

            for (const coin of gm.coins) {
                coin.vx *= FRICTION;
                coin.vy *= FRICTION;
                if (Math.abs(coin.vx) < 0.0001) coin.vx = 0;
                if (Math.abs(coin.vy) < 0.0001) coin.vy = 0;
                coin.x += coin.vx;
                coin.y += coin.vy;

                // Goal detection and dimensions
                const goalLeft = GOAL_X;
                const goalRight = goalLeft + GOAL_WIDTH;
                const goalHeight = 40 / gm.LOGICAL_WIDTH; // Normalize goal height to logical units (resolution-independent)
                
                // Kale direkleri ile çarpışma kontrolü (direk kalınlığı 3px)
                const postWidth = 3 / gm.LOGICAL_WIDTH;
                
                // Direk çarpışmaları (iç/dış taraf mantıklı yansıma)
                if (coin.y - COIN_RADIUS < goalHeight && coin.y + COIN_RADIUS > 0) {
                    // Sol direk (x = goalLeft)
                    {
                        const dx = coin.x - goalLeft;
                        const overlap = (COIN_RADIUS + postWidth) - Math.abs(dx);
                        if (overlap > 0) {
                            const side = dx === 0 ? (coin.vx >= 0 ? 1 : -1) : Math.sign(dx); // içteyse +1, dışta ise -1
                            coin.x += side * overlap; // iç/dış tarafa doğru it
                            coin.vx = -coin.vx * 0.7; // yansıt (damping)
                        }
                    }
                    // Sağ direk (x = goalRight)
                    {
                        const dx = coin.x - goalRight;
                        const overlap = (COIN_RADIUS + postWidth) - Math.abs(dx);
                        if (overlap > 0) {
                            const side = dx === 0 ? (coin.vx >= 0 ? 1 : -1) : Math.sign(dx); // içteyse -1, dışta ise +1
                            coin.x += side * overlap;
                            coin.vx = -coin.vx * 0.7;
                        }
                    }
                }
                
                // Üst çıta çarpışması kaldırıldı: gol girişini engellemesin
                
                // File ve gol bölgesi kontrolü
                const inGoalZone = coin.y < goalHeight && coin.x > goalLeft && coin.x < goalRight;
                
                // Gol: paranın yarısından fazlası çizgiyi geçtiyse ve direklerin arasında ise
                // (coin.y + COIN_RADIUS/2) <= 0 → paranın yarısından fazlası gol çizgisini geçmiş demektir
                if (inGoalZone && (coin.y + COIN_RADIUS / 2) <= 0) {
                    coin.inGoal = true;
                    // File etkisi: parayı çizgide durdur (görsel olarak filede takılsın)
                    coin.y = COIN_RADIUS;
                    coin.vy = 0;
                }

                // Enhanced fall detection for client simulation (visual feedback only)
                if (!coin.inGoal) {
                    const coinLeft = coin.x - COIN_RADIUS;
                    const coinRight = coin.x + COIN_RADIUS;
                    const coinTop = coin.y - COIN_RADIUS;
                    const coinBottom = coin.y + COIN_RADIUS;
                    
                    // Check if more than half of the coin has gone over any edge
                    let overhangDetected = false;
                    
                    // Check left edge overhang
                    if (coinLeft < 0) {
                        const overhangAmount = Math.abs(coinLeft);
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            overhangDetected = true;
                        }
                    }
                    
                    // Check right edge overhang
                    if (coinRight > 1) {
                        const overhangAmount = coinRight - 1;
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            overhangDetected = true;
                        }
                    }
                    
                    // Check bottom edge overhang
                    if (coinBottom > LOGICAL_HEIGHT_RATIO) {
                        const overhangAmount = coinBottom - LOGICAL_HEIGHT_RATIO;
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            overhangDetected = true;
                        }
                    }
                    
                    // Check top edge overhang (but not in goal area)
                    if (coinTop < 0 && !(coin.x > GOAL_X && coin.x < GOAL_X + GOAL_WIDTH)) {
                        const overhangAmount = Math.abs(coinTop);
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            overhangDetected = true;
                        }
                    }
                    
                    // Mark coin as having fall foul for visual feedback and stop movement
                    if (overhangDetected) {
                        coin.hasFallFoul = true;
                        coin.vx = 0;
                        coin.vy = 0;
                    }
                }

                // Goal physics
                const goalBack = -GOAL_DEPTH;
                if (coin.y - COIN_RADIUS < 0) {
                    if (coin.y - COIN_RADIUS < goalBack && coin.x > goalLeft && coin.x < goalRight) {
                        coin.y = goalBack + COIN_RADIUS;
                        coin.vy *= -0.7;
                    }
                    if (coin.y < 0 && coin.y > goalBack) {
                        if (coin.x - COIN_RADIUS < goalLeft && coin.vx < 0) {
                            coin.x = goalLeft + COIN_RADIUS;
                            coin.vx *= -0.7;
                        }
                        if (coin.x + COIN_RADIUS > goalRight && coin.vx > 0) {
                            coin.x = goalRight - COIN_RADIUS;
                            coin.vx *= -0.7;
                        }
                    }
                }

                // Constrain coins in goal
                if (coin.inGoal) {
                    coin.vx = 0;
                    coin.vy = 0;
                    coin.y = Math.min(coin.y, COIN_RADIUS * 0.5);
                    coin.x = Math.max(GOAL_X + COIN_RADIUS, Math.min(coin.x, GOAL_X + GOAL_WIDTH - COIN_RADIUS));
                }

                if (coin.vx !== 0 || coin.vy !== 0) isMoving = true;
            }

            // Coin collisions
            for (let i = 0; i < gm.coins.length; i++) {
                for (let j = i + 1; j < gm.coins.length; j++) {
                    const c1 = gm.coins[i];
                    const c2 = gm.coins[j];
                    const dx = c2.x - c1.x;
                    const dy = c2.y - c1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < COIN_RADIUS * 2) {
                        // Collision detected - stop client simulation
                        // (Host will send authoritative result via Firebase)
                        
                        clearInterval(gm.physicsTimer);
                        gm.physicsTimer = null;
                        gm.stopLocalRender();
                        return; // Wait for host's authoritative result
                    }
                }
            }

            // Stop when no movement
            if (!isMoving) {
                clearInterval(gm.physicsTimer);
                gm.physicsTimer = null;
                gm.stopLocalRender();
                // Client waits for authoritative result from Firebase
            }
        }, 1000 / 60);
    };

    const runHostSimulation = (flickData, initialState, gameCode) => {

        const gm = window.gameManager;
        if (gm.physicsTimer) clearInterval(gm.physicsTimer);
        
        // Practice mode: Increment attempts counter
        if (window.practiceMode && window.practiceMode.active) {
            window.practiceMode.attempts++;
        }

        const gameRules = {
            collisionFoul: true,
            fallFoul: true,
            pathFoul: true,
            directGoalFoul: true
        };

        let simState = JSON.parse(JSON.stringify(initialState));
        simState.status = 'simulating';
        simState.collisionOccurredDuringSim = false;
        simState.goalScoredThisTurn = false; // Flag for sticky goal
        simState.fallFoulTriggered = false; // Flag for fall foul detection

        const LOGICAL_HEIGHT_RATIO = gm.LOGICAL_HEIGHT / gm.LOGICAL_WIDTH;
        const COIN_RADIUS = gm.COIN_DIAMETER_RATIO / 2;
        const GOAL_WIDTH = gm.GOAL_WIDTH_RATIO;
        const GOAL_X = 0.5 - GOAL_WIDTH / 2;
        const GOAL_DEPTH = COIN_RADIUS * 3;
        const FRICTION = 0.985;
        const startY = LOGICAL_HEIGHT_RATIO - LOGICAL_HEIGHT_RATIO * 0.1;

        const targetCoin = simState.coins.find(c => c.id === flickData.coinId);
        if (!targetCoin) return;

        const flickOriginPos = { x: targetCoin.x, y: targetCoin.y };
        const wasTurnFlickedFromStart = Math.abs(targetCoin.y - startY) < 0.001;

        const currentPlayer = simState.players[simState.currentPlayerIndex];
        currentPlayer.turnCount = (currentPlayer.turnCount || 0) + 1;

        targetCoin.vx = flickData.vx;
        targetCoin.vy = flickData.vy;
        targetCoin.movedThisTurn = true; // Mark the flicked coin as moved this turn
        
        gm.startLocalRender(() => simState.coins);

        let lastFirebaseUpdate = 0;
        const FIREBASE_UPDATE_INTERVAL = 33; // Update Firebase every 33ms (~30 FPS)

        gm.physicsTimer = setInterval(() => {
            let isMoving = false;

            for (const coin of simState.coins) {
                coin.vx *= FRICTION;
                coin.vy *= FRICTION;
                if (Math.abs(coin.vx) < 0.0001) coin.vx = 0;
                if (Math.abs(coin.vy) < 0.0001) coin.vy = 0;
                coin.x += coin.vx;
                coin.y += coin.vy;

                // --- Sticky Goal Detection + Goal dimensions ---
                const goalLeft = GOAL_X;
                const goalRight = goalLeft + GOAL_WIDTH;
                const goalHeight = 40 / gm.LOGICAL_WIDTH; // Normalize goal height to logical units (resolution-independent)
                
                // Kale direkleri ile çarpışma kontrolü (direk kalınlığı 3px)
                const postWidth = 3 / gm.LOGICAL_WIDTH;
                
                // Direk çarpışmaları (iç/dış taraf mantıklı yansıma)
                if (coin.y - COIN_RADIUS < goalHeight && coin.y + COIN_RADIUS > 0) {
                    // Sol direk (x = goalLeft)
                    {
                        const dx = coin.x - goalLeft;
                        const overlap = (COIN_RADIUS + postWidth) - Math.abs(dx);
                        if (overlap > 0) {
                            const side = dx === 0 ? (coin.vx >= 0 ? 1 : -1) : Math.sign(dx);
                            coin.x += side * overlap;
                            coin.vx = -coin.vx * 0.7;
                        }
                    }
                    // Sağ direk (x = goalRight)
                    {
                        const dx = coin.x - goalRight;
                        const overlap = (COIN_RADIUS + postWidth) - Math.abs(dx);
                        if (overlap > 0) {
                            const side = dx === 0 ? (coin.vx >= 0 ? 1 : -1) : Math.sign(dx);
                            coin.x += side * overlap;
                            coin.vx = -coin.vx * 0.7;
                        }
                    }
                }
                
                // Üst çıta çarpışması kaldırıldı: gol girişini engellemesin
                
                // File ve gol bölgesi kontrolü
                const inGoalZone = coin.y < goalHeight && coin.x > goalLeft && coin.x < goalRight;
                
                // Gol: paranın yarısından fazlası çizgiyi geçtiyse ve direkler arasında ise
                // (coin.y + COIN_RADIUS/2) <= 0 → paranın yarısından fazlası gol çizgisini geçmiş demektir
                if (inGoalZone && (coin.y + COIN_RADIUS / 2) <= 0) {
                    simState.goalScoredThisTurn = true;
                    coin.inGoal = true; // scoring coin
                    // File etkisi: çizgide durdur
                    coin.y = COIN_RADIUS;
                    coin.vy = 0;
                }

                // --- Enhanced Fall Detection ---
                // Check if more than half of the coin has gone over any edge
                if (!simState.fallFoulTriggered && !coin.inGoal) {
                    const coinLeft = coin.x - COIN_RADIUS;
                    const coinRight = coin.x + COIN_RADIUS;
                    const coinTop = coin.y - COIN_RADIUS;
                    const coinBottom = coin.y + COIN_RADIUS;
                    
                    // Check left edge overhang
                    if (coinLeft < 0) {
                        const overhangAmount = Math.abs(coinLeft);
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            simState.fallFoulTriggered = true;
                            coin.vx = 0;
                            coin.vy = 0;
                            
                        }
                    }
                    
                    // Check right edge overhang
                    if (coinRight > 1) {
                        const overhangAmount = coinRight - 1;
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            simState.fallFoulTriggered = true;
                            coin.vx = 0;
                            coin.vy = 0;
                            
                        }
                    }
                    
                    // Check bottom edge overhang
                    if (coinBottom > LOGICAL_HEIGHT_RATIO) {
                        const overhangAmount = coinBottom - LOGICAL_HEIGHT_RATIO;
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            simState.fallFoulTriggered = true;
                            coin.vx = 0;
                            coin.vy = 0;
                            
                        }
                    }
                    
                    // Check top edge overhang (but not in goal area)
                    if (coinTop < 0 && !(coin.x > GOAL_X && coin.x < GOAL_X + GOAL_WIDTH)) {
                        const overhangAmount = Math.abs(coinTop);
                        const overhangPercentage = overhangAmount / (COIN_RADIUS * 2);
                        if (overhangPercentage > 0.5) {
                            simState.fallFoulTriggered = true;
                            coin.vx = 0;
                            coin.vy = 0;
                            
                        }
                    }
                }
                // --- End Enhanced Fall Detection ---

                // --- Goal Physics ---
                const goalBack = -GOAL_DEPTH;
                if (coin.y - COIN_RADIUS < 0) {
                    // Back wall collision
                    if (coin.y - COIN_RADIUS < goalBack && coin.x > goalLeft && coin.x < goalRight) {
                        coin.y = goalBack + COIN_RADIUS;
                        coin.vy *= -0.7; // Dampen bounce
                    }
                    // Side walls collision (only if within goal depth)
                    if (coin.y < 0 && coin.y > goalBack) {
                        // Left wall
                        if (coin.x - COIN_RADIUS < goalLeft && coin.vx < 0) {
                            coin.x = goalLeft + COIN_RADIUS;
                            coin.vx *= -0.7;
                        }
                        // Right wall
                        if (coin.x + COIN_RADIUS > goalRight && coin.vx > 0) {
                            coin.x = goalRight - COIN_RADIUS;
                            coin.vx *= -0.7;
                        }
                    }
                }
                // --- End Goal Physics ---

                // Apply constraints if coin is in goal
                if (coin.inGoal) {
                    coin.vx = 0;
                    coin.vy = 0;
                    // Clamp y position to prevent it from moving out of the goal area
                    // Assuming y=0 is the goal line, and goal area is y < 0
                    // We want to keep it slightly inside the goal visually
                    coin.y = Math.min(coin.y, COIN_RADIUS * 0.5); // Keep it slightly above y=0, or at least not below
                    // Clamp x position within goal width
                    coin.x = Math.max(GOAL_X + COIN_RADIUS, Math.min(coin.x, GOAL_X + GOAL_WIDTH - COIN_RADIUS));
                }

                if (coin.vx !== 0 || coin.vy !== 0) isMoving = true;
            }

            for (let i = 0; i < simState.coins.length; i++) {
                for (let j = i + 1; j < simState.coins.length; j++) {
                    const c1 = simState.coins[i]; const c2 = simState.coins[j];
                    const dx = c2.x - c1.x; const dy = c2.y - c1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < COIN_RADIUS * 2) {
                        // IMMEDIATE COLLISION FOUL - Stop simulation instantly
                        if (gameRules.collisionFoul) {
                            
                            clearInterval(gm.physicsTimer);
                            gm.physicsTimer = null;
                            gm.stopLocalRender();
                            
                            // Process collision foul immediately
                            let player = simState.players[simState.currentPlayerIndex];
                            player.lives--;
                            
                            // Practice mode: Faul sayacı
                            if (window.practiceMode && window.practiceMode.active) {
                                window.practiceMode.fouls++;
                            }
                            
                            const finalState = {
                                ...simState,
                                status: 'awaiting_ack',
                                players: simState.players,
                                overlayMessage: { text: 'Faul:<br>Çarpışma', type: 'foul', requiresAck: true },
                                isPathFoulActive: true,
                                collisionOccurredDuringSim: true
                            };
                            
                            // Practice mode: Local update
                            if (window.practiceMode && window.practiceMode.active) {
                                gm.updateState(finalState);
                            } else {
                                database.ref(`games/${gameCode}/gameState`).set(finalState);
                            }
                            return; // Exit simulation immediately
                        }
                        
                        // If collision fouls are disabled, apply physics
                        simState.collisionOccurredDuringSim = true;
                        const nx = dx / dist, ny = dy / dist; const tx = -ny, ty = nx;
                        const dpTan1 = c1.vx * tx + c1.vy * ty; const dpTan2 = c2.vx * tx + c2.vy * ty;
                        const dpNorm1 = c1.vx * nx + c1.vy * ny; const dpNorm2 = c2.vx * nx + c2.vy * ny;
                        c1.vx = tx * dpTan1 + nx * dpNorm2; c1.vy = ty * dpTan1 + ny * dpNorm2;
                        c2.vx = tx * dpTan2 + nx * dpNorm1; c2.vy = ty * dpTan2 + ny * dpNorm1;
                    }
                }
            }

            // NO Firebase coin position updates during simulation!
            // Client runs its own physics simulation

            // Stop simulation immediately if fall foul is triggered
            if (simState.fallFoulTriggered) {
                clearInterval(gm.physicsTimer);
                gm.physicsTimer = null;
                gm.stopLocalRender();
                
                // Process the fall foul immediately
                let player = simState.players[simState.currentPlayerIndex];
                player.lives--;
                
                // Practice mode: Faul sayacı
                if (window.practiceMode && window.practiceMode.active) {
                    window.practiceMode.fouls++;
                }
                
                const finalState = {
                    ...simState,
                    status: 'awaiting_ack',
                    players: simState.players,
                    overlayMessage: { text: 'Faul:<br>Para masadan düştü', type: 'foul', requiresAck: true },
                    isPathFoulActive: true
                };
                
                // Practice mode: Local update
                if (window.practiceMode && window.practiceMode.active) {
                    gm.updateState(finalState);
                } else {
                    database.ref(`games/${gameCode}/gameState`).set(finalState);
                }
                return;
            }

            if (!isMoving) {
                clearInterval(gm.physicsTimer);
                gm.physicsTimer = null;
                gm.stopLocalRender();

                let detectedFouls = [];
                let isGoal = simState.goalScoredThisTurn;

                // New rule: All coins must be moved at least once before a goal can be scored
                if (isGoal && simState.coins.some(c => !c.movedThisTurn)) {
                    detectedFouls.push('Tüm paralar oynanmadan gol atılamaz');
                    isGoal = false; // This goal is now a foul
                }

                // Existing direct goal foul check (if a goal was scored from start position)
                // This should also be a foul, not prevent the goal.
                if (isGoal && gameRules.directGoalFoul && wasTurnFlickedFromStart) {
                    detectedFouls.push('Başlangıçtan direkt gol atılamaz');
                    isGoal = false; // This goal is now a foul
                }

                // Determine the final outcome with the correct priority: Goal > Foul > Clean
                let finalOutcome;

                if (isGoal) {
                    // If a goal was scored at any point, it takes precedence over everything.
                    finalOutcome = { type: 'goal', message: generateAnimatedGoalText() };
                } else {
                    // If no goal, check for fouls. Only the first foul is considered.
                    if (detectedFouls.length === 0 && gameRules.collisionFoul && simState.collisionOccurredDuringSim) {
                        detectedFouls.push('Çarpışma');
                    }

                    // Enhanced fall detection - check if more than half of any coin went over the edge
                    if (detectedFouls.length === 0 && gameRules.fallFoul && simState.fallFoulTriggered) {
                        detectedFouls.push('Para masadan düştü');
                    }

                    const scoredCoins = simState.coins.filter(c => c.y <= 0 && c.x >= GOAL_X && c.x <= GOAL_X + GOAL_WIDTH);
                    if (detectedFouls.length === 0 && scoredCoins.length > 0 && gameRules.directGoalFoul && wasTurnFlickedFromStart) {
                        detectedFouls.push('Başlangıçtan direkt gol atılamaz');
                    }

                    // Practice mode: Only check path foul after first move (attempts > 1 because we incremented at start)
                    const isPracticeMode = window.practiceMode && window.practiceMode.active;
                    const shouldCheckPathFoul = isPracticeMode ? (window.practiceMode.attempts > 1) : simState.isPathFoulActive;
                    
                    if (detectedFouls.length === 0 && gameRules.pathFoul && shouldCheckPathFoul) {
                        const finalTargetCoin = simState.coins.find(c => c.id === flickData.coinId);
                        const otherFinalCoins = simState.coins.filter(c => c.id !== flickData.coinId);
                        if (finalTargetCoin && otherFinalCoins.length === 2) {
                            const pathVector = { x: finalTargetCoin.x - flickOriginPos.x, y: finalTargetCoin.y - flickOriginPos.y };
                            if (Math.sqrt(pathVector.x**2 + pathVector.y**2) > 0.001) {
                                if (!checkPathIntersection(flickOriginPos, pathVector, otherFinalCoins[0], otherFinalCoins[1])) {
                                    detectedFouls.push('İki para arasından geçmelisin');
                                }
                            }
                        }
                    }

                    if (detectedFouls.length > 0) {
                        finalOutcome = { type: 'foul', message: 'Faul:<br>' + detectedFouls[0] + '!' };
                    } else {
                        finalOutcome = { type: 'clean', message: '' };
                    }
                }
                
                if (finalOutcome.type === 'goal' || finalOutcome.type === 'foul') {
                    let player = simState.players[simState.currentPlayerIndex];
                    if (finalOutcome.type === 'goal') {
                        player.score++;
                        // Practice mode: Gol sayacı
                        if (window.practiceMode && window.practiceMode.active) {
                            window.practiceMode.goals++;
                        }
                    }
                    if (finalOutcome.type === 'foul') {
                        player.lives--;
                        // Practice mode: Faul sayacı
                        if (window.practiceMode && window.practiceMode.active) {
                            window.practiceMode.fouls++;
                        }
                    }

                    const finalState = {
                        ...simState,
                        status: 'awaiting_ack',
                        players: simState.players,
                        overlayMessage: { text: finalOutcome.message, type: finalOutcome.type, requiresAck: true }, // Pass type
                        isPathFoulActive: true
                    };
                    
                    // Practice mode: Local update
                    if (window.practiceMode && window.practiceMode.active) {
                        gm.updateState(finalState);
                    } else {
                        database.ref(`games/${gameCode}/gameState`).set(finalState);
                    }

                } else {
                    const nextState = {
                        ...simState,
                        status: 'playing',
                        lastMovedCoinId: flickData.coinId,
                        overlayMessage: null,
                        isPathFoulActive: true
                    };
                    
                    // Practice mode: Local update
                    if (window.practiceMode && window.practiceMode.active) {
                        gm.updateState(nextState);
                    } else {
                        database.ref(`games/${gameCode}/gameState`).set(nextState);
                    }
                }
            }
        }, 1000 / 60);
    };

    const checkPathIntersection = (shotOrigin, shotVelocity, otherCoin1, otherCoin2) => {
        const p0 = shotOrigin;
        const d0 = shotVelocity;
        const p1 = otherCoin1;
        const d1 = { x: otherCoin2.x - otherCoin1.x, y: otherCoin2.y - otherCoin1.y };
        const denominator = d0.x * d1.y - d0.y * d1.x;
        if (Math.abs(denominator) < 1e-9) {
            return false;
        }
        const t = ((p1.x - p0.x) * d1.y - (p1.y - p0.y) * d1.x) / denominator;
        const u = -((p0.x - p1.x) * d0.y - (p0.y - p1.y) * d0.x) / denominator;
        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    };

    // Practice mode flick event listener (hoisting solution)
    document.addEventListener('practiceFlickReady', () => {
        if (window.practiceMode && window.practiceMode.active && window.practiceMode.pendingFlick) {
            const { flickData, currentState } = window.practiceMode.pendingFlick;
            window.practiceMode.pendingFlick = null; // Clear
            
            // Now runHostSimulation is defined, we can call it
            runHostSimulation(flickData, currentState, 'practice');
        }
    });

    // Practice mode ACK event listener (hoisting solution)
    document.addEventListener('practiceAckReady', () => {
        if (window.practiceMode && window.practiceMode.active && window.practiceMode.pendingAck) {
            const currentState = window.practiceMode.pendingAck;
            window.practiceMode.pendingAck = null; // Clear
            
            // Reset attempts counter for new round (path foul should not apply on first move)
            window.practiceMode.attempts = 0;
            
            // Now getNextStateForTurnEnd is defined, we can call it
            const nextState = getNextStateForTurnEnd(currentState);
            window.gameManager.updateState(nextState);
        }
    });

    practiceModeButton.addEventListener('click', handlePracticeMode);
    practiceMenuButton.addEventListener('click', () => {
        // Practice mode'u kapat
        window.practiceMode = { active: false };
        
        // Chat'i tekrar göster
        if (chatBox) {
            chatBox.style.display = '';
        }
        
        // Timerleri durdur
        stopGameTimers();
        
        // Game manager'ı temizle
        if (window.gameManager) {
            window.gameManager.cleanup();
        }
        
        // Ana menüye dön
        showScreen('mainMenu');
    });
    createGameButton.addEventListener('click', handleCreateGame);
    joinGameButton.addEventListener('click', handleJoinGame);
    leaveLobbyButton.addEventListener('click', () => handleLeaveLobby(false));
    readyButton.addEventListener('click', handleReadyClick);
    startGameFromLobbyButton.addEventListener('click', handleStartGame);
    
    // Chat form submit handler
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            
            await sendChatMessage(text);
            chatInput.value = '';
        });
    }
    
    // Clear notifications when user focuses on chat input
    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            clearChatNotifications();
        });
    }
    
    // Clear notifications when user scrolls chat messages
    if (chatMessages) {
        chatMessages.addEventListener('scroll', () => {
            // If scrolled to bottom, clear notifications
            const isAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight;
            if (isAtBottom) {
                clearChatNotifications();
            }
        });
        
        // Also clear notifications when user clicks on chat messages area
        chatMessages.addEventListener('click', () => {
            clearChatNotifications();
        });
    }
    
    // Clear notifications when user clicks on chat box
    if (chatBox) {
        chatBox.addEventListener('click', () => {
            clearChatNotifications();
        });
    }
    
    // Rematch button handler - centralized in gameManager
    const rematchButton = document.getElementById('rematch-button');
    if (rematchButton) {
        rematchButton.addEventListener('click', () => {
            const gameCode = window.currentGameId;
            const uid = auth.currentUser.uid;
            if (!gameCode || !uid) return;
            
            
            
            // Immediately change button to show feedback
            rematchButton.innerHTML = `
                <span class="flex items-center gap-3 text-lg">
                    <svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Hazır! ✓
                </span>
            `;
            rematchButton.classList.remove('animate-pulse', 'from-green-500', 'to-emerald-600', 'hover:from-green-600', 'hover:to-emerald-700', 'hover:scale-110');
            rematchButton.classList.add('from-blue-500', 'to-blue-600', 'cursor-not-allowed');
            rematchButton.disabled = true;
            
            const rematchRef = database.ref(`games/${gameCode}/rematchReady/${uid}`);
            rematchRef.set(true).catch(error => {
                console.error('Error setting rematch ready:', error);
                // Reset button on error
                if (window.gameManager && window.gameManager.resetRematchButton) {
                    window.gameManager.resetRematchButton();
                }
            });
        });
    }
    
    // Listen for rematch ready status
    const listenForRematch = (gameCode) => {
        const rematchRef = database.ref(`games/${gameCode}/rematchReady`);
        
        // Remove existing listener to prevent duplicates
        if (rematchListener) {
            rematchRef.off('value', rematchListener);
        }
        
        rematchListener = rematchRef.on('value', (snapshot) => {
            const rematchReady = snapshot.val();
            if (!rematchReady) {
                
                
                // Hide the status container when rematch data is cleared
                const statusContainer = document.getElementById('rematch-status-container');
                if (statusContainer) {
                    statusContainer.classList.add('hidden');
                    statusContainer.innerHTML = '';
                }
                return;
            }
            
            
            
            // Update UI to show who is ready
            if (window.gameManager && window.gameManager.updateRematchStatus) {
                window.gameManager.updateRematchStatus(rematchReady);
            }
            
            const gameStateRef = database.ref(`games/${gameCode}/gameState`);
            gameStateRef.once('value', (stateSnapshot) => {
                const currentState = stateSnapshot.val();
                if (!currentState || currentState.status !== 'gameOver') {
                    
                    return;
                }
                
                const allPlayerUids = currentState.players.map(p => p.uid);
                const readyPlayerUids = Object.keys(rematchReady);
                
                
                
                
                // Check if all players are ready
                const allReady = allPlayerUids.every(uid => rematchReady[uid] === true);
                
                
                
                if (allReady) {
                    
                    
                    // Reset game state for rematch
                    const COIN_DIAMETER_RATIO = window.gameManager.COIN_DIAMETER_RATIO;
                    const LOGICAL_HEIGHT_RATIO = window.gameManager.LOGICAL_HEIGHT / window.gameManager.LOGICAL_WIDTH;
                    const startY = LOGICAL_HEIGHT_RATIO - LOGICAL_HEIGHT_RATIO * 0.1;
                    const coinRadius = COIN_DIAMETER_RATIO / 2;
                    
                    const resetPlayers = currentState.players.map(p => ({
                        ...p,
                        score: 0,
                        lives: p.initialLives || 3,
                        turnCount: 0
                    }));
                    
                    const newCoins = [
                        { id: 0, x: 0.5, y: startY, vx: 0, vy: 0, color: '#c0c0c0', highlight: '#f0f0f0', inGoal: false, movedThisTurn: false },
                        { id: 1, x: 0.5 - (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#b87333', highlight: '#e69138', inGoal: false, movedThisTurn: false },
                        { id: 2, x: 0.5 + (coinRadius * 4), y: startY, vx: 0, vy: 0, color: '#ffd700', highlight: '#fff200', inGoal: false, movedThisTurn: false }
                    ];
                    
                    const newState = {
                        status: 'playing',
                        players: resetPlayers,
                        coins: newCoins,
                        currentPlayerIndex: 0,
                        lastMovedCoinId: null,
                        overlayMessage: null,
                        isPathFoulActive: false,
                        collisionOccurredDuringSim: false,
                        rematchReady: null, // Clear rematch ready status
                        hostUid: currentState.hostUid || (currentState.players && currentState.players[0] && currentState.players[0].uid) // Preserve host
                    };
                    
                    // Update game state and clear rematch ready status
                    gameStateRef.set(newState).then(() => {
                        
                        rematchRef.remove(); // Clear rematch ready status from Firebase
                        
                        // Reset UI for all clients
                        if (window.gameManager && window.gameManager.resetRematchButton) {
                            window.gameManager.resetRematchButton();
                        }
                        
                        // Start timers for new game (will auto-reset if needed)
                        startGameTimers(resetPlayers, 0);
                    }).catch(error => {
                        console.error('Error starting rematch:', error);
                    });
                }
            });
        });
    };

    function generateAnimatedGoalText() {
        const text = "GoOoOoL!";
        let animatedText = "";
        for (let i = 0; i < text.length; i++) {
            animatedText += `<span class="animated-goal-letter" style="animation-delay: ${i * 0.1}s;">${text[i]}</span>`;
        }
        return animatedText;
    }
});

