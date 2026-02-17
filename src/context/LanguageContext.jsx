import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        dashboard: "Dashboard",
        rentTractor: "Rent a Tractor",
        services: "Rural Services",
        aiScan: "AI Crop Scan",
        chatbot: "Govt Buddy AI",
        wallet: "My Wallet",
        admin: "Admin Hub",
        providerHub: "Provider Hub",
        logout: "Logout",
        welcome: "Welcome back",
        recentActivities: "Recent Activities",
        notifications: "Notifications",
        upgrade: "Upgrade Hub",
        searchPlaceholder: "Search services, tractors...",
        odisha: "Odisha, India",
        emergency: "Emergency SOS",
        hireNow: "Hire Now",
        bookNow: "Book Now",
        eta: "ETA",
        total: "Total",
    },
    or: {
        dashboard: "ଡ୍ୟାସବୋର୍ଡ",
        rentTractor: "ଟ୍ରାକ୍ଟର ଭଡା",
        services: "ଗ୍ରାମୀଣ ସେବା",
        aiScan: "AI ଶସ୍ୟ ସ୍କାନ",
        chatbot: "ସରକାରୀ ବନ୍ଧୁ AI",
        wallet: "ମୋ ୱାଲେଟ୍",
        admin: "ଆଡମିନ୍ ହବ୍",
        providerHub: "ପ୍ରଦାନକାରୀ ହବ୍",
        logout: "ଲଗ୍ ଆଉଟ୍",
        welcome: "ସ୍ୱାଗତମ୍",
        recentActivities: "ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ",
        notifications: "ସୂଚନା",
        upgrade: "ଅପଗ୍ରେଡ୍ ହବ୍",
        searchPlaceholder: "ସେବା, ଟ୍ରାକ୍ଟର ଖୋଜନ୍ତୁ...",
        odisha: "ଓଡ଼ିଶା, ଭାରତ",
        emergency: "ଜରୁରୀକାଳୀନ ସେବା",
        hireNow: "ନିଯୁକ୍ତି କରନ୍ତୁ",
        bookNow: "ବୁକିଂ କରନ୍ତୁ",
        eta: "ଆସିବା ସମୟ",
        total: "ମୋଟ୍",
    },
    hi: {
        dashboard: "डैशबोर्ड",
        rentTractor: "ट्रैक्टर किराये पर लें",
        services: "ग्रामीण सेवाएं",
        aiScan: "AI फसल स्कैन",
        chatbot: "सरकारी साथी AI",
        wallet: "मेरा वॉलेट",
        admin: "एडमिन हब",
        providerHub: "प्रदाता हब",
        logout: "लॉग आउट",
        welcome: "स्वागत है",
        recentActivities: "हाल की गतिविधियां",
        notifications: "सूचनाएं",
        upgrade: "अपग्रेड हब",
        searchPlaceholder: "सेवाएं, ट्रैक्टर खोजें...",
        odisha: "ओडिशा, भारत",
        emergency: "आपातकालीन सेवा",
        hireNow: "अभी बुक करें",
        bookNow: "बुक करें",
        eta: "आगमन समय",
        total: "कुल",
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('gramai_lang') || 'en');

    useEffect(() => {
        localStorage.setItem('gramai_lang', lang);
    }, [lang]);

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
