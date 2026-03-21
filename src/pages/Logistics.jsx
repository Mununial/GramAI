import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, 
    MapPin, 
    Navigation, 
    Clock, 
    CheckCircle2, 
    Package, 
    Search,
    ChevronRight,
    Phone,
    Star,
    ArrowRightLeft,
    TrendingUp,
    ShieldCheck,
    Container,
    Info,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import LocationSearch from '../components/common/LocationSearch';
import { jsPDF } from 'jspdf';
import { useWallet } from '../context/WalletContext';


// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Truck Icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 13);
    }, [center, map]);
    return null;
};

const steps = [
    { id: 1, title: 'Order Placed', time: '10:30 AM', status: 'completed' },
    { id: 2, title: 'Picked Up', time: '11:45 AM', status: 'completed' },
    { id: 3, title: 'In Transit', time: 'Running', status: 'active' },
    { id: 4, title: 'Near Destination', time: 'Estimated 2:30 PM', status: 'pending' },
];

const vehicles = [
    { 
        id: 'mini', 
        name: 'Mini Truck', 
        capacity: '1.5 Tons', 
        price: '₹15/km', 
        icon: Truck, 
        color: 'text-blue-500', 
        markerIcon: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png' // Mini Truck
    },
    { 
        id: 'tractor', 
        name: 'Agri Tractor', 
        capacity: '3 Tons', 
        price: '₹25/km', 
        icon: Container, 
        color: 'text-green-500', 
        markerIcon: 'https://cdn-icons-png.flaticon.com/512/2555/2555013.png' // Tractor
    },
    { 
        id: 'heavy', 
        name: 'Heavy Truck', 
        capacity: '10 Tons', 
        price: '₹45/km', 
        icon: Truck, 
        color: 'text-orange-500', 
        markerIcon: 'https://cdn-icons-png.flaticon.com/512/2165/2165355.png' // Heavy Truck
    },
];

