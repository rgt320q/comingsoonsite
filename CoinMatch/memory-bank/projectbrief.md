# Proje Özeti: Para Maçı Oyunu (Coin Match Game)

Bu proje, tarayıcıda çalışan, 2D fizik tabanlı, sıra tabanlı bir masa oyunudur.

## Temel Amaç

Kullanıcıların herhangi bir kurulum yapmadan, doğrudan tarayıcı üzerinden oynayabilecekleri, hem tek kişilik (hot-seat) hem de online çok oyunculu bir oyun deneyimi sunmak.

## Anahtar Özellikler (Doğru Mekanikler)

- **Paylaşımlı Oyun Alanı:** Oyuncu sayısından bağımsız olarak, oyun her zaman paylaşılan 3 adet para ile oynanır.
- **Sıra Tabanlı Oynanış ve Tur Sıfırlaması:** Her oyuncunun sırası başladığında, 3 para başlangıç pozisyonlarına geri döner. Oyuncu atışını yapar.
- **Detaylı Kural ve Faul Sistemi:**
    - **Geçerli Atış:** İlk tur hariç, atış çizgisi diğer iki paranın arasından geçmelidir.
    - **Fauller:** Paraların birbirine çarpması, paranın masadan düşmesi, atılan paranın direkt kaleye girmesi veya aynı parayla üst üste oynanması gibi durumlar can kaybına neden olur.
- **Tur Sonu Değerlendirmesi:** Tüm paralar durduğunda tur biter. Sonuç (gol veya faul) değerlendirilir ve oyuncu durumu (skor/can) güncellenir.
- **Skor, Can ve Eliminasyon:**
    - **Gol:** Kurallara uygun bir gol, oyuncuya puan kazandırır ve aynı oyuncu bir hak daha kazanır.
    - **Can Kaybı:** Faul yapan oyuncu bir can kaybeder.
    - **Eliminasyon:** Canı biten oyuncu oyundan elenir. Sona kalan oyuncu kazanır.
- **Online Çok Oyunculu Mod:** Firebase Realtime Database kullanılarak, tüm bu kuralların online ortamda, Host otoritesi ile senkronize bir şekilde çalışması sağlanır.