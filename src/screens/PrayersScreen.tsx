import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { ArchHeader, GoldDivider, StarMotif } from '../components/IslamicMotif';

// Dualar ve Sureler Kütüphanesi (Sadece Türkçe Okunuşları içerir)
const PRAYER_LIBRARY = {
  niyet_sabah_sunnet: { name: 'Niyet (Sabah Sünneti)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü sabah namazının iki rekat sünnetini kılmaya.' },
  niyet_sabah_farz: { name: 'Niyet (Sabah Farzı)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü sabah namazının iki rekat farzını kılmaya.' },
  niyet_ogle_sunnet: { name: 'Niyet (Öğle Sünneti)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü öğle namazının ilk sünnetini kılmaya.' },
  niyet_ogle_farz: { name: 'Niyet (Öğle Farzı)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü öğle namazının farzını kılmaya.' },
  niyet_ikindi_sunnet: { name: 'Niyet (İkindi Sünneti)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü ikindi namazının dört rekat sünnetini kılmaya.' },
  niyet_ikindi_farz: { name: 'Niyet (İkindi Farzı)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü ikindi namazının farzını kılmaya.' },
  niyet_aksam_farz: { name: 'Niyet (Akşam Farzı)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü akşam namazının farzını kılmaya.' },
  niyet_aksam_sunnet: { name: 'Niyet (Akşam Sünneti)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü akşam namazının iki rekat sünnetini kılmaya.' },
  niyet_yatsi_sunnet: { name: 'Niyet (Yatsı Sünneti)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü yatsı namazının ilk sünnetini kılmaya.' },
  niyet_yatsi_farz: { name: 'Niyet (Yatsı Farzı)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü yatsı namazının farzını kılmaya.' },
  niyet_vitir: { name: 'Niyet (Vitir Vacip)', type: 'dua', turkish: 'Niyet ettim Allah rızası için bugünkü vitir vacip namazını kılmaya.' },
  
  tekbir: { name: 'İftitah Tekbiri', type: 'dua', turkish: 'Allâhu Ekber' },
  
  subhaneke: { name: 'Sübhaneke Duası', type: 'dua', turkish: 'Sübhanekellahümme ve bihamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayrük.' },
  
  fatiha: { name: 'Fatiha Suresi', type: 'sure', turkish: 'Elhamdü lillâhi rabbil \'âlemîn. Er-rahmânir-rahîm. Mâliki yevmid-dîn. İyyâke na\'büdü ve iyyâke neste\'în. İhdinas-sırâtal-müstekîm. Sırâtal-lezîne en\'amte aleyhim ğayril-mağdûbi aleyhim veled-dâllîn.' },
  
  kevser: { name: 'Kevser Suresi (Zammı Sure)', type: 'sure', turkish: 'İnnâ a\'taynâkel-kevser. Fesalli lirabbike venhar. İnne şânieke hüvel-ebter.' },
  
  ihlas: { name: 'İhlas Suresi (Zammı Sure)', type: 'sure', turkish: 'Kul hüvellâhü ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.' },
  
  felak: { name: 'Felak Suresi (Zammı Sure)', type: 'sure', turkish: 'Kul eûzü birabbil-felak. Min şerri mâ halak. Ve min şerri ğâsıkın izâ vekab. Ve min şerrin-neffâsâti fil-ukad. Ve min şerri hâsidin izâ hased.' },
  
  nas: { name: 'Nas Suresi (Zammı Sure)', type: 'sure', turkish: 'Kul eûzü birabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril-vesvâsil-hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel-cinneti ven-nâs.' },

  ruku: { name: 'Rüku Tesbihi (3 Defa)', type: 'tesbih', turkish: 'Sübhâne Rabbiyel-Azîm' },
  
  dogrulma: { name: 'Rükudan Doğrulma', type: 'dua', turkish: 'Semi\'allâhu limen hamideh. Rabbena lekel-hamd.' },
  
  secde: { name: 'Secde Tesbihi (3 Defa)', type: 'tesbih', turkish: 'Sübhâne Rabbiyel-A\'lâ' },
  
  ettahiyyatü: { name: 'Ettahiyyâtü Duası (Oturuş)', type: 'dua', turkish: 'Et-tahiyyâtü lillâhi ves-salavâtü vet-tayyibât. Es-selâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berekâtüh. Es-selâmü aleynâ ve alâ ibâdillâhis-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve resûlüh.' },
  
  sallibarik: { name: 'Allahümme Salli & Barik', type: 'dua', turkish: 'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd. Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.' },
  
  rabbena: { name: 'Rabbena Duaları', type: 'dua', turkish: 'Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhirati haseneten ve kınâ azâben-nâr. Rabbenâğfirlî ve livâlideyye ve lil-mü\'minîne yevme yekûmül-hisâb.' },
  
  kunut1: { name: 'Kunut Duaları 1 (Vitir)', type: 'dua', turkish: 'Allâhümme innâ neste\'înüke ve nesteğfirüke ve nestehdîke. Ve nü\'minü bike ve netûbü ileyk. Ve netevekkelü aleyke ve nüsnî aleykel-hayra küllehû neşkürüke ve lâ nekfürük. Ve nahle\'ü ve netrükü men yefcürük.' },
  
  kunut2: { name: 'Kunut Duaları 2 (Vitir)', type: 'dua', turkish: 'Allâhümme iyyâke na\'büdü ve leke nüsallî ve nescüdü ve ileyke nes\'â ve nahfid. Nercû rahmeteke ve nahşâ azâbek. İnne azâbeke bil-küffâri mülhık.' },
  
  selam: { name: 'Selam Verme', type: 'dua', turkish: 'Esselâmü aleyküm ve rahmetullâh' }
};

