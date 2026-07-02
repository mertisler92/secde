export interface PrayerStep {
  stepIndex: number;
  title: string;
  actionInstruction: string;
  arabicText?: string;
  turkishTransliteration?: string;
  turkishTranslation?: string;
  audioFileName?: string;
  referenceSource: string;
}

export interface PrayerGuide {
  id: string; // Örn: "sabah_farz"
  name: string; // Örn: "Sabah Namazı (Farz)"
  totalRekat: number;
  category: 'farz' | 'sunnet' | 'vacib';
  steps: PrayerStep[];
}
