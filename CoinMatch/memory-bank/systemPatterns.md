# Sistem Desenleri

## Mimari Yaklaşım

Proje, **Client-Side Prediction with Server-Side Validation** mimarisini kullanmaktadır. Bu, modern multiplayer oyunlarda (Rocket League, FIFA, Call of Duty) kullanılan profesyonel bir yaklaşımdır.

## Temel Desenler

### 1. Client-Side Physics Simulation (Deterministik)

**Önceki Yaklaşım (Kaldırıldı):**
- Host her frame pozisyon hesaplıyor
- Firebase'e 30 FPS ile yazıyor
- Client interpolation ile smooth yapmaya çalışıyor
- Sonuç: Titreme, kayma, gecikme

**Yeni Yaklaşım (Mevcut):**
```
Oyuncu Hamle Yapar:
├─ Flick Data Firebase'e yazılır { coinId, vx, vy, madeBy }
├─ TÜM OYUNCULAR flick'i alır
├─ HER OYUNCU kendi fizik simülasyonunu çalıştırır
├─ Deterministik fizik → Aynı input = Aynı sonuç
└─ Host final sonucu (gol/faul) Firebase'e yazar
```

**Avantajlar:**
- 60 FPS smooth her iki tarafta
- Zero latency (local simulation)
- %99 daha az network trafiği
- Titreme/jitter yok
- Professional oyun hissi

### 2. Host-Authoritative Game Logic

- **Client:** Fizik simülasyonu çalıştırır, görsel feedback sağlar
- **Host:** Fizik simülasyonu + kural kontrolü + final karar
- Uyumsuzluk durumunda Host'un kararı geçerlidir

### 3. Acknowledgment-Based Turn System

1. Hamle tamamlanır → Host final sonucu yazar
2. `status: 'awaiting_ack'` ile oyun durur
3. Sırası olan oyuncu "Tamam" butonuna basar
4. Host sırayı bir sonraki oyuncuya geçirir
5. Paraları başlangıç pozisyonuna sıfırlar

### 4. Firebase Data Structure

```javascript
games/{gameId}:
  ├─ host: "uid"
  ├─ status: "lobby" | "in-progress" | "ended" | "gameOver"
  ├─ endReason: "player_disconnected" | null
  ├─ disconnectedPlayer: "uid" | null
  ├─ players: { uid: { email, ready, displayName, ... } }
  ├─ presence: { uid: true | null } // Real-time bağlantı durumu
  ├─ chat: { messageId: { uid, senderName, text, timestamp } } // In-game mesajlaşma
  ├─ activeFlick: { coinId, vx, vy, madeBy } // Tüm oyuncular dinliyor
  ├─ acknowledgedTurn: "uid" // ACK sistemi
  └─ gameState:
      ├─ status: "playing" | "simulating" | "awaiting_ack"
      ├─ players: [{ uid, name, score, lives, ... }]
      ├─ coins: [{ id, x, y, vx, vy, color, ... }]
      ├─ currentPlayerIndex: 0
      ├─ lastMovedCoinId: null
      └─ overlayMessage: { text, type, requiresAck }
```

### 5. Player Presence Tracking

**Pattern:** Firebase Realtime Presence + Initialization Guard

```javascript
// Setup
presenceRef.set(true);
presenceRef.onDisconnect().remove();

// Tracking
presenceInitialized[uid] = false; // İlk değer
presenceRef.on('value', snapshot => {
  if (snapshot.val() === true) {
    presenceInitialized[uid] = true; // Initialize
  } else if (presenceInitialized[uid] && snapshot.val() === null) {
    handlePlayerDisconnect(uid); // Gerçek disconnect
  }
});

// Grace Period
setTimeout(() => {
  if (!presenceInitialized[uid]) {
    presenceInitialized[uid] = true; // Timeout ile initialize
  }
}, 5000);
```

**Flow:**
```
Oyun Başladı
  ↓
trackPlayerPresence() aktif
  ↓
Her oyuncu presence = true
  ↓
presenceInitialized[uid] = true
  ↓
[Oyun devam ediyor...]
  ↓
Oyuncu disconnect
  ↓
Firebase: presence = null (otomatik)
  ↓
presenceInitialized === true → Gerçek disconnect!
  ↓
game.status = 'ended'
  ↓
gameStatusListener → Tüm oyuncular algılıyor
  ↓
Ana menüye dön
```

**False-Positive Önleme:**
- İlk `null` değeri ignore edilir (henüz initialize olmamış)
- Sadece `presenceInitialized === true` olan oyuncular için disconnect algılanır
- 5 saniyelik grace period

### 6. Physics Engine (Deterministik)

