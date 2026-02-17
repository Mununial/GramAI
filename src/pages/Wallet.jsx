import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet as WalletIcon,
    CreditCard,
    Smartphone,
    Download,
    CheckCircle2,
    X,
    Search,
    Filter,
    FileText
} from 'lucide-react';
import { transactions } from '../data/mockDB';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';

const Wallet = () => {
    const [balance, setBalance] = useState(12450);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1); // 1: Amount, 2: Razorpay Fake, 3: Success

    const handleAddMoney = () => {
        if (!amount || isNaN(Number(amount))) return toast.error('Enter valid amount');
        setPaymentStep(2);
        setTimeout(() => {
            setIsProcessing(true);
            setTimeout(() => {
                setBalance(prev => prev + Number(amount));
                setPaymentStep(3);
                setIsProcessing(false);
                toast.success('Funds added successfully!');
            }, 3000);
        }, 1000);
    };

    const downloadReceipt = (tx) => {
        const doc = new jsPDF();
        doc.text('GramAI Transaction Receipt', 20, 20);
        doc.text(`ID: ${tx.id}`, 20, 40);
        doc.text(`Date: ${tx.date}`, 20, 50);
        doc.text(`Amount: ₹${Math.abs(tx.amount)}`, 20, 60);
        doc.text(`Type: ${tx.type}`, 20, 70);
        doc.text(`Description: ${tx.description}`, 20, 80);
        doc.save(`receipt_${tx.id}.pdf`);
    };

    const handleExportCSV = () => {
        const headers = "Date,Description,Amount,Type,Status\n";
        const rows = transactions.slice(0, 20).map(tx => `${tx.date},${tx.description},${tx.amount},${tx.type},${tx.status}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
        toast.success('CSV Export Started');
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-primary-600 to-green-700 p-8 rounded-[40px] text-white shadow-2xl shadow-primary-600/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <WalletIcon className="w-32 h-32" />
                        </div>
                        <div className="relative">
                            <p className="text-white/70 font-medium mb-1">Available Balance</p>
                            <h2 className="text-5xl font-black mb-8">₹{balance.toLocaleString()}</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowAddMoney(true)}
                                    className="bg-white text-primary-700 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary-50 transition-all active:scale-95"
                                >
                                    <Plus className="w-5 h-5" /> Add Money
                                </button>
                                <button onClick={handleExportCSV} className="bg-white/20 backdrop-blur-md text-white font-bold p-3 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all">
                                    <Download className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass-card p-8 rounded-3xl space-y-6">
                        <h4 className="text-xl font-bold">Quick Stats</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 text-green-600 rounded-lg">
                                        <ArrowDownLeft className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold">Total In</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">+₹24,000</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900 text-red-600 rounded-lg">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold">Total Out</span>
                                </div>
                                <span className="text-lg font-bold text-red-600">-₹11,550</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 glass-card p-8 rounded-[40px] flex flex-col">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <h4 className="text-2xl font-black">Transaction History</h4>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm outline-none w-full" />
                            </div>
                            <button onClick={() => toast.info('Filtering by March 2025...')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${tx.type === 'Credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {tx.type === 'Credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h5 className="font-bold">{tx.description}</h5>
                                        <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()} • {tx.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`text-lg font-black ${tx.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'Credit' ? '+' : '-'}₹{Math.abs(tx.amount)}
                                        </p>
                                        <p className="text-[10px] font-bold uppercase text-slate-400">{tx.status}</p>
                                    </div>
                                    <button
                                        onClick={() => downloadReceipt(tx)}
                                        className="p-2 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FileText className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAddMoney && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isProcessing && setShowAddMoney(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="bg-primary-600 p-8 text-white relative">
                                {!isProcessing && (
                                    <button onClick={() => setShowAddMoney(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                                <h3 className="text-2xl font-bold mb-2">Refill Wallet</h3>
                                <p className="text-white/70">Enter amount to add securely via Razorpay</p>
                            </div>

                            <div className="p-8">
                                {paymentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-bold text-slate-500 mb-2 block">Amount (₹)</label>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="e.g. 5000"
                                                className="w-full text-4xl font-black bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-6 outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[500, 1000, 5000].map(val => (
                                                <button key={val} onClick={() => setAmount(val.toString())} className="py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all border border-transparent hover:border-primary-500/30">
                                                    +₹{val}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={handleAddMoney} className="btn-primary w-full py-4 text-lg">
                                            Proceed to Pay
                                        </button>
                                    </div>
                                )}

                                {paymentStep === 2 && (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
                                        <div className="w-20 h-20 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-1">Processing Payment</h4>
                                            <p className="text-slate-500">Do not close this window or press back.</p>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full">
                                            <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                                <Smartphone className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-slate-400 uppercase">Redirecting to</p>
                                                <p className="font-black text-blue-600">RAZORPAY</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentStep === 3 && (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
                                        <div className="w-24 h-24 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black mb-1">Success!</h4>
                                            <p className="text-slate-500">₹{amount} has been added to your wallet.</p>
                                            <p className="text-xs text-primary-600 font-bold mt-2">TX ID: #GRAM-{Math.floor(Math.random() * 90000)}</p>
                                        </div>
                                        <button onClick={() => { setShowAddMoney(false); setPaymentStep(1); setAmount(''); }} className="btn-primary w-full py-4">
                                            Back to Wallet
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Wallet;
