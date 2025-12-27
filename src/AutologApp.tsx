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
  Sun, Moon, Crown, CreditCard, Sparkles, CircleDashed
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

const SUBSCRIPTION_PLANS = [
    { id: 'week', name: '1 Week Pass', price: 100, duration: '7 Days', features: ['Basic Analytics', 'Trip Logs'] },
    { id: 'month', name: 'Monthly Pro', price: 300, duration: '30 Days', features: ['Service Predictor', 'Full History', 'Export Data'] },
    { id: 'year', name: 'Annual Elite', price: 499, originalPrice: 1500, duration: '1 Year', features: ['All Pro Features', 'Priority RSA', 'Resale Pack'], bestValue: true },
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
  <div onClick={onClick} className={cn("bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors duration-300", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-95";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
    secondary: "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30",
    pro: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40",
    gold: "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg shadow-amber-900/40",
    ghost: "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn(baseStyle, variants[variant as keyof typeof variants], className)}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="mb-3">
    {label && <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">{label}</label>}
    <input {...props} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400 dark:placeholder-slate-600 text-sm transition-all focus:border-blue-500" />
  </div>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <Card className={cn("p-4 border-l-4 transform hover:scale-105 transition-all duration-300", color === 'blue' ? 'border-l-blue-500' : color === 'emerald' ? 'border-l-emerald-500' : color === 'purple' ? 'border-l-purple-500' : 'border-l-slate-500')}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</h3>
      </div>
      <div className={cn("p-2 rounded-lg opacity-80", color === 'blue' ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400' : color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : color === 'purple' ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400')}>
        {icon}
      </div>
    </div>
  </Card>
);

const NavButton = ({ id, icon: Icon, label, active, set }: any) => (
  <button onClick={() => set(id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all", active === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white')}>
    <Icon size={18} /><span>{label}</span>
  </button>
);

const MobileNavBtn = ({ id, icon: Icon, active, set, label }: any) => (
  <button onClick={() => set(id)} className={cn("flex flex-col items-center justify-center gap-1 transition-all py-2 px-4 rounded-lg", active === id ? 'text-blue-500 dark:text-blue-400 bg-blue-500/10' : 'text-slate-500 dark:text-slate-500')}>
    <Icon size={20} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const WarningLightCard = ({ light }: { light: typeof WARNING_LIGHTS_DATA[0] }) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 flex gap-4 items-start hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
    <div className="bg-gray-50 dark:bg-slate-950 p-3 rounded-lg border border-gray-200 dark:border-slate-800 shrink-0">
      {light.icon}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{light.name}</h4>
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase", 
          light.severity === 'Critical' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 
          light.severity === 'Warning' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
        )}>
          {light.severity}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{light.desc}</p>
      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800/50 px-2 py-1 rounded inline-block">
        <AlertCircle size={10} /> Action: {light.action}
      </div>
    </div>
  </div>
);

// Helper for Circular Icon needed in renderDashboard - Defined outside to avoid ReferenceError
const CircularProgress = ({ percent, color, icon: Icon, label }: any) => {
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (percent / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-slate-800" />
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={color} strokeLinecap="round" />
                </svg>
                <Icon size={14} className="absolute text-slate-500 dark:text-slate-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{label}</span>
            <span className={cn("text-[9px] font-bold", percent > 90 ? "text-red-500" : "text-slate-400")}>{percent}%</span>
        </div>
    )
};

// --- Modals ---

const OnboardingModal = ({ isOpen, onClose, onComplete }: any) => {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState({ name: '', email: '', mobile: '' });
    const [vehicle, setVehicle] = useState({ type: 'Car', make: '', model: '', regNumber: '', fuelType: 'Petrol' });
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 3 && !selectedPlan) return alert("Please select a plan");
        setStep(step + 1);
    };

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onComplete({ user, vehicle, plan: selectedPlan });
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <Card className="w-full max-w-lg p-0 relative overflow-hidden">
                <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {step === 1 && <><UserPlus className="text-blue-500" /> Create Account</>}
                            {step === 2 && <><Car className="text-blue-500" /> Add Vehicle</>}
                            {step === 3 && <><Sparkles className="text-amber-500" /> Choose Plan</>}
                            {step === 4 && <><CreditCard className="text-emerald-500" /> Secure Payment</>}
                        </h2>
                        <p className="text-slate-400 text-xs">Step {step} of 4</p>
                    </div>
                    {step > 1 && step < 4 && <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-white text-sm">Back</button>}
                    {step === 1 && <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>}
                </div>

                <div className="p-6">
                    {/* Step 1: User Details */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-10 fade-in">
                            <Input label="Full Name" value={user.name} onChange={(e:any) => setUser({...user, name: e.target.value})} placeholder="John Doe" />
                            <Input label="Email Address" value={user.email} onChange={(e:any) => setUser({...user, email: e.target.value})} placeholder="john@example.com" />
                            <Input label="Mobile Number" value={user.mobile} onChange={(e:any) => setUser({...user, mobile: e.target.value})} placeholder="+91 98765 43210" />
                            <Button className="w-full mt-6" onClick={handleNext} disabled={!user.name || !user.mobile}>Next: Vehicle Details <ChevronRight size={16}/></Button>
                        </div>
                    )}

                    {/* Step 2: Vehicle Details */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-10 fade-in">
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {VEHICLE_TYPES.map(vt => (
                                    <button key={vt.id} onClick={() => setVehicle({...vehicle, type: vt.label as any})} 
                                        className={cn("p-3 rounded-lg border flex flex-col items-center gap-2 transition-all", vehicle.type === vt.label ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600")}>
                                        <vt.icon size={20} />
                                        <span className="text-xs font-bold">{vt.label}</span>
                                    </button>
                                ))}
                            </div>
                            <Input label="Make / Brand" value={vehicle.make} onChange={(e:any) => setVehicle({...vehicle, make: e.target.value})} placeholder="e.g. Toyota" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Model" value={vehicle.model} onChange={(e:any) => setVehicle({...vehicle, model: e.target.value})} placeholder="e.g. Fortuner" />
                                <Input label="Reg Number" value={vehicle.regNumber} onChange={(e:any) => setVehicle({...vehicle, regNumber: e.target.value.toUpperCase()})} placeholder="KA-01-AB-1234" />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">Fuel Type</label>
                                <div className="flex gap-2">
                                    {['Petrol', 'Diesel', 'CNG', 'EV'].map(f => (
                                        <button key={f} onClick={() => setVehicle({...vehicle, fuelType: f as any})} 
                                            className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", vehicle.fuelType === f ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900")}>
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button className="w-full mt-6" onClick={handleNext} disabled={!vehicle.make || !vehicle.regNumber}>Next: Select Plan <ChevronRight size={16}/></Button>
                        </div>
                    )}

                    {/* Step 3: Subscription Plans */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-10 fade-in">
                            {SUBSCRIPTION_PLANS.map(p => (
                                <div key={p.id} onClick={() => setSelectedPlan(p)} 
                                    className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden", selectedPlan?.id === p.id ? "border-amber-500 bg-amber-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-700")}>
                                    {p.bestValue && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">BEST VALUE</div>}
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={cn("font-bold text-lg", selectedPlan?.id === p.id ? "text-white" : "text-slate-300")}>{p.name}</h3>
                                        <div className="text-right">
                                            {p.originalPrice && <span className="text-slate-500 line-through text-xs mr-2">₹{p.originalPrice}</span>}
                                            <span className={cn("font-bold text-xl", selectedPlan?.id === p.id ? "text-amber-400" : "text-white")}>₹{p.price}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {p.features.map((f:string, i:number) => (
                                            <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <Button variant="gold" className="w-full mt-6" onClick={handleNext} disabled={!selectedPlan}>Proceed to Payment <ChevronRight size={16}/></Button>
                        </div>
                    )}

                    {/* Step 4: Payment Simulation */}
                    {step === 4 && (
                        <div className="text-center animate-in zoom-in-95 fade-in py-8">
                            {processing ? (
                                <div className="flex flex-col items-center">
                                    <Activity className="animate-spin text-emerald-500 mb-4" size={48} />
                                    <h3 className="text-white font-bold text-xl">Processing Payment...</h3>
                                    <p className="text-slate-400 text-sm mt-2">Please do not close this window.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-emerald-500/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-emerald-500/20">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-2xl">Payment Summary</h3>
                                        <p className="text-slate-400">Complete your purchase to unlock Pro features.</p>
                                    </div>
                                    
                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-400">Plan</span>
                                            <span className="text-white font-bold">{selectedPlan?.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-400">Duration</span>
                                            <span className="text-white">{selectedPlan?.duration}</span>
                                        </div>
                                        <div className="border-t border-slate-800 my-2 pt-2 flex justify-between">
                                            <span className="text-slate-400">Total</span>
                                            <span className="text-emerald-400 font-bold text-xl">₹{selectedPlan?.price}</span>
                                        </div>
                                    </div>

                                    <Button variant="success" className="w-full py-3 text-lg" onClick={handlePayment}>Pay ₹{selectedPlan?.price} & Start</Button>
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{isLogin ? 'Login to access your garage' : 'Join Autolog today'}</p>
                
                <div className="space-y-3">
                    {!isLogin && <Input label="Full Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />}
                    <Input label="Email or Mobile" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                    <Input label="Password" type="password" value={formData.password} onChange={(e:any) => setFormData({...formData, password: e.target.value})} />
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
                
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white"><X size={20}/></button>
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
                <div className="bg-white dark:bg-slate-900 p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {step === 0 ? <><Settings size={20} className="text-blue-500"/> Select Type</> : step === 1 ? <><Car size={20} className="text-blue-500"/> Select Brand</> : <><Settings size={20} className="text-blue-500"/> Vehicle Details</>}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step === 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {VEHICLE_TYPES.map(vt => (
                                <button key={vt.id} onClick={() => { setData({...data, type: vt.label}); setStep(1); }} className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 flex flex-col items-center gap-2 transition-all">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400">
                                        <vt.icon size={24} />
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">{vt.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : step === 1 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {(data.type === 'Bike' || data.type === 'Scooter' ? BIKE_BRANDS : CAR_BRANDS).map(brand => (
                                <div key={brand.id} onClick={() => handleBrandSelect(brand)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-full p-2 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-0">
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white text-center font-medium">{brand.name}</span>
                                </div>
                            ))}
                            <div onClick={() => setStep(2)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <Plus size={24}/>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">Other</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-10 fade-in duration-300">
                            <div className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                                {data.logo ? (
                                    <div className="w-12 h-12 bg-white rounded-full p-2 flex items-center justify-center">
                                        <img src={data.logo} alt="Logo" className="w-full h-full object-contain"/>
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {data.make?.[0] || 'C'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Selected Brand</p>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg">{data.make || 'Custom'}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="ml-auto text-xs text-blue-500 dark:text-blue-400 underline">Change</button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Model Name" placeholder={data.type === 'Bike' ? "e.g. Classic 350" : "e.g. Fortuner"} value={data.model} onChange={(e:any) => setData({...data, model: e.target.value})} />
                                <Input label="Registration No." placeholder="KA-01-AB-1234" value={data.regNumber} onChange={(e:any) => setData({...data, regNumber: e.target.value.toUpperCase()})} />
                            </div>
                            
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">Fuel Type</label>
                                <div className="flex gap-2">
                                    {['Petrol', 'Diesel', 'CNG', 'EV'].map(f => (
                                        <button key={f} onClick={() => setData({...data, fuelType: f})} className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", data.fuelType === f ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900")}>
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             <Input label="Color (Optional)" placeholder="e.g. White" value={data.color} onChange={(e:any) => setData({...data, color: e.target.value})} />

                            <div className="pt-2 flex gap-3">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                <Button onClick={() => onSave(data)} className="flex-1">Add Vehicle</Button>
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
  
  useEffect(() => { if(isOpen) setData(prev => ({...prev, startOdometer: lastOdometer, endOdometer: lastOdometer + 1})) }, [isOpen, lastOdometer]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-md p-6 relative">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Car size={20} className="text-blue-500"/> Log Trip</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} />
          <div className="mb-3">
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Type</label>
            <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 text-sm" value={data.type} onChange={(e:any) => setData({...data, type: e.target.value})}>
              {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Start Odo" type="number" value={data.startOdometer} onChange={(e:any) => setData({...data, startOdometer: Number(e.target.value)})} />
          <Input label="End Odo" type="number" value={data.endOdometer} onChange={(e:any) => setData({...data, endOdometer: Number(e.target.value)})} />
        </div>
        <div className="bg-gray-100 dark:bg-slate-800/50 p-3 rounded mb-3 text-center border border-gray-200 dark:border-slate-800">
           <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Distance Driven</span>
           <p className="text-xl font-bold text-slate-900 dark:text-white">{Math.max(0, data.endOdometer - data.startOdometer)} km</p>
        </div>
        <Input label="Notes" placeholder="Route info..." value={data.notes} onChange={(e:any) => setData({...data, notes: e.target.value})} />
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => onSave(data)} className="flex-1">Save Log</Button>
        </div>
      </Card>
    </div>
  );
};

const AddExpenseModal = ({ isOpen, onClose, onSave }: any) => {
  const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], category: 'Fuel', amount: '', vendor: '', notes: '' });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-md p-6 relative">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><DollarSign size={20} className="text-emerald-500"/> Add Expense</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} />
          <div className="mb-3">
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Category</label>
            <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 text-sm" value={data.category} onChange={(e:any) => setData({...data, category: e.target.value})}>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Amount (₹)" type="number" value={data.amount} onChange={(e:any) => setData({...data, amount: e.target.value})} />
          <Input label="Vendor" placeholder="e.g. Shell" value={data.vendor} onChange={(e:any) => setData({...data, vendor: e.target.value})} />
        </div>
        <Input label="Notes" placeholder="Details..." value={data.notes} onChange={(e:any) => setData({...data, notes: e.target.value})} />
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="success" onClick={() => onSave({...data, amount: Number(data.amount)})} className="flex-1">Save</Button>
        </div>
      </Card>
    </div>
  );
};

const AddAccidentModal = ({ isOpen, onClose, onSave }: any) => {
    const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], location: '', description: '', damageType: 'Minor', insuranceClaimed: false, cost: '' });
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md p-6 relative">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><AlertOctagon size={20} className="text-red-500"/> Log Accident</h2>
             <div className="grid grid-cols-2 gap-3">
                 <Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} />
                 <div className="mb-3">
                     <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Severity</label>
                     <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 text-sm" value={data.damageType} onChange={(e:any) => setData({...data, damageType: e.target.value})}>
                         <option>Minor</option><option>Major</option><option>Total Loss</option>
                     </select>
                 </div>
                 <Input label="Location" placeholder="Street/City" value={data.location} onChange={(e:any) => setData({...data, location: e.target.value})} />
                 <Input label="Repair Cost" type="number" placeholder="₹" value={data.cost} onChange={(e:any) => setData({...data, cost: e.target.value})} />
             </div>
             <div className="flex items-center gap-3 mb-4 bg-gray-100 dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                 <input type="checkbox" checked={data.insuranceClaimed} onChange={(e) => setData({...data, insuranceClaimed: e.target.checked})} className="w-4 h-4 rounded" />
                 <span className="text-sm text-slate-600 dark:text-slate-300">Insurance Claimed?</span>
             </div>
             <Input label="Description" placeholder="What happened?" value={data.description} onChange={(e:any) => setData({...data, description: e.target.value})} />
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

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-sm p-6 text-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Smart Bill Scanner</h3>
        
        {step === 1 && (
          <div className="py-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all" onClick={simulateScan}>
            <Camera className="mx-auto text-slate-500 mb-2" size={32} />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Tap to Upload Bill</p>
          </div>
        )}

        {step === 2 && (
          <div className="py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-500 dark:text-purple-400 text-sm animate-pulse">Extracting Line Items...</p>
          </div>
        )}

        {step === 3 && scanned && (
          <div className="text-left space-y-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex gap-2 items-center">
              <CheckCircle size={16} className="text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">Scan Complete</span>
            </div>
            <div className="space-y-1 bg-gray-50 dark:bg-slate-950 p-3 rounded border border-gray-200 dark:border-slate-800">
              <div className="flex justify-between text-xs text-slate-500 uppercase font-bold border-b border-gray-200 dark:border-slate-800 pb-1 mb-1">
                <span>Item</span><span>Cost</span>
              </div>
              {scanned.items.map((i:any, idx:number) => (
                <div key={idx} className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                  <span>{i.item}</span><span>₹{i.cost}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white border-t border-gray-200 dark:border-slate-800 pt-2 mt-2">
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
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500"><X size={20}/></button>
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
        <h3 className="font-bold text-white text-lg mb-1 flex items-center gap-2"><AlertOctagon className="text-red-500" size={20}/> Report Issue</h3>
        <p className="text-slate-400 text-sm mb-4">Logging defect for: <span className="text-white font-bold">{taskName}</span></p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-2">Severity</label>
            <div className="flex gap-2">
              {['low', 'medium', 'critical'].map(s => (
                <button key={s} onClick={() => setData({...data, severity: s})} className={cn("flex-1 py-2 rounded text-xs font-bold capitalize border", data.severity === s ? (s === 'critical' ? 'bg-red-500 border-red-500 text-white' : 'bg-yellow-500 border-yellow-500 text-black') : 'bg-slate-950 border-slate-800 text-slate-400')}>{s}</button>
              ))}
            </div>
          </div>
          <Input label="Est. Cost (Optional)" type="number" placeholder="₹" value={data.cost} onChange={(e:any) => setData({...data, cost: e.target.value})} />
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Description</label>
            <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white h-20 focus:outline-none focus:border-red-500" placeholder="Describe the problem..." value={data.description} onChange={(e) => setData({...data, description: e.target.value})} />
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
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md p-6 relative">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-amber-500"/> Sell Car</h2>
             
             {step === 1 ? (
                 <div className="space-y-3">
                     <p className="text-sm text-slate-300 mb-2">How soon do you want to sell?</p>
                     {['Immediately (Urgent)', 'In a few weeks', 'In a month', 'Just Checking Price'].map((opt, i) => (
                         <button key={i} onClick={() => {
                             if(opt.includes("Checking")) { alert("Estimated Market Value: ₹12.5L - ₹13.2L"); onClose(); }
                             else setStep(2);
                         }} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-sm text-white hover:border-amber-500 transition-all flex justify-between group">
                             {opt} <ChevronRight className="text-slate-500 group-hover:text-amber-500"/>
                         </button>
                     ))}
                 </div>
             ) : (
                 <div className="text-center space-y-4 animate-in slide-in-from-right-10 fade-in">
                     <div className="bg-amber-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-amber-500 mb-2"><Users size={32}/></div>
                     <h3 className="text-white font-bold">List in Community?</h3>
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
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upload Document</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="mb-3">
                        <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Type</label>
                        <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 text-sm" value={data.type} onChange={(e:any) => setData({...data, type: e.target.value})}>
                            <option value="Insurance">Insurance</option>
                            <option value="PUC">PUC (Emission)</option>
                            <option value="RC">RC (Registration)</option>
                            <option value="FastTag">FASTag</option>
                        </select>
                    </div>
                    <Input label="Expiry Date" type="date" value={data.expiryDate} onChange={(e:any) => setData({...data, expiryDate: e.target.value})} />
                    <Input label="Provider / Issuer" placeholder="e.g. Acko" value={data.provider} onChange={(e:any) => setData({...data, provider: e.target.value})} />
                    <Input label="Policy/Doc Number" value={data.number} onChange={(e:any) => setData({...data, number: e.target.value})} />
                </div>
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button onClick={() => onSave(data)} className="flex-1">Save Doc</Button>
                </div>
            </Card>
        </div>
    );
};

// --- Service Booking Page ---

const ServiceBookingView = ({ bookings, onBook }: any) => {
    const [isBooking, setIsBooking] = useState(false);
    const [formData, setFormData] = useState({ center: '', date: '', serviceType: 'General Service', notes: '' });

    if(isBooking) {
        return (
            <div className="animate-in fade-in space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setIsBooking(false)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20}/></button>
                    <div><h2 className="text-xl font-bold text-white">Book New Service</h2><p className="text-xs text-slate-500">Schedule maintenance</p></div>
                </div>
                <Card className="p-6 max-w-lg mx-auto">
                    <div className="space-y-4">
                        <Input label="Service Center / Garage" placeholder="e.g. GoMechanic, Official Center" value={formData.center} onChange={(e:any) => setFormData({...formData, center: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Preferred Date" type="date" value={formData.date} onChange={(e:any) => setFormData({...formData, date: e.target.value})} />
                            <div className="mb-3">
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Service Type</label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={formData.serviceType} onChange={(e:any) => setFormData({...formData, serviceType: e.target.value})}>
                                    <option>General Service</option><option>Oil Change</option><option>Car Wash</option><option>Repair/Issue</option><option>Tyre Change</option>
                                </select>
                            </div>
                        </div>
                        <Input label="Notes / Issues" placeholder="Describe any problems..." value={formData.notes} onChange={(e:any) => setFormData({...formData, notes: e.target.value})} />
                        <Button className="w-full mt-4" onClick={() => { onBook({...formData, status: 'Confirmed', id: generateId()}); setIsBooking(false); }}>Confirm Booking</Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-white">Service Bookings</h2><p className="text-slate-400 text-sm">Manage appointments</p></div>
                <Button onClick={() => setIsBooking(true)}><Plus size={16}/> New Booking</Button>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 && <div className="text-center p-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">No upcoming bookings.</div>}
                {bookings.map((b:any) => (
                    <Card key={b.id} className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg">{b.center}</h3>
                                <p className="text-sm text-slate-400">{b.serviceType}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {b.date}</span>
                                    {b.notes && <span className="bg-slate-950 px-2 py-0.5 rounded text-slate-400">{b.notes}</span>}
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold rounded uppercase">{b.status}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// Helper ShieldCheck for Payment Success
const ShieldCheck = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

// --- Main App Component ---

export default function AutologApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
      const saved = localStorage.getItem('autolog-theme');
      if (saved) return saved as 'dark' | 'light';
      return 'dark'; 
  });
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
  const [modals, setModals] = useState({ trip: false, expense: false, scan: false, pro: false, doc: false, accident: false, resell: false, addVehicle: false });
  const [issueTarget, setIssueTarget] = useState<{id: string, name: string} | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Apply Theme
  useEffect(() => {
    localStorage.setItem('autolog-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

    setTrips([
      { id: 't1', vehicleId: v1, date: '2023-12-01', startOdometer: 45000, endOdometer: 45150, distance: 150, type: 'Highway', notes: 'Weekend Trip' },
      { id: 't2', vehicleId: v2, date: '2023-12-05', startOdometer: 12000, endOdometer: 12030, distance: 30, type: 'City', notes: 'Office' }
    ]);

    setExpenses([
      { id: 'e1', vehicleId: v1, date: '2023-12-02', category: 'Fuel', amount: 2500, vendor: 'Shell', notes: 'Full Tank' },
      { id: 'e2', vehicleId: v1, date: '2023-11-15', category: 'Service & Maintenance', amount: 5400, vendor: 'Toyota Service', notes: 'Annual Service', isVerified: true, odometer: 42000, lineItems: [{item: 'Oil', cost: 2000}, {item: 'Filter', cost: 400}, {item: 'Labor', cost: 3000}] },
      { id: 'e3', vehicleId: v2, date: '2023-12-10', category: 'Fuel', amount: 1500, vendor: 'HP', notes: 'Refuel' }
    ]);

    setDocs([
        { id: 'doc1', vehicleId: v1, type: 'Insurance', provider: 'HDFC Ergo', number: 'POL-998877', expiryDate: '2023-12-30' },
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
            .sort((a,b) => (b.odometer || 0) - (a.odometer || 0)); // Sort descending by odometer if avail, or date
          
          // Use expense odometer if available, else estimate based on date relative to trips (simplified: use currentOdo if recent)
          if(relevant.length > 0) return relevant[0].odometer || (lastOdometer - 1000); // Mock fallback
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

  // --- Views ---

  const renderMobileMenu = () => (
      <div className="animate-in slide-in-from-bottom-10 fade-in pb-24">
          <div className="bg-gradient-to-r from-blue-900/20 to-slate-900 p-6 rounded-b-3xl mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Menu</h2>
              <p className="text-slate-400 text-sm">Access all features</p>
          </div>
          
          <div className="px-4 space-y-6">
              <div>
                  <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Manage</p>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setActiveTab('book_service')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-blue-500 transition-colors shadow-sm">
                          <CalendarCheck className="text-blue-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Book Service</span>
                      </button>
                      <button onClick={() => setActiveTab('docs')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-purple-500 transition-colors shadow-sm">
                          <Shield className="text-purple-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Documents</span>
                      </button>
                      <button onClick={() => setActiveTab('resell')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-amber-500 transition-colors shadow-sm">
                          <TrendingUp className="text-amber-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Resale</span>
                      </button>
                  </div>
              </div>

              <div>
                  <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Track & Maintain</p>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setActiveTab('history')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-emerald-500 transition-colors shadow-sm">
                          <History className="text-emerald-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">History</span>
                      </button>
                      <button onClick={() => setActiveTab('maintenance')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-orange-500 transition-colors shadow-sm">
                          <Wrench className="text-orange-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Maintenance</span>
                      </button>
                  </div>
              </div>

              <div>
                  <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Connect</p>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setActiveTab('community')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-indigo-500 transition-colors shadow-sm">
                          <MessageSquare className="text-indigo-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Community</span>
                      </button>
                      <button onClick={() => setActiveTab('shop')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-pink-500 transition-colors shadow-sm">
                          <ShoppingBag className="text-pink-500" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Shop</span>
                      </button>
                  </div>
              </div>

              <div>
                   <p className="text-xs font-bold text-slate-600 uppercase px-2 mb-2">Safety</p>
                   <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => setActiveTab('accidents')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-red-500 transition-colors shadow-sm">
                           <FileWarning className="text-red-500" />
                           <span className="text-sm font-bold text-slate-900 dark:text-white">Accidents</span>
                       </button>
                       <button onClick={() => setActiveTab('warnings')} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-yellow-500 transition-colors shadow-sm">
                           <AlertTriangle className="text-yellow-500" />
                           <span className="text-sm font-bold text-slate-900 dark:text-white">Warnings</span>
                       </button>
                   </div>
              </div>
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Overview for</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-400/10 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-400/20 flex items-center gap-1">
                            {currentVehicle?.logo ? <img src={currentVehicle.logo} className="w-3 h-3 object-contain" /> : (currentVehicle?.type === 'Bike' ? <Bike size={12} /> : <Car size={12} />)}
                            {currentVehicle?.regNumber}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!user && <span className="text-xs bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/30 flex items-center">Guest Mode</span>}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer group transition-all" onClick={() => setModals({ ...modals, trip: true })}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 dark:bg-blue-600/20 p-2 rounded-lg text-blue-600 dark:text-blue-500"><Car size={18} /></div>
                            <div><h3 className="font-bold text-slate-900 dark:text-white">Log Trip</h3><p className="text-xs text-slate-500 dark:text-slate-400">Track journey</p></div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md cursor-pointer group transition-all" onClick={() => setModals({ ...modals, expense: true })}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-50 dark:bg-emerald-600/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-500"><DollarSign size={18} /></div>
                            <div><h3 className="font-bold text-slate-900 dark:text-white">Log Expense</h3><p className="text-xs text-slate-500 dark:text-slate-400">Add fuel/cost</p></div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Odometer" value={`${lastOdometer} km`} icon={<Gauge size={18} />} color="blue" />
                <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign size={18} />} color="emerald" />
                <StatCard label="Docs Active" value={`${currentDocs.length}`} icon={<Shield size={18} />} color="purple" />
                <StatCard label="Family" value={family.length + 1} icon={<Users size={18} />} color="slate" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Service & Activities */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. Service Due Reminder (Top & Full Width) */}
                    {servicePrediction && (
                        <div className={cn("bg-gradient-to-r border rounded-xl p-5 shadow-sm relative overflow-hidden", 
                            servicePrediction.isOverdue ? "from-red-50 to-white dark:from-red-900/20 dark:to-slate-900 border-red-200 dark:border-red-500/30" : "from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 border-indigo-200 dark:border-indigo-500/30"
                        )}>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Wrench size={16} className={servicePrediction.isOverdue ? "text-red-500" : "text-indigo-500"}/>
                                        <p className={cn("text-xs font-bold uppercase", servicePrediction.isOverdue ? "text-red-600 dark:text-red-400" : "text-indigo-600 dark:text-indigo-300")}>
                                            {servicePrediction.isOverdue ? "Overdue" : "Next Service"}
                                        </p>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                        {servicePrediction.isOverdue ? "Immediate Action Required" : "Scheduled Maintenance"}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Due at {servicePrediction.nextOdo} km or {servicePrediction.nextDate}</p>
                                </div>
                                <Button variant="pro" onClick={() => setActiveTab('book_service')}>Book Now</Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
                                <div className="bg-white/60 dark:bg-slate-950/50 p-3 rounded-lg backdrop-blur-sm border border-gray-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500">Days Remaining</p>
                                    <p className={cn("text-xl font-bold", servicePrediction.daysRemaining < 0 ? "text-red-500" : "text-slate-900 dark:text-white")}>{Math.abs(servicePrediction.daysRemaining)}</p>
                                </div>
                                <div className="bg-white/60 dark:bg-slate-950/50 p-3 rounded-lg backdrop-blur-sm border border-gray-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500">Km Remaining</p>
                                    <p className={cn("text-xl font-bold", servicePrediction.distRemaining < 0 ? "text-red-500" : "text-slate-900 dark:text-white")}>{Math.abs(servicePrediction.distRemaining)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Parts Health Widget (New) */}
                    <Card className="p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Activity size={18} className="text-blue-500"/> Parts Health</h3>
                        <div className="flex justify-around items-center">
                            <CircularProgress percent={partsHealth.oil.percent} color={partsHealth.oil.percent > 90 ? "text-red-500" : "text-amber-500"} icon={Droplet} label="Engine Oil" />
                            <CircularProgress percent={partsHealth.brake.percent} color={partsHealth.brake.percent > 90 ? "text-red-500" : "text-slate-500"} icon={Disc} label="Brake Pads" />
                            <CircularProgress percent={partsHealth.tyre.percent} color={partsHealth.tyre.percent > 90 ? "text-red-500" : "text-blue-500"} icon={CircleDashed} label="Tyres" />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-xs text-slate-400">Based on last logged service mileage.</p>
                        </div>
                    </Card>

                    {/* 3. Recent Activity */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><History size={18} className="text-slate-400" /> Recent Activity</h3>
                            <button onClick={() => setActiveTab('logs')} className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400">View All</button>
                        </div>
                        <div className="space-y-3">
                            {recentActivities.map((item: any) => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-3 rounded-xl flex items-center gap-4 hover:border-blue-200 dark:hover:border-slate-700 transition-colors shadow-sm">
                                    <div className={cn("p-2 rounded-lg shrink-0", 
                                        item.type === 'trip' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500" : 
                                        item.type === 'expense' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" :
                                        item.type === 'accident' ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500" : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500"
                                    )}>
                                        {item.type === 'trip' ? <Car size={18} /> : 
                                         item.type === 'expense' ? <DollarSign size={18} /> : 
                                         item.type === 'accident' ? <AlertOctagon size={18} /> : <CalendarCheck size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.vendor || item.center || item.location || (item.type === 'trip' ? `${item.distance} km Trip` : 'Activity')}</h4>
                                            <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {item.notes || item.description || item.serviceType || item.category || item.type}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Health, Checklist, Insurance */}
                <div className="space-y-4">
                    {/* Overall Health */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                         <div className={cn("p-2 rounded-full", healthScore > 80 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500")}>
                             <Activity size={16}/>
                         </div>
                         <div>
                             <p className="text-[10px] text-slate-500 uppercase font-bold">Overall Health</p>
                             <div className="h-2 w-32 bg-gray-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                 <div className={cn("h-full", healthScore > 80 ? "bg-emerald-500" : "bg-yellow-500")} style={{width: `${healthScore}%`}}></div>
                             </div>
                         </div>
                         <span className="ml-auto font-bold text-slate-900 dark:text-white text-sm">{healthScore}%</span>
                    </div>

                    {/* Checklist */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><ClipboardCheck size={18} className="text-slate-400" /> Checklist</h3>
                            <button onClick={() => setActiveTab('maintenance')} className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400">Manage</button>
                        </div>
                        <Card className="p-4 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                            {dueTasks.length === 0 ? (
                                <div className="text-center py-6">
                                    <div className="bg-emerald-100 dark:bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600 dark:text-emerald-500">
                                        <CheckCircle size={24} />
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-bold text-sm">All Systems Go!</p>
                                    <p className="text-xs text-slate-500">No pending tasks today.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Attention Needed</p>
                                    {dueTasks.map((t: any) => (
                                        <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-sm">
                                            <div className={cn("w-2 h-2 rounded-full", t.status === 'issue' ? "bg-red-500 animate-pulse" : "bg-yellow-500")}></div>
                                            <div className="flex-1">
                                                <p className={cn("text-xs font-bold", t.status === 'issue' ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300")}>{t.label}</p>
                                                <p className="text-[10px] text-slate-500">{t.frequency} • {t.category}</p>
                                            </div>
                                            <button 
                                                onClick={() => setTasks(tasks.map(task => task.id === t.id ? { ...task, status: 'ok', lastChecked: new Date().toISOString().split('T')[0] } : task))}
                                                className="text-slate-400 hover:text-emerald-500 transition-colors"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Insurance */}
                    <div className={cn("bg-white dark:bg-slate-900 border rounded-xl p-3 flex items-center gap-3 shadow-sm", insuranceStatus === 'Valid' ? "border-gray-200 dark:border-slate-800" : "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/5")}>
                         <div className={cn("p-2 rounded-full", 
                             insuranceStatus === 'Valid' ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500" : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500"
                         )}>
                             <Shield size={16}/>
                         </div>
                         <div className="flex-1">
                             <p className="text-[10px] text-slate-500 uppercase font-bold">Insurance Status</p>
                             <p className={cn("text-sm font-bold", insuranceStatus === 'Valid' ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400")}>
                                {insuranceStatus} 
                                {insuranceDaysLeft > 0 && insuranceDaysLeft < 60 && ` (${insuranceDaysLeft} days left)`}
                             </p>
                         </div>
                         <button onClick={() => setActiveTab('docs')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderCommunity = () => (
      <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
          <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-xl p-6">
              <div className="flex justify-between items-start">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Community</h2>
                      <p className="text-slate-400 text-sm">Connect with other car owners.</p>
                  </div>
                  <Button onClick={() => setDiscussionListings([{id: generateId(), title: "New Topic", author: "You", type: "Discuss", replies: 0}, ...discussionListings])}><Plus size={16}/> New Topic</Button>
              </div>
              
              <div className="flex gap-2 mt-4">
                  <button onClick={() => setCommunityTab('discuss')} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", communityTab === 'discuss' ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}>Discussions</button>
                  <button onClick={() => setCommunityTab('market')} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", communityTab === 'market' ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}>Marketplace</button>
              </div>
          </div>

          <div className="space-y-3">
              {(communityTab === 'discuss' ? discussionListings : marketListings).map((topic, i) => (
                  <Card key={i} className="p-4 hover:bg-slate-800/50 transition-all cursor-pointer group" onClick={() => setActiveTopic(topic)}>
                      <div className="flex justify-between items-start">
                          <div>
                              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-1 inline-block", topic.type === 'Market' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400")}>{topic.type}</span>
                              <h3 className="font-bold text-slate-900 dark:text-white text-md group-hover:text-blue-400 transition-colors">{topic.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Posted by {topic.author}</p>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-xs bg-gray-100 dark:bg-slate-950 px-2 py-1 rounded">
                              <MessageCircle size={14}/> {topic.replies}
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
              <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Accessories Shop</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Curated gadgets for your {currentVehicle?.model}</p></div>
              <ShoppingBag className="text-purple-500"/>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ACCESSORIES_DATA.map(item => (
                  <Card key={item.id} className="p-0 overflow-hidden group hover:border-purple-500/50 transition-all">
                      <div className="aspect-square bg-white p-4 flex items-center justify-center relative">
                          <img src={item.image} alt={item.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"/>
                          <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity">{item.category}</div>
                      </div>
                      <div className="p-3">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">{item.name}</h3>
                          <div className="flex justify-between items-center">
                              <span className="text-emerald-500 dark:text-emerald-400 font-bold">₹{item.price.toLocaleString()}</span>
                              <button onClick={() => alert("Redirecting to Amazon...")} className="bg-gray-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-600 dark:text-slate-300 p-1.5 rounded-lg transition-colors"><ExternalLink size={14}/></button>
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
               <TrendingUp size={48} className="mx-auto text-amber-500 mb-2"/>
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
                   <Button variant="gold" onClick={() => setModals({...modals, resell: true})}>Sell Car</Button>
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
                    <Button onClick={() => alert("Link Copied to Clipboard!")} variant="secondary" className="flex-1 md:flex-initial"><Share2 size={16}/> Share Link</Button>
                    <Button onClick={() => alert("Generating PDF...")} className="flex-1 md:flex-initial"><Printer size={16}/> Generate PDF</Button>
                </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="p-4">
                   <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><ClipboardList size={16} className="text-blue-500"/> Transfer Checklist</h3>
                   <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800"></div> Clear Insurance Dues</div>
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800"></div> Get NOC from Bank</div>
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800"></div> Original RC Smart Card</div>
                   </div>
               </Card>
               <Card className="p-4">
                   <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><History size={16} className="text-purple-500"/> Ownership History</h3>
                   <div className="text-sm">
                       <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-800">
                           <span className="text-slate-900 dark:text-white">Current Owner</span>
                           <span className="text-slate-500 dark:text-slate-400">Since Jan 2022</span>
                       </div>
                       <div className="flex justify-between py-2">
                           <span className="text-slate-500 dark:text-slate-500">1st Owner</span>
                           <span className="text-slate-600 dark:text-slate-600">2018 - 2022</span>
                       </div>
                   </div>
               </Card>
          </div>
      </div>
  );

  const renderServiceHistory = () => (
      <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
              <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Timeline</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Maintenance & Repairs</p></div>
              <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setModals({...modals, expense: true})}><Plus size={16}/> Manual</Button>
                  <Button onClick={() => setModals({...modals, scan: true})}><Camera size={16}/> Smart Scan</Button>
              </div>
           </div>
           <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-gray-200 dark:before:bg-slate-800">
               {currentExpenses.filter(e => e.category === 'Service & Maintenance' || e.category === 'Repairs').length === 0 && <p className="text-slate-500 dark:text-slate-500 italic pl-4">No service records found.</p>}
               {currentExpenses.filter(e => e.category === 'Service & Maintenance' || e.category === 'Repairs').map(e => (
                   <div key={e.id} className="relative pl-6">
                       <div className={cn("absolute -left-[23px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-950 z-10", e.category === 'Repairs' ? 'border-orange-500 text-orange-500' : 'border-blue-500 text-blue-500')}><Wrench size={12}/></div>
                       <Card className="p-4 hover:border-blue-500/50 transition-colors">
                           <div className="flex justify-between items-start">
                               <div><p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase mb-1">{e.date}</p><h3 className="font-bold text-slate-900 dark:text-white">{e.vendor}</h3></div>
                               <span className="block font-bold text-emerald-600 dark:text-emerald-400 text-lg">₹{e.amount}</span>
                           </div>
                           {e.lineItems && (
                               <div className="mt-3 bg-gray-50 dark:bg-slate-950 p-2 rounded border border-gray-200 dark:border-slate-800">
                                    {e.lineItems.map((li:any, idx:number) => (
                                        <div key={idx} className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
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
              <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Accident Log</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Damage history & insurance claims</p></div>
              <Button variant="danger" onClick={() => setModals({...modals, accident: true})}><AlertOctagon size={16}/> Log Accident</Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
              {currentAccidents.length === 0 && <p className="text-slate-500 dark:text-slate-500 italic p-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl text-center">No accidents recorded.</p>}
              {currentAccidents.map(acc => (
                  <Card key={acc.id} className="p-4 border-l-4 border-l-red-500">
                      <div className="flex justify-between items-start">
                          <div><h3 className="font-bold text-slate-900 dark:text-white text-lg">{acc.location}</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{acc.description}</p></div>
                          <p className="text-red-500 dark:text-red-400 font-bold text-lg">₹{acc.cost}</p>
                      </div>
                  </Card>
              ))}
          </div>
      </div>
  );

  const renderDocuments = () => (
      <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
          <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h2></div><Button onClick={() => setModals({...modals, doc: true})}><Upload size={16}/> Upload</Button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDocs.map(doc => (
                  <Card key={doc.id} className="p-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                      <div className="pl-2">
                          <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-bold">{doc.type}</p>
                          <h3 className="text-slate-900 dark:text-white font-bold text-lg">{doc.provider}</h3>
                          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{doc.number}</p>
                      </div>
                  </Card>
              ))}
          </div>
      </div>
  );

  const renderRSA = () => (
      <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
          <div className="bg-red-600 rounded-xl p-6 text-center shadow-lg shadow-red-900/50">
              <ShieldAlert size={48} className="mx-auto text-white/90 mb-2"/>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Emergency Mode</h2>
              <p className="text-red-100 text-sm mb-6">One-tap assistance for {currentVehicle?.regNumber}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">{RSA_SERVICES.map(svc => (<Card key={svc.id} className="p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-gray-200 dark:border-slate-800"><div className="text-slate-500 dark:text-slate-400">{svc.icon}</div><span className="font-bold text-slate-900 dark:text-slate-200 text-sm">{svc.name}</span></Card>))}</div>
      </div>
  );

  // Theme Toggle Button in Sidebar/Mobile Header
  const ThemeToggle = () => (
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        title="Toggle Theme"
      >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
  );

  return (
    <div className={cn("min-h-screen font-sans selection:bg-blue-500/30 flex flex-col md:flex-row transition-colors duration-300", theme === 'dark' ? "bg-slate-950 text-slate-200" : "bg-gray-50 text-slate-900")}>
      
      {/* Auth & Onboarding Modals */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLogin={(u:any) => { setUser(u); setShowAuth(false); }} 
        onOpenOnboarding={() => { setShowAuth(false); setShowOnboarding(true); }}
      />
      
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        onComplete={handleOnboardingComplete} 
      />

      {/* ... (rest of the modals: AddTripModal, AddExpenseModal, etc.) ... */}
      <AddTripModal isOpen={modals.trip} onClose={() => setModals({...modals, trip: false})} onSave={(d:any) => {
        const trip = { id: generateId(), vehicleId: currentVehicleId, ...d, distance: d.endOdometer - d.startOdometer };
        setTrips([trip, ...trips]); setModals({...modals, trip: false});
      }} lastOdometer={lastOdometer} />
      {/* ... other modals ... */}
      <AddExpenseModal isOpen={modals.expense} onClose={() => setModals({...modals, expense: false})} onSave={(d:any) => {
        setExpenses([{id: generateId(), vehicleId: currentVehicleId, ...d}, ...expenses]); setModals({...modals, expense: false});
      }} />
      <SmartScanModal isOpen={modals.scan} onClose={() => setModals({...modals, scan: false})} onSave={(d:any) => {
        setExpenses([{id: generateId(), vehicleId: currentVehicleId, ...d}, ...expenses]); 
      }} />
      <AddDocumentModal isOpen={modals.doc} onClose={() => setModals({...modals, doc: false})} onSave={(d:any) => {
          setDocs([...docs, {id: generateId(), vehicleId: currentVehicleId, ...d}]); setModals({...modals, doc: false});
      }} />
      <AddAccidentModal isOpen={modals.accident} onClose={() => setModals({...modals, accident: false})} onSave={(d:any) => {
          setAccidents([...accidents, {id: generateId(), vehicleId: currentVehicleId, ...d, status: 'Pending', photos: 1}]); setModals({...modals, accident: false});
      }} />
      <ResellFormModal isOpen={modals.resell} onClose={() => setModals({...modals, resell: false})} onPostToCommunity={() => {
          setMarketListings([{id: generateId(), title: `For Sale: ${currentVehicle.make} ${currentVehicle.model}`, author: user?.name || 'Owner', replies: 0, type: 'Market', desc: 'Listing posted via Autolog App.'}, ...marketListings]);
          setModals({...modals, resell: false});
          setActiveTab('community');
          setCommunityTab('market');
      }} />
      <AddVehicleModal isOpen={modals.addVehicle} onClose={() => setModals({...modals, addVehicle: false})} onSave={(newVehicle: any) => {
          const v = { id: generateId(), ...newVehicle, role: 'Owner' };
          setVehicles([...vehicles, v]);
          setCurrentVehicleId(v.id);
          setModals({...modals, addVehicle: false});
      }} />
      <IssueReportModal isOpen={!!issueTarget} taskName={issueTarget ? MAINTENANCE_TASKS.find(t => t.id === issueTarget.id)?.label : ''} onClose={() => setIssueTarget(null)} onSave={(d:any) => {
        if(issueTarget) {
           setTasks(tasks.map(t => t.id === issueTarget.id ? { ...t, status: 'issue', severity: d.severity, issueDetails: d.description, estimatedCost: d.cost, lastChecked: new Date().toISOString().split('T')[0] } : t));
           setIssueTarget(null);
        }
      }} />

      {/* --- Sidebar (Desktop) --- */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
           <div className="flex justify-between items-center mb-4">
               <h1 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2"><Car className="text-blue-500"/> AUTOLOG <span className="text-[10px] bg-purple-500 px-1 rounded text-white">PRO</span></h1>
               <ThemeToggle />
           </div>
           
           {/* Multi-Vehicle Switcher */}
           <div className="relative group">
               <button className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 hover:border-blue-500 rounded-lg p-3 flex items-center justify-between transition-all">
                   <div className="text-left flex items-center gap-3">
                       {currentVehicle?.logo ? (
                           <img src={currentVehicle.logo} alt="brand" className="w-8 h-8 object-contain" />
                       ) : (
                           <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">{currentVehicle?.make?.[0] || 'C'}</div>
                       )}
                       <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Current Vehicle</p>
                           <p className="text-sm font-bold text-slate-900 dark:text-white truncate w-24">{currentVehicle?.make} {currentVehicle?.model}</p>
                       </div>
                   </div>
                   <ChevronDown size={16} className="text-slate-500"/>
               </button>
               {/* ... (vehicle dropdown code) ... */}
               <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-xl hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                   {vehicles.map(v => (
                       <div key={v.id} onClick={() => setCurrentVehicleId(v.id)} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-gray-100 dark:border-slate-800/50 last:border-0">
                           <div className="flex items-center gap-2">
                               {v.logo ? <img src={v.logo} className="w-5 h-5 object-contain"/> : <Car size={16} className="text-slate-500"/>}
                               <span className={cn("text-sm", v.id === currentVehicleId ? "text-blue-500 dark:text-blue-400 font-bold" : "text-slate-700 dark:text-slate-300")}>{v.make} {v.model}</span>
                           </div>
                           {v.id === currentVehicleId && <Check size={14} className="text-blue-500"/>}
                       </div>
                   ))}
                   <div className="p-2 border-t border-gray-200 dark:border-slate-800">
                       <button onClick={() => setModals({...modals, addVehicle: true})} className="w-full text-xs text-center text-blue-500 dark:text-blue-400 py-1 font-bold hover:text-blue-600 dark:hover:text-blue-300 flex items-center justify-center gap-1">+ Add Vehicle</button>
                   </div>
               </div>
           </div>
        </div>

        {/* ... (Nav buttons) ... */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
           <p className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase px-4 mb-2 mt-2">Manage</p>
           <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
           <NavButton id="book_service" icon={CalendarCheck} label="Book Service" active={activeTab} set={setActiveTab} />
           <NavButton id="docs" icon={Shield} label="Documents" active={activeTab} set={setActiveTab} />
           <NavButton id="resell" icon={TrendingUp} label="Resale Center" active={activeTab} set={setActiveTab} />
           
           <p className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase px-4 mb-2 mt-6">Track</p>
           <NavButton id="history" icon={History} label="Service History" active={activeTab} set={setActiveTab} />
           <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
           <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
           <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
           
           <p className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase px-4 mb-2 mt-6">Connect</p>
           <NavButton id="community" icon={MessageSquare} label="Community" active={activeTab} set={setActiveTab} />
           <NavButton id="shop" icon={ShoppingBag} label="Accessories" active={activeTab} set={setActiveTab} />

           <p className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase px-4 mb-2 mt-6">Safety</p>
           <NavButton id="accidents" icon={FileWarning} label="Accident Log" active={activeTab} set={setActiveTab} />
           <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
           <NavButton id="rsa" icon={PhoneCall} label="Emergency / RSA" active={activeTab} set={setActiveTab} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
            {user ? (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                            {user.isPro && <Crown size={12} className="text-amber-500 fill-amber-500"/>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.isPro ? 'Pro Member' : 'Guest'}</p>
                    </div>
                    <button onClick={() => setUser(null)} className="text-slate-500 hover:text-red-500 dark:hover:text-red-400"><LogOut size={16}/></button>
                </div>
            ) : (
                <button onClick={() => setShowAuth(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all">
                    <LogIn size={16}/> Sign In
                </button>
            )}
        </div>
      </aside>

      {/* --- Mobile Top Bar --- */}
      <div className="md:hidden sticky top-0 left-0 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 z-30 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
               <Car className="text-blue-500" size={20}/>
               <h1 className="font-bold text-slate-900 dark:text-white text-lg">AUTOLOG</h1>
          </div>
          <div className="flex items-center gap-4">
               <ThemeToggle />
               {user ? (
                   <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer" onClick={() => { if(confirm("Logout?")) setUser(null); }}>{user.name[0]}</div>
               ) : (
                   <button onClick={() => setShowAuth(true)} className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                       <UserPlus size={18}/>
                   </button>
               )}
               <button onClick={() => setActiveTab('menu')} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                   <Menu size={24}/>
               </button>
          </div>
      </div>

      {/* --- Main Content --- */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 min-h-screen">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'menu' && renderMobileMenu()}
         {activeTab === 'book_service' && <ServiceBookingView bookings={bookings} onBook={(b:any) => setBookings([b, ...bookings])}/>}
         {activeTab === 'community' && renderCommunity()}
         {activeTab === 'shop' && renderShop()}
         {activeTab === 'history' && renderServiceHistory()}
         {activeTab === 'accidents' && renderAccidents()}
         {activeTab === 'resell' && renderResale()}
         {activeTab === 'rsa' && renderRSA()}
         {activeTab === 'docs' && renderDocuments()}

         {activeTab === 'logs' && (
           <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Logs</h2>
                 <div className="flex gap-2">
                     <Button variant="secondary" onClick={() => downloadCSV(currentTrips, 'trip_logs')} className="px-3"><Download size={16}/> <span className="hidden md:inline">Export</span></Button>
                     <Button onClick={() => setModals({...modals, trip: true})} className="px-3"><Plus size={16}/> <span className="hidden md:inline">Log Trip</span></Button>
                 </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-800">
               <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                 <thead className="bg-gray-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                   <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Odometer</th><th className="px-4 py-3 text-right">Distance</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
                   {currentTrips.map(t => (
                     <tr key={t.id}><td className="px-4 py-3">{t.date}</td><td className="px-4 py-3">{t.type}</td><td className="px-4 py-3 font-mono">{t.startOdometer}-{t.endOdometer}</td><td className="px-4 py-3 text-right text-slate-900 dark:text-white font-bold">{t.distance} km</td></tr>
                   ))}
                 </tbody>
               </table>
              </div>
           </div>
         )}

         {activeTab === 'expenses' && (
           <div className="animate-in fade-in space-y-4 pb-20 md:pb-0">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses</h2>
                 <div className="flex gap-2">
                     <Button variant="secondary" onClick={() => downloadCSV(currentExpenses, 'expenses')} className="px-3"><Download size={16}/> <span className="hidden md:inline">Export</span></Button>
                     <Button onClick={() => setModals({...modals, scan: true})} className="px-3"><Camera size={16}/> <span className="hidden md:inline">Scan</span></Button>
                     <Button onClick={() => setModals({...modals, expense: true})} className="px-3"><Plus size={16}/> <span className="hidden md:inline">Add</span></Button>
                 </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-800">
               <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                 <thead className="bg-gray-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                   <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3 text-right">Amount</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
                   {currentExpenses.map(e => (
                     <tr key={e.id}><td className="px-4 py-3">{e.date}</td><td className="px-4 py-3">{e.category}</td><td className="px-4 py-3">{e.vendor}</td><td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">₹{e.amount}</td></tr>
                   ))}
                 </tbody>
               </table>
              </div>
           </div>
         )}
         
         {activeTab === 'warnings' && (
            <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Warning Lights</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Quick reference guide for dashboard symbols.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {WARNING_LIGHTS_DATA.map(light => <WarningLightCard key={light.id} light={light} />)}
                </div>
            </div>
        )}

         {activeTab === 'maintenance' && (
           <div className="animate-in fade-in space-y-6 pb-20 md:pb-0">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance Checklist</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {['Daily', 'Monthly', 'Yearly'].map(freq => (
                   <Card key={freq} className="p-0 border-t-4 border-t-blue-500 h-fit">
                      <div className="p-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                         <h3 className="font-bold text-slate-900 dark:text-white">{freq} Checks</h3>
                         <span className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-0">{tasks.filter(t => MAINTENANCE_TASKS.find(def => def.id === t.id)?.frequency === freq && t.status === 'ok').length} / {MAINTENANCE_TASKS.filter(def => def.frequency === freq).length}</span>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-slate-800/50">
                         {MAINTENANCE_TASKS.filter(def => def.frequency === freq).map(def => {
                            const state = tasks.find(t => t.id === def.id);
                            return (
                              <div key={def.id} className={cn("p-3 flex items-center justify-between", state?.status === 'issue' ? 'bg-red-50 dark:bg-red-500/5' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50')}>
                                 <div>
                                    <p className={cn("text-sm", state?.status === 'ok' ? 'text-slate-400 line-through' : state?.status === 'issue' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-300')}>{def.label}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">{def.category}</p>
                                    {state?.status === 'issue' && <p className="text-xs text-red-500 dark:text-red-400 mt-1">Issue: {state.issueDetails}</p>}
                                 </div>
                                 <div className="flex gap-2">
                                    <button title="Mark OK" onClick={() => setTasks(tasks.map(t => t.id === def.id ? {...t, status: t.status === 'ok' ? 'pending' : 'ok', lastChecked: new Date().toISOString().split('T')[0]} : t))} className={cn("p-1 rounded border", state?.status === 'ok' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-gray-300 dark:border-slate-700 text-slate-400')}><CheckCircle size={16}/></button>
                                    <button title="Report Issue" onClick={() => setIssueTarget({id: def.id, name: def.label})} className={cn("p-1 rounded border", state?.status === 'issue' ? 'bg-red-600 border-red-500 text-white' : 'border-gray-300 dark:border-slate-700 text-slate-400')}><AlertOctagon size={16}/></button>
                                 </div>
                              </div>
                            )
                         })}
                      </div>
                   </Card>
                 ))}
              </div>
           </div>
         )}
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-between px-6 py-2 z-40 shadow-xl shadow-black/10 dark:shadow-black/50">
         <MobileNavBtn id="dashboard" icon={LayoutDashboard} label="Home" active={activeTab} set={setActiveTab} />
         <MobileNavBtn id="logs" icon={FileText} label="Logs" active={activeTab} set={setActiveTab} />
         <MobileNavBtn id="expenses" icon={DollarSign} label="Costs" active={activeTab} set={setActiveTab} />
         <MobileNavBtn id="rsa" icon={PhoneCall} label="RSA" active={activeTab} set={setActiveTab} />
      </div>
    </div>
  );
}
