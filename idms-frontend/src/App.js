import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Loader2, X, CheckCircle, Bell, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement
);

// --- Theme Styles Component ---
const ThemeStyles = () => (
  <style>{`
    :root.theme-light {
      --bg-primary: #ffffff; --bg-secondary: #f3f4f6; --bg-tertiary: #e5e7eb;
      --text-primary: #1f2937; --text-secondary: #6b7280; --border-color: #e5e7eb;
      --accent-color: #14b8a6; --accent-text-color: #ffffff; --chart-label-color: #6b7280;
    }
    :root.theme-dark {
      --bg-primary: #1f2937; --bg-secondary: #374151; --bg-tertiary: #4b5563;
      --text-primary: #f3f4f6; --text-secondary: #9ca3af; --border-color: #4b5563;
      --accent-color: #14b8a6; --accent-text-color: #ffffff; --chart-label-color: #9ca3af;
    }
    :root.theme-oceanic {
      --bg-primary: #0a192f; --bg-secondary: #172a45; --bg-tertiary: #233554;
      --text-primary: #ccd6f6; --text-secondary: #8892b0; --border-color: #233554;
      --accent-color: #64ffda; --accent-text-color: #0a192f; --chart-label-color: #8892b0;
    }
    :root.theme-sunset {
      --bg-primary: #2d1e2f; --bg-secondary: #452a4a; --bg-tertiary: #6d466b;
      --text-primary: #f5e6e8; --text-secondary: #d1b1cb; --border-color: #6d466b;
      --accent-color: #ff8e71; --accent-text-color: #2d1e2f; --chart-label-color: #d1b1cb;
    }
  `}</style>
);

// --- SVG Icons ---
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);
const Icons = {
  dashboard: <Icon path="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
  database: <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />,
  compare: <Icon path="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v14h-5v2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />,
  settings: <Icon path="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49-.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61-.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24-.42-.12-.64l2 3.46c.12.22.39.3.61-.22l2.49-1c.52.4 1.08.73 1.69-.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18-.49-.42l-.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23-.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />,
  logout: <Icon path="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />,
  menu: <Icon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />,
  search: <Icon path="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />,
};

// --- UI Components ---

const Sidebar = ({ activeView, setActiveView, isSidebarOpen, handleLogout }) => {
  const navItems = [
    { name: 'Dashboard', icon: Icons.dashboard }, { name: 'Data Management', icon: Icons.database },
    { name: 'Comparative Analysis', icon: Icons.compare }, { name: 'Settings', icon: Icons.settings },
  ];
  return (
    <aside className={`bg-[var(--bg-secondary)] text-[var(--text-primary)] flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-center h-20 border-b border-[var(--border-color)]">
            <svg className="w-10 h-10" style={{color: 'var(--accent-color)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l.477 2.387a2 2 0 001.806.547a2 2 0 001.806-.547l2.387-.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-.477-2.387a2 2 0 00-.547-1.806z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {isSidebarOpen && <h1 className="text-xl font-bold ml-2">IDMS</h1>}
        </div>
        <nav className="flex-1 px-4 py-4">
        {navItems.map(item => (
          <a key={item.name} href="#" onClick={(e) => { e.preventDefault(); setActiveView(item.name); }}
            className={`flex items-center py-3 px-4 my-2 rounded-lg transition-colors duration-200 ${activeView === item.name ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}`}>
            <div className="w-6 h-6">{item.icon}</div>
            {isSidebarOpen && <span className="ml-4">{item.name}</span>}
          </a>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-[var(--border-color)]">
        <button onClick={handleLogout} className="flex w-full items-center py-3 px-4 my-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]">
            <div className="w-6 h-6">{Icons.logout}</div>
            {isSidebarOpen && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const Header = ({ title, toggleSidebar, user, handleLogout, searchTerm, setSearchTerm, settings }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    
    const notifications = [
        { id: 1, text: 'Plant Alpha-1 reported unusual pressure spike.', time: '15m ago', type: 'Alert'},
        { id: 2, text: 'Compliance report for Germany is due tomorrow.', time: '1h ago', type: 'Warning'},
    ];
    
    const filteredNotifications = notifications.filter(n => {
        if (!settings?.notificationsEnabled) return false;
        if (n.type === 'Alert' && !settings.notifyOnAlert) return false;
        if (n.type === 'Warning' && !settings.notifyOnWarning) return false;
        return true;
    });

    return (
        <header className="bg-[var(--bg-primary)] shadow-sm flex items-center justify-between p-4 z-10">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-[var(--text-secondary)] mr-4 lg:hidden">{Icons.menu}</button>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-[var(--border-color)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]" 
              />
              <div className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)]">{Icons.search}</div>
            </div>
            
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative text-[var(--text-secondary)]">
                <Bell />
                {filteredNotifications.length > 0 && 
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{filteredNotifications.length}</span>
                }
              </button>
              {notificationsOpen && (
                 <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-lg z-20">
                    <div className="p-4 font-bold text-[var(--text-primary)] border-b border-[var(--border-color)]">Notifications</div>
                    <ul>
                        {filteredNotifications.map(notif => (
                            <li key={notif.id} className="p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                <p className="text-sm text-[var(--text-primary)]">{notif.text}</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">{notif.time}</p>
                            </li>
                        ))}
                    </ul>
                 </div>
              )}
            </div>

            <div className="relative">
              <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${user?.email ? user.email.charAt(0).toUpperCase() : 'U'}`} alt="User" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => setProfileOpen(!profileOpen)} />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-lg z-20">
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <p className="font-semibold text-sm text-[var(--text-primary)]">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]">
                        <LogOut className="mr-2" size={16}/> Logout
                    </button>
                </div>
              )}
            </div>
          </div>
        </header>
    );
};

