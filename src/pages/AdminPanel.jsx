import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Users,
    ShoppingBag,
    BarChart3,
    ShieldCheck,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowUpRight,
    TrendingUp,
    Landmark,
    Ban,
    FileText,
    Settings,
    Download,
    Save
} from 'lucide-react';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { farmers, providers, bookings } from '../data/mockDB';
import { toast } from 'react-toastify';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const mockComplaints = [
    { id: 101, reportedBy: 'Raju Farmer', reportedUser: 'Mahesh Tractor', role: 'Provider', issue: 'Asked Extra Money', status: 'Pending', date: '2025-06-25' },
    { id: 102, reportedBy: 'Suresh Kumar', reportedUser: 'Ramesh Seeds', role: 'Provider', issue: 'Rude Behavior', status: 'Pending', date: '2025-06-24' },
    { id: 103, reportedBy: 'Anil Singh', reportedUser: 'Deepak Electric', role: 'Provider', issue: 'Did not arrive', status: 'Resolved', date: '2025-06-20' },
];

const AdminPanel = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tab || 'users');
    const [filterStatus, setFilterStatus] = useState('All');

    // Sync state if URL changes
    React.useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        navigate(`/admin/${newTab}`);
    };

    const handleBlock = (name) => {
        toast.error(`Blocked user: ${name}`, { icon: <Ban /> });
    };

    const handleAction = (name, action) => {
        toast.success(`${name} has been ${action}ed successfully.`);
    };

    const stats = [
        { title: 'Total Revenue', value: '₹12.4L', trend: '+15%', icon: Landmark, color: 'text-green-600 bg-green-100' },
        { title: 'Active Farmers', value: '1,280', trend: '+8.2%', icon: Users, color: 'text-blue-600 bg-blue-100' },
        { title: 'Providers', value: '456', trend: '+12.4%', icon: ShieldCheck, color: 'text-purple-600 bg-purple-100' },
        { title: 'Total Bookings', value: '8,902', trend: '+4.5%', icon: ShoppingBag, color: 'text-amber-600 bg-amber-100' },
    ];

    const revenueData = {
        labels: ['Tractors', 'Electricians', 'Plumbers', 'Seeds', 'Others'],
        datasets: [{
            label: 'Revenue by Category',
            data: [450000, 220000, 180000, 150000, 240000],
            backgroundColor: '#16a34a',
            borderRadius: 8,
        }]
    };

    const distData = {
        labels: ['Puri', 'Khurda', 'Cuttack', 'Ganjam'],
        datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
            borderWidth: 0,
        }]
    };

    const renderReports = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold">System Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Financial Audit', type: 'CSV', date: '21 Jun 2025' },
                    { title: 'User Activity Log', type: 'PDF', date: '22 Jun 2025' },
                    { title: 'Dispute Resolution', type: 'PDF', date: '20 Jun 2025' }
                ].map((report, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{report.title}</h4>
                                <p className="text-sm text-slate-500">Generated: {report.date}</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                            <Download className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[40px]">
                <h4 className="font-bold text-xl mb-6">Generate Custom Report</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Report Type</label>
                        <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none">
                            <option>Revenue Summary</option>
                            <option>User Growth</option>
                            <option>Provider Performance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date Range</label>
                        <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => toast.success("Report Generated Successfully!")} className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Generate Report
                </button>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="glass-card p-8 rounded-[40px]">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings className="w-6 h-6" /> System Configuration</h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                        <div>
                            <h4 className="font-bold">Maintenance Mode</h4>
                            <p className="text-sm text-slate-500">Suspend all non-admin access</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                        <div>
                            <h4 className="font-bold">Auto-Approve Providers</h4>
                            <p className="text-sm text-slate-500">Skip manual verification step</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold mb-4">Platform Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Max Booking Radius (km)</label>
                            <input type="number" defaultValue={50} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Commission Rate (%)</label>
                            <input type="number" defaultValue={10} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none" />
                        </div>
                    </div>
                    <button onClick={() => toast.success("Settings Saved!")} className="mt-6 btn-primary px-8 py-3 flex items-center gap-2">
                        <Save className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black">Admin Command Center</h2>
                    <p className="text-slate-500 font-medium">Monitoring Smart Village Ecosystem Performance</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => toast.info("Exporting data implementation pending")} className="btn-secondary">Export Audit Log</button>
                    <button onClick={() => toast.info("Global map view implementation pending")} className="btn-primary">View Global Map</button>
                </div>
            </div>

            {/* Stats Cards - Only show on Dashboard (no tab) or Main Tabs */}
            {(!tab || ['users', 'providers', 'bookings'].includes(activeTab)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="glass-card p-6 rounded-3xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${s.color}`}>
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-green-500 font-bold text-sm">
                                    <TrendingUp className="w-4 h-4" /> {s.trend}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-500">{s.title}</p>
                            <h3 className="text-2xl font-black mt-1">{s.value}</h3>
                        </div>
                    ))}
                </div>
            )}

            {(activeTab === 'reports') ? renderReports() :
                (activeTab === 'settings') ? renderSettings() : (
                    <>
                        {/* Charts Section */}
                        {activeTab === 'users' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass-card p-8 rounded-3xl">
                                    <h4 className="text-xl font-bold mb-8 italic">Revenue Analysis by Category</h4>
                                    <div className="h-[300px]">
                                        <Bar data={revenueData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </div>
                                <div className="glass-card p-8 rounded-3xl">
                                    <h4 className="text-xl font-bold mb-8 italic">Service Distribution (District Wise)</h4>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Doughnut data={distData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Navigation */}
                        <div className="glass-card rounded-[40px] overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto">
                                    {['users', 'providers', 'bookings', 'complaints'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => handleTabChange(t)}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === t ? 'bg-white dark:bg-slate-700 shadow-lg text-primary-600' : 'text-slate-500'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input type="text" placeholder={`Search ${activeTab}...`} className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                                    </div>
                                    <button className="btn-secondary flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</button>
                                </div>
                            </div>

                            {/* Table Content */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    {/* ... existing table code ... */}
                                    <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">{activeTab === 'complaints' ? 'Reporter' : 'Entity'}</th>
                                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">{activeTab === 'complaints' ? 'Accused User' : 'Status'}</th>
                                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">{activeTab === 'complaints' ? 'Issue / Reason' : 'Contact'}</th>
                                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">{activeTab === 'complaints' ? 'Status' : 'Total'}</th>
                                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {activeTab === 'complaints' ? (
                                            mockComplaints.map((complaint) => (
                                                <tr key={complaint.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-8 py-6 font-bold text-slate-800 dark:text-white">
                                                        {complaint.reportedBy}
                                                    </td>
                                                    <td className="px-8 py-6 text-slate-600 dark:text-slate-300 font-medium">
                                                        {complaint.reportedUser} <span className="text-xs text-slate-400">({complaint.role})</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
                                                            {complaint.issue}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                                        {complaint.date}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                            {complaint.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {complaint.status !== 'Resolved' && (
                                                                <button
                                                                    onClick={() => {
                                                                        toast.success("Complaint Resolved & Closed");
                                                                    }}
                                                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                                    title="Mark Resolved"
                                                                >
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleBlock(complaint.reportedUser)}
                                                                className="p-2 bg-slate-50 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                                                title="Block User"
                                                            >
                                                                <Ban className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            (activeTab === 'users' ? farmers : activeTab === 'providers' ? providers : bookings).slice(0, 10).map((item, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                                {item.name ? item.name[0] : item.farmerName ? item.farmerName[0] : '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 dark:text-white capitalize">{item.name || item.farmerName}</p>
                                                                <p className="text-xs text-slate-400 capitalize">{item.village || item.district || 'Village Area'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${(item.status === 'Active' || item.status === 'Completed' || item.availability)
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {(item.status === 'Active' || item.status === 'Completed') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                            {item.status || (item.availability ? 'Available' : 'Busy')}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {item.phone || '+91 98XXX XXXXX'}
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {item.joinedAt ? new Date(item.joinedAt).toLocaleDateString() : item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-black text-slate-800 dark:text-white">
                                                        ₹{item.walletBalance || item.amount || '0'}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleBlock(item.name || item.farmerName)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Block User"
                                                            >
                                                                <Ban className="w-5 h-5" />
                                                            </button>
                                                            {activeTab === 'providers' && (
                                                                <button onClick={() => handleAction(item.name, 'approve')} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle2 className="w-5 h-5" /></button>
                                                            )}
                                                            <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default AdminPanel;
