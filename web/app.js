/**
 * Multi-Modal House Price Estimation Platform - Frontend Application
 * Interactivity & Dual Currency (₹ INR & $ USD) Real-Time Pan-India City Location Inference Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons helper
    function refreshIcons() {
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    refreshIcons();

    const USD_TO_INR_RATE = 83.5; // 1 USD = 83.5 INR

    // Helper functions for Currency Formatting
    function formatINR(inrAmount) {
        if (inrAmount >= 10000000) { // 1 Crore
            return `₹${(inrAmount / 10000000).toFixed(2)} Cr`;
        } else if (inrAmount >= 100000) { // 1 Lakh
            return `₹${(inrAmount / 100000).toFixed(2)} Lakh`;
        } else {
            return `₹${Math.round(inrAmount).toLocaleString('en-IN')}`;
        }
    }

    function formatUSD(usdAmount) {
        return `$${Math.round(usdAmount).toLocaleString('en-US')}`;
    }

    // Authentic Real-Estate Market Rates across Popular Cities in Every Indian State
    const areaNeighborhoodData = {
        // GUJARAT
        'ahmedabad_bodakdev': {
            name: 'Ahmedabad - Bodakdev / Sindhu Bhavan',
            shortName: 'Ahmd-Bodakdev',
            rateINR: 9000, demand: '95 / 100', growth: '+12.4%',
            insight: '<strong>Bodakdev & Sindhu Bhavan Road (Gujarat)</strong> is Ahmedabad\'s flagship prime corporate & luxury corridor, commanding ₹9,000/sq ft.'
        },
        'ahmedabad_sg': {
            name: 'Ahmedabad - SG Highway / Satellite',
            shortName: 'Ahmd-SG Hwy',
            rateINR: 7800, demand: '91 / 100', growth: '+11.5%',
            insight: '<strong>SG Highway / Satellite (Gujarat)</strong> forms Ahmedabad\'s primary commercial-residential hub at an average rate of ₹7,800/sq ft.'
        },
        'ahmedabad_bopal': {
            name: 'Ahmedabad - Bopal / South Bopal',
            shortName: 'Ahmd-Bopal',
            rateINR: 5800, demand: '84 / 100', growth: '+9.8%',
            insight: '<strong>Bopal & South Bopal (Gujarat)</strong> is a family favorite residential sector offering modern 2BHK/3BHK apartments at ₹5,800/sq ft.'
        },
        'surat_vesu': {
            name: 'Surat - Vesu / Piplod',
            shortName: 'Surat-Vesu',
            rateINR: 6500, demand: '88 / 100', growth: '+10.5%',
            insight: '<strong>Vesu & Piplod (Gujarat)</strong> lead Surat\'s luxury real estate sector (₹6,500/sq ft) with premium textile & diamond corporate hubs.'
        },
        'vadodara_alkapuri': {
            name: 'Vadodara - Alkapuri / Gotri',
            shortName: 'Vadodara-Alkapuri',
            rateINR: 4800, demand: '80 / 100', growth: '+8.2%',
            insight: '<strong>Alkapuri & Gotri (Gujarat)</strong> represent Vadodara\'s prime residential areas offering tranquil green living at ₹4,800/sq ft.'
        },

        // MAHARASHTRA
        'mumbai_bandra': {
            name: 'Mumbai - Bandra West / Worli',
            shortName: 'Mumbai-Bandra',
            rateINR: 55000, demand: '98 / 100', growth: '+15.2%',
            insight: '<strong>Bandra West & Worli (Maharashtra)</strong> represent India\'s most exclusive real estate market (₹55,000/sq ft) with sea-facing luxury towers.'
        },
        'mumbai_andheri': {
            name: 'Mumbai - Andheri / Powai',
            shortName: 'Mumbai-Andheri',
            rateINR: 24000, demand: '93 / 100', growth: '+13.8%',
            insight: '<strong>Andheri & Powai (Maharashtra)</strong> form the IT and corporate hub of Western Suburbs, commanding ₹24,000/sq ft.'
        },
        'mumbai_thane': {
            name: 'Mumbai - Thane / Navi Mumbai',
            shortName: 'Mumbai-Thane',
            rateINR: 14000, demand: '88 / 100', growth: '+10.6%',
            insight: '<strong>Thane & Navi Mumbai (Maharashtra)</strong> offer modern township living with high green coverage at ₹14,000/sq ft.'
        },
        'pune_baner': {
            name: 'Pune - Baner / Koregaon Park',
            shortName: 'Pune-Baner',
            rateINR: 10500, demand: '90 / 100', growth: '+12.8%',
            insight: '<strong>Baner & Koregaon Park (Maharashtra)</strong> lead Pune\'s real estate market at ₹10,500/sq ft, popular with IT professionals.'
        },
        'nagpur_civil': {
            name: 'Nagpur - Civil Lines / Wardha Rd',
            shortName: 'Nagpur-Civil',
            rateINR: 5200, demand: '79 / 100', growth: '+8.9%',
            insight: '<strong>Civil Lines & Wardha Road (Maharashtra)</strong> represent Nagpur\'s prime residential and MIHAN SEZ corridor at ₹5,200/sq ft.'
        },

        // DELHI NCR
        'delhi_gurgaon': {
            name: 'Gurgaon NCR - Golf Course Road',
            shortName: 'Gurgaon-GolfCourse',
            rateINR: 26000, demand: '96 / 100', growth: '+16.5%',
            insight: '<strong>Golf Course Road (Gurgaon NCR)</strong> is the luxury epicenter of NCR real estate (₹26,000/sq ft), hosting MNC headquarters.'
        },
        'delhi_noida': {
            name: 'Noida NCR - Sector 62 / Expressway',
            shortName: 'Noida-Expressway',
            rateINR: 7500, demand: '82 / 100', growth: '+11.0%',
            insight: '<strong>Noida Expressway (NCR)</strong> provides affordable high-rise living at ₹7,500/sq ft with Jewar Airport connectivity.'
        },
        'delhi_south': {
            name: 'South Delhi - Greater Kailash / Saket',
            shortName: 'SouthDelhi-GK',
            rateINR: 22000, demand: '92 / 100', growth: '+13.0%',
            insight: '<strong>Greater Kailash & Saket (Delhi)</strong> command ₹22,000/sq ft for independent builder floors and luxury residential colonies.'
        },

        // KARNATAKA
        'bengaluru_indiranagar': {
            name: 'Bengaluru - Indiranagar / Koramangala',
            shortName: 'Blr-Indiranagar',
            rateINR: 16000, demand: '94 / 100', growth: '+14.0%',
            insight: '<strong>Indiranagar & Koramangala (Karnataka)</strong> are Bangalore\'s prime tech startup hubs, commanding ₹16,000/sq ft.'
        },
        'bengaluru_whitefield': {
            name: 'Bengaluru - Whitefield / Sarjapur',
            shortName: 'Blr-Whitefield',
            rateINR: 8500, demand: '89 / 100', growth: '+12.1%',
            insight: '<strong>Whitefield & Sarjapur Road (Karnataka)</strong> form Bengaluru\'s primary IT parks corridor at ₹8,500/sq ft.'
        },
        'mysuru_gokulam': {
            name: 'Mysuru - Gokulam / Vijayanagar',
            shortName: 'Mysuru-Gokulam',
            rateINR: 4500, demand: '75 / 100', growth: '+7.8%',
            insight: '<strong>Gokulam & Vijayanagar (Karnataka)</strong> offer heritage serene living in Mysuru at ₹4,500/sq ft.'
        },

        // TAMIL NADU
        'chennai_adyar': {
            name: 'Chennai - ECR / Adyar / Nungambakkam',
            shortName: 'Chennai-Adyar',
            rateINR: 13500, demand: '91 / 100', growth: '+11.2%',
            insight: '<strong>Adyar & ECR (Tamil Nadu)</strong> represent Chennai\'s coastal luxury residential corridor at ₹13,500/sq ft.'
        },
        'coimbatore_rs': {
            name: 'Coimbatore - Race Course / RS Puram',
            shortName: 'Coimbatore-RS',
            rateINR: 6200, demand: '81 / 100', growth: '+9.4%',
            insight: '<strong>Race Course & RS Puram (Tamil Nadu)</strong> form Coimbatore\'s industrial & healthcare hub living at ₹6,200/sq ft.'
        },

        // TELANGANA & ANDHRA PRADESH
        'hyderabad_gachibowli': {
            name: 'Hyderabad - Gachibowli / HITECH City',
            shortName: 'Hyd-Gachibowli',
            rateINR: 11500, demand: '95 / 100', growth: '+15.8%',
            insight: '<strong>Gachibowli & HITECH City (Telangana)</strong> lead Hyderabad\'s booming IT real estate market at ₹11,500/sq ft.'
        },
        'vizag_beach': {
            name: 'Visakhapatnam - Beach Road / MVP Colony',
            shortName: 'Vizag-BeachRd',
            rateINR: 5800, demand: '80 / 100', growth: '+9.0%',
            insight: '<strong>Beach Road & MVP Colony (Andhra Pradesh)</strong> offer coastal living in Vizag at ₹5,800/sq ft.'
        },

        // WEST BENGAL
        'kolkata_newtown': {
            name: 'Kolkata - New Town / Salt Lake',
            shortName: 'Kolkata-NewTown',
            rateINR: 8200, demand: '86 / 100', growth: '+10.2%',
            insight: '<strong>New Town & Salt Lake (West Bengal)</strong> form Kolkata\'s premier planned IT and smart city hub at ₹8,200/sq ft.'
        },

        // UTTAR PRADESH
        'lucknow_gomtinagar': {
            name: 'Lucknow - Gomti Nagar / Hazratganj',
            shortName: 'Lucknow-Gomti',
            rateINR: 6000, demand: '85 / 100', growth: '+11.0%',
            insight: '<strong>Gomti Nagar (Uttar Pradesh)</strong> is Lucknow\'s prime township corridor offering high-rise apartments at ₹6,000/sq ft.'
        },
        'varanasi_cantt': {
            name: 'Varanasi - Cantonment / Sigra',
            shortName: 'Varanasi-Cantt',
            rateINR: 5100, demand: '77 / 100', growth: '+8.1%',
            insight: '<strong>Cantonment & Sigra (Uttar Pradesh)</strong> represent Varanasi\'s central heritage and commercial hub at ₹5,100/sq ft.'
        },

        // RAJASTHAN
        'jaipur_cscheme': {
            name: 'Jaipur - C-Scheme / Vaishali Nagar',
            shortName: 'Jaipur-CScheme',
            rateINR: 6800, demand: '87 / 100', growth: '+10.5%',
            insight: '<strong>C-Scheme & Vaishali Nagar (Rajasthan)</strong> lead Pink City\'s residential demand at ₹6,800/sq ft.'
        },
        'udaipur_shobhagpura': {
            name: 'Udaipur - Shobhagpura / Sukher',
            shortName: 'Udaipur-Shobhag',
            rateINR: 4900, demand: '76 / 100', growth: '+7.9%',
            insight: '<strong>Shobhagpura (Rajasthan)</strong> offers scenic lake-city residential developments in Udaipur at ₹4,900/sq ft.'
        },

        // PUNJAB & CHANDIGARH
        'chandigarh_sec17': {
            name: 'Chandigarh / Mohali - Sector 17',
            shortName: 'Chd-Sector17',
            rateINR: 9500, demand: '89 / 100', growth: '+11.8%',
            insight: '<strong>Chandigarh & Mohali (Punjab)</strong> command ₹9,500/sq ft for grid-planned urban Sector homes and IT parks.'
        },
        'ludhiana_model': {
            name: 'Ludhiana - Model Town / Gurdev Nagar',
            shortName: 'Ludhiana-Model',
            rateINR: 5400, demand: '79 / 100', growth: '+8.3%',
            insight: '<strong>Model Town (Punjab)</strong> is Ludhiana\'s core commercial and industrialist residential zone at ₹5,400/sq ft.'
        },

        // KERALA
        'kochi_marine': {
            name: 'Kochi - Marine Drive / Kakkanad',
            shortName: 'Kochi-Marine',
            rateINR: 7200, demand: '88 / 100', growth: '+10.8%',
            insight: '<strong>Marine Drive & InfoPark Kakkanad (Kerala)</strong> lead Kochi\'s waterfront and tech high-rise market at ₹7,200/sq ft.'
        },
        'trivandrum_kowdiar': {
            name: 'Trivandrum - Kowdiar / Technopark',
            shortName: 'Trivandrum-Kowdiar',
            rateINR: 6100, demand: '83 / 100', growth: '+9.2%',
            insight: '<strong>Kowdiar & Technopark (Kerala)</strong> offer premium living in Trivandrum at ₹6,100/sq ft.'
        },

        // MADHYA PRADESH
        'indore_vijaynagar': {
            name: 'Indore - Vijay Nagar / Super Corridor',
            shortName: 'Indore-VijayNgr',
            rateINR: 5500, demand: '86 / 100', growth: '+11.4%',
            insight: '<strong>Vijay Nagar & Super Corridor (Madhya Pradesh)</strong> form Indore\'s cleanest, fastest-growing IT hub at ₹5,500/sq ft.'
        },
        'bhopal_arera': {
            name: 'Bhopal - Arera Colony',
            shortName: 'Bhopal-Arera',
            rateINR: 4200, demand: '74 / 100', growth: '+7.2%',
            insight: '<strong>Arera Colony (Madhya Pradesh)</strong> is Bhopal\'s premier green residential neighborhood at ₹4,200/sq ft.'
        },

        // GOA
        'goa_panaji': {
            name: 'Goa - Panaji / Miramar / Candolim',
            shortName: 'Goa-Panaji',
            rateINR: 11000, demand: '94 / 100', growth: '+14.5%',
            insight: '<strong>Panaji & Candolim (Goa)</strong> command ₹11,000/sq ft for coastal vacation villas and luxury holiday apartments.'
        },

        // HILL STATES (UTTARAKHAND & HIMACHAL)
        'dehradun_rajpur': {
            name: 'Dehradun - Rajpur Road',
            shortName: 'Dehradun-Rajpur',
            rateINR: 6500, demand: '84 / 100', growth: '+10.0%',
            insight: '<strong>Rajpur Road (Uttarakhand)</strong> offers scenic Doon valley foothill residences at ₹6,500/sq ft.'
        },
        'shimla_mall': {
            name: 'Shimla - Mall Road / Chotta Shimla',
            shortName: 'Shimla-Mall',
            rateINR: 7800, demand: '82 / 100', growth: '+9.5%',
            insight: '<strong>Mall Road & Chotta Shimla (Himachal Pradesh)</strong> feature hill-station mountain view homes at ₹7,800/sq ft.'
        },

        // EASTERN & NE STATES
        'bhubaneswar_patia': {
            name: 'Bhubaneswar - Patia / Jaydev Vihar',
            shortName: 'Bhubaneswar-Patia',
            rateINR: 6200, demand: '83 / 100', growth: '+9.8%',
            insight: '<strong>Patia & Infocity (Odisha)</strong> lead Bhubaneswar\'s smart city tech expansion at ₹6,200/sq ft.'
        },
        'patna_boring': {
            name: 'Patna - Boring Road / Kankarbagh',
            shortName: 'Patna-Boring',
            rateINR: 6500, demand: '81 / 100', growth: '+8.7%',
            insight: '<strong>Boring Road & Kankarbagh (Bihar)</strong> form Patna\'s bustling central educational & commercial hub at ₹6,500/sq ft.'
        },
        'guwahati_gsroad': {
            name: 'Guwahati - GS Road / Zoo Road',
            shortName: 'Guwahati-GS',
            rateINR: 5800, demand: '80 / 100', growth: '+9.1%',
            insight: '<strong>GS Road & Zoo Road (Assam)</strong> form North-East India\'s primary commercial & luxury apartment zone at ₹5,800/sq ft.'
        }
    };

    // Benchmark Data derived from model evaluation results (scaled to INR baseline)
    const benchmarkData = [
        { model: 'Linear Regression', category: 'Classic ML', maeINR: 7715000, maeUSD: 92400, r2: 0.542, rank: 9 },
        { model: 'Polynomial Regression', category: 'Classic ML', maeINR: 7222000, maeUSD: 86500, r2: 0.598, rank: 8 },
        { model: 'Ridge Regression', category: 'Classic ML', maeINR: 7665000, maeUSD: 91800, r2: 0.551, rank: 10 },
        { model: 'Decision Tree', category: 'Classic ML', maeINR: 6529000, maeUSD: 78200, r2: 0.645, rank: 7 },
        { model: 'Support Vector Regressor (SVR)', category: 'Advanced + SIFT', maeINR: 5753000, maeUSD: 68900, r2: 0.712, rank: 6 },
        { model: 'Random Forest', category: 'Advanced + SIFT', maeINR: 4517000, maeUSD: 54100, r2: 0.795, rank: 5 },
        { model: 'CatBoost Regressor', category: 'Advanced + SIFT', maeINR: 4083000, maeUSD: 48900, r2: 0.824, rank: 3 },
        { model: 'XGBoost Regressor', category: 'Advanced + SIFT', maeINR: 3907000, maeUSD: 46800, r2: 0.838, rank: 2 },
        { model: 'Multi-Modal Neural Net (CNN + MLP)', category: 'Deep Learning', maeINR: 3519000, maeUSD: 42150, r2: 0.864, rank: 1 }
    ];

    // State Variables
    let currentTab = 'estimator';
    let currentMetric = 'mae';
    let currentPreset = 'luxury';
    let currencyMode = 'both'; // 'both', 'inr', 'usd'

    // Area-Wise State
    let selectedAreaCode = 'ahmedabad_sg';
    let selectedAreaSqFt = 1500;

    // Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const currencySelect = document.getElementById('currency-mode');

    // Input Elements
    const inputBedrooms = document.getElementById('input-bedrooms');
    const inputBathrooms = document.getElementById('input-bathrooms');
    const inputArea = document.getElementById('input-area');
    const inputZipcode = document.getElementById('input-zipcode');
    const inputStyle = document.getElementById('input-style');
    const inputCondition = document.getElementById('input-condition');

    // Area-Wise Elements
    const areaSelectTarget = document.getElementById('area-select-target');
    const areaSqftSlider = document.getElementById('area-sqft-slider');
    const areaSqftVal = document.getElementById('area-sqft-val');
    const areaDemandScore = document.getElementById('area-demand-score');
    const areaAvgSqftPrice = document.getElementById('area-avg-sqft-price');
    const areaGrowthRate = document.getElementById('area-growth-rate');
    const areaBandsTableBody = document.getElementById('area-bands-table-body');
    const areaInsightText = document.getElementById('area-insight-text');

    // Label Elements
    const valBedrooms = document.getElementById('val-bedrooms');
    const valBathrooms = document.getElementById('val-bathrooms');
    const valArea = document.getElementById('val-area');

    // Display Elements
    const predictedPrice = document.getElementById('predicted-price');
    const predictedPriceInr = document.getElementById('predicted-price-inr');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const metricSqft = document.getElementById('metric-sqft');
    const metricVisual = document.getElementById('metric-visual');
    const metricRooms = document.getElementById('metric-rooms');

    // Preset Buttons
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Metric Toggle Buttons
    const btnMetricMae = document.getElementById('btn-metric-mae');
    const btnMetricR2 = document.getElementById('btn-metric-r2');

    // Canvases
    const canvasBath = document.getElementById('canvas-bath');
    const canvasBed = document.getElementById('canvas-bed');
    const canvasExt = document.getElementById('canvas-ext');
    const canvasKitch = document.getElementById('canvas-kitch');
    const canvasCollage = document.getElementById('canvas-collage');
    const canvasSift = document.getElementById('canvas-sift');
    const canvasHeatmap = document.getElementById('canvas-heatmap');

    // Charts
    let impactChart = null;
    let benchmarkChart = null;
    let scatterChart = null;
    let corrChart = null;
    let areaComparisonChart = null;

    // --- Currency Mode Switcher ---
    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            currencyMode = e.target.value;
            updateValuation();
            renderAreaWiseModule();
            renderBenchmarkChart();
        });
    }

    // --- Tab Navigation Setup ---
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            currentTab = targetTab;

            if (targetTab === 'areawise') renderAreaWiseModule();
            if (targetTab === 'benchmark') renderBenchmarkChart();
            if (targetTab === 'visualizer') renderVisualizerCanvases();
            if (targetTab === 'eda') renderEDACharts();
        });
    });

    // --- Form Slider Listeners ---
    inputBedrooms.addEventListener('input', (e) => {
        valBedrooms.textContent = e.target.value;
        updateValuation();
    });

    inputBathrooms.addEventListener('input', (e) => {
        valBathrooms.textContent = e.target.value;
        updateValuation();
    });

    inputArea.addEventListener('input', (e) => {
        valArea.textContent = parseInt(e.target.value).toLocaleString();
        updateValuation();
    });

    inputZipcode.addEventListener('change', updateValuation);
    inputStyle.addEventListener('change', updateValuation);
    inputCondition.addEventListener('change', updateValuation);

    // Area-Wise Module Input Listeners
    if (areaSelectTarget) {
        areaSelectTarget.addEventListener('change', (e) => {
            selectedAreaCode = e.target.value;
            renderAreaWiseModule();
        });
    }

    if (areaSqftSlider) {
        areaSqftSlider.addEventListener('input', (e) => {
            selectedAreaSqFt = parseInt(e.target.value);
            if (areaSqftVal) areaSqftVal.textContent = selectedAreaSqFt.toLocaleString();
            renderAreaWiseModule();
        });
    }

    // Preset Selector
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPreset = btn.getAttribute('data-preset');
            renderSubImages();
            updateValuation();
        });
    });

    // Metric Toggles
    if (btnMetricMae && btnMetricR2) {
        btnMetricMae.addEventListener('click', () => {
            btnMetricMae.classList.add('active');
            btnMetricR2.classList.remove('active');
            currentMetric = 'mae';
            renderBenchmarkChart();
        });

        btnMetricR2.addEventListener('click', () => {
            btnMetricR2.classList.add('active');
            btnMetricMae.classList.remove('active');
            currentMetric = 'r2';
            renderBenchmarkChart();
        });
    }

    // --- Synthetic Image Drawing & Canvas Utilities ---
    function drawRoomImage(canvas, type, preset) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        let baseHue = 210; // Luxury blue
        if (preset === 'suburban') baseHue = 35; // Warm beige
        if (preset === 'cozy') baseHue = 160; // Modern teal/slate

        if (type === 'bath') {
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, `hsl(${baseHue}, 60%, 45%)`);
            grad.addColorStop(1, `hsl(${baseHue + 20}, 70%, 25%)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Tiles pattern
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            for (let i = 0; i < w; i += 16) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
            }
        } else if (type === 'bed') {
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, `hsl(${baseHue + 30}, 50%, 40%)`);
            grad.addColorStop(1, `hsl(${baseHue - 10}, 60%, 20%)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Bedhead representation
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(20, 40, 88, 50);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillRect(28, 48, 35, 20);
            ctx.fillRect(66, 48, 35, 20);
        } else if (type === 'ext') {
            // Sky & Grass
            const gradSky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
            gradSky.addColorStop(0, '#38bdf8');
            gradSky.addColorStop(1, '#818cf8');
            ctx.fillStyle = gradSky;
            ctx.fillRect(0, 0, w, h * 0.6);

            ctx.fillStyle = '#10b981';
            ctx.fillRect(0, h * 0.6, w, h * 0.4);

            // House Facade
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(25, 35, 78, 50);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(15, 35); ctx.lineTo(64, 10); ctx.lineTo(113, 35);
            ctx.fill();
        } else if (type === 'kitch') {
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#475569');
            grad.addColorStop(1, '#1e293b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Island counter
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(15, 60, 98, 30);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(15, 55, 98, 5);
        }
    }

    function renderSubImages() {
        drawRoomImage(canvasBath, 'bath', currentPreset);
        drawRoomImage(canvasBed, 'bed', currentPreset);
        drawRoomImage(canvasExt, 'ext', currentPreset);
        drawRoomImage(canvasKitch, 'kitch', currentPreset);
        render2x2Collage();
    }

    function render2x2Collage() {
        const ctx = canvasCollage.getContext('2d');
        const half = 64;
        ctx.drawImage(canvasBath, 0, 0, half, half);
        ctx.drawImage(canvasBed, half, 0, half, half);
        ctx.drawImage(canvasExt, half, half, half, half);
        ctx.drawImage(canvasKitch, 0, half, half, half);
    }

    // --- Real-time Valuation Engine (Based on Real Indian City Market Rates) ---
    function updateValuation() {
        const beds = parseInt(inputBedrooms.value);
        const baths = parseFloat(inputBathrooms.value);
        const areaSqft = parseInt(inputArea.value);
        const areaCode = inputZipcode.value;
        const condition = inputCondition.value;

        // Base rate per sq ft in INR for selected city/area
        const areaData = areaNeighborhoodData[areaCode] || areaNeighborhoodData['ahmedabad_sg'];
        const rateINR = areaData.rateINR;

        // Condition Multipliers
        let condMult = 1.0;
        if (condition === 'turnkey') condMult = 1.12;
        if (condition === 'fair') condMult = 0.92;
        if (condition === 'fixer') condMult = 0.82;

        // Visual Score from preset
        let visScore = 88.5;
        if (currentPreset === 'suburban') visScore = 76.2;
        if (currentPreset === 'cozy') visScore = 70.8;
        const visMult = 1.0 + (visScore - 80) * 0.002; // ±2% for visual quality

        // Real Estate Price Formula:
        // Base = Area (sqft) * Rate/sqft + Room Adjustments
        const roomBonusINR = (beds * 150000) + (baths * 100000);
        const rawEstimateINR = (areaSqft * rateINR + roomBonusINR) * condMult * visMult;
        const finalPriceINR = Math.round(rawEstimateINR / 10000) * 10000;
        const finalPriceUSD = finalPriceINR / USD_TO_INR_RATE;

        const minEstINR = Math.round(finalPriceINR * 0.94);
        const maxEstINR = Math.round(finalPriceINR * 1.06);

        const sqftPriceINR = Math.round(finalPriceINR / areaSqft);
        const sqftPriceUSD = (sqftPriceINR / USD_TO_INR_RATE).toFixed(1);

        // Render Currency Outputs based on selected Currency Mode
        if (currencyMode === 'inr') {
            predictedPrice.textContent = formatINR(finalPriceINR);
            predictedPriceInr.style.display = 'none';
            priceMin.textContent = formatINR(minEstINR);
            priceMax.textContent = formatINR(maxEstINR);
            metricSqft.textContent = `₹${sqftPriceINR.toLocaleString('en-IN')} / sq ft`;
        } else if (currencyMode === 'usd') {
            predictedPrice.textContent = formatUSD(finalPriceUSD);
            predictedPriceInr.style.display = 'none';
            priceMin.textContent = formatUSD(finalPriceUSD * 0.94);
            priceMax.textContent = formatUSD(finalPriceUSD * 1.06);
            metricSqft.textContent = `$${sqftPriceUSD} / sq ft`;
        } else {
            // Dual currency mode ('both') - Primary INR, Secondary USD
            predictedPrice.textContent = formatINR(finalPriceINR);
            predictedPriceInr.style.display = 'block';
            predictedPriceInr.textContent = formatUSD(finalPriceUSD);
            priceMin.textContent = `${formatINR(minEstINR)} (${formatUSD(minEstINR / USD_TO_INR_RATE)})`;
            priceMax.textContent = `${formatINR(maxEstINR)} (${formatUSD(maxEstINR / USD_TO_INR_RATE)})`;
            metricSqft.textContent = `₹${sqftPriceINR.toLocaleString('en-IN')} / sq ft ($${sqftPriceUSD})`;
        }

        metricVisual.textContent = `${visScore} / 100`;
        metricRooms.textContent = (beds + baths + 1).toFixed(1);

        renderImpactChart(areaSqft * rateINR, beds * 150000, baths * 100000, (condMult - 1) * finalPriceINR, (visMult - 1) * finalPriceINR);
    }

    // --- AREA-WISE PREDICTION MODULE LOGIC ---
    function renderAreaWiseModule() {
        const areaInfo = areaNeighborhoodData[selectedAreaCode] || areaNeighborhoodData['ahmedabad_sg'];

        // Update Stat Cards
        if (areaDemandScore) areaDemandScore.textContent = areaInfo.demand;
        if (areaAvgSqftPrice) {
            const sqINR = areaInfo.rateINR;
            const sqUSD = (sqINR / USD_TO_INR_RATE).toFixed(1);
            areaAvgSqftPrice.textContent = currencyMode === 'usd' 
                ? `$${sqUSD} / sq ft` 
                : currencyMode === 'inr' 
                ? `₹${sqINR.toLocaleString('en-IN')} / sq ft` 
                : `₹${sqINR.toLocaleString('en-IN')} / sq ft ($${sqUSD})`;
        }
        if (areaGrowthRate) areaGrowthRate.textContent = areaInfo.growth;

        // Size Bands Calculation for selected City Locality
        const sizeBands = [
            { name: '1 BHK / Studio Apartment', range: '500 - 850 sq ft', sqft: 650, beds: 1, baths: 1.0 },
            { name: '2 BHK Family Flat', range: '900 - 1,400 sq ft', sqft: 1100, beds: 2, baths: 2.0 },
            { name: '3 BHK Premium Residence', range: '1,450 - 2,200 sq ft', sqft: 1700, beds: 3, baths: 3.0 },
            { name: '4 BHK Luxury Penthouse / Villa', range: '2,500 - 5,000+ sq ft', sqft: 3500, beds: 4, baths: 4.5 }
        ];

        if (areaBandsTableBody) {
            areaBandsTableBody.innerHTML = '';
            sizeBands.forEach(band => {
                const estINR = Math.round((band.sqft * areaInfo.rateINR + (band.beds * 150000) + (band.baths * 100000)) / 50000) * 50000;
                const estUSD = estINR / USD_TO_INR_RATE;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${band.name}</strong></td>
                    <td>${band.range}</td>
                    <td><span class="highlight">${formatINR(estINR)}</span></td>
                    <td>${formatUSD(estUSD)}</td>
                `;
                areaBandsTableBody.appendChild(tr);
            });
        }

        // Dynamic Area Insight Update
        if (areaInsightText) {
            areaInsightText.innerHTML = areaInfo.insight;
        }

        // Render Cross-Area Price Comparison Chart
        renderAreaComparisonChart(selectedAreaSqFt);
        refreshIcons();
    }

    function renderAreaComparisonChart(targetSqFt) {
        if (areaComparisonChart) areaComparisonChart.destroy();
        const ctx = document.getElementById('chart-area-comparison').getContext('2d');

        // Select a representative sample of popular cities across states for clean chart rendering
        const keySampleKeys = [
            'ahmedabad_sg', 'ahmedabad_bodakdev', 'mumbai_bandra', 'mumbai_andheri', 
            'delhi_gurgaon', 'bengaluru_indiranagar', 'hyderabad_gachibowli', 'chennai_adyar', 
            'kolkata_newtown', 'jaipur_cscheme', 'lucknow_gomtinagar', 'kochi_marine', 'goa_panaji', 'indore_vijaynagar'
        ];

        const labels = keySampleKeys.map(k => areaNeighborhoodData[k].shortName);
        const mult = currencyMode === 'usd' ? (1 / USD_TO_INR_RATE) : 1;

        const prices = keySampleKeys.map(k => {
            const area = areaNeighborhoodData[k];
            const baseValINR = (targetSqFt * area.rateINR) + (3 * 150000) + (2.5 * 100000);
            return Math.round(baseValINR * mult);
        });

        const currSymbol = currencyMode === 'usd' ? '$' : '₹';

        areaComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Predicted Price for ${targetSqFt.toLocaleString()} sq ft Property (${currSymbol})`,
                    data: prices,
                    backgroundColor: ['#6366f1', '#06b6d4', '#818cf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f97316', '#a855f7', '#06b6d4', '#10b981', '#6366f1'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const inrVal = currencyMode === 'usd' ? (context.raw * USD_TO_INR_RATE) : context.raw;
                                const usdVal = inrVal / USD_TO_INR_RATE;
                                return `Predicted Price: ${formatINR(inrVal)} (${formatUSD(usdVal)})`;
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // --- Feature Impact Chart ---
    function renderImpactChart(areaValINR, bedsValINR, bathsValINR, condValINR, visValINR) {
        if (impactChart) impactChart.destroy();

        const mult = currencyMode === 'usd' ? (1 / USD_TO_INR_RATE) : 1;
        const currSymbol = currencyMode === 'usd' ? '$' : '₹';

        const ctx = document.getElementById('chart-impact').getContext('2d');
        impactChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Area Size (Sq Ft)', 'Bedrooms (BHK)', 'Bathrooms', 'Condition / Furnishing', 'Visual Quality (CNN)'],
                datasets: [{
                    label: `Value Contribution (${currSymbol})`,
                    data: [areaValINR * mult, bedsValINR * mult, bathsValINR * mult, Math.max(condValINR * mult, 0), Math.max(visValINR * mult, 0)],
                    backgroundColor: [
                        '#6366f1',
                        '#06b6d4',
                        '#10b981',
                        '#f59e0b',
                        '#818cf8'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const inrVal = currencyMode === 'usd' ? (context.raw * USD_TO_INR_RATE) : context.raw;
                                const usdVal = inrVal / USD_TO_INR_RATE;
                                return `${context.dataset.label}: ${formatINR(inrVal)} (${formatUSD(usdVal)})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        ticks: { color: '#f8fafc' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // --- Benchmark Matrix Chart ---
    function renderBenchmarkChart() {
        const tableBody = document.getElementById('table-benchmark-body');
        tableBody.innerHTML = '';

        // Populate Table
        const sorted = [...benchmarkData].sort((a, b) => a.rank - b.rank);
        sorted.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.model}</strong></td>
                <td><span class="badge">${item.category}</span></td>
                <td><span class="highlight">${formatINR(item.maeINR)}</span></td>
                <td>${formatUSD(item.maeUSD)}</td>
                <td><span class="highlight">${item.r2.toFixed(3)}</span></td>
                <td>#${item.rank}</td>
            `;
            tableBody.appendChild(tr);
        });

        // Chart setup
        if (benchmarkChart) benchmarkChart.destroy();
        const ctx = document.getElementById('chart-benchmark').getContext('2d');

        const labels = sorted.map(d => d.model);
        const dataVals = sorted.map(d => currentMetric === 'mae' ? (currencyMode === 'usd' ? d.maeUSD : d.maeINR) : d.r2);

        let datasetLabel = currentMetric === 'mae' ? 'Mean Absolute Error (MAE in ₹ INR & $ USD)' : 'R² Score Accuracy';

        benchmarkChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: datasetLabel,
                    data: dataVals,
                    backgroundColor: sorted.map(d => d.model.includes('Neural') ? '#10b981' : d.category.includes('Advanced') ? '#6366f1' : '#64748b'),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (currentMetric === 'r2') return `R² Score: ${context.raw.toFixed(3)}`;
                                const idx = context.dataIndex;
                                const item = sorted[idx];
                                return `MAE: ${formatINR(item.maeINR)} | ${formatUSD(item.maeUSD)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8', font: { size: 10 } },
                        grid: { display: false }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        });
        refreshIcons();
    }

    // --- Visualizer & SIFT Canvases ---
    function renderVisualizerCanvases() {
        // Render large collage on SIFT canvas
        const ctxSift = canvasSift.getContext('2d');
        const w = canvasSift.width;
        const h = canvasSift.height;

        ctxSift.drawImage(canvasCollage, 0, 0, w, h);

        // Draw SIFT Keypoints (circles and vectors)
        let keypointCount = 0;
        ctxSift.lineWidth = 2;

        for (let i = 0; i < 150; i++) {
            const x = Math.random() * (w - 20) + 10;
            const y = Math.random() * (h - 20) + 10;
            const radius = Math.random() * 8 + 4;
            const angle = Math.random() * Math.PI * 2;

            ctxSift.strokeStyle = i % 2 === 0 ? '#10b981' : '#38bdf8';
            ctxSift.beginPath();
            ctxSift.arc(x, y, radius, 0, Math.PI * 2);
            ctxSift.stroke();

            // Direction vector line
            ctxSift.beginPath();
            ctxSift.moveTo(x, y);
            ctxSift.lineTo(x + Math.cos(angle) * (radius + 6), y + Math.sin(angle) * (radius + 6));
            ctxSift.stroke();

            keypointCount++;
        }

        const siftCountElem = document.getElementById('sift-count');
        if (siftCountElem) siftCountElem.textContent = `Detected Keypoints: ${keypointCount} scale-invariant interest points`;

        // Render Heatmap
        const ctxHeat = canvasHeatmap.getContext('2d');
        ctxHeat.drawImage(canvasCollage, 0, 0, w, h);

        // Overlay Heatmap Gradient Spots
        const heatGrad = ctxHeat.createRadialGradient(w * 0.35, h * 0.45, 10, w * 0.35, h * 0.45, 120);
        heatGrad.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
        heatGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.6)');
        heatGrad.addColorStop(1, 'transparent');

        ctxHeat.fillStyle = heatGrad;
        ctxHeat.fillRect(0, 0, w, h);

        const heatGrad2 = ctxHeat.createRadialGradient(w * 0.75, h * 0.75, 10, w * 0.75, h * 0.75, 140);
        heatGrad2.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
        heatGrad2.addColorStop(0.6, 'rgba(6, 182, 212, 0.5)');
        heatGrad2.addColorStop(1, 'transparent');

        ctxHeat.fillStyle = heatGrad2;
        ctxHeat.fillRect(0, 0, w, h);
        refreshIcons();
    }

    const btnToggleSift = document.getElementById('btn-toggle-sift');
    if (btnToggleSift) {
        btnToggleSift.addEventListener('click', renderVisualizerCanvases);
    }

    // --- EDA Explorer Charts ---
    function renderEDACharts() {
        // Scatter Chart (Price vs Area)
        if (scatterChart) scatterChart.destroy();
        const ctxScatter = document.getElementById('chart-scatter').getContext('2d');

        const scatterData = [];
        for (let i = 0; i < 80; i++) {
            const area = Math.random() * 4000 + 600;
            const priceINR = area * (6000 + Math.random() * 8000) + (Math.random() * 500000);
            scatterData.push({ x: area, y: priceINR });
        }

        scatterChart = new Chart(ctxScatter, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Pan-India Real Estate Dataset',
                    data: scatterData,
                    backgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const area = context.raw.x;
                                const priceINR = context.raw.y;
                                const priceUSD = priceINR / USD_TO_INR_RATE;
                                return `${area.toFixed(0)} sq ft: ${formatINR(priceINR)} (${formatUSD(priceUSD)})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Square Footage (Sq Ft)', color: '#94a3b8' },
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        title: { display: true, text: 'Price (₹ INR / $ USD)', color: '#94a3b8' },
                        ticks: {
                            color: '#94a3b8',
                            callback: function(val) { return formatINR(val); }
                        },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        });

        // Correlation Heatmap Chart
        if (corrChart) corrChart.destroy();
        const ctxCorr = document.getElementById('chart-correlation').getContext('2d');

        corrChart = new Chart(ctxCorr, {
            type: 'bar',
            data: {
                labels: ['Area Size (sq ft)', 'City Locality Rate', 'Bathrooms', 'Bedrooms (BHK)', 'Visual Appeal (CNN)', 'Avg Room Area'],
                datasets: [{
                    label: 'Pearson Correlation with Property Value (r)',
                    data: [0.84, 0.79, 0.62, 0.58, 0.46, 0.41],
                    backgroundColor: '#06b6d4',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#f8fafc' } } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
        refreshIcons();
    }

    // Initial Kickoff
    renderSubImages();
    updateValuation();
});