- **FRICTION:** 0.985 (her frame)
- **Coin Radius:** Table width × 0.05 (5cm / 60cm)
- **Goal Width:** Table width × 0.3
- **Collision:** Elastic collision with velocity exchange
- **Goal Physics:** Sticky goal + bounce back + side walls
- **60 FPS:** setInterval(1000/60)

### 7. In-Game Chat System

**Pattern:** Real-Time Messaging with Firebase Child Events

```javascript
// Setup (oyun başladığında)
setupChatListener(gameCode) {
  chatRef = database.ref(`games/${gameCode}/chat`);
  chatRef.limitToLast(50).on('child_added', displayChatMessage);
}

// Send Message
sendChatMessage(text) {
  chatRef.push({
    uid: currentUser.uid,
    senderName: displayName,
    text: escapeHtml(text.trim()),
    timestamp: ServerValue.TIMESTAMP
  });
}

// Display
displayChatMessage(message) {
  // Kendi mesajları: sağda, amber
  // Diğerleri: solda, slate
  // Auto-scroll to bottom
}

// Cleanup
cleanupChatListener() {
  chatRef.off('child_added');
  chatMessages.innerHTML = '';
}
```

**Flow:**
```
Oyun Başladı
  ↓
setupChatListener(gameCode)
  ↓
[Oyuncu mesaj yazar]
  ↓
Form submit → sendChatMessage()
  ↓
Firebase: chat/{pushId} ← message
  ↓
child_added event (TÜM oyuncular)
  ↓
displayChatMessage() → UI render
  ↓
Auto-scroll to bottom
  ↓
[Oyun devam eder...]
  ↓
Ana Menü / Oyun Bitti
  ↓
cleanupChatListener()
```

**Security:**
- Database rules: Sadece game participants yazabilir
- Message validation: uid, senderName, text, timestamp zorunlu
- Text length: 0-200 karakter (client + server side)
- HTML escaping: XSS saldırılarını önler

**UX Details:**
- Son 50 mesaj gösterilir (`limitToLast(50)`)
- Timestamp format: HH:MM (tr-TR locale)
- FadeIn animasyonu (0.3s ease-out)
- Scrollable container (300px height)
- Empty message submit engellenmiş

### 8. Security Patterns

- Firebase Database Rules ile permission kontrolü
- Client-side validation + Host-side validation
- `activeFlick` sadece oyundaki oyuncular yazabilir
- `gameState` sadece oyundaki oyuncular değiştirebilir
- `presence` her oyuncu sadece kendi UID'sini yazabilir
- `chat` sadece game participants yazabilir, message validation zorunlu
- HTML escaping ile XSS prevention
- API keys `.gitignore` ile korunuyor

### 9. Timer and Stats Management Pattern

**Architecture:** Client-side tracking + Server-side persistence

```javascript
// Global State
window.gameStats = {
    started: false,
    gameStartTime: null,
    currentTurnStartTime: null,
    playerTurnTimes: {},  // {uid: ms}
    currentTurnUid: null,
    timerInterval: null
}

// Lifecycle
startGameTimers(players, currentPlayerIndex) {
  // Auto-reset if already started
  if (window.gameStats.started) resetGameTimers();
  
  // Initialize
  window.gameStats.gameStartTime = Date.now();
  window.gameStats.currentTurnUid = players[currentPlayerIndex].uid;
  window.gameStats.currentTurnStartTime = Date.now();
  
  // Start UI updates (1 second interval)
  window.gameStats.timerInterval = setInterval(updateGameTimerUI, 1000);
}

trackTurnChange(state) {
  // Save previous player's time
  const elapsed = Date.now() - window.gameStats.currentTurnStartTime;
  window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] += elapsed;
  
  // Start new turn
  window.gameStats.currentTurnUid = newTurnUid;
  window.gameStats.currentTurnStartTime = Date.now();
}

stopGameTimers() {
  // Finalize last player's time
  if (window.gameStats.currentTurnUid) {
    const elapsed = Date.now() - window.gameStats.currentTurnStartTime;
    window.gameStats.playerTurnTimes[window.gameStats.currentTurnUid] += elapsed;
  }
  clearInterval(window.gameStats.timerInterval);
}

updatePlayerStats(gameCode, state) {
  stopGameTimers();  // Finalize times
  
  // Firebase transaction for atomic updates
  database.ref(`users/${uid}/stats`).transaction(stats => {
    return {
      totalPoints: (stats?.totalPoints || 0) + points,
      totalGameTime: (stats?.totalGameTime || 0) + gameTime,
      totalTurnTime: (stats?.totalTurnTime || 0) + turnTime,
      gamesPlayed: (stats?.gamesPlayed || 0) + 1,
      wins: (stats?.wins || 0) + (isWinner ? 1 : 0),
      draws: (stats?.draws || 0) + (isDraw ? 1 : 0)
    };
  });
}
```