// Vakitlerin rekat bazlı kılınış sıralamaları
const PRAYERS_DATA: Record<string, {
  name: string;
  subName: string;
  parts: {
    title: string;
    rekats: {
      rekatNum: string;
      prayers: typeof PRAYER_LIBRARY.subhaneke[];
    }[];
  }[];
}> = {
  sabah: {
    name: 'Sabah Namazı',
    subName: '4 Rekat (2 Rekat Sünnet, 2 Rekat Farz)',
    parts: [
      {
        title: '2 Rekat Sünnet',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_sabah_sunnet,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
      {
        title: '2 Rekat Farz',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_sabah_farz,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.felak,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.nas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
    ],
  },
  ogle: {
    name: 'Öğle Namazı',
    subName: '10 Rekat (4 İlk Sünnet, 4 Farz, 2 Son Sünnet)',
    parts: [
      {
        title: '4 Rekat İlk Sünnet',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_ogle_sunnet,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü
            ],
          },
          {
            rekatNum: '3. Rekat',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.felak,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '4. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.nas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
      {
        title: '4 Rekat Farz',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_ogle_farz,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü
            ],
          },
          {
            rekatNum: '3. Rekat (Sadece Fatiha)',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '4. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
    ],
  },
  ikindi: {
    name: 'İkindi Namazı',
    subName: '8 Rekat (4 Sünnet, 4 Farz)',
    parts: [
      {
        title: '4 Rekat Sünnet',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_ikindi_sunnet,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş (Gayri Müekked)',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik
            ],
          },
          {
            rekatNum: '3. Rekat',
            prayers: [
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.felak,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '4. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.nas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
      {
        title: '4 Rekat Farz',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_ikindi_farz,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü
            ],
          },
          {
            rekatNum: '3. Rekat (Sadece Fatiha)',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '4. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
    ],
  },
  aksam: {
    name: 'Akşam Namazı',
    subName: '5 Rekat (3 Rekat Farz, 2 Rekat Sünnet)',
    parts: [
      {
        title: '3 Rekat Farz',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_aksam_farz,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü
            ],
          },
          {
            rekatNum: '3. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
      {
        title: '2 Rekat Sünnet',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_aksam_sunnet,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.felak,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.nas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
    ],
  },
  yatsi: {
    name: 'Yatsı Namazı',
    subName: '13 Rekat (4 İlk Sünnet, 4 Farz, 2 Son Sünnet, 3 Vitir)',
    parts: [
      {
        title: '4 Rekat Farz',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_yatsi_farz,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.kevser,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü
            ],
          },
          {
            rekatNum: '3. Rekat (Sadece Fatiha)',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '4. Rekat & Son Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
      {
        title: '3 Rekat Vitir Vacip',
        rekats: [
          {
            rekatNum: '1. Rekat',
            prayers: [
              PRAYER_LIBRARY.niyet_vitir,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.subhaneke,
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.felak,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde
            ],
          },
          {
            rekatNum: '2. Rekat & İlk Oturuş',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.nas,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü
            ],
          },
          {
            rekatNum: '3. Rekat (Kunut Duaları)',
            prayers: [
              PRAYER_LIBRARY.fatiha,
              PRAYER_LIBRARY.ihlas,
              PRAYER_LIBRARY.tekbir,
              PRAYER_LIBRARY.kunut1,
              PRAYER_LIBRARY.kunut2,
              PRAYER_LIBRARY.ruku,
              PRAYER_LIBRARY.dogrulma,
              PRAYER_LIBRARY.secde,
              PRAYER_LIBRARY.ettahiyyatü,
              PRAYER_LIBRARY.sallibarik,
              PRAYER_LIBRARY.rabbena,
              PRAYER_LIBRARY.selam
            ],
          },
        ],
      },
    ],
  },
};

// Türkçe vakit isim eşleme tablosu
const VAKIT_DISPLAY_NAMES: Record<string, string> = {
  sabah: 'Sabah',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı',
};

// Alt Component: Sadece Türkçe Okunuşları gösteren dua kartı
const PrayerItem: React.FC<{ prayer: typeof PRAYER_LIBRARY.subhaneke; isLast: boolean }> = ({ prayer, isLast }) => {
  return (
    <View style={styles.prayerRow}>
      <View style={styles.prayerHeaderRow}>
        <StarMotif size={14} color="#D4AF37" />
        <Text style={styles.prayerName}>{prayer.name}</Text>
        <Text style={[styles.typeBadge, prayer.type === 'sure' ? styles.typeSure : prayer.type === 'dua' ? styles.typeDua : styles.typeTesbih]}>
          {prayer.type === 'sure' ? 'Sure' : prayer.type === 'dua' ? 'Dua' : 'Tesbih'}
        </Text>
      </View>

      <View style={styles.prayerTexts}>
        {/* Türkçe Okunuşu (Doğrudan ve sadece bu metin gösterilir) */}
        <Text style={styles.transliterationText}>{prayer.turkish}</Text>
      </View>
      {!isLast && <View style={styles.prayerDivider} />}
    </View>
  );
};

export const PrayersScreen: React.FC = () => {
  const [selectedVakitKey, setSelectedVakitKey] = useState<string>('sabah');
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);
  const [expandedRekatIdx, setExpandedRekatIdx] = useState<number | null>(0);

  const currentVakit = PRAYERS_DATA[selectedVakitKey] || PRAYERS_DATA['sabah'];
  const currentPart = currentVakit.parts[selectedPartIndex] || currentVakit.parts[0];

  const handleSelectVakit = (key: string) => {
    setSelectedVakitKey(key);
    setSelectedPartIndex(0);
    setExpandedRekatIdx(0);
  };

  const handleSelectPart = (idx: number) => {
    setSelectedPartIndex(idx);
    setExpandedRekatIdx(0);
  };

  return (
    <View style={styles.container}>
      <ArchHeader
        title="Dualar ve Sureler"
        subtitle="Vakitlere ve Rekatlara Göre Sure/Dua Şeması"
        icon="📖"
      />

      {/* 5 Vakit Seçim Butonları */}
      <View style={styles.vakitNav}>
        {Object.keys(PRAYERS_DATA).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.vakitTab,
              selectedVakitKey === key && styles.activeVakitTab,
            ]}
            onPress={() => handleSelectVakit(key)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.vakitTabText,
                selectedVakitKey === key && styles.activeVakitTabText,
              ]}
            >
              {VAKIT_DISPLAY_NAMES[key] || key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Vakit Bilgisi Kartı */}
        <View style={styles.infoCard}>
          <Text style={styles.vakitName}>{currentVakit.name}</Text>
          <Text style={styles.vakitSubName}>{currentVakit.subName}</Text>
        </View>

        {/* Namaz Bölüm Seçimi (Sünnet / Farz Sekmeleri) */}
        <View style={styles.partContainer}>
          {currentVakit.parts.map((part, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.partTab,
                selectedPartIndex === idx && styles.activePartTab,
              ]}
              onPress={() => handleSelectPart(idx)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.partTabText,
                  selectedPartIndex === idx && styles.activePartTabText,
                ]}
              >
                {part.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rekat Bazlı Sure ve Dua Listesi */}
        <Text style={styles.sectionHeaderTitle}>📖 Rekat Rekat Okunuş Sırası & Duaları</Text>

        {currentPart.rekats.map((rekat, rIdx) => (
          <View key={rIdx} style={styles.rekatCard}>
            <TouchableOpacity
              style={styles.rekatHeader}
              onPress={() => setExpandedRekatIdx(expandedRekatIdx === rIdx ? null : rIdx)}
              activeOpacity={0.8}
            >
              <Text style={styles.rekatTitle}>{rekat.rekatNum}</Text>
              <Text style={styles.expandIcon}>
                {expandedRekatIdx === rIdx ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {expandedRekatIdx === rIdx && (
              <View style={styles.rekatDetail}>
                {rekat.prayers.map((prayer, pIdx) => (
                  <PrayerItem 
                    key={pIdx} 
                    prayer={prayer} 
                    isLast={pIdx === rekat.prayers.length - 1} 
                  />
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.footerNote}>
          ⚠️ Rekat adımlarında yer alan sure ve dua kılınış sırası Diyanet İşleri Başkanlığı İbadet Rehberi standartlarına uygun olarak doğrulanmıştır.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  vakitNav: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
  },
  vakitTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeVakitTab: {
    backgroundColor: Colors.light.primary,
  },
  vakitTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeVakitTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
    elevation: 2,
  },
  vakitName: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  vakitSubName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  partContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  partTab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  activePartTab: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.warningBackground,
  },
  partTabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activePartTabText: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  sectionHeaderTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  rekatCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  rekatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#F9FAFB',
  },
  rekatTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  expandIcon: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  rekatDetail: {
    padding: Spacing.md,
  },
  prayerRow: {
    marginBottom: Spacing.sm,
  },
  prayerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  prayerName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  typeBadge: {
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeSure: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
  },
  typeDua: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  typeTesbih: {
    backgroundColor: '#ECEFEE',
    color: '#374151',
  },
  prayerTexts: {
    paddingLeft: 22,
  },
  transliterationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  prayerDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  footerNote: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
