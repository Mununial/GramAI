import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Star } from 'lucide-react';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PricingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProvider, setIsProvider] = useState(false);

    const farmerPlans = [
        {
            name: 'Free',
            price: '0',
            icon: Star,
            features: ['Basic AI Crop Scan (3/mo)', 'Public Govt Schemes', 'Local Service Directory', 'Standard Support'],
            color: 'bg-slate-500',
            popular: false
        },
        {
            name: 'Silver',
            price: '499',
            icon: Zap,
            features: ['Unlimited AI Crop Scan', 'Priority Booking', 'Scheme Application Help', 'Chat Support'],
            color: 'bg-primary-600',
            popular: false
        },
        {
            name: 'Gold',
            price: '999',
            icon: Crown,
            features: ['AI Yield Prediction', '0% Booking Fee', 'Expert Consultation', 'Voice Bot Commands'],
            color: 'bg-amber-500',
            popular: true
        },
        {
            name: 'Platinum',
            price: '1999',
            icon: Rocket,
            features: ['Live Expert Video Call', 'Automatic Scheme Apply', 'Free Equipment Delivery', 'VIP Support'],
            color: 'bg-purple-600',
            popular: false
        }
    ];

    const providerPlans = [
        {
            name: 'Starter',
            price: '0',
            icon: Star,
            features: ['Basic Profile Listing', 'Leads within 5km', 'Standard Commission (10%)', 'App Support'],
            color: 'bg-slate-500',
            popular: false
        },
        {
            name: 'Growth',
            price: '1499',
            icon: Zap,
            features: ['"Trusted" Verified Badge', 'Leads within 15km', 'Reduced Commission (8%)', 'SMS Alerts for New Jobs'],
            color: 'bg-teal-600',
            popular: false
        },
        {
            name: 'Pro',
            price: '3999',
            icon: Crown,
            features: ['Top Search Listing', 'Leads within 30km', 'Direct Customer Calls', 'Fleet Management Dashboard'],
            color: 'bg-amber-500',
            popular: true
        },
        {
            name: 'Business',
            price: '9999',
            icon: Rocket,
            features: ['Unlimited Service Radius', '0% Commission (Keep 100%)', 'Instant Payouts', 'Dedicated Manager'],
            color: 'bg-indigo-600',
            popular: false
        }
    ];

    const plans = isProvider ? providerPlans : farmerPlans;

    const handleSubscribe = (name) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 3000)),
            {
                pending: `Processing Subscription for ${name}...`,
                success: `Welcome to ${name} Tier! ${isProvider ? 'Start earning more.' : 'Enjoy premium features.'}`,
                error: 'Payment failed'
            }
        ).then(() => {
            navigate('/');
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <div className="text-center space-y-6">
                <div>
                    <h2 className="text-5xl font-black mb-4">Find the Perfect Plan</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        {isProvider
                            ? "Scale your service business with powerful tools and wider reach."
                            : "Elevate your farming with AI-driven insights and priority services."}
                    </p>
                </div>

                {/* Plan Toggle */}
                <div className="flex justify-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full flex gap-2 relative">
                        <motion.div
                            className="absolute bg-white dark:bg-slate-700 shadow-md inset-y-1.5 rounded-full z-0"
                            initial={false}
                            animate={{
                                x: isProvider ? '100%' : '0%',
                                width: '50%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setIsProvider(false)}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors ${!isProvider ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            For Farmers
                        </button>
                        <button
                            onClick={() => setIsProvider(true)}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors ${isProvider ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            For Service Providers
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={isProvider ? 'provider' : 'farmer'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass-card p-8 rounded-[40px] flex flex-col items-center text-center relative ${plan.popular ? 'border-2 border-primary-500 shadow-2xl shadow-primary-500/20 scale-105' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg transform -rotate-2">
                                    Most Popular
                                </div>
                            )}

                            <div className={`p-5 rounded-3xl ${plan.color} text-white mb-6 animate-float shadow-lg`}>
                                <plan.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black mb-2 text-slate-800 dark:text-white">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-4xl font-black text-slate-800 dark:text-white">₹{plan.price}</span>
                                <span className="text-slate-500 font-bold mb-1">/year</span>
                            </div>

                            <div className="w-full space-y-4 mb-10 text-left">
                                {plan.features.map((feat, j) => (
                                    <div key={j} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                        <div className={`mt-0.5 p-0.5 rounded-full ${plan.color} text-white shrink-0`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                className={`mt-auto w-full py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${plan.popular
                                    ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:shadow-primary-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                                    }`}
                            >
                                {plan.price === '0' ? 'Get Started' : 'Subscribe Now'}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PricingPage;
