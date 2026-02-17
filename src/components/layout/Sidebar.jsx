import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Tractor,
    Wrench,
    ScanSearch,
    MessageSquare,
    Wallet,
    ShieldCheck,
    Bell,
    LogOut,
    Leaf,
    Zap,
    Briefcase,
    X,
    Landmark,
    Settings,
    FileText,
    Calculator,
    ShoppingBag,
    Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(...inputs));
}

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const { t, lang, setLang } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: t('dashboard'), icon: LayoutDashboard, path: '/', roles: ['farmer', 'provider', 'admin', 'superadmin'] },
        { name: t('admin'), icon: ShieldCheck, path: '/admin', roles: ['admin', 'superadmin'] },
        { name: 'User Management', icon: Users, path: '/admin/users', roles: ['admin'] },
        { name: 'Reports', icon: FileText, path: '/admin/reports', roles: ['admin'] },
        { name: 'System Settings', icon: Settings, path: '/admin/settings', roles: ['admin'] },

        { name: lang === 'or' ? 'ଚାଷ ହିସାବ' : 'Farm Calculator', icon: Calculator, path: '/farm-calculator', roles: ['farmer'] },
        { name: t('rentTractor'), icon: Tractor, path: '/tractors', roles: ['farmer'] },
        { name: t('services'), icon: Wrench, path: '/services', roles: ['farmer'] },
        { name: 'Govt Schemes', icon: Landmark, path: '/government-schemes', roles: ['farmer'] },
        { name: 'Money Manager', icon: Calculator, path: '/financial-planning', roles: ['farmer'] },
        { name: t('aiScan'), icon: ScanSearch, path: '/ai-scan', roles: ['farmer'] },
        { name: 'Farming Solutions', icon: Leaf, path: '/farming-solutions', roles: ['farmer'] },
        { name: 'Agri Market', icon: ShoppingBag, path: '/agri-market', roles: ['farmer'] },
        { name: t('chatbot'), icon: MessageSquare, path: '/chatbot', roles: ['farmer'] },
        { name: t('wallet'), icon: Wallet, path: '/wallet', roles: ['farmer', 'provider'] },
        { name: t('providerHub'), icon: Briefcase, path: '/provider-hub', roles: ['provider'] },
        { name: t('notifications'), icon: Bell, path: '/notifications', roles: ['farmer', 'provider'] },
        { name: t('upgrade'), icon: Zap, path: '/pricing', roles: ['farmer', 'provider'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 lg:w-72 hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-30">
                <SidebarContent filteredMenu={filteredMenu} t={t} lang={lang} setLang={setLang} user={user} logout={logout} navigate={navigate} location={location} />
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-[110] md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="absolute right-4 top-6">
                                <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <SidebarContent filteredMenu={filteredMenu} t={t} lang={lang} setLang={setLang} user={user} logout={logout} navigate={navigate} location={location} setIsOpen={setIsOpen} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

const SidebarContent = ({ filteredMenu, t, lang, setLang, user, logout, navigate, location, setIsOpen }) => (
    <>
        <div className="p-6 flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-xl">
                <Leaf className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">GramAI</h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Smart Village Hub</p>
            </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6 px-4">
                <button
                    onClick={() => setLang('en')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                >
                    ENGLISH
                </button>
                <button
                    onClick={() => setLang('or')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'or' ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                >
                    ଓଡ଼ିଆ
                </button>
            </div>
            {filteredMenu.map((item) => (
                <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                        navigate(item.path);
                        setIsOpen && setIsOpen(false);
                    }}
                    className={cn(
                        "sidebar-link w-full",
                        location.pathname === item.path && "sidebar-link-active"
                    )}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">

            {user?.role !== 'admin' ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-4">
                    <p className="text-xs text-slate-500 mb-1">Current Tier</p>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-primary-600">{user?.tier || 'Gold Member'}</span>
                        <Link to="/pricing" className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold hover:bg-primary-200 transition-colors">UPGRADE</Link>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 text-white p-4 rounded-2xl mb-4 shadow-lg">
                    <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-bold">System Status</p>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-green-400 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Online</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-400">v2.4.0</span>
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
            </button>
        </div>
    </>
);

export default Sidebar;
