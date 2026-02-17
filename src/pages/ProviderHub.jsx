import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tractor,
    Clock,
    CheckCircle2,
    Plus,
    Settings,
    TrendingUp,
    Users,
    MapPin,
    Smartphone
} from 'lucide-react';
import { bookings } from '../data/mockDB';
import { toast } from 'react-toastify';

const ProviderHub = () => {
    const [showAddVehicle, setShowAddVehicle] = useState(false);

    const myBookings = bookings.slice(0, 15);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black">Provider Hub</h2>
                    <p className="text-slate-500">Manage your fleet and track incoming service requests.</p>
                </div>
                <button onClick={() => setShowAddVehicle(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Register New Vehicle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl">
                    <p className="text-sm font-bold text-slate-500 uppercase">Monthly Earnings</p>
                    <h3 className="text-3xl font-black mt-2">₹42,850</h3>
                    <div className="mt-4 flex items-center gap-1 text-green-500 text-sm font-bold">
                        <TrendingUp className="w-4 h-4" /> +12.5% from last month
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl">
                    <p className="text-sm font-bold text-slate-500 uppercase">Active Fleets</p>
                    <h3 className="text-3xl font-black mt-2">08</h3>
                    <div className="mt-4 text-slate-400 text-sm font-medium">
                        5 Tractors • 3 Harvesters
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl">
                    <p className="text-sm font-bold text-slate-500 uppercase">Service Rating</p>
                    <h3 className="text-3xl font-black mt-2">4.9/5.0</h3>
                    <div className="mt-4 text-slate-400 text-sm font-medium">
                        Based on 124 completed jobs
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="text-xl font-bold">Recent Service Requests</h4>
                    <button className="text-primary-600 font-bold text-sm">View All</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {myBookings.map((b, i) => (
                        <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-950/30 rounded-2xl">
                                    <Tractor className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg">{b.farmerName}</h5>
                                    <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.date.split('T')[0]} • 5.2km</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-black text-lg">₹{b.amount}</p>
                                    <p className="text-xs font-bold text-amber-500 uppercase">{b.status}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toast.success('Booking accepted!')} className="p-2 bg-green-100 text-green-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></button>
                                    <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><Settings className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showAddVehicle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddVehicle(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[40px] p-8 w-full max-w-lg shadow-2xl">
                            <h3 className="text-2xl font-black mb-6">Register New Vehicle</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="Vehicle Model (e.g. Mahindra 575)" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-600" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Horse Power" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-600" />
                                    <input type="text" placeholder="Rate / Hour" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-600" />
                                </div>
                                <button
                                    onClick={() => {
                                        toast.success('Vehicle registered and sent for admin approval!');
                                        setShowAddVehicle(false);
                                    }}
                                    className="btn-primary w-full py-4 text-lg mt-4"
                                >
                                    Submit for Approval
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProviderHub;
