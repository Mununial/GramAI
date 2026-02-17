import React from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
    Clock,
    Trash2
} from 'lucide-react';
import { notifications } from '../data/mockDB';

const Notifications = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black">Notifications</h2>
                    <p className="text-slate-500 font-medium">Stay updated with your activities.</p>
                </div>
                <button className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Clear All
                </button>
            </div>

            <div className="space-y-4">
                {notifications.slice(0, 50).map((notif, i) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`glass-card p-6 rounded-[32px] flex items-start gap-4 border-l-[8px] ${notif.type === 'success' ? 'border-primary-500' :
                                notif.type === 'info' ? 'border-blue-500' :
                                    notif.type === 'warning' ? 'border-amber-500' : 'border-red-500'
                            }`}
                    >
                        <div className={`p-3 rounded-2xl ${notif.type === 'success' ? 'bg-primary-100 text-primary-600' :
                                notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                    notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {notif.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                            {notif.type === 'info' && <Info className="w-6 h-6" />}
                            {notif.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                            {notif.type === 'error' && <XCircle className="w-6 h-6" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h4 className="font-bold text-lg">{notif.title}</h4>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md flex items-center gap-1 shrink-0">
                                    <Clock className="w-3 h-3" /> {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {notif.message}
                            </p>
                            {!notif.read && (
                                <div className="mt-3">
                                    <span className="w-2.5 h-2.5 bg-primary-600 rounded-full inline-block animate-pulse mr-2"></span>
                                    <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">New</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
