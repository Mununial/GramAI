import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tractor, MapPin, Clock, Star, CheckCircle2, X, Navigation,
    Fuel, Settings, ShieldCheck, Search, ArrowRight, Phone,
    FileText, Download, User, Sprout, Truck, Scissors, AlertTriangle, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GpsMap from '../components/common/GpsMap';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

const TractorBooking = () => {
    const { lang } = useLanguage();

    // Stages: 'search', 'category', 'select', 'finding', 'arriving', 'completed'
    const [stage, setStage] = useState('search');
    const [location, setLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [driver, setDriver] = useState(null);
    const [paymentMode, setPaymentMode] = useState('cash');



    // Farming Categories & Machines
    const farmCategories = [
        {
            id: 'prep',
            title: { en: 'Land Preparation', hi: 'खेत की तैयारी', or: 'ଜମି ପ୍ରସ୍ତୁତି' },
            icon: Tractor,
            desc: { en: 'Plough, Rotavator, Cultivator', hi: 'हल, रोटावेटर, कल्टीवेटर', or: 'ହଳ, ରୋଟାଭେଟର' },
            machines: [
                { id: 'rotavator', name: 'Rotavator (7ft)', price: 800, eta: '10 min', capacity: '45HP+' },
                { id: 'cultivator', name: 'Cultivator (9 Tyres)', price: 600, eta: '15 min', capacity: '35HP+' },
                { id: 'plough', name: 'MB Plough', price: 900, eta: '20 min', capacity: '50HP+' },
                { id: 'leveller', name: 'Laser Leveller', price: 1200, eta: '1 day', capacity: '55HP+' }
            ]
        },
        {
            id: 'sowing',
            title: { en: 'Sowing & Planting', hi: 'बुवाई और रोपाई', or: 'ବୁଣାବୁଣି' },
            icon: Sprout,
            desc: { en: 'Seed Drill, Planter', hi: 'सीड ड्रिल, प्लांटर', or: 'ସିଡ୍ ଡ୍ରିଲ୍' },
            machines: [
                { id: 'seed_drill', name: 'Auto Seed Drill', price: 1000, eta: '30 min', capacity: 'High Precision' },
                { id: 'potato_planter', name: 'Potato Planter', price: 1500, eta: '1 hr', capacity: 'Automatic' },
                { id: 'transplanter', name: 'Paddy Transplanter', price: 2000, eta: '2 hrs', capacity: 'Walk-behind' }
            ]
        },
        {
            id: 'harvest',
            title: { en: 'Harvesting', hi: 'फसल कटाई (Dhan Cut)', or: 'ଫସଲ ଅମଳ' },
            icon: Scissors,
            desc: { en: 'Harvester, Reaper', hi: 'हार्वेस्टर, रीपर', or: 'ହାର୍ଭେଷ୍ଟର' },
            machines: [
                { id: 'combine_tyre', name: 'Combine (Tyre)', price: 1800, eta: '45 min', capacity: 'Wheat/Paddy' },
                { id: 'combine_chain', name: 'Combine (Chain)', price: 2200, eta: '1 hr', capacity: 'Wet Land' },
                { id: 'reaper', name: 'Reaper Binder', price: 800, eta: '30 min', capacity: 'Straw Binder' },
                { id: 'thresher', name: 'Multi-Crop Thresher', price: 700, eta: '20 min', capacity: 'Paddy/Wheat' }
            ]
        },
        {
            id: 'hulage',
            title: { en: 'Haulage & Transport', hi: 'ढुलाई', or: 'ପରିବହନ' },
            icon: Truck,
            desc: { en: 'Trolley, Tanker', hi: 'ट्रॉली, टैंकर', or: 'ଟ୍ରଲି' },
            machines: [
                { id: 'trolley_h', name: 'Hydraulic Trolley', price: 500, eta: '10 min', capacity: '10 Ton' },
                { id: 'tanker', name: 'Water Tanker', price: 400, eta: '15 min', capacity: '5000L' }
            ]
        },
        {
            id: 'spray',
            title: { en: 'Spraying', hi: 'छिड़काव', or: 'ଔଷଧ ସିଞ୍ଚନ' },
            icon: Settings,
            desc: { en: 'Boom Sprayer, Drone', hi: 'बूम स्प्रेयर, ड्रोन', or: 'ସ୍ପ୍ରେୟାର' },
            machines: [
                { id: 'boom', name: 'Tractor Boom Sprayer', price: 600, eta: '20 min', capacity: '500L' },
                { id: 'drone', name: 'Agri-Drone', price: 1500, eta: '1 day', capacity: '10L' }
            ]
        }
    ];

    const drivers = [
        { name: 'Raju Bhai', rating: 4.8, vehicle: 'Mahindra 575', phone: '9876543210', id: 'DL-01' },
        { name: 'Suresh Kumar', rating: 4.5, vehicle: 'Sonalika DI', phone: '9123456780', id: 'OD-05' },
        { name: 'Bikram Jena', rating: 4.9, vehicle: 'John Deere', phone: '7008123456', id: 'OD-02' }
    ];

    // Handlers
    const handleSearch = (e) => {
        e.preventDefault();
        if (location.trim()) setStage('category');
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setStage('select');
    };

    const handleBook = (type, pMode = null) => {
        setSelectedType(type);
        if (pMode) {
            setPaymentMode(pMode);
            setStage('finding');

            // Simulate Finding Driver
            setTimeout(() => {
                const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
                setDriver(randomDriver);
                setStage('arriving');
                toast.success("Machinery Found!");
            }, 3000);
        } else {
            setStage('payment');
        }
    };

    const handleComplete = () => {
        setStage('completed');
    };

    const downloadReceipt = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text("GramAI - Farm Service Receipt", 20, 20);

            doc.setFontSize(14);
            doc.text(`Booking ID: #${Date.now()}`, 20, 40);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
            doc.text(`Location: ${location}`, 20, 60);

            doc.line(20, 70, 190, 70);

            doc.text(`Service: ${selectedCategory?.title['en']}`, 20, 80);
            doc.text(`Machine: ${selectedType?.name}`, 20, 90);
            doc.text(`Provider: ${driver?.name}`, 20, 100);
            doc.text(`Rate: Rs. ${selectedType?.price}/hr`, 20, 110);

            doc.line(20, 120, 190, 120);

            doc.setFontSize(16);
            doc.text(`Total Paid: Rs. ${selectedType?.price}`, 140, 140);

            doc.save("gramai-receipt.pdf");
            toast.success("Receipt Downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Download failed. Try again.");
        }
    };

    // Translations helper
    const t_ui = {
        search: { en: 'Farm location for service?', hi: 'सेवा के लिए खेत का स्थान?', or: 'ସେବା ପାଇଁ ଫାର୍ମର ସ୍ଥାନ?' },
        category: { en: 'Select Service Type', hi: 'सेवा का प्रकार चुनें', or: 'ସେବା ପ୍ରକାର ଚୟନ କରନ୍ତୁ' },
        choose: { en: 'Choose Machinery', hi: 'मशीन चुनें', or: 'ଯନ୍ତ୍ର ବାଛନ୍ତୁ' },
        finding: { en: 'Finding Nearby Providers...', hi: 'पास के प्रदाता खोज रहे हैं...', or: 'ନିକଟସ୍ଥ ପ୍ରଦାତା ଖୋଜା ଚାଲିଛି...' },
        arriving: { en: 'Provider is arriving!', hi: 'प्रदाता आ रहा है!', or: 'ପ୍ରଦାତା ଆସୁଛନ୍ତି!' },
        complete: { en: 'Service Completed', hi: 'सेवा पूर्ण हुई', or: 'ସେବା ସମ୍ପୂର୍ଣ୍ଣ ହେଲା' },
        download: { en: 'Download Bill', hi: 'बिल डाउनलोड करें', or: 'ବିଲ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ' }
    };
    const getVal = (obj) => obj[lang] || obj['en'];

    const handleUseMyLocation = () => {
        if ('geolocation' in navigator) {
            toast.info("📍 Locating you...");
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Reverse Geocoding via Nominatim (OpenStreetMap)
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();

                        // Extract address parts (Village, District, State)
                        const address = data.address || {};
                        const place = address.village || address.town || address.city || address.county;
                        const district = address.state_district || address.state;

                        let formattedAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        if (place && district) {
                            formattedAddress = `${place}, ${district}`;
                        }

                        setLocation(formattedAddress);
                        setStage('category');
                        toast.success("Location: " + formattedAddress);
                    } catch (err) {
                        console.error('Geocoding Error:', err);
                        // Fallback to coords if API fails
                        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                        setStage('category');
                        toast.success("Location Coords Found!");
                    }
                },
                (error) => {
                    console.warn("GPS Error:", error.message);
                    if (error.code === 1) {
                        toast.warn("GPS Access Denied. Please enter location manually.");
                    } else {
                        toast.error("Could not fetch location. Try again.");
                    }
                }
            );
        } else {
            toast.error("GPS not supported.");
        }
    };

    const [showHelpModal, setShowHelpModal] = useState(false);

    const handleReport = (issue) => {
        toast.info("Processing report...", { autoClose: 1000 });
        setTimeout(() => {
            if (issue === 'extra_money') {
                toast.error("🚨 ALERT: Admin Notified! Driver Flagged for investigation.", { autoClose: 5000 });
            } else {
                toast.success("Support ticket raised. We will call you shortly.");
            }
            setShowHelpModal(false);
        }, 1500);
    };

    return (
        <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden flex flex-col">
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <GpsMap activeTrack={stage === 'arriving' ? { pos: 50, owner: driver?.name || 'Driver' } : null} />
            </div>

            {/* Stage 1: Location Search (Overlay) */}
            <AnimatePresence>
                {stage === 'search' && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/50 to-transparent"
                    >
                        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl">
                            <h2 className="text-2xl font-black mb-4">{getVal(t_ui.search)}</h2>
                            <form onSubmit={handleSearch} className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-3">
                                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Enter village or plot no..."
                                            className="bg-transparent outline-none flex-1 font-bold text-lg"
                                            autoFocus
                                        />
                                        <MapPin className="text-slate-400" />
                                    </div>
                                    <button type="submit" className="bg-black dark:bg-white text-white dark:text-black p-4 rounded-2xl md:px-8 font-black flex items-center gap-2">
                                        <ArrowRight />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleUseMyLocation}
                                    className="flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                >
                                    <Navigation className="w-4 h-4" /> Use Current Location
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 2: Category Selection */}
            <AnimatePresence>
                {stage === 'category' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="absolute bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800 h-[70vh]"
                    >
                        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xl font-black">{getVal(t_ui.category)}</h3>
                            <button onClick={() => setStage('search')} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 overflow-y-auto h-[55vh] pb-10">
                            {farmCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat)}
                                    className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-primary-500 hover:shadow-lg transition-all"
                                >
                                    <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                                        <cat.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h4 className="font-bold text-sm text-center mb-1">{cat.title[lang] || cat.title['en']}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium text-center">{cat.desc[lang] || cat.desc['en']}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 3: Vehicle Selection */}
            <AnimatePresence>
                {stage === 'select' && selectedCategory && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800"
                    >
                        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <button onClick={() => setStage('category')} className="p-2 hover:bg-slate-100 rounded-full">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                            <div>
                                <h3 className="text-xl font-black">{selectedCategory.title[lang] || selectedCategory.title['en']}</h3>
                                <p className="text-sm text-slate-500 font-bold">{getVal(t_ui.choose)}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
                            {selectedCategory.machines.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => handleBook(v)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 transition-all text-left group"
                                >
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Tractor className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{v.name} <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg ml-2">{v.capacity}</span></h4>
                                        <p className="text-sm font-medium text-green-600">{v.eta} away</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-xl">₹{v.price}</p>
                                        <p className="text-xs text-slate-400 font-bold">/hr</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 4: Payment Selection */}
            <AnimatePresence>
                {stage === 'payment' && selectedType && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800"
                    >
                        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <button onClick={() => setStage('select')} className="p-2 hover:bg-slate-100 rounded-full">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                            <div>
                                <h3 className="text-xl font-black">Payment Method</h3>
                                <p className="text-sm text-slate-500 font-bold">Select how to pay</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <button
                                onClick={() => handleBook(selectedType, 'cash')}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <div className="font-black text-lg">₹</div>
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-bold text-lg">Cash / UPI</h4>
                                    <p className="text-xs text-slate-500">Pay directly to provider</p>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-green-500 group-hover:bg-green-500 transition-colors"></div>
                            </button>

                            <button
                                onClick={() => handleBook(selectedType, 'credit')}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 hover:border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl"></div>
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-bold text-lg text-amber-700 dark:text-amber-400">Kisan Credit / Pay Later</h4>
                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                                        Pay within 6 Months (0% Interest).
                                        <br />
                                        <span className="text-[10px] text-red-500 font-bold">*After 6 months, 2% monthly interest applies.</span>
                                    </p>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-amber-300 group-hover:border-amber-500 group-hover:bg-amber-500 transition-colors"></div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 5: Finding Animation */}
            <AnimatePresence>
                {stage === 'finding' && (
                    <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center max-w-sm w-full mx-4"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20 delay-150"></div>
                                <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center relative z-10">
                                    <Navigation className="w-10 h-10 text-primary-600 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-center mb-2">{getVal(t_ui.finding)}</h3>
                            <p className="text-slate-400 text-center text-sm font-bold">Matching with nearest provider...</p>
                            {paymentMode === 'credit' && (
                                <div className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> Pay Later Applied
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 6: Arriving Provider Info */}
            <AnimatePresence>
                {stage === 'arriving' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-black">{getVal(t_ui.arriving)}</h3>
                                <p className="text-sm font-bold text-slate-400">{selectedType?.name} is on the way</p>
                            </div>
                            <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-black text-lg">
                                {selectedType?.eta}
                            </div>
                        </div>

                        {/* Provider Card */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-slate-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{driver?.name}</h4>
                                <p className="text-sm text-slate-500 font-bold">{driver?.vehicle} • {driver?.id}</p>
                                <div className="flex items-center gap-1 text-amber-500 mt-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{driver?.rating}</span>
                                </div>
                            </div>
                            <button className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                                <Phone className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStage('search')} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-600">Cancel</button>
                            <button onClick={handleComplete} className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold">End Job (Demo)</button>
                        </div>

                        {/* Help / Report Button */}
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setShowHelpModal(true)}
                                className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-full hover:bg-red-100 transition-colors"
                            >
                                <AlertTriangle className="w-4 h-4" /> Report Issue / Help
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelpModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <AlertTriangle className="text-red-500" />
                                    Report & Help
                                </h3>
                                <button onClick={() => setShowHelpModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-slate-500 font-bold mb-4">Select an issue to report to Admin:</p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleReport('extra_money')}
                                    className="w-full text-left p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 font-bold hover:bg-red-100 transition-colors"
                                >
                                    💰 Driver asking extra money
                                </button>
                                <button
                                    onClick={() => handleReport('rude')}
                                    className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-bold hover:bg-slate-100 transition-colors"
                                >
                                    😡 Rude behavior / Unsafe
                                </button>
                                <button
                                    onClick={() => handleReport('late')}
                                    className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-bold hover:bg-slate-100 transition-colors"
                                >
                                    ⏰ Driver is late / Not responding
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Emergency Support</p>
                                <a href="tel:1800-180-1551" className="flex items-center gap-3 p-4 bg-green-500 text-white rounded-2xl font-black hover:bg-green-600 transition-colors">
                                    <Phone className="w-6 h-6" />
                                    <div>
                                        <p className="text-xs opacity-90">Kisan Toll Free</p>
                                        <p className="text-lg">1800-180-1551</p>
                                    </div>
                                </a>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 7: Receipt Modal */}
            <AnimatePresence>
                {stage === 'completed' && (
                    <motion.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="bg-green-500 p-8 flex flex-col items-center text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black">{getVal(t_ui.complete)}</h3>
                                <p className="font-medium opacity-90">{paymentMode === 'credit' ? 'Payment Scheduled (Pay Later)' : 'Total Paid'}</p>
                                <h2 className="text-4xl font-black mt-2">₹{selectedType?.price}</h2>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-4">
                                        <span className="text-slate-500 font-bold">Booking ID</span>
                                        <span className="font-black">#83749</span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-4">
                                        <span className="text-slate-500 font-bold">Service</span>
                                        <span className="font-black">{selectedCategory?.title[lang] || 'Service'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-4">
                                        <span className="text-slate-500 font-bold">Payment</span>
                                        <span className="font-black text-amber-600">{paymentMode === 'credit' ? 'Kisan Credit' : 'Cash/UPI'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-bold">Duration</span>
                                        <span className="font-black">1 hr (Est.)</span>
                                    </div>

                                    {/* Rating Section */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Rate Service</p>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => toast.success(`Rated ${star} Stars! Thank you.`)}
                                                    className="p-1 hover:scale-125 transition-transform"
                                                >
                                                    <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={downloadReceipt}
                                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <Download className="w-5 h-5" />
                                    {getVal(t_ui.download)}
                                </button>
                                <button
                                    onClick={() => setStage('search')}
                                    className="w-full py-4 mt-2 text-slate-400 font-bold hover:text-black dark:hover:text-white transition-colors"
                                >
                                    Book New Service
                                </button>
                                <button
                                    onClick={() => setShowHelpModal(true)}
                                    className="w-full py-2 text-red-400 font-bold text-xs hover:text-red-500 transition-colors"
                                >
                                    Report Issue
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default TractorBooking;
