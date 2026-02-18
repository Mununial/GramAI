import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'react-toastify';

import {
    MapPin, Navigation, Signal, Wifi, Activity,
    Building2, Landmark, CloudRain, Sprout,
    IndianRupee, Shield, Warehouse, Globe,
    Layers, Map as MapIcon, Eye,
    TrendingUp, AlertTriangle, CheckCircle2, X
} from 'lucide-react';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to handle map flying/panning
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

const TractorMarker = ({ userPos }) => {
    const [position, setPosition] = useState(null);
    const startPosRef = useRef(null);
    const startTimeRef = useRef(null);
    const duration = 15000; // 15 seconds arrival time
    const [remainingTime, setRemainingTime] = useState(15);

    useEffect(() => {
        // Set start position with random offset (~300-500m)
        const offsetLat = (Math.random() - 0.5) * 0.01;
        const offsetLng = (Math.random() - 0.5) * 0.01;

        const startLat = userPos[0] + offsetLat;
        const startLng = userPos[1] + offsetLng;

        startPosRef.current = [startLat, startLng];
        setPosition([startLat, startLng]);
        startTimeRef.current = Date.now();
        setRemainingTime(Math.ceil(duration / 1000)); // Reset remaining time
    }, [userPos]); // Re-run if userPos changes (new booking)

    useEffect(() => {
        if (!startPosRef.current) return;

        let animationFrameId;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            const timeLeft = Math.max(0, Math.ceil((duration - elapsed) / 1000));
            setRemainingTime(timeLeft);

            if (progress < 1) {
                const lat = startPosRef.current[0] + (userPos[0] - startPosRef.current[0]) * progress;
                const lng = startPosRef.current[1] + (userPos[1] - startPosRef.current[1]) * progress;
                setPosition([lat, lng]);
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setPosition(userPos); // Arrived
            }
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [userPos]);

    if (!position) return null;

    const tractorIcon = L.divIcon({
        className: 'custom-tractor-icon',
        html: `<div style="position: relative;">
                <div style="background-color: white; padding: 5px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 3px solid #16a34a; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
                    <span style="font-size: 24px;">🚜</span>
                </div>
                <div style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: #16a34a; color: white; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2); white-space: nowrap; border: 2px solid white;">
                    ${remainingTime > 0 ? `Arriving in ${remainingTime}s` : 'Arrived!'}
                </div>
               </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
    });

    return (
        <Marker position={position} icon={tractorIcon} zIndexOffset={1000}>
        </Marker>
    );
};

const GpsMap = ({ activeTrack = null, className = "" }) => {
    const [scannedPoints, setScannedPoints] = useState([]);
    const [isPinging, setIsPinging] = useState(true);
    const [activeLayer, setActiveLayer] = useState('satellite'); // satellite, soil, government
    const [selectedPOI, setSelectedPOI] = useState(null);
    const [showGovServices, setShowGovServices] = useState(true);

    const [userLocation, setUserLocation] = useState({ lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar' }); // Default to BBSR
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsPinging(prev => !prev);
        }, 2000);

        // Auto-locate on mount
        handleLocate();

        return () => clearInterval(interval);
    }, []);

    const handleLocate = () => {
        setLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Live Loc'
                    });
                    setLocating(false);
                },
                (error) => {
                    console.error("GPS Error", error);
                    // Fallback to Bhubaneswar if denied
                    setUserLocation({ lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar (Default)' });
                    setLocating(false);
                    toast.warn("GPS Denied: Using default location");
                }
            );
        } else {
            setLocating(false);
            toast.error("GPS not supported by browser");
        }
    };

    // Government Service Centers Data (Mock locs relative to center)
    // We'll generate these slightly offset from the userLocation for demo purposes
    const [govServices, setGovServices] = useState([]);

    useEffect(() => {
        // Generate mock points around the user location
        const baseLat = userLocation.lat;
        const baseLng = userLocation.lng;

        const services = [
            { id: 1, name: 'PM-KISAN Center', type: 'pmkisan', icon: IndianRupee, lat: baseLat + 0.002, lng: baseLng + 0.003, color: 'bg-green-600', status: 'Active', info: 'Direct Benefit Transfer Portal' },
            { id: 2, name: 'Krishi Vigyan Kendra', type: 'kvk', icon: Sprout, lat: baseLat - 0.004, lng: baseLng - 0.002, color: 'bg-emerald-600', status: 'Open', info: 'Agricultural Training & Research' },
            { id: 3, name: 'Mandi (APMC)', type: 'mandi', icon: Building2, lat: baseLat + 0.005, lng: baseLng - 0.005, color: 'bg-amber-600', status: 'Trading', info: 'Current MSP: ₹2183/Qtl (Paddy)' },
            { id: 4, name: 'Weather Station', type: 'weather', icon: CloudRain, lat: baseLat - 0.001, lng: baseLng + 0.006, color: 'bg-blue-600', status: 'Live', info: 'Rain Alert: Heavy showers expected' },
            { id: 5, name: 'Soil Testing Lab', type: 'lab', icon: Activity, lat: baseLat + 0.003, lng: baseLng + 0.001, color: 'bg-purple-600', status: 'Open', info: 'Report delivered in 24hrs' },
        ];
        setGovServices(services);
    }, [userLocation]);


    const tileLayers = {
        street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // Esri World Imagery
        soil: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}' // Esri Topo as proxy for soil map look
    };

    const defaultClasses = "h-[400px] md:h-[600px] rounded-[30px] md:rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl";
    const finalClasses = className ? className : defaultClasses;

    return (
        <div className={`relative w-full bg-slate-50 dark:bg-slate-950 overflow-hidden z-0 ${finalClasses}`}>
            {/* Enhanced HUD Overlay */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-[400] space-y-2 pointer-events-none"> {/* higher z-index for leaflet */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-lg pointer-events-auto">
                    <Signal className="w-3 h-3 animate-pulse" /> Gov Services Active
                </div>
                <button
                    onClick={handleLocate}
                    className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-black/90 transition-colors pointer-events-auto"
                >
                    <Wifi className={`w-3 h-3 text-blue-400 ${locating ? 'animate-spin' : ''}`} />
                    {locating ? 'Locating...' : `GPS: ${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E`}
                </button>
            </div>

            {/* Layer Controls */}
            <div className="absolute top-6 right-6 z-[400] space-y-3 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl pointer-events-auto">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2 px-1">Map Layers</p>
                    <div className="space-y-2">
                        <button onClick={() => setActiveLayer('street')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeLayer === 'street' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                            <MapIcon className="w-3.5 h-3.5" /> Street
                        </button>
                        <button onClick={() => setActiveLayer('satellite')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeLayer === 'satellite' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                            <Globe className="w-3.5 h-3.5" /> Satellite
                        </button>
                        <button onClick={() => setActiveLayer('soil')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeLayer === 'soil' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                            <Activity className="w-3.5 h-3.5" /> Terrain
                        </button>
                    </div>
                </div>
            </div>

            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <MapUpdater center={[userLocation.lat, userLocation.lng]} zoom={15} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url={tileLayers[activeLayer] || tileLayers['street']}
                />

                {/* User Location Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold">You are Here</h3>
                            <p className="text-xs">Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Mock Accuracy Circle */}
                <Circle center={[userLocation.lat, userLocation.lng]} radius={200} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />

                {/* Gov Services Markers */}
                {showGovServices && activeLayer !== 'soil' && govServices.map(service => (
                    <Marker
                        key={service.id}
                        position={[service.lat, service.lng]}
                        eventHandlers={{
                            click: () => setSelectedPOI(service),
                        }}
                    >
                        <Popup>
                            <div className="p-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <service.icon className="w-4 h-4 text-primary-600" />
                                    <h4 className="font-bold text-sm">{service.name}</h4>
                                </div>
                                <p className="text-xs">{service.info}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Live Tracking Tractor Marker */}
                {activeTrack && <TractorMarker userPos={[userLocation.lat, userLocation.lng]} />}

            </MapContainer>


            {/* Selected POI Detail Panel (Outside MapContainer to overlay correctly) */}
            <AnimatePresence>
                {selectedPOI && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 right-6 z-[500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`p-4 rounded-2xl ${selectedPOI.color} text-white shadow-lg`}>
                                    <selectedPOI.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-xl font-black text-slate-800 dark:text-white">{selectedPOI.name}</h4>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-green-200">
                                            {selectedPOI.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{selectedPOI.info}</p>

                                    <div className="flex gap-2">
                                        <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                            Get Directions
                                        </button>
                                        <button className="bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                                            More Info
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPOI(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default GpsMap;
