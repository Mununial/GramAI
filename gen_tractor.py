
code = r"""import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tractor, MapPin, Star, CheckCircle2, X, Navigation,
    Settings, ShieldCheck, ArrowRight, Phone,
    FileText, Download, User, Sprout, Truck, Scissors, AlertTriangle,
    MessageSquare, Loader2, Zap, Timer, Signal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GpsMap from '../components/common/GpsMap';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

/* ─── Static Demo Data ─────────────────────────────────── */
const DRIVER = {
    name: 'Raju Bhai', vehicle: 'Mahindra 575 DI', experience: '8 years',
    rating: 4.8, reviews: 214, phone: '6370998587',
    distance: '2.3 km', id: 'OD-RJ-0471', avatar: 'RB'
};

const ALL_MACHINES = [
    { id: 'rotavator', name: 'Rotavator (7ft)', price: 800, eta: '10 min', hp: '45HP', rating: 4.7, reviews: 128, badge: 'Most Booked', bc: 'green', desc: 'Best for Paddy field preparation' },
    { id: 'cultivator', name: 'Cultivator (9 Tyres)', price: 600, eta: '15 min', hp: '35HP', rating: 4.5, reviews: 92, badge: 'Budget Pick', bc: 'blue', desc: 'Ideal for dry soil loosening' },
    { id: 'plough', name: 'MB Plough', price: 900, eta: '20 min', hp: '50HP', rating: 4.6, reviews: 110, badge: 'Heavy Duty', bc: 'orange', desc: 'Deep tilling for tough fields' },
    { id: 'leveller', name: 'Laser Leveller', price: 1200, eta: '1 day', hp: '55HP', rating: 4.8, reviews: 76, badge: 'Premium', bc: 'purple', desc: 'Precision field levelling system' }
];

const CATEGORIES = [
    { id: 'prep', label: 'Land Preparation', Icon: Tractor, color: 'green',
      machines: ALL_MACHINES },
    { id: 'sowing', label: 'Sowing & Planting', Icon: Sprout, color: 'emerald',
      machines: [
        { id: 'seed_drill', name: 'Auto Seed Drill', price: 1000, eta: '30 min', hp: '40HP', rating: 4.6, reviews: 85, badge: 'Precision', bc: 'green', desc: 'Uniform seed placement' },
        { id: 'transplanter', name: 'Paddy Transplanter', price: 2000, eta: '2 hrs', hp: '52HP', rating: 4.7, reviews: 63, badge: 'Top Rated', bc: 'purple', desc: 'Row transplanting for paddy' }
      ]},
    { id: 'harvest', label: 'Harvesting', Icon: Scissors, color: 'amber',
      machines: [
        { id: 'combine', name: 'Combine Harvester', price: 1800, eta: '45 min', hp: '75HP', rating: 4.9, reviews: 145, badge: '#1 Choice', bc: 'orange', desc: 'Wheat & Paddy harvesting' },
        { id: 'reaper', name: 'Reaper Binder', price: 800, eta: '30 min', hp: '30HP', rating: 4.4, reviews: 55, badge: 'Budget', bc: 'blue', desc: 'Straw binding included' }
      ]},
    { id: 'transport', label: 'Haulage & Transport', Icon: Truck, color: 'slate',
      machines: [
        { id: 'trolley', name: 'Hydraulic Trolley', price: 500, eta: '10 min', hp: '45HP', rating: 4.5, reviews: 78, badge: 'Fast', bc: 'green', desc: '10-ton load capacity' }
      ]},
    { id: 'spray', label: 'Spraying', Icon: Settings, color: 'sky',
      machines: [
        { id: 'boom', name: 'Boom Sprayer', price: 600, eta: '20 min', hp: '35HP', rating: 4.6, reviews: 91, badge: 'Eco', bc: 'green', desc: '500L tank capacity' },
        { id: 'drone', name: 'Agri-Drone', price: 1500, eta: '1 day', hp: 'Electric', rating: 4.8, reviews: 44, badge: 'New Tech', bc: 'purple', desc: 'AI-powered crop spraying' }
      ]}
];

/* ─── Sub-components ───────────────────────────────────── */
const StarRow = ({ rating, size = 3 }) => (
    <span className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(s=>(
            <Star key={s} className={`w-${size} h-${size} ${s<=Math.round(rating)?'text-amber-400 fill-amber-400':'text-slate-300 dark:text-slate-600'}`}/>
        ))}
    </span>
);

const Badge = ({ text, bc='green' }) => {
    const map = { green:'bg-green-100 text-green-700', blue:'bg-blue-100 text-blue-700',
        orange:'bg-orange-100 text-orange-700', purple:'bg-purple-100 text-purple-700' };
    return <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${map[bc]||map.green}`}>{text}</span>;
};

const SlidePanel = ({ children, z='z-20' }) => (
    <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:28,stiffness:300}}
        className={`absolute bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6 md:w-[460px] md:rounded-[2.5rem] ${z} bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 dark:border-slate-800`}>
        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5"/>
        {children}
    </motion.div>
);

const DriverCard = () => (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0">
            {DRIVER.avatar}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-black text-base">{DRIVER.name}</h4>
                <ShieldCheck className="w-4 h-4 text-green-500"/>
            </div>
            <p className="text-xs text-slate-500 font-bold truncate">{DRIVER.vehicle} • {DRIVER.experience} exp.</p>
            <div className="flex items-center gap-2 mt-1">
                <StarRow rating={DRIVER.rating} size={3}/>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{DRIVER.rating} ({DRIVER.reviews})</span>
                <span className="text-xs text-slate-400">• {DRIVER.distance}</span>
            </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
            <a href={`tel:${DRIVER.phone}`}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                onClick={()=>toast.success(`Calling ${DRIVER.name}...`)}>
                <Phone className="w-4 h-4 text-white"/>
            </a>
            <button onClick={()=>toast.info('Opening chat...')}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <MessageSquare className="w-4 h-4 text-white"/>
            </button>
        </div>
    </div>
);

/* ─── Main Component ───────────────────────────────────── */
const TractorBooking = () => {
    const { lang } = useLanguage();
    const [stage, setStage] = useState('search');
    const [village, setVillage] = useState('');
    const [plotNo, setPlotNo] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [paymentMode, setPaymentMode] = useState('cash');
    const [showHelp, setShowHelp] = useState(false);
    const [workProgress, setWorkProgress] = useState(0);
    const [findingStep, setFindingStep] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const progressRef = useRef(null);
    const BOOKING_ID = '#83749';

    /* Finding animation steps */
    useEffect(()=>{
        if(stage==='finding'){
            setFindingStep(0);
            const t1=setTimeout(()=>setFindingStep(1),1800);
            const t2=setTimeout(()=>setFindingStep(2),3500);
            const t3=setTimeout(()=>{ setStage('arriving'); toast.success('🚜 Machinery Found! Provider is on the way.'); },5200);
            return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
        }
    },[stage]);

    /* Work-in-progress bar */
    useEffect(()=>{
        if(stage==='inprogress'){
            setWorkProgress(0);
            progressRef.current=setInterval(()=>{
                setWorkProgress(p=>{ if(p>=100){ clearInterval(progressRef.current); return 100; } return p+1; });
            },300);
            return ()=>clearInterval(progressRef.current);
        }
    },[stage]);

    const handleSearch=(e)=>{ e.preventDefault(); const loc=village||''; if(!loc.trim()){toast.warn('Enter village name or use GPS'); return;} setLocation(loc); setStage('category'); };
    const handleGPS=()=>{ toast.info('📍 Detecting location...'); setTimeout(()=>{ setVillage('Patia'); setLocation('Patia, Bhubaneswar'); setStage('category'); toast.success('📍 Patia, Bhubaneswar detected!'); },1500); };
    const handleCatSelect=(cat)=>{ setSelectedCat(cat); setStage('select'); };
    const handleBook=(machine)=>{ setSelectedMachine(machine); setStage('payment'); };
    const handlePay=(mode)=>{ setPaymentMode(mode); setStage('finding'); };
    const resetAll=()=>{ setStage('search'); setVillage(''); setPlotNo(''); setLocation(''); setSelectedCat(null); setSelectedMachine(null); setWorkProgress(0); setUserRating(0); };
    const remainingMins=Math.max(0,Math.ceil(30*(1-workProgress/100)));

    const downloadReceipt=()=>{
        try{
            const doc=new jsPDF();
            doc.setFontSize(20); doc.text('GramAI - Farm Service Receipt',20,20);
            doc.setFontSize(12); doc.text('Booking ID: '+BOOKING_ID,20,40);
            doc.text('Date: '+new Date().toLocaleDateString(),20,50);
            doc.text('Location: '+location+', Bhubaneswar',20,60);
            doc.line(20,68,190,68);
            doc.text('Service: '+(selectedCat?.label||'Land Preparation'),20,78);
            doc.text('Machine: '+(selectedMachine?.name||''),20,88);
            doc.text('Driver: '+DRIVER.name+' | '+DRIVER.vehicle,20,98);
            doc.text('Rate: Rs. '+(selectedMachine?.price||0)+'/hr',20,108);
            doc.text('Field Size: 1.5 Acre | Duration: 1 hour',20,118);
            doc.line(20,126,190,126);
            doc.setFontSize(16); doc.text('Total Paid: Rs. '+(selectedMachine?.price||0),130,145);
            doc.setFontSize(9); doc.text('Powered by GramAI Smart Village Hub',20,280);
            doc.save('gramai-receipt.pdf'); toast.success('Receipt Downloaded!');
        }catch(err){ toast.error('Download failed'); }
    };

    const handleReport=(issue)=>{
        toast.info('Processing...',{autoClose:1000});
        setTimeout(()=>{
            if(issue==='extra_money') toast.error('🚨 Admin Notified! Driver flagged for investigation.',{autoClose:5000});
            else toast.success('Support ticket raised. We will call you shortly.');
            setShowHelp(false);
        },1500);
    };

    return (
        <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden">
            {/* MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <GpsMap activeTrack={['arriving','inprogress'].includes(stage)?{pos:50,owner:DRIVER.name}:null}
                    className="h-full w-full rounded-none border-none shadow-none z-0"/>
            </div>

            {/* ── STAGE: search ─────────────────────────────── */}
            <AnimatePresence>
            {stage==='search' && (
                <motion.div initial={{y:120,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-80,opacity:0}}
                    className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/40 to-transparent flex justify-center">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Tractor className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <h2 className="text-xl font-black">Rent a Tractor</h2>
                                <p className="text-xs text-slate-500 font-bold">4 providers available near you</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                <Signal className="w-3 h-3 text-green-600 animate-pulse"/>
                                <span className="text-xs font-black text-green-700 dark:text-green-400">Live</span>
                            </div>
                        </div>
                        <form onSubmit={handleSearch} className="space-y-3">
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-3 border border-transparent focus-within:border-green-400 transition-colors">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0"/>
                                <input type="text" value={village} onChange={e=>setVillage(e.target.value)}
                                    placeholder="Enter village name (e.g. Patia)"
                                    className="bg-transparent outline-none flex-1 font-bold text-sm placeholder:text-slate-400"/>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-3 border border-transparent focus-within:border-green-400 transition-colors">
                                <FileText className="w-4 h-4 text-slate-400 shrink-0"/>
                                <input type="text" value={plotNo} onChange={e=>setPlotNo(e.target.value)}
                                    placeholder="Plot number (optional)"
                                    className="bg-transparent outline-none flex-1 font-bold text-sm placeholder:text-slate-400"/>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={handleGPS}
                                    className="flex-1 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                                    <Navigation className="w-4 h-4"/> Use GPS
                                </button>
                                <button type="submit"
                                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-200 dark:shadow-green-900/30">
                                    Find Machinery <ArrowRight className="w-4 h-4"/>
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500 shrink-0"/>
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Demo tip: Tap "Use GPS" to auto-fill Patia, Bhubaneswar</p>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ── STAGE: category ───────────────────────────── */}
            <AnimatePresence>
            {stage==='category' && (
                <SlidePanel z="z-20">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-black">Select Service</h3>
                            <p className="text-xs text-slate-500 font-bold">📍 {location}, Bhubaneswar • Field: 1.5 Acre</p>
                        </div>
                        <button onClick={()=>setStage('search')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5"/></button>
                    </div>
                    {/* Farm details pill */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
                        {[{label:'Village',val:'Patia'},{label:'District',val:'Bhubaneswar'},{label:'Field',val:'1.5 Acre'},{label:'Est. Time',val:'1 hr'}].map(i=>(
                            <div key={i.label} className="shrink-0 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-center">
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{i.label}</p>
                                <p className="text-xs font-black">{i.val}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pb-4">
                        {CATEGORIES.map(cat=>(
                            <button key={cat.id} onClick={()=>handleCatSelect(cat)}
                                className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-transparent hover:border-green-400 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <cat.Icon className="w-7 h-7 text-green-600 dark:text-green-400"/>
                                </div>
                                <h4 className="font-bold text-xs text-center">{cat.label}</h4>
                                <p className="text-[10px] text-slate-400 mt-1">{cat.machines.length} machines</p>
                            </button>
                        ))}
                    </div>
                </SlidePanel>
            )}
            </AnimatePresence>

            {/* ── STAGE: select ─────────────────────────────── */}
            <AnimatePresence>
            {stage==='select' && selectedCat && (
                <SlidePanel z="z-30">
                    <div className="flex items-center gap-3 mb-5">
                        <button onClick={()=>setStage('category')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            <ArrowRight className="w-5 h-5 rotate-180"/>
                        </button>
                        <div>
                            <h3 className="text-xl font-black">{selectedCat.label}</h3>
                            <p className="text-xs text-slate-500 font-bold">Choose nearby machinery</p>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-[65vh] overflow-y-auto pb-4">
                        {selectedCat.machines.map((m,i)=>(
                            <motion.button key={m.id} initial={{x:40,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.08}}
                                onClick={()=>handleBook(m)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-green-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shrink-0">
                                    🚜
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h4 className="font-black text-sm">{m.name}</h4>
                                        <Badge text={m.badge} bc={m.bc}/>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1 truncate">{m.desc}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <StarRow rating={m.rating} size={3}/>
                                            <span className="text-[10px] font-bold text-slate-500">{m.rating} ({m.reviews})</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{m.hp}</span>
                                    </div>
                                    <p className="text-xs font-bold text-green-600 mt-1">⏱ {m.eta} away</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-xl text-slate-900 dark:text-white">₹{m.price}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">/hr</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </SlidePanel>
            )}
            </AnimatePresence>

            {/* ── STAGE: payment ────────────────────────────── */}
            <AnimatePresence>
            {stage==='payment' && selectedMachine && (
                <SlidePanel z="z-40">
                    <div className="flex items-center gap-3 mb-5">
                        <button onClick={()=>setStage('select')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            <ArrowRight className="w-5 h-5 rotate-180"/>
                        </button>
                        <div>
                            <h3 className="text-xl font-black">Payment Method</h3>
                            <p className="text-xs text-slate-500 font-bold">Confirm booking for {selectedMachine.name}</p>
                        </div>
                    </div>
                    {/* Summary card */}
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 mb-5 border border-green-100 dark:border-green-900/30">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Machine</span>
                            <span className="text-sm font-black">{selectedMachine.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Est. Work Time</span>
                            <span className="text-sm font-black">1 hour</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-green-200 dark:border-green-900/50 pt-2 mt-2">
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Estimated Cost</span>
                            <span className="text-xl font-black text-green-600">₹{selectedMachine.price}</span>
                        </div>
                    </div>
                    <div className="space-y-3 mb-2">
                        <button onClick={()=>handlePay('cash')}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-black text-xl shrink-0">₹</div>
                            <div className="flex-1 text-left">
                                <h4 className="font-black">Cash / UPI</h4>
                                <p className="text-xs text-slate-500">Pay directly to provider after service</p>
                            </div>
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-green-500 group-hover:bg-green-500 transition-colors shrink-0"/>
                        </button>
                        <button onClick={()=>handlePay('credit')}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-amber-200 dark:border-amber-800/40 hover:border-amber-400 bg-amber-50 dark:bg-amber-900/10 transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl"/>
                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400"/>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-black text-amber-700 dark:text-amber-300">Kisan Credit / Pay Later</h4>
                                <p className="text-xs text-amber-600/80 dark:text-amber-400/70">Pay within 6 months — 0% interest</p>
                                <p className="text-[10px] text-red-500 font-bold mt-0.5">*After 6 months: 2% monthly interest applies</p>
                            </div>
                            <div className="w-5 h-5 rounded-full border-2 border-amber-300 group-hover:border-amber-500 group-hover:bg-amber-500 transition-colors shrink-0"/>
                        </button>
                    </div>
                </SlidePanel>
            )}
            </AnimatePresence>

            {/* ── STAGE: finding ────────────────────────────── */}
            <AnimatePresence>
            {stage==='finding' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
                    <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center w-full max-w-sm text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"/>
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-10 animation-delay-300"/>
                            <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-4xl relative z-10">🚜</div>
                        </div>
                        <h3 className="text-xl font-black mb-1">Finding Nearby Providers...</h3>
                        <p className="text-slate-400 text-sm font-bold mb-6">Matching with closest tractor operator</p>
                        <div className="w-full space-y-2">
                            {[
                                {label:'Scanning 4 providers near Patia', done: findingStep>=0},
                                {label:'Matching with closest operator...', done: findingStep>=1},
                                {label:'Confirming with Raju Bhai...', done: findingStep>=2}
                            ].map((step,i)=>(
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${step.done?'bg-green-50 dark:bg-green-900/20':'bg-slate-50 dark:bg-slate-800'}`}>
                                    {step.done
                                        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/>
                                        : <Loader2 className={`w-4 h-4 text-slate-400 shrink-0 ${i===findingStep?'animate-spin':''}`}/>
                                    }
                                    <span className={`text-xs font-bold ${step.done?'text-green-700 dark:text-green-300':'text-slate-500'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                        {paymentMode==='credit' && (
                            <div className="mt-4 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-black flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3"/> Kisan Credit Applied
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ── STAGE: arriving ───────────────────────────── */}
            <AnimatePresence>
            {stage==='arriving' && (
                <SlidePanel z="z-40">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                                <h3 className="text-xl font-black text-green-600 dark:text-green-400">Provider Arriving!</h3>
                            </div>
                            <p className="text-xs text-slate-500 font-bold">{selectedMachine?.name} is on the way</p>
                        </div>
                        <div className="text-right bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-2xl">
                            <p className="text-xs font-bold opacity-60">ETA</p>
                            <p className="font-black text-lg">{selectedMachine?.eta}</p>
                        </div>
                    </div>
                    {/* Live distance */}
                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 text-center">
                            <Timer className="w-4 h-4 text-blue-500 mx-auto mb-1"/>
                            <p className="text-xs font-bold text-blue-600">Arrival Time</p>
                            <p className="text-sm font-black">{selectedMachine?.eta}</p>
                        </div>
                        <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-2xl p-3 text-center">
                            <MapPin className="w-4 h-4 text-green-500 mx-auto mb-1"/>
                            <p className="text-xs font-bold text-green-600">Distance</p>
                            <p className="text-sm font-black">2.1 km</p>
                        </div>
                        <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 text-center">
                            <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 fill-amber-400"/>
                            <p className="text-xs font-bold text-amber-600">Rating</p>
                            <p className="text-sm font-black">{DRIVER.rating}</p>
                        </div>
                    </div>
                    <DriverCard/>
                    <div className="flex gap-3 mt-4">
                        <button onClick={()=>setStage('search')} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-500 text-sm hover:bg-slate-200 transition-colors">Cancel</button>
                        <button onClick={()=>setStage('inprogress')} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm transition-colors shadow-lg shadow-green-200 dark:shadow-green-900/30">
                            Tractor Arrived →
                        </button>
                    </div>
                    <div className="mt-3 flex justify-center">
                        <button onClick={()=>setShowHelp(true)}
                            className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-full hover:bg-red-100 transition-colors">
                            <AlertTriangle className="w-3 h-3"/> Report Issue / Help
                        </button>
                    </div>
                </SlidePanel>
            )}
            </AnimatePresence>

            {/* ── STAGE: inprogress ─────────────────────────── */}
            <AnimatePresence>
            {stage==='inprogress' && (
                <SlidePanel z="z-40">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/>
                                <h3 className="text-xl font-black">Service Started</h3>
                            </div>
                            <p className="text-xs text-slate-500 font-bold">Land Preparation in progress</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-2xl animate-pulse">🚜</div>
                    </div>
                    {/* Progress bar */}
                    <div className="mb-5">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-black text-slate-600 dark:text-slate-400">Work Completed: {workProgress}%</span>
                            <span className="text-xs font-bold text-orange-500">~{remainingMins} min left</span>
                        </div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                animate={{width:`${workProgress}%`}} transition={{duration:0.3}}/>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-slate-400">0%</span>
                            <span className="text-[10px] text-slate-400">100%</span>
                        </div>
                    </div>
                    <DriverCard/>
                    <div className="flex gap-3 mt-4">
                        <button onClick={()=>setStage('arriving')} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-500 text-sm">Back</button>
                        <button onClick={()=>setStage('completed')} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm transition-colors">
                            Mark Complete ✓
                        </button>
                    </div>
                    <div className="mt-3 flex justify-center">
                        <button onClick={()=>setShowHelp(true)}
                            className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-full hover:bg-red-100 transition-colors">
                            <AlertTriangle className="w-3 h-3"/> Report Issue / Help
                        </button>
                    </div>
                </SlidePanel>
            )}
            </AnimatePresence>

            {/* ── STAGE: completed ──────────────────────────── */}
            <AnimatePresence>
            {stage==='completed' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',damping:20}}
                        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-7 flex flex-col items-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 30%, white 0%, transparent 60%)'}}/>
                            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring'}}
                                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                <CheckCircle2 className="w-8 h-8 text-white"/>
                            </motion.div>
                            <h3 className="text-2xl font-black mb-1">Service Completed!</h3>
                            <p className="text-sm opacity-90">{paymentMode==='credit'?'Payment Scheduled (Pay Later)':'Total Paid'}</p>
                            <p className="text-4xl font-black mt-1">₹{selectedMachine?.price}</p>
                        </div>
                        <div className="p-6">
                            {/* Details */}
                            <div className="space-y-3 mb-4">
                                {[
                                    {label:'Booking ID', val: BOOKING_ID},
                                    {label:'Service', val: selectedCat?.label||'Land Preparation'},
                                    {label:'Duration', val:'1 hour'},
                                    {label:'Payment', val: paymentMode==='credit'?'Kisan Credit':'Cash / UPI'}
                                ].map(row=>(
                                    <div key={row.label} className="flex justify-between items-center border-b border-dashed border-slate-100 dark:border-slate-800 pb-3">
                                        <span className="text-xs font-bold text-slate-500">{row.label}</span>
                                        <span className={`text-xs font-black ${row.label==='Payment'&&paymentMode==='credit'?'text-amber-600':''}`}>{row.val}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Rate service */}
                            <div className="pt-2 mb-5">
                                <p className="text-center text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Rate Service</p>
                                <div className="flex justify-center gap-2">
                                    {[1,2,3,4,5].map(s=>(
                                        <button key={s} onClick={()=>{ setUserRating(s); toast.success(`Rated ${s} Stars! Thank you.`); }}
                                            className="hover:scale-125 transition-transform p-1">
                                            <Star className={`w-8 h-8 ${s<=userRating?'text-amber-400 fill-amber-400':'text-slate-300 dark:text-slate-600'}`}/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="space-y-2">
                                <button onClick={downloadReceipt}
                                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                    <Download className="w-4 h-4"/> Download Bill
                                </button>
                                <button onClick={resetAll}
                                    className="w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-2xl font-black text-sm hover:bg-green-100 transition-colors">
                                    Book New Service
                                </button>
                                <button onClick={()=>setShowHelp(true)}
                                    className="w-full py-2 text-red-400 font-bold text-xs hover:text-red-500 transition-colors">
                                    Report Issue
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ── HELP MODAL ────────────────────────────────── */}
            <AnimatePresence>
            {showHelp && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-4">
                    <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
                        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <AlertTriangle className="text-red-500 w-5 h-5"/> Report & Help
                            </h3>
                            <button onClick={()=>setShowHelp(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 transition-colors">
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">Select an issue</p>
                        <div className="space-y-2 mb-5">
                            {[
                                {id:'extra_money',icon:'💰',label:'Driver asking extra money',color:'red'},
                                {id:'rude',icon:'😡',label:'Rude behaviour or unsafe driving',color:'slate'},
                                {id:'late',icon:'⏰',label:'Driver is late or not responding',color:'slate'}
                            ].map(issue=>(
                                <button key={issue.id} onClick={()=>handleReport(issue.id)}
                                    className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-colors ${
                                        issue.color==='red'
                                        ?'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 hover:bg-red-100 border border-red-100 dark:border-red-900/30'
                                        :'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
                                    }`}>
                                    {issue.icon} {issue.label}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Emergency Support</p>
                            <a href="tel:1800-180-1551"
                                className="flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black transition-colors">
                                <Phone className="w-5 h-5"/>
                                <div>
                                    <p className="text-[10px] opacity-80">Kisan Toll Free</p>
                                    <p className="text-lg">1800-180-1551</p>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default TractorBooking;
"""

with open('src/pages/TractorBooking.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done! File written successfully.")
print("Lines:", len(code.splitlines()))
print("Bytes:", len(code.encode('utf-8')))
