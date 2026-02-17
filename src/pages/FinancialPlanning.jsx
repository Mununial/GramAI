import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IndianRupee, TrendingUp, TrendingDown, PiggyBank,
    Calculator, Sprout, Tractor, Wallet, ArrowRight,
    CheckCircle2, AlertTriangle, Plus, X, BarChart3,
    Leaf, Coins, Milestone, Users, Calendar, Filter,
    ChevronDown, Trash2, PieChart, Download, CloudRain, Zap, FileText, Navigation, Settings, Wrench
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const FinancialPlanning = () => {
    const { lang } = useLanguage(); // en, hi, or
    const [activeTab, setActiveTab] = useState('overview'); // overview, ledger, analysis, advisory
    const [showAddModal, setShowAddModal] = useState(false);
    const [farmerType, setFarmerType] = useState('small');

    // 1. Translations
    const t_ui = {
        title: { en: 'My Wallet', hi: 'मेरा वॉलेट', or: 'ମୋ ୱାଲେଟ୍' },
        balance: { en: 'Available Balance', hi: 'उपलब्ध राशि', or: 'ଉପଲବ୍ଧ ରାଶି' },
        income: { en: 'Income', hi: 'आमदनी', or: 'ଆୟ' },
        expense: { en: 'Expense', hi: 'खर्च', or: 'ଖର୍ଚ୍ଚ' },
        overview: { en: 'Overview', hi: 'ओवरव्यू', or: 'ସାରାଂଶ' },
        ledger: { en: 'Ledger', hi: 'खाता बही', or: 'ହିସାବ ଖାତା' },
        analysis: { en: 'Analysis', hi: 'विश्लेषण', or: 'ବିଶ୍ଳେଷଣ' },
        advisory: { en: 'Smart Plan', hi: 'स्मार्ट योजना', or: 'ସ୍ମାର୍ଟ ଯୋଜନା' },
        recent: { en: 'Recent Transactions', hi: 'हाल के लेनदेन', or: 'ସାମ୍ପ୍ରତିକ କାରବାର' },
        addBtn: { en: 'Add Transaction', hi: 'लेनदेन जोड़ें', or: 'ନୂଆ କାରବାର ଯୋଡ଼ନ୍ତୁ' },
        save: { en: 'Save Record', hi: 'सेव करें', or: 'ସେଭ୍ କରନ୍ତୁ' },
        category: { en: 'Category', hi: 'श्रेणी', or: 'ବିଭାଗ' },
        date: { en: 'Date', hi: 'तारीख', or: 'ତାରିଖ' },
        amount: { en: 'Amount', hi: 'राशि', or: 'ରାଶି' },
        delete: { en: 'Delete', hi: 'हटाएं', or: 'ଡିଲିଟ୍' }
    };
    const getVal = (obj) => obj[lang] || obj['en'];

    // 2. Data State
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'income', category: 'sell', amount: 45000, date: '2025-06-15', note: 'Paddy Sale Mandi' },
        { id: 2, type: 'expense', category: 'fertilizer', amount: 12500, date: '2025-06-20', note: 'Urea for 5 acres' },
        { id: 3, type: 'expense', category: 'labor', amount: 8000, date: '2025-06-25', note: 'Transplanting Labor' },
        { id: 4, type: 'expense', category: 'machine', amount: 4500, date: '2025-06-28', note: 'Tractor Rent' },
        { id: 5, type: 'income', category: 'govt', amount: 2000, date: '2025-07-01', note: 'PM-KISAN Installment' },
    ]);

    const [newEntry, setNewEntry] = useState({ type: 'expense', amount: '', category: 'seeds', note: '' });

    // 3. Derived Calculations
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const deleteTransaction = (id) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const addTransaction = () => {
        if (!newEntry.amount) return;
        const newTrans = {
            id: Date.now(),
            ...newEntry,
            amount: parseFloat(newEntry.amount),
            date: new Date().toISOString().split('T')[0]
        };
        setTransactions([newTrans, ...transactions]);
        setShowAddModal(false);
        setNewEntry({ type: 'expense', amount: '', category: 'seeds', note: '' });
    };

    // 4. Chart Data
    const chartData = {
        labels: ['Income', 'Expense', 'Savings'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [totalIncome, totalExpense, balance],
                backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(59, 130, 246, 0.8)'],
                borderRadius: 10,
            }
        ]
    };

    const expenseCategories = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const pieData = {
        labels: Object.keys(expenseCategories).map(k => k.toUpperCase()),
        datasets: [
            {
                data: Object.values(expenseCategories),
                backgroundColor: [
                    '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'
                ],
                borderWidth: 0
            }
        ]
    };

    // 5. Categories Config
    const categories = {
        expense: [
            { id: 'seeds', label: 'Seeds', icon: Sprout, color: 'text-green-600 bg-green-100' },
            { id: 'fertilizer', label: 'Fertilizer', icon: Leaf, color: 'text-emerald-600 bg-emerald-100' },
            { id: 'labor', label: 'Labor', icon: Users, color: 'text-orange-600 bg-orange-100' },
            { id: 'machine', label: 'Machine', icon: Tractor, color: 'text-blue-600 bg-blue-100' },
            { id: 'other', label: 'Other', icon: AlertTriangle, color: 'text-slate-600 bg-slate-100' }
        ],
        income: [
            { id: 'sell', label: 'Crop Sale', icon: Coins, color: 'text-yellow-600 bg-yellow-100' },
            { id: 'govt', label: 'Govt Scheme', icon: IndianRupee, color: 'text-green-600 bg-green-100' },
            { id: 'loan', label: 'Loan', icon: Wallet, color: 'text-purple-600 bg-purple-100' }
        ]
    };

    const downloadLedger = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text("GramAI - Financial Ledger", 20, 20);

            doc.setFontSize(14);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
            doc.text(`Balance: Rs. ${balance}`, 20, 40);

            doc.line(20, 50, 190, 50);

            let y = 60;
            doc.setFontSize(12);
            doc.text("Date | Type | Category | Amount", 20, y);
            y += 10;

            transactions.forEach(t => {
                const line = `${t.date} | ${t.type.toUpperCase()} | ${t.category} | Rs. ${t.amount}`;
                doc.text(line, 20, y);
                y += 10;
                if (y > 280) { // New page if full
                    doc.addPage();
                    y = 20;
                }
            });

            doc.save("ledger.pdf");
            toast.success("Ledger Downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Download Failed");
        }
    };

    return (
        <div className="pb-24 space-y-6">
            {/* 1. Wallet Card (App-like Header) */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start mb-8">
                    <div>
                        <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-1">{getVal(t_ui.balance)}</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">₹{balance.toLocaleString()}</h2>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Wallet className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="relative z-10 flex gap-4">
                    <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-xl">
                            <ArrowRight className="w-5 h-5 text-green-400 -rotate-45" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/60 font-bold uppercase">{getVal(t_ui.income)}</p>
                            <p className="text-lg font-bold text-green-400">₹{totalIncome.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <ArrowRight className="w-5 h-5 text-red-400 rotate-45" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/60 font-bold uppercase">{getVal(t_ui.expense)}</p>
                            <p className="text-lg font-bold text-red-400">₹{totalExpense.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Tabs Navigation */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl flex gap-2 shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto">
                {['overview', 'ledger', 'analysis', 'advisory'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        {getVal(t_ui[tab])}
                    </button>
                ))}
            </div>

            {/* 3. Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Quick Stats Chart */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <div className="h-64">
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { grid: { display: false } }, x: { grid: { display: false } } }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h3 className="font-black text-lg text-slate-700 dark:text-slate-300">{getVal(t_ui.recent)}</h3>
                                <button onClick={() => setActiveTab('ledger')} className="text-primary-600 font-bold text-sm">View All</button>
                            </div>
                            <div className="space-y-3">
                                {transactions.slice(0, 3).map(t => (
                                    <TransactionItem key={t.id} t={t} categories={categories} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'ledger' && (
                    <motion.div
                        key="ledger"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {/* Filters mock */}
                            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold whitespace-nowrap">This Month</button>
                            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold whitespace-nowrap">Last Month</button>
                            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold whitespace-nowrap">Income Only</button>
                            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold whitespace-nowrap">Expense Only</button>
                            <button
                                onClick={downloadLedger}
                                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 ml-auto"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                        </div>

                        {transactions.map(t => (
                            <TransactionItem
                                key={t.id}
                                t={t}
                                categories={categories}
                                onDelete={() => deleteTransaction(t.id)}
                            />
                        ))}

                        {transactions.length === 0 && (
                            <div className="text-center py-10 text-slate-400">
                                <p>No transactions found</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'analysis' && (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-black text-lg mb-6">Expense Breakdown</h3>
                            <div className="h-64 flex items-center justify-center">
                                <Doughnut
                                    data={pieData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'bottom' } }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                            <h3 className="font-black text-lg text-blue-800 dark:text-blue-300 mb-4">Smart Insights</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <div className="p-2 bg-white/50 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5" /></div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Your fertilizer spending is <span className="text-red-500 font-bold">15% higher</span> than last month.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="p-2 bg-white/50 rounded-lg text-green-600"><PiggyBank className="w-5 h-5" /></div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">You saved <span className="text-green-600 font-bold">₹12,000</span> this season! Good job.</p>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'advisory' && (
                    <motion.div
                        key="advisory"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Profile Selector */}
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl flex gap-2 overflow-x-auto border border-slate-100 dark:border-slate-800">
                            {[
                                { id: 'small', label: 'Small Farmer (<2 Acre)' },
                                { id: 'medium', label: 'Medium (2-10 Acre)' },
                                { id: 'commercial', label: 'Commercial (>10 Acre)' },
                                { id: 'provider', label: 'Service Provider' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setFarmerType(type.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${farmerType === type.id
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Content based on Farmer Type */}
                        <FarmerAdvisoryContent type={farmerType} />

                    </motion.div>
                )}
            </AnimatePresence>

            {/* floating Add Button (Mobile feel) */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Add Record Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-6 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black">{getVal(t_ui.addBtn)}</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Type Selector */}
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                                    <button
                                        onClick={() => setNewEntry({ ...newEntry, type: 'expense' })}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${newEntry.type === 'expense' ? 'bg-white dark:bg-slate-700 shadow-md text-red-600' : 'text-slate-500'}`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        onClick={() => setNewEntry({ ...newEntry, type: 'income' })}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${newEntry.type === 'income' ? 'bg-white dark:bg-slate-700 shadow-md text-green-600' : 'text-slate-500'}`}
                                    >
                                        Income
                                    </button>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2 block">{getVal(t_ui.amount)}</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-400">₹</span>
                                        <input
                                            type="number"
                                            value={newEntry.amount}
                                            onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                                            className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl font-black text-3xl outline-none focus:ring-4 focus:ring-primary-500/20 transition-all text-slate-800 dark:text-white"
                                            placeholder="0"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Category Grid */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2 block">{getVal(t_ui.category)}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {categories[newEntry.type].map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setNewEntry({ ...newEntry, category: cat.id })}
                                                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${newEntry.category === cat.id
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                    : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <cat.icon className={`w-6 h-6 ${newEntry.category === cat.id ? 'text-primary-600' : 'text-slate-400'
                                                    }`} />
                                                <span className={`text-[10px] font-bold text-center leading-tight ${newEntry.category === cat.id ? 'text-primary-700' : 'text-slate-500'
                                                    }`}>{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2 block">Note (Optional)</label>
                                    <input
                                        type="text"
                                        value={newEntry.note}
                                        onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. Sold to Raju"
                                    />
                                </div>

                                <button
                                    onClick={addTransaction}
                                    className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    {getVal(t_ui.save)}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-component for dynamic content
const FarmerAdvisoryContent = ({ type }) => {
    const profiles = {
        small: {
            hero: {
                title: 'Received ₹2,000 Installment?',
                subtitle: "Don't just spend it! Invest strategically to double your returns this season.",
                badge: 'PM-KISAN Special',
                color: 'from-green-600 to-emerald-800'
            },
            options: [
                { title: 'High Yield Seeds', cost: 1200, return: 4500, risk: 'Low', icon: Sprout, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', note: 'Best for Paddy/Wheat' },
                { title: 'Micronutrients', cost: 800, return: 2500, risk: 'Medium', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', note: 'Zinc + Boron Mix' },
                { title: 'Bank Savings', cost: 2000, return: 2060, risk: 'Zero', icon: PiggyBank, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', note: '3% Interest p.a.' },
            ],
            chart: {
                labels: ['Bank', 'Bio-Fertilizer', 'Hybrid Seeds', 'Mixed Crop'],
                data: [2060, 3200, 4800, 5500]
            }
        },
        medium: {
            hero: {
                title: 'Upgrade to Harvesting?',
                subtitle: 'Reduce dependency on manual labor. Buy or rent harvesters early to save costs.',
                badge: 'Labor Saving',
                color: 'from-blue-600 to-indigo-800'
            },
            options: [
                { title: 'Mini Harvester', cost: 200000, return: 500000, risk: 'Medium', icon: Tractor, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', note: 'Cut & Bundle paddy' },
                { title: 'Reaper Binder', cost: 80000, return: 250000, risk: 'Low', icon: Settings, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', note: 'Efficient for Wheat' },
                { title: 'Multi-Crop Thresher', cost: 60000, return: 150000, risk: 'Low', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30', note: 'Post-harvest essential' },
            ],
            chart: {
                labels: ['Manual Labor', 'Semi-Auto', 'Fully Mechanized'],
                data: [60000, 120000, 250000]
            }
        },
        commercial: {
            hero: {
                title: 'Export Quality Plan',
                subtitle: 'Focus on grading and packaging to sell at premium rates in city marts.',
                badge: 'High Value',
                color: 'from-purple-600 to-violet-800'
            },
            options: [
                { title: 'Cold Storage', cost: 50000, return: 120000, risk: 'Medium', icon: Warehouse, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', note: 'Hold for better price' },
                { title: 'Solar Pump', cost: 100000, return: 250000, risk: 'Low', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', note: 'One time investment' },
                { title: 'Contract Farming', cost: 20000, return: 60000, risk: 'High', icon: FileText, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', note: 'Fixed Price' },
            ],
            chart: {
                labels: ['Local Mandi', 'City Mart', 'Export'],
                data: [200000, 350000, 600000]
            }
        },
        provider: {
            hero: {
                title: 'Expand Your Fleet?',
                subtitle: 'High demand for specialized machinery. Invest in Harvesters and Drones.',
                badge: 'Business Growth',
                color: 'from-orange-600 to-red-800'
            },
            options: [
                { title: 'Combine Harvester', cost: 1500000, return: 4000000, risk: 'High', icon: Tractor, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', note: 'Huge seasonal demand' },
                { title: 'Laser Land Leveler', cost: 350000, return: 800000, risk: 'Medium', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-950/30', note: 'Precision Farming' },
                { title: 'Agri-Drone', cost: 600000, return: 1800000, risk: 'Medium', icon: Navigation, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30', note: 'Spraying Service' },
            ],
            chart: {
                labels: ['Tractor Only', 'Multi-Machine', 'Tech-Integrated'],
                data: [500000, 1500000, 4000000]
            }
        }
    };

    const data = profiles[type] || profiles['small'];

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className={`bg-gradient-to-br ${data.hero.color} rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl`}>
                <div className="relative z-10">
                    <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10 flex w-fit items-center gap-2 mb-4">
                        <IndianRupee className="w-3 h-3" /> {data.hero.badge}
                    </span>
                    <h3 className="text-3xl font-black mb-2">{data.hero.title}</h3>
                    <p className="text-white/80 font-medium max-w-md mb-6 leading-relaxed">{data.hero.subtitle}</p>
                    <button onClick={() => toast.success("Plan Activated!")} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                        Start Growth Plan <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
            </div>

            {/* Investment Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.options.map((opt, i) => (
                    <div key={i} className={`p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 ${opt.bg} hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 ${opt.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <opt.icon className="w-8 h-8" />
                            </div>
                            <span className={`text-[10px] uppercase font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 ${opt.risk === 'Low' ? 'text-green-500' : opt.risk === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`}>{opt.risk} Risk</span>
                        </div>
                        <h4 className="font-black text-xl text-slate-800 dark:text-white mb-1">{opt.title}</h4>
                        <p className="text-xs font-bold text-slate-400 mb-6">{opt.note}</p>

                        <div className="flex items-center justify-between text-sm bg-white/60 dark:bg-black/20 p-4 rounded-2xl mb-6 backdrop-blur-sm">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invest</span>
                                <span className="font-black text-lg text-slate-700 dark:text-slate-200">₹{opt.cost}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Return</span>
                                <span className="font-black text-lg text-green-600">₹{opt.return}</span>
                            </div>
                        </div>
                        <p className="text-right text-[10px] font-black text-green-600 uppercase tracking-widest">ROI: {Math.round(((opt.return - opt.cost) / opt.cost) * 100)}% Growth</p>
                    </div>
                ))}
            </div>

            {/* Projection Chart */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-black text-2xl text-slate-800 dark:text-white">Profit Projection</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1">Estimated Returns for {data.hero.badge}</p>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <Bar
                        data={{
                            labels: data.chart.labels,
                            datasets: [{
                                label: 'Potential Return (₹)',
                                data: data.chart.data,
                                backgroundColor: ['rgba(34, 197, 94, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(168, 85, 247, 0.5)', 'rgba(249, 115, 22, 0.5)'],
                                borderRadius: 12,
                                barThickness: 40,
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, grid: { borderDash: [5, 5], color: 'rgba(0,0,0,0.05)' }, ticks: { font: { weight: 'bold' } } },
                                x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const TransactionItem = ({ t, categories, onDelete }) => {
    const cat = categories[t.type].find(c => c.id === t.category) || {};
    const Icon = cat.icon || AlertTriangle;

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{t.note || cat.label}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.date}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-lg font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </span>
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default FinancialPlanning;
