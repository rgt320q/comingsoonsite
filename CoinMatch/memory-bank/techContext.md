# Teknik Bağlam

## Ana Teknolojiler

- **Frontend:** HTML5, CSS3, JavaScript (ES6+) - Vanilla JS, framework yok
- **Grafikler:** HTML5 Canvas 2D API'si, oyun tahtasını, paraları ve nişan alma çizgisini render etmek için kullanılıyor.
- **Styling:** Proje, modern ve duyarlı bir arayüz için **Tailwind CSS** framework'ünü kullanmaktadır. Tailwind, bir CDN üzerinden projeye dahil edilmiştir.
- **Backend:** Firebase Realtime Database (NoSQL)
- **Authentication:** Firebase Authentication (Email/Password)
- **Hosting:** Firebase Hosting

## Bağımlılıklar

- **Firebase SDK 8.10.1:** Realtime Database, Authentication
- **Tailwind CSS:** Stil altyapısı için `https://cdn.tailwindcss.com`
- **Google Fonts:** 'Inter' font ailesi
- **Texture:** Ahşap doku için transparenttextures.com

## Kod Yapısı

- **`CoinMatch.html`:** Online multiplayer oyun (Firebase entegrasyonlu)
  - Profil ekranı: Kullanıcı profili yönetimi (ad, soyad, takma ad, telefon, şifre değiştirme)
  - Display preference: Gerçek ad vs takma ad seçimi
- **`Game.html`:** Offline local oyun (hot-seat, 1-4 oyuncu)
- **`css/style.css`:** Custom CSS (animasyonlar, gol efektleri)
- **`js/main.js`:** Ana oyun mantığı (3400+ satır)
  - Game Manager (rendering, input handling, state management)
  - Session Manager (auth, lobby, game flow)
  - Profile Manager (user profiles, display names, password change)
  - Presence Tracker (player disconnect detection, initialization guard)
  - Chat Manager (in-game messaging, real-time sync)
  - Stats Tracker (game timers, player turn times, match statistics)
  - Physics Simulation (host ve client, deterministic)
  - Coin Image Manager (6-image loading, random assignment, circular rendering)
  - Fireworks animation
  - Overlay management (game over, messages, turn-based watcher)
  - Role identification (host/client badges)
  - Error handling (Turkish localized auth errors)
  - Disconnect handling (game status listener, cleanup system)
  - Message rendering (chat bubbles, timestamps, auto-scroll)
  - Rematch system (button lifecycle, listener management, UI state)
  - Scoreboard optimization (DOM reuse, 20x performance boost)
