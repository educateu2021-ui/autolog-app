import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings,
    Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge,
    DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info,
    Shield, CheckCircle, Search, X, LogIn,
    AlertOctagon, Camera, Clock, Upload, Calendar, AlertCircle,
    MoreVertical, FileCheck, PenTool, Layers, Download,
    Users, PhoneCall, MapPin, ChevronDown, Bell, ShieldAlert, Lock, UserPlus,
    ClipboardCheck, TrendingUp, History, FileWarning, ClipboardList, Check,
    MessageSquare, ShoppingBag, ExternalLink, ThumbsUp, MessageCircle, BarChart3,
    ArrowLeft, Send, Bike, Truck, CalendarCheck, Menu, FileDown, Share2, Printer,
    Sun, Moon, Crown, CreditCard, Sparkles, CircleDashed, Warehouse
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

// Simple CSV Export
const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const simpleData = data.map(item => {
        const newItem = { ...item };
        Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'object' && newItem[key] !== null) {
                delete newItem[key];
            }
        });
        return newItem;
    });

    if (simpleData.length === 0) return;

    const headers = Object.keys(simpleData[0]).join(',');
    const rows = simpleData.map(obj => Object.values(obj).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Data Constants ---

const VEHICLE_TYPES = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Bike', icon: Bike },
    { id: 'scooter', label: 'Scooter', icon: Zap },
    { id: 'truck', label: 'Heavy', icon: Truck },
];

