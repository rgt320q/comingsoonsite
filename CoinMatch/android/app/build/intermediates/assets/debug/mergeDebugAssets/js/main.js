
        // --- UI Elements ---
        const mainGameScreen = document.getElementById('main-game-screen');
        const setupScreen = document.getElementById('setup-screen');
        const playerCountSelect = document.getElementById('player-count');
        const playerNamesContainer = document.getElementById('player-names-container');
        const livesCountInput = document.getElementById('lives-count');
        const startGameButton = document.getElementById('start-game-button');
        
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('game-container');
        const playerList = document.getElementById('player-list');
        const gameOverlay = document.getElementById('game-overlay');
        const overlayText = document.getElementById('overlay-text');
        const restartButton = document.getElementById('restart-button');

        // --- Game Constants ---
        const FRICTION = 0.985;
        const POWER_MULTIPLIER = 0.1;
        const GOAL_WIDTH = 0.2;
        const TABLE_MARGIN = 20;

        // --- Game State Variables ---
        let players = [];
        let currentPlayerIndex = 0;
        let coins = [];
        let coinRadius;
        let goal;
        let table = { x: 0, y: 0, width: 0, height: 0 };
        let selectedCoin = null;
        let isDragging = false; // For flicking
        let dragStart = { x: 0, y: 0 };
        let dragEnd = { x: 0, y: 0 };
        let turnCount = 0;
        let gameState = 'setup';
        let animationFrameId;
        let woodPattern = null;
        let preFlickHasMovedState = [];
        let lastMovedCoinId = null;
        let confettiParticles = [];

        // --- Setup Logic ---
        function updatePlayerNameInputs() {
            const count = parseInt(playerCountSelect.value, 10);
            playerNamesContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const div = document.createElement('div');
                div.innerHTML = `
                    <label for="player-name-${i}" class="block mb-1 font-semibold text-slate-300">Oyuncu ${i + 1} Adı:</label>
                    <input type="text" id="player-name-${i}" value="Oyuncu ${i + 1}" class="w-full p-2 rounded bg-slate-700 text-white border border-slate-600">
                `;
                playerNamesContainer.appendChild(div);
            }
        }

        function startGame() {
            const playerCount = parseInt(playerCountSelect.value, 10);
            const totalLives = parseInt(livesCountInput.value, 10);
            players = [];
            for (let i = 0; i < playerCount; i++) {
                const nameInput = document.getElementById(`player-name-${i}`);
                players.push({
                    name: nameInput.value || `Oyuncu ${i + 1}`,
                    score: 0,
                    lives: totalLives,
                    isActive: true
                });
            }
            currentPlayerIndex = 0;
            
            document.body.classList.remove('justify-center');
            setupScreen.classList.add('hidden');
            mainGameScreen.classList.remove('hidden');
            
            resizeCanvas();
        }

        // --- Game Core ---
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            table = { x: TABLE_MARGIN, y: 0, width: w - TABLE_MARGIN * 2, height: h };
            const tableWidthCm = 60;
            const coinDiameterCm = 5;
            coinRadius = table.width * (coinDiameterCm / tableWidthCm) / 2;
            goal = { x: table.x + table.width/2 - (table.width * GOAL_WIDTH / 2), y: 0, width: table.width * GOAL_WIDTH, height: 5 };
            
            startNewRound();
        }

        function startNewRound() {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            confettiParticles = [];
            
            const h = canvas.height / (window.devicePixelRatio || 1);
            const startY = h - h * 0.1;

            coins = [
                { id: 0, x: table.x + table.width / 2, y: startY, vx: 0, vy: 0, color: '#c0c0c0', highlight: '#f0f0f0', isFalling: false, scale: 1, hasMoved: false },
                { id: 1, x: table.x + table.width / 2 - coinRadius * 4, y: startY, vx: 0, vy: 0, color: '#b87333', highlight: '#e69138', isFalling: false, scale: 1, hasMoved: false },
                { id: 2, x: table.x + table.width / 2 + coinRadius * 4, y: startY, vx: 0, vy: 0, color: '#ffd700', highlight: '#fff200', isFalling: false, scale: 1, hasMoved: false }
            ];
            
            turnCount = 0;
            gameState = 'playing';
            lastMovedCoinId = null; 

            updateScoreboard();
            hideOverlay();
            gameLoop();
        }

        function gameLoop() {
            update();
            draw();
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        function update() {
            updateConfetti();
            coins.forEach(coin => {
                if (coin.isFalling) {
                    coin.vy += 0.25;
                    coin.scale *= 0.99;
                }
                coin.vx *= FRICTION;
                coin.vy *= FRICTION;
                if (Math.abs(coin.vx) < 0.05) coin.vx = 0;
                if (Math.abs(coin.vy) < 0.05) coin.vy = 0;
                coin.x += coin.vx;
                coin.y += coin.vy;
            });

            for (let i = 0; i < coins.length; i++) {
                for (let j = i + 1; j < coins.length; j++) {
                    const c1 = coins[i]; const c2 = coins[j];
                    if (c1.isFalling || c2.isFalling) continue;
                    const dx = c2.x - c1.x; const dy = c2.y - c1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < coinRadius * 2) {
                        if (gameState === 'playing') {
                            loseRound('Paralar birbirine çarptı!');
                        }
                        if (c1.hasMoved || c2.hasMoved) {
                            c1.hasMoved = true;
                            c2.hasMoved = true;
                        }
                        const overlap = (coinRadius * 2 - distance) / 2;
                        c1.x -= overlap * (dx / distance); c1.y -= overlap * (dy / distance);
                        c2.x += overlap * (dx / distance); c2.y += overlap * (dy / distance);
                        const nx = dx / distance, ny = dy / distance; const tx = -ny, ty = nx;
                        const dpTan1 = c1.vx * tx + c1.vy * ty; const dpTan2 = c2.vx * tx + c2.vy * ty;
                        const dpNorm1 = c1.vx * nx + c1.vy * ny; const dpNorm2 = c2.vx * nx + c2.vy * ny;
                        const m1 = dpNorm2, m2 = dpNorm1;
                        c1.vx = tx * dpTan1 + nx * m1; c1.vy = ty * dpTan1 + ny * m1;
                        c2.vx = tx * dpTan2 + nx * m2; c2.vy = ty * dpTan2 + ny * m2;
                    }
                }
            }

            if (gameState !== 'playing') return;
            
            coins.forEach(coin => {
                const h = canvas.height / (window.devicePixelRatio || 1);
                if (!coin.isFalling && (coin.x < table.x || coin.x > table.x + table.width || coin.y > h)) {
                    coin.isFalling = true;
                    loseRound('Para masadan düştü!');
                }
                if (coin.y - coinRadius < 0) {
                     if (coin.x > goal.x && coin.x < goal.x + goal.width) {
                        winRound(coin);
                     } else {
                        coin.isFalling = true;
                        loseRound('Para masadan düştü!');
                     }
                }
            });
        }
        
        function draw() {
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0, 0, w, h);
            ctx.save();

            ctx.fillStyle = '#a0522d';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetY = 5;
            ctx.fillRect(table.x, table.y, table.width, table.height);
            ctx.shadowColor = 'transparent';
            if (woodPattern) {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = woodPattern;
                ctx.fillRect(table.x, table.y, table.width, table.height);
                ctx.globalAlpha = 1.0;
            }

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(goal.x, goal.y);
            ctx.lineTo(goal.x, goal.y + 20);
            ctx.moveTo(goal.x + goal.width, goal.y);
            ctx.lineTo(goal.x + goal.width, goal.y + 20);
            ctx.stroke();

            coins.forEach(drawCoin);
            
            if (isDragging && selectedCoin) drawAimingLine();

            drawConfetti();

            ctx.restore();
        }

        function drawCoin(coin) {
            const currentRadius = coinRadius * coin.scale;
            if (currentRadius < 1) return;
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(coin.x - currentRadius*0.2, coin.y - currentRadius*0.2, currentRadius*0.1, coin.x, coin.y, currentRadius);
            gradient.addColorStop(0, coin.highlight);
            gradient.addColorStop(1, coin.color);
            ctx.fillStyle = gradient;
            ctx.arc(coin.x, coin.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        function drawAimingLine(){
            ctx.beginPath();
            ctx.moveTo(selectedCoin.x, selectedCoin.y);
            const aimX = selectedCoin.x - (dragEnd.x - dragStart.x);
            const aimY = selectedCoin.y - (dragEnd.y - dragStart.y);
            ctx.lineTo(aimX, aimY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const scaleX = (canvas.width / dpr) / rect.width;
            const scaleY = (canvas.height / dpr) / rect.height;
            const clientX = evt.clientX || (evt.touches && evt.touches[0].clientX);
            const clientY = evt.clientY || (evt.touches && evt.touches[0].clientY);
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        function createConfetti(x, y, count) {
            const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 6 + 3;
                confettiParticles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity - 4, // Initial upward thrust
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 1,
                    lifespan: Math.random() * 80 + 100, // ~1.6s to 3s lifespan
                    size: Math.random() * 6 + 3
                });
            }
        }

        function updateConfetti() {
            for (let i = confettiParticles.length - 1; i >= 0; i--) {
                const p = confettiParticles[i];
                p.vy += 0.1; // Gravity
                p.vx *= 0.99;
                p.x += p.vx;
                p.y += p.vy;
                p.lifespan--;
                p.alpha = p.lifespan / 100;
                if (p.lifespan <= 0) {
                    confettiParticles.splice(i, 1);
                }
            }
        }

        function drawConfetti() {
            confettiParticles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                ctx.restore();
            });
        }

        // --- DOKUNMA VE KAYDIRMA KONTROLÜ ---
        function handleStart(evt) {
            // Bu fonksiyon, oyuncu ekrana dokunduğunda veya fareye tıkladığında çalışır.
            if (gameState !== 'playing') return;
            if (coins.some(c => c.vx !== 0 || c.vy !== 0)) return;

            const pos = getMousePos(evt);
            for (const coin of coins) {
                const dx = coin.x - pos.x; const dy = coin.y - pos.y;
                if (!coin.isFalling && Math.sqrt(dx * dx + dy * dy) < coinRadius) {
                    // Eğer bir paraya dokunulduysa, tarayıcının varsayılan kaydırma işlemini engelle ve vuruş moduna geç.
                    document.body.classList.add('scrolling-disabled');
                    if (turnCount > 0 && coin.id === lastMovedCoinId) {
                        showOverlay('<span class="text-3xl">Aynı parayla üst üste oynayamazsın!</span>', 1500);
                        document.body.classList.remove('scrolling-disabled'); // Re-enable scrolling if the turn is invalid
                        return;
                    }
                    selectedCoin = coin;
                    isDragging = true;
                    dragStart = pos;
                    dragEnd = pos;
                    preFlickHasMovedState = coins.map(c => c.hasMoved);
                    break;
                }
            }
            // Eğer boş bir alana dokunulduysa, preventDefault çağrılmaz ve tarayıcı normal şekilde sayfayı kaydırır.
        }

        function handleMove(evt) {
            // Bu fonksiyon, oyuncu parmağını/fareyi ekranda hareket ettirdiğinde çalışır.
            if (!isDragging) return; // Sadece bir para sürükleniyorsa (vuruş yapılıyorsa) devam et.

            // Eğer bir para sürükleniyorsa, tarayıcının varsayılan kaydırma işlemini engelle.
            evt.preventDefault(); 

            dragEnd = getMousePos(evt);
        }

        function handleEnd(evt) {
            // Bu fonksiyon, oyuncu parmağını ekrandan çektiğinde veya fareyi bıraktığında çalışır.
            if (!isDragging || !selectedCoin) return;

            // Sürükleme bittiğinde kaydırmayı tekrar etkinleştir.
            document.body.classList.remove('scrolling-disabled');
            isDragging = false;
            
            const flickVector = { x: dragEnd.x - dragStart.x, y: dragEnd.y - dragStart.y };
            if(Math.sqrt(flickVector.x**2 + flickVector.y**2) < 10) { selectedCoin = null; return; }

            if (turnCount > 0) {
                const otherCoins = coins.filter(c => c.id !== selectedCoin.id);
                const p0 = { x: selectedCoin.x, y: selectedCoin.y };
                const magnitude = Math.sqrt(flickVector.x**2 + flickVector.y**2) || 1;
                const dirX = flickVector.x / magnitude; const dirY = flickVector.y / magnitude;
                const p1 = { x: selectedCoin.x - dirX * 10000, y: selectedCoin.y - dirY * 10000 };

                if (!checkLineSegmentIntersection(p0, p1, otherCoins[0], otherCoins[1])) {
                    loseRound('Kural İhlali: İki para arasından geçmelisin!');
                    return;
                }
            }
            selectedCoin.vx = -flickVector.x * POWER_MULTIPLIER;
            selectedCoin.vy = -flickVector.y * POWER_MULTIPLIER;
            selectedCoin.hasMoved = true; 
            lastMovedCoinId = selectedCoin.id;
            turnCount++;
            selectedCoin = null;
        }

        function loseRound(reason) {
            if (gameState !== 'playing') return;
            gameState = 'roundOver';
            players[currentPlayerIndex].lives--;
            if (players[currentPlayerIndex].lives <= 0) {
                players[currentPlayerIndex].isActive = false;
            }
            updateScoreboard();
            showOverlay(`Yandın!<br><small class="text-2xl">${reason}</small>`, 2000);
            setTimeout(nextTurn, 2100);
        }
        
        function winRound(scoringCoin) {
            if (gameState !== 'playing') return;
            
            const scoringCoinHadMovedBeforeFlick = preFlickHasMovedState[scoringCoin.id];

            if (scoringCoinHadMovedBeforeFlick) {
                gameState = 'roundOver';
                players[currentPlayerIndex].score++;
                updateScoreboard();

                // --- GOAL CELEBRATION ---
                const w = canvas.width / (window.devicePixelRatio || 1);

                // Central burst from the goal
                createConfetti(scoringCoin.x, scoringCoin.y + 20, 150); // Initial big burst
                setTimeout(() => createConfetti(scoringCoin.x, scoringCoin.y + 20, 100), 300);
                setTimeout(() => createConfetti(scoringCoin.x, scoringCoin.y + 20, 100), 600);

                // 6 additional bursts from the top for a 'rain' effect
                setTimeout(() => createConfetti(w * 0.1, 50, 50), 100);
                setTimeout(() => createConfetti(w * 0.9, 50, 50), 250);
                setTimeout(() => createConfetti(w * 0.3, 50, 50), 400);
                setTimeout(() => createConfetti(w * 0.7, 50, 50), 550);
                setTimeout(() => createConfetti(w * 0.5, 50, 50), 700);
                setTimeout(() => createConfetti(w * 0.2, 50, 50), 850);

                const goalText = 'GoOoOoL!';
                const animatedGoalText = goalText.split('').map((char, index) => {
                    const delay = index * 0.07 + 's';
                    return `<span class="bouncing-letter" style="animation-delay: ${delay};">${char}</span>`;
                }).join('');
                
                showOverlay(`<div class="text-6xl font-bold text-white text-shadow">${animatedGoalText}</div>`, 2000);
                // --- END CELEBRATION ---

                setTimeout(nextTurn, 2100);
            } else {
                loseRound("Kural İhlali: Başlangıçtan direk gol atılamaz!");
            }
        }
        
        function checkEndGameConditions() {
            const activePlayers = players.filter(p => p.isActive);
            const eliminatedPlayers = players.filter(p => !p.isActive);

            if (activePlayers.length === 0) {
                endGame();
                return true;
            }

            if (activePlayers.length === 1 && eliminatedPlayers.length > 0) {
                const lastPlayer = activePlayers[0];
                const maxEliminatedScore = Math.max(...eliminatedPlayers.map(p => p.score));
                
                if (lastPlayer.score > maxEliminatedScore) {
                    endGame();
                    return true;
                }
            }

            return false;
        }

        function nextTurn() {
            if (checkEndGameConditions()) {
                return;
            }
            
            let nextIndex = (currentPlayerIndex + 1) % players.length;
            while (!players[nextIndex].isActive) {
                nextIndex = (nextIndex + 1) % players.length;
            }
            currentPlayerIndex = nextIndex;
            startNewRound();
        }

        function endGame() {
            gameState = 'gameOver';
            let winner = players[0];
            for (let i = 1; i < players.length; i++) {
                if (players[i].score > winner.score) {
                    winner = players[i];
                }
            }
            
            const winners = players.filter(p => p.score === winner.score);
            let message;
            if (winners.length > 1) {
                message = `Oyun Bitti!<br><small class="text-2xl">Berabere!</small>`;
            } else {
                message = `Oyun Bitti!<br><small class="text-2xl">Kazanan: ${winner.name}</small>`;
            }
            
            showOverlay(message);
            restartButton.classList.remove('hidden');
        }

        function updateScoreboard() {
            playerList.innerHTML = ''; // Clear old list

            players.forEach((player, index) => {
                const playerDiv = document.createElement('div');
                playerDiv.className = `p-3 rounded-lg transition-all duration-300 ${index === currentPlayerIndex ? 'bg-amber-500/30 border-l-4 border-amber-400' : 'bg-slate-700/50'}`;
                
                let statusText = player.isActive ? `Can: ${player.lives}` : '<span class="text-red-500 font-bold">ELENDİ</span>';

                playerDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-lg ${index === currentPlayerIndex ? 'text-amber-300' : 'text-white'}">${player.name}</span>
                        <span class="font-bold text-xl text-white">${player.score}</span>
                    </div>
                    <div class="text-right text-sm ${index === currentPlayerIndex ? 'text-amber-200' : 'text-slate-400'}">${statusText}</div>
                `;
                playerList.appendChild(playerDiv);
            });
        }

        function showOverlay(message, duration = 0) {
            overlayText.innerHTML = message;
            gameOverlay.classList.remove('hidden');
            if (duration > 0) setTimeout(hideOverlay, duration);
        }

        function hideOverlay() {
            gameOverlay.classList.add('hidden');
            restartButton.classList.add('hidden');
        }
        
        function checkLineSegmentIntersection(p0, p1, pA, pB) {
            function orientation(p, q, r) {
                const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
                if (Math.abs(val) < 1e-9) return 0;
                return (val > 0) ? 1 : 2;
            }
            const o1 = orientation(p0, p1, pA); const o2 = orientation(p0, p1, pB);
            const o3 = orientation(pA, pB, p0); const o4 = orientation(pA, pB, p1);
            if (o1 !== o2 && o3 !== o4) return true;
            return false;
        }
        
        // --- Event Listeners ---
        playerCountSelect.addEventListener('change', updatePlayerNameInputs);
        startGameButton.addEventListener('click', startGame);
        restartButton.addEventListener('click', () => {
            document.body.classList.add('justify-center');
            mainGameScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
        });
        
        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('mouseleave', handleEnd);
        canvas.addEventListener('touchstart', handleStart);
        canvas.addEventListener('touchmove', handleMove);
        canvas.addEventListener('touchend', handleEnd);
        canvas.addEventListener('touchcancel', handleEnd);
        
        let lastWidth = 0, lastHeight = 0;
        window.addEventListener('resize', () => {
            if (gameState === 'setup') return;
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            const newWidth = rect.width * dpr;
            const newHeight = rect.height * dpr;

            if (newWidth !== lastWidth || newHeight !== lastHeight) {
                lastWidth = newWidth;
                lastHeight = newHeight;
                resizeCanvas();
            }
        });

        // --- Initial Load ---
        window.onload = () => {
            updatePlayerNameInputs();
            const woodTexture = new Image();
            woodTexture.src = 'https://www.transparenttextures.com/patterns/wood-pattern.png';
            woodTexture.onload = () => {
                woodPattern = ctx.createPattern(woodTexture, 'repeat');
            };
            woodTexture.onerror = () => {
                console.error("Ahşap dokusu yüklenemedi.");
            }
        };
