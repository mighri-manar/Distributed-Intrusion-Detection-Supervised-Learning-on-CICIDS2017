import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Shield, Activity, Network, Bell, Settings, Play, Pause, Radio, TrendingUp } from 'lucide-react';
import io from 'socket.io-client';

const IDSDesktopApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [realtimeData, setRealtimeData] = useState([]);
  const [stats, setStats] = useState({
    packetsPerSecond: 0,
    flowsAnalyzed: 0,
    attacksDetected: 0,
    accuracy: 98.45
  });
  const [livePackets, setLivePackets] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);
  const packetCountRef = useRef(0);

  // WebSocket connection using socket.io-client
  useEffect(() => {
    console.log('Connecting to backend...');
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });
    
    socket.on('connect', () => {
      console.log('✓ Connected to IDS backend');
      setConnectionStatus('connected');
    });
    
    socket.on('disconnect', () => {
      console.log('✗ Disconnected from backend');
      setConnectionStatus('disconnected');
    });
    
    socket.on('connected', (data) => {
      console.log('Server confirmed connection:', data);
    });
    
    socket.on('packet_captured', (data) => {
      packetCountRef.current += 1;
      
      setLivePackets(prev => {
        const newPackets = [data, ...prev].slice(0, 100);
        return newPackets;
      });
    });
    
    socket.on('flow_analyzed', (data) => {
      console.log('Flow analyzed:', data);
      
      setRealtimeData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          packets: data.packets,
          confidence: data.confidence * 100
        }];
        return newData.slice(-20);
      });
      
      setStats(prev => ({ 
        ...prev, 
        flowsAnalyzed: prev.flowsAnalyzed + 1,
        attacksDetected: data.is_attack ? prev.attacksDetected + 1 : prev.attacksDetected
      }));
    });
    
    socket.on('alert', (data) => {
      console.log('🚨 Alert:', data);
      setAlerts(prev => [data, ...prev].slice(0, 50));
    });
    
    socketRef.current = socket;
    
    return () => {
      socket.disconnect();
    };
  }, []);

  // Update packets per second counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        packetsPerSecond: packetCountRef.current
      }));
      packetCountRef.current = 0;
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleCapture = useCallback(async () => {
    try {
      const endpoint = isCapturing ? 'stop_capture' : 'start_capture';
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interface: 'wlp0s20f3' })
      });
      
      const result = await response.json();
      console.log('Capture toggle result:', result);
      
      if (result.status === 'started' || result.status === 'stopped') {
        setIsCapturing(!isCapturing);
      }
    } catch (e) {
      console.error('Failed to toggle capture:', e);
      alert('Failed to toggle capture. Make sure backend is running.');
    }
  }, [isCapturing]);

  const toggleSimulator = useCallback(async () => {
    try {
      const endpoint = isSimulating ? 'stop_simulator' : 'start_simulator';
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: 15 })
      });
      
      const result = await response.json();
      console.log('Simulator toggle result:', result);
      
      if (result.status === 'started' || result.status === 'stopped') {
        setIsSimulating(!isSimulating);
      }
    } catch (e) {
      console.error('Failed to toggle simulator:', e);
      alert('Failed to toggle simulator. Make sure backend is running.');
    }
  }, [isSimulating]);

  const injectAttack = useCallback(async (attackType) => {
    try {
      const response = await fetch('http://localhost:5000/api/inject_attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: attackType })
      });
      
      const result = await response.json();
      console.log('Attack injected:', result);
    } catch (e) {
      console.error('Failed to inject attack:', e);
    }
  }, []);

  const attackDistribution = useMemo(() => [
    { name: 'BENIGN', value: 87, color: '#10b981' },
    { name: 'SQL Injection', value: 6, color: '#ef4444' },
    { name: 'XSS', value: 4, color: '#f59e0b' },
    { name: 'Brute Force', value: 3, color: '#dc2626' }
  ], []);

  // Sidebar Navigation - Memoized to prevent re-renders
  const Sidebar = useCallback(() => (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold">SecureWatch</h1>
            <p className="text-xs text-gray-400">IDS v2.0</p>
          </div>
        </div>
        <div className={`mt-3 flex items-center space-x-2 text-xs ${
          connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`} />
          <span>{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {[
          { id: 'dashboard', icon: Activity, label: 'Dashboard' },
          { id: 'live', icon: Radio, label: 'Live Monitor' },
          { id: 'alerts', icon: Bell, label: 'Alerts' },
          { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
          { id: 'network', icon: Network, label: 'Network Map' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              currentPage === item.id 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={toggleCapture}
          disabled={connectionStatus !== 'connected'}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all mb-2 ${
            connectionStatus !== 'connected'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isCapturing 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isCapturing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isCapturing ? 'Stop Capture' : 'Start Capture'}</span>
        </button>
        
        <button
          onClick={toggleSimulator}
          disabled={connectionStatus !== 'connected'}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
            connectionStatus !== 'connected'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isSimulating 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <span>🎭</span>
          <span>{isSimulating ? 'Stop Simulator' : 'Start Simulator'}</span>
        </button>
        
        {connectionStatus !== 'connected' && (
          <p className="text-xs text-red-400 mt-2 text-center">Backend offline</p>
        )}
      </div>
    </div>
  ), [connectionStatus, currentPage, isCapturing, toggleCapture]);

  // Dashboard Page
  const Dashboard = useCallback(() => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
          isCapturing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">{isCapturing ? 'Monitoring Active' : 'Inactive'}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Packets/sec', value: stats.packetsPerSecond, color: 'blue', icon: Activity },
          { label: 'Flows Analyzed', value: stats.flowsAnalyzed, color: 'green', icon: Network },
          { label: 'Attacks Detected', value: stats.attacksDetected, color: 'red', icon: AlertTriangle },
          { label: 'Model Accuracy', value: `${stats.accuracy}%`, color: 'purple', icon: Shield }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-Time Traffic Analysis</h3>
          {realtimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={realtimeData} key={`linechart-${realtimeData.length}`}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="packets" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data yet. Start capture to see traffic.
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attack Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={attackDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={false}
              >
                {attackDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
        {alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-center space-x-4">
                  <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                  <div>
                    <div className="font-semibold text-gray-800">{alert.attack_type}</div>
                    <div className="text-sm text-gray-600">{alert.src_ip} → {alert.dst_ip}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{(alert.confidence * 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No alerts yet. Start monitoring to detect attacks.
          </div>
        )}
      </div>
    </div>
  ), [isCapturing, stats, realtimeData, alerts, attackDistribution]);

  // Live Monitor Page
  const LiveMonitor = useCallback(() => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Live Network Monitor</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Packet Stream</h3>
          <span className="text-sm text-gray-600">Last 100 packets ({livePackets.length} captured)</span>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
          {livePackets.length > 0 ? (
            livePackets.map((pkt, i) => (
              <div key={`${pkt.timestamp}-${i}`} className="text-green-400 hover:bg-gray-800 px-2 py-1 rounded">
                <span className="text-gray-500">[{new Date(pkt.timestamp).toLocaleTimeString()}]</span>{' '}
                <span className="text-cyan-400">{pkt.src_ip}</span>{' '}
                <span className="text-gray-400">→</span>{' '}
                <span className="text-purple-400">{pkt.dst_ip}</span>{' '}
                <span className="text-yellow-400">{pkt.protocol}</span>{' '}
                <span className="text-gray-400">{pkt.size}B</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-20">
              Waiting for packets... Make sure capture is started.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detection Confidence</h3>
        {realtimeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={realtimeData.slice(-10)} key={`barchart-${realtimeData.length}`}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="confidence" fill="#06b6d4" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-52 flex items-center justify-center text-gray-400">
            No flow data yet
          </div>
        )}
      </div>
    </div>
  ), [livePackets, realtimeData]);

  // Alerts Page
  const AlertsPage = useCallback(() => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Security Alerts ({alerts.length})</h2>
      
      {alerts.length > 0 ? (
        <div className="grid gap-4">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    alert.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <AlertTriangle className={`w-6 h-6 ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{alert.attack_type}</h3>
                    <p className="text-gray-600 mt-1">Flow ID: {alert.flow_id}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <span>Source: <span className="font-mono text-cyan-600">{alert.src_ip}</span></span>
                      <span>→</span>
                      <span>Destination: <span className="font-mono text-purple-600">{alert.dst_ip}</span></span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    alert.severity === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-800">
                    {(alert.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Alerts Detected</h3>
          <p className="text-gray-400">Your network is secure. Start monitoring to detect threats.</p>
        </div>
      )}
    </div>
  ), [alerts]);

  // Analytics Page
  const AnalyticsPage = useMemo(() => {
    const attackTrends = Array.from({length: 24}, (_, i) => ({
      hour: `${i}:00`,
      attacks: Math.floor(Math.random() * 50)
    }));

    const protocolDist = [
      { protocol: 'HTTP', count: 450 },
      { protocol: 'HTTPS', count: 380 },
      { protocol: 'TCP', count: 290 },
      { protocol: 'UDP', count: 120 }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Advanced Analytics</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attack Trends (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attackTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attacks" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Protocol Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={protocolDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="protocol" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Targeted IPs</h3>
          <div className="space-y-3">
            {['192.168.1.100', '192.168.1.50', '192.168.1.25', '192.168.1.75'].map((ip, i) => (
              <div key={ip} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-gray-800">{ip}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{width: `${100 - i * 20}%`}}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{50 - i * 10} attacks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, []);

  // Settings Page
  const SettingsPage = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attack Simulator</h3>
        <p className="text-sm text-gray-600 mb-4">
          Inject simulated attacks for testing without actual malicious traffic
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Automatic Injection</span>
          <button
            onClick={toggleSimulator}
            disabled={connectionStatus !== 'connected'}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              connectionStatus !== 'connected'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSimulating
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isSimulating ? 'Stop Simulator' : 'Start Simulator'}
          </button>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Inject Single Attack:</p>
          <div className="grid grid-cols-3 gap-3">
            {['SQL Injection', 'XSS', 'Brute Force'].map(attack => (
              <button
                key={attack}
                onClick={() => injectAttack(attack)}
                disabled={connectionStatus !== 'connected'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  connectionStatus !== 'connected'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                {attack}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Network Interface</h3>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option>wlp0s20f3 - Wireless</option>
          <option>eth0 - Ethernet</option>
          <option>lo - Loopback</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detection Sensitivity</h3>
        <input type="range" min="0" max="100" defaultValue="80" className="w-full" />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Model Type:</span><span className="font-mono">RandomForest</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Features:</span><span className="font-mono">78</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Accuracy:</span><span className="font-mono">98.45%</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Training Date:</span><span className="font-mono">2024-12-17</span></div>
        </div>
      </div>
    </div>
  ), [connectionStatus, isSimulating, toggleSimulator, injectAttack]);

  const pages = useMemo(() => ({
    dashboard: <Dashboard />,
    live: <LiveMonitor />,
    alerts: <AlertsPage />,
    analytics: AnalyticsPage,
    network: <div className="text-2xl text-gray-400">Network Map - Coming Soon</div>,
    settings: SettingsPage
  }), [Dashboard, LiveMonitor, AlertsPage, AnalyticsPage, SettingsPage]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 overflow-y-auto">
        <div className="p-8">
          {pages[currentPage]}
        </div>
      </div>
    </div>
  );
};

export default IDSDesktopApp;