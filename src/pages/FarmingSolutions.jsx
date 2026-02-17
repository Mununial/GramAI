import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, CheckCircle2, MessageCircle, ThumbsUp, Leaf, Sprout, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FarmingSolutions = () => {
    const { t, lang } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const solutions = [
        {
            id: 1,
            title: { en: "Yellowing of Rice Leaves", hi: "चावल की पत्तियों का पीलापन", or: "ଧାନ ଗଛର ପତ୍ର ହଳଦିଆ ପଡିବା" },
            category: "Disease",
            severity: "High",
            desc: "Often caused by Nitrogen deficiency or Bacterial Leaf Blight.",
            solution: "Apply Nitrogen fertilizer (Urea) in split doses. If bacterial, drain field water and apply Streptocycline.",
            votes: 124,
            verified: true,
            img: "https://www.iffco.in/assets/images/nano-urea-bottle.png"
        },
        {
            id: 2,
            title: { en: "White Grubs in Soil", hi: "मिट्टी में सफेद ग्रब", or: "ମାଟିରେ ଧଳା ପୋକ" },
            category: "Pest",
            severity: "High",
            desc: "Larvae eating roots causing wilting.",
            solution: "Deep summer ploughing to expose larvae to birds. Apply Chlorpyriphos 20 EC @ 4ml/litre near root zone.",
            votes: 89,
            verified: true,
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_UJLkG8HqXkXyXyXyXyXyXyXyXyXyXyXyX&s"
        },
        {
            id: 3,
            title: { en: "Low Wheat Yield", hi: "गेहूं की कम उपज", or: "ଗହମ ଅମଳ କମିବା" },
            category: "Management",
            severity: "Medium",
            desc: "Late sowing or improper irrigation timing.",
            solution: "Sow by Nov 15th. Irrigate at CRI stage (21 days after sowing). Use Zinc Sulphate if soil is deficient.",
            votes: 56,
            verified: true,
            img: "https://shop.krishibazaar.in/wp-content/uploads/2019/12/zinc-sulphate-monohydrate-33-percent-fertilizer-pouch-500x500.jpg"
        },
        {
            id: 4,
            title: { en: "Tomato Fruit Rot", hi: "टमाटर सड़न", or: "ଟମାଟୋ ପଚା ରୋଗ" },
            category: "Disease",
            severity: "High",
            desc: "Caused by fungal infection due to excess moisture.",
            solution: "Stake plants to keep fruits off ground. Spray Mancozeb 75 WP.",
            votes: 42,
            verified: false,
            img: "https://5.imimg.com/data5/SELLER/Default/2022/9/TI/QO/GL/2662243/indofil-m-45-mancozeb-75-wp-contact-fungicide.png"
        }
    ];

    const categories = ['All', 'Disease', 'Pest', 'Management', 'Weather'];

    const filteredSolutions = solutions.filter(s =>
        (selectedCategory === 'All' || s.category === selectedCategory) &&
        (s.title['en'].toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.title['hi']?.includes(searchQuery) ||
            s.title['or']?.includes(searchQuery))
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs uppercase tracking-wider">
                    Community & Expert Help
                </span>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                    {lang === 'or' ? 'କୃଷି ସମାଧାନ' : 'Farming Solutions'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Find expert-verified solutions to common farming problems or ask the community for help.
                </p>
            </div>

            {/* Search & Filter */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for a problem (e.g., Yellow leaves)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-transparent outline-none font-medium text-lg"
                    />
                </div>
                <div className="flex gap-2 p-1 overflow-x-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {filteredSolutions.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.category === 'Disease' ? 'bg-red-100 text-red-600' :
                                        item.category === 'Pest' ? 'bg-amber-100 text-amber-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.category}
                                    </span>
                                    {item.verified && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                                        </span>
                                    )}
                                </div>
                                <span className={`w-3 h-3 rounded-full ${item.severity === 'High' ? 'bg-red-500 animate-pulse' :
                                    item.severity === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                                    }`}></span>
                            </div>

                            <h3 className="text-xl font-black mb-2 text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                                {item.title[lang] || item.title['en']}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4 font-medium">
                                {item.desc}
                            </p>

                            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-4 relative overflow-hidden">
                                <div className="relative z-10 w-3/4">
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1 flex items-center gap-2">
                                        <Sprout className="w-4 h-4 text-green-500" /> Solution:
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.solution}
                                    </p>
                                </div>
                                {item.img && (
                                    <img src={item.img} alt="Solution" className="absolute -right-2 -bottom-2 w-20 h-20 object-contain opacity-80" />
                                )}
                            </div>

                            <div className="flex items-center justify-between text-slate-400 text-sm font-bold border-t border-slate-100 dark:border-slate-800 pt-4">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                                        <ThumbsUp className="w-4 h-4" /> {item.votes}
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                        <MessageCircle className="w-4 h-4" /> 12
                                    </button>
                                </div>
                                <button className="flex items-center gap-1 text-primary-600 hover:gap-2 transition-all">
                                    Read Details <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Ask Question Card */}
            <div className="bg-gradient-to-br from-primary-600 to-green-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black mb-2">Can't find a solution?</h3>
                        <p className="text-primary-100 font-medium text-lg">Post your problem and get help from 500+ experts and farmers.</p>
                    </div>
                    <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                        <HelpCircle className="w-6 h-6" /> Ask Community
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FarmingSolutions;
