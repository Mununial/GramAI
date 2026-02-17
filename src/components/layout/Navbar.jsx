import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Sun, Moon, User, Menu, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { t, lang, setLang } = useLanguage();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'or', label: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
        { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }
    ];

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-[40]">
            <div className="flex items-center gap-4 md:hidden">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-bold text-primary-600">GramAI</span>
            </div>

            <div className="flex-1 max-w-xl hidden md:flex relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold text-sm"
                    >
                        <span>{languages.find(l => l.code === lang)?.flag}</span>
                        <span className="uppercase">{lang}</span>
                    </button>

                    <AnimatePresence>
                        {showLangMenu && (
                            <>
                                <div className="fixed inset-0 z-[50]" onClick={() => setShowLangMenu(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-[51]"
                                >
                                    {languages.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => {
                                                setLang(l.code);
                                                setShowLangMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${lang === l.code
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <span>{l.flag}</span> {l.label}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </button>

                <div className="relative">
                    <button type="button" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                </div>

                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-3 pl-2 relative">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{user?.role} Tier</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-600/20 hover:scale-105 transition-all z-[61]"
                    >
                        {user?.name?.[0] || 'U'}
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowProfileMenu(false)}
                                    className="fixed inset-0 z-[60]"
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-[62]"
                                >
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                        <p className="text-sm font-bold truncate">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.role} Account</p>
                                    </div>
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                        <User className="w-4 h-4" /> My Profile
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all mt-1"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