**Critical Fix:** Timer accuracy
```javascript
// BEFORE: Last player's time was missing
getNextStateForTurnEnd(state) {
  // ... overlay message calculation
  const totalGameTime = Date.now() - gameStartTime;
  // Problem: Current turn time not included!
}

// AFTER: Finalize before calculating
getNextStateForTurnEnd(state) {
  // Finalize current turn BEFORE message
  if (window.gameStats.currentTurnUid) {
    const elapsed = Date.now() - window.gameStats.currentTurnStartTime;
    window.gameStats.playerTurnTimes[currentTurnUid] += elapsed;
  }
  
  // Now total = sum of player times ✅
  const totalGameTime = Date.now() - gameStartTime;
}
```

### 10. State Synchronization Pattern

**Problem:** Client'ta physicsTimer aktifken coinler güncellenmiyor

```javascript
// BEFORE: Bug
updateState(newState) {
  if (newState.coins && !this.physicsTimer) {
    this.coins = newState.coins;  // Only when idle!
  }
}

// AFTER: Fixed
updateState(newState) {
  const shouldUpdateCoins = newState.coins && (
    !this.physicsTimer ||           // Idle
    newState.status === 'playing' ||     // New turn started
    newState.status === 'awaiting_ack'   // Turn ended
  );
  
  if (shouldUpdateCoins) {
    // Deep copy to avoid reference issues
    this.coins = JSON.parse(JSON.stringify(newState.coins));
    this.draw();
  }
}
```

**Critical States:**
- `playing`: New turn, reset coin positions
- `awaiting_ack`: Turn ended, show final positions
- `simulating`: Don't update (physics running)

### 11. Rematch System Pattern

**Architecture:** Button lifecycle + Listener management + UI state

```javascript
// Single Global Listener (prevents multiplication)
let rematchListener = null;

// Button Reset (every game over)
resetRematchButton() {
  rematchButton.innerHTML = "Hazırım";
  rematchButton.disabled = false;
  rematchButton.classList = "green gradient pulse";
  
  statusContainer.classList.add('hidden');
  statusContainer.innerHTML = '';
}

// Listener Setup (with cleanup)
listenForRematch(gameCode) {
  const rematchRef = database.ref(`games/${gameCode}/rematchReady`);
  
  // Remove old listener (prevent duplication)
  if (rematchListener) {
    rematchRef.off('value', rematchListener);
  }
  
  rematchListener = rematchRef.on('value', snapshot => {
    const rematchReady = snapshot.val();
    
    // Case 1: No data (game started)
    if (!rematchReady) {
      statusContainer.classList.add('hidden');
      return;
    }
    
    // Case 2: Update UI (who is ready)
    window.gameManager.updateRematchStatus(rematchReady);
    
    // Case 3: All ready (start new game)
    if (allPlayersReady) {
      const newState = {
        status: 'playing',
        players: resetPlayers,
        coins: resetCoins,
        // ... reset all game state
      };
      
      gameStateRef.set(newState);
      rematchRef.remove();  // Trigger Case 1 for all clients
    }
  });
}

// UI State Cleanup (3 places)
// 1. resetRematchButton() - Button resets
// 2. updateState() - gameOver → playing transition
// 3. listenForRematch() - rematchReady = null
```

**Flow:**
```
Game Over
  ↓
showOverlay(gameOver) → resetRematchButton()
  ↓
[Player 1 clicks "Hazırım"]
  ↓
rematchReady/{uid1} = true
  ↓
updateRematchStatus() → Green card for Player 1
  ↓
[Player 2 clicks "Hazırım"]
  ↓
rematchReady/{uid2} = true
  ↓
All ready detected → New game starts
  ↓
rematchRef.remove()
  ↓
Listener receives null → Hide container
  ↓
updateState(playing) → Force hide container
  ↓
resetRematchButton() → Clear button
  ↓
Game starts fresh ✅
```

**Critical Fixes:**
1. Button state reset every game over
2. Single listener (no multiplication)
3. Triple cleanup (button, state transition, listener)
4. Infinite rematch support

### 12. Immediate Foul Detection Pattern

**Problem:** Fouls detected after simulation ends, allowing goals after collisions

**Architecture:** Early exit pattern with instant Firebase writes

