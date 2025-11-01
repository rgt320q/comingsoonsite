═══════════════════════════════════════════════════════════════
  COINMATCH - WEB SUNUCUSU DEPLOYMENT PAKETİ
═══════════════════════════════════════════════════════════════

Bu klasör, CoinMatch oyununun web sunucusunda çalışması için
gereken TÜM dosyaları içerir.


📁 KLASÖR YAPISI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

deploy/
  ├── index.html              (Ana HTML dosyası)
  ├── firebase-config.js      (Firebase ayarları)
  ├── css/
  │   └── style.css          (Tüm CSS stilleri)
  ├── js/
  │   └── main.js            (Oyun mantığı ve kodları)
  └── images/
      ├── ancient-coin01.png  (Oyun görselleri)
      ├── ancient-coin02.png
      ├── ancient-coin03.png
      ├── ancient-coin04.png
      ├── ancient-coin05.png
      └── ancient-coin06.png


🚀 SUNUCUYA YÜKLEME TALİMATLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Bu "deploy" klasörünün içindeki TÜM dosyaları sunucunuza yükleyin
   (Örnek: public_html/, www/, htdocs/ klasörüne)

2. Dosya yapısını koruyun:
   - Ana dizine: index.html, firebase-config.js
   - css/ klasörüne: style.css
   - js/ klasörüne: main.js
   - images/ klasörüne: tüm PNG dosyaları


✅ KONTROL LİSTESİ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 1 adet index.html dosyası (30 KB)
□ 1 adet firebase-config.js dosyası (1 KB)
□ 1 adet style.css dosyası (css/ klasöründe, 30 KB)
□ 1 adet main.js dosyası (js/ klasöründe, 191 KB)
□ 6 adet PNG görsel dosyası (images/ klasöründe, ~20 KB her biri)

TOPLAM: 10 dosya, ~314 KB


🌐 TARAYICIDA TEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Yükleme sonrası:
https://sizin-domain.com/index.html

veya

https://sizin-domain.com/


⚙️ SUNUCU GEREKSİNİMLERİ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Statik web sunucusu (Apache, Nginx, IIS vb.)
✓ HTTPS desteği (Firebase için önerilir)
✓ PHP/Node.js/Python GEREKMEZ (sadece HTML/CSS/JS)


🔥 FIREBASE BAĞLANTISI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Firebase ayarları "firebase-config.js" dosyasında tanımlı.
Oyun şu Firebase servislerini kullanır:

- Authentication (Google ile giriş)
- Firestore Database (oyuncu verileri)
- Realtime Database (çok oyunculu oyun)


📱 ÖZELLİKLER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Tek oyunculu mod (AI rakip)
✓ Çok oyunculu mod (online)
✓ Google hesabı ile giriş
✓ Profil sistemi
✓ Lobby sistemi
✓ Gol animasyonları
✓ Havai fişek efektleri
✓ Ses ve titreşim ayarları
✓ Mobil uyumlu (responsive)


🎮 OYUN NASIL ÇALIŞIR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Google hesabı ile giriş
2. Profil oluşturma
3. Lobby'ye katılma veya oda oluşturma
4. Rakip bekleme
5. Oyuna başlama
6. Para (coin) fırlatma mekaniği ile oyun


⚠️ ÖNEMLİ NOTLAR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Firebase config dosyasında gerçek API anahtarları var
• HTTPS ile yayınlanması önerilir (Firebase için)
• Dosya izinlerini kontrol edin (644 veya 755)
• Cache sorunlarında CTRL+F5 ile sayfayı yenileyin


🐛 SORUN GİDERME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Oyun açılmıyorsa:
1. Tarayıcı Console'u açın (F12)
2. Hataları kontrol edin
3. Dosya yollarının doğru olduğundan emin olun
4. Firebase bağlantısını test edin


📞 DESTEK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub: rgt320q/CoinMatch
Tarih: 1 Kasım 2025


═══════════════════════════════════════════════════════════════
  İYİ OYUNLAR! 🎮
═══════════════════════════════════════════════════════════════
