const ODIA_VILLAGES = ["Pipili", "Nimapara", "Konark", "Kakatpur", "Satyabadi", "Jatni", "Khurda", "Balakati", "Chandaka", "Athagarh", "Salepur", "Jagatsinghpur", "Paradip", "Kendrapada", "Rajnagar", "Bhadrak", "Dhamra", "Balasore", "Soro", "Jaleswar"];
const NAMES = ["Rajesh Kumar", "Sanjay Mohanty", "Anjali Dash", "Priyanka Sahoo", "Amit Patnaik", "Subhashree Nayak", "Bikash Jena", "Deepak Rout", "Sasmita Behera", "Tapan Mishra", "Manas Swain", "Jyoti Prakash", "Sumitra Deo", "Ranjit Samal", "Rashmita Pradhan", "Prabhat Sethi", "Gitanjali Mallick", "Satyajit Tripathy", "Bijay Barik", "Monalisa Panda"];

const generateID = () => Math.random().toString(36).substr(2, 9);
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

export const farmers = Array.from({ length: 60 }).map((_, i) => ({
    id: `farmer_${i + 1}`,
    name: `${getRandom(NAMES)} ${i}`,
    phone: `+91 ${9000000000 + Math.floor(Math.random() * 1000000000)}`,
    village: getRandom(ODIA_VILLAGES),
    district: "Puri",
    crop: getRandom(["Paddy", "Wheat", "Sugarcane", "Moong", "Jute", "Cotton"]),
    tier: getRandom(["Free", "Silver", "Gold", "Platinum"]),
    joinedAt: getRandomDate(new Date(2025, 0, 1), new Date()),
    walletBalance: Math.floor(Math.random() * 5000),
}));

export const providers = Array.from({ length: 40 }).map((_, i) => ({
    id: `provider_${i + 1}`,
    name: `${getRandom(NAMES)} Services`,
    phone: `+91 ${9000000000 + Math.floor(Math.random() * 1000000000)}`,
    serviceType: getRandom(["Tractor", "Electrician", "Plumber", "Harvester"]),
    specialty: getRandom(["Engine Repair", "Irrigation", "Wiring", "Pipe Fitting"]),
    experience: Math.floor(Math.random() * 15) + 1,
    rating: (Math.random() * 2 + 3).toFixed(1),
    status: getRandom(["Active", "Pending", "Inactive"]),
    village: getRandom(ODIA_VILLAGES),
}));

export const tractors = Array.from({ length: 25 }).map((_, i) => ({
    id: `tractor_${i + 1}`,
    model: getRandom(["Mahindra Yuvo 575", "John Deere 5050D", "Swaraj 744 FE", "Eicher 380", "Massey Ferguson 241"]),
    hp: getRandom([35, 45, 50, 55, 60]),
    pricePerHour: getRandom([500, 600, 750, 800, 1000]),
    owner: getRandom(providers).name,
    availability: Math.random() > 0.3,
    location: { lat: 20.2961 + (Math.random() - 0.5) * 0.1, lng: 85.8245 + (Math.random() - 0.5) * 0.1 },
    img: `https://images.unsplash.com/photo-1594487730598-a6691c29e1eb?auto=format&fit=crop&q=80&w=400`,
    status: getRandom(["Ready", "In Use", "Maintenance"]),
}));

export const bookings = Array.from({ length: 100 }).map((_, i) => ({
    id: `book_${i + 1}`,
    farmerId: getRandom(farmers).id,
    farmerName: getRandom(farmers).name,
    serviceId: getRandom([...tractors, ...providers]).id,
    type: i % 2 === 0 ? "Tractor" : "Technician",
    status: getRandom(["Completed", "In Progress", "Requested", "Cancelled"]),
    date: getRandomDate(new Date(2025, i > 50 ? 0 : 1, 1), new Date()),
    amount: Math.floor(Math.random() * 3000) + 500,
    paymentStatus: getRandom(["Paid", "Pending", "Refunded"]),
}));