const Logistics = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('track'); // 'book' or 'track'
    const [trackingId, setTrackingId] = useState('GRM-7829-X2');
    const [truckPos, setTruckPos] = useState([20.2961, 85.8245]); // Bhubaneswar area
    const [origin, setOrigin] = useState([20.2961, 85.8245]); 
    const [destination, setDestination] = useState([20.4625, 85.8830]); // Cuttack area
    const [originName, setOriginName] = useState('Bhubaneswar Village');
    const [destinationName, setDestinationName] = useState('Khurda Mandi');
    const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
    const [showEstimates, setShowEstimates] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isBooked, setIsBooked] = useState(false);
    const [realDistance, setRealDistance] = useState(0);

    const handleDownloadReceipt = () => {
        const doc = new jsPDF();
        const total = Math.round(realDistance * parseFloat(selectedVehicle?.price.replace(/[₹/km]/g, '') || 15));
        
        // Colors
        const primaryColor = [22, 163, 74]; // GramAI Green
        const secondaryColor = [30, 41, 59]; // Slate 800

        // Branding
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('GramAI Logistics', 20, 25);
        doc.setFontSize(10);
        doc.text('SMART AGRI-TRANSPORT RECEIPT', 20, 32);

        // Shipment ID & Date
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.text('SHIPMENT RECEIPT', 20, 55);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Shipment ID: GRM-TR-8821`, 20, 62);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 67);
        doc.text(`Booking Status: CONFIRMED - GramAI Verified`, 20, 72);

        // Horizontal Line
        doc.setDrawColor(203, 213, 225);
        doc.line(20, 80, 190, 80);

        // Table logic
        doc.setFont('helvetica', 'bold');
        doc.text('ROUTE DETAILS', 20, 90);
        doc.setFont('helvetica', 'normal');
        doc.text(`From: ${originName}`, 25, 100);
        doc.text(`To: ${destinationName}`, 25, 107);
        doc.text(`Total Distance: ${realDistance.toFixed(2)} KM`, 25, 114);

        doc.setFont('helvetica', 'bold');
        doc.text('TRANSPORT & VEHICLE', 20, 130);
        doc.setFont('helvetica', 'normal');
        doc.text(`Vehicle: ${selectedVehicle?.name || 'Agri Truck'}`, 25, 140);
        doc.text(`Transporter: Rajesh Kumar`, 25, 147);
        doc.text(`Rating: 4.9 Stars`, 25, 154);

        // Billing Table
        doc.setFillColor(248, 250, 252);
        doc.rect(20, 170, 170, 40, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('BILLING BREAKDOWN', 20, 165);
        
        doc.text('Description', 25, 180);
        doc.text('Rate', 120, 180);
        doc.text('Amount', 160, 180);
        
        doc.setFont('helvetica', 'normal');
        doc.line(20, 183, 190, 183);
        doc.text('Transport Service (per km)', 25, 190);
        doc.text(`${selectedVehicle?.price || '₹15/km'}`, 120, 190);
        doc.text(`₹${total}`, 160, 190);

        // Total
        doc.setFillColor(...primaryColor);
        doc.rect(140, 220, 50, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`TOTAL: ₹${total}`, 145, 230);

        // Footer
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.text('This is a computer generated receipt from GramAI Platform.', 105, 280, { align: 'center' });
        doc.text('Odisha Agriculture & Farmers Empowerment Dept. Verified.', 105, 285, { align: 'center' });

        doc.save(`GramAI_Receipt_TR8821.pdf`);
        toast.success("Receipt downloaded successfully!");
    };

    const handleCall = () => {
        toast.info(`Calling Rajesh Kumar...`);
        setTimeout(() => {
            window.location.href = `tel:+919876543210`;
        }, 1000);
    };

    const handleChat = () => {
        toast.success(`Opening Chat with Rajesh Kumar...`);
        window.open(`https://wa.me/919876543210?text=${encodeURIComponent("Hello Rajesh, I'm checking on my shipment GRM-TR-8821.")}`, '_blank');
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    useEffect(() => {
        const dist = calculateDistance(origin[0], origin[1], destination[0], destination[1]);
        setRealDistance(dist);
    }, [origin, destination]);

    const handleGetEstimates = () => {
        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            setShowEstimates(true);
            toast.info("Nearby vehicles found!");
        }, 1500);
    };

    const handleTrackSearch = () => {
        if (!searchQuery) return;
        setTrackingId(searchQuery);
        setTruckPos(origin);
        toast.success(`Tracking shipment ${searchQuery}`);
    };

    const { balance, spendFunds } = useWallet();

    const handleConfirmBooking = () => {
        if (!selectedVehicle) {
            toast.warning("Please select a vehicle first!");
            return;
        }

        const total = Math.round(realDistance * parseFloat(selectedVehicle.price.replace(/[₹/km]/g, '')));
        const success = spendFunds(total, `Logistics: ${originName} to ${destinationName}`);
        
        if (!success) return; // Stop if insufficient funds

        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            setIsBooked(true);
            toast.success("Booking Confirmed & Paid via Wallet!");
        }, 2000);
    };

    // Animation for truck moving on map (mock)
    useEffect(() => {
        const totalSteps = Math.max(100, Math.round(realDistance * 50)); // More steps for longer distances
        const interval = setInterval(() => {
            setTruckPos(prev => {
                const latDiff = (destination[0] - origin[0]) / totalSteps;
                const lngDiff = (destination[1] - origin[1]) / totalSteps;
                const newLat = prev[0] + latDiff;
                const newLng = prev[1] + lngDiff;
                
                // Check if the truck has passed the destination or is very close
                // This logic assumes a linear path and resets if it overshoots
                const hasOvershotLat = (latDiff > 0 && newLat > destination[0]) || (latDiff < 0 && newLat < destination[0]);
                const hasOvershotLng = (lngDiff > 0 && newLng > destination[1]) || (lngDiff < 0 && newLng < destination[1]);

                if (Math.abs(newLat - destination[0]) < 0.0001 && Math.abs(newLng - destination[1]) < 0.0001) {
                    return origin; // Reset to origin if very close to destination
                }
                
                // If overshot, reset to origin
                if (hasOvershotLat || hasOvershotLng) {
                    return origin;
                }

                return [newLat, newLng];
            });
        }, 100);
        return () => clearInterval(interval);
    }, [destination, origin, realDistance]);

    return (
        <div className="space-y-6 pb-12 relative min-h-[80vh]">
            {/* Success Overlay */}
            <AnimatePresence>
                {isBooked && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                                <CheckCircle2 size={48} className="text-white" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Booking Success!</h2>
                                <p className="text-slate-500 font-medium">Your transporter <span className="text-primary-600 font-black">Rajesh Kumar</span> is on the way to your pickup location.</p>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-left">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</span>
                                    <span className="text-sm font-black text-primary-600">GRM-TR-8821</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-sm font-bold">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                        <span>Pickup: {originName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>Drop: {destinationName}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Fare</span>
                                    <span className="text-xl font-black text-primary-600 italic">₹{Math.round(realDistance * parseFloat(selectedVehicle?.price.replace(/[₹/km]/g, '') || 15))}</span>
                                </div>
                                              <div className="space-y-3">
                                <button 
                                    onClick={handleDownloadReceipt}
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-3xl font-black text-sm shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                                >
                                    <Package size={20} />
                                    DOWNLOAD RECEIPT (.PDF)
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => {
                                            setIsBooked(false);
                                            setActiveTab('track');
                                            setTrackingId('GRM-TR-8821');
                                        }}
                                        className="bg-primary-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all font-sans"
                                    >
                                        Track Live
                                    </button>
                                    <button 
                                        onClick={() => setIsBooked(false)}
                                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-sans"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Truck className="text-primary-600" />
                        Smart Agri-Logistics
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Seamless transport for your harvest and equipment</p>
                </div>
                
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setActiveTab('track')}
                        className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeTab === 'track' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        Track Order
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab('book');
                            setShowEstimates(false);
                            setSelectedVehicle(null);
                        }}
                        className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeTab === 'book' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        Book Now
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'track' ? (
                    <motion.div 
                        key="track"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 h-[450px] relative">
                                <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                                    <MapUpdater center={mapCenter} />
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap'
                                    />
                                    <Marker position={origin}><Popup>Origin</Popup></Marker>
                                    <Marker position={destination}><Popup>Destination</Popup></Marker>
                                    <Marker 
                                        position={truckPos} 
                                        icon={selectedVehicle ? new L.Icon({
                                            iconUrl: selectedVehicle.markerIcon,
                                            iconSize: [45, 45],
                                            iconAnchor: [22, 22],
                                        }) : truckIcon}
                                    >
                                        <Popup>{selectedVehicle?.name || 'Truck'}</Popup>
                                    </Marker>
                                    <Polyline positions={[origin, destination]} color="#16a34a" dashArray="5, 10" weight={3} />
                                </MapContainer>

                                <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-[220px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Live Tracker</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black">
                                            <span>Speed</span> <span className="text-primary-600">42 km/h</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black">
                                            <span>Distance</span> <span className="text-primary-600">~{realDistance.toFixed(1)} km</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2">
                                            <div className="bg-primary-500 h-full rounded-full transition-all" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-primary-600 to-green-600 p-8 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-sm text-primary-100 font-medium">Tracking Shipment ID</p>
                                    <h2 className="text-3xl font-black tracking-tight">{trackingId}</h2>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl w-full md:w-auto relative z-10 border border-white/10">
                                    <Search className="text-white/70" />
                                    <input 
                                        type="text" 
                                        placeholder="Enter another ID..." 
                                        className="bg-transparent border-none outline-none text-white placeholder:text-white/50 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleTrackSearch()}
                                    />
                                    <button onClick={handleTrackSearch} className="bg-white text-primary-600 px-6 py-2 rounded-[14px] font-black text-xs shadow-lg hover:bg-slate-50 transition-colors">Track</button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-black text-xl mb-8 flex items-center gap-2">
                                    <div className="bg-primary-50 dark:bg-primary-950/30 p-2 rounded-lg">
                                        <Navigation className="text-primary-600 w-5 h-5" />
                                    </div>
                                    Status
                                </h3>
                                <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                    {steps.map((step) => (
                                        <div key={step.id} className="relative flex items-start gap-5">
                                            <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm ${step.id <= 3 ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                                {step.id <= 2 ? <CheckCircle2 size={12} /> : null}
                                                {step.id === 3 ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div> : null}
                                            </div>
                                            <div>
                                                <p className={`font-black text-sm uppercase tracking-tight ${step.id <= 3 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{step.title}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Clock size={10} className="text-slate-400" />
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{step.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl border border-slate-200 dark:border-slate-800 group overflow-hidden relative">
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="relative">
                                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Driver" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-500/10 group-hover:scale-105 transition-transform" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Rajesh Kumar</h4>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i<=4 ? 'text-yellow-500' : 'text-slate-300'} fill-current`} />)}
                                            <span className="text-xs font-black ml-1">4.9</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PRO TRANSPORTER</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 relative z-10">
                                    <button 
                                        onClick={handleCall}
                                        className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl hover:bg-slate-100 transition-colors group/btn"
                                    >
                                        <Phone size={18} className="text-primary-600 group-hover/btn:rotate-12 transition-transform" />
                                        <span className="text-xs font-black tracking-wider">Call</span>
                                    </button>
                                    <button 
                                        onClick={handleChat}
                                        className="flex items-center justify-center gap-2 bg-primary-600 p-4 rounded-2xl text-white shadow-lg hover:bg-primary-700 transition-all hover:-translate-y-1"
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-xs font-black tracking-wider">Chat</span>
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={80} /></div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="book"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-200 dark:border-slate-800 space-y-8 relative overflow-hidden">
                            <div className="space-y-2 relative z-10"><h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Plan Your Journey</h3><p className="text-slate-500 font-medium tracking-tight">Calculate instant fair and book trusted local transporters.</p></div>
                            <div className="space-y-4 relative z-10">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">From</label>
                                        <LocationSearch 
                                            placeholder="Pickup Location" 
                                            initialValue={originName}
                                            onSelect={(item) => {
                                                setOrigin([item.lat, item.lng]);
                                                setOriginName(item.name);
                                                setMapCenter([item.lat, item.lng]);
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-center -my-3 relative z-20">
                                        <button className="bg-primary-600 text-white p-3 rounded-full shadow-xl border-4 border-white dark:border-slate-900">
                                            <ArrowRightLeft className="w-4 h-4 rotate-90" />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">To</label>
                                        <LocationSearch 
                                            placeholder="Drop Location" 
                                            initialValue={destinationName}
                                            icon={Navigation}
                                            onSelect={(item) => {
                                                setDestination([item.lat, item.lng]);
                                                setDestinationName(item.name);
                                                setMapCenter([item.lat, item.lng]);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5 pt-4">
                                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Commodity</label><select className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-primary-500 rounded-[20px] py-4 px-5 outline-none font-bold text-slate-800 dark:text-white appearance-none"><option>Rice/Wheat Crops</option><option>Fertilizers</option><option>Livestock</option></select></div>
                                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Weight</label><div className="relative"><input type="number" defaultValue="250" className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-primary-500 rounded-[20px] py-4 px-5 outline-none font-bold text-slate-800 dark:text-white" /><span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Kg</span></div></div>
                                </div>
                            </div>
                            <button onClick={handleGetEstimates} disabled={isCalculating} className="w-full bg-gradient-to-r from-primary-600 to-green-600 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group relative z-10">{isCalculating ? (<><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>CALCULATING...</>) : (<>GET INSTANT ESTIMATES<ChevronRight /></>)}</button>

                            {showEstimates && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10"
                                >
                                    <button 
                                        onClick={handleConfirmBooking}
                                        disabled={isCalculating}
                                        className={`w-full py-5 rounded-[24px] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 ${selectedVehicle ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        CONFIRM BOOKING
                                        <CheckCircle2 />
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">Select a vehicle from the list to confirm</p>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2"><div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg"><TrendingUp className="text-amber-600 w-5 h-5" /></div>Recommended Vehicles</h3>
                            <div className="space-y-4">
                                {vehicles.map((v) => (
                                    <div 
                                        key={v.id} 
                                        onClick={() => showEstimates && setSelectedVehicle(v)}
                                        className={`group bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden shadow-lg ${selectedVehicle?.id === v.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-[1.02]' : showEstimates ? 'border-primary-500/30 hover:border-primary-500' : 'border-transparent'}`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className={`p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800 ${v.color}`}><v.icon size={36} /></div>
                                                <div>
                                                    <h4 className="text-xl font-black uppercase tracking-tighter">{v.name}</h4>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">MAX CAP: {v.capacity}</p>
                                                    {showEstimates && <div className="flex items-center gap-2 mt-2"><div className="px-2 py-0.5 bg-green-100 dark:bg-green-500/10 rounded-lg"><span className="text-[9px] font-black text-green-600 uppercase">Available</span></div><span className="text-[10px] text-slate-400 font-bold">ETA: 15 Mins</span></div>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-primary-600 italic">
                                                    {showEstimates 
                                                        ? `₹${Math.round(realDistance * parseFloat(v.price.replace(/[₹/km]/g, '')))}` 
                                                        : v.price
                                                    }
                                                </p>
                                                <p className="text-[9px] text-slate-400 uppercase font-black">
                                                    {showEstimates ? 'TOTAL ESTIMATE' : 'BASE FARE/KM'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gradient-to-br from-primary-600/5 to-green-600/5 p-8 rounded-[32px] border border-primary-100 flex items-start gap-5 shadow-inner">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg"><ShieldCheck className="text-primary-600 w-8 h-8" /></div>
                                <div><h4 className="font-black text-primary-900 dark:text-primary-100 italic uppercase tracking-tight text-lg">Safe Transit Assurance</h4><p className="text-xs text-primary-700/70 dark:text-primary-400/70 mt-2 font-medium">Every trip is backed by ₹5,00,000 transit insurance. Drivers are GramAI verified.</p></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Logistics;
