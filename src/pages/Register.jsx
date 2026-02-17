import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [role, setRole] = useState('farmer');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        toast.success(`Account created as ${role}! Redirecting to login...`);
        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
                <div className="md:w-1/2 bg-primary-600 p-12 text-white flex flex-col justify-center">
                    <Leaf className="w-12 h-12 mb-6" />
                    <h2 className="text-4xl font-black mb-4">Join GramAI</h2>
                    <p className="opacity-80 leading-relaxed">Connect with thousands of farmers and service providers across Odisha. Get AI-powered insights and earn more.</p>
                </div>

                <div className="md:w-1/2 p-12">
                    <h3 className="text-2xl font-bold mb-8">Create Account</h3>
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500">Pick your role</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('farmer')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'farmer' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-slate-100 dark:border-slate-800'}`}
                                >
                                    <User className="w-6 h-6" />
                                    <span className="text-xs font-bold">Farmer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('provider')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'provider' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-slate-100 dark:border-slate-800'}`}
                                >
                                    <ShieldCheck className="w-6 h-6" />
                                    <span className="text-xs font-bold">Provider</span>
                                </button>
                            </div>
                        </div>

                        <input type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-600" required />
                        <input type="tel" placeholder="Phone Number" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-600" required />

                        <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                            Create Account <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <span onClick={() => navigate('/login')} className="text-primary-600 font-bold cursor-pointer hover:underline">Log In</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
