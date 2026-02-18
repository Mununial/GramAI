import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Tractor,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Star,
    ShieldCheck
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { bookings, farmers, tractors, transactions } from '../data/mockDB';
import Skeleton from '../components/common/Skeleton';
import GpsMap from '../components/common/GpsMap';

import { useLanguage } from '../context/LanguageContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const CountUp = ({ value }) => {
    const [count, setCount] = useState(0);
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
    const prefix = typeof value === 'string' ? (value.match(/^[^0-9]*/) ? value.match(/^[^0-9]*/)[0] : '') : '';
    const suffix = typeof value === 'string' ? (value.match(/[a-zA-Z%]*$/) ? value.match(/[a-zA-Z%]*$/)[0] : '') : '';

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = numericValue / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [numericValue]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Real Weather API Hook (Open-Meteo)
const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Default to Odisha (Bhubaneswar) coordinates if no GPS
                let lat = 20.296;
                let long = 85.824;

                // Try to get real location
                if ('geolocation' in navigator) {
                    await new Promise(resolve => {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                lat = pos.coords.latitude;
                                long = pos.coords.longitude;
                                resolve();
                            },
                            () => resolve(), // Fallback on error
                            { timeout: 5000 }
                        );
                    });
                }

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`
                );
                const data = await response.json();

                setWeather({
                    temp: Math.round(data.current_weather.temperature),
                    condition: getWeatherCondition(data.current_weather.weathercode),
                    humidity: 75, // API doesn't give humidity in free tier easily, keeping static or estimating
                    wind: Math.round(data.current_weather.windspeed),
                    location: 'Live Loc' // We could use reverse geocoding here too if needed
                });
            } catch (err) {
                console.error("Weather Fetch Error", err);
                // Fallback mock
                setWeather({ temp: 30, condition: 'Sunny', humidity: 70, wind: 10, location: 'Odisha' });
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    return { weather, loading };
};

const getWeatherCondition = (code) => {
    if (code <= 3) return 'Clear';
    if (code <= 48) return 'Cloudy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snow';
    return 'Stormy';
};

const StatCard = ({ title, value, icon: Icon, trend, color, loading }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card p-6 rounded-3xl"
    >
        {loading ? (
            <div className="space-y-4">
                <Skeleton className="w-12 h-12" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-32 h-8" />
            </div>
        ) : (
            <>
                <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-2xl ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <span className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <div className="mt-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">
                        <CountUp value={value} />
                    </h3>
                </div>
            </>
        )}
    </motion.div>
);

const FarmerDash = ({ user, loading, t, weather, weatherLoading, navigate }) => {
    const stats = [
        { title: 'Total Savings', value: '₹42,500', icon: CreditCard, trend: 12.5, color: 'bg-primary-600' },
        { title: 'Active Requests', value: '12', icon: Clock, trend: -5.2, color: 'bg-amber-600' },
        { title: 'AI Yield Report', value: '88%', icon: TrendingUp, trend: 8.4, color: 'bg-blue-600' },
        { title: 'Bookings Today', value: '156', icon: Tractor, trend: 22.1, color: 'bg-green-600' },
    ];

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Yield Prediction %',
            data: [65, 59, 80, 81, 56, 95],
            fill: true,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
        }]
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black">{t('welcome')}, {user?.name || 'Farmer'}!</h2>
                    <p className="text-slate-500 font-medium">{t('odisha')}</p>
                </div>
                <div className="flex items-center gap-3">
                    {weatherLoading ? (
                        <Skeleton className="w-32 h-10 rounded-xl" />
                    ) : (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">☀️</span>
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400">{weather.location}</p>
                                <p className="font-black text-slate-800 dark:text-white leading-none">{weather.temp}°C</p>
                            </div>
                        </div>
                    )}
                    <button onClick={() => navigate('/tractors')} className="btn-primary">+ {t('bookNow')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => <StatCard key={i} {...s} loading={loading} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-[40px]">
                    <h4 className="text-xl font-bold mb-8">Yield Analysis (AI Sentinel)</h4>
                    <div className="h-[300px]">
                        <Line data={lineData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[40px] border-l-8 border-red-500">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /> Critical Alerts</h4>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl">
                            <p className="text-xs font-bold text-red-600 uppercase mb-1">Pest Alert</p>
                            <p className="text-sm font-medium">Blight detected in nearby farms of Nimapara. Spray fungicide immediately.</p>
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
                            <p className="text-xs font-bold text-amber-600 uppercase mb-1">Weather Alert</p>
                            <p className="text-sm font-medium">Heavy rainfall expected in next 24h. Safe storage of harvested paddy advised.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Government Services & GPS Map */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-black flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            Government Services & Location Map
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Explore nearby government centers, soil health zones, and real-time agricultural data
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">7 Centers Active</span>
                    </div>
                </div>
                <GpsMap />
            </div>
        </div>
    );
};

const ProviderDash = ({ user, loading, t }) => {
    const stats = [
        { title: 'Total Revenue', value: '₹1,24,500', icon: CreditCard, trend: 15.2, color: 'bg-green-600' },
        { title: 'Pending Jobs', value: '08', icon: Clock, trend: 1.2, color: 'bg-amber-600' },
        { title: 'Fleet Rating', value: '4.8/5', icon: Star, trend: 0.4, color: 'bg-blue-600' },
        { title: 'Active Units', value: '12', icon: Tractor, trend: 5.1, color: 'bg-primary-600' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black">Provider Hub | {user?.name || 'Partner'}</h2>
                    <p className="text-slate-500 font-medium">Monitoring your service requests across {t('odisha')}.</p>
                </div>
                <button className="btn-primary">View Booking Heatmap</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => <StatCard key={i} {...s} loading={loading} />)}
            </div>

            <div className="glass-card p-8 rounded-[40px]">
                <h4 className="text-xl font-bold mb-8 italic">Incoming Assignments</h4>
                <div className="space-y-4">
                    {bookings.slice(0, 5).map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/10 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 font-black">
                                    {b.farmerName[0]}
                                </div>
                                <div>
                                    <p className="font-bold">{b.farmerName}</p>
                                    <p className="text-xs text-slate-500">{b.type} • {b.date.split('T')[0]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-black text-lg">₹{b.amount}</p>
                                    <p className="text-[10px] font-bold text-primary-600 uppercase">{b.status}</p>
                                </div>
                                <button className="btn-secondary px-6">Manage</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdminDash = ({ user, loading, t }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black">Command Center</h2>
                <p className="text-slate-500 font-medium">System Health: <span className="text-green-500">99.9% Operational</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Platform Revenue" value="₹12.4M" icon={CreditCard} trend={18.5} color="bg-blue-600" loading={loading} />
                <StatCard title="Total Farmers" value="1.2k" icon={Users} trend={12.4} color="bg-primary-600" loading={loading} />
                <StatCard title="System Tickets" value="05" icon={AlertCircle} trend={-65.0} color="bg-red-600" loading={loading} />
                <StatCard title="Total Transactions" value="8,902" icon={TrendingUp} trend={45.2} color="bg-green-600" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[40px]">
                    <h4 className="text-xl font-bold mb-8">Role Distribution</h4>
                    <div className="h-[300px] flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: ['Farmers', 'Providers', 'Admins'],
                                datasets: [{
                                    data: [70, 25, 5],
                                    backgroundColor: ['#16a34a', '#3b82f6', '#ef4444']
                                }]
                            }}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[40px]">
                    <h4 className="text-xl font-bold mb-8">Server Traffic (Live)</h4>
                    <div className="space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm font-bold opacity-70">Zone {i + i * 2}</span>
                                <div className="flex-1 mx-8 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.random() * 100}%` }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                                <span className="text-xs font-bold">Stable</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { weather, loading: weatherLoading } = useWeather();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (user?.role === 'provider') return <ProviderDash user={user} loading={loading} t={t} />;
    if (user?.role === 'admin' || user?.role === 'superadmin') return <AdminDash user={user} loading={loading} t={t} />;
    return <FarmerDash user={user} loading={loading} t={t} weather={weather} weatherLoading={weatherLoading} navigate={navigate} />;
};

export default Dashboard;
