import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, User, CheckCircle2, Search, Filter, Warehouse, Clock, Calendar, ArrowRight, ShieldCheck, Star, Plus, FileText, Landmark, X, ChevronRight, Download, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

const LandLease = () => {
    const { t, lang } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLand, setSelectedLand] = useState(null);
    const [leaseDuration, setLeaseDuration] = useState(6);
    const [bookingStage, setBookingStage] = useState('list');
    const [showBhulekh, setShowBhulekh] = useState(false);

    // Mock Land Data with Odia support
    const lands = [
        {
            id: 'l1',
            owner: 'Ramesh Sahoo',
            odiaOwner: 'ରମେଶ ସାହୁ',
            location: 'Pipili, Puri',
            odiaLocation: 'ପିପିଲି, ପୁରୀ',
            area: '2.5 Acres',
            odiaArea: '୨.୫ ଏକର',
            type: 'Irrigated (Canal)',
            odiaType: 'ଜଳସେଚିତ (କେନାଲ୍)',
            soil: 'Alluvial (Doarsa)',
            odiaSoil: 'ଦୋରସା ମାଟି',
            price: 15000,
            image: '/assets/lands/paddy.png',
            features: ['Near Canal', 'Fencing Done', 'Road Access'],
            odiaFeatures: ['କେନାଲ୍ ନିକଟ', 'ବାଡ଼ ଘେରା', 'ରାସ୍ତା ସଂଯୋଗ'],
            rating: 4.8,
            status: 'Available'
        },
        {
            id: 'l2',
            owner: 'Bikram Jena',
            odiaOwner: 'ବିକ୍ରମ ଜେନା',
            location: 'Balakati, Khurda',
            odiaLocation: 'ବାଳକାଟି, ଖୋର୍ଦ୍ଧା',
            area: '5.0 Acres',
            odiaArea: '୫.୦ ଏକର',
            type: 'Rainfed',
            odiaType: 'ବର୍ଷା ନିର୍ଭରଶୀଳ',
            soil: 'Red Soil',
            odiaSoil: 'ଲାଲ୍ ମାଟି',
            price: 12000,
            image: '/assets/lands/farmhouse.png',
            features: ['Tube Well', 'Store House', 'Near Market'],
            odiaFeatures: ['ନଳକୂଳ', 'ଗୋଦାମ', 'ବଜାର ନିକଟ'],
            rating: 4.5,
            status: 'Available'
        },
        {
            id: 'l3',
            owner: 'Suresh Das',
            odiaOwner: 'ସୁରେଶ ଦାସ',
            location: 'Nimapara, Puri',
            odiaLocation: 'ନିମାପଡ଼ା, ପୁରୀ',
            area: '1.2 Acres',
            odiaArea: '୧.୨ ଏକର',
            type: 'Irrigated (Pump)',
            odiaType: 'ଜଳସେଚିତ (ପମ୍ପ)',
            soil: 'Clayey (Matila)',
            odiaSoil: 'ମଟିଆ ମାଟି',
            price: 8000,
            image: '/assets/lands/irrigated.png',
            features: ['Organic Certified', 'Solar Pump'],
            odiaFeatures: ['ଜୈବିକ ପ୍ରମାଣିତ', 'ସୌର ପମ୍ପ'],
            rating: 4.9,
            status: 'Available'
        }
    ];

    const handleBook = () => {
        setBookingStage('success');
        toast.success(lang === 'or' ? "ଜମି ଲିଜ୍ ସଫଳ ହେଲା!" : "Land Leased Successfully!");
    };

    const handleListLand = (e) => {
        e.preventDefault();
        toast.success(lang === 'or' ? "ଜମି ଲିଷ୍ଟ୍ ହେଲା! ଯାଞ୍ଚ ପରେ ଅନୁମୋଦନ କରାଯିବ।" : "Land Listed Successfully! Pending verification.");
        setBookingStage('list');
    };

    const downloadAgreement = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Land Lease Agreement", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Agreement ID: #LEA-${Date.now().toString().slice(-6)}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.line(20, 60, 190, 60);
        doc.text("Lessor Details:", 20, 75);
        doc.text(`Name: ${selectedLand.owner}`, 20, 85);
        doc.text(`Location: ${selectedLand.location}`, 20, 95);
        doc.text("Lease Details:", 20, 115);
        doc.text(`Area: ${selectedLand.area}`, 20, 125);
        doc.text(`Duration: ${leaseDuration} Months`, 20, 135);
        doc.text(`Total Amount: Rs. ${(selectedLand.price * leaseDuration).toLocaleString()}`, 20, 145);
        doc.save("lease_agreement.pdf");
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{t('landLease')}</h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">{t('findLand')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setBookingStage('add_land')}
                        className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl font-black hover:scale-105 transition-transform shadow-xl shadow-primary-600/20"
                    >
                        <Plus className="w-5 h-5" /> {t('listLand')}
                    </button>
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-3xl shadow-inner">
                        <Warehouse className="w-8 h-8 text-green-600" />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {bookingStage === 'list' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                        {/* Search Bar */}
                        <div className="flex gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                            <Search className="w-6 h-6 text-primary-500" />
                            <input
                                type="text"
                                placeholder={t('searchLocation')}
                                className="flex-1 bg-transparent outline-none font-bold text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                <Filter className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Lands Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lands.filter(l => l.location.toLowerCase().includes(searchTerm.toLowerCase())).map(land => (
                                <motion.div
                                    key={land.id}
                                    whileHover={{ y: -10 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 group"
                                >
                                    <div className="h-60 bg-slate-200 relative overflow-hidden">
                                        <img src={land.image} alt="Land" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black flex items-center gap-2 shadow-xl border border-white/20">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {land.rating}
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-primary-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase">
                                            {lang === 'or' ? land.odiaType : land.type}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-1">{lang === 'or' ? land.odiaLocation : land.location}</h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{lang === 'or' ? land.odiaArea : land.area} • {lang === 'or' ? land.odiaSoil : land.soil}</p>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="text-2xl font-black text-primary-600 italic">₹{land.price.toLocaleString()}</h4>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{t('perMonth')}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8 uppercase tracking-[0.2em] text-[8px] font-black">
                                            {(lang === 'or' ? land.odiaFeatures : land.features).map((f, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => { setSelectedLand(land); setBookingStage('details'); }}
                                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                                        >
                                            {t('viewDetails')} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {bookingStage === 'details' && selectedLand && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="max-w-6xl mx-auto space-y-8">
                        <button onClick={() => setBookingStage('list')} className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-180" /> {lang === 'or' ? "ପଛକୁ ଫେରନ୍ତୁ" : "Back to Listings"}
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                            <div className="lg:col-span-3 space-y-10">
                                <div className="h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                                    <img src={selectedLand.image} alt="Land" className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center">
                                            <User className="w-10 h-10 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('owner')}</p>
                                            <h4 className="text-2xl font-black">{lang === 'or' ? selectedLand.odiaOwner : selectedLand.owner}</h4>
                                            <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase mt-1">
                                                <ShieldCheck size={12} /> Verified Landlord
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center">
                                            <Landmark className="w-10 h-10 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('soilType')}</p>
                                            <h4 className="text-2xl font-black">{lang === 'or' ? selectedLand.odiaSoil : selectedLand.soil}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-slate-900 text-white p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] h-fit space-y-10 sticky top-24 border border-white/5">
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter italic leading-none mb-4">{lang === 'or' ? selectedLand.odiaLocation : selectedLand.location}</h2>
                                    <div className="flex gap-4">
                                        <span className="px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{lang === 'or' ? selectedLand.odiaArea : selectedLand.area}</span>
                                        <span className="px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{lang === 'or' ? selectedLand.odiaType : selectedLand.type}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('leaseDuration')}</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[3, 6, 12, 24].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setLeaseDuration(m)}
                                                className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${leaseDuration === m ? 'bg-primary-600 border-primary-600 shadow-xl' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30'}`}
                                            >
                                                {m}M
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Monthly Rent</span>
                                        <span>₹{selectedLand.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Duration</span>
                                        <span>{leaseDuration} {t('months')}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-4"></div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-3xl font-black italic tracking-tighter uppercase">{t('total')}</span>
                                        <span className="text-3xl font-black italic tracking-tighter text-primary-500">₹{(selectedLand.price * leaseDuration).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase italic tracking-tighter"
                                >
                                    {t('proceedToLease')} <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {bookingStage === 'add_land' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
                        <button onClick={() => setBookingStage('list')} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-black hover:dark:text-white transition-colors">
                            <ArrowRight className="w-5 h-5 rotate-180" /> {lang === 'or' ? "ପଛକୁ ଫେରନ୍ତୁ" : "Back to Listings"}
                        </button>
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center"><Landmark size={32} className="text-green-600" /></div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t('listLand')}</h2>
                                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Enter details as per Bhulekh (RoR) Records</p>
                                </div>
                                <button onClick={() => setShowBhulekh(true)} className="ml-auto px-6 py-4 bg-orange-100 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-200 transition-all animate-pulse shadow-lg shadow-orange-500/10">Browse Bhulekh</button>
                            </div>
                            <form onSubmit={handleListLand} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">District</label><input type="text" placeholder="e.g. Puri" className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary-600" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Village</label><input type="text" placeholder="Village Name" className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary-600" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khata No.</label><input type="text" placeholder="e.g. 104/11" className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary-600" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area (Acres)</label><input type="text" placeholder="e.g. 2.5" className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary-600" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rent (₹/Month)</label><input type="number" placeholder="5000" className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary-600" /></div>
                                <div className="md:col-span-2 pt-6"><button type="submit" className="w-full py-6 bg-primary-600 text-white rounded-[2rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl shadow-primary-500/20 active:scale-95 transition-all">Submit Listing</button></div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {bookingStage === 'success' && selectedLand && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto py-12">
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center space-y-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/40 animate-bounce">
                                <CheckCircle2 size={64} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-5xl font-black tracking-tighter italic uppercase">{lang === 'or' ? "ଲିଜ୍ ସମ୍ପୂର୍ଣ୍ଣ!" : "Success!"}</h2>
                                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Agreement ID: #LEA-778231</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] text-left space-y-4 shadow-inner border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('owner')}</span><span className="font-extrabold">{selectedLand.owner}</span></div>
                                <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('leaseDuration')}</span><span className="font-extrabold">{leaseDuration} {t('months')}</span></div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700"><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount Paid</span><span className="text-3xl font-black italic text-primary-600">₹{(selectedLand.price * leaseDuration).toLocaleString()}</span></div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button onClick={downloadAgreement} className="flex-1 py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"><Download size={18} /> {t('agreement')}</button>
                                <button onClick={() => { setSelectedLand(null); setBookingStage('list'); }} className="flex-1 py-6 bg-primary-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Finish Process</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bhulekh Integration Modal */}
            <AnimatePresence>
                {showBhulekh && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div initial={{ scale: 0.9, y: 100 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 100 }} className="bg-white rounded-[3rem] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
                            <div className="bg-slate-100 p-6 flex items-center justify-between border-b border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                                    <div className="bg-white px-6 py-2 rounded-xl text-xs font-black text-slate-400 border border-slate-200 flex items-center gap-3"><ShieldCheck size={14} className="text-green-500" /> bhulekh.ori.nic.in</div>
                                </div>
                                <button onClick={() => setShowBhulekh(false)} className="p-4 bg-slate-200 hover:bg-slate-300 rounded-full transition-all"><X size={24} className="text-slate-600" /></button>
                            </div>
                            <iframe src="https://bhulekh.ori.nic.in/RoRView.aspx" title="Bhulekh Odisha" className="w-full h-full border-none" />
                            <div className="bg-orange-600 text-white p-4 text-center text-xs font-black uppercase tracking-widest">Village Record Lookup active • Close this window after finding your plot details.</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandLease;