export const schemes = [
    { id: 1, name: "PM-Kisan Samman Nidhi", eligibility: "Small and marginal farmers", benefits: "₹6,000 per year in 3 installments", documents: "Aadhar, Land Papers, Bank Account", process: "Apply via PM-Kisan portal or CSC", odia_name: "ପ୍ରଧାନମନ୍ତ୍ରୀ କିଷାନ ସମ୍ମାନ ନିଧି" },
    { id: 2, name: "KALIA Yojana", eligibility: "Small/marginal farmers and landless laborers", benefits: "Financial assistance for cultivation and livelihood", documents: "Aadhar, Ration Card, Bank Passbook", process: "Register at Gram Panchayat level", odia_name: "କାଳିଆ ଯୋଜନା" },
    { id: 3, name: "Pradhan Mantri Fasal Bima Yojana", eligibility: "All farmers growing notified crops", benefits: "Insurance cover against crop loss due to natural calamities", documents: "Land records, Sowing certificate", process: "Apply via Bank or Insurance Agent", odia_name: "ପ୍ରଧାନମନ୍ତ୍ରୀ ଫସଲ ବୀମା ଯୋଜନା" },
    // ... adding more to reach 30
    ...Array.from({ length: 27 }).map((_, i) => ({
        id: i + 4,
        name: `Agri Scheme ${i + 4}`,
        eligibility: "State Farmers",
        benefits: `Subsidy of ₹${5000 + i * 1000}`,
        documents: "Voter ID, Farm ID",
        process: "Online Portal",
        odia_name: `କୃଷି ଯୋଜନା ${i + 4}`
    }))
];

export const diseases = [
    {
        name: "Rice Blast (ଧାନ ବ୍ଲାଷ୍ଟ)",
        confidence: 98,
        severity: "High",
        treatment: "Tricyclazole 75 WP",
        loss: 40,
        prevention: "Use resistant varieties, balanced nitrogen application.",
        mechanism: "Tricyclazole inhibits melanin biosynthesis in the fungus, preventing it from penetrating the leaf surface (Fungus ko patta mein ghusne se rokta hai).",
        solution: "Mix 0.6g of Tricyclazole per liter of water. Spray thoroughly on the leaves twice at 15-day intervals.",
        medicine_img: "https://agribegri.com/product_images/b7dda79a4055f2662c19e59005934570.jpg"
    },
    {
        name: "Potato Late Blight (ଆଳୁ ରୋଗ)",
        confidence: 95,
        severity: "Medium",
        treatment: "Mancozeb or Copper Oxychloride",
        loss: 60,
        prevention: "Crop rotation, avoid excessive moisture.",
        mechanism: "Creates a protective layer on leaves that kills fungal spores on contact (Patte par ek suraksha kavach banata hai).",
        solution: "Spray Mancozeb 75 WP @ 2g/liter. Repeat every 7-10 days if weather is cloudy/humid.",
        medicine_img: "https://5.imimg.com/data5/SELLER/Default/2022/9/TI/QO/GL/2662243/indofil-m-45-mancozeb-75-wp-contact-fungicide.png"
    },
    {
        name: "Tomato Leaf Curl (ଟମାଟୋ ପତ୍ର ମୋଡ଼ା)",
        confidence: 92,
        severity: "Low",
        treatment: "Imidacloprid for whitefly control",
        loss: 25,
        prevention: "Yellow sticky traps, remove infected plants.",
        mechanism: "Systemic insecticide that stops Whiteflies from transmitting the virus (Whitefly ko maarta hai jo virus failata hai).",
        solution: "Apply Imidacloprid 17.8 SL @ 0.3ml/liter. Use yellow sticky traps (10/acre) to catch flies.",
        medicine_img: "https://m.media-amazon.com/images/I/61S+KyC+Q+L._AC_UF1000,1000_QL80_.jpg"
    },
    {
        name: "Wheat Rust (ଗହମ ରୋଗ)",
        confidence: 97,
        severity: "High",
        treatment: "Propiconazole 25 EC",
        loss: 50,
        prevention: "Early sowing, resistant seeds.",
        mechanism: "Stops the fungal growth by interfering with cell membrane formation (Fungus ki growth rok deta hai).",
        solution: "Spray Propiconazole 25 EC @ 1ml/liter immediately after noticing rust pustules.",
        medicine_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NlXpZ85Tz-yY2p_w8Kz_u8W4-Jp-4X8b0w&s"
    },
    ...Array.from({ length: 16 }).map((_, i) => ({
        name: `Unknown Disease Pattern ${i + 1}`,
        confidence: Math.floor(Math.random() * 15) + 85,
        severity: getRandom(["Low", "Medium", "High"]),
        treatment: "General Systemic Fungicide",
        loss: Math.floor(Math.random() * 50) + 10,
        prevention: "Regular monitoring and soil testing.",
        mechanism: "Broad-spectrum action against common fungal pathogens.",
        solution: "Consult a local agricultural officer for specific advice based on soil type."
    }))
];

