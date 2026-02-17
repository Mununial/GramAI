import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Filter, Star, Truck, ShieldCheck, Leaf, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';

const AgriMarket = () => {
    const { t, lang } = useLanguage();
    const [category, setCategory] = useState('All');
    const [cart, setCart] = useState([]);

    const products = [
        {
            id: 1,
            name: "Tricyclazole 75 WP (Fungicide)",
            category: "Pesticides",
            img: "https://agribegri.com/product_images/b7dda79a4055f2662c19e59005934570.jpg",
            mrp: 850,
            price: 680,
            discount: "20% OFF",
            rating: 4.8,
            desc: "Best for Rice Blast. Systemic fungicide for long-lasting protection."
        },
        {
            id: 2,
            name: "Mancozeb 75 WP (Contact)",
            category: "Pesticides",
            img: "https://5.imimg.com/data5/SELLER/Default/2022/9/TI/QO/GL/2662243/indofil-m-45-mancozeb-75-wp-contact-fungicide.png",
            mrp: 450,
            price: 380,
            discount: "15% OFF",
            rating: 4.5,
            desc: "Broad-spectrum contact fungicide. Effective for Potato Late Blight."
        },
        {
            id: 3,
            name: "Imidacloprid 17.8 SL",
            category: "Insecticides",
            img: "https://m.media-amazon.com/images/I/61S+KyC+Q+L._AC_UF1000,1000_QL80_.jpg",
            mrp: 600,
            price: 450,
            discount: "25% OFF",
            rating: 4.7,
            desc: "Systemic insecticide for sucking pests like Aphids, Jassids, and Thrips."
        },
        {
            id: 4,
            name: "Nano Urea (Liquid)",
            category: "Fertilizers",
            img: "https://www.iffco.in/assets/images/nano-urea-bottle.png",
            mrp: 240,
            price: 225,
            discount: "5% OFF",
            rating: 4.9,
            desc: "High-efficiency nitrogen fertilizer. Reduces cost and increases yield."
        },
        {
            id: 5,
            name: "Hybrid Paddy Seeds (MTU 1010)",
            category: "Seeds",
            img: "https://5.imimg.com/data5/ANDROID/Default/2021/6/CP/UY/ZA/27782729/product-jpeg-500x500.jpg",
            mrp: 1200,
            price: 950,
            discount: "20% OFF",
            rating: 4.6,
            desc: "High-yielding variety. Short duration crop (110-115 days)."
        },
        {
            id: 6,
            name: "Chlorpyrifos 20 EC",
            category: "Insecticides",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_UJLkG8HqXkXyXyXyXyXyXyXyXyXyXyXyX&s",
            mrp: 550,
            price: 420,
            discount: "23% OFF",
            rating: 4.4,
            desc: "Effective against termites and soil insects."
        },
        {
            id: 7,
            name: "Propiconazole 25 EC",
            category: "Pesticides",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NlXpZ85Tz-yY2p_w8Kz_u8W4-Jp-4X8b0w&s",
            mrp: 950,
            price: 800,
            discount: "15% OFF",
            rating: 4.8,
            desc: "Systemic fungicide for Wheat Rust and other fungal diseases."
        }
    ];

    const categories = ['All', 'Pesticides', 'Insecticides', 'Fertilizers', 'Seeds'];

    const addToCart = (product) => {
        setCart([...cart, product]);
        toast.success(`${product.name} added to cart!`);
    };

    const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <span className="px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2 inline-block">
                        Direct From Manufacturer
                    </span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                        GramAI <span className="text-primary-600">AgriMarket</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Buy authentic agricultural products at detailed <span className="text-green-600 font-bold">wholesale prices</span>.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <ShoppingBag className="w-8 h-8 text-slate-700 dark:text-white" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                                {cart.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="w-6 h-6 text-yellow-300" />
                            <span className="font-bold text-yellow-300 text-sm tracking-widest uppercase">Fast Delivery</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                            Save up to <span className="text-yellow-300">40%</span> on Pesticides today!
                        </h3>
                        <p className="text-green-100 font-medium text-lg mb-8">
                            Get direct manufacturer pricing. Cut out the middleman and maximize your profit.
                        </p>
                        <button className="bg-white text-green-800 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                            <DollarSign className="w-5 h-5" /> Shop Now
                        </button>
                    </div>
                    {/* Decorative Element */}
                    <div className="hidden md:block w-64 h-64 bg-white/20 backdrop-blur-md rounded-3xl rotate-12 border border-white/30 flex items-center justify-center">
                        <Leaf className="w-32 h-32 text-white/80" />
                    </div>
                </div>
            </div>

            {/* Filter Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${category === cat
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                    >
                        {category === cat && <Filter className="w-4 h-4" />}
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-lg hover:shadow-2xl transition-all group border border-slate-100 dark:border-slate-800"
                        >
                            <div className="relative h-64 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                    {product.discount}
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-current" /> {product.rating}
                                </div>
                            </div>

                            <div className="px-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{product.category}</p>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                                <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2 min-h-[2.5em]">{product.desc}</p>

                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold line-through">MRP: ₹{product.mrp}</p>
                                        <p className="text-2xl font-black text-primary-600 flex items-center gap-1">
                                            ₹{product.price} <span className="text-[10px] text-slate-400 font-normal">/ unit</span>
                                        </p>
                                    </div>
                                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                                        Save ₹{product.mrp - product.price}
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all active:scale-95"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                {[
                    { icon: ShieldCheck, text: "Authentic Products" },
                    { icon: Truck, text: "Express Delivery" },
                    { icon: DollarSign, text: "Best Price Guarantee" },
                    { icon: Leaf, text: "Eco-Friendly Packing" }
                ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <badge.icon className="w-8 h-8 text-primary-500 mb-2" />
                        <span className="font-bold text-sm text-slate-600 dark:text-slate-300">{badge.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgriMarket;
