export interface PrayerTimeDay {
  date: string; // YYYY-MM-DD
  imsak: string; // HH:mm
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
}

export interface DistrictInfo {
  id: number;
  name: string;
  cityName: string;
  countryName: string;
}

export interface PrayerTimesCache {
  district: DistrictInfo;
  lastVerifiedAt: string; // ISO String
  isStale: boolean;
  times: PrayerTimeDay[];
}

export type PrayerNameKey = 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';

export interface NextPrayerInfo {
  name: string; // Örn: "Öğle"
  key: PrayerNameKey;
  time: string; // Örn: "13:15"
  remainingFormatted: string; // Örn: "02 sa 14 dk"
}
