import { PrayerTimesCache } from '../models/PrayerTimes';

export class StorageService {
  private static mockMemoryCache: PrayerTimesCache | null = null;

  static async getPrayerTimesCache(): Promise<PrayerTimesCache | null> {
    return this.mockMemoryCache;
  }

  static async setPrayerTimesCache(cache: PrayerTimesCache): Promise<void> {
    this.mockMemoryCache = cache;
  }

  static async hasCompletedOnboarding(): Promise<boolean> {
    return false; // Test için onboarding gösterilir
  }
}