export const transactions = Array.from({ length: 80 }).map((_, i) => ({
    id: `tx_${i + 1}`,
    date: getRandomDate(new Date(2025, 0, 1), new Date()),
    amount: Math.floor(Math.random() * 5000) - 2000,
    type: Math.random() > 0.5 ? "Credit" : "Debit",
    description: getRandom(["Wallet Top-up", "Service Booking", "Tractor Rental", "Cashback", "Govt Subsidy"]),
    status: getRandom(["Success", "Processing", "Failed"]),
}));

export const notifications = Array.from({ length: 200 }).map((_, i) => ({
    id: `notif_${i + 1}`,
    title: getRandom(["Booking Accepted", "Payment Success", "AI Scan Complete", "New Govt Scheme", "Alert: Weather Update"]),
    message: "Click to view details of your recent activity on GramAI.",
    time: getRandomDate(new Date(2025, 1, 1), new Date()),
    read: Math.random() > 0.7,
    type: getRandom(["success", "info", "warning", "error"]),
}));

export const reviews = Array.from({ length: 50 }).map((_, i) => ({
    id: `rev_${i + 1}`,
    userName: getRandom(NAMES),
    rating: Math.floor(Math.random() * 2) + 4,
    comment: getRandom(["Excellent service!", "Very punctual and professional.", "Tractor condition was great.", "Highly recommended for village services.", "The AI scan was very accurate."]),
    date: getRandomDate(new Date(2025, 1, 1), new Date()),
}));
// ... existing exports ...

