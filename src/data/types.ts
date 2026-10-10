// SonicLens - Types & Data Models

export type ConnectionStatus = 'connected' | 'paired' | 'detected' | 'disconnected' | 'unsupported' | 'unknown';
export type BatterySource = 'ANDROID_PLATFORM' | 'BLE_BATTERY_SERVICE' | 'VENDOR_ADAPTER' | 'USER_ENTERED' | 'ESTIMATED' | 'UNAVAILABLE';
export type DataQuality = 'high' | 'medium' | 'low' | 'unverified';
export type DiagnosticPhase = 'preflight' | 'identification' | 'capability' | 'measurement' | 'validation' | 'report';
export type ThemeMode = 'dark' | 'light' | 'system';
export type Language = 'en' | 'bn';

export interface BatteryReading {
  id: string;
  deviceId: string;
  component: 'overall' | 'left' | 'right' | 'case';
  percentage: number | null;
  timestamp: number;
  source: BatterySource;
  isLive: boolean;
  isStale: boolean;
  freshnessMinutes: number;
  confidence: DataQuality;
  errorMessage?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  manufacturer?: string;
  modelNumber?: string;
  category: 'earbuds' | 'headphones' | 'speaker' | 'headset' | 'other';
  status: ConnectionStatus;
  lastSeen: number;
  batteryReadings: BatteryReading[];
  supportedComponents: ('overall' | 'left' | 'right' | 'case')[];
  rssi?: number;
  gattServices?: GattService[];
}

export interface GattService {
  uuid: string;
  name: string;
  characteristics: GattCharacteristic[];
}

export interface GattCharacteristic {
  uuid: string;
  name: string;
  properties: ('read' | 'write' | 'notify' | 'indicate')[];
  lastValue?: string;
}

export interface DiagnosticResult {
  startTime: number;
  endTime: number;
  phases: DiagnosticPhaseResult[];
  overallStatus: 'passed' | 'partial' | 'failed';
  findings: DiagnosticFinding[];
  nextSteps: string[];
}

export interface DiagnosticPhaseResult {
  phase: DiagnosticPhase;
  status: 'passed' | 'failed' | 'skipped' | 'timeout';
  duration: number;
  details: string[];
}