- **`database.rules.json`:** Firebase security rules (kullanıcı profilleri + presence tracking + chat dahil)
- **`firebase-config.js`:** Firebase yapılandırması (gitignore'da)

## Performans Optimizasyonları

1. **Client-Side Physics:**
   - Her client kendi fizik motorunu çalıştırıyor
   - 60 FPS local simulation
   - Zero latency

2. **Network:**
   - Sadece flick data gönderiliyor (~50 bytes)
   - Pozisyon sync kaldırıldı
   - %99 trafik tasarrufu
   - Presence tracking ile minimal overhead

3. **Rendering:**
   - requestAnimationFrame (60 FPS)
   - Canvas double buffering
   - Efficient draw calls
   - Football goal visual (net pattern 8px grid)
   - Overlay system (game over, messages, turn-based filter)
   - Ancient coin textures (6 different images, random per game)
   - Circular clipping paths for perfect coin shape
   - Cover mode scaling (fills entire circle)

4. **Physics:**
   - Deterministic simulation (FRICTION=0.985)
   - Side-aware post collision (`Math.sign(dx)`)
   - Resolution-independent calculations (LOGICAL_WIDTH ratios)
   - No crossbar collision (goals can be scored)

5. **Firebase:**
   - Throttled writes (sadece final sonuçlar)
   - Listener optimization (6 ayrı listener: game, gameState, gameStatus, flick, ack, chat)
   - Role persistence (hostUid field)
   - Automatic stale game cleanup
   - Presence tracking (onDisconnect hooks)
   - Grace period (5s) ile false-positive önleme
   - Chat messages (limitToLast(50) ile son 50 mesaj)

6. **Memory Management:**
   - Cleanup functions (listeners, timers, physics)
   - presenceListeners dictionary
   - presenceInitialized tracking
   - chatListener cleanup
   - rematchListener management (single instance)
   - Proper listener removal on disconnect
   - Chat messages DOM clear on cleanup
   - Game stats object lifecycle (start/stop/reset)

7. **UI Performance:**
   - Scoreboard DOM reuse (data-player-uid attributes)
   - textContent updates instead of innerHTML rebuild
   - 20x performance improvement (100ms → 5ms)
   - Rematch status container show/hide optimization
   - Overlay state management (grey filter, messages)

## Oyun İstatistikleri ve Zamanlama

### Timer Architecture
```javascript
window.gameStats = {
    started: false,
    gameStartTime: null,          // Game başlangıç timestamp'i
    currentTurnStartTime: null,   // Aktif turun başlangıç timestamp'i
    playerTurnTimes: {},          // {uid: milliseconds} birikimli süreler
    currentTurnUid: null,         // Şu anda sırası olan oyuncu
    timerInterval: null           // 1 saniyelik UI update interval'i
}
```

### Timer Lifecycle
1. **startGameTimers(players, currentPlayerIndex):**
   - Oyun başında veya rematch'te çağrılır
   - Otomatik reset (eğer zaten başlatılmışsa)
   - İlk oyuncunun timer'ını başlatır
   - 1 saniyelik interval ile UI günceller

2. **trackTurnChange(state):**
   - Her state değişikliğinde çağrılır
   - Önceki oyuncunun elapsed time'ını kaydeder
   - Yeni oyuncunun timer'ını başlatır
   - Coin state değişikliklerini takip eder

3. **stopGameTimers():**
   - Oyun bittiğinde çağrılır
   - Son oyuncunun time'ını finalize eder
   - Interval'i durdurur (ama timers'ı sıfırlamaz)
   - updatePlayerStats tarafından çağrılır

4. **resetGameTimers():**
   - Yeni oyun için tam sıfırlama
   - Tüm değerleri initial state'e döndürür
   - Started flag'i false yapar

### Stats Data Structure (Firebase)
```javascript
users/{uid}/stats = {
    totalPoints: number,      // 3 puan kazanma, 1 puan beraberlik
    totalGameTime: number,    // Milliseconds
    totalTurnTime: number,    // Milliseconds
    gamesPlayed: number,
    wins: number,
    draws: number
}
```

### Critical Timer Fixes
- **Accuracy:** Total time = Sum of player times (37s discrepancy fixed)
- **Final Turn:** Last player's active time included in game over
- **State Sync:** Coins update on 'playing' and 'awaiting_ack' regardless of physicsTimer
- **Deep Copy:** Client simulation uses JSON.parse(JSON.stringify()) to avoid reference issues

## Rematch System

### State Management
```javascript
games/{gameCode}/rematchReady/{uid} = boolean
```

### Button Lifecycle
1. **Game Over:** Button shown, calls `resetRematchButton()`
   - Text: "Hazırım"
   - State: enabled
   - Style: Green gradient, pulse animation
   - Container: hidden

2. **Click:** User clicks "Hazırım"
   - Text: "Hazır! ✓"
   - State: disabled
   - Style: Blue gradient, no animation
   - Firebase: `rematchReady/{uid} = true`

3. **Waiting:** Shows status cards
   - Green card: Ready players
   - Grey card: Waiting players
   - Real-time updates via `updateRematchStatus()`

4. **All Ready:** Game starts automatically
   - Firebase: `rematchReady` node removed
   - Listener receives null → Container hidden
   - `updateState()` → Container hidden (redundant safety)

### Listener Management
- Single `rematchListener` (global variable)
- Old listener removed before new one added
- Prevents listener multiplication
- Proper cleanup on game end

### Infinite Rematch Support
- Button resets every game over
- Firebase state cleaned every new game
- UI synchronized across all clients
- Players can rematch indefinitely until disconnect