export const cropEstimates = [
    {
        id: 'paddy',
        name: { english: 'Paddy (Rice)', odia: 'ଧାନ', hindi: 'धान' },
        duration: '120-150 days',
        avgYield: 22,
        msp: 2203,
        details: {
            seeds: { qty: 20, unit: 'kg', rate: 60, desc: 'High yielding variety' },
            fertilizer: { qty: 150, unit: 'kg', rate: 25, desc: 'DAP (50kg) + Urea (100kg)' },
            pesticide: { qty: 2.5, unit: 'L', rate: 800, desc: 'Weedicide & Insecticide' },
            labor: { qty: 15, unit: 'days', rate: 400, desc: 'Sowing to Harvesting' },
            irrigation: { qty: 6, unit: 'cycles', rate: 500, desc: 'Pump set fuel/charges' },
            machinery: { qty: 3, unit: 'hrs', rate: 1000, desc: 'Tractor for ploughing' },
            other: { qty: 1, unit: 'LS', rate: 1500, desc: 'Transport & Storage' }
        }
    },
    {
        id: 'wheat',
        name: { english: 'Wheat', odia: 'ଗହମ', hindi: 'गेहूं' },
        duration: '100-120 days',
        avgYield: 18,
        msp: 2275,
        details: {
            seeds: { qty: 40, unit: 'kg', rate: 45, desc: 'Certified Wheat Seeds' },
            fertilizer: { qty: 120, unit: 'kg', rate: 30, desc: 'NPK Mix' },
            pesticide: { qty: 1.5, unit: 'L', rate: 900, desc: 'Fungicides' },
            labor: { qty: 10, unit: 'days', rate: 400, desc: 'Manual Weeding/Harvest' },
            irrigation: { qty: 4, unit: 'cycles', rate: 600, desc: 'Critical stages' },
            machinery: { qty: 4, unit: 'hrs', rate: 1000, desc: 'Rotavator/Thresher' },
            other: { qty: 1, unit: 'LS', rate: 1200, desc: 'Gunny bags/Misc' }
        }
    },
    {
        id: 'cotton',
        name: { english: 'Cotton', odia: 'କପା', hindi: 'कपास' },
        duration: '150-180 days',
        avgYield: 12,
        msp: 6620,
        details: {
            seeds: { qty: 2, unit: 'pkt', rate: 850, desc: 'Bt Cotton Seeds' },
            fertilizer: { qty: 200, unit: 'kg', rate: 35, desc: 'Complex Fertilizers' },
            pesticide: { qty: 5, unit: 'L', rate: 1200, desc: 'Bollworm control' },
            labor: { qty: 25, unit: 'days', rate: 400, desc: 'Picking (Labor intensive)' },
            irrigation: { qty: 8, unit: 'cycles', rate: 500, desc: 'Drip/Flow' },
            machinery: { qty: 2, unit: 'hrs', rate: 1200, desc: 'Land Prep' },
            other: { qty: 1, unit: 'LS', rate: 2000, desc: 'Marketing costs' }
        }
    },
    {
        id: 'sugarcane',
        name: { english: 'Sugarcane', odia: 'ଆଖୁ', hindi: 'गन्ना' },
        duration: '300-360 days',
        avgYield: 400, // tons? No quintals usually around 300-400
        msp: 340, // FRP per quintal
        details: {
            seeds: { qty: 30, unit: 'qtl', rate: 400, desc: 'Seed Setts' },
            fertilizer: { qty: 300, unit: 'kg', rate: 25, desc: 'Heavy feeder' },
            pesticide: { qty: 4, unit: 'L', rate: 700, desc: 'Borers control' },
            labor: { qty: 40, unit: 'days', rate: 450, desc: 'Planting to Harvest' },
            irrigation: { qty: 15, unit: 'cycles', rate: 400, desc: 'Year-round water' },
            machinery: { qty: 5, unit: 'hrs', rate: 1200, desc: 'Deep ploughing' },
            other: { qty: 1, unit: 'LS', rate: 5000, desc: 'Transport to Mill' }
        }
    },
    {
        id: 'vegetables',
        name: { english: 'Vegetables (Mix)', odia: 'ପରିବା', hindi: 'सब्जियां' },
        duration: '60-90 days',
        avgYield: 80,
        msp: 1500, // Market estimate
        details: {
            seeds: { qty: 500, unit: 'g', rate: 3, desc: 'Hybrid Seeds (rate/g)' }, // 3*500 = 1500
            fertilizer: { qty: 100, unit: 'kg', rate: 40, desc: 'Organic/Chemical' },
            pesticide: { qty: 2, unit: 'L', rate: 1000, desc: 'Bio-pesticides' },
            labor: { qty: 20, unit: 'days', rate: 400, desc: 'Frequent weeding/picking' },
            irrigation: { qty: 10, unit: 'cycles', rate: 300, desc: 'Drip irrigation' },
            machinery: { qty: 2, unit: 'hrs', rate: 1000, desc: 'Bed making' },
            other: { qty: 1, unit: 'LS', rate: 2000, desc: 'Crates/Packaging' }
        }
    },
    {
        id: 'groundnut',
        name: { english: 'Groundnut', odia: 'ଚିନାବାଦାମ', hindi: 'मूंगफली' },
        duration: '100-120 days',
        avgYield: 8,
        msp: 6377,
        details: {
            seeds: { qty: 60, unit: 'kg', rate: 90, desc: 'Kernels' },
            fertilizer: { qty: 80, unit: 'kg', rate: 30, desc: 'SSP + Gypsum' },
            pesticide: { qty: 1, unit: 'L', rate: 800, desc: 'Leaf spot control' },
            labor: { qty: 12, unit: 'days', rate: 400, desc: 'Digging/Plucking' },
            irrigation: { qty: 3, unit: 'cycles', rate: 500, desc: 'If rainfed less' },
            machinery: { qty: 2, unit: 'hrs', rate: 1000, desc: 'Ploughing' },
            other: { qty: 1, unit: 'LS', rate: 1000, desc: 'Drying' }
        }
    }
];