const KPI = ({ title, value, unit, color }) => (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md flex-1">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value.toLocaleString()} <span className="text-lg font-medium text-[var(--text-secondary)]">{unit}</span></p>
    </div>
);

const Dashboard = ({ fetchWithAuth }) => {
  const [dashboardData, setDashboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:5001/api/records');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchWithAuth]);

  const { kpis, regionalCompliance, productMix, productionByPlant } = useMemo(() => {
    if (isLoading || error) return { kpis: null, regionalCompliance: null, productMix: null, productionByPlant: null };

    const totalProduction = dashboardData.reduce((sum, item) => sum + (parseFloat(item.volume) || 0), 0);
    const activeAlerts = dashboardData.filter(item => item.status === 'Alert').length;
    const averagePurity = dashboardData.length > 0 
      ? dashboardData.reduce((sum, item) => sum + (parseFloat(item.purity) || 0), 0) / dashboardData.length
      : 0;

    const regionGroups = dashboardData.reduce((acc, item) => {
      if (!acc[item.region]) acc[item.region] = { total: 0, stable: 0 };
      acc[item.region].total++;
      if (item.status === 'Stable') acc[item.region].stable++;
      return acc;
    }, {});

    const regionalComplianceData = {
      labels: Object.keys(regionGroups),
      datasets: [{
        label: 'Compliance (%)',
        data: Object.values(regionGroups).map(r => Math.round((r.stable / r.total) * 100 * 10) / 10),
        backgroundColor: ['rgba(75, 192, 192, 0.6)','rgba(54, 162, 235, 0.6)','rgba(255, 206, 86, 0.6)','rgba(153, 102, 255, 0.6)','rgba(255, 159, 64, 0.6)'],
        borderWidth: 1
      }]
    };

    const productGroups = dashboardData.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + (parseFloat(item.volume) || 0);
      return acc;
    }, {});

    const productMixData = {
      labels: Object.keys(productGroups),
      datasets: [{ data: Object.values(productGroups), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }]
    };

    const plantGroups = dashboardData.reduce((acc, item) => {
      acc[item.plant] = (acc[item.plant] || 0) + (parseFloat(item.volume) || 0);
      return acc;
    }, {});

    const productionByPlantData = {
      labels: Object.keys(plantGroups),
      datasets: [{
        label: 'Volume (tons)',
        data: Object.values(plantGroups),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    return {
      kpis: {
        totalProduction,
        complianceRate: dashboardData.length > 0 ? Math.round((dashboardData.filter(item => item.status === 'Stable').length / dashboardData.length) * 100 * 10) / 10 : 0,
        activeAlerts,
        averagePurity: Math.round(averagePurity * 10) / 10
      },
      regionalCompliance: regionalComplianceData,
      productMix: productMixData,
      productionByPlant: productionByPlantData
    };
  }, [dashboardData, isLoading, error]);

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin h-12 w-12 text-teal-500" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI title="Total Production" value={kpis?.totalProduction || 0} unit="tons" color="text-teal-500" />
        <KPI title="Compliance Rate" value={kpis?.complianceRate || 0} unit="%" color="text-green-500" />
        <KPI title="Active Alerts" value={kpis?.activeAlerts || 0} unit="" color="text-red-500" />
        <KPI title="Avg. Purity" value={kpis?.averagePurity || 0} unit="%" color="text-blue-500" />
      </div>
      <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Production by Plant</h3><div className="h-80">{productionByPlant && <Bar data={productionByPlant} options={{ maintainAspectRatio: false, scales: { x: { ticks: { color: 'var(--chart-label-color)'}}, y: { ticks: { color: 'var(--chart-label-color)'}}}}} />}</div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Regional Compliance</h3><div className="h-80">{regionalCompliance && <Doughnut data={regionalCompliance} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'var(--chart-label-color)'}}} }} />}</div></div>
        <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md lg:col-span-2"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Product Mix</h3><div className="h-80">{productMix && <Pie data={productMix} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'var(--chart-label-color)'}}} }} />}</div></div>
      </div>
    </div>
  );
};

