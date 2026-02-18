import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, User, CheckCircle2, Search, Filter, Warehouse, Clock, Calendar, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

const LandLease = () => {
    const { lang } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLand, setSelectedLand] = useState(null);
    const [leaseDuration, setLeaseDuration] = useState(6); // Default 6 months
    const [bookingStage, setBookingStage] = useState('list'); // list, details, confirm, success

    // Mock Land Data
    const lands = [
        {
            id: 'l1',
            owner: 'Ramesh Sahoo',
            location: 'Pipili, Puri',
            area: '2.5 Acres',
            type: 'Irrigated (Canal)',
            soil: 'Alluvial (Doarsa)',
            price: 15000, // Per month
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
            features: ['Near Canal', 'Fencing Done', 'Road Access'],
            rating: 4.8,
            status: 'Available'
        },
        {
            id: 'l2',
            owner: 'Bikram Jena',
            location: 'Balakati, Khurda',
            area: '5.0 Acres',
            type: 'Rainfed',
            soil: 'Red Soil',
            price: 12000,
            image: 'https://images.unsplash.com/photo-1625246333195-09d9d11a03d0?auto=format&fit=crop&q=80&w=1000',
            features: ['Tube Well', 'Store House', 'Near Market'],
            rating: 4.5,
            status: 'Available'
        },
        {
            id: 'l3',
            owner: 'Suresh Das',
            location: 'Nimapara, Puri',
            area: '1.2 Acres',
            type: 'Irrigated (Pump)',
            soil: 'Clayey (Matila)',
            price: 8000,
            image: 'https://images.unsplash.com/photo-1530226406372-386378aaf52e?auto=format&fit=crop&q=80&w=1000',
            features: ['Organic Certified', 'Solar Pump'],
            rating: 4.9,
            status: 'Available'
        },
        // More specific entries for "Real Feel"
        {
            id: 'l4',
            owner: 'Harihar Mishra',
            location: 'Satyabadi, Puri',
            area: '3.0 Acres',
            type: 'Irrigated',
            soil: 'Loamy',
            price: 18000,
            image: 'https://plus.unsplash.com/premium_photo-1661962692059-55d5a431963a?auto=format&fit=crop&q=80&w=1000',
            features: ['Tractor Access', 'Godown nearby'],
            rating: 4.2,
            status: 'Available'
        }
    ];

    const handleBook = () => {
        setBookingStage('success');
        toast.success("Land Leased Successfully!");
    };

    const downloadAgreement = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Land Lease Agreement", 20, 20);

        doc.setFontSize(12);
        doc.text(`Agreement ID: #LEA-${Date.now().toString().slice(-6)}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);

        doc.line(20, 60, 190, 60);

        doc.setFontSize(14);
        doc.text("Lessor (Owner) Details:", 20, 75);
        doc.setFontSize(12);
        doc.text(`Name: ${selectedLand.owner}`, 20, 85);
        doc.text(`Location: ${selectedLand.location}`, 20, 95);

        doc.setFontSize(14);
        doc.text("Lease Details:", 20, 115);
        doc.setFontSize(12);
        doc.text(`Land Area: ${selectedLand.area}`, 20, 125);
        doc.text(`Duration: ${leaseDuration} Months`, 20, 135);
        doc.text(`Monthly Rent: Rs. ${selectedLand.price}`, 20, 145);
        doc.text(`Total Amount: Rs. ${(selectedLand.price * leaseDuration).toLocaleString()}`, 20, 155);

        doc.line(20, 170, 190, 170);

        doc.setFontSize(10);
        doc.text("Terms & Conditions:", 20, 180);
        doc.text("1. The lessee shall use the land only for agricultural purposes.", 20, 190);
        doc.text("2. Payment must be made by the 5th of every month.", 20, 200);
        doc.text("3. Any damage to permanent structures will be borne by the lessee.", 20, 210);

        doc.save("lease_agreement.pdf");
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Land Lease & Rent</h1>
                    <p className="text-slate-500 font-bold">Find the perfect land for your next crop</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl">
                    <Warehouse className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {bookingStage === 'list' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Search Bar */}
                        <div className="flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm">
                            <Search className="w-6 h-6 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by location (e.g. Pipili, Khurda)..."
                                className="flex-1 bg-transparent outline-none font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200">
                                <Filter className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Lands Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lands.filter(l => l.location.toLowerCase().includes(searchTerm.toLowerCase())).map(land => (
                                <motion.div
                                    key={land.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="h-48 bg-slate-200 relative">
                                        <img src={land.image} alt="Land" className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {land.rating}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-black">{land.location}</h3>
                                                <p className="text-sm font-bold text-slate-500">{land.area} • {land.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="text-xl font-black text-primary-600">₹{land.price.toLocaleString()}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">/ Month</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {land.features.map((f, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => { setSelectedLand(land); setBookingStage('details'); }}
                                            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                        >
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {bookingStage === 'details' && selectedLand && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="max-w-4xl mx-auto"
                    >
                        <button onClick={() => setBookingStage('list')} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-black hover:dark:text-white transition-colors">
                            <ArrowRight className="w-5 h-5 rotate-180" /> Back to Listings
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="h-64 md:h-80 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl">
                                    <img src={selectedLand.image} alt="Land" className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem]">
                                    <h3 className="font-black text-xl mb-4">Owner Details</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{selectedLand.owner}</h4>
                                            <p className="text-sm text-slate-500">Verified Landlord</p>
                                        </div>
                                        <button className="ml-auto p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
                                            <Phone className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl h-fit">
                                <h2 className="text-2xl font-black mb-2">{selectedLand.location}</h2>
                                <p className="text-slate-500 font-bold mb-6">{selectedLand.area} • {selectedLand.soil}</p>

                                <div className="space-y-6 mb-8">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Lease Duration</label>
                                        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                                            {[3, 6, 12, 24].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setLeaseDuration(m)}
                                                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${leaseDuration === m ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
                                                >
                                                    {m} M
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-bold">Monthly Rent</span>
                                            <span className="font-bold">₹{selectedLand.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-bold">Duration</span>
                                            <span className="font-bold">{leaseDuration} Months</span>
                                        </div>
                                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                                        <div className="flex justify-between text-lg">
                                            <span className="text-slate-900 dark:text-white font-black">Total</span>
                                            <span className="font-black text-primary-600">₹{(selectedLand.price * leaseDuration).toLocaleString()}</span>
                                        </div>
                                        {leaseDuration >= 12 && (
                                            <p className="text-xs text-green-600 font-bold text-center bg-green-100 p-2 rounded-lg">
                                                🎉 5% Discount Applied for Annual Lease
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-600/30 hover:scale-[1.02] transition-transform"
                                >
                                    Proceed to Lease
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {bookingStage === 'success' && selectedLand && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center max-w-lg mx-auto bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl mt-4 md:mt-10"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black mb-2">Lease Confirmed!</h2>
                        <p className="text-slate-500 font-bold mb-8">
                            You have successfully leased the land in <span className="text-slate-900 dark:text-white">{selectedLand.location}</span> for {leaseDuration} months.
                        </p>

                        <div className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl mb-8 text-left">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Summary</p>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-500 font-bold">Owner</span>
                                <span className="font-black">{selectedLand.owner}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-500 font-bold">Duration</span>
                                <span className="font-black">{leaseDuration} Months</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-bold">Total Amount</span>
                                <span className="font-black text-green-600">₹{(selectedLand.price * leaseDuration).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <button
                                onClick={downloadAgreement}
                                className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-lg hover:shadow-xl transition-all"
                            >
                                Download Agreement
                            </button>
                            <button
                                onClick={() => { setSelectedLand(null); setBookingStage('list'); }}
                                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default LandLease;
