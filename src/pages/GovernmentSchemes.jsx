import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import {
    IndianRupee, FileText, CheckCircle2, AlertCircle,
    ChevronRight, Download, Phone, MapPin, Calendar,
    Users, Shield, Sprout, Tractor, Warehouse, CloudRain,
    BookOpen, Video, ExternalLink, Search, Filter,
    TrendingUp, Award, Building2, Landmark, Info, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const GovernmentSchemes = () => {
    const { lang } = useLanguage(); // en, hi, or
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const generatePDF = (scheme) => {
        try {
            const doc = new jsPDF();
            const title = getVal(scheme.name);

            doc.setFontSize(20);
            // Split title if too long
            const splitTitle = doc.splitTextToSize(title, 170);
            doc.text(splitTitle, 20, 20);

            doc.setFontSize(12);
            doc.text(`Category: ${scheme.category.toUpperCase()}`, 20, 40);

            const desc = doc.splitTextToSize(getVal(scheme.description), 170);
            doc.text(desc, 20, 50);

            let y = 70;
            doc.setFontSize(14);
            doc.text("Benefits:", 20, y);
            y += 10;
            doc.setFontSize(12);
            const benefits = doc.splitTextToSize(getVal(scheme.benefit), 170);
            doc.text(benefits, 20, y);

            y += 20 + (benefits.length * 5);

            doc.setFontSize(14);
            doc.text("Eligibility:", 20, y);
            y += 10;
            doc.setFontSize(12);
            const eligibility = doc.splitTextToSize(getVal(scheme.eligibility), 170);
            doc.text(eligibility, 20, y);

            doc.save(`${title.substring(0, 10)}_guide.pdf`);
            toast.success("Scheme Guide Downloaded!");
        } catch (error) {
            console.error(error);
            toast.error("Could not generate PDF");
        }
    };
    const [filterCategory, setFilterCategory] = useState('all');

    // UI Translations
    const ui = {
        title: {
            en: 'Government Schemes & Solutions',
            hi: 'सरकारी योजनाएं और समाधान',
            or: 'ସରକାରୀ ଯୋଜନା ଓ ସମାଧାନ'
        },
        subtitle: {
            en: 'Complete guide to utilize government schemes - Step by step process, documents, and solutions',
            hi: 'सरकारी योजनाओं का लाभ उठाने के लिए पूरी गाइड - चरण दर चरण प्रक्रिया, दस्तावेज और समाधान',
            or: 'ସରକାରୀ ଯୋଜନାର ଲାଭ ଉଠାଇବା ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍ - ଷ୍ଟେପ୍ ବାଏ ଷ୍େଟପ୍ ପ୍ରକ୍ରିୟା, ଦସ୍ତାବିଜ ଏବଂ ସମାଧାନ'
        },
        searchPlaceholder: {
            en: 'Search schemes by name or description...',
            hi: 'नाम या विवरण द्वारा योजनाएं खोजें...',
            or: 'ନାମ କିମ୍ବା ବିବରଣୀ ଦ୍ୱାରା ଯୋଜନା ଖୋଜନ୍ତୁ...'
        },
        activeSchemes: {
            en: 'Active Schemes',
            hi: 'सक्रिय योजनाएं',
            or: 'ସକ୍ରିୟ ଯୋଜନା'
        },
        benefit: { en: 'Benefit', hi: 'लाभ', or: 'ଲାଭ' },
        eligibility: { en: 'Eligibility', hi: 'पात्रता', or: 'ଯୋଗ୍ୟତା' },
        helpline: { en: 'Helpline', hi: 'हेल्पलाइन', or: 'ହେଲ୍ପଲାଇନ' },
        documents: { en: 'Required Documents', hi: 'आवश्यक दस्तावेज', or: 'ଆବଶ୍ୟକ ଦସ୍ତାବିଜ' },
        steps: { en: 'Application Process', hi: 'आवेदन प्रक्रिया', or: 'ଆବେଦନ ପ୍ରକ୍ରିୟା' },
        issues: { en: 'Common Issues', hi: 'सामान्य समस्याएं', or: 'ସାଧାରଣ ସମସ୍ୟା' },
        tips: { en: 'Pro Tips', hi: 'प्रो टिप्स', or: 'ପ୍ରୋ ଟିପ୍ସ' },
        viewGuide: { en: 'View Complete Guide', hi: 'पूरी गाइड देखें', or: 'ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍ ଦେଖନ୍ତୁ' },
        officialSite: { en: 'Visit Official Website', hi: 'आधिकारिक वेबसाइट पर जाएं', or: 'ଅଫିସିଆଲ୍ ୱେବସାଇଟ୍ ପରିଦର୍ଶନ କରନ୍ତୁ' },
        watchVideo: { en: 'Watch Tutorial', hi: 'ट्यूटोरियल देखें', or: 'ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖନ୍ତୁ' },
        downloadPdf: { en: 'Download PDF', hi: 'PDF डाउनलोड करें', or: 'PDF ଡାଉନଲୋଡ୍ କରନ୍ତୁ' }
    };

    const getVal = (obj) => obj[lang] || obj['en'];

    const schemes = [
        {
            id: 1,
            name: {
                en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
                hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
                or: 'ପିଏମ-କିଷାନ (ପ୍ରଧାନମନ୍ତ୍ରୀ କିଷାନ ସମ୍ମାନ ନିଧି)'
            },
            category: 'financial',
            icon: IndianRupee,
            color: 'bg-green-600',
            benefit: {
                en: '₹6,000/year (₹2,000 every 4 months)',
                hi: '₹6,000/वर्ष (हर 4 महीने में ₹2,000)',
                or: '₹6,000/ବର୍ଷ (ପ୍ରତି 4 ମାସରେ ₹2,000)'
            },
            eligibility: {
                en: 'All landholding farmers',
                hi: 'सभी भूमिधारी किसान',
                or: 'ସମସ୍ତ ଜମିମାଲିକ ଚାଷୀ'
            },
            description: {
                en: 'Direct income support to all landholding farmers to supplement their financial needs.',
                hi: 'किसानों की वित्तीय जरूरतों को पूरा करने के लिए प्रत्यक्ष आय सहायता।',
                or: 'ଚାଷୀମାନଙ୍କର ଆର୍ଥିକ ଆବଶ୍ୟକତା ପୂରଣ କରିବା ପାଇଁ ପ୍ରତ୍ୟକ୍ଷ ଆୟ ସହାୟତା।'
            },
            documents: [
                { en: 'Aadhaar Card', hi: 'आधार कार्ड', or: 'ଆଧାର କାର୍ଡ' },
                { en: 'Bank Account Details (with IFSC)', hi: 'बैंक खाता विवरण', or: 'ବ୍ୟାଙ୍କ ଖାତା ବିବରଣୀ' },
                { en: 'Land Ownership Documents', hi: 'भूमि स्वामित्व दस्तावेज', or: 'ଜମି ମାଲିକାନା ଦସ୍ତାବିଜ' }
            ],
            steps: [
                { en: 'Visit PM-KISAN portal', hi: 'पीएम-किसान पोर्टल पर जाएं', or: 'PM-KISAN ପୋର୍ଟାଲ ପରିଦର୍ଶନ କରନ୍ତୁ' },
                { en: 'New Farmer Registration', hi: 'नया किसान पंजीकरण', or: 'ନୂତନ ଚାଷୀ ପଞ୍ଜିକରଣ' },
                { en: 'Enter Aadhaar details', hi: 'आधार विवरण दर्ज करें', or: 'ଆଧାର ବିବରଣୀ ଦିଅନ୍ତୁ' }
            ],
            helpline: '155261 / 011-24300606',
            website: 'https://pmkisan.gov.in',
            videoUrl: '#',
            commonIssues: [
                { en: 'Aadhaar not linked', hi: 'आधार लिंक नहीं है', or: 'ଆଧାର ଲିଙ୍କ୍ ନାହିଁ' }
            ],
            tips: [
                { en: 'Keep mobile active', hi: 'मोबाइल नंबर चालू रखें', or: 'ମୋବାଇଲ୍ ନମ୍ବର ସକ୍ରିୟ ରଖନ୍ତୁ' }
            ]
        },
        {
            id: 2,
            name: {
                en: 'Soil Health Card Scheme',
                hi: 'मृदा स्वास्थ्य कार्ड योजना',
                or: 'ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ଯୋଜନା'
            },
            category: 'agricultural',
            icon: Sprout,
            color: 'bg-purple-600',
            benefit: {
                en: 'Free soil testing & recommendations',
                hi: 'मुफ्त मिट्टी परीक्षण और सलाह',
                or: 'ମାଗଣା ମାଟି ପରୀକ୍ଷା ଏବଂ ପରାମର୍ଶ'
            },
            eligibility: {
                en: 'All farmers',
                hi: 'सभी किसान',
                or: 'ସମସ୍ତ ଚାଷୀ'
            },
            description: {
                en: 'Get your soil tested for free and receive customized fertilizer recommendations.',
                hi: 'अपनी मिट्टी का मुफ्त परीक्षण कराएं और खाद की सिफारिशें प्राप्त करें।',
                or: 'ଆପଣଙ୍କ ମାଟିର ମାଗଣା ପରୀକ୍ଷା କରାନ୍ତୁ ଏବଂ ସାର ପରାମର୍ଶ ପାଆନ୍ତୁ।'
            },
            documents: [
                { en: 'Aadhaar Card', hi: 'आधार कार्ड', or: 'ଆଧାର କାର୍ଡ' },
                { en: 'Soil Sample', hi: 'मिट्टी का नमूना', or: 'ମାଟି ନମୁନା' }
            ],
            steps: [
                { en: 'Visit Soil Testing Lab', hi: 'मिट्टी परीक्षण प्रयोगशाला जाएं', or: 'ମାଟି ପରୀକ୍ଷା କେନ୍ଦ୍ର ଯାଆନ୍ତୁ' },
                { en: 'Submit sample', hi: 'नमूना जमा करें', or: 'ନମୁନା ଜମା କରନ୍ତୁ' }
            ],
            helpline: '1800-180-1551',
            website: 'https://soilhealth.dac.gov.in',
            videoUrl: '#',
            commonIssues: [
                { en: 'Report delay', hi: 'रिपोर्ट में देरी', or: 'ରିପୋର୍ଟ ବିଳମ୍ବ' }
            ],
            tips: [
                { en: 'Test every 2 years', hi: 'हर 2 साल में टेस्ट करें', or: 'ପ୍ରତି 2 ବର୍ଷରେ ପରୀକ୍ଷା କରନ୍ତୁ' }
            ]
        },
        {
            id: 3,
            name: {
                en: 'PMFBY (Crop Insurance)',
                hi: 'PMFBY (फसल बीमा योजना)',
                or: 'PMFBY (ଫସଲ ବୀମା ଯୋଜନା)'
            },
            category: 'insurance',
            icon: Shield,
            color: 'bg-red-600',
            benefit: {
                en: 'Crop insurance at low premium',
                hi: 'कम प्रीमियम पर फसल बीमा',
                or: 'କମ୍ ପ୍ରିମିୟମରେ ଫସଲ ବୀମା'
            },
            eligibility: {
                en: 'All farmers',
                hi: 'सभी किसान',
                or: 'ସମସ୍ତ ଚାଷୀ'
            },
            description: {
                en: 'Comprehensive crop insurance covering yield losses due to natural calamities.',
                hi: 'प्राकृतिक आपदाओं के कारण फसल के नुकसान को कवर करने वाला बीमा।',
                or: 'ପ୍ରାକୃତିକ ବିପର୍ଯ୍ୟୟ ଯୋଗୁଁ ଫସଲ କ୍ଷତି ଭରଣା କରୁଥିବା ବୀମା।'
            },
            documents: [
                { en: 'Land Records', hi: 'भूमि रिकॉर्ड', or: 'ଜମି ରେକର୍ଡ' },
                { en: 'Sowing Certificate', hi: 'बुवाई प्रमाण पत्र', or: 'ବୁଣା ପ୍ରମାଣପତ୍ର' }
            ],
            steps: [
                { en: 'Visit Bank/CSC', hi: 'बैंक/सीएससी पर जाएं', or: 'ବ୍ୟାଙ୍କ/CSC ଯାଆନ୍ତୁ' },
                { en: 'Pay Premium', hi: 'प्रीमियम भरें', or: 'ପ୍ରିମିୟମ୍ ଦିଅନ୍ତୁ' }
            ],
            helpline: '1800-180-1111',
            website: 'https://pmfby.gov.in',
            videoUrl: '#',
            commonIssues: [],
            tips: []
        },
        {
            id: 4,
            name: {
                en: 'Kisan Credit Card (KCC)',
                hi: 'किसान क्रेडिट कार्ड (KCC)',
                or: 'କିଷାନ କ୍ରେଡିଟ୍ କାର୍ଡ (KCC)'
            },
            category: 'financial',
            icon: Award,
            color: 'bg-blue-600',
            benefit: {
                en: 'Credit up to ₹3 lakh @ 4%',
                hi: '₹3 लाख तक ऋण @ 4%',
                or: '₹3 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ଋଣ @ 4%'
            },
            eligibility: {
                en: 'Land owners',
                hi: 'भूमि मालिक',
                or: 'ଜମି ମାଲିକ'
            },
            description: {
                en: 'Low interest credit for agricultural needs.',
                hi: 'कृषि जरूरतों के लिए कम ब्याज पर ऋण।',
                or: 'ଚାଷ କାର୍ଯ୍ୟ ପାଇଁ କମ୍ ସୁଧରେ ଋଣ।'
            },
            documents: [],
            steps: [],
            helpline: 'Bank Helpline',
            website: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc',
            videoUrl: '#',
            commonIssues: [],
            tips: []
        },
        {
            id: 5,
            name: {
                en: 'MSP (Minimum Support Price)',
                hi: 'न्यूनतम समर्थन मूल्य (MSP)',
                or: 'ସର୍ବନିମ୍ନ ସହାୟକ ମୂଲ୍ୟ (MSP)'
            },
            category: 'marketing',
            icon: TrendingUp,
            color: 'bg-amber-600',
            benefit: {
                en: 'Guaranteed price for crops',
                hi: 'फसलों के लिए गारंटीकृत मूल्य',
                or: 'ଫସଲ ପାଇଁ ଗ୍ୟାରେଣ୍ଟି ମୂଲ୍ୟ'
            },
            eligibility: {
                en: 'All farmers',
                hi: 'सभी किसान',
                or: 'ସମସ୍ତ ଚାଷୀ'
            },
            description: {
                en: 'Govt ensures minimum price for your crops.',
                hi: 'सरकार आपकी फसलों के लिए न्यूनतम मूल्य सुनिश्चित करती है।',
                or: 'ସରକାର ଆପଣଙ୍କ ଫସଲ ପାଇଁ ସର୍ବନିମ୍ନ ମୂଲ୍ୟ ସୁନିଶ୍ଚିତ କରନ୍ତି।'
            },
            documents: [],
            steps: [],
            helpline: '1800-270-0224',
            website: 'https://enam.gov.in',
            videoUrl: '#',
            commonIssues: [],
            tips: []
        },
        {
            id: 6,
            name: {
                en: 'Krishi Vigyan Kendra Training',
                hi: 'कृषि विज्ञान केंद्र प्रशिक्षण',
                or: 'କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ର ତାଲିମ'
            },
            category: 'training',
            icon: BookOpen,
            color: 'bg-emerald-600',
            benefit: {
                en: 'Free farming training',
                hi: 'मुफ्त खेती प्रशिक्षण',
                or: 'ମାଗଣା ଚାଷ ତାଲିମ'
            },
            eligibility: {
                en: 'Anyone',
                hi: 'कोई भी',
                or: 'ଯେକେହି'
            },
            description: {
                en: 'Learn modern farming techniques.',
                hi: 'आधुनिक खेती तकनीक सीखें।',
                or: 'ଆଧୁନିକ ଚାଷ ପ୍ରଣାଳୀ ଶିଖନ୍ତୁ।'
            },
            documents: [],
            steps: [],
            helpline: 'KVK Center',
            website: 'https://kvk.icar.gov.in',
            videoUrl: '#',
            commonIssues: [],
            tips: []
        }
    ];

    const categories = [
        { id: 'all', name: { en: 'All Schemes', hi: 'सभी योजनाएं', or: 'ସମସ୍ତ ଯୋଜନା' }, icon: Landmark },
        { id: 'financial', name: { en: 'Financial', hi: 'वित्तीय', or: 'ଆର୍ଥିକ' }, icon: IndianRupee },
        { id: 'insurance', name: { en: 'Insurance', hi: 'बीमा', or: 'ବୀମା' }, icon: Shield },
        { id: 'agricultural', name: { en: 'Agriculture', hi: 'कृषि', or: 'କୃଷି' }, icon: Sprout },
        { id: 'training', name: { en: 'Training', hi: 'प्रशिक्षण', or: 'ତାଲିମ' }, icon: BookOpen },
        { id: 'marketing', name: { en: 'Marketing', hi: 'विपणन', or: 'ମାର୍କେଟିଂ' }, icon: TrendingUp },
        { id: 'storage', name: { en: 'Storage', hi: 'भंडारण', or: 'ଭଣ୍ଡାର' }, icon: Warehouse }
    ];

    const filteredSchemes = schemes.filter(scheme => {
        const sName = getVal(scheme.name);
        const sDesc = getVal(scheme.description);
        const matchesSearch = sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sDesc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || scheme.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl">
                                <Landmark className="w-8 h-8 text-white" />
                            </div>
                            {getVal(ui.title)}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            {getVal(ui.subtitle)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-6 py-3 rounded-2xl border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-xs font-bold text-green-600 uppercase">Available Now</p>
                            <p className="text-sm font-black text-green-700 dark:text-green-400">{schemes.length} {getVal(ui.activeSchemes)}</p>
                        </div>
                    </div>
                </div>

                {/* OSP Portal Integration Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-900/20"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">New Integration</span>
                                <span className="flex items-center gap-1 text-xs font-bold text-indigo-100"><ShieldCheck className="w-3 h-3" /> Official Partner</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black mb-2">Odisha Service Point</h3>
                            <p className="text-indigo-100 font-medium max-w-xl">
                                Direct application gateway for exclusive farmer services. Collaborate and apply for multiple state schemes in one place.
                            </p>
                        </div>
                        <a
                            href="https://bhagyabratagantayat.github.io/OSP/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAP-wYpleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaeJM08_5Lv58TaCka6qPDLXvvyVUTHKTlLq8IGzpDrP7o0Ld-z94QX7_iQKgg_aem_1qGqgNggNfVzbrFp0mdCwg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3.5 rounded-xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
                        >
                            Visit Service Point <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={getVal(ui.searchPlaceholder)}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilterCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterCategory === cat.id
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {getVal(cat.name)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map(scheme => (
                    <motion.div
                        key={scheme.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedScheme(scheme)}
                        className="glass-card p-6 rounded-3xl cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${scheme.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                <scheme.icon className="w-6 h-6 text-white" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                        </div>

                        <h3 className="text-lg font-black mb-2 line-clamp-2">{getVal(scheme.name)}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{getVal(scheme.description)}</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-xl">
                                <IndianRupee className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-green-700 dark:text-green-400">{getVal(scheme.benefit)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-xl">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{getVal(scheme.eligibility)}</span>
                            </div>
                        </div>

                        <button className="w-full mt-4 btn-primary py-3 text-sm">
                            {getVal(ui.viewGuide)}
                        </button>
                    </motion.div>
                ))}
            </div>

            {filteredSchemes.length === 0 && (
                <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 dark:text-slate-600">No schemes found</h3>
                </div>
            )}

            {/* Detailed Scheme Modal */}
            <AnimatePresence>
                {selectedScheme && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedScheme(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className={`${selectedScheme.color} p-8 text-white relative`}>
                                <button
                                    onClick={() => setSelectedScheme(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-white/20 rounded-2xl">
                                        <selectedScheme.icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-black mb-2">{getVal(selectedScheme.name)}</h2>
                                        <p className="text-white/90 font-medium">{getVal(selectedScheme.description)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 space-y-8">
                                {/* Quick Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-2xl">
                                        <p className="text-xs font-bold text-green-600 uppercase mb-1">{getVal(ui.benefit)}</p>
                                        <p className="text-lg font-black text-green-700 dark:text-green-400">{getVal(selectedScheme.benefit)}</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl">
                                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">{getVal(ui.eligibility)}</p>
                                        <p className="text-lg font-black text-blue-700 dark:text-blue-400">{getVal(selectedScheme.eligibility)}</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-2xl">
                                        <p className="text-xs font-bold text-purple-600 uppercase mb-1">{getVal(ui.helpline)}</p>
                                        <p className="text-lg font-black text-purple-700 dark:text-purple-400">{selectedScheme.helpline}</p>
                                    </div>
                                </div>

                                {/* Required Documents */}
                                {selectedScheme.documents?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-primary-600" />
                                            {getVal(ui.documents)}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedScheme.documents.map((doc, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    <span className="font-bold text-sm">{getVal(doc)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step by Step Process */}
                                {selectedScheme.steps?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                            <BookOpen className="w-6 h-6 text-primary-600" />
                                            {getVal(ui.steps)}
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedScheme.steps.map((step, idx) => (
                                                <div key={idx} className="flex gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-black text-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                                        <p className="font-bold">{getVal(step)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Common Issues & Solutions */}
                                {selectedScheme.commonIssues?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-6 h-6 text-amber-600" />
                                            {getVal(ui.issues)}
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedScheme.commonIssues.map((issue, idx) => (
                                                <div key={idx} className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border-l-4 border-amber-500">
                                                    <p className="font-bold text-sm">{getVal(issue)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pro Tips */}
                                {selectedScheme.tips?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                            <Info className="w-6 h-6 text-blue-600" />
                                            {getVal(ui.tips)}
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedScheme.tips.map((tip, idx) => (
                                                <div key={idx} className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl">
                                                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <p className="font-bold text-sm">{getVal(tip)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <a
                                        href={selectedScheme.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-xl font-black hover:bg-primary-700 transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        {getVal(ui.officialSite)}
                                    </a>
                                    <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl font-black hover:bg-green-700 transition-colors">
                                        <Video className="w-5 h-5" />
                                        {getVal(ui.watchVideo)}
                                    </button>
                                    <button
                                        onClick={() => generatePDF(selectedScheme)}
                                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-black hover:bg-blue-700 transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                        {getVal(ui.downloadPdf)}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GovernmentSchemes;
