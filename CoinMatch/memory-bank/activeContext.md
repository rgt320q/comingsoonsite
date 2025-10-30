# Aktif Bağlam

## Son Tamamlanan İşlem (2025-10-29)

- **Antik Para Görselleri Sistemi Eklendi:**
  - 6 farklı antik para görseli (ancient-coin01.png - ancient-coin06.png)
  - Her oyun başında rastgele atama sistemi
  - Aynı oyundaki 3 para için farklı görseller (duplicate prevention)
  - Circular clipping ile perfect fit
  - Cover mode scaling (görseller tam olarak para dairesini dolduruyor)
  - Fallback: Görseller yüklenemezse gradient rendering

## Mevcut Durum

**Oyun Production-Ready:** Tüm kritik bug'lar çözüldü, disconnect handling aktif, in-game chat çalışıyor, antik para görselleri eklendi, uygulama stabil.

### Antik Para Görselleri Sistemi

**Özellikler:**
- 6 farklı antik para görseli (images/ancient-coin01.png - ancient-coin06.png)
- Her yeni oyun başladığında rastgele atama
- Duplicate prevention: Aynı oyundaki 3 para farklı görsellere sahip
- Circular clipping: Görseller mükemmel daire şeklinde kesiliyor
- Cover mode: Görseller para dairesini tam olarak dolduruyor
- Fallback: Yükleme hatası durumunda gradient rendering

**Core Functions:**
```javascript
loadCoinImages()              // 6 görseli asenkron yükler
assignRandomCoinImages()      // Rastgele atama (duplicate prevention)
drawCoin(coin)                // Atanmış görseli circular clip ile render eder
drawGradientCoin(coin)        // Fallback gradient rendering
```

**Data Structures:**
```javascript
gameManager.coinImages = []                 // Array of 6 HTMLImageElement
gameManager.coinImageAssignments = {}       // { coinId: imageIndex }
gameManager.imagesLoaded = false            // Loading status
```

**Random Assignment Algorithm:**
```javascript
const availableIndices = [0, 1, 2, 3, 4, 5];  // 6 görsel
for (let coinId = 0; coinId < 3; coinId++) {
    const randomIdx = Math.floor(Math.random() * availableIndices.length);
    const imageIndex = availableIndices[randomIdx];
    availableIndices.splice(randomIdx, 1);  // Remove to prevent duplicates
    this.coinImageAssignments[coinId] = imageIndex;
}
```

**Rendering Implementation:**
```javascript
drawCoin(coin) {
    const imageIndex = this.coinImageAssignments[coin.id] || 0;
    const image = this.coinImages[imageIndex];
    
    // Circular clipping path
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.clip();
    
    // Cover mode scaling
    const scale = Math.max(diameter / imgW, diameter / imgH);
    ctx.drawImage(image, dx, dy, drawW, drawH);
}
```

**Integration:**
- `handleStartGame()`: Oyun başladığında `assignRandomCoinImages()` çağrılıyor
- Console logging: `🎲 Coin 0 assigned image 3` (debug için)
- Error handling: Her görsel için `onerror` handler
- Partial load support: Bazı görseller yüklenmese de devam ediyor

### In-Game Chat Sistemi

**Özellikler:**
- Real-time mesajlaşma (Firebase Realtime Database)
- Son 50 mesaj gösterimi
- Kendi mesajları sağda (amber), diğerleri solda (slate)
- Sender name + timestamp (HH:MM)
- 200 karakter limiti
- Otomatik scroll to bottom
- FadeIn animasyonu

**Core Functions:**
```javascript
setupChatListener(gameCode)   // Firebase listener setup
sendChatMessage(text)          // Mesaj gönderme
displayChatMessage(message)    // UI rendering
cleanupChatListener()          // Listener cleanup
escapeHtml(text)               // XSS prevention
```

**Firebase Structure:**
```
games/{gameCode}/chat/{messageId}
  ├── uid: "sender-uid"
  ├── senderName: "Display Name"
  ├── text: "Message content"
  └── timestamp: ServerValue.TIMESTAMP
```

**Security:**
- Database rules: Sadece game participants yazabilir
- Message validation: uid, senderName, text, timestamp zorunlu
- Text length: 0-200 karakter
- HTML escaping ile XSS koruması

**Integration:**
- `handleStartGame()` → Chat listener başlıyor
- Oyuna geri dönüşte (rejoin) → Chat listener yeniden aktif
- `handleReturnToMainMenu()` → Cleanup
- Form submit → Enter tuşu desteği
- `getUserDisplayName()` ile profil sistemi entegrasyonu

**UI Details:**
- Chat box: bg-slate-900/50, rounded, flex column
- Header: "Sohbet" + chat icon
- Messages area: Scrollable, space-y-2
- Input form: 200 char limit, placeholder "Mesaj yaz..."
- Send button: SVG send icon, amber background

### Player Disconnect Detection Sistemi

**Sorun:**
- Oyuncu bağlantısı koptuğunda oyun kilitleniyordu
- Rakip oyuncu çıktığında diğer oyuncu sonsuz bekliyordu
- Uygulama ne yapacağını bilemiyordu

