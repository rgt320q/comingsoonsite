# Para Maçı - Online Multiplayer Coin Game

## 🎮 Proje Hakkında
Para Maçı, Firebase tabanlı gerçek zamanlı çok oyunculu bir mobil/web oyunudur. Oyuncular paralarını sürükleyip fırlatarak hedef bölgeye gol atmaya çalışır.

## ✅ Tamamlanan İyileştirmeler (Son Güncelleme)

### 1. **Debug Kodları Temizlendi**
- ✅ Fireworks animasyonundan kırmızı test karesi kaldırıldı
- ✅ Console.log mesajları temizlendi
- ✅ Production-ready kod yapısına getirildi

### 2. **Firebase Güvenlik İyileştirmeleri**
- ✅ `.gitignore` dosyası eklendi
- ✅ `firebase-config.template.js` şablon dosyası oluşturuldu
- ✅ `FIREBASE-SECURITY.md` güvenlik dokümantasyonu eklendi
- ✅ `firebase-config.js` dosyasına güvenlik uyarısı eklendi
- ⚠️ **ÖNEMLİ**: Production'da environment variables kullanılmalı!

### 3. **Kod Optimizasyonları**
- ✅ Gereksiz yorumlar kaldırıldı
- ✅ Stale game cleanup fonksiyonu optimize edildi
- ✅ Daha temiz ve okunabilir kod yapısı

## 📁 Proje Yapısı

```
CoinMatch/
├── CoinMatch.html          # Online multiplayer oyun
├── Game.html               # Offline single/local game
├── firebase-config.js      # Firebase yapılandırması (GİT'E EKLENMEMELİ!)
├── firebase-config.template.js  # Şablon dosya
├── css/
│   └── style.css          # Oyun stilleri
├── js/
│   └── main.js           # Ana oyun mantığı ve Firebase entegrasyonu
├── memory-bank/          # Proje dokümantasyonu
└── android/              # Android uygulama (geliştirilecek)
```

## 🚀 Kurulum

### 1. Firebase Yapılandırması
```bash
# Template dosyasını kopyala
copy firebase-config.template.js firebase-config.js

# firebase-config.js dosyasını düzenle ve gerçek değerleri ekle
```

### 2. Firebase Console Ayarları
- [Firebase Console](https://console.firebase.google.com/) → coinmatchgame projesine git
- Authentication → Email/Password'ü etkinleştir
- Database → Rules'ı `database.rules.json` ile güncelle

### 3. Oyunu Başlat
```bash
# Firebase hosting ile deploy
firebase deploy

# Veya local server ile test
# Python 3:
python -m http.server 8000

# Node.js:
npx http-server
```

## 🎯 Oyun Özellikleri

### ✅ Mevcut Özellikler
- Real-time çok oyunculu gameplay
- Firebase authentication (email/password)
- Oda sistemi (5 karakterlik kodlar)
- Oyun içi fizik motoru
- Foul (faul) sistemi
- Gol animasyonları (fireworks)
- Responsive tasarım
- Touch ve mouse desteği

### 🔄 Devam Eden Geliştirmeler
- Android uygulama paketi
- Oyun geçmişi kaydetme
- Liderlik tablosu
- Arkadaş sistemi

## 🔧 Teknik Detaylar

### Teknolojiler
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS (CDN)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

### Önemli Dosyalar
- `js/main.js`: Oyun mantığı, fizik motoru, Firebase listeners
- `css/style.css`: Animasyonlar ve stil kuralları
- `database.rules.json`: Firebase güvenlik kuralları

## 🔒 Güvenlik

⚠️ **UYARI**: `firebase-config.js` dosyası hassas bilgiler içerir!

1. Bu dosya asla git'e commit edilmemelidir
2. Production'da environment variables kullanın
3. Firebase rules'ları düzenli kontrol edin
4. API anahtarlarını public repository'lerde paylaşmayın

Detaylar için: [FIREBASE-SECURITY.md](FIREBASE-SECURITY.md)

## 📝 Son Commit Geçmişi

```
4217849 - Goal animation added
7bc3a78 - The rule of no goal from starting position
36c2609 - Goal detection and message system
d9cbb96 - Firebase database rules added
f437882 - Idle room deletion automation
```

## 🐛 Bilinen Sorunlar

Şu anda bilinen kritik bir sorun bulunmamaktadır.

## 📞 İletişim & Katkı

Projeye katkıda bulunmak için pull request gönderin veya issue açın.

## 📄 Lisans

Bu proje özel bir proje olup, tüm hakları saklıdır.

---

**Son Güncelleme**: 2025-10-27
**Versiyon**: 1.0.0-beta
