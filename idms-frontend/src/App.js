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
import { Loader2, X, CheckCircle, Bell, UserCircle, LogOut } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement
);

// --- NEW: Theme Styles Component ---
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


// --- SVG Icons (from your preferred design) ---
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

// --- MOCK DATA (Retained for the rich dashboard visuals) ---
const mockKPIData = { totalProduction: 185000, complianceRate: 98.5, activeAlerts: 12, energyConsumption: 5.2 };
const mockProductionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    { label: 'Ethylene (k-tons)', data: [65, 59, 80, 81, 56, 55, 40, 62, 75, 88, 92, 101], borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
    { label: 'Propylene (k-tons)', data: [28, 48, 40, 19, 86, 27, 90, 45, 60, 72, 80, 85], borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
  ],
};
const mockEmissionsData = {
  labels: ['Plant A', 'Plant B', 'Plant C', 'Plant D', 'Plant E'],
  datasets: [{ label: 'CO2 Emissions (tons)', data: [120, 150, 88, 110, 95], backgroundColor: ['rgba(255, 99, 132, 0.7)','rgba(54, 162, 235, 0.7)','rgba(255, 206, 86, 0.7)','rgba(75, 192, 192, 0.7)','rgba(153, 102, 255, 0.7)'], borderWidth: 1 }],
};
const mockRegionalCompliance = {
    labels: ['North America', 'Europe', 'Asia-Pacific', 'Middle East', 'South America'],
    datasets: [{ label: 'Regulatory Compliance Rate (%)', data: [98.2, 99.1, 96.5, 97.8, 95.2], backgroundColor: ['rgba(75, 192, 192, 0.6)','rgba(54, 162, 235, 0.6)','rgba(255, 206, 86, 0.6)','rgba(153, 102, 255, 0.6)','rgba(255, 159, 64, 0.6)'], borderWidth: 1 }]
};
const mockProductMix = {
    labels: ['Polymers', 'Solvents', 'Fertilizers', 'Specialty Chemicals', 'Base Chemicals'],
    datasets: [{ data: [35, 20, 18, 15, 12], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }]
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
          <a key={item.name} href="#" onClick={() => setActiveView(item.name)}
            className={`flex items-center py-3 px-4 my-2 rounded-lg transition-colors duration-200 ${activeView === item.name ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}`}>
            <div className="w-6 h-6">{item.icon}</div>
            {isSidebarOpen && <span className="ml-4">{item.name}</span>}
          </a>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-[var(--border-color)]">
        <a href="#" onClick={handleLogout} className="flex items-center py-3 px-4 my-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]">
            <div className="w-6 h-6">{Icons.logout}</div>
            {isSidebarOpen && <span className="ml-4">Logout</span>}
        </a>
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
        { id: 3, text: 'Methanol shipment from Beta-7 has been dispatched.', time: '3h ago', type: 'Info'},
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
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search across all pages..." 
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
                    {filteredNotifications.length > 0 ? (
                        <ul>
                            {filteredNotifications.map(notif => (
                                <li key={notif.id} className="p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                    <p className="text-sm text-[var(--text-primary)]">{notif.text}</p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">{notif.time}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-sm text-[var(--text-secondary)]">No new notifications.</p>
                    )}
                 </div>
              )}
            </div>

            <div className="relative">
              <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${user?.username.charAt(0).toUpperCase() || 'A'}`} alt="User Avatar" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => setProfileOpen(!profileOpen)} />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-lg z-20">
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <p className="font-semibold text-sm text-[var(--text-primary)]">{user?.username}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
                    </div>
                    <a href="#" onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]">
                        <LogOut className="mr-2" size={16}/> Logout
                    </a>
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

const Dashboard = () => (
    <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPI title="Total Production (YTD)" value={mockKPIData.totalProduction} unit="tons" color="text-teal-500" />
            <KPI title="Regulatory Compliance" value={mockKPIData.complianceRate} unit="%" color="text-green-500" />
            <KPI title="Active Alerts" value={mockKPIData.activeAlerts} unit="" color="text-red-500" />
            <KPI title="Energy Consumption" value={mockKPIData.energyConsumption} unit="MWh" color="text-blue-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md h-96"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Monthly Production Output</h3><Line options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'var(--chart-label-color)'}}}}} data={mockProductionData} /></div>
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md h-96"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">CO₂ Emissions by Plant</h3><Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'var(--chart-label-color)'}}}}} data={mockEmissionsData} /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md h-96"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Regional Compliance</h3><Doughnut data={mockRegionalCompliance} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'var(--chart-label-color)'}}}}}/></div>
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md lg:col-span-2 h-96"><h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Product Mix Distribution</h3><Pie data={mockProductMix} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'var(--chart-label-color)'}}}}} /></div>
        </div>
    </div>
);

const AddRecordModal = ({ isOpen, onClose, onRecordAdded }) => {
  const [newRecord, setNewRecord] = useState({ name: '', plant: '', region: '', volume: '', purity: '', status: 'Stable' });
  if (!isOpen) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prevState => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/records/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
    .then(response => response.json())
    .then(savedRecord => { onRecordAdded(savedRecord); onClose(); })
    .catch(error => console.error('Error adding record:', error));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Add New Chemical Record</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Chemical Name" value={newRecord.name} onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" required />
            <input type="text" name="plant" placeholder="Plant" value={newRecord.plant} onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" required />
            <input type="text" name="region" placeholder="Region" value={newRecord.region} onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" required />
            <input type="number" name="volume" placeholder="Volume (tons)" value={newRecord.volume} onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" required />
            <input type="number" step="0.01" name="purity" placeholder="Purity (%)" value={newRecord.purity} onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" required />
            <select name="status" value={newRecord.status} onChange={handleChange} className="p-2 border rounded bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]">
              <option>Stable</option><option>Warning</option><option>Alert</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="mr-4 px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded hover:opacity-90">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[var(--accent-color)] text-[var(--accent-text-color)] rounded hover:opacity-90">Add Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DataManagement = ({ searchTerm }) => {
    const [records, setRecords] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        fetch('http://localhost:5001/api/records').then(res => res.json()).then(data => setRecords(data)).catch(console.error);
    }, []);

    const handleRecordAdded = (newRecord) => setRecords(prevRecords => [...prevRecords, newRecord]);

    const sortedData = useMemo(() => {
        let sortableItems = [...records];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [records, sortConfig]);

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return sortedData;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return sortedData.filter(item => {
            return (
                item.name?.toLowerCase().includes(lowercasedFilter) ||
                item.plant?.toLowerCase().includes(lowercasedFilter) ||
                item.region?.toLowerCase().includes(lowercasedFilter) ||
                item.status?.toLowerCase().includes(lowercasedFilter)
            );
        });
    }, [sortedData, searchTerm]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const getStatusChip = (status) => {
        switch(status) {
            case 'Stable': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Alert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    }
    
    return (
        <>
            <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRecordAdded={handleRecordAdded} />
            <div className="p-6">
                <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Chemicals Data Records</h2>
                        <button onClick={() => setIsModalOpen(true)} className="bg-[var(--accent-color)] text-[var(--accent-text-color)] px-4 py-2 rounded-lg hover:opacity-90">Add New Record</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                            <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-secondary)]">
                                <tr>
                                    {['Name', 'Plant', 'Region', 'Volume (tons)', 'Purity (%)', 'Status'].map(header => {
                                        const key = header.split(' ')[0].toLowerCase();
                                        return <th key={header} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key)}>{header}{sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : ''}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row) => (
                                    <tr key={row._id} className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{row.name}</td>
                                        <td className="px-6 py-4">{row.plant}</td>
                                        <td className="px-6 py-4">{row.region}</td>
                                        <td className="px-6 py-4">{row.volume.toLocaleString()}</td>
                                        <td className="px-6 py-4">{row.purity.toFixed(2)}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChip(row.status)}`}>{row.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

const ComparativeAnalysis = ({ searchTerm }) => {
  const [comparisonData, setComparisonData] = useState([]);
  const [compareBy, setCompareBy] = useState('region');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5001/api/analysis?compareBy=${compareBy}&search=${searchTerm}`)
      .then(response => response.json())
      .then(data => { setComparisonData(data); setIsLoading(false); })
      .catch(error => { console.error('Error fetching analysis data:', error); setIsLoading(false); });
  }, [compareBy, searchTerm]);
  
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

const AuthForm = ({ isLogin, onSubmit, onSwitchMode }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded" required />
                    )}
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded" required />
                    <button type="submit" className="w-full p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-bold">
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={onSwitchMode} className="text-teal-500 hover:underline ml-1 font-semibold">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('idms_token'));
  const [authMode, setAuthMode] = useState('login');
  const [searchTerm, setSearchTerm] = useState('');

  // On initial load, check for a token
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('idms_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        handleLogout();
      }
    }
  }, [token]);
  
  // Fetch settings on initial load
  useEffect(() => {
    fetch('http://localhost:5001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to load settings:", err));
  }, []);
  
  // Apply theme to the root element whenever settings change
  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      root.classList.remove('theme-light', 'theme-dark', 'theme-oceanic', 'theme-sunset');
      root.classList.add(`theme-${settings.theme.toLowerCase()}`);
      
      const chartColor = getComputedStyle(root).getPropertyValue('--chart-label-color').trim();
      ChartJS.defaults.color = chartColor;
      ChartJS.defaults.borderColor = getComputedStyle(root).getPropertyValue('--border-color').trim();
    }
  }, [settings]);

  const handleAuthSubmit = (formData) => {
    const endpoint = authMode === 'login' ? 'login' : 'register';
    fetch(`http://localhost:5001/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('idms_token', data.token);
        localStorage.setItem('idms_user', JSON.stringify({_id: data._id, username: data.username, email: data.email }));
        setToken(data.token);
        setUser({_id: data._id, username: data.username, email: data.email });
      } else {
        alert(data.message || "An error occurred.");
      }
    })
    .catch(err => console.error('Auth error:', err));
  };
  
  const handleLogout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('idms_token');
      localStorage.removeItem('idms_user');
  };

  const handleUpdateSettings = (newSettings) => setSettings(newSettings);

  const handleSaveSettings = (newSettings) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings);
        resolve(data);
      })
      .catch(err => { console.error("Failed to save settings:", err); reject(err); });
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard': return <Dashboard />;
      case 'Data Management': return <DataManagement searchTerm={searchTerm} />;
      case 'Comparative Analysis': return <ComparativeAnalysis searchTerm={searchTerm} />;
      case 'Settings': return <Settings settings={settings} onUpdate={handleUpdateSettings} onSave={handleSaveSettings} />;
      default: return <Dashboard />;
    }
  };

  if (!user) {
      return (
          <>
            <ThemeStyles />
            <AuthForm 
                isLogin={authMode === 'login'} 
                onSubmit={handleAuthSubmit}
                onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            />
          </>
      )
  }

  return (
    <>
      <ThemeStyles />
      <div className="flex h-screen bg-[var(--bg-secondary)] font-sans">
        <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} handleLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={activeView} 
            toggleSidebar={toggleSidebar} 
            user={user} 
            handleLogout={handleLogout}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            settings={settings}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {renderView()}
          </main>
        </div>
      </div>
    </>
  );
}