```javascript
// BEFORE: Collision detected but simulation continues
for (let i = 0; i < coins.length; i++) {
    for (let j = i + 1; j < coins.length; j++) {
        if (dist < COIN_RADIUS * 2) {
            simState.collisionOccurred = true;  // Flag it
            // Apply physics, continue simulation
        }
    }
}
// Later: Check flag, determine outcome
// Problem: Coin might score goal before check!

// AFTER: Immediate stop on collision
for (let i = 0; i < coins.length; i++) {
    for (let j = i + 1; j < coins.length; j++) {
        if (dist < COIN_RADIUS * 2) {
            if (gameRules.collisionFoul) {
                // STOP EVERYTHING IMMEDIATELY
                clearInterval(gm.physicsTimer);
                gm.stopLocalRender();
                
                player.lives--;
                
                database.ref(`games/${gameCode}/gameState`).set({
                    status: 'awaiting_ack',
                    overlayMessage: { text: 'Faul:<br>Çarpışma', type: 'foul' }
                });
                
                return; // EXIT NOW
            }
        }
    }
}
```

**Flow:**
```
Flick detected
  ↓
Physics simulation starts (both Host & Client)
  ↓
Collision detected (same frame on both sides)
  ↓
[HOST]                           [CLIENT]
  ↓                                ↓
Stop physics immediately          Stop physics immediately
  ↓                                ↓
Write foul to Firebase            Wait for Host decision
  ↓                                ↓
Exit simulation                   Exit simulation
  ↓                                ↓
───────────────────────────────────
  ↓
All clients receive foul state
  ↓
Show foul overlay + animation
  ↓
No goal possible ✅
```

**Foul Priority:**
1. **Collision** - Highest (immediate stop)
2. **Fall** - High (immediate stop)
3. **Other fouls** - Checked after simulation ends

**Client Synchronization:**
- Client also stops on collision detection
- Waits for authoritative Host result
- Deterministic: Both detect at same frame

**Benefits:**
- ✅ Collision > Goal priority enforced
- ✅ No physics waste after foul
- ✅ Instant visual feedback
- ✅ Consistent with real game rules

### 13. Foul Animation System Pattern

**Architecture:** Type-based animation generation + Lifecycle management

```javascript
// Animation Container (HTML)
<div id="overlay-animation"></div>

// Smart Animation Selection
getFoulAnimation(message) {
    if (message.includes('Çarpışma')) {
        return `<div class="collision-animation">
            <div class="collision-coin-left"></div>
            <div class="collision-coin-right"></div>
        </div>`;
    }
    if (message.includes('masadan düştü')) {
        return `<div class="fall-animation">
            <div class="fall-coin"></div>
            <div class="fall-table-edge"></div>
        </div>`;
    }
    // ... more animations
}

// Lifecycle Management
showOverlay(message, type) {
    // 1. Clear old animation
    overlayAnimation.innerHTML = '';
    
    // 2. Add new animation if foul
    if (type === 'foul') {
        overlayAnimation.innerHTML = getFoulAnimation(message);
    }
    
    // 3. Show overlay
    overlayText.innerHTML = message;
    gameOverlay.classList.remove('hidden');
}

// Cleanup in 4 places:
// 1. New message → Clear + Add new
// 2. Overlay hidden → Clear
// 3. Turn change → Clear (watcher mode)
// 4. New game → Clear
```

**Animation Types:**

1. **Collision (💥):**
   - Two coins moving toward each other
   - Infinite loop, 0.6s per cycle
   - Gold + Bronze gradients

2. **Fall (🪂):**
   - Coin falling + rotating
   - Table edge visual
   - 1.5s loop, 360° rotation

3. **Direct Goal (🎯):**
   - Coin shooting to goal net
   - Net pattern visualization
   - 1s ease-out loop

4. **Path Foul (🚫):**
   - Moving coin between static coins
   - Horizontal zigzag
   - 2s ease-in-out loop

5. **All Coins (🎲):**
   - Three floating coins
   - Staggered delays
   - 1.5s loop per coin

**CSS Pattern:**
```css
@keyframes foul-animation {
    0% { /* start state */ }
    50% { /* peak state */ }
    100% { /* end state */ }
}

.foul-element {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, color1, color2, color3);
    box-shadow: 0 4px 10px rgba(color, 0.5);
    animation: foul-animation duration timing infinite;
}
```

**Lifecycle States:**
```
[Idle] → Foul occurs → [Animation Active] → ACK clicked → [Cleanup] → [Idle]
   ↑                                                                      ↓
   └──────────────────────── Next foul ─────────────────────────────────┘
```

**Benefits:**
- ✅ Visual feedback for each foul type
- ✅ No scroll bars (fixed height)
- ✅ Smooth infinite animations
- ✅ Automatic cleanup (no memory leaks)
- ✅ Mobile-friendly (50px coins)
- ✅ Professional UX