const AddRecordModal = ({ isOpen, onClose, onRecordAdded, fetchWithAuth }) => {
  const [newRecord, setNewRecord] = useState({ name: '', plant: '', region: '', volume: '', purity: '', status: 'Stable' });
  if (!isOpen) return null;
  const handleChange = (e) => setNewRecord(p => ({ ...p, [e.target.name]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWithAuth('http://localhost:5001/api/records/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
    .then(res => res.json())
    .then(saved => { onRecordAdded(saved); onClose(); })
    .catch(console.error);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Add Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input name="name" placeholder="Name" onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]" required />
            <input name="plant" placeholder="Plant" onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]" required />
            <input name="region" placeholder="Region" onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]" required />
            <input type="number" name="volume" placeholder="Volume" onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]" required />
            <input type="number" step="0.01" name="purity" placeholder="Purity" onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]" required />
            <select name="status" onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"><option>Stable</option><option>Warning</option><option>Alert</option></select>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[var(--bg-tertiary)] rounded text-[var(--text-primary)]">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[var(--accent-color)] text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DataManagement = ({ searchTerm, fetchWithAuth }) => {
    const [records, setRecords] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        fetchWithAuth('http://localhost:5001/api/records').then(res => res.json()).then(setRecords).catch(console.error);
    }, [fetchWithAuth]);

    const filteredData = useMemo(() => {
        let data = [...records];
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter(i => i.name?.toLowerCase().includes(lower) || i.plant?.toLowerCase().includes(lower));
        }
        return data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [records, searchTerm, sortConfig]);

    const requestSort = (key) => setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending' });

    const getStatusChip = (status) => {
        switch(status) {
            case 'Stable': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Alert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <div className="p-6">
            <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRecordAdded={(r) => setRecords(p => [...p, r])} fetchWithAuth={fetchWithAuth} />
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Data Records</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-[var(--accent-color)] text-white px-4 py-2 rounded">Add Record</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-secondary)]">
                            <tr>
                                {['Name', 'Plant', 'Region', 'Volume', 'Purity', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-3 cursor-pointer" onClick={() => requestSort(h.toLowerCase())}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(r => (
                                <tr key={r._id} className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                    <td className="px-6 py-4">{r.name}</td><td className="px-6 py-4">{r.plant}</td>
                                    <td className="px-6 py-4">{r.region}</td><td className="px-6 py-4">{r.volume}</td>
                                    <td className="px-6 py-4">{r.purity}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChip(r.status)}`}>{r.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ComparativeAnalysis = ({ searchTerm, fetchWithAuth }) => {
  const [comparisonData, setComparisonData] = useState([]);
  const [compareBy, setCompareBy] = useState('region');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchWithAuth(`http://localhost:5001/api/analysis?compareBy=${compareBy}&search=${searchTerm}`)
      .then(response => response.json())
      .then(data => { setComparisonData(data); setIsLoading(false); })
      .catch(error => { console.error('Error fetching analysis data:', error); setIsLoading(false); });
  }, [compareBy, searchTerm, fetchWithAuth]);
  
  const chartData = {
    labels: comparisonData.map(item => item.name),
    datasets: [{
      label: `Total Production Volume (tons) by ${compareBy}`,
      data: comparisonData.map(item => item.totalVolume),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };
  
  return (
    <div className="p-6 space-y-6">
        <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">International Comparative Analysis</h2>
            <div className="flex items-center space-x-4 mb-6">
                 <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => setCompareBy('region')} className={`px-4 py-2 text-sm font-medium ${compareBy === 'region' ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)]'} border rounded-l-lg hover:bg-[var(--bg-tertiary)]`}>By Region</button>
                    <button onClick={() => setCompareBy('plant')} className={`px-4 py-2 text-sm font-medium ${compareBy === 'plant' ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)]'} border-t border-b border-r rounded-r-lg hover:bg-[var(--bg-tertiary)]`}>By Plant</button>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-12 w-12 text-teal-500" /></div>
            ) : (
                <>
                    <div className="h-96 mb-6">
                        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `Performance Metrics by ${compareBy}`, color: 'var(--chart-label-color)' }, legend: { labels: { color: 'var(--chart-label-color)'}} }, scales: {x:{ticks:{color:'var(--chart-label-color)'}}, y:{ticks:{color:'var(--chart-label-color)'}}} }} />
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                            <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-secondary)]">
                                <tr>
                                    <th className="px-6 py-3">{compareBy.charAt(0).toUpperCase() + compareBy.slice(1)}</th>
                                    <th className="px-6 py-3">Total Volume (tons)</th>
                                    <th className="px-6 py-3">Average Purity (%)</th>
                                    <th className="px-6 py-3">Alert Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map(item => (
                                    <tr key={item.name} className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{item.name}</td>
                                        <td className="px-6 py-4">{item.totalVolume.toLocaleString()}</td>
                                        <td className="px-6 py-4">{item.averagePurity}</td>
                                        <td className="px-6 py-4">{item.alertCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

const Settings = ({ settings, onUpdate, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveStatus, setSaveStatus] = useState('');
  
  useEffect(() => { setLocalSettings(settings); }, [settings]);

  const regions = [ 'USA (Houston)', 'Germany (Ludwigshafen)', 'China (Shanghai)', 'Saudi Arabia (Jubail)', 'Singapore', 'South Korea (Ulsan)', 'Netherlands (Rotterdam)', 'India (Jamnagar)' ];
  const themes = ['Light', 'Dark', 'Oceanic', 'Sunset'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = { ...localSettings, [name]: type === 'checkbox' ? checked : value };
    setLocalSettings(newSettings);
    onUpdate(newSettings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    onSave(localSettings)
      .then(() => { setSaveStatus('success'); setTimeout(() => setSaveStatus(''), 3000); })
      .catch(() => setSaveStatus('error'));
  };

  if (!settings) {
    return (<div className="p-6 h-full flex justify-center items-center"><Loader2 className="animate-spin h-12 w-12 text-teal-500" /></div>);
  }

  return (
    <div className="p-6">
      <div className="bg-[var(--bg-primary)] p-8 rounded-xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">System Settings</h2>
        <p className="mb-8 text-[var(--text-secondary)]">Manage global application parameters and user preferences.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-[var(--text-primary)]">General</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-[var(--text-secondary)]">Theme</label>
                <select id="theme" name="theme" value={localSettings.theme} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]">
                  {themes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="defaultRegion" className="block text-sm font-medium text-[var(--text-secondary)]">Default Region</label>
                <select id="defaultRegion" name="defaultRegion" value={localSettings.defaultRegion} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]">
                  {regions.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
             <div className="mt-6">
                <label className="flex items-center">
                    <input type="checkbox" name="notificationsEnabled" checked={localSettings.notificationsEnabled} onChange={handleChange} className="h-4 w-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]" />
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">Enable All Notifications</span>
                </label>
            </div>
          </div>
          
          <div className="border-t border-[var(--border-color)] pt-8">
            <h3 className="text-lg font-medium leading-6 text-[var(--text-primary)]">Alert Thresholds & Notifications</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="volumeAlertThreshold" className="block text-sm font-medium text-[var(--text-secondary)]">Volume Alert Threshold (tons)</label>
                <input type="number" id="volumeAlertThreshold" name="volumeAlertThreshold" value={localSettings.volumeAlertThreshold} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]" />
              </div>
              <div>
                <label htmlFor="purityWarningThreshold" className="block text-sm font-medium text-[var(--text-secondary)]">Purity Warning Threshold (%)</label>
                <input type="number" step="0.1" id="purityWarningThreshold" name="purityWarningThreshold" value={localSettings.purityWarningThreshold} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
                <label className="flex items-center">
                    <input type="checkbox" name="notifyOnAlert" checked={localSettings.notifyOnAlert} onChange={handleChange} className="h-4 w-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]" />
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">Notify on 'Alert' status</span>
                </label>
                 <label className="flex items-center">
                    <input type="checkbox" name="notifyOnWarning" checked={localSettings.notifyOnWarning} onChange={handleChange} className="h-4 w-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]" />
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">Notify on 'Warning' status</span>
                </label>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4">
            {saveStatus === 'success' && (<div className="flex items-center text-green-600 mr-4"><CheckCircle size={20} className="mr-2" /><span>Settings saved!</span></div>)}
            <button type="submit" disabled={saveStatus === 'saving'} className="bg-[var(--accent-color)] text-[var(--accent-text-color)] px-6 py-2 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50">
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AuthForm = ({ isLogin, onSwitchMode }) => {
    const [data, setData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, signup, getAccessToken, setMongoUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let userCred;
            if (isLogin) {
                userCred = await login(data.email, data.password);
            } else {
                userCred = await signup(data.email, data.password, data.username);
            }
            
            // Sync with MongoDB
            const token = await userCred.user.getIdToken();
            const syncRes = await fetch('http://localhost:5001/api/auth/sync', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: data.username || userCred.user.displayName })
            });
            
            if (!syncRes.ok) {
                console.error("Sync failed");
            } else {
                const mongoData = await syncRes.json();
                setMongoUser(mongoData.user);
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && <input name="username" placeholder="Username" onChange={e => setData({...data, username: e.target.value})} className="w-full p-3 border rounded" required />}
                    <input name="email" placeholder="Email" onChange={e => setData({...data, email: e.target.value})} className="w-full p-3 border rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={e => setData({...data, password: e.target.value})} className="w-full p-3 border rounded" required />
                    <button type="submit" className="w-full p-3 bg-teal-500 text-white rounded font-bold">{isLogin ? 'Login' : 'Create'}</button>
                </form>
                <button onClick={onSwitchMode} className="w-full text-center text-teal-600 mt-4 text-sm font-semibold">{isLogin ? 'Create an account' : 'Have an account?'}</button>
            </div>
        </div>
    );
};

// --- Main Component ---
const MainApp = () => {
  const { currentUser, logout, getAccessToken } = useAuth();
  const [activeView, setActiveView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [settings, setSettings] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authMode, setAuthMode] = useState('login');

  // Helper function to attach token to fetch requests
  const fetchWithAuth = async (url, options = {}) => {
    const token = await getAccessToken();
    const headers = { 
      ...options.headers, 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return fetch(url, { ...options, headers });
  };

  useEffect(() => {
    if (currentUser) {
      fetchWithAuth('http://localhost:5001/api/settings')
        .then(res => res.json())
        .then(setSettings)
        .catch(console.error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      root.className = `theme-${settings.theme.toLowerCase()}`;
      ChartJS.defaults.color = getComputedStyle(root).getPropertyValue('--chart-label-color').trim();
      ChartJS.defaults.borderColor = getComputedStyle(root).getPropertyValue('--border-color').trim();
    }
  }, [settings]);

  const handleSaveSettings = (newSettings) => {
    fetchWithAuth('http://localhost:5001/api/settings', { method: 'POST', body: JSON.stringify(newSettings) })
      .then(res => res.json())
      .then(data => setSettings(data.settings))
      .catch(console.error);
  };

  if (!currentUser) {
    return <AuthForm isLogin={authMode === 'login'} onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} />;
  }

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] font-sans text-[var(--text-primary)]">
      <ThemeStyles />
      <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} handleLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={activeView} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          user={currentUser} 
          handleLogout={logout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          settings={settings}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {activeView === 'Dashboard' && <Dashboard fetchWithAuth={fetchWithAuth} />}
          {activeView === 'Data Management' && <DataManagement searchTerm={searchTerm} fetchWithAuth={fetchWithAuth} />}
          {activeView === 'Comparative Analysis' && <ComparativeAnalysis searchTerm={searchTerm} fetchWithAuth={fetchWithAuth} />}
          {activeView === 'Settings' && <Settings settings={settings} onUpdate={setSettings} onSave={handleSaveSettings} />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}