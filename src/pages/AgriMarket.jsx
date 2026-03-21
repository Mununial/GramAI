import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, Filter, Star, Truck, ShieldCheck, Leaf, DollarSign, 
    Trash2, Plus, Minus, CreditCard, MapPin, CheckCircle2, 
    X, ChevronRight, Wallet as WalletIcon, Download, Smartphone 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWallet } from '../context/WalletContext';
import { toast } from 'react-toastify';
import LocationSearch from '../components/common/LocationSearch';
import { jsPDF } from 'jspdf';

const AgriMarket = () => {
    const { t, lang } = useLanguage();
    const { balance, spendFunds } = useWallet();
    const [category, setCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(0); // 0: Browse, 1: Address, 2: Payment, 3: Success
    const [address, setAddress] = useState(null);
    const [addressName, setAddressName] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');

    const products = [
        {
            id: 1, 
            name: "Tricyclazole 75 WP (Fungicide)", 
            odiaName: "ଟ୍ରାଇସାଇକ୍ଲାଜୋଲ୍ ୭୫ WP (କୀଟନାଶକ)",
            price: 680, 
            mrp: 850, 
            discount: "20% OFF", 
            img: "/assets/products/pesticide.png",
            category: "Pesticides", 
            stock: "In Stock",
            rating: 4.8,
            desc: "Best for Rice Blast. Systemic fungicide for long-lasting protection.",
            odiaDesc: "ଧାନ ବ୍ଲାଷ୍ଟ ପାଇଁ ସର୍ବୋତ୍ତମ। ଦୀର୍ଘସ୍ଥାୟୀ ସୁରକ୍ଷା ପାଇଁ କ୍ରିୟାଶୀଳ କୀଟନାଶକ।"
        },
        {
            id: 2, 
            name: "Mancozeb 75 WP (Contact)", 
            odiaName: "ମାଙ୍କୋଜେବ୍ ୭୫ WP",
            price: 380, 
            mrp: 450, 
            discount: "15% OFF", 
            img: "/assets/products/pesticide.png",
            category: "Pesticides", 
            stock: "Low Stock",
            rating: 4.5,
            desc: "Broad-spectrum contact fungicide. Effective for Potato Late Blight.",
            odiaDesc: "ବ୍ୟାପକ ସ୍ପେକ୍ଟ୍ରମ କଣ୍ଟାକ୍ଟ କୀଟନାଶକ। ଆଳୁ ବ୍ଲାଇଟ୍ ପାଇଁ ପ୍ରଭାବଶାଳୀ।"
        },
        {
            id: 3, 
            name: "Imidacloprid 17.8 SL", 
            odiaName: "ଇମିଡାକ୍ଲୋପ୍ରିଡ୍ ୧୭.୮ SL",
            price: 450, 
            mrp: 600, 
            discount: "25% OFF", 
            img: "/assets/products/pesticide.png",
            category: "Insecticides", 
            stock: "In Stock",
            rating: 4.7,
            desc: "Systemic insecticide for sucking pests like Aphids, Jassids, and Thrips.",
            odiaDesc: "ଶୋଷୁଥିବା ପୋକ ଯଥା ଆଫିଡସ୍ ଏବଂ ଥ୍ରିପ୍ସ ପାଇଁ ପ୍ରଭାବଶାଳୀ।"
        },
        {
            id: 4, 
            name: "Premium NPK 19:19:19", 
            odiaName: "ପ୍ରିମିୟମ୍ NPK ୧୯:୧୯:୧୯",
            price: 125, 
            mrp: 180, 
            discount: "30% OFF", 
            img: "/assets/products/fertilizer.png",
            category: "Fertilizers", 
            stock: "In Stock",
            rating: 4.9,
            desc: "Water soluble fertilizer for all crops. Boosts growth and yield.",
            odiaDesc: "ସମସ୍ତ ଫସଲ ପାଇଁ ଜଳରେ ଦ୍ରବୀଭୂତ ସାର। ଅମଳ ବୃଦ୍ଧି କରେ।"
        },
        {
            id: 5, 
            name: "Hybrid Paddy Seeds - CR 1014", 
            odiaName: "ହାଇବ୍ରିଡ୍ ଧାନ ବିହନ - CR ୧୦୧୪",
            price: 850, 
            mrp: 1100, 
            discount: "22% OFF", 
            img: "/assets/products/seeds.png",
            category: "Seeds", 
            stock: "In Stock",
            rating: 4.8,
            desc: "High-yielding variety. Resistant to major pests and diseases.",
            odiaDesc: "ଉଚ୍ଚ ଅମଳକ୍ଷମ ବିହନ। ରୋଗ ଓ ପୋକ ପ୍ରତିରୋଧକ।"
        },
        {
            id: 6, 
            name: "Kisan Power Tiller 7HP", 
            odiaName: "କିସାନ ପାୱାର ଟିଲର ୭HP",
            price: 45000, 
            mrp: 58000, 
            discount: "22% OFF", 
            img: "/assets/products/tiller.png",
            category: "Machinery", 
            stock: "In Stock",
            rating: 4.9,
            desc: "Powerful 7HP engine for tilling, weeding, and intercultural operations.",
            odiaDesc: "ଚାଷ ଏବଂ ଘାସ ସଫା କରିବା ପାଇଁ ଶକ୍ତିଶାଳୀ ୭HP ଇଞ୍ଜିନ୍।"
        },
        {
            id: 7, 
            name: "Heavy Duty Garden Rake", 
            odiaName: "ହେଭି ଡ୍ୟୁଟି ଗାର୍ଡେନ୍ ରେକ୍",
            price: 450, 
            mrp: 650, 
            discount: "30% OFF", 
            img: "/assets/products/tools.png",
            category: "Tools", 
            stock: "In Stock",
            rating: 4.6,
            desc: "Forged steel head with long fiberglass handle for durability.",
            odiaDesc: "ଲମ୍ବା ହାଣ୍ଡେଲ୍ ସହିତ ମଜବୁତ୍ ଲୁହା ରେକ୍।"
        }
    ];

    const categoryMap = {
        'All': 'allCategories',
        'Fertilizers': 'fertilizers',
        'Seeds': 'seeds',
        'Pesticides': 'pesticides',
        'Insecticides': 'insecticides',
        'Machinery': 'machinery',
        'Tools': 'tools'
    };

    const categories = ['All', 'Fertilizers', 'Seeds', 'Pesticides', 'Insecticides', 'Machinery', 'Tools'];

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        toast.success(lang === 'or' ? `${product.odiaName} କାର୍ଟରେ ଯୋଡାଗଲା!` : `${product.name} added to cart!`);
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
    
    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

    const handlePlaceOrder = () => {
        if (paymentMethod === 'wallet' && balance < cartTotal) {
            toast.error(lang === 'or' ? "ୱାଲେଟ୍ ବାଲାନ୍ସ କମ୍ ଅଛି! ଟଙ୍କା ଯୋଡନ୍ତୁ।" : "Low Wallet Balance! Please add funds.");
            return;
        }

        setIsPlacingOrder(true);
        setTimeout(() => {
            if (paymentMethod === 'wallet') {
                spendFunds(cartTotal, `Order for AgriMarket #${Math.floor(Math.random() * 90000) + 10000}`);
            }
            const id = 'AGRI-' + Math.floor(Math.random() * 9000000) + 1000000;
            setOrderId(id);
            setIsPlacingOrder(false);
            setCheckoutStep(3);
            toast.success(t('orderSuccess'));
        }, 2000);
    };

    const generateReceipt = () => {
        try {
            const doc = new jsPDF();
            doc.setFillColor(245, 248, 245);
            doc.rect(0, 0, 210, 297, 'F');
            doc.setFillColor(34, 197, 94); // primary color
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text("AgriMarket Receipt", 105, 25, { align: "center" });
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(10);
            const date = new Date().toLocaleDateString();
            doc.text(`Order ID: ${orderId}`, 20, 55);
            doc.text(`Date: ${date}`, 20, 62);
            doc.text(`Payment Mode: ${paymentMethod.toUpperCase()}`, 20, 69);
            doc.rect(20, 80, 170, 30);
            doc.setFontSize(12);
            doc.text("Delivery To:", 25, 90);
            doc.setFontSize(10);
            doc.text(addressName || (lang === 'or' ? "ରାଜେଶ ଚାଷୀ, କଳାହାଣ୍ଡି, ଓଡ଼ିଶା" : "Rajesh Farmer, Kalahandi, Odisha"), 25, 98);
            doc.setFillColor(240, 240, 240);
            doc.rect(20, 120, 170, 10, 'F');
            doc.text("Item Name", 25, 127);
            doc.text("Qty", 120, 127);
            doc.text("Price", 145, 127);
            doc.text("Total", 175, 127);
            let y = 140;
            cart.forEach(item => {
                doc.text(lang === 'or' ? item.odiaName.substring(0, 30) : item.name.substring(0, 30), 25, y);
                doc.text(item.qty.toString(), 122, y);
                doc.text(`Rs.${item.price}`, 145, y);
                doc.text(`Rs.${item.price * item.qty}`, 175, y);
                y += 10;
            });
            doc.line(20, y + 5, 190, y + 5);
            doc.setFontSize(14);
            doc.text("Final Total:", 120, y + 20);
            doc.text(`Rs.${cartTotal}`, 175, y + 20);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Thank you for choosing GramAI. Support: 1800-AGRI-SAFE", 105, 280, { align: "center" });
            doc.save(`AgriMarket_Receipt_${orderId}.pdf`);
            toast.success(t('downloadReceipt'));
        } catch (error) {
            console.error(error);
            toast.error("Receipt generation failed.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4 sm:px-6 relative overflow-hidden">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
                <div>
                    <span className="px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2 inline-block">
                        {lang === 'or' ? "ସିଧାସଳଖ ନିର୍ମାତାଙ୍କ ଠାରୁ" : "Direct From Manufacturer"}
                    </span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                        GramAI <span className="text-primary-600">{t('agriMarket')}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        {lang === 'or' ? "ହୋଲସେଲ ମୂଲ୍ୟରେ ଅସଲି କୃଷି ସାମଗ୍ରୀ କିଣନ୍ତୁ।" : "Buy authentic agricultural products at wholesale prices."}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => setShowCart(true)}
                        className="flex-1 md:flex-none relative p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        <span className="md:hidden font-bold">{lang === 'or' ? "କାର୍ଟ ଦେଖନ୍ତୁ" : "View Cart"}</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('cartTotal')}</p>
                        <p className="text-2xl font-black text-primary-600 italic">₹{cartTotal.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Filter Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 overflow-visible">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-8 py-4 rounded-[1.5rem] font-black text-xs transition-all whitespace-nowrap flex items-center gap-3 uppercase tracking-wider ${category === cat
                            ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xl scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                    >
                        {category === cat && <Filter className="w-4 h-4 text-primary-500" />}
                        {t(categoryMap[cat])}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 shadow-xl hover:shadow-2xl transition-all group border border-slate-100 dark:border-slate-800 flex flex-col"
                        >
                            <div className="relative h-60 w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <img src={product.img} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
                                    {product.discount}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[9px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg uppercase tracking-widest">{t(categoryMap[product.category])}</span>
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${product.stock === 'Out of Stock' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {lang === 'or' ? (product.stock === 'In Stock' ? 'ମହଜୁଦ ଅଛି' : 'ଶେଷ ହୋଇଯାଇଛି') : product.stock}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 line-clamp-2 leading-snug">
                                    {lang === 'or' ? product.odiaName : product.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 font-bold mb-6 line-clamp-2 leading-relaxed opacity-80">
                                    {lang === 'or' ? product.odiaDesc : product.desc}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] mb-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-bold line-through tracking-wider">MRP: ₹{product.mrp}</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">₹{product.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-green-600 font-black uppercase mb-0.5">{lang === 'or' ? "ଉଦ୍ଧାର ମୂଲ୍ୟ" : "Save Now"}</p>
                                        <p className="text-sm font-black text-green-600 italic">₹{(product.mrp - product.price).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 'Out of Stock'}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${product.stock === 'Out of Stock'
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white shadow-xl'
                                    }`}
                            >
                                <ShoppingBag className="w-4 h-4" /> {product.stock === 'Out of Stock' ? (lang === 'or' ? 'ଶେଷ ହୋଇଛି' : 'Sold Out') : t('addToCart')}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Cart Sidebar */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]" />
                        <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[1010] flex flex-col pt-safe"
                        >
                            <div className="pt-16 p-8 pb-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center relative">
                                <div>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">{lang === 'or' ? "ମୋ କାର୍ଟ" : "My Cart"}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cartCount} {lang === 'or' ? "ଟି ଜିନିଷ" : "Items"}</p>
                                </div>
                                <button onClick={() => setShowCart(false)} className="p-4 bg-red-600 text-white rounded-[1.5rem] shadow-xl hover:rotate-90 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                        <ShoppingBag size={80} className="text-slate-200" />
                                        <h4 className="text-2xl font-black italic">{lang === 'or' ? "କାର୍ଟ ଖାଲି ଅଛି!" : "Cart is empty!"}</h4>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex gap-6 group relative">
                                            <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] p-3 flex items-center justify-center shrink-0">
                                                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h5 className="font-black text-slate-800 dark:text-white text-lg leading-tight">{lang === 'or' ? item.odiaName : item.name}</h5>
                                                <p className="text-sm font-black text-primary-600 italic">₹{item.price.toLocaleString()}</p>
                                                <div className="flex items-center gap-6 mt-4">
                                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1">
                                                        <button onClick={() => updateQty(item.id, -1)} className="p-2 text-slate-400 hover:text-red-500"><Minus size={14} /></button>
                                                        <span className="w-8 text-center text-sm font-black">{item.qty}</span>
                                                        <button onClick={() => updateQty(item.id, 1)} className="p-2 text-slate-400 hover:text-green-500"><Plus size={14} /></button>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-lg italic">₹{(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-slate-500 font-black uppercase text-[10px]"><span>{t('cartTotal')}</span><span>₹{cartTotal.toLocaleString()}</span></div>
                                        <div className="flex justify-between items-center text-green-600 font-black uppercase text-[10px]"><span>{lang === 'or' ? 'ସିପିଂ' : 'Shipping'}</span><span>FREE</span></div>
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white">
                                            <span className="text-3xl font-black uppercase italic tracking-tighter">{t('total')}</span>
                                            <span className="text-3xl font-black italic tracking-tighter text-primary-600">₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setShowCart(false); setCheckoutStep(1); }}
                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2rem] font-black text-2xl shadow-2xl active:scale-95 transition-all"
                                    >
                                        {t('proceedToCheckout')} <ChevronRight size={28} />
                                    </button>
                                </div>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Checkout Modal */}
            <AnimatePresence>
                {checkoutStep > 0 && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCheckoutStep(0)} className="absolute inset-0 bg-black/90 backdrop-blur-2" />
                        <motion.div initial={{ scale: 0.9, y: 100 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 100 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
                        >
                            {checkoutStep < 3 && (
                                <div className="bg-primary-600 pt-16 p-10 flex items-center justify-between text-white">
                                    <div className="flex items-center gap-6">
                                        <ShoppingBag size={32} />
                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">{t('proceedToCheckout')}</h3>
                                    </div>
                                    <button onClick={() => setCheckoutStep(0)} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                                </div>
                            )}

                            <div className="p-10">
                                {checkoutStep === 1 && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <MapPin size={28} className="text-primary-600" />
                                            <h4 className="text-2xl font-black uppercase italic">{t('deliveryAddress')}</h4>
                                        </div>
                                        <div className="p-8 border-2 border-primary-600 rounded-[2.5rem]">
                                            <p className="text-xl font-black uppercase italic">{lang === 'or' ? "ରାଜେଶ ଚାଷୀ" : "Rajesh Farmer"}</p>
                                            <p className="text-sm text-slate-500 mt-4">{lang === 'or' ? "କଳାହାଣ୍ଡି, ଓଡ଼ିଶା - ୭୬୬୦୦୧" : "Kalahandi, Odisha - 766001"}</p>
                                        </div>
                                        <button onClick={() => setCheckoutStep(2)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2rem] font-black text-2xl shadow-xl">{lang === 'or' ? "ଆଗକୁ ବଢନ୍ତୁ" : "Continue"}</button>
                                    </div>
                                )}

                                {checkoutStep === 2 && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <CreditCard size={28} className="text-primary-600" />
                                            <h4 className="text-2xl font-black uppercase italic">{t('paymentHub')}</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <button onClick={() => setPaymentMethod('wallet')} className={`w-full p-8 border-2 rounded-[3rem] flex justify-between items-center ${paymentMethod === 'wallet' ? 'border-primary-600 bg-primary-50' : 'border-slate-100'}`}>
                                                <div className="flex items-center gap-6"><WalletIcon size={32} /><p className="text-xl font-black italic">{lang === 'or' ? "ୱାଲେଟ୍" : "Wallet"}</p></div>
                                                {paymentMethod === 'wallet' && <CheckCircle2 className="text-primary-600" />}
                                            </button>
                                            <button onClick={() => setPaymentMethod('cod')} className={`w-full p-8 border-2 rounded-[3rem] flex justify-between items-center ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-slate-100'}`}>
                                                <div className="flex items-center gap-6"><Truck size={32} /><p className="text-xl font-black italic">{lang === 'or' ? "କ୍ୟାଶ୍ ଅନ୍ ଡେଲିଭରି" : "Cash on Delivery"}</p></div>
                                                {paymentMethod === 'cod' && <CheckCircle2 className="text-primary-600" />}
                                            </button>
                                        </div>
                                        <button onClick={handlePlaceOrder} className="w-full bg-primary-600 text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl">{lang === 'or' ? "ଅର୍ଡର କରନ୍ତୁ" : "Place Order"}</button>
                                    </div>
                                )}

                                {checkoutStep === 3 && (
                                    <div className="text-center py-10 space-y-8">
                                        <CheckCircle2 size={64} className="text-green-500 mx-auto" />
                                        <h3 className="text-5xl font-black uppercase italic">{t('orderSuccess')}</h3>
                                        <p className="text-xl font-black text-primary-600">{orderId}</p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button onClick={generateReceipt} className="flex-1 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"><Download size={18} /> {t('downloadReceipt')}</button>
                                            <button onClick={() => { setCheckoutStep(0); setCart([]); }} className="flex-1 bg-primary-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs">Back to Market</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgriMarket;
