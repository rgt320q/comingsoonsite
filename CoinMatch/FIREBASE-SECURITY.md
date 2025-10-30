# Para Maçı - Firebase Yapılandırması

## Güvenlik Notu

`firebase-config.js` dosyası hassas API anahtarları içerir ve **asla** git deposuna commit edilmemelidir.

## Kurulum Adımları

1. `firebase-config.template.js` dosyasını `firebase-config.js` olarak kopyalayın:
   ```bash
   copy firebase-config.template.js firebase-config.js
   ```

2. `firebase-config.js` dosyasını açın ve Firebase Console'dan aldığınız gerçek değerlerle doldurun.

3. `.gitignore` dosyasının `firebase-config.js`'i içerdiğinden emin olun.

## Firebase Console'dan Bilgileri Alma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Projenizi seçin (coinmatchgame)
3. Project Settings > General sekmesine gidin
4. "Your apps" bölümünde Web app'inizi bulun
5. Config değerlerini kopyalayın ve `firebase-config.js`'e yapıştırın

## Güvenlik Kontrol Listesi

- [ ] `firebase-config.js` .gitignore'da
- [ ] API anahtarı commit edilmedi
- [ ] Database rules güncel ve güvenli
- [ ] Authentication kuralları aktif
