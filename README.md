# Secde 🕌 - Manevi Yaşam ve İbadet Rehberi

Secde, Müslümanların günlük manevi yaşamlarını ve ibadetlerini kolaylaştırmak, takip etmek ve düzenlemek amacıyla geliştirilmiş, modern **Super App** mimarisine sahip bir mobil uygulamadır.

Bu proje, React Native, Expo ve TypeScript teknolojileri kullanılarak geliştirilmiştir.

---

## 📸 Temel Özellikler

1. **Dashboard (Ana Sayfa Portal):**
   - Yenilenmiş fildişi/krem (`#FFFDF0`) renk paletiyle göz yormayan, premium kart yapısı.
   - Konum seçilmediğinde yönlendiren akıllı karşılama kartı; konum ayarlandığında ise o konuma ait canlı saat ve bir sonraki namaz vaktine kalan süreyi gösteren **Manevi Özet Paneli**.
   
2. **Ezan Vakitleri (Konum Kurulumlu):**
   - Başlangıçta izin istemeyen, sadece ezan vakitlerine tıklandığında açılan konum onboarding ekranı (GPS veya İl/İlçe manuel seçim listesi).
   - Güncel Diyanet namaz vakitleri tablosu ve aktif vakit vurgulama özelliği.

3. **Kıble Pusulası:**
   - Cihazın manyetometre (magnetometer) sensörlerini kullanarak gerçek zamanlı kıble yönü tespiti.
   - Doğru açı yakalandığında (İstanbul için 154.2°) yeşil halka uyarısı ve yerel haptic titreşim geri bildirimi.

4. **Kaza Takipçisi (Kaza Defteri):**
   - Namaz Kazaları ve Oruç Kazaları olarak ikiye ayrılmış düzenli sekme (tab) yapısı.
   - Büyük ergonomik `+` ve `-` sayaçları ile kaza takibi.
   - Web ve Mobil platformlarla %100 uyumlu, onay pencereli bölüm sıfırlama butonu.

5. **Zikirmatik (Kalıcı Hafızalı Dijital Tesbih):**
   - Sübhanallah, Elhamdülillah vb. hazır zikir hedefleri.
   - **Kalıcı Hafıza Entegrasyonu (`AsyncStorage`):** Uygulama kapansa da kaldığınız sayı kaybolmaz.
   - Büyük tıklama butonu ve hemen sağında fiziksel zikirmatiklerdeki gibi konumlandırılmış küçük sıfırlama (`Sıfırla`) butonu.

6. **Dini Günler Takvimi (2026):**
   - 2026 yılı resmi Diyanet İşleri Başkanlığı takvimi ile birebir uyumlu kandil ve bayram listesi.
   - Kalan gün sayısını gösteren canlı sayaçlar ve Üç Ayların Başlangıcı göstergesi.

7. **Hadis-i Şerifler:**
   - Günün hadisi ve tefsirini içeren manevi okuma alanı.

8. **Ayarlar (Bildirim Yönetimi):**
   - Günlük Hadis Bildirimi aktifleştirildiğinde açılan, mobil uyumlu saat ve dakika (`+`/`-`) ayarlama seçicisi.

---

## 🛠️ Teknolojiler ve Bağımlılıklar

- **React Native** & **Expo SDK**
- **TypeScript** (Tip güvenliği ve temiz kod mimarisi)
- **expo-sensors** (Pusula için manyetometre takibi)
- **expo-location** (GPS konum tespiti)
- **@react-native-async-storage/async-storage** (Zikirmatik kalıcı veri kaydı)
- **Vanilla StyleSheet** (Özel tasarlanmış zümrüt/krem premium tema ve kart gölgeleri)

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/secde-namaz-rehberi.git
   cd secde-namaz-rehberi
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Projeyi Başlatın:**
   ```bash
   npx expo start
   ```

4. **Çalıştırma:**
   - Terminalde çıkan QR kodu telefonunuzdaki **Expo Go** uygulaması ile taratarak mobil cihazınızda test edebilirsiniz.
   - Veya tarayıcıda açmak için terminalde `w` tuşuna basabilirsiniz.

---

## 📂 GitHub'a Yüklenecek Dosyalar (Repository Yapısı)

Projeyi GitHub'a yüklerken gereksiz ve büyük dosyalar `.gitignore` ile filtrelenmiştir. Deponuzda bulunması gereken temel klasör yapısı şöyledir:

- `src/` (Tüm ekranlar, bileşenler, temalar ve veri yapıları)
- `App.tsx` (Ana giriş bileşeni ve tab bar yönlendiricisi)
- `package.json` (Proje bağımlılıkları listesi)
- `tsconfig.json` (TypeScript ayarları)
- `app.json` (Expo proje konfigürasyonu)
- `README.md` (Proje tanıtım belgesi)
- `.gitignore` (Git filtreleme dosyası)