export interface DiagnosticFinding {
  category: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface Specification {
  id: string;
  manufacturer: string;
  productName: string;
  modelNumber?: string;
  category: string;
  batteryComponents: string[];
  officialBatterySpec?: string;
  supportedFeatures: string[];
  compatibilityNotes: string[];
  sourceUrl?: string;
  sourceType: 'official' | 'community' | 'inferred';
  verificationDate: number;
  dataQuality: DataQuality;
}

export interface HistoryEntry {
  id: string;
  deviceId: string;
  deviceName: string;
  component: string;
  percentage: number;
  timestamp: number;
  source: BatterySource;
}

// Demo data
export const demoDevices: BluetoothDevice[] = [
  {
    id: 'device-1',
    name: 'Sony WH-1000XM5',
    address: 'XX:XX:XX:XX:XX:01',
    manufacturer: 'Sony',
    modelNumber: 'WH-1000XM5',
    category: 'headphones',
    status: 'connected',
    lastSeen: Date.now() - 30000,
    supportedComponents: ['overall'],
    rssi: -42,
    batteryReadings: [
      {
        id: 'reading-1',
        deviceId: 'device-1',
        component: 'overall',
        percentage: 78,
        timestamp: Date.now() - 60000,
        source: 'BLE_BATTERY_SERVICE',
        isLive: true,
        isStale: false,
        freshnessMinutes: 1,
        confidence: 'high'
      }
    ],
    gattServices: [
      {
        uuid: '0000180f-0000-1000-8000-00805f9b34fb',
        name: 'Battery Service',
        characteristics: [
          { uuid: '00002a19-0000-1000-8000-00805f9b34fb', name: 'Battery Level', properties: ['read', 'notify'], lastValue: '78%' }
        ]
      },
      {
        uuid: '0000180a-0000-1000-8000-00805f9b34fb',
        name: 'Device Information',
        characteristics: [
          { uuid: '00002a29-0000-1000-8000-00805f9b34fb', name: 'Manufacturer Name', properties: ['read'], lastValue: 'Sony' },
          { uuid: '00002a24-0000-1000-8000-00805f9b34fb', name: 'Model Number', properties: ['read'], lastValue: 'WH-1000XM5' }
        ]
      }
    ]
  },
  {
    id: 'device-2',
    name: 'Samsung Galaxy Buds2 Pro',
    address: 'XX:XX:XX:XX:XX:02',
    manufacturer: 'Samsung',
    modelNumber: 'SM-R510',
    category: 'earbuds',
    status: 'paired',
    lastSeen: Date.now() - 3600000,
    supportedComponents: ['left', 'right', 'case'],
    batteryReadings: [
      {
        id: 'reading-2a',
        deviceId: 'device-2',
        component: 'left',
        percentage: 65,
        timestamp: Date.now() - 7200000,
        source: 'UNAVAILABLE',
        isLive: false,
        isStale: true,
        freshnessMinutes: 120,
        confidence: 'low',
        errorMessage: 'Device not currently connected'
      },
      {
        id: 'reading-2b',
        deviceId: 'device-2',
        component: 'right',
        percentage: 62,
        timestamp: Date.now() - 7200000,
        source: 'UNAVAILABLE',
        isLive: false,
        isStale: true,
        freshnessMinutes: 120,
        confidence: 'low',
        errorMessage: 'Device not currently connected'
      },
      {
        id: 'reading-2c',
        deviceId: 'device-2',
        component: 'case',
        percentage: 90,
        timestamp: Date.now() - 7200000,
        source: 'UNAVAILABLE',
        isLive: false,
        isStale: true,
        freshnessMinutes: 120,
        confidence: 'low',
        errorMessage: 'Device not currently connected'
      }
    ]
  },
  {
    id: 'device-3',
    name: 'JBL Flip 6',
    address: 'XX:XX:XX:XX:XX:03',
    manufacturer: 'JBL',
    modelNumber: 'Flip 6',
    category: 'speaker',
    status: 'disconnected',
    lastSeen: Date.now() - 86400000,
    supportedComponents: ['overall'],
    batteryReadings: []
  }
];

export const demoSpecifications: Specification[] = [
  {
    id: 'spec-1',
    manufacturer: 'Sony',
    productName: 'WH-1000XM5',
    modelNumber: 'WH-1000XM5',
    category: 'Headphones',
    batteryComponents: ['Overall (single battery)'],
    officialBatterySpec: 'Up to 30 hours playback (ANC on)',
    supportedFeatures: ['Battery Service (BLE)', 'Device Information'],
    compatibilityNotes: ['Battery readable via standard BLE Battery Service when connected'],
    sourceUrl: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5',
    sourceType: 'official',
    verificationDate: Date.now() - 2592000000,
    dataQuality: 'high'
  },
  {
    id: 'spec-2',
    manufacturer: 'Samsung',
    productName: 'Galaxy Buds2 Pro',
    modelNumber: 'SM-R510',
    category: 'True Wireless Earbuds',
    batteryComponents: ['Left earbud', 'Right earbud', 'Charging case'],
    officialBatterySpec: 'Up to 5h earbuds / 18h with case (ANC on)',
    supportedFeatures: ['Vendor-specific protocol (limited third-party access)'],
    compatibilityNotes: ['Separate battery readings require Samsung Wearable app or proprietary protocol', 'Standard BLE Battery Service may only show overall or unavailable'],
    sourceUrl: 'https://www.samsung.com/us/app/mobile-audio/galaxy-buds/galaxy-buds2-pro/',
    sourceType: 'official',
    verificationDate: Date.now() - 2592000000,
    dataQuality: 'medium'
  },
  {
    id: 'spec-3',
    manufacturer: 'Apple',
    productName: 'AirPods Pro (2nd gen)',
    modelNumber: 'A2931 / A2699',
    category: 'True Wireless Earbuds',
    batteryComponents: ['Left earbud', 'Right earbud', 'Charging case'],
    officialBatterySpec: 'Up to 6h listening / 30h with case',
    supportedFeatures: ['Apple ecosystem integration'],
    compatibilityNotes: ['Battery data not exposed via standard BLE on non-Apple devices', 'Requires iOS/macOS for full battery reporting'],
    sourceType: 'official',
    verificationDate: Date.now() - 2592000000,
    dataQuality: 'medium'
  },
  {
    id: 'spec-4',
    manufacturer: 'JBL',
    productName: 'Flip 6',
    modelNumber: 'JBLFLIP6',
    category: 'Portable Speaker',
    batteryComponents: ['Overall (single battery)'],
    officialBatterySpec: 'Up to 12 hours playback',
    supportedFeatures: ['Battery Service (BLE)'],
    compatibilityNotes: ['Standard BLE Battery Service typically available when connected'],
    sourceType: 'community',
    verificationDate: Date.now() - 5184000000,
    dataQuality: 'medium'
  },
  {
    id: 'spec-5',
    manufacturer: 'Bose',
    productName: 'QuietComfort Ultra Earbuds',
    modelNumber: 'QC Ultra',
    category: 'True Wireless Earbuds',
    batteryComponents: ['Left earbud', 'Right earbud', 'Charging case'],
    officialBatterySpec: 'Up to 6h earbuds / 24h with case',
    supportedFeatures: ['Bose Music App integration'],
    compatibilityNotes: ['Full battery reporting through Bose Music app', 'Limited third-party BLE access'],
    sourceType: 'official',
    verificationDate: Date.now() - 2592000000,
    dataQuality: 'medium'
  },
  {
    id: 'spec-6',
    manufacturer: 'Sennheiser',
    productName: 'Momentum True Wireless 4',
    modelNumber: 'MTW4',
    category: 'True Wireless Earbuds',
    batteryComponents: ['Left earbud', 'Right earbud', 'Charging case'],
    officialBatterySpec: 'Up to 7.5h earbuds / 30h with case',
    supportedFeatures: ['Sennheiser Smart Control App', 'Standard BLE Battery Service'],
    compatibilityNotes: ['Standard BLE Battery Service may provide overall reading', 'Individual component readings may require vendor app'],
    sourceType: 'community',
    verificationDate: Date.now() - 5184000000,
    dataQuality: 'medium'
  }
];

export const demoHistoryData: HistoryEntry[] = Array.from({ length: 48 }, (_, i) => ({
  id: `history-${i}`,
  deviceId: 'device-1',
  deviceName: 'Sony WH-1000XM5',
  component: 'overall',
  percentage: Math.max(15, 95 - i * 1.7 + Math.random() * 2),
  timestamp: Date.now() - (i * 3600000),
  source: i % 5 === 0 ? 'BLE_BATTERY_SERVICE' : 'ANDROID_PLATFORM'
}));
