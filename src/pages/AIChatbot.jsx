import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Bot, User, Sparkles, Mic, Copy,
    Languages, CheckCircle2, HelpCircle, RefreshCw,
    ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';

const AIChatbot = () => {
    const { lang } = useLanguage(); // en, hi, or
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // 1. Knowledge Base (Inlined for reliability)
    const knowledgeBase = [
        {
            keywords: ['pm kisan', 'pm-kisan', '6000', 'samman nidhi', 'पीएम किसान', 'ପିଏମ କିଷାନ'],
            response: {
                en: "**PM-KISAN Scheme**\n\n✅ **Benefit:** ₹6000/year (3 installments of ₹2000).\n👤 **Eligibility:** All landholding farmer families.\n📄 **Documents:** Aadhaar, Land Record, Bank Passbook.\n🚀 **Status:** Check at pmkisan.gov.in.",
                hi: "**पीएम-किसान योजना**\n\n✅ **लाभ:** ₹6000/वर्ष (₹2000 की 3 किस्तें)।\n👤 **पात्रता:** सभी भूमिधारी किसान परिवार।\n📄 **दस्तावेज:** आधार, जमीन के कागज, बैंक पासबुक।\n🚀 **स्थिति:** pmkisan.gov.in पर चेक करें।",
                or: "**ପିଏମ-କିଷାନ ଯୋଜନା**\n\n✅ **ଲାଭ:** ₹6000/ବର୍ଷ (₹2000 ର 3 କିସ୍ତି)।\n👤 **ଯୋଗ୍ୟତା:** ସମସ୍ତ ଜମିମାଲିକ ଚାଷୀ ପରିବାର।\n📄 **ଦଲିଲ:** ଆଧାର, ଜମି ପଟ୍ଟା, ବ୍ୟାଙ୍କ Passbook।\n🚀 **ସ୍ଥିତି:** pmkisan.gov.in ରେ ଦେଖନ୍ତୁ।"
            }
        },
        {
            keywords: ['kalia', 'kalia yojana', 'odisha scheme', 'କାଳିଆ', 'कालिया'],
            response: {
                en: "**KALIA Yojana**\n\n✅ **Benefit:** ₹10,000/year for cultivators; ₹12,500 for landless.\n👤 **Eligibility:** Small/Marginal farmers & Landless labourers.\n🚀 **Apply:** Visit kalia.odisha.gov.in.",
                hi: "**कालिया योजना**\n\n✅ **लाभ:** किसानों के लिए ₹10,000/वर्ष; भूमिहीनों के लिए ₹12,500।\n👤 **पात्रता:** छोटे/सीमांत किसान और भूमिहीन मजदूर।\n🚀 **आवेदन:** kalia.odisha.gov.in पर जाएं।",
                or: "**କାଳିଆ ଯୋଜନା**\n\n✅ **ଲାଭ:** ଚାଷୀଙ୍କ ପାଇଁ ₹10,000/ବର୍ଷ; ଭୂମିହୀନଙ୍କ ପାଇଁ ₹12,500।\n👤 **ଯୋଗ୍ୟତା:** କ୍ଷୁଦ୍ର/ନାମମାତ୍ର ଚାଷୀ ଏବଂ ଭୂମିହୀନ ଶ୍ରମିକ।\n🚀 **ଆବେଦନ:** kalia.odisha.gov.in ରେ କରନ୍ତୁ।"
            }
        },
        {
            keywords: ['soil', 'soil health', 'testing', 'मिट्टी', 'ମାଟି'],
            response: {
                en: "**Soil Health Card**\n\n🧪 Test your soil to know which fertilizer is best.\n📍 Visit nearest Krishi Vigyan Kendra (KVK).\n💰 **Cost:** Free or nominal fee.",
                hi: "**मृदा स्वास्थ्य कार्ड**\n\n🧪 अपनी मिट्टी की जांच कराएं ताकि सही खाद का पता चले।\n📍 नजदीकी कृषि विज्ञान केंद्र (KVK) जाएं।\n💰 **लागत:** मुफ्त या नाममात्र शुल्क।",
                or: "**ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ**\n\n🧪 ଆପଣଙ୍କ ମାଟି ପରୀକ୍ଷା କରାନ୍ତୁ ଏବଂ ସଠିକ୍ ସାର ବ୍ୟବହାର କରନ୍ତୁ।\n📍 ନିକଟସ୍ଥ କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ର (KVK) ଯାଆନ୍ତୁ।\n💰 **ମୂଲ୍ୟ:** ମାଗଣା କିମ୍ବା ଅଳ୍ପ ଦେୟ।"
            }
        },
        {
            keywords: ['weather', 'rain', 'monsoon', 'बारिश', 'मौसम', 'ବର୍ଷା', 'ପାଗ'],
            response: {
                en: "☁️ **Weather Update**\n\nPlease verify with IMD.\nGenerally, Monsoon arrives in June. For live updates, check the Dashboard.",
                hi: "☁️ **मौसम अपडेट**\n\nकृपया IMD से जांच करें।\nआमतौर पर मानसून जून में आता है। लाइव अपडेट के लिए डैशबोर्ड देखें।",
                or: "☁️ **ପାଗ ସୂଚନା**\n\nଦୟାକରି IMD ସହ ଯାଞ୍ଚ କରନ୍ତୁ।\nସାଧାରଣତଃ ମୌସୁମୀ ଜୁନ୍ ମାସରେ ଆସେ। ଲାଇଭ୍ ଅପଡେଟ୍ ପାଇଁ ଡ୍ୟାସବୋର୍ଡ ଦେଖନ୍ତୁ।"
            }
        },
        {
            keywords: ['loan', 'kcc', 'credit', 'लोन', 'ଋଣ'],
            response: {
                en: "**Kisan Credit Card (KCC)**\n\n💳 Get loan at 4% interest (with subsidy).\n🏦 Apply at any Nationalized Bank.\n📄 Needs Land Record & Aadhaar.",
                hi: "**किसान क्रेडिट कार्ड (KCC)**\n\n💳 4% ब्याज पर लोन प्राप्त करें (सब्सिडी के साथ)।\n🏦 किसी भी राष्ट्रीयकृत बैंक में आवेदन करें।\n📄 जमीन के कागज और आधार की जरूरत है।",
                or: "**କିଷାନ କ୍ରେଡିଟ୍ କାର୍ଡ (KCC)**\n\n💳 4% ସୁଧରେ ଋଣ ପାଆନ୍ତୁ (ସବସିଡି ସହିତ)।\n🏦 ଯେକୌଣସି ଜାତୀୟ ବ୍ୟାଙ୍କରେ ଆବେଦନ କରନ୍ତୁ।\n📄 ଜମି ପଟ୍ଟା ଏବଂ ଆଧାର ଆବଶ୍ୟକ।"
            }
        }
    ];

    const defaultResponses = {
        en: [
            "I'm not sure about that, but I can help with PM-KISAN, KALIA, or Soil Testing.",
            "Can you ask in a different way? Try asking 'What is PM-KISAN?'"
        ],
        hi: [
            "मुझे इसके बारे में पक्का नहीं पता, लेकिन मैं पीएम-किसान, कालिया या मिट्टी परीक्षण में मदद कर सकता हूं।",
            "क्या आप अलग तरीके से पूछ सकते हैं? 'पीएम-किसान क्या है' पूछने का प्रयास करें।"
        ],
        or: [
            "ମୁଁ ସେ ବିଷୟରେ ଜାଣିନାହିଁ, କିନ୍ତୁ ମୁଁ ପିଏମ-କିଷାନ, କାଳିଆ କିମ୍ବା ମାଟି ପରୀକ୍ଷା ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି।",
            "ଦୟାକରି ଅନ୍ୟ ଉପାୟରେ ପଚାରନ୍ତୁ। 'ପିଏମ-କିଷାନ କ’ଣ' ପଚାରିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ।"
        ]
    };

    // 2. Initialize
    useEffect(() => {
        const welcomeMsg = {
            en: "Namaste! I am your Govt Buddy for Agriculture. Ask me about schemes, loans, or farming tips.",
            hi: "नमस्ते! मैं कृषि के लिए आपका सरकारी साथी हूं। मुझसे योजनाओं, ऋण या खेती के सुझावों के बारे में पूछें।",
            or: "ନମସ୍କାର! ମୁଁ କୃଷି ପାଇଁ ଆପଣଙ୍କର ସରକାରୀ ବନ୍ଧୁ। ମୋତେ ଯୋଜନା, ଋଣ କିମ୍ବା ଚାଷ ବିଷୟରେ ପଚାରନ୍ତୁ।"
        };
        setMessages([{
            role: 'bot',
            content: welcomeMsg[lang] || welcomeMsg['en'],
            time: new Date()
        }]);
    }, [lang]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // 3. Logic
    const handleSend = async (text) => {
        const userText = text || input;
        if (!userText.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: userText, time: new Date() }]);
        setInput('');
        setIsTyping(true);

        // Find match
        let responseText = '';
        const lowerText = userText.toLowerCase();

        const match = knowledgeBase.find(kb =>
            kb.keywords.some(k => lowerText.includes(k.toLowerCase()))
        );

        if (match) {
            responseText = match.response[lang] || match.response['en'];
        } else {
            // Random default response
            const defaults = defaultResponses[lang] || defaultResponses['en'];
            responseText = defaults[Math.floor(Math.random() * defaults.length)];
        }

        setMessages(prev => [...prev, { role: 'bot', content: responseText, time: new Date() }]);
        setIsTyping(false);

        // Text to Speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(responseText.replace(/\*\*/g, '').replace(/✅|👤|📄|🚀/g, ''));
            utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'or' ? 'hi-IN' : 'en-US'; // Oriya TTS support is rare, fallback to Hindi/English
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Your browser doesn't support Voice Input.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'or' ? 'or-IN' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        toast.info(lang === 'or' ? "ଶୁଣୁଛି..." : "Listening...", {
            autoClose: 3000,
            icon: <Mic className="animate-pulse text-red-500" />
        });

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            setInput(speechResult);
            setTimeout(() => handleSend(speechResult), 500);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            toast.error("Voice input failed. Try again.");
        };
    };

    const suggestions = [
        { en: "PM-Kisan Status", hi: "पीएम-किसान स्थिति", or: "ପିଏମ-କିଷାନ ସ୍ଥିତି" },
        { en: "KCC Loan Apply", hi: "KCC लोन आवेदन", or: "KCC ଋଣ ଆବେଦନ" },
        { en: "Mandi Prices", hi: "मंडी भाव", or: "ମଣ୍ଡି ଦର" },
        { en: "Weather Today", hi: "आज का मौसम", or: "ଆଜିର ପାଗ" }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between text-white z-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black flex items-center gap-2">
                            Govt Buddy <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                        </h3>
                        <p className="text-white/80 font-medium text-sm">
                            {lang === 'or' ? 'ଆପଣଙ୍କ ସରକାରୀ ସାଥୀ' : lang === 'hi' ? 'आपका सरकारी साथी' : 'Your Agriculture Assistant'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                    <button
                        onClick={() => setMessages([])}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                        title="Clear Chat"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                <div className="text-center text-xs font-bold text-slate-400 my-4 uppercase tracking-widest">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>

                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                        <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.role === 'bot' && (
                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg border border-white/20">
                                    <Bot className="w-5 h-5" />
                                </div>
                            )}

                            <div className={`p-4 rounded-[1.25rem] shadow-sm relative group text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                }`}>
                                <div className="whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                                <div className={`text-[10px] mt-1.5 font-bold opacity-60 flex items-center gap-1 ${msg.role === 'user' ? 'text-indigo-100 justify-end' : 'text-slate-400'}`}>
                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.role === 'bot' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 animate-pulse">Govt Buddy is typing...</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-10">
                {/* Suggestions Pills */}
                <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(s[lang] || s['en'])}
                            className="flex-shrink-0 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md"
                        >
                            {s[lang] || s['en']}
                        </button>
                    ))}
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner"
                >
                    <button
                        type="button"
                        onClick={handleVoice}
                        className="p-4 bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 rounded-full shadow-sm hover:shadow-md transition-all"
                    >
                        <Mic className="w-6 h-6" />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={lang === 'or' ? "ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ..." : lang === 'hi' ? "योजनाओं के बारे में पूछें..." : "Ask about schemes..."}
                        className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-base font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-full transition-all shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChatbot;