**Çözüm - Presence Tracking:**
- Her oyuncu `games/{gameCode}/presence/{uid}` node'una `true` yazıyor
- Firebase `onDisconnect()` ile otomatik cleanup
- Bağlantı koparsa presence otomatik `null` oluyor
- Tüm oyuncular birbirinin presence'ını real-time izliyor

**Initialization Guard:**
```javascript
let presenceInitialized = {};
// İlk null = henüz initialize olmamış → ignore
// İkinci null = gerçek disconnect → alarm!
```
- False-positive önleniyor
- 5 saniyelik grace period
- Oyun başlangıcında hemen atılma sorunu çözüldü

**Game Status Listener:**
- Client'lar `games/{gameCode}/status` dinliyor
- `status === 'ended'` → Her iki oyuncu da bilgilendiriliyor
- Host disconnect olunca client de haberdar oluyor
- Senkronize disconnect handling

**Disconnect Flow:**
1. Oyuncu bağlantı kaybediyor
2. Firebase presence otomatik `null` yapıyor
3. Diğer oyuncu `presenceInitialized[uid] === true` kontrolü yapıyor
4. `handlePlayerDisconnect()` çağrılıyor
5. Game status `ended` olarak işaretleniyor
6. `gameStatusListener` → Tüm oyuncular algılıyor
7. "❌ Oyuncu Ayrıldı" mesajı gösteriliyor
8. 3 saniye sonra ana menüye dönülüyor
9. Tüm listener'lar temizleniyor

**Cleanup Sistemi:**
```javascript
cleanupPresenceListeners() // presenceListeners + presenceInitialized
cleanupChatListener()      // chatListener + chat messages clear
handleReturnToMainMenu()   // Tüm Firebase listeners
```
- Memory leak önleniyor
- Listener'lar düzgün kapatılıyor
- Presence tracking sıfırlanıyor

**Database Rules:**
```json
"presence": {
  "$uid": {
    ".write": "auth != null && auth.uid === $uid",
    ".read": "auth != null"
  }
},
"chat": {
  "$messageId": {
    ".write": "auth != null && root.child('games/' + $gameId + '/players/' + auth.uid).exists()",
    ".read": "auth != null",
    ".validate": "newData.hasChildren(['uid', 'senderName', 'text', 'timestamp']) && newData.child('text').isString() && newData.child('text').val().length > 0 && newData.child('text').val().length <= 200"
  }
}
```

**Debug Logging:**
- 🔍 Starting presence tracking
- ✅ Player presence initialized / Chat listener setup
- 🔴 Player disconnected
- ⚠️ Ignoring disconnect (not in progress)
- 📤 Message sent

### Profil Sistemi Özellikleri

**Kişisel Bilgiler:**
- Ad, soyad, takma ad (zorunlu), telefon
- Email (salt okunur, Firebase Auth'tan geliyor)
- Firebase Realtime Database: `users/{uid}/profile`

**Şifre Yönetimi:**
- Mevcut şifre doğrulama gerekli (güvenlik)
- Yeni şifre + onay kontrolü
- Minimum 6 karakter validasyonu
- `reauthenticateWithCredential()` + `updatePassword()`

**Görüntüleme Tercihi:**
- Oyuncu ismi yerine gerçek ad veya takma ad
- Lobby, scoreboard, overlay mesajlarında kullanılıyor
- `getUserDisplayName()` fonksiyonu preference'a göre döndürüyor

**Hata Mesajları:**
- Firebase error kodları Türkçe'ye çevrildi
- Kullanıcı dostu mesajlar (teknik detay yok)
- Güvenlik uyumlu: Tüm credential hataları tek mesaj
- Styled error boxes: ⚠️ ikonu + kırmızı kutu
- Success boxes: ✓ ikonu + yeşil kutu

**UI Detayları:**
- Loading spinners tam ortada (`absolute` positioning)
- Button structure: `relative` container + `visibility: hidden` text
- Profile Settings butonu ana menüde
- İlk kayıt sonrası otomatik profil ekranı

### Teknik Kararlar

**Player Disconnect:**
- Firebase Realtime Database presence özelliği kullanılıyor
- Initialization guard ile false-positive önleniyor
- Grace period: 5 saniye (geç initialize için)
- Game status listener ile senkronize notification

**Auto-Login Basitleştirildi:**
- SESSION persistence çalışmadı (page refresh sounu)
- LOCAL persistence kullanılıyor (her zaman hatırla)
- Kullanıcı isterse manuel logout yapabilir

**Firebase Güvenlik:**
- Modern Firebase user-not-found ve wrong-password'ü birleştiriyor
- User enumeration attack'ları önlemek için
- Tek mesaj: "Email veya şifrenizi kontrol edin"

## Sıradaki Potansiyel İyileştirmeler

- Profil resmi upload özelliği
- Email doğrulama (verification)
- Şifremi unuttum (password reset)
- Debug log'ları temizleme
- Mobile responsive test
- Ses efektleri (opsiyonel)
- Reconnection handling (disconnect sonrası geri dönüş)
- Chat mesajları için timestamp görsel iyileştirme
- Chat mesajlarında emoji desteği
- Chat history persistence (oyun bitince de görünebilir)
