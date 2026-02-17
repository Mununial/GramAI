import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Upload,
    Scan,
    AlertTriangle,
    CheckCircle2,
    FileText,
    RefreshCcw,
    Leaf,
    Droplets,
    Sprout,
    ShoppingBag
} from 'lucide-react';
import { diseases } from '../data/mockDB';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../context/LanguageContext';

const AICropScan = () => {
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                setResult(null);
                startScan();
            };
            reader.readAsDataURL(file);
        }
    };

    const [scanStep, setScanStep] = useState('');

    const scanSteps = [
        "Initializing neural network...",
        "Preprocessing image...",
        "Analyzing leaf texture...",
        "Detecting chlorosis patterns...",
        "Comparing with 50,000+ samples...",
        "Finalizing diagnosis..."
    ];

    const startScan = () => {
        setIsScanning(true);
        setProgress(0);
        let stepIndex = 0;
        setScanStep(scanSteps[0]);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsScanning(false);
                        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
                        setResult(randomDisease);
                        toast.success('Analysis Complete');
                    }, 800);
                    return 100;
                }

                // Update text based on progress
                if (prev % 20 === 0 && stepIndex < scanSteps.length) {
                    setScanStep(scanSteps[stepIndex]);
                    stepIndex++;
                }

                return prev + 2; // Slower, more realistic scan
            });
        }, 100);
    };

    const downloadReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('GramAI Crop Health Report', 20, 20);
        doc.setFontSize(14);
        doc.text(`Disease Detected: ${result.name}`, 20, 40);
        doc.text(`Confidence: ${result.confidence}%`, 20, 50);
        doc.text(`Severity: ${result.severity}`, 20, 60);
        doc.text(`Recommended Treatment: ${result.treatment}`, 20, 70);
        doc.text('Prevention Steps:', 20, 90);
        doc.text(result.prevention, 20, 100);
        doc.save(`gramai_report_${result.name}.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="text-center">
                <h2 className="text-4xl font-black mb-2">{t('aiScan')} Sentinel</h2>
                <p className="text-slate-500 dark:text-slate-400">{lang === 'or' ? '୯୮% ସଠିକତା ସହିତ ରୋଗ ଚିହ୍ନଟ କରିବାକୁ ଆପଣଙ୍କ ଫସଲର ଏକ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ |' : 'Upload a photo of your crop to detect diseases with 98% accuracy.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px]">
                    {image ? (
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                            <img src={image} alt="Crop" className="w-full h-full object-cover" />
                            {isScanning && (
                                <>
                                    <div className="absolute inset-0 bg-primary-600/20 backdrop-blur-[1px]"></div>
                                    <motion.div
                                        className="absolute top-0 left-0 right-0 h-1 bg-primary-400 shadow-[0_0_20px_#4ade80]"
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span className="text-white font-bold text-lg">{progress}%</span>
                                            </div>
                                            <p className="text-xs text-white/80 font-mono uppercase tracking-widest animate-pulse">{scanStep}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="w-full h-full border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all p-8 text-center"
                        >
                            <div className="mb-6 p-6 bg-primary-50 dark:bg-primary-950/30 rounded-full animate-float">
                                <Upload className="w-12 h-12 text-primary-600" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Click to Upload Image</h4>
                            <p className="text-sm text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card p-8 rounded-3xl h-full flex flex-col items-center justify-center text-center text-slate-400"
                            >
                                <Scan className="w-16 h-16 mb-4 opacity-20" />
                                <p>Upload an image to see <br />AI analysis results here.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="glass-card p-8 rounded-3xl border-l-[12px] border-l-red-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-600 rounded-full uppercase tracking-wider">Severity: {result.severity}</span>
                                        <span className="text-2xl font-black text-slate-400">#{Math.floor(Math.random() * 9000) + 1000}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{result.name}</h3>
                                    <div className="flex items-center gap-2 text-primary-600 font-bold mb-6">
                                        <CheckCircle2 className="w-5 h-5" /> {result.confidence}% Confidence
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Estimated Loss</p>
                                            <p className="text-xl font-bold text-red-500">{result.loss}%</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl relative overflow-hidden group">
                                            <div className="relative z-10">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Recommended Medicine</p>
                                                <p className="text-sm font-bold truncate text-green-600">{result.treatment}</p>
                                            </div>
                                            {result.medicine_img && (
                                                <img src={result.medicine_img} alt="Medicine" className="absolute right-0 bottom-0 w-16 h-16 object-contain opacity-80 group-hover:scale-110 transition-transform" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                        <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                                            <Droplets className="w-4 h-4" /> How it benefits? (Mechanism)
                                        </h4>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{result.mechanism}"</p>
                                    </div>

                                    <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                                        <h4 className="font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                            <Leaf className="w-4 h-4" /> Solution & Usage
                                        </h4>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{result.solution}</p>
                                    </div>
                                </div>

                                <div className="glass-card p-8 rounded-3xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <Sprout className="w-5 h-5 text-primary-500" /> Prevention Steps
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {result.prevention}
                                    </p>
                                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-200 to-yellow-400 flex items-center justify-between shadow-lg transform hover:scale-[1.02] transition-transform cursor-pointer"
                                        onClick={() => navigate('/agri-market')}
                                    >
                                        <div>
                                            <p className="font-black text-amber-900 text-sm uppercase tracking-wider">GramAI Offer</p>
                                            <p className="font-bold text-amber-900 text-lg">Buy {result.treatment.split(' ')[0]} at 20% OFF</p>
                                        </div>
                                        <div className="bg-white text-amber-900 p-2 rounded-full shadow-sm">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={downloadReport} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" /> Download PDF
                                        </button>
                                        <button onClick={() => { setImage(null); setResult(null); }} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all">
                                            <RefreshCcw className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AICropScan;