const CAR_BRANDS = [
    { id: 'maruti', name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Maruti_Suzuki_logo.svg' },
    { id: 'tata', name: 'Tata Motors', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg' },
    { id: 'mahindra', name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Mahindra_Rise_New_Logo.svg' },
    { id: 'hyundai', name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { id: 'toyota', name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
    { id: 'kia', name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg' },
    { id: 'honda', name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { id: 'vw', name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
];

const BIKE_BRANDS = [
    { id: 're', name: 'Royal Enfield', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Royal_Enfield_logo.png' },
    { id: 'hero', name: 'Hero', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Hero_MotoCorp_Logo.svg' },
    { id: 'honda_2w', name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { id: 'bajaj', name: 'Bajaj', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Bajaj_Auto_Logo.svg' },
    { id: 'tvs', name: 'TVS', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/TVS_Motor_Company_Logo.svg' },
    { id: 'yamaha', name: 'Yamaha', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Yamaha_Motor_Logo.svg' },
    { id: 'ktm', name: 'KTM', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/KTM_logo.svg' },
    { id: 'suzuki', name: 'Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg' },
];

const ACCESSORIES_DATA = [
    { id: 1, name: '70mai Dash Cam Pro Plus', price: 9999, category: 'Electronics', image: 'https://m.media-amazon.com/images/I/61y+1tQ0+GL._AC_UF1000,1000_QL80_.jpg' },
    { id: 2, name: 'Michelin Tyre Inflator', price: 3400, category: 'Safety', image: 'https://m.media-amazon.com/images/I/71Xy-K-p+fL._AC_UF1000,1000_QL80_.jpg' },
    { id: 3, name: 'Memory Foam Neck Pillow', price: 1200, category: 'Comfort', image: 'https://m.media-amazon.com/images/I/71Y-s+1gW+L._AC_UF1000,1000_QL80_.jpg' },
    { id: 4, name: '3M Car Care Kit', price: 1500, category: 'Cleaning', image: 'https://m.media-amazon.com/images/I/61+9C5y-tTL._AC_UF1000,1000_QL80_.jpg' },
    { id: 5, name: 'Car Vacuum Cleaner', price: 2100, category: 'Cleaning', image: 'https://m.media-amazon.com/images/I/61P4G+Z+JXL._AC_UF1000,1000_QL80_.jpg' },
    { id: 6, name: 'Ambient Lighting Kit', price: 850, category: 'Styling', image: 'https://m.media-amazon.com/images/I/71Q+Z+JXL._AC_UF1000,1000_QL80_.jpg' },
];

const FORUM_TOPICS = [
    { id: 'f1', title: 'Whistling noise at 80kmph?', author: 'Rajesh K.', replies: 12, type: 'Issue', desc: 'I hear a strange sound from the left window side when crossing 80. Anyone else?' },
    { id: 'f2', title: 'Best insurance for 5-year-old car?', author: 'Amit Singh', replies: 8, type: 'Discuss', desc: 'My zero-dep policy is expiring. Should I stick to comprehensive?' },
    { id: 'f3', title: 'Selling my 2021 Creta SX', author: 'Vikram', replies: 4, type: 'Market', desc: 'Single owner, 25k driven. Asking 13.5L.' },
];

const EXPENSE_CATEGORIES = [
    'Fuel', 'Toll', 'Parking', 'Car Wash', 'Service & Maintenance',
    'Repairs', 'Insurance', 'Fines/Challan', 'Accessories',
    'Tuning/Mods', 'EMI', 'Tyres', 'Other'
];

const TRIP_TYPES = ['City', 'Highway', 'Office Commute', 'Personal', 'Road Trip', 'Off-Road'];

const MAINTENANCE_TASKS = [
    { id: 'd1', label: 'Tyre Pressure', frequency: 'Daily', category: 'Safety' },
    { id: 'd2', label: 'Dashboard Warnings', frequency: 'Daily', category: 'Electronics' },
    { id: 'd3', label: 'Visual Inspection', frequency: 'Daily', category: 'Exterior' },
    { id: 'm1', label: 'Engine Oil Level', frequency: 'Monthly', category: 'Engine' },
    { id: 'm2', label: 'Coolant Level', frequency: 'Monthly', category: 'Engine' },
    { id: 'm3', label: 'Brake Fluid', frequency: 'Monthly', category: 'Safety' },
    { id: 'm4', label: 'Wiper Fluid', frequency: 'Monthly', category: 'Exterior' },
    { id: 'm5', label: 'Lights (Head/Tail)', frequency: 'Monthly', category: 'Electronics' },
    { id: 'y1', label: 'Annual Service', frequency: 'Yearly', category: 'General' },
    { id: 'y2', label: 'Tyre Rotation', frequency: 'Yearly', category: 'Tyres' },
    { id: 'y3', label: 'Wheel Alignment', frequency: 'Yearly', category: 'Tyres' },
    { id: 'y4', label: 'Cabin Air Filter', frequency: 'Yearly', category: 'Interior' },
    { id: 'y5', label: 'Insurance Renewal', frequency: 'Yearly', category: 'Admin' },
    { id: 'y6', label: 'Emission (PUC)', frequency: 'Yearly', category: 'Admin' },
];

const WARNING_LIGHTS_DATA = [
    { id: 1, name: 'Check Engine', icon: <Activity className="text-yellow-500" />, severity: 'Warning', desc: 'Engine issue. Safe to drive short distance.', action: 'Visit Garage' },
    { id: 2, name: 'Oil Pressure', icon: <Droplet className="text-red-500" />, severity: 'Critical', desc: 'Low oil pressure. Engine damage imminent.', action: 'STOP IMMEDIATELY' },
    { id: 3, name: 'Battery', icon: <Zap className="text-red-500" />, severity: 'Critical', desc: 'Charging failure. Car will die soon.', action: 'Turn off AC' },
    { id: 4, name: 'Temperature', icon: <Thermometer className="text-red-500" />, severity: 'Critical', desc: 'Overheating. Do not drive.', action: 'Stop & Cool' },
    { id: 5, name: 'ABS', icon: <Disc className="text-yellow-500" />, severity: 'Warning', desc: 'Anti-lock brakes disabled.', action: 'Drive Safe' },
    { id: 6, name: 'TPMS', icon: <Gauge className="text-yellow-500" />, severity: 'Info', desc: 'Low tyre pressure.', action: 'Inflate' },
    { id: 7, name: 'Airbag (SRS)', icon: <Shield className="text-red-500" />, severity: 'Critical', desc: 'Airbags may not deploy in a crash.', action: 'Service Immediately' },
    { id: 8, name: 'Traction Control', icon: <Car className="text-yellow-500" />, severity: 'Warning', desc: 'Traction control active or disabled.', action: 'Drive Carefully' },
    { id: 9, name: 'Fog Lights', icon: <Layers className="text-green-500" />, severity: 'Info', desc: 'Front fog lights are on.', action: 'Use in Fog/Rain' },
    { id: 10, name: 'Diesel Glow Plug', icon: <Zap className="text-yellow-500" />, severity: 'Info', desc: 'Engine is pre-heating (Diesel only).', action: 'Wait to Start' },
    { id: 11, name: 'Washer Fluid', icon: <Droplet className="text-blue-400" />, severity: 'Info', desc: 'Windshield washer fluid low.', action: 'Top Up Fluid' },
    { id: 12, name: 'Brake Pad Wear', icon: <Disc className="text-yellow-500" />, severity: 'Warning', desc: 'Brake pads are thin.', action: 'Replace Soon' },
];

const RSA_SERVICES = [
    { id: 'tow', name: 'Tow Vehicle', icon: <Car />, color: 'red' },
    { id: 'fuel', name: 'Fuel Delivery', icon: <Fuel />, color: 'orange' },
    { id: 'jump', name: 'Battery Jumpstart', icon: <Zap />, color: 'yellow' },
    { id: 'flat', name: 'Puncture Repair', icon: <Disc />, color: 'slate' },
    { id: 'mech', name: 'Nearby Mechanic', icon: <Wrench />, color: 'blue' },
    { id: 'key', name: 'Key Lockout', icon: <Lock />, color: 'purple' },
];

// --- Types ---

type UserAccount = { id: string; name: string; mobile: string; isPro: boolean; email?: string; };
type Vehicle = { id: string; type: 'Car' | 'Bike' | 'Scooter' | 'Truck'; make: string; logo?: string; model: string; regNumber: string; color: string; role: 'Owner' | 'Driver'; fuelType?: 'Petrol' | 'Diesel' | 'EV' | 'CNG'; };
type FamilyMember = { id: string; name: string; role: 'Admin' | 'Driver' | 'Viewer'; avatar: string; };
type Document = { id: string; vehicleId: string; type: 'Insurance' | 'PUC' | 'RC' | 'FastTag'; provider: string; number: string; expiryDate: string; fileUrl?: string; };
type Accident = { id: string; vehicleId: string; date: string; location: string; description: string; damageType: 'Minor' | 'Major' | 'Total Loss'; insuranceClaimed: boolean; cost: number; status: 'Pending' | 'Fixed'; photos: number; };
type Booking = { id: string; vehicleId: string; serviceType: string; date: string; time: string; garage: string; status: 'Pending' | 'Confirmed' | 'Completed'; notes: string; };

// --- Shared UI Components ---

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <div onClick={onClick} className={cn("bg-white border border-gray-200 rounded-xl shadow-sm transition-colors duration-300", className)}>
        {children}
    </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-95";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
        secondary: "bg-gray-100 hover:bg-gray-200 text-slate-800 border border-gray-200",
        danger: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20",
        success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30",
        pro: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40",
        gold: "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg shadow-amber-900/40",
        ghost: "text-slate-500 hover:text-slate-900 hover:bg-gray-100"
    };
    return (
        <button onClick={onClick} disabled={disabled} className={cn(baseStyle, variants[variant as keyof typeof variants], className)}>
            {children}
        </button>
    );
};

const Input = ({ label, ...props }: any) => (
    <div className="mb-3">
        {label && <label className="block text-slate-500 text-xs font-bold uppercase mb-1">{label}</label>}
        <input {...props} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400 text-sm transition-all focus:border-blue-500" />
    </div>
);

const StatCard = ({ label, value, icon, color, onClick, className }: any) => (
    <Card onClick={onClick} className={cn("p-4 border-l-4 transform hover:scale-105 transition-all duration-300", color === 'blue' ? 'border-l-blue-500' : color === 'emerald' ? 'border-l-emerald-500' : color === 'purple' ? 'border-l-purple-500' : 'border-l-slate-500', onClick && "cursor-pointer", className)}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{value}</h3>
            </div>
            <div className={cn("p-2 rounded-lg opacity-80", color === 'blue' ? 'bg-blue-500/10 text-blue-500' : color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : color === 'purple' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-500')}>
                {icon}
            </div>
        </div>
    </Card>
);

const NavButton = ({ id, icon: Icon, label, active, set }: any) => (
    <button onClick={() => set(id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all", active === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-900')}>
        <Icon size={18} /><span>{label}</span>
    </button>
);

const MobileNavBtn = ({ id, icon: Icon, active, set, label }: any) => (
    <button onClick={() => set(id)} className={cn("flex flex-col items-center justify-center gap-1 transition-all py-2 px-4 rounded-lg", active === id ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500')}>
        <Icon size={20} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

const WarningLightCard = ({ light }: { light: typeof WARNING_LIGHTS_DATA[0] }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 items-start hover:border-slate-400 transition-colors">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 shrink-0">
            {light.icon}
        </div>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-900 text-sm">{light.name}</h4>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                    light.severity === 'Critical' ? 'bg-red-500/20 text-red-600' :
                        light.severity === 'Warning' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-blue-500/20 text-blue-600'
                )}>
                    {light.severity}
                </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{light.desc}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-gray-100 px-2 py-1 rounded inline-block">
                <AlertCircle size={10} /> Action: {light.action}
            </div>
        </div>
    </div>
);

// Helper for Circular Icon
const CircularProgress = ({ percent, color, icon: Icon, label }: any) => {
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (percent / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={color} strokeLinecap="round" />
                </svg>
                <Icon size={14} className="absolute text-slate-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">{label}</span>
            <span className={cn("text-[9px] font-bold", percent > 90 ? "text-red-500" : "text-slate-400")}>{percent}%</span>
        </div>
    )
};

// Helper ShieldCheck for Payment Success
const ShieldCheck = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

// --- Modals ---

// NEW: Premium Onboarding Modal
const OnboardingModal = ({ isOpen, onClose, onComplete }: any) => {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState({ name: '', email: '', mobile: '' });
    const [vehicle, setVehicle] = useState({ type: 'Car', make: '', model: '', regNumber: '', fuelType: 'Petrol' });
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const ONBOARDING_PLANS = [
        {
            id: 'month',
            name: 'Monthly Pro',
            price: 300,
            originalPrice: null,
            duration: '30 Days',
            features: ['Service Predictor', 'Full History', 'Export Data'],
            style: 'border-slate-200 bg-white'
        },
        {
            id: 'year',
            name: 'Annual Elite',
            price: 499,
            originalPrice: 1500,
            duration: '1 Year',
            features: ['All Pro Features', 'Priority RSA', 'Resale Pack'],
            tag: 'POPULAR',
            style: 'border-blue-500 bg-blue-50'
        },
        {
            id: 'lifetime',
            name: 'Lifetime Access',
            price: 5000,
            originalPrice: 8000,
            duration: 'Forever',
            features: ['One-time Payment', 'All Future Updates', 'VIP Support', 'Cloud Backup'],
            tag: 'BEST VALUE',
            style: 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50'
        },
    ];

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 3 && !selectedPlan) {
            alert("Please select a plan to continue.");
            return;
        }
        setStep(step + 1);
    };

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            // Trigger completion directly. The modal will close because parent component 
            // will detect a user is now logged in.
            onComplete({ user, vehicle, plan: selectedPlan });
        }, 2000);
    };

    const ProgressBar = () => (
        <div className="w-full bg-gray-100 h-1.5 mt-0 mb-6">
            <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
            ></div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-2xl p-0 relative overflow-hidden shadow-2xl rounded-2xl bg-white border-0">
                <ProgressBar />

                {/* Header Section */}
                <div className="px-8 pt-4 pb-2 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            {step === 1 && "Let's Get Started"}
                            {step === 2 && "Your Machine"}
                            {step === 3 && "Unlock Potential"}
                            {step === 4 && "Final Step"}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {step === 1 && "Create your driver profile."}
                            {step === 2 && "Tell us what you drive."}
                            {step === 3 && "Choose a plan that fits your journey."}
                            {step === 4 && "Secure payment gateway."}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-5xl font-black text-slate-100 select-none">0{step}</span>
                    </div>
                </div>

                <div className="p-8 pt-4 min-h-[400px]">
                    {/* Step 1: User Details */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                                    <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium" placeholder="e.g. Rahul Dravid" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mobile</label>
                                    <input value={user.mobile} onChange={(e) => setUser({ ...user, mobile: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium" placeholder="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium" placeholder="name@example.com" />
                            </div>

                            <div className="pt-4">
                                <Button className="w-full py-4 text-lg bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200" onClick={handleNext} disabled={!user.name || !user.mobile}>
                                    Continue <ChevronRight size={20} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Vehicle Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="flex gap-4 justify-center">
                                {VEHICLE_TYPES.map(vt => (
                                    <button key={vt.id} onClick={() => setVehicle({ ...vehicle, type: vt.label as any })}
                                        className={cn("w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2",
                                            vehicle.type === vt.label
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                                                : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500 hover:shadow-md")}>
                                        <vt.icon size={28} />
                                        <span className="text-xs font-bold">{vt.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Make</label>
                                    <input value={vehicle.make} onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Tata" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Model</label>
                                    <input value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Harrier" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Registration Number</label>
                                <input value={vehicle.regNumber} onChange={(e) => setVehicle({ ...vehicle, regNumber: e.target.value.toUpperCase() })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg tracking-wider focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="KA 05 MN 2024" />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-slate-600 font-medium">Back</button>
                                <Button className="px-8 py-3 bg-slate-900 hover:bg-slate-800" onClick={handleNext} disabled={!vehicle.make || !vehicle.regNumber}>
                                    Next Step <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Plans */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {ONBOARDING_PLANS.map(p => (
                                    <div key={p.id} onClick={() => setSelectedPlan(p)}
                                        className={cn(
                                            "relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between min-h-[220px]",
                                            selectedPlan?.id === p.id ? "ring-2 ring-offset-2 ring-blue-500 shadow-lg" : "hover:border-blue-200",
                                            p.style
                                        )}>
                                        {p.tag && (
                                            <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full text-white shadow-sm", p.id === 'lifetime' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-blue-500')}>
                                                {p.tag}
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{p.name}</h3>
                                            <div className="mt-2 mb-4">
                                                {p.originalPrice && <span className="text-slate-400 line-through text-xs block">₹{p.originalPrice}</span>}
                                                <span className="text-2xl font-black text-slate-900">₹{p.price}</span>
                                                <span className="text-xs text-slate-500 font-medium"> / {p.duration}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {p.features.map((f: string, i: number) => (
                                                    <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                                        <CheckCircle size={12} className={cn(p.id === 'lifetime' ? "text-amber-600" : "text-blue-600")} /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className={cn("w-full h-1 mt-4 rounded-full", selectedPlan?.id === p.id ? (p.id === 'lifetime' ? 'bg-amber-500' : 'bg-blue-600') : 'bg-transparent')} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-slate-600 font-medium">Back</button>
                                <Button variant="gold" className={cn("px-10 py-3 transition-all", !selectedPlan && "opacity-50 grayscale")} onClick={handleNext} disabled={!selectedPlan}>
                                    Proceed to Pay <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Animation */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center h-full py-8 animate-in zoom-in-95 fade-in duration-500">
                            {processing ? (
                                <div className="text-center space-y-6">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <CreditCard className="text-slate-300 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Secure Processing</h3>
                                        <p className="text-slate-500 text-sm mt-1">Connecting to gateway...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full max-w-sm space-y-6">
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Amount</p>
                                                    <h2 className="text-3xl font-bold">₹{selectedPlan?.price}</h2>
                                                </div>
                                                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                                    <ShieldCheck className="text-emerald-400" size={24} />
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-white/10">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400">Plan</span>
                                                    <span className="font-medium text-amber-400">{selectedPlan?.name}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400">User</span>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="success" className="w-full py-4 text-lg font-bold shadow-lg shadow-emerald-200" onClick={handlePayment}>
                                        Confirm & Pay ₹{selectedPlan?.price}
                                    </Button>

                                    <button onClick={() => setStep(3)} className="w-full text-center text-xs text-slate-400 hover:text-slate-600">
                                        Cancel & Change Plan
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const AuthModal = ({ isOpen, onClose, onLogin, onOpenOnboarding }: any) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm p-6 relative">
                <h2 className="text-xl font-bold text-slate-900 mb-1">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-slate-500 text-sm mb-6">{isLogin ? 'Login to access your garage' : 'Join Autolog today'}</p>

                <div className="space-y-3">
                    {!isLogin && <Input label="Full Name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />}
                    <Input label="Email or Mobile" value={formData.email} onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} />
                    <Input label="Password" type="password" value={formData.password} onChange={(e: any) => setFormData({ ...formData, password: e.target.value })} />
                </div>

                <Button className="w-full mt-6" onClick={() => onLogin({ name: formData.name || 'User', id: generateId(), isPro: !isLogin })}>
                    {isLogin ? 'Log In' : 'Sign Up'}
                </Button>

                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">New here?</p>
                    <button
                        className="text-blue-500 font-bold text-sm hover:underline mt-1"
                        onClick={() => { onClose(); onOpenOnboarding(); }}
                    >
                        Register & Get Pro Access
                    </button>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"><X size={20} /></button>
            </Card>
        </div>
    );
};

const AddFamilyModal = ({ isOpen, onClose, onSave }: any) => {
    const [data, setData] = useState({ name: '', role: 'Viewer', mobile: '' });
    if (!isOpen) return null;

    const isValid = data.name && data.mobile.length >= 10;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm p-6 relative bg-white">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-xl" />
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 mt-2"><UserPlus size={24} className="text-purple-500" /> Add Member</h2>

                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-purple-50 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-purple-500 mb-2 border-2 border-purple-100">
                            {data.name ? data.name[0].toUpperCase() : <Users size={32} className="opacity-50" />}
                        </div>
                        <p className="text-xs text-slate-400">Preview Avatar</p>
                    </div>

                    <Input label="Name" placeholder="e.g. John Doe" value={data.name} onChange={(e: any) => setData({ ...data, name: e.target.value })} />
                    <Input label="Mobile Number" type="tel" placeholder="10-digit number" value={data.mobile} onChange={(e: any) => setData({ ...data, mobile: e.target.value })} />

                    <div>
                        <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Role & Permissions</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Driver', 'Viewer', 'Admin'].map(r => (
                                <button key={r} onClick={() => setData({ ...data, role: r })} className={cn("py-2 px-3 rounded-lg text-xs font-bold border transition-all", data.role === r ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-gray-200 text-slate-500 hover:bg-purple-50")}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-8">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button disabled={!isValid} onClick={() => onSave({ ...data, avatar: data.name[0].toUpperCase() })} className="flex-1 bg-purple-600 hover:bg-purple-500 shadow-purple-200">Add Member</Button>
                </div>
            </Card>
        </div>
    );
};

const AddVehicleModal = ({ isOpen, onClose, onSave }: any) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<any>({ type: 'Car', make: '', model: '', regNumber: '', fuelType: 'Petrol', logo: '' });

    if (!isOpen) return null;

    const handleBrandSelect = (brand: any) => {
        setData({ ...data, make: brand.name, logo: brand.logo });
        setStep(2);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg p-0 relative overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        {step === 0 ? <><Settings size={20} className="text-blue-500" /> Select Type</> : step === 1 ? <><Car size={20} className="text-blue-500" /> Select Brand</> : <><Settings size={20} className="text-blue-500" /> Vehicle Details</>}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X size={20} /></button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step === 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {VEHICLE_TYPES.map(vt => (
                                <button key={vt.id} onClick={() => { setData({ ...data, type: vt.label }); setStep(1); }} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 flex flex-col items-center gap-2 transition-all">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                                        <vt.icon size={24} />
                                    </div>
                                    <span className="font-bold text-slate-900">{vt.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : step === 1 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {(data.type === 'Bike' || data.type === 'Scooter' ? BIKE_BRANDS : CAR_BRANDS).map(brand => (
                                <div key={brand.id} onClick={() => handleBrandSelect(brand)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-gray-50 cursor-pointer transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-full p-2 flex items-center justify-center overflow-hidden border border-gray-100">
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs text-slate-500 group-hover:text-slate-900 text-center font-medium">{brand.name}</span>
                                </div>
                            ))}
                            <div onClick={() => setStep(2)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-gray-50 cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-slate-400">
                                    <Plus size={24} />
                                </div>
                                <span className="text-xs text-slate-500 text-center font-medium">Other</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-10 fade-in duration-300">
                            <div className="flex items-center gap-4 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                {data.logo ? (
                                    <div className="w-12 h-12 bg-white rounded-full p-2 flex items-center justify-center">
                                        <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {data.make?.[0] || 'C'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Selected Brand</p>
                                    <p className="text-slate-900 font-bold text-lg">{data.make || 'Custom'}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="ml-auto text-xs text-blue-500 underline">Change</button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Model Name" placeholder={data.type === 'Bike' ? "e.g. Classic 350" : "e.g. Fortuner"} value={data.model} onChange={(e: any) => setData({ ...data, model: e.target.value })} />
                                <Input label="Registration No." placeholder="KA-01-AB-1234" value={data.regNumber} onChange={(e: any) => setData({ ...data, regNumber: e.target.value.toUpperCase() })} />
                            </div>

                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Fuel Type</label>
                                <div className="flex gap-2">
                                    {['Petrol', 'Diesel', 'CNG', 'EV'].map(f => (
                                        <button key={f} onClick={() => setData({ ...data, fuelType: f })} className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", data.fuelType === f ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-gray-50 border-gray-200 text-slate-500 hover:bg-gray-100")}>
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Color (Optional)" placeholder="e.g. White" value={data.color} onChange={(e: any) => setData({ ...data, color: e.target.value })} />
                                <Input label="VIN Number (Optional)" placeholder="e.g. 17-digit code" value={data.vin} onChange={(e: any) => setData({ ...data, vin: e.target.value })} />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                <Button disabled={!data.make || !data.model || !data.regNumber || !data.fuelType} onClick={() => onSave(data)} className="flex-1">Add Vehicle</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const AddTripModal = ({ isOpen, onClose, onSave, lastOdometer }: any) => {
    const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], type: 'City', startOdometer: lastOdometer, endOdometer: lastOdometer + 1, notes: '' });

    useEffect(() => { if (isOpen) setData(prev => ({ ...prev, startOdometer: lastOdometer, endOdometer: lastOdometer + 1 })) }, [isOpen, lastOdometer]);
    if (!isOpen) return null;

    const isValid = data.date && data.endOdometer > data.startOdometer;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Car size={20} className="text-blue-500" /> Log Trip</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Date" type="date" value={data.date} onChange={(e: any) => setData({ ...data, date: e.target.value })} />
                    <div className="mb-3">
                        <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Type</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 text-sm" value={data.type} onChange={(e: any) => setData({ ...data, type: e.target.value })}>
                            {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Start Odo" type="number" value={data.startOdometer} onChange={(e: any) => setData({ ...data, startOdometer: Number(e.target.value) })} />
                    <Input label="End Odo" type="number" value={data.endOdometer} onChange={(e: any) => setData({ ...data, endOdometer: Number(e.target.value) })} />
                </div>

                <div className="bg-gray-100 p-3 rounded mb-3 text-center border border-gray-200 mt-2">
                    <span className="text-xs text-slate-500 uppercase">Distance Driven</span>
                    <p className={cn("text-xl font-bold", data.endOdometer > data.startOdometer ? "text-slate-900" : "text-red-500")}>
                        {data.endOdometer > data.startOdometer ? `${data.endOdometer - data.startOdometer} km` : "Invalid Odometer"}
                    </p>
                </div>
                <Input label="Notes" placeholder="Route info..." value={data.notes} onChange={(e: any) => setData({ ...data, notes: e.target.value })} />
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button disabled={!isValid} onClick={() => onSave(data)} className="flex-1">Save Log</Button>
                </div>
            </Card>
        </div>
    );
};

const AddExpenseModal = ({ isOpen, onClose, onSave }: any) => {
    const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], category: 'Fuel', amount: '', vendor: '', notes: '', litres: '', odometer: '' });
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><DollarSign size={20} className="text-emerald-500" /> Add Expense</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Date" type="date" value={data.date} onChange={(e: any) => setData({ ...data, date: e.target.value })} />
                    <div className="mb-3">
                        <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Category</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 text-sm" value={data.category} onChange={(e: any) => setData({ ...data, category: e.target.value })}>
                            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input label="Amount (₹)" type="number" value={data.amount} onChange={(e: any) => setData({ ...data, amount: e.target.value })} />
                    {data.category === 'Fuel' ? (
                        <Input label="Litres" type="number" placeholder="e.g. 35.5" value={data.litres} onChange={(e: any) => setData({ ...data, litres: e.target.value })} />
                    ) : (
                        <Input label="Vendor" placeholder="e.g. Shell" value={data.vendor} onChange={(e: any) => setData({ ...data, vendor: e.target.value })} />
                    )}
                </div>

                {data.category === 'Fuel' && (
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <Input label="Odometer (km)" type="number" placeholder="Current Reading" value={data.odometer} onChange={(e: any) => setData({ ...data, odometer: e.target.value })} />
                        <Input label="Vendor" placeholder="Station Name" value={data.vendor} onChange={(e: any) => setData({ ...data, vendor: e.target.value })} />
                    </div>
                )}

                <Input label="Notes" placeholder="Details..." value={data.notes} onChange={(e: any) => setData({ ...data, notes: e.target.value })} />
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button
                        disabled={!data.amount || Number(data.amount) <= 0 || (data.category === 'Fuel' && (!data.litres || !data.odometer))}
                        variant="success"
                        onClick={() => onSave({ ...data, amount: Number(data.amount), litres: data.litres ? Number(data.litres) : undefined, odometer: data.odometer ? Number(data.odometer) : undefined })}
                        className="flex-1"
                    >
                        Save
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const AddAccidentModal = ({ isOpen, onClose, onSave }: any) => {
    const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], location: '', description: '', damageType: 'Minor', insuranceClaimed: false, cost: '' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertOctagon size={20} className="text-red-500" /> Log Accident</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Date" type="date" value={data.date} onChange={(e: any) => setData({ ...data, date: e.target.value })} />
                    <div className="mb-3">
                        <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Severity</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 text-sm" value={data.damageType} onChange={(e: any) => setData({ ...data, damageType: e.target.value })}>
                            <option>Minor</option><option>Major</option><option>Total Loss</option>
                        </select>
                    </div>
                    <Input label="Location" placeholder="Street/City" value={data.location} onChange={(e: any) => setData({ ...data, location: e.target.value })} />
                    <Input label="Repair Cost" type="number" placeholder="₹" value={data.cost} onChange={(e: any) => setData({ ...data, cost: e.target.value })} />
                </div>
                <div className="flex items-center gap-3 mb-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" checked={data.insuranceClaimed} onChange={(e) => setData({ ...data, insuranceClaimed: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-600">Insurance Claimed?</span>
                </div>
                <Input label="Description" placeholder="What happened?" value={data.description} onChange={(e: any) => setData({ ...data, description: e.target.value })} />
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button variant="danger" onClick={() => onSave(data)} className="flex-1">Save Report</Button>
                </div>
            </Card>
        </div>
    )
};

const SmartScanModal = ({ isOpen, onClose, onSave }: any) => {
    const [step, setStep] = useState(1);
    const [scanned, setScanned] = useState<any>(null);

    const simulateScan = () => {
        setStep(2);
        setTimeout(() => {
            setScanned({
                vendor: 'Speedy Auto Care',
                date: new Date().toISOString().split('T')[0],
                items: [
                    { item: '5W-30 Engine Oil', cost: 2400 },
                    { item: 'Oil Filter', cost: 350 },
                    { item: 'Air Filter', cost: 400 },
                    { item: 'Labor', cost: 850 }
                ],
                total: 4000
            });
            setStep(3);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm p-6 text-center">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Smart Bill Scanner</h3>

                {step === 1 && (
                    <div className="py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-gray-50 transition-all" onClick={simulateScan}>
                        <Camera className="mx-auto text-slate-500 mb-2" size={32} />
                        <p className="text-slate-500 text-sm">Tap to Upload Bill</p>
                    </div>
                )}

                {step === 2 && (
                    <div className="py-12">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-purple-500 text-sm animate-pulse">Extracting Line Items...</p>
                    </div>
                )}

                {step === 3 && scanned && (
                    <div className="text-left space-y-3">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex gap-2 items-center">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <span className="text-emerald-600 text-sm font-bold">Scan Complete</span>
                        </div>
                        <div className="space-y-1 bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="flex justify-between text-xs text-slate-500 uppercase font-bold border-b border-gray-200 pb-1 mb-1">
                                <span>Item</span><span>Cost</span>
                            </div>
                            {scanned.items.map((i: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm text-slate-700">
                                    <span>{i.item}</span><span>₹{i.cost}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-gray-200 pt-2 mt-2">
                                <span>Total</span><span>₹{scanned.total}</span>
                            </div>
                        </div>
                        <Button variant="success" className="w-full" onClick={() => {
                            onSave({
                                date: scanned.date, category: 'Service & Maintenance',
                                amount: scanned.total, vendor: scanned.vendor,
                                notes: 'Smart Scan Import', isVerified: true, lineItems: scanned.items
                            });
                            onClose();
                        }}>Add to Expenses</Button>
                    </div>
                )}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500"><X size={20} /></button>
            </Card>
        </div>
    );
};

const IssueReportModal = ({ isOpen, onClose, onSave, taskName }: any) => {
    const [data, setData] = useState({ severity: 'medium', cost: '', description: '' });
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2"><AlertOctagon className="text-red-500" size={20} /> Report Issue</h3>
                <p className="text-slate-400 text-sm mb-4">Logging defect for: <span className="text-slate-900 font-bold">{taskName}</span></p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-slate-500 uppercase font-bold mb-2">Severity</label>
                        <div className="flex gap-2">
                            {['low', 'medium', 'critical'].map(s => (
                                <button key={s} onClick={() => setData({ ...data, severity: s })} className={cn("flex-1 py-2 rounded text-xs font-bold capitalize border", data.severity === s ? (s === 'critical' ? 'bg-red-500 border-red-500 text-white' : 'bg-yellow-500 border-yellow-500 text-black') : 'bg-slate-50 border-slate-200 text-slate-400')}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <Input label="Est. Cost (Optional)" type="number" placeholder="₹" value={data.cost} onChange={(e: any) => setData({ ...data, cost: e.target.value })} />
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Description</label>
                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 h-20 focus:outline-none focus:border-red-500" placeholder="Describe the problem..." value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button variant="danger" onClick={() => onSave(data)} className="flex-1">Log Defect</Button>
                </div>
            </Card>
        </div>
    );
};

const ResellFormModal = ({ isOpen, onClose, onPostToCommunity }: any) => {
    const [step, setStep] = useState(1);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-amber-500" /> Sell Car</h2>

                {step === 1 ? (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500 mb-2">How soon do you want to sell?</p>
                        {['Immediately (Urgent)', 'In a few weeks', 'In a month', 'Just Checking Price'].map((opt, i) => (
                            <button key={i} onClick={() => {
                                if (opt.includes("Checking")) { alert("Estimated Market Value: ₹12.5L - ₹13.2L"); onClose(); }
                                else setStep(2);
                            }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-sm text-slate-900 hover:border-amber-500 transition-all flex justify-between group">
                                {opt} <ChevronRight className="text-slate-500 group-hover:text-amber-500" />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center space-y-4 animate-in slide-in-from-right-10 fade-in">
                        <div className="bg-amber-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-amber-500 mb-2"><Users size={32} /></div>
                        <h3 className="text-slate-900 font-bold">List in Community?</h3>
                        <p className="text-xs text-slate-400">Pro users can list their cars directly in the Autolog Community Marketplace for verified buyers.</p>
                        <div className="flex gap-2 mt-4">
                            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                            <Button variant="gold" onClick={onPostToCommunity} className="flex-1">Post Listing</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}

const AddDocumentModal = ({ isOpen, onClose, onSave }: any) => {
    const [data, setData] = useState<any>({ type: 'Insurance', provider: '', number: '', expiryDate: '', fileUrl: '' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Document</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="mb-3">
                        <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Type</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 text-sm" value={data.type} onChange={(e: any) => setData({ ...data, type: e.target.value })}>
                            <option value="Insurance">Insurance</option>
                            <option value="PUC">PUC (Emission)</option>
                            <option value="RC">RC (Registration)</option>
                            <option value="FastTag">FASTag</option>
                        </select>
                    </div>
                    <Input label="Expiry Date" type="date" value={data.expiryDate} onChange={(e: any) => setData({ ...data, expiryDate: e.target.value })} />
                    <Input label="Provider / Issuer" placeholder="e.g. Acko" value={data.provider} onChange={(e: any) => setData({ ...data, provider: e.target.value })} />
                    <Input label="Policy/Doc Number" value={data.number} onChange={(e: any) => setData({ ...data, number: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button onClick={() => onSave(data)} className="flex-1">Save Doc</Button>
                </div>
            </Card>
        </div>
    );
};

// --- New Component: Garage & Family View ---

const GarageFamilyView = ({ vehicles, currentVehicleId, onSelectVehicle, onAddVehicle, onDeleteVehicle, family, onAddMember, onDeleteMember }: any) => {
    return (
        <div className="animate-in fade-in space-y-8 pb-20 md:pb-0">
            {/* Vehicles Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">My Garage</h2>
                    <div className="flex gap-2">
                        <Button onClick={onAddVehicle}><Plus size={16} /> Add Vehicle</Button>
                        <Button variant="secondary" onClick={onAddMember}><UserPlus size={16} /> Add Family</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v: any) => (
                        <Card key={v.id} className={cn("p-5 border-2 transition-all group relative", currentVehicleId === v.id ? "border-blue-500 bg-blue-50/50" : "border-transparent hover:border-blue-200")}>
                            {v.id === currentVehicleId && <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Active</div>}
                            <div className="flex items-start gap-4 mb-4">
                                {v.logo ? <img src={v.logo} className="w-12 h-12 object-contain" /> : <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100"><Car size={24} className="text-slate-400" /></div>}
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{v.make} {v.model}</h3>
                                    <p className="text-xs text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 inline-block mt-1">{v.regNumber}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => onSelectVehicle(v.id)} variant={currentVehicleId === v.id ? "primary" : "secondary"} className="flex-1 text-xs">
                                    {currentVehicleId === v.id ? 'Selected' : 'Select'}
                                </Button>
                                <Button size="sm" variant="danger" onClick={(e: any) => { e.stopPropagation(); onDeleteVehicle(v.id); }} className="px-3"><Trash2 size={14} /></Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Family Section */}
            <div className="mt-10">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={20} className="text-purple-500" /> Family & Drivers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Current User Card */}
                    <Card className="p-4 bg-blue-50 border-blue-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">You</div>
                        <div>
                            <h3 className="font-bold text-slate-900">Owner (You)</h3>
                            <p className="text-xs text-blue-600 font-medium">Admin Access</p>
                        </div>
                    </Card>

                    {family.map((f: any) => (
                        <Card key={f.id} className="p-4 flex items-center justify-between group hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                                    {f.avatar || f.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{f.name}</h3>
                                    <p className="text-xs text-slate-500">{f.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onDeleteMember(f.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Member"
                            >
                                <Trash2 size={18} />
                            </button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Service Booking Page ---

const ServiceBookingView = ({ bookings, onBook }: any) => {
    const [isBooking, setIsBooking] = useState(false);
    const [formData, setFormData] = useState({ center: '', date: '', serviceType: 'General Service', notes: '' });

    if (isBooking) {
        return (
            <div className="animate-in fade-in space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setIsBooking(false)} className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900"><ArrowLeft size={20} /></button>
                    <div><h2 className="text-xl font-bold text-slate-900">Book New Service</h2><p className="text-xs text-slate-500">Schedule maintenance</p></div>
                </div>
                <Card className="p-6 max-w-lg mx-auto">
                    <div className="space-y-4">
                        <Input label="Service Center / Garage" placeholder="e.g. GoMechanic, Official Center" value={formData.center} onChange={(e: any) => setFormData({ ...formData, center: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Preferred Date" type="date" value={formData.date} onChange={(e: any) => setFormData({ ...formData, date: e.target.value })} />
                            <div className="mb-3">
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Service Type</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm" value={formData.serviceType} onChange={(e: any) => setFormData({ ...formData, serviceType: e.target.value })}>
                                    <option>General Service</option><option>Oil Change</option><option>Car Wash</option><option>Repair/Issue</option><option>Tyre Change</option>
                                </select>
                            </div>
                        </div>
                        <Input label="Notes / Issues" placeholder="Describe any problems..." value={formData.notes} onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })} />
                        <Button className="w-full mt-4" onClick={() => { onBook({ ...formData, status: 'Confirmed', id: generateId() }); setIsBooking(false); }}>Confirm Booking</Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-slate-900">Service Bookings</h2><p className="text-slate-400 text-sm">Manage appointments</p></div>
                <Button onClick={() => setIsBooking(true)}><Plus size={16} /> New Booking</Button>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 && <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-500">No upcoming bookings.</div>}
                {bookings.map((b: any) => (
                    <Card key={b.id} className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{b.center}</h3>
                                <p className="text-sm text-slate-400">{b.serviceType}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {b.date}</span>
                                    {b.notes && <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{b.notes}</span>}
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded uppercase">{b.status}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const WalkthroughOverlay = ({ onClose }: any) => {
    const [step, setStep] = useState(0);
    const steps = [
        { title: 'Welcome to Autolog!', desc: "You're all set! We've pre-loaded some demo data for you to explore.", position: 'center' },
        { title: 'Dashboard', desc: 'Your central hub for vehicle stats, alerts, and quick actions.', position: 'top-left' },
        { title: 'Quick Actions', desc: 'Log trips and expenses with a single tap.', position: 'top-center' },
        { title: 'Menu', desc: 'Access detailed logs, garage management, and community features.', position: 'left' }
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-in fade-in flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl max-w-md text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{steps[step].title}</h2>
                <p className="text-slate-500 mb-8">{steps[step].desc}</p>

                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i === step ? "bg-blue-600" : "bg-gray-200")} />
                        ))}
                    </div>
                    <Button onClick={() => {
                        if (step < steps.length - 1) setStep(step + 1);
                        else onClose();
                    }}>
                        {step < steps.length - 1 ? 'Next' : 'Get Started'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Landing Page Component ---

const LandingPage = ({ onRegister, onLogin }: any) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="mb-8 p-6 bg-blue-600/10 rounded-full border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                <Car size={64} className="text-blue-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                AUTOLOG <span className="text-blue-500">PRO</span>
            </h1>
            <p className="text-slate-500 max-w-md text-lg mb-10 leading-relaxed">
                The ultimate vehicle management suite. Track maintenance, expenses, and health in one secure place.
            </p>

            <div className="space-y-4 w-full max-w-xs">
                <Button className="w-full py-4 text-lg shadow-blue-500/25" onClick={onRegister}>
                    Get Started
                </Button>
                <Button variant="secondary" className="w-full py-4 text-lg bg-transparent border-slate-300 hover:bg-slate-100 text-slate-600" onClick={onLogin}>
                    Login
                </Button>
            </div>

            <div className="mt-12 flex gap-8 text-slate-500">
                <div className="flex flex-col items-center gap-2">
                    <Shield size={24} />
                    <span className="text-xs font-bold uppercase">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Zap size={24} />
                    <span className="text-xs font-bold uppercase">Fast</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Activity size={24} />
                    <span className="text-xs font-bold uppercase">Smart</span>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function AutologApp() {
    // CHANGE 1: Force default state to 'light' and removed theme toggler logic
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [communityTab, setCommunityTab] = useState('discuss');
    const [activeTopic, setActiveTopic] = useState<any>(null);

    // Data State
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null);
    const [trips, setTrips] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>(MAINTENANCE_TASKS.map(t => ({ id: t.id, lastChecked: null, status: 'pending' })));
    const [docs, setDocs] = useState<Document[]>([]);
    const [family, setFamily] = useState<FamilyMember[]>([]);
    const [accidents, setAccidents] = useState<Accident[]>([]);
    const [marketListings, setMarketListings] = useState<any[]>(FORUM_TOPICS.filter(t => t.type === 'Market'));
    const [discussionListings, setDiscussionListings] = useState<any[]>(FORUM_TOPICS.filter(t => t.type !== 'Market'));
    const [bookings, setBookings] = useState<Booking[]>([]);

    // UI States
    const [modals, setModals] = useState({ trip: false, expense: false, scan: false, pro: false, doc: false, accident: false, resell: false, addVehicle: false, addFamily: false });
    const [issueTarget, setIssueTarget] = useState<{ id: string, name: string } | null>(null);
    const [showAuth, setShowAuth] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showMobileVehicleMenu, setShowMobileVehicleMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [showWalkthrough, setShowWalkthrough] = useState(false);

    // View States for Combined Tabs
    const [logViewMode, setLogViewMode] = useState<'trips' | 'expenses'>('trips');
    const [maintViewMode, setMaintViewMode] = useState<'checklist' | 'history'>('checklist');
    const [commViewMode, setCommViewMode] = useState<'discuss' | 'shop'>('shop');

    // Initial Walkthrough Check
    useEffect(() => {
        const hasSeenWalkthrough = localStorage.getItem('autolog_walkthrough_seen');
        if (user && !hasSeenWalkthrough) {
            setShowWalkthrough(true);
            localStorage.setItem('autolog_walkthrough_seen', 'true');
        }
    }, [user]);

    // CHANGE 2: Force remove 'dark' class on mount
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('autolog-theme', 'light');
    }, []);

    // ... (Keep existing maintenance auto-reset useEffect) ...
    useEffect(() => {
        const checkMaintenanceReset = () => {
            const now = new Date();
            setTasks(prevTasks => prevTasks.map(task => {
                if (!task.lastChecked || task.status === 'issue') return task;
                const lastDate = new Date(task.lastChecked);
                const diffTime = Math.abs(now.getTime() - lastDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const def = MAINTENANCE_TASKS.find(t => t.id === task.id);
                if (!def) return task;
                let shouldReset = false;
                if (def.frequency === 'Daily' && diffDays >= 1) shouldReset = true;
                if (def.frequency === 'Monthly' && diffDays >= 30) shouldReset = true;
                if (def.frequency === 'Yearly' && diffDays >= 365) shouldReset = true;
                return shouldReset ? { ...task, status: 'pending', lastChecked: null } : task;
            }));
        };
        if (activeTab === 'dashboard') { checkMaintenanceReset(); }
    }, [activeTab]);

    // Load Data
    useEffect(() => {
        const savedUser = localStorage.getItem('autolog_user');
        const u = savedUser ? JSON.parse(savedUser) : null;
        setUser(u);
        loadDemoData();
    }, []);

    const loadDemoData = () => {
        const v1 = 'v1';
        const v2 = 'v2';

        const dVehicles: Vehicle[] = [
            { id: v1, type: 'Car', make: 'Toyota', model: 'Fortuner', regNumber: 'KA-01-MJ-2024', color: 'White', role: 'Owner', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
            { id: v2, type: 'Bike', make: 'Royal Enfield', model: 'Classic 350', regNumber: 'TN-09-AB-1234', color: 'Black', role: 'Owner', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Royal_Enfield_logo.png' }
        ];
        setVehicles(dVehicles);
        setCurrentVehicleId(v1);

        const today = new Date();
        const prevMonth = new Date(new Date().setMonth(today.getMonth() - 1));
        const twoMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 2));

        setTrips([
            { id: 't1', vehicleId: v1, date: today.toISOString().split('T')[0], startOdometer: 45000, endOdometer: 45150, distance: 150, type: 'Highway', notes: 'Weekend Trip' },
            { id: 't2', vehicleId: v2, date: prevMonth.toISOString().split('T')[0], startOdometer: 12000, endOdometer: 12030, distance: 30, type: 'City', notes: 'Office' },
            { id: 't3', vehicleId: v1, date: twoMonthsAgo.toISOString().split('T')[0], startOdometer: 45200, endOdometer: 45600, distance: 400, type: 'Highway', notes: 'Long Drive' }
        ]);

        setExpenses([
            { id: 'e0', vehicleId: v1, date: twoMonthsAgo.toISOString().split('T')[0], category: 'Fuel', amount: 3000, vendor: 'Shell', notes: 'Previous Fill', litres: 30, odometer: 44800 },
            { id: 'e1', vehicleId: v1, date: today.toISOString().split('T')[0], category: 'Fuel', amount: 2500, vendor: 'Shell', notes: 'Full Tank', litres: 24, odometer: 45150 },
            { id: 'e2', vehicleId: v1, date: prevMonth.toISOString().split('T')[0], category: 'Service & Maintenance', amount: 5400, vendor: 'Toyota Service', notes: 'Annual Service', isVerified: true, odometer: 42000, lineItems: [{ item: 'Oil', cost: 2000 }, { item: 'Filter', cost: 400 }, { item: 'Labor', cost: 3000 }] },
            { id: 'e3', vehicleId: v2, date: today.toISOString().split('T')[0], category: 'Fuel', amount: 1500, vendor: 'HP', notes: 'Refuel', litres: 15, odometer: 12030 },
            { id: 'e4', vehicleId: v1, date: today.toISOString().split('T')[0], category: 'Accessories', amount: 1200, vendor: 'Amazon', notes: 'Car Perfume' },
            { id: 'e5', vehicleId: v1, date: prevMonth.toISOString().split('T')[0], category: 'Insurance', amount: 15000, vendor: 'Acko', notes: 'Renewal' }
        ]);

        setDocs([
            { id: 'doc1', vehicleId: v1, type: 'Insurance', provider: 'HDFC Ergo', number: 'POL-998877', expiryDate: '2025-12-30' },
            { id: 'doc2', vehicleId: v2, type: 'RC', provider: 'Govt', number: 'RC-1122', expiryDate: '2028-06-15' }
        ]);

        setFamily([
            { id: 'f1', name: 'Father', role: 'Admin', avatar: 'F' },
        ]);

        setAccidents([
            { id: 'a1', vehicleId: v1, date: '2022-06-10', location: 'City Center, Bangalore', description: 'Rear bumper scratch', damageType: 'Minor', insuranceClaimed: false, cost: 2500, status: 'Fixed', photos: 2 }
        ]);
    };

    const currentVehicle = vehicles.find(v => v.id === currentVehicleId) || vehicles[0];
    const currentTrips = trips.filter(t => t.vehicleId === currentVehicleId);
    const currentExpenses = expenses.filter(e => e.vehicleId === currentVehicleId);
    const currentDocs = docs.filter(d => d.vehicleId === currentVehicleId);
    const currentAccidents = accidents.filter(a => a.vehicleId === currentVehicleId);
    const currentBookings = bookings.filter(b => b.vehicleId === currentVehicleId);

    const lastOdometer = currentTrips.length > 0 ? Math.max(...currentTrips.map(t => t.endOdometer)) : 0;
    const totalSpent = currentExpenses.reduce((a, b) => a + (b.amount || 0), 0);

    // --- Advanced Service & Parts Logic ---
    const partsHealth = useMemo(() => {
        // Helper to find last service Odometer for keyword
        const findLastOdo = (keyword: string) => {
            const relevant = currentExpenses
                .filter(e => JSON.stringify(e).toLowerCase().includes(keyword.toLowerCase()))
                .sort((a, b) => (b.odometer || 0) - (a.odometer || 0)); // Sort descending by odometer if avail, or date

            // Use expense odometer if available, else estimate based on date relative to trips (simplified: use currentOdo if recent)
            if (relevant.length > 0) return relevant[0].odometer || (lastOdometer - 1000); // Mock fallback
            return 0;
        };

        const lastOil = findLastOdo('oil');
        const lastBrake = findLastOdo('brake');
        const lastTyre = findLastOdo('tyre');

        // Lifespans (km)
        const LIFE_OIL = 10000;
        const LIFE_BRAKE = 25000;
        const LIFE_TYRE = 40000;

        return {
            oil: { last: lastOil, used: lastOdometer - lastOil, total: LIFE_OIL, percent: Math.min(100, Math.round(((lastOdometer - lastOil) / LIFE_OIL) * 100)) },
            brake: { last: lastBrake, used: lastOdometer - lastBrake, total: LIFE_BRAKE, percent: Math.min(100, Math.round(((lastOdometer - lastBrake) / LIFE_BRAKE) * 100)) },
            tyre: { last: lastTyre, used: lastOdometer - lastTyre, total: LIFE_TYRE, percent: Math.min(100, Math.round(((lastOdometer - lastTyre) / LIFE_TYRE) * 100)) },
        };
    }, [currentExpenses, lastOdometer]);

    const servicePrediction = useMemo(() => {
        const lastService = currentExpenses.find(e => e.category === 'Service & Maintenance');
        if (!lastService) return null;

        const lastDate = new Date(lastService.date);
        const lastServiceOdo = lastService.odometer || (lastOdometer - 2000);

        // Intervals
        const dateInterval = 6; // months
        const distInterval = 10000; // km

        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + dateInterval);

        const nextOdo = lastServiceOdo + distInterval;
        const distRemaining = nextOdo - lastOdometer;

        const today = new Date();
        const timeDiff = nextDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const isOverdue = daysRemaining < 0 || distRemaining < 0;

        return {
            nextDate: nextDate.toISOString().split('T')[0],
            nextOdo,
            daysRemaining,
            distRemaining,
            isOverdue,
            lastServiceDate: lastService.date
        };
    }, [currentExpenses, lastOdometer]);

    // Mileage Calculation
    const mileageData = useMemo(() => {
        const fuels = currentExpenses.filter(e => e.category === 'Fuel' && e.odometer && e.litres).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (fuels.length < 2) return null;
        const last = fuels[fuels.length - 1];
        const prev = fuels[fuels.length - 2];
        const dist = last.odometer - prev.odometer;
        if (dist <= 0) return null;
        const efficiency = dist / last.litres;
        return { efficiency: efficiency.toFixed(1), unit: 'km/L', lastCost: last.amount, dist };
    }, [currentExpenses]);

    // Chart Data
    const chartData = useMemo(() => {
        const grouped: any = {};
        const now = new Date();
        currentExpenses.forEach(e => {
            const d = new Date(e.date);
            let key = '';
            if (chartPeriod === 'week') {
                const diffTime = Math.abs(now.getTime() - d.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) key = d.toLocaleDateString('en-US', { weekday: 'short' });
            } else if (chartPeriod === 'month') {
                if (d.getFullYear() === now.getFullYear()) key = d.toLocaleDateString('en-US', { month: 'short' });
            } else if (chartPeriod === 'year') {
                key = d.getFullYear().toString();
            }
            if (key) grouped[key] = (grouped[key] || 0) + e.amount;
        });
        return Object.entries(grouped).map(([label, value]: any) => ({ label, value }));
    }, [currentExpenses, chartPeriod]);

    const maxChartValue = Math.max(...chartData.map(d => d.value), 100);

    const healthScore = useMemo(() => {
        let score = 100;
        if (partsHealth.oil.percent > 90) score -= 15;
        if (partsHealth.brake.percent > 90) score -= 15;
        if (partsHealth.tyre.percent > 90) score -= 15;
        if (currentAccidents.length > 0) score -= 5;
        return Math.max(0, score);
    }, [partsHealth, currentAccidents]);

    const handleOnboardingComplete = (data: any) => {
        // 1. Create User
        const newUser = { id: generateId(), name: data.user.name, email: data.user.email, mobile: data.user.mobile, isPro: true };
        setUser(newUser);
        localStorage.setItem('autolog_user', JSON.stringify(newUser));

        // 2. Add Vehicle
        const newVehicle = { id: generateId(), ...data.vehicle, role: 'Owner' };
        setVehicles([newVehicle, ...vehicles]); // Add to top
        setCurrentVehicleId(newVehicle.id);

        // 3. Close Modal
        setShowOnboarding(false);
        alert(`Welcome ${newUser.name}! Your ${data.plan.name} is now active.`);
    };

    // NEW Handlers for Garage & Family Management
    const deleteVehicle = (id: string) => {
        if (vehicles.length <= 1) return alert("You must have at least one vehicle.");
        if (confirm("Are you sure you want to remove this vehicle? All data will be lost.")) {
            setVehicles(vehicles.filter(v => v.id !== id));
            if (currentVehicleId === id) setCurrentVehicleId(vehicles.find(v => v.id !== id)?.id || null);
        }
    };

    const deleteFamilyMember = (id: string) => {
        if (confirm("Remove this member?")) {
            setFamily(family.filter(f => f.id !== id));
        }
    };

    // --- Views ---

    // NOTE: If no user is logged in, show the Landing Page Gatekeeper
    if (!user) {
        return (
            <div className={cn("min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-300", "bg-gray-50 text-slate-900")}>
                <LandingPage
                    onRegister={() => setShowOnboarding(true)}
                    onLogin={() => setShowAuth(true)}
                />
                {/* Auth & Onboarding Modals */}
                <AuthModal
                    isOpen={showAuth}
                    onClose={() => setShowAuth(false)}
                    onLogin={(u: any) => { setUser(u); setShowAuth(false); }}
                    onOpenOnboarding={() => { setShowAuth(false); setShowOnboarding(true); }}
                />

                <OnboardingModal
                    isOpen={showOnboarding}
                    onClose={() => setShowOnboarding(false)}
                    onComplete={handleOnboardingComplete}
                />
            </div>
        );
    }

    // --- App Views (Only for Authenticated Users) ---

    const renderMobileMenu = () => (
        <div className="animate-in slide-in-from-bottom-10 fade-in pb-24">
            <div className="bg-slate-900 p-6 rounded-b-[2.5rem] mb-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-10 -ml-10 -mb-10 pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Menu</p>
                        <h2 className="text-3xl font-black text-white">Explore<br />Autolog</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white shadow-inner">
                        <Menu size={24} />
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">
                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Manage</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveTab('manage_garage')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-blue-500 transition-colors shadow-sm">
                            <Warehouse className="text-blue-500" />
                            <span className="text-sm font-bold text-slate-900">My Garage</span>
                        </button>
                        <button onClick={() => setActiveTab('book_service')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-blue-500 transition-colors shadow-sm">
                            <CalendarCheck className="text-blue-500" />
                            <span className="text-sm font-bold text-slate-900">Book Service</span>
                        </button>
                        <button onClick={() => setActiveTab('docs')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-purple-500 transition-colors shadow-sm">
                            <Shield className="text-purple-500" />
                            <span className="text-sm font-bold text-slate-900">Documents</span>
                        </button>
                        <button onClick={() => setActiveTab('resell')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-amber-500 transition-colors shadow-sm">
                            <TrendingUp className="text-amber-500" />
                            <span className="text-sm font-bold text-slate-900">Resale</span>
                        </button>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Track & Maintain</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveTab('history')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-emerald-500 transition-colors shadow-sm">
                            <History className="text-emerald-500" />
                            <span className="text-sm font-bold text-slate-900">History</span>
                        </button>
                        <button onClick={() => setActiveTab('maintenance')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-orange-500 transition-colors shadow-sm">
                            <Wrench className="text-orange-500" />
                            <span className="text-sm font-bold text-slate-900">Maintenance</span>
                        </button>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Connect</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveTab('community')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-indigo-500 transition-colors shadow-sm">
                            <MessageSquare className="text-indigo-500" />
                            <span className="text-sm font-bold text-slate-900">Community</span>
                        </button>
                        <button onClick={() => setActiveTab('shop')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-pink-500 transition-colors shadow-sm">
                            <ShoppingBag className="text-pink-500" />
                            <span className="text-sm font-bold text-slate-900">Shop</span>
                        </button>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Safety</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveTab('accidents')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-red-500 transition-colors shadow-sm">
                            <FileWarning className="text-red-500" />
                            <span className="text-sm font-bold text-slate-900">Accidents</span>
                        </button>
                        <button onClick={() => setActiveTab('warnings')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-yellow-500 transition-colors shadow-sm">
                            <AlertTriangle className="text-yellow-500" />
                            <span className="text-sm font-bold text-slate-900">Warnings</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Account</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveTab('account')} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-slate-500 transition-colors shadow-sm">
                        <Settings className="text-slate-500" />
                        <span className="text-sm font-bold text-slate-900">Settings</span>
                    </button>
                </div>
            </div>
        </div>

    );




    // Reusable Render Functions
    const renderTripLogs = () => (
        <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Trip Logs</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => downloadCSV(currentTrips, 'trip_logs')} className="px-3"><Download size={16} /> <span className="hidden md:inline">Export</span></Button>
                    <Button onClick={() => setModals({ ...modals, trip: true })} className="px-3"><Plus size={16} /> <span className="hidden md:inline">Log</span></Button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-gray-100 text-slate-500 font-bold uppercase text-xs">
                        <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Odometer</th><th className="px-4 py-3 text-right">Distance</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {currentTrips.map((t: any) => (
                            <tr key={t.id}><td className="px-4 py-3">{t.date}</td><td className="px-4 py-3">{t.type}</td><td className="px-4 py-3 font-mono">{t.startOdometer}-{t.endOdometer}</td><td className="px-4 py-3 text-right text-slate-900 font-bold">{t.distance} km</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderExpenses = () => (
        <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Expenses</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => downloadCSV(currentExpenses, 'expenses')} className="px-3"><Download size={16} /> <span className="hidden md:inline">Export</span></Button>
                    <Button onClick={() => setModals({ ...modals, scan: true })} className="px-3"><Camera size={16} /> <span className="hidden md:inline">Scan</span></Button>
                    <Button onClick={() => setModals({ ...modals, expense: true })} className="px-3"><Plus size={16} /> <span className="hidden md:inline">Add</span></Button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-gray-100 text-slate-500 font-bold uppercase text-xs">
                        <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3 text-right">Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {currentExpenses.map((e: any) => (
                            <tr key={e.id}><td className="px-4 py-3">{e.date}</td><td className="px-4 py-3">{e.category}</td><td className="px-4 py-3">{e.vendor}</td><td className="px-4 py-3 text-right text-emerald-600 font-bold">₹{e.amount}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderMaintenanceChecklist = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Maintenance Checklist</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {['Daily', 'Monthly', 'Yearly'].map(freq => (
                    <Card key={freq} className="p-0 border-t-4 border-t-blue-500 h-fit">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">{freq} Checks</h3>
                            <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-gray-200">{tasks.filter((t: any) => MAINTENANCE_TASKS.find(def => def.id === t.id)?.frequency === freq && t.status === 'ok').length} / {MAINTENANCE_TASKS.filter(def => def.frequency === freq).length}</span>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {MAINTENANCE_TASKS.filter(def => def.frequency === freq).map(def => {
                                const state = tasks.find((t: any) => t.id === def.id);
                                return (
                                    <div key={def.id} className={cn("p-3 flex items-center justify-between", state?.status === 'issue' ? 'bg-red-50' : 'hover:bg-gray-50')}>
                                        <div>
                                            <p className={cn("text-sm", state?.status === 'ok' ? 'text-slate-400 line-through' : state?.status === 'issue' ? 'text-red-600 font-bold' : 'text-slate-700')}>{def.label}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">{def.category}</p>
                                            {state?.status === 'issue' && <p className="text-xs text-red-500 mt-1">Issue: {state.issueDetails}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button title="Mark OK" onClick={() => setTasks((tasks: any) => tasks.map((t: any) => t.id === def.id ? { ...t, status: t.status === 'ok' ? 'pending' : 'ok', lastChecked: new Date().toISOString().split('T')[0] } : t))} className={cn("p-1 rounded border", state?.status === 'ok' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-gray-300 text-slate-400')}><CheckCircle size={16} /></button>
                                            <button title="Report Issue" onClick={() => setIssueTarget({ id: def.id, name: def.label })} className={cn("p-1 rounded border", state?.status === 'issue' ? 'bg-red-600 border-red-500 text-white' : 'border-gray-300 text-slate-400')}><AlertOctagon size={16} /></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderDashboard = () => {
        const recentActivities = [
            ...currentTrips.map(t => ({ ...t, type: 'trip', sortDate: t.date })),
            ...currentExpenses.map(e => ({ ...e, type: 'expense', sortDate: e.date })),
            ...currentBookings.map(b => ({ ...b, type: 'booking', sortDate: b.date })),
            ...currentAccidents.map(a => ({ ...a, type: 'accident', sortDate: a.date }))
        ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()).slice(0, 5);

        const dueTasks = tasks
            .filter(t => t.status !== 'ok')
            .map(t => ({ ...t, ...MAINTENANCE_TASKS.find(d => d.id === t.id) }))
            .sort((a, b) => (a.status === 'issue' ? -1 : 1))
            .slice(0, 4);

        const insuranceDoc = currentDocs.find(d => d.type === 'Insurance');
        const insuranceDaysLeft = insuranceDoc ? Math.ceil((new Date(insuranceDoc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
        const insuranceStatus = !insuranceDoc ? 'Missing' : insuranceDaysLeft < 0 ? 'Expired' : insuranceDaysLeft < 30 ? 'Expiring Soon' : 'Valid';

        return (
            <div className="space-y-6 animate-in fade-in pb-20 md:pb-0">
                {showWalkthrough && <WalkthroughOverlay onClose={() => setShowWalkthrough(false)} />}

                {/* Header with Personalized Welcome */}
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {user.name.split(' ')[0]}!</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-500 font-medium">Here's what's happening with your garage today.</p>
                            <button onClick={() => setActiveTab('rsa')} className="bg-red-50 text-red-600 p-1 rounded-full border border-red-100 hover:bg-red-100"><PhoneCall size={12} /></button>
                        </div>
                    </div>
                </div>

                {/* Demo Alert */}
                {vehicles.length >= 2 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><Info size={16} /></div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-blue-900">Demo Mode Active</p>
                            <p className="text-xs text-blue-700 mt-1">We found 2 demo vehicles in your garage. You can delete them and add your own in <span className="font-bold underline cursor-pointer" onClick={() => setActiveTab('manage_garage')}>My Garage</span>.</p>
                        </div>
                    </div>
                )}


                {/* Quick Action Buttons */}
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <Button onClick={() => setModals({ ...modals, trip: true })} className="shrink-0"><Car size={16} /> Log Trip</Button>
                    <Button onClick={() => setModals({ ...modals, expense: true })} variant="secondary" className="shrink-0 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"><DollarSign size={16} /> Log Expense</Button>
                    <Button onClick={() => setModals({ ...modals, scan: true })} variant="secondary" className="shrink-0"><Camera size={16} /> Scan Bill</Button>
                    <Button onClick={() => setActiveTab('rsa')} variant="danger" className="shrink-0 bg-red-50 text-red-600 border-red-100 hover:bg-red-100"><PhoneCall size={16} /> SOS</Button>
                </div>

                {/* Stats Grid - Clickable */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard onClick={() => setActiveTab('logs')} label="Odometer" value={`${lastOdometer} km`} icon={<Gauge size={18} />} color="blue" />
                    <StatCard onClick={() => setActiveTab('expenses')} label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign size={18} />} color="emerald" />
                    <StatCard onClick={() => setActiveTab('docs')} label="Docs Active" value={`${currentDocs.length}`} icon={<Shield size={18} />} color="purple" />
                    <StatCard onClick={() => setActiveTab('manage_garage')} label="Family" value={family.length + 1} icon={<Users size={18} />} color="slate" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Stats & Charts */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Mileage Summary Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><Zap size={18} className="text-amber-500" /> Fuel Efficiency</h3>
                            {mileageData ? (
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">{mileageData.efficiency}<span className="text-sm text-slate-500 font-medium ml-1">{mileageData.unit}</span></p>
                                        <p className="text-xs text-slate-400 mt-1">Based on last fill-up ({mileageData.dist} km)</p>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Last Fuel Cost</p>
                                        <p className="text-lg font-bold text-emerald-600">₹{mileageData.lastCost}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-slate-500">Not enough data. Log 2 consecutive fuel fills with odometer readings.</p>
                                    <Button variant="secondary" size="sm" className="mt-2" onClick={() => setModals({ ...modals, expense: true })}>Log Fuel</Button>
                                </div>
                            )}
                        </div>



                        {/* Trips Section */}
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin size={18} className="text-slate-400" /> recent Trips</h3>
                                <button onClick={() => setActiveTab('logs')} className="text-xs text-blue-500 hover:text-blue-600">View All</button>
                            </div>
                            <div className="space-y-3">
                                {recentActivities.filter((a: any) => a.type === 'trip').length > 0 ? (
                                    recentActivities.filter((a: any) => a.type === 'trip').slice(0, 3).map((item: any) => (
                                        <div key={item.id} className="bg-white border border-gray-100 p-3 rounded-xl flex items-center gap-4 hover:border-blue-200 transition-colors shadow-sm">
                                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0"><Car size={18} /></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-slate-900 text-sm">{item.distance} km</h4>
                                                    <span className="text-[10px] text-slate-400">{item.date}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{item.purpose || 'Personal Trip'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4 bg-gray-50 rounded-xl text-sm text-slate-500">No recent trips.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Health, Checklist, Insurance */}
                    <div className="space-y-4">
                        {/* Overall Health */}
                        {/* Overall Health */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                            <div className={cn("p-2 rounded-full", healthScore > 80 ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600")}>
                                <Activity size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Overall Health</p>
                                <div className="h-2 w-32 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                    <div className={cn("h-full", healthScore > 80 ? "bg-emerald-500" : "bg-yellow-500")} style={{ width: `${healthScore}%` }}></div>
                                </div>
                            </div>
                            <span className="ml-auto font-bold text-slate-900 text-sm">{healthScore}%</span>
                        </div>

                        {/* Parts Health Widget */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><Disc size={18} className="text-slate-400" /> Parts Life</h3>
                            <div className="flex justify-between items-center text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <CircularProgress percent={partsHealth.oil.percent} size={48} color="text-amber-500" icon={Droplet} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Oil</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <CircularProgress percent={partsHealth.brake.percent} size={48} color="text-red-500" icon={CircleDashed} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Brake</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <CircularProgress percent={partsHealth.tyre.percent} size={48} color="text-blue-500" icon={Disc} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tyre</span>
                                </div>
                            </div>
                        </div>

                        {/* Service Prediction */}
                        {servicePrediction && (
                            <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase disabled:opacity-70 mb-1"><Wrench size={12} /> Next Service Due</h3>
                                <p className="text-2xl font-black mb-1">{servicePrediction.daysRemaining > 0 ? `in ${servicePrediction.daysRemaining} Days` : 'Overdue!'}</p>
                                <p className="text-indigo-100 text-xs mb-3">Est. {new Date(servicePrediction.nextDate).toLocaleDateString()} or {servicePrediction.nextOdo} km</p>
                                <button onClick={() => setActiveTab('book_service')} className="w-full bg-white text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">Book Now</button>
                            </div>
                        )}

                        {/* Checklist */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><ClipboardCheck size={18} className="text-slate-400" /> Checklist</h3>
                                <button onClick={() => setActiveTab('maintenance')} className="text-xs text-blue-500 hover:text-blue-600">Manage</button>
                            </div>
                            <Card className="p-4 bg-gray-50 border-gray-200">
                                {dueTasks.length === 0 ? (
                                    <div className="text-center py-6">
                                        <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                                            <CheckCircle size={24} />
                                        </div>
                                        <p className="text-slate-900 font-bold text-sm">All Systems Go!</p>
                                        <p className="text-xs text-slate-500">No pending tasks today.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {dueTasks.map((t: any) => (
                                            <div key={t.id} className="flex justify-between items-start bg-white p-2 rounded border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", t.status === 'issue' ? "bg-red-500" : "bg-yellow-500")} />
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-xs">{t.label}</p>
                                                        <p className="text-[10px] text-slate-400">{t.frequency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        title="Mark OK"
                                                        onClick={() => setTasks(tasks.map(tk => tk.id === t.id ? { ...tk, status: 'ok', lastChecked: new Date().toISOString() } : tk))}
                                                        className="p-1 rounded hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-colors"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        title="Report Issue"
                                                        onClick={() => setIssueTarget({ id: t.id, name: t.label })}
                                                        className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <AlertOctagon size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Insurance */}
                        <div className={cn("bg-white border rounded-xl p-3 flex items-center gap-3 shadow-sm", insuranceStatus === 'Valid' ? "border-gray-200" : "border-red-200 bg-red-50")}>
                            <div className={cn("p-2 rounded-full",
                                insuranceStatus === 'Valid' ? "bg-purple-50 text-purple-600" : "bg-red-100 text-red-600"
                            )}>
                                <Shield size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Insurance Status</p>
                                <p className={cn("text-sm font-bold", insuranceStatus === 'Valid' ? "text-slate-900" : "text-red-600")}>
                                    {insuranceStatus}
                                    {insuranceDaysLeft > 0 && insuranceDaysLeft < 60 && ` (${insuranceDaysLeft} days left)`}
                                </p>
                            </div>
                            <button onClick={() => setActiveTab('docs')} className="text-slate-400 hover:text-slate-900"><ChevronRight size={16} /></button>
                        </div>

                    </div>
                </div>

                {/* Expense Chart - Moved to Bottom */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><BarChart3 size={18} className="text-blue-500" /> Expense Trends</h3>
                        <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-bold">
                            <button onClick={() => setChartPeriod('week')} className={cn("px-3 py-1 rounded transition-all", chartPeriod === 'week' ? "bg-white shadow text-slate-900" : "text-slate-500")}>Week</button>
                            <button onClick={() => setChartPeriod('month')} className={cn("px-3 py-1 rounded transition-all", chartPeriod === 'month' ? "bg-white shadow text-slate-900" : "text-slate-500")}>Month</button>
                            <button onClick={() => setChartPeriod('year')} className={cn("px-3 py-1 rounded transition-all", chartPeriod === 'year' ? "bg-white shadow text-slate-900" : "text-slate-500")}>Year</button>
                        </div>
                    </div>
                    <div className="h-40 flex items-end gap-3 justify-between">
                        {chartData.length > 0 ? chartData.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                                <div className="text-[10px] font-bold text-slate-500 mb-1">
                                    {d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}
                                </div>
                                <div className="w-full bg-blue-600 rounded-t-lg relative group-hover:bg-blue-500 transition-colors shadow-sm" style={{ height: `${Math.max(15, (d.value / maxChartValue) * 100)}%` }}>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{d.label}</span>
                            </div>
                        )) : (
                            <div className="w-full text-center text-slate-400 text-sm self-center">No expense data for this period.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };




    const renderAccount = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-slate-800">
                        {user.name[0]}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-blue-300 text-sm">{user.email}</p>
                    </div>
                </div>
            </div>

            <Card className="p-6">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg"><Settings size={20} className="text-slate-400" /> Account Settings</h3>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase border-b border-gray-100 pb-2">Personal Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" value={user.name} onChange={() => { }} />
                        <Input label="Mobile Number" value={user.mobile || ''} placeholder="Add Mobile" onChange={() => { }} />
                        <Input label="Email Address" value={user.email} disabled />
                    </div>

                    <p className="text-xs font-bold text-slate-500 uppercase border-b border-gray-100 pb-2 mt-6">Driving License</p>
                    <Input label="License Number" placeholder="DL-XXXX-XXXXXXX" />

                    <p className="text-xs font-bold text-slate-500 uppercase border-b border-gray-100 pb-2 mt-6">Security</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Change Username" value={user.email.split('@')[0]} />
                        <div className="space-y-2">
                            <Input label="New Password" type="password" placeholder="••••••••" />
                            <Input label="Confirm Password" type="password" placeholder="••••••••" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <Button variant="secondary" onClick={() => setUser(null)} className="text-red-500 hover:bg-red-50 hover:text-red-600"><LogOut size={16} /> Log Out</Button>
                    <Button>Save Changes</Button>
                </div>
            </Card>
        </div>
    );

    // ... (keep existing renderMobileMenu, renderCommunity, renderShop, renderResale, renderServiceHistory, renderAccidents, renderDocuments, renderRSA) ...

    const renderCommunity = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-xl p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Community</h2>
                        <p className="text-slate-400 text-sm">Connect with other car owners.</p>
                    </div>
                    <Button onClick={() => setDiscussionListings([{ id: generateId(), title: "New Topic", author: "You", type: "Discuss", replies: 0 }, ...discussionListings])}><Plus size={16} /> New Topic</Button>
                </div>

                <div className="flex gap-2 mt-4">
                    <button onClick={() => setCommunityTab('discuss')} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", communityTab === 'discuss' ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}>Discussions</button>
                    <button onClick={() => setCommunityTab('market')} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", communityTab === 'market' ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}>Marketplace</button>
                </div>
            </div>

            <div className="space-y-3">
                {(communityTab === 'discuss' ? discussionListings : marketListings).map((topic, i) => (
                    <Card key={i} className="p-4 hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setActiveTopic(topic)}>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-1 inline-block", topic.type === 'Market' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400")}>{topic.type}</span>
                                <h3 className="font-bold text-slate-900 text-md group-hover:text-blue-400 transition-colors">{topic.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">Posted by {topic.author}</p>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-xs bg-gray-100 px-2 py-1 rounded">
                                <MessageCircle size={14} /> {topic.replies}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderShop = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-slate-900">Accessories Shop</h2><p className="text-slate-500 text-sm">Curated gadgets for your {currentVehicle?.model}</p></div>
                <ShoppingBag className="text-purple-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ACCESSORIES_DATA.map(item => (
                    <Card key={item.id} className="p-0 overflow-hidden group hover:border-purple-500/50 transition-all">
                        <div className="aspect-square bg-white p-4 flex items-center justify-center relative">
                            <img src={item.image} alt={item.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity">{item.category}</div>
                        </div>
                        <div className="p-3">
                            <h3 className="text-sm font-bold text-slate-900 truncate mb-1">{item.name}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-emerald-500 font-bold">₹{item.price.toLocaleString()}</span>
                                <button onClick={() => alert("Redirecting to Amazon...")} className="bg-gray-100 hover:bg-purple-600 hover:text-white text-slate-600 p-1.5 rounded-lg transition-colors"><ExternalLink size={14} /></button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderResale = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 border border-amber-500/20 rounded-xl p-6 text-center">
                <TrendingUp size={48} className="mx-auto text-amber-500 mb-2" />
                <h2 className="text-2xl font-bold text-white">Resale Center</h2>
                <p className="text-amber-100/70 text-sm mb-6">Manage value & transfer ownership</p>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-slate-900/50 p-3 rounded border border-amber-500/30">
                        <p className="text-xs text-amber-500 uppercase font-bold">Est. Market Value</p>
                        <p className="text-xl font-bold text-white">₹12.5L - 13.2L</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-amber-500/30">
                        <p className="text-xs text-amber-500 uppercase font-bold">History Score</p>
                        <p className="text-xl font-bold text-white">Excellent</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button variant="gold" onClick={() => setModals({ ...modals, resell: true })}>Sell Car</Button>
                </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-full text-blue-400">
                        <FileDown size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Vehicle Resale Pack</h3>
                        <p className="text-xs text-slate-400">Export verified history, bills & insurance records.</p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={() => alert("Link Copied to Clipboard!")} variant="secondary" className="flex-1 md:flex-initial"><Share2 size={16} /> Share Link</Button>
                    <Button onClick={() => alert("Generating PDF...")} className="flex-1 md:flex-initial"><Printer size={16} /> Generate PDF</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><ClipboardList size={16} className="text-blue-500" /> Transfer Checklist</h3>
                    <div className="space-y-2 text-sm text-slate-500">
                        <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-400 bg-slate-200"></div> Clear Insurance Dues</div>
                        <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-400 bg-slate-200"></div> Get NOC from Bank</div>
                        <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-400 bg-slate-200"></div> Original RC Smart Card</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><History size={16} className="text-purple-500" /> Ownership History</h3>
                    <div className="text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-slate-900">Current Owner</span>
                            <span className="text-slate-500">Since Jan 2022</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-slate-500">1st Owner</span>
                            <span className="text-slate-600">2018 - 2022</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderServiceHistory = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-slate-900">Service Timeline</h2><p className="text-slate-500 text-sm">Maintenance & Repairs</p></div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setModals({ ...modals, expense: true })}><Plus size={16} /> Manual</Button>
                    <Button onClick={() => setModals({ ...modals, scan: true })}><Camera size={16} /> Smart Scan</Button>
                </div>
            </div>
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-gray-200">
                {currentExpenses.filter(e => e.category === 'Service & Maintenance' || e.category === 'Repairs').length === 0 && <p className="text-slate-500 italic pl-4">No service records found.</p>}
                {currentExpenses.filter(e => e.category === 'Service & Maintenance' || e.category === 'Repairs').map(e => (
                    <div key={e.id} className="relative pl-6">
                        <div className={cn("absolute -left-[23px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10", e.category === 'Repairs' ? 'border-orange-500 text-orange-500' : 'border-blue-500 text-blue-500')}><Wrench size={12} /></div>
                        <Card className="p-4 hover:border-blue-500/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div><p className="text-xs font-bold text-slate-500 uppercase mb-1">{e.date}</p><h3 className="font-bold text-slate-900">{e.vendor}</h3></div>
                                <span className="block font-bold text-emerald-600 text-lg">₹{e.amount}</span>
                            </div>
                            {e.lineItems && (
                                <div className="mt-3 bg-gray-50 p-2 rounded border border-gray-200">
                                    {e.lineItems.map((li: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>{li.item}</span><span>{li.cost}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAccidents = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-slate-900">Accident Log</h2><p className="text-slate-500 text-sm">Damage history & insurance claims</p></div>
                <Button variant="danger" onClick={() => setModals({ ...modals, accident: true })}><AlertOctagon size={16} /> Log Accident</Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {currentAccidents.length === 0 && <p className="text-slate-500 italic p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">No accidents recorded.</p>}
                {currentAccidents.map(acc => (
                    <Card key={acc.id} className="p-4 border-l-4 border-l-red-500">
                        <div className="flex justify-between items-start">
                            <div><h3 className="font-bold text-slate-900 text-lg">{acc.location}</h3><p className="text-sm text-slate-500 mt-1">{acc.description}</p></div>
                            <p className="text-red-500 font-bold text-lg">₹{acc.cost}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-slate-900">Documents</h2></div><Button onClick={() => setModals({ ...modals, doc: true })}><Upload size={16} /> Upload</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDocs.map(doc => (
                    <Card key={doc.id} className="p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <div className="pl-2">
                            <p className="text-xs text-slate-500 uppercase font-bold">{doc.type}</p>
                            <h3 className="text-slate-900 font-bold text-lg">{doc.provider}</h3>
                            <p className="text-slate-500 font-mono text-sm">{doc.number}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderRSA = () => (
        <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="bg-red-600 rounded-xl p-6 text-center shadow-lg shadow-red-900/50">
                <ShieldAlert size={48} className="mx-auto text-white/90 mb-2" />
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Emergency Mode</h2>
                <p className="text-red-100 text-sm mb-6">One-tap assistance for {currentVehicle?.regNumber}</p>
                <Button onClick={() => window.location.href = 'tel:1800-123-4567'} className="bg-white text-red-600 hover:bg-red-50 mx-auto w-full max-w-xs font-bold shadow-xl border-0">
                    <PhoneCall size={18} /> Call Toll Free (24x7)
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">{RSA_SERVICES.map(svc => (<Card key={svc.id} className="p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer border-gray-200"><div className="text-slate-500">{svc.icon}</div><span className="font-bold text-slate-900 text-sm">{svc.name}</span></Card>))}</div>
        </div>
    );

    return (
        <div className={cn("min-h-screen font-sans selection:bg-blue-500/30 flex flex-col md:flex-row transition-colors duration-300", "bg-gray-50 text-slate-900")}>

            {/* Auth & Onboarding Modals */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                onLogin={(u: any) => { setUser(u); setShowAuth(false); }}
                onOpenOnboarding={() => { setShowAuth(false); setShowOnboarding(true); }}
            />

            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onComplete={handleOnboardingComplete}
            />

            {/* ... (rest of the modals: AddTripModal, AddExpenseModal, etc.) ... */}
            <AddTripModal isOpen={modals.trip} onClose={() => setModals({ ...modals, trip: false })} onSave={(d: any) => {
                const trip = { id: generateId(), vehicleId: currentVehicleId, ...d, distance: d.endOdometer - d.startOdometer };
                setTrips([trip, ...trips]); setModals({ ...modals, trip: false });
            }} lastOdometer={lastOdometer} />
            {/* ... other modals ... */}
            <AddExpenseModal isOpen={modals.expense} onClose={() => setModals({ ...modals, expense: false })} onSave={(d: any) => {
                setExpenses([{ id: generateId(), vehicleId: currentVehicleId, ...d }, ...expenses]); setModals({ ...modals, expense: false });
            }} />
            <SmartScanModal isOpen={modals.scan} onClose={() => setModals({ ...modals, scan: false })} onSave={(d: any) => {
                setExpenses([{ id: generateId(), vehicleId: currentVehicleId, ...d }, ...expenses]);
            }} />
            <AddDocumentModal isOpen={modals.doc} onClose={() => setModals({ ...modals, doc: false })} onSave={(d: any) => {
                setDocs([...docs, { id: generateId(), vehicleId: currentVehicleId, ...d }]); setModals({ ...modals, doc: false });
            }} />
            <AddAccidentModal isOpen={modals.accident} onClose={() => setModals({ ...modals, accident: false })} onSave={(d: any) => {
                setAccidents([...accidents, { id: generateId(), vehicleId: currentVehicleId, ...d, status: 'Pending', photos: 1 }]); setModals({ ...modals, accident: false });
            }} />
            <ResellFormModal isOpen={modals.resell} onClose={() => setModals({ ...modals, resell: false })} onPostToCommunity={() => {
                setMarketListings([{ id: generateId(), title: `For Sale: ${currentVehicle.make} ${currentVehicle.model}`, author: user?.name || 'Owner', replies: 0, type: 'Market', desc: 'Listing posted via Autolog App.' }, ...marketListings]);
                setModals({ ...modals, resell: false });
                setActiveTab('community');
                setCommunityTab('market');
            }} />
            <AddVehicleModal isOpen={modals.addVehicle} onClose={() => setModals({ ...modals, addVehicle: false })} onSave={(newVehicle: any) => {
                const v = { id: generateId(), ...newVehicle, role: 'Owner' };
                setVehicles([...vehicles, v]);
                setCurrentVehicleId(v.id);
                setModals({ ...modals, addVehicle: false });
            }} />
            <IssueReportModal isOpen={!!issueTarget} taskName={issueTarget ? MAINTENANCE_TASKS.find(t => t.id === issueTarget.id)?.label : ''} onClose={() => setIssueTarget(null)} onSave={(d: any) => {
                if (issueTarget) {
                    setTasks(tasks.map(t => t.id === issueTarget.id ? { ...t, status: 'issue', severity: d.severity, issueDetails: d.description, estimatedCost: d.cost, lastChecked: new Date().toISOString().split('T')[0] } : t));
                    setIssueTarget(null);
                }
            }} />
            <AddFamilyModal isOpen={modals.addFamily} onClose={() => setModals({ ...modals, addFamily: false })} onSave={(newMember: any) => {
                setFamily([...family, { id: generateId(), ...newMember }]);
                setModals({ ...modals, addFamily: false });
            }} />


            {/* --- Sidebar (Desktop) --- */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-bold text-xl text-slate-900 flex items-center gap-2"><Car className="text-blue-500" /> AUTOLOG <span className="text-[10px] bg-purple-500 px-1 rounded text-white">PRO</span></h1>
                    </div>

                    {/* Multi-Vehicle Switcher */}
                    <div className="relative group">
                        <button className="w-full bg-gray-50 border border-gray-200 hover:border-blue-500 rounded-lg p-3 flex items-center justify-between transition-all">
                            <div className="text-left flex items-center gap-3">
                                {currentVehicle?.logo ? (
                                    <img src={currentVehicle.logo} alt="brand" className="w-8 h-8 object-contain" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold">{currentVehicle?.make?.[0] || 'C'}</div>
                                )}
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Current Vehicle</p>
                                    <p className="text-sm font-bold text-slate-900 truncate w-24">{currentVehicle?.make} {currentVehicle?.model}</p>
                                </div>
                            </div>
                            <ChevronDown size={16} className="text-slate-500" />
                        </button>
                        {/* ... (vehicle dropdown code) ... */}
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                            {vehicles.map(v => (
                                <div key={v.id} onClick={() => setCurrentVehicleId(v.id)} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0">
                                    <div className="flex items-center gap-2">
                                        {v.logo ? <img src={v.logo} className="w-5 h-5 object-contain" /> : <Car size={16} className="text-slate-500" />}
                                        <span className={cn("text-sm", v.id === currentVehicleId ? "text-blue-500 font-bold" : "text-slate-700")}>{v.make} {v.model}</span>
                                    </div>
                                    {v.id === currentVehicleId && <Check size={14} className="text-blue-500" />}
                                </div>
                            ))}
                            <div className="p-2 border-t border-gray-200">
                                <button onClick={() => setModals({ ...modals, addVehicle: true })} className="w-full text-xs text-center text-blue-500 py-1 font-bold hover:text-blue-600 flex items-center justify-center gap-1">+ Add Vehicle</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ... (Nav buttons) ... */}
                <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-2">Manage</p>
                    <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
                    <NavButton id="manage_garage" icon={Warehouse} label="My Garage & Family" active={activeTab} set={setActiveTab} />
                    <NavButton id="book_service" icon={CalendarCheck} label="Book Service" active={activeTab} set={setActiveTab} />
                    <NavButton id="docs" icon={Shield} label="Documents" active={activeTab} set={setActiveTab} />
                    <NavButton id="resell" icon={TrendingUp} label="Resale Center" active={activeTab} set={setActiveTab} />

                    <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-6">Track</p>
                    <NavButton id="history" icon={History} label="Service History" active={activeTab} set={setActiveTab} />
                    <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
                    <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
                    <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />

                    <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-6">Connect</p>
                    <NavButton id="community" icon={MessageSquare} label="Community" active={activeTab} set={setActiveTab} />
                    <NavButton id="shop" icon={ShoppingBag} label="Accessories" active={activeTab} set={setActiveTab} />

                    <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-6">Safety</p>
                    <NavButton id="accidents" icon={FileWarning} label="Accident Log" active={activeTab} set={setActiveTab} />
                    <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
                    <NavButton id="rsa" icon={PhoneCall} label="Emergency / RSA" active={activeTab} set={setActiveTab} />

                    <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-6">Account</p>
                    <NavButton id="account" icon={Settings} label="Settings" active={activeTab} set={setActiveTab} />
                </div>

                <div className="p-4 border-t border-gray-200">
                    {user ? (
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                    {user.isPro && <Crown size={12} className="text-amber-500 fill-amber-500" />}
                                </div>
                                <p className="text-xs text-slate-500">{user.isPro ? 'Pro Member' : 'Guest'}</p>
                            </div>
                            <button onClick={() => setUser(null)} className="text-slate-500 hover:text-red-500"><LogOut size={16} /></button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuth(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all">
                            <LogIn size={16} /> Sign In
                        </button>
                    )}
                </div>
            </aside>

            {/* --- Mobile Top Bar --- */}
            <div className="md:hidden sticky top-0 left-0 w-full bg-white border-b border-gray-200 z-30 p-4 flex justify-between items-center">
                <div className="relative group">
                    <button
                        onClick={() => setShowMobileVehicleMenu(!showMobileVehicleMenu)}
                        className="flex items-center gap-2 bg-gray-100 py-1.5 px-3 rounded-full border border-gray-200"
                    >
                        {currentVehicle?.logo ? (
                            <img src={currentVehicle.logo} alt="brand" className="w-5 h-5 object-contain" />
                        ) : (
                            <Car size={16} className="text-blue-500" />
                        )}
                        <span className="text-sm font-bold text-slate-900 max-w-[120px] truncate">
                            {currentVehicle ? `${currentVehicle.make} ${currentVehicle.model}` : "Select Vehicle"}
                        </span>
                        <ChevronDown size={14} className="text-slate-500" />
                    </button>

                    {/* Mobile Vehicle Dropdown */}
                    {showMobileVehicleMenu && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in zoom-in-95 origin-top-left">
                            <div className="p-2 max-h-64 overflow-y-auto">
                                {vehicles.map(v => (
                                    <div key={v.id} onClick={() => { setCurrentVehicleId(v.id); setShowMobileVehicleMenu(false); }} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center rounded-lg mb-1 last:mb-0">
                                        <div className="flex items-center gap-3">
                                            {v.logo ? <img src={v.logo} className="w-6 h-6 object-contain" /> : <Car size={16} className="text-slate-500" />}
                                            <div>
                                                <p className={cn("text-xs font-bold", v.id === currentVehicleId ? "text-blue-600" : "text-slate-700")}>{v.make} {v.model}</p>
                                                <p className="text-[10px] text-slate-400">{v.regNumber}</p>
                                            </div>
                                        </div>
                                        {v.id === currentVehicleId && <Check size={14} className="text-blue-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                                <button onClick={() => { setModals({ ...modals, addVehicle: true }); setShowMobileVehicleMenu(false); }} className="w-full text-xs text-center text-blue-500 py-2 font-bold hover:text-blue-600 flex items-center justify-center gap-1">
                                    <Plus size={14} /> Add New Vehicle
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <div
                                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user.name[0]}
                            </div>
                            {showUserMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <button
                                        onClick={() => { setActiveTab('account'); setShowUserMenu(false); }}
                                        className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                                    >
                                        <Settings size={16} /> Account Settings
                                    </button>
                                    <button
                                        onClick={() => { setUser(null); setShowUserMenu(false); }}
                                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut size={16} /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setShowAuth(true)} className="flex items-center gap-1 text-slate-500 hover:text-slate-900">
                            <UserPlus size={18} />
                        </button>
                    )}
                    <button onClick={() => setActiveTab('menu')} className="text-slate-500 hover:text-slate-900">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* --- Main Content --- */}
            <main className="md:ml-64 flex-1 p-4 md:p-8 min-h-screen">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'menu' && renderMobileMenu()}
                {activeTab === 'account' && renderAccount()}
                {/* NEW: Manage Garage Tab */}
                {activeTab === 'manage_garage' && (
                    <GarageFamilyView
                        vehicles={vehicles}
                        currentVehicleId={currentVehicleId}
                        onSelectVehicle={setCurrentVehicleId}
                        onAddVehicle={() => setModals({ ...modals, addVehicle: true })}
                        onDeleteVehicle={deleteVehicle}
                        family={family}
                        onAddMember={() => setModals({ ...modals, addFamily: true })}
                        onDeleteMember={deleteFamilyMember}
                    />
                )}
                {activeTab === 'book_service' && <ServiceBookingView bookings={bookings} onBook={(b: any) => setBookings([b, ...bookings])} />}
                {activeTab === 'community' && renderCommunity()}
                {activeTab === 'shop' && renderShop()}
                {activeTab === 'history' && renderServiceHistory()}
                {activeTab === 'accidents' && renderAccidents()}
                {activeTab === 'resell' && renderResale()}
                {activeTab === 'rsa' && renderRSA()}
                {activeTab === 'docs' && renderDocuments()}

                {/* Combined Views for Mobile/Tablet */}
                {activeTab === 'combined_logs' && (
                    <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
                        <div className="flex justify-center p-1 bg-gray-100 rounded-lg mx-auto max-w-sm mb-4">
                            <button onClick={() => setLogViewMode('trips')} className={cn("flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all", logViewMode === 'trips' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Trips</button>
                            <button onClick={() => setLogViewMode('expenses')} className={cn("flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all", logViewMode === 'expenses' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Expenses</button>
                        </div>
                        {logViewMode === 'trips' ? renderTripLogs() : renderExpenses()}
                    </div>
                )}

                {activeTab === 'combined_maintenance' && (
                    <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
                        <div className="flex justify-center p-1 bg-gray-100 rounded-lg mx-auto max-w-sm mb-4">
                            <button onClick={() => setMaintViewMode('checklist')} className={cn("flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all", maintViewMode === 'checklist' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Checklist</button>
                            <button onClick={() => setMaintViewMode('history')} className={cn("flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all", maintViewMode === 'history' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>History</button>
                        </div>
                        {maintViewMode === 'checklist' ? renderMaintenanceChecklist() : renderServiceHistory()}
                    </div>
                )}

                {activeTab === 'combined_community' && (
                    <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
                        <div className="flex justify-center p-1 bg-gray-100 rounded-lg mx-auto max-w-sm mb-4">
                            <button onClick={() => setCommViewMode('shop')} className={cn("flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all", commViewMode === 'shop' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Shop</button>
                            <button onClick={() => setCommViewMode('discuss')} className={cn("flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all", commViewMode === 'discuss' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Discuss</button>
                        </div>
                        {commViewMode === 'shop' ? renderShop() : renderCommunity()}
                    </div>
                )}

                {/* Replaced Inline Renders with Function Calls */}
                {activeTab === 'logs' && renderTripLogs()}
                {activeTab === 'expenses' && renderExpenses()}
                {activeTab === 'maintenance' && renderMaintenanceChecklist()}
            </main>

            {/* --- Mobile Bottom Navigation --- */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between px-6 py-2 z-40 shadow-xl shadow-black/10">
                <MobileNavBtn id="dashboard" icon={LayoutDashboard} label="Home" active={activeTab} set={setActiveTab} />
                <MobileNavBtn id="manage_garage" icon={Warehouse} label="Garage" active={activeTab} set={setActiveTab} />
                <MobileNavBtn id="combined_logs" icon={FileText} label="Logs" active={activeTab} set={setActiveTab} />
                <MobileNavBtn id="combined_maintenance" icon={Wrench} label="Service" active={activeTab} set={setActiveTab} />
                <MobileNavBtn id="combined_community" icon={MessageSquare} label="Community" active={activeTab} set={setActiveTab} />
            </div>
        </div>
    );
}
