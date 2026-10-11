import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bluetooth, Home, Cpu, Battery, Activity, FlaskConical, 
  BookOpen, History, Settings, ChevronRight, RefreshCw,
  Wifi, WifiOff, Shield, ShieldAlert, Clock, Zap,
  AlertTriangle, CheckCircle2, XCircle, Info, Volume2,
  Headphones, Speaker, Radio, Signal, BarChart3,
  Timer, Play, Pause, Square, Download, Trash2,
  Moon, Sun, Globe, Lock, FileText, Eye, EyeOff,
  Search, Filter, ChevronDown, ArrowLeft, MoreVertical,
  BatteryCharging, BatteryLow, BatteryMedium, BatteryFull,
  CircleDot, Waves, Gauge
} from 'lucide-react';
import {
  demoDevices, demoSpecifications, demoHistoryData,
  type BluetoothDevice, type BatteryReading, type DiagnosticResult,
  type DiagnosticPhaseResult, type Specification, type ConnectionStatus
} from './data/types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

// ==================== MAIN APP ====================
type Page = 'dashboard' | 'devices' | 'device-detail' | 'battery' | 'diagnostic' | 'lab' | 'specs' | 'history' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [isScanning, setIsScanning] = useState(false);

  const navigateTo = (page: Page, device?: BluetoothDevice) => {
    setCurrentPage(page);
    if (device) setSelectedDevice(device);
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-cyan-500/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
              <Waves className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">SonicLens</h1>
              <p className="text-[10px] text-slate-400 -mt-0.5">Bluetooth Audio Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator
              icon={bluetoothEnabled ? <Bluetooth className="w-3.5 h-3.5" /> : <Bluetooth className="w-3.5 h-3.5" />}
              label={bluetoothEnabled ? 'BT On' : 'BT Off'}
              active={bluetoothEnabled}
            />
            <StatusIndicator
              icon={permissionGranted ? <Shield className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              label={permissionGranted ? 'Granted' : 'Denied'}
              active={permissionGranted}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-4 py-4"
          >
            {currentPage === 'dashboard' && (
              <DashboardPage
                devices={demoDevices}
                bluetoothEnabled={bluetoothEnabled}
                permissionGranted={permissionGranted}
                isScanning={isScanning}
                onScan={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 3000); }}
                onNavigate={navigateTo}
                onSelectDevice={(d: BluetoothDevice) => navigateTo('device-detail', d)}
              />
            )}
            {currentPage === 'devices' && (
              <DevicesPage
                devices={demoDevices}
                isScanning={isScanning}
                onScan={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 3000); }}
                onSelectDevice={(d: BluetoothDevice) => navigateTo('device-detail', d)}
              />
            )}
            {currentPage === 'device-detail' && selectedDevice && (
              <DeviceDetailPage
                device={selectedDevice}
                onBack={() => navigateTo('devices')}
              />
            )}
            {currentPage === 'battery' && (
              <BatteryPage devices={demoDevices} />
            )}
            {currentPage === 'diagnostic' && (
              <DiagnosticPage device={selectedDevice || demoDevices[0]} />
            )}
            {currentPage === 'lab' && (
              <TechnicalLabPage device={selectedDevice || demoDevices[0]} />
            )}
            {currentPage === 'specs' && (
              <SpecificationsPage />
            )}
            {currentPage === 'history' && (
              <BatteryHistoryPage />
            )}
            {currentPage === 'settings' && (
              <SettingsPage
                theme={theme}
                setTheme={setTheme}
                language={language}
                setLanguage={setLanguage}
                bluetoothEnabled={bluetoothEnabled}
                setBluetoothEnabled={setBluetoothEnabled}
                permissionGranted={permissionGranted}
                setPermissionGranted={setPermissionGranted}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-cyan-500/10 z-50">
        <div className="max-w-7xl mx-auto flex justify-around py-2 px-2">
          {[
            { id: 'dashboard' as Page, icon: Home, label: 'Home' },
            { id: 'devices' as Page, icon: Bluetooth, label: 'Devices' },
            { id: 'diagnostic' as Page, icon: Activity, label: 'Diagnose' },
            { id: 'lab' as Page, icon: FlaskConical, label: 'Lab' },
            { id: 'settings' as Page, icon: Settings, label: 'Settings' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => navigateTo(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                currentPage === id
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ==================== SHARED COMPONENTS ====================

function StatusIndicator({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
    }`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-cyan-500/30' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function BatteryBar({ percentage, size = 'md', showLabel = true }: { percentage: number | null; size?: 'sm' | 'md' | 'lg'; showLabel?: boolean }) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const getColor = (p: number) => {
    if (p >= 60) return 'bg-emerald-400';
    if (p >= 30) return 'bg-amber-400';
    return 'bg-red-400';
  };

  if (percentage === null) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex-1 ${heights[size]} bg-slate-700/50 rounded-full overflow-hidden`}>
          <div className="h-full w-full bg-slate-600 animate-pulse rounded-full" />
        </div>
        {showLabel && <span className="text-xs text-slate-500">N/A</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${heights[size]} bg-slate-700/50 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${getColor(percentage)} rounded-full battery-fill`}
        />
      </div>
      {showLabel && (
        <span className={`font-mono font-semibold ${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-sm' : 'text-xs'} ${
          percentage >= 60 ? 'text-emerald-400' : percentage >= 30 ? 'text-amber-400' : 'text-red-400'
        }`}>
          {percentage}%
        </span>
      )}
    </div>
  );
}

function SourceBadge({ source, confidence }: { source: string; confidence?: string }) {
  const colors: Record<string, string> = {
    'BLE_BATTERY_SERVICE': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'ANDROID_PLATFORM': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'VENDOR_ADAPTER': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'USER_ENTERED': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'ESTIMATED': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'UNAVAILABLE': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  const labels: Record<string, string> = {
    'BLE_BATTERY_SERVICE': 'BLE Battery Service',
    'ANDROID_PLATFORM': 'Android Platform',
    'VENDOR_ADAPTER': 'Vendor Adapter',
    'USER_ENTERED': 'User Entered',
    'ESTIMATED': 'Estimated',
    'UNAVAILABLE': 'Unavailable',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors[source] || colors['UNAVAILABLE']}`}>
      {labels[source] || source}
    </span>
  );
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const config: Record<ConnectionStatus, { color: string; label: string }> = {
    connected: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Connected' },
    paired: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Paired' },
    detected: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', label: 'Detected' },
    disconnected: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Disconnected' },
    unsupported: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Unsupported' },
    unknown: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Unknown' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-emerald-400 animate-pulse' : status === 'paired' ? 'bg-blue-400' : 'bg-slate-400'}`} />
      {c.label}
    </span>
  );
}

function DeviceIcon({ category }: { category: string }) {
  switch (category) {
    case 'earbuds': return <CircleDot className="w-5 h-5" />;
    case 'headphones': return <Headphones className="w-5 h-5" />;
    case 'speaker': return <Speaker className="w-5 h-5" />;
    case 'headset': return <Radio className="w-5 h-5" />;
    default: return <Bluetooth className="w-5 h-5" />;
  }
}

function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-medium hover:bg-cyan-500/20 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================

function DashboardPage({ devices, bluetoothEnabled, permissionGranted, isScanning, onScan, onNavigate, onSelectDevice }: any) {
  const connectedDevice = devices.find((d: BluetoothDevice) => d.status === 'connected');
  const pairedDevices = devices.filter((d: BluetoothDevice) => d.status === 'paired');

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Connection Status Card */}
      {!bluetoothEnabled ? (
        <Card className="border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-400">Bluetooth Disabled</h3>
              <p className="text-xs text-slate-400">Enable Bluetooth to discover and monitor devices</p>
            </div>
            <button
              onClick={() => {}}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20"
            >
              Enable
            </button>
          </div>
        </Card>
      ) : !permissionGranted ? (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-400">Permission Required</h3>
              <p className="text-xs text-slate-400">Bluetooth permission is needed to access device information</p>
            </div>
            <button
              onClick={() => {}}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20"
            >
              Grant
            </button>
          </div>
        </Card>
      ) : connectedDevice ? (
        <Card className="border-cyan-500/20 animate-pulse-glow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/20">
                <DeviceIcon category={connectedDevice.category} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{connectedDevice.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <ConnectionBadge status={connectedDevice.status} />
                  <span className="text-[10px] text-slate-500">
                    Updated {Math.round((Date.now() - connectedDevice.lastSeen) / 60000)}m ago
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onScan} className="p-2 rounded-xl hover:bg-slate-700/50 transition-colors">
              <RefreshCw className={`w-4 h-4 text-slate-400 ${isScanning ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Battery Display */}
          {connectedDevice.batteryReadings.length > 0 ? (
            <div className="mt-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Battery Level</span>
                <SourceBadge source={connectedDevice.batteryReadings[0].source} />
              </div>
              <BatteryBar percentage={connectedDevice.batteryReadings[0].percentage} size="lg" />
            </div>
          ) : (
            <div className="mt-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-3.5 h-3.5" />
                <span>Battery information not available through current interface</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => onNavigate('diagnostic')}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] text-slate-400">60s Diagnostic</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] text-slate-400">History</span>
            </button>
            <button
              onClick={() => onNavigate('device-detail', connectedDevice)}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all"
            >
              <Gauge className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] text-slate-400">Details</span>
            </button>
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={Bluetooth}
            title="No Connected Device"
            description="Connect a Bluetooth audio device or scan to discover nearby devices"
            action={{ label: 'Scan for Devices', onClick: onScan }}
          />
        </Card>
      )}

      {/* Paired Devices */}
      {pairedDevices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-semibold text-slate-300">Paired Devices</h2>
            <button onClick={() => onNavigate('devices')} className="text-xs text-cyan-400 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {pairedDevices.map((device: BluetoothDevice) => (
              <Card key={device.id} onClick={() => onSelectDevice(device)} className="!p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                    <DeviceIcon category={device.category} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-200 truncate">{device.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ConnectionBadge status={device.status} />
                      <span className="text-[10px] text-slate-500">
                        Last seen {Math.round((Date.now() - device.lastSeen) / 3600000)}h ago
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => onNavigate('specs')}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Spec Library</span>
          </div>
          <p className="text-2xl font-bold text-white">{demoSpecifications.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Verified specifications</p>
        </Card>
        <Card onClick={() => onNavigate('history')}>
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-teal-400" />
            <span className="text-xs text-slate-400">Readings</span>
          </div>
          <p className="text-2xl font-bold text-white">{demoHistoryData.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Battery history entries</p>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="border-cyan-500/10 bg-cyan-500/5">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Demo Mode:</strong> This web version uses simulated data. 
              Battery readings shown are for demonstration. On Android, data comes from actual Bluetooth connections 
              and BLE Battery Service reads.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ==================== DEVICES PAGE ====================

function DevicesPage({ devices, isScanning, onScan, onSelectDevice }: any) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? devices : devices.filter((d: BluetoothDevice) => d.status === filter);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">My Devices</h2>
        <button
          onClick={onScan}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isScanning
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {/* Scanning indicator */}
      {isScanning && (
        <Card className="border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Bluetooth className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400">Scanning for devices...</p>
              <p className="text-xs text-slate-500">BLE scan in progress (auto-stops in 30s)</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'connected', 'paired', 'disconnected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Device List */}
      <div className="space-y-2">
        {filtered.map((device: BluetoothDevice) => (
          <Card key={device.id} onClick={() => onSelectDevice(device)} className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                device.status === 'connected'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20'
                  : 'bg-slate-800 border border-slate-700/50'
              }`}>
                <DeviceIcon category={device.category} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{device.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{device.manufacturer} • {device.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <ConnectionBadge status={device.status} />
                  {device.rssi && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                      <Signal className="w-2.5 h-2.5" /> {device.rssi} dBm
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {device.batteryReadings[0]?.percentage !== undefined && device.batteryReadings[0]?.percentage !== null && (
                  <div className="text-lg font-bold text-emerald-400">{device.batteryReadings[0].percentage}%</div>
                )}
                <ChevronRight className="w-4 h-4 text-slate-600 ml-auto mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Bluetooth}
          title="No Devices Found"
          description="No devices match the current filter. Try scanning or changing filters."
          action={{ label: 'Scan Again', onClick: onScan }}
        />
      )}
    </div>
  );
}

// ==================== DEVICE DETAIL PAGE ====================

function DeviceDetailPage({ device, onBack }: { device: BluetoothDevice; onBack: () => void }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Devices
      </button>

      {/* Device Header */}
      <Card className="border-cyan-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/20">
            <DeviceIcon category={device.category} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{device.name}</h2>
            <p className="text-sm text-slate-400">{device.manufacturer} {device.modelNumber ? `• ${device.modelNumber}` : ''}</p>
            <div className="flex items-center gap-2 mt-1">
              <ConnectionBadge status={device.status} />
            </div>
          </div>
        </div>
      </Card>

      {/* Battery Section */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Battery className="w-4 h-4 text-cyan-400" /> Battery Information
        </h3>
        {device.batteryReadings.length > 0 ? (
          <div className="space-y-3">
            {device.batteryReadings.map((reading) => (
              <div key={reading.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300 capitalize">{reading.component} Battery</span>
                  <SourceBadge source={reading.source} />
                </div>
                <BatteryBar percentage={reading.percentage} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-500">
                    {reading.isStale ? '⚠️ Stale' : '✓ Fresh'} • {reading.freshnessMinutes}m ago
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    reading.confidence === 'high' ? 'bg-emerald-500/10 text-emerald-400' :
                    reading.confidence === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {reading.confidence} confidence
                  </span>
                </div>
                {reading.errorMessage && (
                  <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {reading.errorMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
            <BatteryLow className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Battery information is not available</p>
            <p className="text-xs text-slate-500 mt-1">
              This device's current Bluetooth interface does not expose battery data to third-party apps.
            </p>
          </div>
        )}
      </Card>

      {/* Connection Info */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Bluetooth className="w-4 h-4 text-cyan-400" /> Connection Details
        </h3>
        <div className="space-y-2">
          <InfoRow label="Status" value={device.status} />
          <InfoRow label="Address" value={device.address} />
          <InfoRow label="Last Seen" value={new Date(device.lastSeen).toLocaleString()} />
          <InfoRow label="Category" value={device.category} />
          {device.rssi && <InfoRow label="RSSI" value={`${device.rssi} dBm`} />}
          <InfoRow label="Supported Components" value={device.supportedComponents.join(', ')} />
        </div>
      </Card>

      {/* GATT Services */}
      {device.gattServices && device.gattServices.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> GATT Services
          </h3>
          <div className="space-y-2">
            {device.gattServices.map(service => (
              <div key={service.uuid} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-cyan-400">{service.name}</span>
                  <span className="text-[9px] font-mono text-slate-500">{service.uuid.slice(0, 8)}...</span>
                </div>
                {service.characteristics.map(char => (
                  <div key={char.uuid} className="flex items-center justify-between py-1 border-t border-slate-700/30 mt-1">
                    <span className="text-[11px] text-slate-300">{char.name}</span>
                    <div className="flex items-center gap-1">
                      {char.properties.map(prop => (
                        <span key={prop} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                          {prop}
                        </span>
                      ))}
                      {char.lastValue && (
                        <span className="text-[10px] text-emerald-400 ml-1">= {char.lastValue}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-700/30 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-200 font-mono">{value}</span>
    </div>
  );
}

// ==================== BATTERY PAGE ====================

function BatteryPage({ devices }: { devices: BluetoothDevice[] }) {
  const chartData = demoHistoryData.slice(0, 24).reverse().map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    percentage: Math.round(entry.percentage),
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-white">Battery & Runtime</h2>

      {/* Current Status */}
      <Card className="border-cyan-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <BatteryMedium className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Sony WH-1000XM5</h3>
            <p className="text-xs text-slate-400">Currently connected</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold text-emerald-400">78%</p>
            <p className="text-[10px] text-slate-500">1 min ago</p>
          </div>
        </div>
        <BatteryBar percentage={78} size="lg" />
      </Card>

      {/* Runtime Estimation */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Timer className="w-4 h-4 text-amber-400" /> Runtime Estimation
        </h3>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Estimated Remaining</span>
            <span className="text-lg font-bold text-cyan-400">~4h 15m</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Observed interval</span>
              <span className="text-slate-300">24 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Discharge rate</span>
              <span className="text-slate-300">~3.4%/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data quality</span>
              <span className="text-emerald-400">Good (48 samples)</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            Actual runtime varies with volume, codec, ANC settings, temperature, and device behavior.
          </p>
        </div>
      </Card>

      {/* Battery Chart */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" /> Battery History (24h)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2640" />
              <XAxis dataKey="time" stroke="#5a6a80" fontSize={10} tickLine={false} />
              <YAxis stroke="#5a6a80" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#151d2e', border: '1px solid #22d3ee33', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#8b9bb4' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area type="monotone" dataKey="percentage" stroke="#22d3ee" fill="url(#batteryGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* All Device Batteries */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">All Devices</h3>
        <div className="space-y-3">
          {devices.map((device: BluetoothDevice) => (
            <div key={device.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DeviceIcon category={device.category} />
                  <span className="text-xs font-medium text-slate-200">{device.name}</span>
                </div>
                <ConnectionBadge status={device.status} />
              </div>
              {device.batteryReadings.length > 0 ? (
                device.batteryReadings.map(r => (
                  <div key={r.id} className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 capitalize">{r.component}</span>
                      <SourceBadge source={r.source} />
                    </div>
                    <BatteryBar percentage={r.percentage} size="sm" />
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-500 mt-1">No battery data available</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ==================== DIAGNOSTIC PAGE ====================

function DiagnosticPage({ device }: { device: BluetoothDevice }) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<DiagnosticPhaseResult[]>([]);
  const [progress, setProgress] = useState(0);

  const phases: { name: string; duration: number; icon: any }[] = [
    { name: 'Preflight', duration: 5, icon: Shield },
    { name: 'Identification', duration: 10, icon: Search },
    { name: 'Capability', duration: 15, icon: Cpu },
    { name: 'Measurement', duration: 15, icon: Gauge },
    { name: 'Validation', duration: 10, icon: CheckCircle2 },
    { name: 'Report', duration: 5, icon: FileText },
  ];

  const startDiagnostic = () => {
    setPhase('running');
    setCurrentStep(0);
    setResults([]);
    setProgress(0);

    let step = 0;
    const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 1;
      setProgress(Math.min(100, (elapsed / totalDuration) * 100));

      // Check if we should advance to next step
      let accumulated = 0;
      for (let i = 0; i < phases.length; i++) {
        accumulated += phases[i].duration;
        if (elapsed >= accumulated && step <= i) {
          step = i + 1;
          setCurrentStep(step);
          setResults(prev => [...prev, {
            phase: phases[i].name.toLowerCase() as any,
            status: 'passed',
            duration: phases[i].duration,
            details: getPhaseDetails(phases[i].name)
          }]);
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setPhase('complete');
      }
    }, 500);
  };

  const cancelDiagnostic = () => {
    setPhase('idle');
    setCurrentStep(0);
    setProgress(0);
    setResults([]);
  };

  const getPhaseDetails = (name: string): string[] => {
    switch (name) {
      case 'Preflight': return ['Android version: 14 (API 34)', 'Bluetooth adapter: Available', 'BLUETOOTH_CONNECT: Granted', 'BLUETOOTH_SCAN: Granted'];
      case 'Identification': return [`Device found: ${device.name}`, `Category: ${device.category}`, `Status: ${device.status}`];
      case 'Capability': return ['BLE Battery Service: Available', 'Device Information: Available', 'GATT connection: Established'];
      case 'Measurement': return ['Battery Level: 78% (BLE)', 'Reading source: BLE_BATTERY_SERVICE', 'Timestamp: Valid'];
      case 'Validation': return ['Value range: Valid (0-100)', 'Freshness: Current (<5min)', 'Data quality: High'];
      case 'Report': return ['Diagnostic completed successfully', 'All checks passed', 'Battery data verified'];
      default: return [];
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-white">60-Second Diagnostic</h2>

      {phase === 'idle' && (
        <Card className="text-center py-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <Activity className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Diagnose</h3>
          <p className="text-sm text-slate-400 mb-1">Target: {device.name}</p>
          <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
            This diagnostic will check Bluetooth connectivity, permissions, battery data availability, 
            and device capabilities. Results are based on actual readings.
          </p>
          <button
            onClick={startDiagnostic}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4" /> Start Diagnostic
          </button>
        </Card>
      )}

      {phase === 'running' && (
        <>
          {/* Progress */}
          <Card className="border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-cyan-400">Running Diagnostic...</span>
              <span className="text-sm font-mono text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Phase {Math.min(currentStep + 1, phases.length)}/{phases.length}: {phases[Math.min(currentStep, phases.length - 1)].name}
              </span>
              <button
                onClick={cancelDiagnostic}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <Square className="w-3 h-3" /> Cancel
              </button>
            </div>
          </Card>

          {/* Phase Steps */}
          <div className="space-y-2">
            {phases.map((p, i) => {
              const Icon = p.icon;
              const isComplete = i < currentStep;
              const isActive = i === currentStep;
              const isPending = i > currentStep;

              return (
                <div
                  key={p.name}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-cyan-500/10 border border-cyan-500/20' :
                    isComplete ? 'bg-emerald-500/5 border border-emerald-500/10' :
                    'bg-slate-800/30 border border-slate-700/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-cyan-500/20' :
                    isComplete ? 'bg-emerald-500/20' :
                    'bg-slate-700/50'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isActive ? (
                      <Icon className="w-4 h-4 text-cyan-400 animate-pulse" />
                    ) : (
                      <Icon className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-cyan-400' :
                      isComplete ? 'text-emerald-400' :
                      'text-slate-500'
                    }`}>{p.name}</span>
                    {isActive && (
                      <p className="text-[10px] text-slate-400 mt-0.5">In progress...</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{p.duration}s</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {phase === 'complete' && (
        <>
          {/* Result Summary */}
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-400">Diagnostic Complete</h3>
                <p className="text-xs text-slate-400">All phases completed successfully</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <p className="text-lg font-bold text-emerald-400">{results.length}</p>
                <p className="text-[10px] text-slate-400">Phases Passed</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <p className="text-lg font-bold text-cyan-400">78%</p>
                <p className="text-[10px] text-slate-400">Battery Found</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <p className="text-lg font-bold text-teal-400">High</p>
                <p className="text-[10px] text-slate-400">Data Quality</p>
              </div>
            </div>
          </Card>

          {/* Detailed Results */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Detailed Results</h3>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-200 capitalize">{result.phase}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {result.status}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {result.details.map((detail, j) => (
                      <p key={j} className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span className="text-emerald-400">✓</span> {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => { setPhase('idle'); setProgress(0); setResults([]); }}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-medium hover:bg-cyan-500/20 transition-all"
            >
              Run Again
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700/50 text-sm font-medium hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== TECHNICAL LAB PAGE ====================

function TechnicalLabPage({ device }: { device: BluetoothDevice }) {
  const [activeTab, setActiveTab] = useState<'connection' | 'gatt' | 'audio' | 'report'>('connection');

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-white">Technical Lab</h2>
      <p className="text-xs text-slate-400">Advanced diagnostics and technical information</p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-800/50 border border-slate-700/50">
        {(['connection', 'gatt', 'audio', 'report'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'connection' && (
        <div className="space-y-3">
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Connection Diagnostics</h3>
            <div className="space-y-2">
              <DiagnosticRow label="Bluetooth Adapter" status="ok" detail="Available & Enabled" />
              <DiagnosticRow label="Bond State" status="ok" detail="Bonded" />
              <DiagnosticRow label="Audio Profile (A2DP)" status="ok" detail="Connected" />
              <DiagnosticRow label="GATT Connection" status={device.status === 'connected' ? 'ok' : 'warn'} detail={device.status === 'connected' ? 'Active' : 'Not connected'} />
              <DiagnosticRow label="Last Error" status="ok" detail="None" />
              <DiagnosticRow label="Last Successful Read" status="ok" detail="1 min ago" />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Signal Information</h3>
            {device.rssi ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">RSSI</span>
                  <span className="text-sm font-mono text-cyan-400">{device.rssi} dBm</span>
                </div>
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, (device.rssi + 100) * 1.5))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Weak (-100)</span>
                  <span>Strong (-30)</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Source: BLE scan result • Measured: {new Date().toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">RSSI not available for this device</p>
            )}
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Audio Channel Test</h3>
            <p className="text-xs text-slate-400 mb-3">
              Test audio output channels. This plays a short tone through each channel.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-center">
                <Volume2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Left</span>
              </button>
              <button className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-center">
                <Volume2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Right</span>
              </button>
              <button className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-center">
                <Volume2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Mono</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Playback test does not prove physical hardware is defect-free.
            </p>
          </Card>
        </div>
      )}

      {activeTab === 'gatt' && (
        <div className="space-y-3">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300">GATT Service Explorer</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Read-only</span>
            </div>
            {device.gattServices && device.gattServices.length > 0 ? (
              <div className="space-y-3">
                {device.gattServices.map(service => (
                  <div key={service.uuid} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold text-cyan-400">{service.name}</span>
                        <p className="text-[9px] font-mono text-slate-500 mt-0.5">{service.uuid}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">{service.characteristics.length} chars</span>
                    </div>
                    {service.characteristics.map(char => (
                      <div key={char.uuid} className="mt-2 pt-2 border-t border-slate-700/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-200">{char.name}</span>
                          <div className="flex gap-1">
                            {char.properties.map(p => (
                              <span key={p} className={`text-[9px] px-1.5 py-0.5 rounded ${
                                p === 'read' ? 'bg-emerald-500/10 text-emerald-400' :
                                p === 'write' ? 'bg-red-500/10 text-red-400' :
                                p === 'notify' ? 'bg-cyan-500/10 text-cyan-400' :
                                'bg-purple-500/10 text-purple-400'
                              }`}>{p}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 mt-0.5">{char.uuid}</p>
                        {char.lastValue && (
                          <p className="text-[10px] text-emerald-400 mt-1">Last value: {char.lastValue}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No GATT services discovered. Device may not support BLE or is not connected.</p>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'audio' && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Audio Information</h3>
          <div className="space-y-2">
            <InfoRow label="Audio Codec" value="SBC / AAC" />
            <InfoRow label="Sample Rate" value="44.1 kHz" />
            <InfoRow label="Bit Depth" value="16-bit" />
            <InfoRow label="Channel Mode" value="Stereo" />
            <InfoRow label="A2DP Profile" value="Connected" />
            <InfoRow label="AVRCP Profile" value="Connected" />
          </div>
          <p className="text-[10px] text-slate-500 mt-3 flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            Audio codec information retrieved from Android AudioManager. Actual codec depends on device negotiation.
          </p>
        </Card>
      )}

      {activeTab === 'report' && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Diagnostic Report</h3>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 font-mono text-[11px] text-slate-300 space-y-1 max-h-64 overflow-y-auto">
            <p className="text-cyan-400"># SonicLens Diagnostic Report</p>
            <p className="text-slate-500"># Generated: {new Date().toISOString()}</p>
            <p className="text-slate-500"># Device identifiers redacted</p>
            <p>&nbsp;</p>
            <p className="text-emerald-400">## Environment</p>
            <p>Platform: Web (Demo Mode)</p>
            <p>Android Version: 14 (API 34) [simulated]</p>
            <p>Bluetooth: Enabled</p>
            <p>Permissions: All granted</p>
            <p>&nbsp;</p>
            <p className="text-emerald-400">## Device</p>
            <p>Name: {device.name}</p>
            <p>Address: [REDACTED]</p>
            <p>Category: {device.category}</p>
            <p>Status: {device.status}</p>
            <p>&nbsp;</p>
            <p className="text-emerald-400">## Battery</p>
            <p>Source: BLE_BATTERY_SERVICE</p>
            <p>Level: 78%</p>
            <p>Freshness: 1 minute</p>
            <p>Confidence: High</p>
            <p>&nbsp;</p>
            <p className="text-emerald-400">## GATT Services</p>
            <p>{device.gattServices?.length || 0} services discovered</p>
            <p>Battery Service: Present</p>
            <p>Device Information: Present</p>
            <p>&nbsp;</p>
            <p className="text-amber-400">## Limitations</p>
            <p>- This is a web demo; actual Android data not available</p>
            <p>- Physical device testing: NOT PERFORMED</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium flex items-center justify-center gap-1">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="flex-1 py-2 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700/50 text-xs font-medium flex items-center justify-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

function DiagnosticRow({ label, status, detail }: { label: string; status: 'ok' | 'warn' | 'error'; detail: string }) {
  const colors = {
    ok: 'text-emerald-400',
    warn: 'text-amber-400',
    error: 'text-red-400'
  };
  const icons = {
    ok: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
    error: <XCircle className="w-3.5 h-3.5 text-red-400" />
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
      <div className="flex items-center gap-2">
        {icons[status]}
        <span className="text-xs text-slate-300">{label}</span>
      </div>
      <span className={`text-xs ${colors[status]}`}>{detail}</span>
    </div>
  );
}

// ==================== SPECIFICATIONS PAGE ====================

function SpecificationsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = demoSpecifications.filter(spec => {
    const matchesSearch = spec.productName.toLowerCase().includes(search.toLowerCase()) ||
      spec.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || spec.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-white">Specification Library</h2>
      <p className="text-xs text-slate-400">Verified device specifications and compatibility data</p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or manufacturer..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'earbuds', 'headphones', 'speaker'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Specs List */}
      <div className="space-y-3">
        {filtered.map(spec => (
          <Card key={spec.id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-white">{spec.productName}</h4>
                <p className="text-xs text-slate-400">{spec.manufacturer} {spec.modelNumber ? `• ${spec.modelNumber}` : ''}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                spec.dataQuality === 'high' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                spec.dataQuality === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {spec.dataQuality} quality
              </span>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-slate-500 w-20 flex-shrink-0">Category:</span>
                <span className="text-[11px] text-slate-300">{spec.category}</span>
              </div>
              {spec.officialBatterySpec && (
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-slate-500 w-20 flex-shrink-0">Battery:</span>
                  <span className="text-[11px] text-slate-300">{spec.officialBatterySpec}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-slate-500 w-20 flex-shrink-0">Components:</span>
                <span className="text-[11px] text-slate-300">{spec.batteryComponents.join(', ')}</span>
              </div>
              {spec.compatibilityNotes.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-slate-500 w-20 flex-shrink-0">Notes:</span>
                  <span className="text-[11px] text-amber-400/80">{spec.compatibilityNotes[0]}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/30">
              <span className="text-[10px] text-slate-500">
                Source: {spec.sourceType} • Verified: {new Date(spec.verificationDate).toLocaleDateString()}
              </span>
              {spec.sourceUrl && (
                <a href={spec.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline">
                  View source ↗
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Search}
          title="No Results"
          description="No specifications match your search. Try different terms."
        />
      )}
    </div>
  );
}

// ==================== BATTERY HISTORY PAGE ====================

function BatteryHistoryPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const chartData = demoHistoryData.slice(0, timeRange === '24h' ? 24 : timeRange === '7d' ? 48 : 48).reverse().map(entry => ({
    time: new Date(entry.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    percentage: Math.round(entry.percentage),
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Battery History</h2>
        <button className="p-2 rounded-xl hover:bg-slate-700/50 transition-colors">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Time Range */}
      <div className="flex gap-2">
        {(['24h', '7d', '30d'] as const).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeRange === range
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Sony WH-1000XM5</h3>
          <span className="text-xs text-slate-400">{chartData.length} readings</span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2640" />
              <XAxis dataKey="time" stroke="#5a6a80" fontSize={9} tickLine={false} interval="preserveStartEnd" />
              <YAxis stroke="#5a6a80" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#151d2e', border: '1px solid #22d3ee33', borderRadius: '12px', fontSize: '11px' }}
                labelStyle={{ color: '#8b9bb4' }}
              />
              <Area type="monotone" dataKey="percentage" stroke="#22d3ee" fill="url(#historyGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center !p-3">
          <p className="text-lg font-bold text-emerald-400">95%</p>
          <p className="text-[10px] text-slate-400">Highest</p>
        </Card>
        <Card className="text-center !p-3">
          <p className="text-lg font-bold text-amber-400">15%</p>
          <p className="text-[10px] text-slate-400">Lowest</p>
        </Card>
        <Card className="text-center !p-3">
          <p className="text-lg font-bold text-cyan-400">3.4%</p>
          <p className="text-[10px] text-slate-400">Avg drain/hr</p>
        </Card>
      </div>

      {/* Recent Readings */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Readings</h3>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {demoHistoryData.slice(0, 12).map(entry => (
            <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-slate-700/20 last:border-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  entry.percentage >= 60 ? 'bg-emerald-400' : entry.percentage >= 30 ? 'bg-amber-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-slate-300">{Math.round(entry.percentage)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <SourceBadge source={entry.source} />
                <span className="text-[10px] text-slate-500">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700/50 text-sm font-medium flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" /> Clear History
        </button>
      </div>
    </div>
  );
}

// ==================== SETTINGS PAGE ====================

function SettingsPage({ theme, setTheme, language, setLanguage, bluetoothEnabled, setBluetoothEnabled, permissionGranted, setPermissionGranted }: any) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-white">Settings & Privacy</h2>

      {/* Appearance */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Sun className="w-4 h-4 text-cyan-400" /> Appearance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Theme</span>
            <div className="flex gap-1 p-0.5 rounded-lg bg-slate-800/50">
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    theme === t ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                  }`}
                >
                  {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Language */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" /> Language
        </h3>
        <div className="flex gap-2">
          {([['en', 'English'], ['bn', 'বাংলা']] as const).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                language === code
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Bluetooth & Permissions */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Bluetooth className="w-4 h-4 text-cyan-400" /> Bluetooth & Permissions
        </h3>
        <div className="space-y-3">
          <ToggleRow
            label="Bluetooth"
            description="Enable/disable Bluetooth adapter"
            value={bluetoothEnabled}
            onChange={setBluetoothEnabled}
          />
          <ToggleRow
            label="Bluetooth Permissions"
            description="BLUETOOTH_CONNECT & BLUETOOTH_SCAN"
            value={permissionGranted}
            onChange={setPermissionGranted}
          />
        </div>
      </Card>

      {/* Data */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" /> Data & Storage
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-slate-300">History Retention</span>
              <p className="text-[10px] text-slate-500">Auto-delete readings older than</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
              <option>Never</option>
            </select>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium flex items-center justify-center gap-2 mt-2">
            <Trash2 className="w-4 h-4" /> Clear All Data
          </button>
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" /> Privacy
        </h3>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">SonicLens Privacy Notice:</strong>
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
              All data stored locally on your device
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
              No analytics, advertising, or tracking
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
              No account required, no cloud uploads
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
              Device addresses redacted in exported reports
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
              Works fully offline
            </li>
          </ul>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" /> About
        </h3>
        <div className="space-y-2">
          <InfoRow label="App" value="SonicLens" />
          <InfoRow label="Version" value="1.0.0 (Web Demo)" />
          <InfoRow label="Build" value="2024.01.15" />
          <InfoRow label="Platform" value="Web (React)" />
          <InfoRow label="Package" value="com.soniclens.bluetoothaudio" />
        </div>
        <p className="text-[10px] text-slate-500 mt-3 text-center">
          This web version demonstrates the SonicLens UI/UX. For full Bluetooth functionality, use the Android app.
        </p>
      </Card>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <span className="text-sm text-slate-300">{label}</span>
        <p className="text-[10px] text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-all relative ${
          value ? 'bg-cyan-500' : 'bg-slate-700'
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
          value ? 'left-5.5' : 'left-0.5'
        }`} style={{ left: value ? '22px' : '2px' }} />
      </button>
    </div>
  );
}

function Database({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
