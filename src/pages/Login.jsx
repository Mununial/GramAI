import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Phone, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Login = () => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('farmer');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (phone.length < 10) return toast.error('Enter a valid phone number');

        toast.info('Demo OTP: 1234 sent to your number (Simulated)', { autoClose: 5000 });
        setStep(2);
    };

    const handleFastLogin = async (r) => {
        setRole(r);
        setIsVerifying(true);
        try {
            await login(r, '9876543210', r === 'admin' ? 'System Admin' : 'Rajesh Farmer');
            toast.success(`Logged in as ${r}!`);
            navigate('/');
        } catch (err) {
            toast.error('Login Failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        if (enteredOtp !== '1234' && enteredOtp !== '') {
            return toast.error('Wrong OTP! Use 1234 or leave blank.');
        }

        setIsVerifying(true);
        try {
            await login(role, phone, name);
            toast.success('Login Successful!');
            navigate('/');
        } catch (err) {
            toast.error('Invalid OTP');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }

        // Auto-submit when all 4 digits are entered
        if (index === 3 && value) {
            const fullOtp = [...newOtp.slice(0, 3), value].join('');
            if (fullOtp.length === 4) {
                setTimeout(() => {
                    handleAutoVerify(fullOtp);
                }, 300);
            }
        }
    };

    const handleAutoVerify = async (enteredOtp) => {
        if (enteredOtp !== '1234' && enteredOtp !== '') {
            toast.error('Wrong OTP! Demo OTP is: 1234');
            setOtp(['', '', '', '']);
            document.getElementById('otp-0').focus();
            return;
        }

        setIsVerifying(true);
        try {
            await login(role, phone, name || 'User');
            toast.success('Login Successful! 🎉');
            setTimeout(() => navigate('/'), 500);
        } catch (err) {
            toast.error('Login failed. Please try again.');
            setOtp(['', '', '', '']);
            document.getElementById('otp-0').focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-primary-600 rounded-2xl shadow-xl shadow-primary-600/30 mb-4 animate-float">
                        <Leaf className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">GramAI</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Empowering Smart Villages with AI</p>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
                        {['farmer', 'provider', 'admin'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${role === r
                                    ? 'bg-white dark:bg-slate-700 shadow-lg text-primary-600'
                                    : 'text-slate-500'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOTP}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="text-sm font-bold text-slate-500 mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your Real Name"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-500 mb-2 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter 10 digit number"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 text-center">We will send a 4-digit OTP to verify your account</p>
                                <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg">
                                    Send OTP <ArrowRight className="w-5 h-5" />
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-bold">Quick Demo Access</span></div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {['farmer', 'provider', 'admin'].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => handleFastLogin(r)}
                                            className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOTP}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold">Verification</h3>
                                    <p className="text-sm text-slate-500 mt-1">Sent to {phone}</p>
                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                                            💡 Demo OTP: <span className="text-lg">1234</span>
                                        </p>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-500 mt-1">
                                            Auto-submits when you enter all 4 digits
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-3">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            className="w-14 h-16 text-center text-2xl font-bold bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isVerifying}
                                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-70"
                                >
                                    {isVerifying ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Verify & Proceed <CheckCircle2 className="w-5 h-5" /></>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors"
                                >
                                    Edit Phone Number
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center text-xs text-slate-500 mt-8">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <p>Don't have an account? <span onClick={() => navigate('/register')} className="text-primary-600 font-bold cursor-pointer hover:underline">Register as Farmer</span></p>
                            <button
                                onClick={() => navigate('/register')}
                                className="text-[10px] text-slate-400 uppercase tracking-widest font-black hover:text-primary-600 transition-colors"
                            >
                                Become a Service Provider
                            </button>
                        </div>
                    ) : (
                        <p>By continuing, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span></p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
