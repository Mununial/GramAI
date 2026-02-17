import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import {
    Calculator, Volume2, Languages, ChevronRight, ChevronLeft,
    Sprout, Wheat, Carrot, IndianRupee, TrendingUp, AlertCircle,
    Package, Tractor, Zap, Download, Share2, RotateCcw, Play, CheckCircle2,
    Users, Droplet, Bug
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';

const FarmCalculator = () => {
    const { lang } = useLanguage();

    // Map global lang codes to local content keys
    const languageMap = { 'or': 'odia', 'hi': 'hindi', 'en': 'english' };
    const language = languageMap[lang] || 'english';

    const [step, setStep] = useState(1);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [acreage, setAcreage] = useState('');
    const [season, setSeason] = useState('kharif');
    const [calculations, setCalculations] = useState(null);

    // Mock Data
    const crops = [
        {
            id: 'paddy',
            name: { english: 'Paddy (Rice)', odia: 'ଧାନ', hindi: 'धान' },
            icon: Sprout,
            color: 'bg-green-100 text-green-600',
            duration: '120-150 days',
            avgYield: 20 // quintal per acre
        },
        {
            id: 'wheat',
            name: { english: 'Wheat', odia: 'ଗହମ', hindi: 'गेहूं' },
            icon: Wheat,
            color: 'bg-amber-100 text-amber-600',
            duration: '100-120 days',
            avgYield: 18
        },
        {
            id: 'vegetables',
            name: { english: 'Vegetables', odia: 'ପରିବା', hindi: 'सब्जियां' },
            icon: Carrot,
            color: 'bg-orange-100 text-orange-600',
            duration: '60-90 days',
            avgYield: 50
        }
    ];

    const handleCalculate = () => {
        if (!selectedCrop || !acreage) {
            toast.error("Please select a crop and enter land area");
            return;
        }

        const acres = parseFloat(acreage);
        const cropData = crops.find(c => c.id === selectedCrop);

        // Basic Cost Assumptions (Per Acre)
        const costsPerAcre = {
            seeds: 1200,
            fertilizer: 3500,
            pesticide: 1500,
            labor: 5000,
            irrigation: 2000,
            other: 1000
        };

        const totalCostPerAcre = Object.values(costsPerAcre).reduce((a, b) => a + b, 0);
        const totalCost = totalCostPerAcre * acres;

        // Income Assumptions
        const pricePerQuintal = selectedCrop === 'paddy' ? 2200 : selectedCrop === 'wheat' ? 2400 : 3000; // MSP approx
        const yieldPerAcre = cropData.avgYield;
        const totalYield = yieldPerAcre * acres;
        const totalIncome = totalYield * pricePerQuintal;

        const totalProfit = totalIncome - totalCost;

        setCalculations({
            crop: selectedCrop,
            acres,
            costs: {
                seeds: costsPerAcre.seeds * acres,
                fertilizer: costsPerAcre.fertilizer * acres,
                pesticide: costsPerAcre.pesticide * acres,
                labor: costsPerAcre.labor * acres,
                irrigation: costsPerAcre.irrigation * acres,
                other: costsPerAcre.other * acres
            },
            totalCost,
            totalIncome,
            totalProfit,
            perAcreCost: totalCostPerAcre,
            perAcreIncome: totalIncome / acres,
            perAcreProfit: totalProfit / acres,
            yield: totalYield
        });

        setStep(4);
    };

    const downloadReport = () => {
        if (!calculations) return;

        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text("GramAI - Farm Estimate", 20, 20);

            doc.setFontSize(14);
            const cropName = crops.find(c => c.id === calculations.crop).name['english'];
            doc.text(`Crop: ${cropName}`, 20, 40);
            doc.text(`Area: ${calculations.acres} Acres`, 20, 50);
            doc.text(`Season: ${season.toUpperCase()}`, 20, 60);

            doc.line(20, 70, 190, 70);

            doc.text("Cost Breakdown:", 20, 85);
            let y = 95;
            Object.entries(calculations.costs).forEach(([key, val]) => {
                doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: Rs. ${val.toLocaleString()}`, 30, y);
                y += 10;
            });

            doc.line(20, y + 5, 190, y + 5);
            doc.setFontSize(16);
            doc.text(`Total Cost: Rs. ${calculations.totalCost.toLocaleString()}`, 20, y + 20);
            doc.text(`Expected Income: Rs. ${calculations.totalIncome.toLocaleString()}`, 20, y + 30);
            doc.text(`Net Profit: Rs. ${calculations.totalProfit.toLocaleString()}`, 20, y + 40);

            doc.save("farm-estimate.pdf");
            toast.success("Report downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Download failed");
        }
    };

    // Translations
    const t = {
        title: { odia: 'ଚାଷ ହିସାବ', hindi: 'खेती का हिसाब', english: 'Farm Calculator' },
        selectCrop: { odia: 'ଫସଲ ବାଛନ୍ତୁ', hindi: 'फसल चुनें', english: 'Select Crop' },
        enterDetails: { odia: 'ବିବରଣୀ ଦିଅନ୍ତୁ', hindi: 'विवरण दर्ज करें', english: 'Enter Details' },
        landArea: { odia: 'ଜମି ପରିମାଣ (ଏକର)', hindi: 'जमीन (एकड़)', english: 'Land Area (Acres)' },
        season: { odia: 'ଋତୁ', hindi: 'मौसम', english: 'Season' },
        kharif: { odia: 'ଖରିଫ୍ (ବର୍ଷା)', hindi: 'खरीफ', english: 'Kharif' },
        rabi: { odia: 'ରବି (ଶୀତ)', hindi: 'रबी', english: 'Rabi' },
        calculate: { odia: 'ହିସାବ କରନ୍ତୁ', hindi: 'हिसाब करें', english: 'Calculate' },
        invest: { odia: 'ମୋଟ ଖର୍ଚ୍ଚ', hindi: 'कुल निवेश', english: 'Total Investment' },
        return: { odia: 'ମୋଟ ଆୟ', hindi: 'कुल आय', english: 'Expected Return' },
        profit: { odia: 'ଲାଭ', hindi: 'लाभ', english: 'Net Profit' },
        recalc: { odia: 'ପୁନର୍ବାର ଗଣନା', hindi: 'फिर से गणना', english: 'Recalculate' },
        download: { odia: 'ରିପୋର୍ଟ ଡାଉନଲୋଡ୍', hindi: 'रिपोर्ट डाउनलोड', english: 'Download Report' }
    };

    const getT = (key) => t[key][language] || t[key]['english'];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20">
                    <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-black">{getT('title')}</h2>
                    <p className="text-slate-500 font-bold">Plan your farming budget effectively</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h3 className="text-xl font-bold">{getT('selectCrop')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {crops.map(crop => (
                                <button
                                    key={crop.id}
                                    onClick={() => { setSelectedCrop(crop.id); setStep(2); }}
                                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-transparent hover:border-primary-500 shadow-sm hover:shadow-xl transition-all group text-left"
                                >
                                    <div className={`w-12 h-12 ${crop.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <crop.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black">{crop.name[language]}</h4>
                                    <p className="text-sm text-slate-500 font-bold">{crop.duration}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl">
                        <h3 className="text-xl font-bold">{getT('enterDetails')}</h3>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 uppercase">{getT('landArea')}</label>
                            <input
                                type="number"
                                value={acreage}
                                onChange={(e) => setAcreage(e.target.value)}
                                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-2xl outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="0.0"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 uppercase">{getT('season')}</label>
                            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                                <button
                                    onClick={() => setSeason('kharif')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${season === 'kharif' ? 'bg-white dark:bg-slate-700 shadow text-green-600' : 'text-slate-500'}`}
                                >
                                    {getT('kharif')}
                                </button>
                                <button
                                    onClick={() => setSeason('rabi')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${season === 'rabi' ? 'bg-white dark:bg-slate-700 shadow text-amber-600' : 'text-slate-500'}`}
                                >
                                    {getT('rabi')}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setStep(1)} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200">
                                <ChevronLeft />
                            </button>
                            <button onClick={handleCalculate} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                                {getT('calculate')} <ChevronRight />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && calculations && (
                    <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-8 border-red-500 shadow-sm">
                                <p className="text-xs font-bold text-red-500 uppercase mb-1">{getT('invest')}</p>
                                <h3 className="text-3xl font-black text-red-600">₹{calculations.totalCost.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-8 border-blue-500 shadow-sm">
                                <p className="text-xs font-bold text-blue-500 uppercase mb-1">{getT('return')}</p>
                                <h3 className="text-3xl font-black text-blue-600">₹{calculations.totalIncome.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-8 border-green-500 shadow-sm">
                                <p className="text-xs font-bold text-green-500 uppercase mb-1">{getT('profit')}</p>
                                <h3 className="text-3xl font-black text-green-600">₹{calculations.totalProfit.toLocaleString()}</h3>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5" /> Breakdown
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                {Object.entries(calculations.costs).map(([key, val]) => (
                                    <div key={key} className="flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                {key === 'seeds' && <Sprout className="w-4 h-4" />}
                                                {key === 'labor' && <Users className="w-4 h-4" />}
                                                {key === 'fertilizer' && <Package className="w-4 h-4" />}
                                                {key === 'pesticide' && <Bug className="w-4 h-4" />}
                                                {key === 'irrigation' && <Droplet className="w-4 h-4" />}
                                                {key === 'other' && <Zap className="w-4 h-4" />}
                                            </div>
                                            <span className="font-bold capitalize text-slate-600 dark:text-slate-300">{key}</span>
                                        </div>
                                        <span className="font-black text-slate-800 dark:text-white">₹{val.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200">
                                <RotateCcw className="w-5 h-5 inline mr-2" /> {getT('recalc')}
                            </button>
                            <button onClick={downloadReport} className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
                                <Download className="w-5 h-5 inline mr-2" /> {getT('download')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FarmCalculator;
