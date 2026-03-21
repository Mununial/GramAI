
code = r"""import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tractor, MapPin, Star, CheckCircle2, X, Navigation,
    Settings, ShieldCheck, ArrowRight, Phone,
    FileText, Download, User, Sprout, Truck, Scissors, AlertTriangle,
    MessageSquare, Loader2, Zap, Timer, Signal, Users, ChevronRight,
    PhoneOff, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GpsMap from '../components/common/GpsMap';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

/* ─── Static Demo Data ─────────────────────────────────── */
const DRIVER = {
    name: { en: 'Raju Bhai', or: 'ରାଜୁ ଭାଇ' },
    vehicle: { en: 'Mahindra 575 DI', or: 'ମହିନ୍ଦ୍ରା ୫୭୫ DI' },
    experience: { en: '8 years', or: '୮ ବର୍ଷ' },
    rating: 4.8, reviews: 214, phone: '6370998587',
    distance: { en: '2.3 km', or: '୨.୩ କିମି' },
    id: 'OD-RJ-0471', avatar: 'RB'
};

const ALL_MACHINES = [
    { id: 'rotavator', name: { en: 'Rotavator (7ft)', or: 'ରୋଟାଭେଟର' }, price: 800, eta: { en: '10 min', or: '୧୦ ମିନିଟ୍' }, hp: '45HP', rating: 4.7, reviews: 128, badge: { en: 'Most Booked', or: 'ସର୍ବାଧିକ ବୁକିଂ' }, bc: 'green', desc: { en: 'Best for Paddy field preparation', or: 'ଧାନ ଜମି ପାଇଁ ସବୁଠୁ ଭଲ' } },
    { id: 'cultivator', name: { en: 'Cultivator (9 Tyres)', or: 'କଲ୍ଟିଭେଟର' }, price: 600, eta: { en: '15 min', or: '୧୫ ମିନିଟ୍' }, hp: '35HP', rating: 4.5, reviews: 92, badge: { en: 'Budget Pick', or: 'ଶସ୍ତା' }, bc: 'blue', desc: { en: 'Ideal for dry soil loosening', or: 'ଖରାଟିଆ ଚାଷ ପାଇଁ ଉପଯୁକ୍ତ' } },
    { id: 'plough', name: { en: 'MB Plough', or: 'ହଳ ଲଙ୍ଗଳ' }, price: 900, eta: { en: '20 min', or: '୨୦ ମିନିଟ୍' }, hp: '50HP', rating: 4.6, reviews: 110, badge: { en: 'Heavy Duty', or: 'ଭାରୀ ଚାଷ' }, bc: 'orange', desc: { en: 'Deep tilling for tough fields', or: 'ଟାଣ ମାଟି ପାଇଁ ଗଭୀର ଚାଷ' } },
    { id: 'leveller', name: { en: 'Laser Leveller', or: 'ଲେଜର ଲେଭେଲର' }, price: 1200, eta: { en: '1 day', or: '୧ ଦିନ' }, hp: '55HP', rating: 4.8, reviews: 76, badge: { en: 'Premium', or: 'ପ୍ରିମିୟମ୍' }, bc: 'purple', desc: { en: 'Precision field levelling', or: 'ଜମିକୁ ସମାନ କରିବା ପାଇଁ' } }
];

const CATEGORIES = [
    { id: 'prep', label: { en: 'Land Prep', or: 'ଜମି ପ୍ରସ୍ତୁତି' }, Icon: Tractor, color: 'green', machines: ALL_MACHINES },
    { id: 'sowing', label: { en: 'Sowing', or: 'ବୁଣାବୁଣି' }, Icon: Sprout, color: 'emerald', machines: [
        { id: 'seed_drill', name: { en: 'Auto Seed Drill', or: 'ଅଟୋ ସିଡ୍ ଡ୍ରିଲ୍' }, price: 1000, eta: { en: '30 min', or: '୩୦ ମିନିଟ୍' }, hp: '40HP', rating: 4.6, reviews: 85, badge: { en: 'Precision', or: 'ସଠିକ୍' }, bc: 'green', desc: { en: 'Uniform seed placement', or: 'ସମାନ ଭାବେ ବିହନ ବୁଣିବା' } }
    ]},
    { id: 'harvest', label: { en: 'Harvest', or: 'ଅମଳ' }, Icon: Scissors, color: 'amber', machines: [
        { id: 'combine', name: { en: 'Combine Harvester', or: 'ହାର୍ଭେଷ୍ଟର' }, price: 1800, eta: { en: '45 min', or: '୪୫ ମିନିଟ୍' }, hp: '75HP', rating: 4.9, reviews: 145, badge: { en: '#1 Choice', or: 'ନମ୍ବର ୧' }, bc: 'orange', desc: { en: 'Wheat & Paddy harvesting', or: 'ଧାନ ଓ ଗହମ ଅମଳ' } }
    ]}
];

const t_ui = {
    en: {
        rentTractor: 'Rent a Tractor', nearbyProviders: 'Nearby providers available', findMachinery: 'Find Machinery',
        useGPS: 'Use Current GPS', villagePlaceholder: 'Enter village name', plotPlaceholder: 'Plot number / Landmark',
        groupBooking: 'Small Land Group Booking (-20%)', groupHelp: 'Book with neighbors to save fuel costs',
        selectService: 'Select Service', chooseNearby: 'Choose nearby machinery', paymentMethod: 'Payment Method',
        cashUPI: 'Cash / UPI', kisanCredit: 'Kisan Credit / Pay Later', payLaterDesc: 'Pay after harvest (0% interest)',
        total: 'Total', finding: 'Finding Nearest Providers...', matching: 'Connecting with closest operator',
        arriving: 'Tractor is Arriving!', eta: 'ETA', dist: 'Distance', complete: 'Service Completed!',
        download: 'Download Receipt', bookNew: 'Book New Service', report: 'Report Issue',
        joining: 'Joining nearest tractor group...', groupActive: 'Group Active: 4 Neighbors Online',
        serviceStarted: 'Service Started', workProgress: 'Field Work Progress', minsLeft: 'min left',
        loc_fixed: '📍 GPS Tracking Active', callFeedbackTitle: 'Call Feedback', didPickUp: 'Did the provider pick up?',
        isComing: 'Is Raju Bhai coming?', driverStatus: 'Driver Status', coming: 'Yes, Coming',
        notPicking: 'Not Picking Up', busy: 'Busy / Out of reach', lateReply: 'Asked to wait longer',
        submit: 'Submit Feedback'
    },
    or: {
        rentTractor: 'ଟ୍ରାକ୍ଟର ଭଡା', nearbyProviders: 'ପାଖାପାଖି ପ୍ରଦାନକାରୀ ଉପଲବ୍ଧ', findMachinery: 'ମେସିନ୍ ଖୋଜନ୍ତୁ',
        useGPS: 'ପ୍ରକୃତ ନିକଟସ୍ଥ ସ୍ଥାନ (GPS)', villagePlaceholder: 'ଗ୍ରାମର ନାମ ଦିଅନ୍ତୁ', plotPlaceholder: 'ପ୍ଲଟ୍ ନମ୍ବର / ସ୍ଥାନ',
        groupBooking: 'ଜମି ସମଷ୍ଟି ବୁକିଂ (-୨୦%)', groupHelp: 'ପଡୋଶୀ ଚାଷୀଙ୍କ ସହ ମିଶି ବୁକ୍ କରନ୍ତୁ',
        selectService: 'ସେବା ଚୟନ', chooseNearby: 'ଭଲ ଯନ୍ତ୍ର ବାଛନ୍ତୁ', paymentMethod: 'ଟଙ୍କା ଦେବା ପଦ୍ଧତି',
        cashUPI: 'ନଗଦ / UPI', kisanCredit: 'କିଷାନ କ୍ରେଡ଼ିଟ୍ (ପରେ ଦିଅନ୍ତୁ)', payLaterDesc: 'ଫସଲ ଅମଳ ପରେ ଦିଅନ୍ତୁ (0% ସୁଧ)',
        total: 'ମୋଟ୍', finding: 'ନିକଟସ୍ଥ ମେସିନ୍ ଖୋଜା ଚାଲିଛି...', matching: 'ସବୁଠୁ ପାଖ ପ୍ରଦାନକାରୀଙ୍କ ସହ ଯୋଡୁଛି',
        arriving: 'ଟ୍ରାକ୍ଟର ଆସୁଛି!', eta: 'ସମୟ', dist: 'ଦୂରତା', complete: 'ସେବା ସମ୍ପୂର୍ଣ୍ଣ ହେଲା!',
        download: 'ବିଲ୍ ଡାଉନଲୋଡ୍', bookNew: 'ନୂଆ ବୁକିଂ', report: 'ରିପୋର୍ଟ',
        joining: 'ନିକଟସ୍ଥ ସମୂହ ବୁକିଂ ସହ ଯୋଡୁଛି...', groupActive: 'ସମୂହ ସକ୍ରିୟ: ୪ ପଡୋଶୀ ଚାଷୀ ଯୋଡି ହୋଇଛନ୍ତି',
        serviceStarted: 'ସେବା ଆରମ୍ଭ', workProgress: 'କାମର ପ୍ରଗତି', minsLeft: 'ମିନିଟ୍ ବାକି',
        loc_fixed: '📍 GPS ଟ୍ରାକିଂ ସକ୍ରିୟ', callFeedbackTitle: 'କଲ୍ ରିପୋର୍ଟ', didPickUp: 'ପ୍ରଦାନକାରୀ କଲ୍ ଉଠାଇଲେ କି?',
        isComing: 'ରାଜୁ ଭାଇ ଆସୁଛନ୍ତି କି?', driverStatus: 'ଡ୍ରାଇଭର ସ୍ଥିତି', coming: 'ହଁ, ଆସୁଛନ୍ତି',
        notPicking: 'ଉଠାଉ ନାହାଁନ୍ତି', busy: 'ବ୍ୟସ୍ତ / କଭରେଜ୍ ବାହାରେ', lateReply: 'ପରେ ଆସିବାକୁ କହିଲେ',
        submit: 'ରିପୋର୍ଟ ଦିଅନ୍ତୁ'
    }
};

const StarRow = ({ rating, size = 3 }) => (
    <span className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(s=>(
            <Star key={s} className={`w-${size} h-${size} ${s<=Math.round(rating)?'text-amber-400 fill-amber-400':'text-slate-200 dark:text-slate-700'}`}/>
        ))}
    </span>
);

const Badge = ({ text, bc='green' }) => {
    const map = { green:'bg-green-100 text-green-700', blue:'bg-blue-100 text-blue-700',
        orange:'bg-orange-100 text-orange-700', purple:'bg-purple-100 text-purple-700' };
    return <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${map[bc]||map.green}`}>{text}</span>;
};

const SlidePanel = ({ children, z='z-20' }) => (
    <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:25,stiffness:280}}
        className={`absolute bottom-0 left-0 right-0 md:left-auto md:right-4 md:bottom-4 md:w-[420px] md:rounded-[2.5rem] ${z} bg-white dark:bg-slate-900 rounded-t-[2rem] p-5 shadow-2xl border-t border-slate-100 dark:border-slate-800`}>
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"/>
        {children}
    </motion.div>
);

const TractorBooking = () => {
    const { lang } = useLanguage();
    const l = t_ui[lang] || t_ui['en'];
    const [stage, setStage] = useState('search');
    const [village, setVillage] = useState('');
    const [plotNo, setPlotNo] = useState('');
    const [location, setLocation] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [paymentMode, setPaymentMode] = useState('cash');
    const [workProgress, setWorkProgress] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [locating, setLocating] = useState(false);
    const [showCallFeedback, setShowCallFeedback] = useState(false);
    const [callOutcome, setCallOutcome] = useState(null);
    const progressRef = useRef(null);

    const getVal = (v) => v[lang] || v['en'] || v;

    useEffect(()=>{
        if(stage==='finding'){
            const t3=setTimeout(()=>{ setStage('arriving'); toast.success('🚜 ' + l.arriving); },4500);
            return ()=>clearTimeout(t3);
        }
    },[stage, l.arriving]);

    useEffect(()=>{
        if(stage==='inprogress'){
            setWorkProgress(0);
            progressRef.current=setInterval(()=>{
                setWorkProgress(p=>{ if(p>=100){ clearInterval(progressRef.current); return 100; } return p+1; });
            },180);
            return ()=>clearInterval(progressRef.current);
        }
    },[stage]);

    const handleSearch=(e)=>{ e.preventDefault(); if(!village.trim()){toast.warn(l.villagePlaceholder); return;} setLocation(village); setStage('category'); };
    
    const handleGPS = () => {
        setLocating(true);
        toast.info(lang === 'or' ? '📍 ପ୍ରକୃତ ସ୍ଥାନ ଖୋଜା ଚାଲିଛି...' : '📍 Fetching precise real-time location...');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        const addr = data.address;
                        const placeName = addr.village || addr.suburb || addr.town || addr.city || 'My Farm';
                        const distName = addr.state_district || addr.county || 'Bhubaneswar';
                        const fullLoc = `${placeName}, ${distName}`;
                        setVillage(placeName); setLocation(fullLoc); setLocating(false); setStage('category');
                        toast.success(`${l.loc_fixed}: ${fullLoc}`);
                    } catch (err) {
                        setVillage('Patia'); setLocation('Patia, Bhubaneswar'); setLocating(false); setStage('category');
                        toast.success('📍 Patia, Bhubaneswar');
                    }
                },
                (err) => {
                    setLocating(false); setVillage('Patia'); setLocation('Patia, Bhubaneswar'); setStage('category');
                    toast.error(lang === 'or' ? 'GPS ମିଳିଲା ନାହିଁ, ହାତରେ ଲେଖନ୍ତୁ' : 'GPS error. Using Demo Location: Patia');
                }
            );
        } else {
            setLocating(false); toast.error('GPS not supported');
        }
    };

    const handleCall = () => {
        toast.info(`Calling ${getVal(DRIVER.name)}...`);
        // Simulate a call timeout then show feedback
        setTimeout(() => setShowCallFeedback(true), 2500);
    };

    const submitFeedback = () => {
        if (!callOutcome) return;
        toast.success(lang === 'or' ? 'ଫିଡବ୍ୟାକ୍ ଗ୍ରହଣ କରାଗଲା' : 'Feedback recorded. Admin notified.');
        setShowCallFeedback(false);
    };

    const handleCatSelect=(cat)=>{ setSelectedCat(cat); setStage('select'); };
    const handleBook=(machine)=>{ setSelectedMachine(machine); setStage('payment'); };
    const handlePay=(mode)=>{ setPaymentMode(mode); setStage('finding'); };
    const resetAll=()=>{ setStage('search'); setVillage(''); setPlotNo(''); setLocation(''); setSelectedCat(null); setSelectedMachine(null); setWorkProgress(0); setUserRating(0); setIsGroup(false); setShowCallFeedback(false); setCallOutcome(null); };

    const price = selectedMachine ? (isGroup ? Math.round(selectedMachine.price * 0.8) : selectedMachine.price) : 0;

    return (
        <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden flex flex-col font-sans">
            <div className="absolute inset-0 z-0">
                <GpsMap activeTrack={['arriving','inprogress'].includes(stage)?{pos:50,owner:getVal(DRIVER.name)}:null}
                    className="h-full w-full rounded-none border-none shadow-none z-0"/>
            </div>

            <AnimatePresence>
            {stage==='search' && (
                <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-40,opacity:0}}
                    className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/20 to-transparent flex justify-center">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"><Tractor className="w-5 h-5 text-white"/></div>
                            <div><h2 className="text-lg font-black">{l.rentTractor}</h2><p className="text-[10px] text-slate-500 font-bold">{l.nearbyProviders}</p></div>
                            <div className="ml-auto flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full"><Signal className="w-3 h-3 text-green-600 animate-pulse"/><span className="text-[9px] font-black text-green-700 dark:text-green-400">Stable</span></div>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-3 border border-transparent focus-within:border-green-400">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0"/><input value={village} onChange={e=>setVillage(e.target.value)} placeholder={l.villagePlaceholder} className="bg-transparent outline-none flex-1 font-bold text-xs"/>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-3 border border-transparent focus-within:border-green-400">
                                    <FileText className="w-4 h-4 text-slate-400 shrink-0"/><input value={plotNo} onChange={e=>setPlotNo(e.target.value)} placeholder={l.plotPlaceholder} className="bg-transparent outline-none flex-1 font-bold text-xs"/>
                                </div>
                            </div>
                            <button type="button" onClick={()=>setIsGroup(!isGroup)}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${isGroup?'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800':'bg-slate-50 border-transparent dark:bg-slate-800'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isGroup?'bg-green-500 text-white':'bg-slate-200 text-slate-400 dark:bg-slate-700'}`}><Users className="w-4 h-4"/></div>
                                <div className="text-left flex-1"><p className="text-xs font-black">{l.groupBooking}</p><p className="text-[9px] text-slate-500">{l.groupHelp}</p></div>
                                <div className={`w-9 h-5 rounded-full p-1 transition-colors ${isGroup?'bg-green-500':'bg-slate-300 dark:bg-slate-600'}`}><div className={`w-3 h-3 bg-white rounded-full transition-all ${isGroup?'translate-x-4':'translate-x-0'}`}/></div>
                            </button>
                            <div className="flex gap-2">
                                <button type="button" onClick={handleGPS} disabled={locating} className="flex-1 py-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                                    {locating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Navigation className="w-3 h-3"/>} {l.useGPS}
                                </button>
                                <button type="submit" className="flex-[1.5] py-3 bg-green-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-100 dark:shadow-green-900/20">{l.findMachinery} <ArrowRight className="w-3 h-3"/></button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <AnimatePresence>
            {(stage==='category' || stage==='select' || stage==='payment') && (
                <div className="absolute top-4 left-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300 truncate max-w-[150px]">{l.loc_fixed}: {location || 'Farm'}</p>
                </div>
            )}

            {stage==='category' && (
                <SlidePanel><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-black">{l.selectService}</h3><button onClick={()=>setStage('search')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X className="w-4 h-4"/></button></div>
                    {isGroup && <div className="bg-green-500 text-white p-3 rounded-2xl mb-4 flex items-center gap-3 shadow-lg"><Users className="w-5 h-5"/><p className="text-xs font-black">{l.groupActive}</p></div>}
                    <div className="grid grid-cols-3 gap-2">{CATEGORIES.map(cat=>(<button key={cat.id} onClick={()=>handleCatSelect(cat)} className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:border-green-400 border border-transparent transition-all group "><div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center mb-2 shadow-sm group-hover:scale-110"><cat.Icon className="w-5 h-5 text-green-600"/></div><h4 className="font-bold text-[10px] text-center">{getVal(cat.label)}</h4></button>))}</div></SlidePanel>
            )}

            {stage==='select' && selectedCat && (
                <SlidePanel><div className="flex items-center gap-3 mb-4"><button onClick={()=>setStage('category')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ArrowRight className="w-4 h-4 rotate-180"/></button><h3 className="text-lg font-black">{getVal(selectedCat.label)}</h3></div><div className="space-y-2 max-h-[60vh] overflow-y-auto pb-4">{selectedCat.machines.map(m=>(<button key={m.id} onClick={()=>handleBook(m)} className="w-full flex items-center gap-3 p-3 rounded-2xl border hover:border-green-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"><div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl shrink-0">🚜</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5 overflow-hidden"><h4 className="font-black text-xs truncate">{getVal(m.name)}</h4><Badge text={getVal(m.badge)} bc={m.bc}/></div><p className="text-[10px] text-slate-500 truncate">{getVal(m.desc)}</p><div className="flex items-center justify-between mt-1"><div className="flex items-center gap-2"><StarRow rating={m.rating} size={2.5}/><span className="text-[9px] font-bold text-slate-400">{getVal(m.eta)}</span></div><div className="text-right"><p className="font-black text-sm text-green-600">₹{isGroup?Math.round(m.price*0.8):m.price}<span className="text-[8px] text-slate-400">/hr</span></p></div></div></div></button>))}</div></SlidePanel>
            )}

            {stage==='payment' && selectedMachine && (
                <SlidePanel><h3 className="text-lg font-black mb-4">{l.paymentMethod}</h3><div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-4 border border-dashed border-slate-300"><div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-slate-500">Service Fee</span><span className="text-xs font-black">₹{price}</span></div><div className="flex justify-between items-center"><span className="text-xs font-black">{l.total}</span><span className="text-xl font-black text-green-600">₹{price}</span></div></div><div className="space-y-2"><button onClick={()=>handlePay('cash')} className="w-full flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border hover:border-green-500 transition-all"><div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 font-black">₹</div><div className="text-left"><p className="text-xs font-black">{l.cashUPI}</p><p className="text-[9px] text-slate-500">Pay directly after service</p></div></button><button onClick={()=>handlePay('credit')} className="w-full flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border hover:border-amber-500 transition-all"><div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-amber-600"/></div><div className="text-left"><p className="text-xs font-black">{l.kisanCredit}</p><p className="text-[9px] text-slate-500">{l.payLaterDesc}</p></div></button></div></SlidePanel>
            )}

            {stage==='finding' && (
                <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"><motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] w-full max-w-sm text-center"><div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">🚜</div><h3 className="text-lg font-black mb-1">{isGroup?l.joining:l.finding}</h3><p className="text-slate-400 text-xs font-bold mb-6">{l.matching}</p><div className="w-10 h-1.5 bg-green-500 rounded-full mx-auto animate-bounce"/></motion.div></div>
            )}

            {stage==='arriving' && (
                <SlidePanel>
                    <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-black text-green-600">{l.arriving}</h3><div className="text-right bg-black text-white px-3 py-1 rounded-xl"><p className="text-[9px] opacity-60 uppercase">{l.eta}</p><p className="font-black text-sm">{getVal(selectedMachine.eta)}</p></div></div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{DRIVER.avatar}</div>
                        <div className="flex-1 min-w-0"><h4 className="font-black text-xs">{getVal(DRIVER.name)}</h4><p className="text-[9px] text-slate-500 truncate">{getVal(DRIVER.vehicle)} • {getVal(DRIVER.distance)}</p></div>
                        <button onClick={handleCall} className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"><Phone className="w-4 h-4 text-white"/></button>
                    </div>
                    <button onClick={()=>setStage('inprogress')} className="w-full py-3.5 bg-green-500 text-white rounded-2xl font-black text-sm shadow-xl">Start Work →</button>
                    
                    {/* Call Feedback Modal Layer */}
                    <AnimatePresence>
                        {showCallFeedback && (
                            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}}
                                className="absolute inset-0 z-50 bg-white dark:bg-slate-900 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4"><Phone className="w-8 h-8 text-blue-500"/></div>
                                <h3 className="text-xl font-black mb-1">{l.callFeedbackTitle}</h3>
                                <p className="text-slate-500 text-xs font-bold mb-6">{l.isComing}</p>
                                
                                <div className="w-full space-y-2 mb-6 text-left">
                                    {[
                                        {id:'coming', label: l.coming, icon: ThumbsUp, color: 'text-green-500', bg:'bg-green-50 dark:bg-green-900/20'},
                                        {id:'busy', label: l.busy, icon: PhoneOff, color: 'text-red-500', bg:'bg-red-50 dark:bg-red-900/20'},
                                        {id:'wait', label: l.lateReply, icon: Timer, color: 'text-amber-500', bg:'bg-amber-50 dark:bg-amber-900/20'}
                                    ].map(opt=>(
                                        <button key={opt.id} onClick={()=>setCallOutcome(opt.id)}
                                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${callOutcome===opt.id?'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md':'border-transparent bg-slate-50 dark:bg-slate-800'}`}>
                                            <opt.icon className={`w-5 h-5 ${opt.color}`}/>
                                            <span className="text-xs font-black">{opt.label}</span>
                                            {callOutcome===opt.id && <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto"/>}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="flex gap-2 w-full">
                                    <button onClick={()=>setShowCallFeedback(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl font-bold text-xs">Skip</button>
                                    <button onClick={submitFeedback} disabled={!callOutcome} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black text-xs disabled:opacity-50">{l.submit}</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </SlidePanel>
            )}

            {stage==='inprogress' && (
                <SlidePanel><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-black text-orange-500">{l.serviceStarted}</h3><Timer className="w-5 h-5 text-orange-500 animate-spin"/></div><div className="mb-5"><div className="flex justify-between mb-2"><span className="text-[10px] font-black">{l.workProgress}: {workProgress}%</span><span className="text-[10px] font-bold text-orange-500">~20 {l.minsLeft}</span></div><div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><motion.div className="h-full bg-green-500" animate={{width:`${workProgress}%`}}/></div></div><button onClick={()=>setStage('completed')} className="w-full py-3.5 bg-green-500 text-white rounded-2xl font-black text-sm">Finish Service</button></SlidePanel>
            )}

            {stage==='completed' && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"><motion.div initial={{scale:0.95}} animate={{scale:1}} className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden"><div className="bg-green-500 p-6 flex flex-col items-center text-white"><CheckCircle2 className="w-12 h-12 mb-2"/><h3 className="text-xl font-black">{l.complete}</h3><p className="text-3xl font-black mt-2">₹{price}</p></div><div className="p-5 flex flex-col gap-2"><button onClick={resetAll} className="w-full py-3 bg-green-500 text-white rounded-2xl font-black text-xs shadow-lg">{l.bookNew}</button><button onClick={()=>toast.success('Downloaded!')} className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-xs">{l.download}</button></div></motion.div></div>
            )}
            </AnimatePresence>
        </div>
    );
};
export default TractorBooking;
"""

with open('src/pages/TractorBooking.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
