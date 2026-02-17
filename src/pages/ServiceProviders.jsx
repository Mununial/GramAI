import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wrench,
    MapPin,
    Star,
    ShieldCheck,
    Search,
    Phone,
    MessageCircle,
    Calendar,
    Layers,
    Award
} from 'lucide-react';
import { providers } from '../data/mockDB';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';

const ServiceProviders = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? providers : providers.filter(p => p.serviceType === filter);

    const categories = ['All', 'Electrician', 'Plumber', 'Technician'];

    const handleBook = (name) => {
        toast.success(`Booking request sent to ${name}. They will call you shortly.`);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black">{t('services')}</h2>
                    <p className="text-slate-500">Professional electricians and plumbers for your village home & farm.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === cat ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((provider) => (
                    <motion.div
                        key={provider.id}
                        whileHover={{ y: -5 }}
                        className="glass-card p-6 rounded-[32px] flex flex-col group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150"></div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-green-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary-500/20">
                                {provider.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-lg line-clamp-1">{provider.name}</h4>
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Wrench className="w-3 h-3" /> {provider.serviceType}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-bold">{provider.rating}</span>
                                    <span className="text-xs text-slate-400">(40+ reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md uppercase">
                                    <Award className="w-3 h-3" /> Expert
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    <MapPin className="w-4 h-4 text-primary-500" /> {provider.village}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    <Calendar className="w-4 h-4 text-primary-500" /> {provider.experience} Years Experience
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">Reliable</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">24/7 Service</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBook(provider.name)}
                                    className="flex-1 btn-primary py-3 rounded-2xl text-sm font-bold shadow-none"
                                >
                                    {t('hireNow')}
                                </button>
                                <button onClick={() => toast.warning('Emergency request sent! 15% extra charges apply.')} className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-xs font-black uppercase">
                                    SOS
                                </button>
                            </div>
                            <button onClick={() => toast.info('Availability: Mon-Sat, 9AM-6PM')} className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all">
                                <Calendar className="w-3 h-3" /> View Availability
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ServiceProviders;
