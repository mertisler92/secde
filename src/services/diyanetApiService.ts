import { PrayerTimeDay } from '../models/PrayerTimes';

// Üretim ortamında resmi Backend Proxy kullanılır.
const PROXY_API_URL = 'https://api.namazrehberi.app/v1/prayer-times';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  lastVerifiedAt?: string;
  errorMessage?: string;
}

export class DiyanetApiService {
  /**
   * Belirtilen ilçe ID'si için resmi Diyanet namaz vakitlerini getirir.
   * KURAL: API başarısız olursa veya ulaşılamazsa kesinlikle tahmin yürütülmez!
   */
  static async getPrayerTimes(districtId: number): Promise<ApiResponse<PrayerTimeDay[]>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 sn zaman aşımı

      const response = await fetch(`${PROXY_API_URL}/district/${districtId}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Client-App': 'NamazRehberiMobile/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Hata kiti: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.times && Array.isArray(result.times)) {
        return {
          success: true,
          data: result.times,
          lastVerifiedAt: new Date().toISOString(),
        };
      }

      throw new Error('Geçersiz veri biçimi');
    } catch (error) {
      console.warn('Diyanet API Erişilemedi veya Hata Döndü:', error);

      // Demo/Fallback simülasyonu (Gerçek cihaz testi için mock veri ancak strictly verified işaretli)
      // Gerçek prodüksiyonda sunucu hatası durumunda açık uyarı mesajı verilir.
      return {
        success: false,
        errorMessage: 'Namaz vakti verisi şu anda doğrulanamadı, lütfen resmi kaynaklardan kontrol edin.',
      };
    }
  }

  /**
   * İlçe arama / Şehir eşleştirme servisi
   */
  static async getMockDistrictInfo(): Promise<{ id: number; name: string; cityName: string; countryName: string }> {
    return {
      id: 9541, // Örn: İstanbul Fatih ilçe ID'si
      name: 'Fatih',
      cityName: 'İstanbul',
      countryName: 'Türkiye',
    };
  }
}
