import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings, 
  Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge, 
  DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info, 
  Shield, CheckCircle, Search, X, LogIn, 
  AlertOctagon, Camera, Clock, Upload, Calendar, AlertCircle,
  MoreVertical, FileCheck, PenTool, Layers, Download,
  MapPin, Phone, Users, Share2, CreditCard, Siren, UserPlus,
  Baby, Heart, Briefcase, Smile, ChevronDown, RotateCcw, Menu
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

// --- Data Constants ---

const INDIAN_CAR_BRANDS = [
    { name: 'Maruti Suzuki', color: 'bg-blue-600' },
    { name: 'Tata Motors', color: 'bg-blue-800' },
    { name: 'Mahindra', color: 'bg-red-600' },
    { name: 'Hyundai', color: 'bg-blue-500' },
    { name: 'Toyota', color: 'bg-red-500' },
    { name: 'Kia', color: 'bg-red-700' },
    { name: 'Honda', color: 'bg-slate-600' },
    { name: 'Volkswagen', color: 'bg-blue-400' },
];

const FAMILY_ROLES = [
    { label: 'My Car', icon: UserPlus },
    { label: 'Dad', icon: Briefcase },
    { label: 'Mom', icon: Smile },
    { label: 'Wife', icon: Heart },
    { label: 'Husband', icon: Heart },
    { label: 'Son', icon: Baby },
    { label: 'Daughter', icon: Baby },
    { label: 'Driver', icon: Car },
];

const EXPENSE_CATEGORIES = [
  'Fuel', 'Toll', 'Parking', 'Car Wash', 'Service & Maintenance', 
  'Repairs', 'Insurance', 'Fines/Challan', 'Accessories', 
  'Tuning/Mods', 'EMI', 'Tyres', 'FASTag Recharge', 'Other'
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

const RSA_PROVIDERS = [
    { id: 1, name: 'City Towing Services', distance: '2.5 km', phone: '1800-123-4567', type: 'Towing' },
    { id: 2, name: 'Quick Fix Mechanic', distance: '0.8 km', phone: '9876543210', type: 'Mechanic' },
    { id: 3, name: 'Shell Petrol Bunk', distance: '1.2 km', phone: '044-23456789', type: 'Fuel' },
    { id: 4, name: 'Apollo Tyres', distance: '3.0 km', phone: '044-11223344', type: 'Tyres' },
];

// --- Types ---

type UserAccount = {
  id: string;
  name: string;
  mobile: string;
  isPro: boolean;
};

type TripLog = {
  id: string;
  date: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  type: string;
  notes: string;
  vehicleId?: string;
  createdBy?: string;
};

type LineItem = { item: string; cost: number };

type ExpenseLog = {
  id: string;
  date: string;
  category: string;
  amount: number;
  vendor: string;
  notes: string;
  isVerified?: boolean;
  lineItems?: LineItem[];
  vehicleId?: string;
  createdBy?: string;
};

type IssueSeverity = 'low' | 'medium' | 'critical';

type MaintenanceTaskState = {
  id: string;
  lastChecked: string | null;
  status: 'pending' | 'ok' | 'issue';
  issueDetails?: string;
  severity?: IssueSeverity;
  estimatedCost?: number;
  vehicleId?: string;
};

type VehicleProfile = {
  id: string;
  make: string;
  model: string;
  variant: string;
  regNumber: string;
  vin: string;
  purchaseDate: string;
  fuelType: string;
  insuranceExpiry: string;
  pucExpiry: string;
  fastagBalance: number;
  owner: string; // e.g., "Dad", "My Car"
  drivers: { name: string; role: 'Admin' | 'Driver' }[];
  logo?: string;
};

// --- Shared UI Components ---

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={cn("bg-slate-900 border border-slate-800 rounded-xl shadow-sm transition-all", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-95";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30",
    pro: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40",
    gold: "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg shadow-amber-900/40",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn(baseStyle, variants[variant as keyof typeof variants], className)}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="mb-3">
    {label && <label className="block text-slate-400 text-xs font-bold uppercase mb-1">{label}</label>}
    <input {...props} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600 text-sm transition-all focus:border-blue-500" />
  </div>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <Card className={cn("p-4 border-l-4", color === 'blue' ? 'border-l-blue-500' : color === 'emerald' ? 'border-l-emerald-500' : color === 'purple' ? 'border-l-purple-500' : 'border-l-slate-500')}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <h3 className="text-xl font-bold text-white mt-0.5">{value}</h3>
      </div>
      <div className={cn("p-2 rounded-lg opacity-80", color === 'blue' ? 'bg-blue-500/10 text-blue-400' : color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-500/10 text-slate-400')}>
        {icon}
      </div>
    </div>
  </Card>
);

const NavButton = ({ id, icon: Icon, label, active, set, variant = 'default' }: any) => (
  <button 
    onClick={() => set(id)} 
    className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all", 
        active === id ? (variant === 'danger' ? 'bg-red-900/20 text-red-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20') : (variant === 'danger' ? 'text-red-400 hover:bg-red-900/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white')
    )}
  >
    <Icon size={18} /><span>{label}</span>
  </button>
);

const MobileNavBtn = ({ id, icon: Icon, active, set }: any) => (
  <button 
    onClick={() => set(id)}
    className={cn(
      "p-3 rounded-xl flex flex-col items-center gap-1 transition-all",
      active === id ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500'
    )}
  >
    <Icon size={20} />
  </button>
);

const WarningLightCard = ({ light }: { light: typeof WARNING_LIGHTS_DATA[0] }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex gap-4 items-start hover:border-slate-700 transition-colors">
    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 shrink-0">
      {light.icon}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-white text-sm">{light.name}</h4>
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase", 
          light.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 
          light.severity === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        )}>
          {light.severity}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-2">{light.desc}</p>
      <div className="flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-800/50 px-2 py-1 rounded inline-block">
        <AlertCircle size={10} /> Action: {light.action}
      </div>
    </div>
  </div>
);

// --- Modals ---

const AddFamilyCarModal = ({ isOpen, onClose, onSave }: any) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({ owner: 'My Car', make: '', model: '', regNumber: '', purchaseDate: '', drivers: [] });

    // Reset when opening
    useEffect(() => { if(isOpen) { setStep(1); setFormData({ owner: 'My Car', make: '', model: '', regNumber: '', purchaseDate: '', drivers: [] }); } }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-lg p-0 overflow-hidden border-slate-700">
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Add Family Vehicle</h2>
                    <p className="text-slate-400 text-sm">Step {step} of 4</p>
                </div>
                
                <div className="p-6 min-h-[300px]">
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right fade-in duration-300">
                            <h3 className="text-white font-medium mb-4">Who drives this car?</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {FAMILY_ROLES.map(role => (
                                    <button 
                                        key={role.label}
                                        onClick={() => { setFormData({...formData, owner: role.label, drivers: [{name: 'Me', role: 'Admin'}, {name: role.label, role: 'Driver'}]}); setStep(2); }}
                                        className="flex flex-col items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                                            <role.icon size={20} />
                                        </div>
                                        <span className="text-xs text-slate-300">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in slide-in-from-right fade-in duration-300">
                            <h3 className="text-white font-medium mb-4">Select Brand</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {INDIAN_CAR_BRANDS.map(brand => (
                                    <button 
                                        key={brand.name}
                                        onClick={() => { setFormData({...formData, make: brand.name}); setStep(3); }}
                                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all text-center"
                                    >
                                        <div className={`w-8 h-8 ${brand.color} rounded-full mx-auto mb-2 flex items-center justify-center text-[10px] font-bold text-white opacity-80`}>
                                            {brand.name[0]}
                                        </div>
                                        <span className="text-xs text-slate-300 font-medium">{brand.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in slide-in-from-right fade-in duration-300 space-y-4">
                            <h3 className="text-white font-medium">Vehicle Details</h3>
                            <Input label="Model Name" placeholder="e.g. Nexon, Swift" value={formData.model} onChange={(e:any) => setFormData({...formData, model: e.target.value})} />
                            <Input label="Registration Number" placeholder="MH-01-AB-1234" value={formData.regNumber} onChange={(e:any) => setFormData({...formData, regNumber: e.target.value})} />
                            <Input label="Purchase Year" type="number" placeholder="2024" value={formData.purchaseDate} onChange={(e:any) => setFormData({...formData, purchaseDate: e.target.value})} />
                            <Button className="w-full mt-4" onClick={() => setStep(4)}>Next: Documents</Button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in slide-in-from-right fade-in duration-300 space-y-4">
                            <h3 className="text-white font-medium">Insurance & Docs</h3>
                            <Input label="Insurance Expiry" type="date" value={formData.insuranceExpiry} onChange={(e:any) => setFormData({...formData, insuranceExpiry: e.target.value})} />
                            <Input label="PUC Expiry" type="date" value={formData.pucExpiry} onChange={(e:any) => setFormData({...formData, pucExpiry: e.target.value})} />
                            <div className="flex gap-3 mt-6">
                                <Button variant="ghost" className="flex-1" onClick={() => onSave(formData)}>Skip for Now</Button>
                                <Button className="flex-1" onClick={() => onSave(formData)}>Finish Setup</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ResaleReportModal = ({ isOpen, onClose, profile, healthScore }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-2xl bg-white text-slate-900 overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X/></button>
                <div className="bg-blue-900 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">VEHICLE HEALTH REPORT</h1>
                            <p className="text-blue-200 mt-1">Generated by Autolog Pro • Verified History</p>
                        </div>
                        <Shield size={48} className="text-blue-300 opacity-50" />
                    </div>
                </div>
                <div className="p-8 grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-slate-500 uppercase text-xs mb-1">Vehicle</h3>
                        <p className="text-2xl font-bold text-slate-800">{profile.make} {profile.model}</p>
                        <p className="text-slate-600">{profile.variant} • {profile.regNumber}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-500 uppercase text-xs mb-1">Autolog Score</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-black text-emerald-600">{healthScore}/100</span>
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">EXCELLENT</span>
                        </div>
                    </div>
                </div>
                <div className="px-8 pb-8">
                    <div className="border-t border-slate-200 pt-6 grid grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-800">0</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Accidents</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-800">1</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Owners</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-800">100%</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Service Rec</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-800">Clean</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Legal Title</p>
                        </div>
                    </div>
                    <Button variant="primary" className="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white" onClick={onClose}>Download Certified PDF</Button>
                </div>
            </Card>
        </div>
    );
};

const SellCarModal = ({ isOpen, onClose, profile }: any) => {
    const [estimating, setEstimating] = useState(false);
    const [price, setPrice] = useState(0);

    const startEstimate = () => {
        setEstimating(true);
        setPrice(0);
    };

    useEffect(() => {
        if (estimating) {
            let start = 300000;
            const end = 875000; // Mock estimate
            const timer = setInterval(() => {
                start += 25000;
                if (start >= end) {
                    setPrice(end);
                    setEstimating(false);
                    clearInterval(timer);
                } else {
                    setPrice(start);
                }
            }, 50);
            return () => clearInterval(timer);
        }
    }, [estimating]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md p-6 text-center relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500"><X size={20}/></button>
                <div className="mb-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Sell Your Car</h2>
                    <p className="text-slate-400 text-sm">Get an instant AI market valuation for your {profile.make}</p>
                </div>

                {!price && !estimating && (
                    <div className="space-y-4">
                        <Input label="Current Odometer" placeholder="e.g. 45000" />
                        <Input label="Condition" placeholder="Good / Excellent / Fair" />
                        <Button variant="pro" className="w-full py-3" onClick={startEstimate}>Check Market Value</Button>
                    </div>
                )}

                {estimating && (
                    <div className="py-10">
                        <p className="text-slate-400 animate-pulse mb-2">Analyzing market trends...</p>
                        <h3 className="text-4xl font-black text-white">₹{price.toLocaleString()}</h3>
                    </div>
                )}

                {!estimating && price > 0 && (
                    <div className="py-6 animate-in zoom-in duration-500">
                        <p className="text-slate-400 uppercase text-xs font-bold">Estimated Resale Value</p>
                        <h3 className="text-5xl font-black text-emerald-400 my-4 tracking-tighter">₹{price.toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mb-6">Based on {profile.model} sales in your region.</p>
                        <div className="flex gap-3">
                            <Button variant="secondary" className="flex-1" onClick={startEstimate}><RotateCcw size={16}/> Recalculate</Button>
                            <Button className="flex-1">List for Sale</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

// --- Standard Modals (Trip, Expense, etc.) ---
const AddTripModal = ({ isOpen, onClose, onSave, lastOdometer, drivers }: any) => {
  const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], type: 'City', startOdometer: lastOdometer, endOdometer: lastOdometer + 1, notes: '', createdBy: 'Me' });
  useEffect(() => { if(isOpen) setData(prev => ({...prev, startOdometer: lastOdometer, endOdometer: lastOdometer + 1})) }, [isOpen, lastOdometer]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-md p-6 relative">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Car size={20} className="text-blue-500"/> Log Trip</h2>
        <div className="grid grid-cols-2 gap-3"><Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} /><div className="mb-3"><label className="block text-slate-400 text-xs font-bold uppercase mb-1">Type</label><select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.type} onChange={(e:any) => setData({...data, type: e.target.value})}>{TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div><Input label="Start Odo" type="number" value={data.startOdometer} onChange={(e:any) => setData({...data, startOdometer: Number(e.target.value)})} /><Input label="End Odo" type="number" value={data.endOdometer} onChange={(e:any) => setData({...data, endOdometer: Number(e.target.value)})} /></div>
        <Input label="Notes" placeholder="Route info..." value={data.notes} onChange={(e:any) => setData({...data, notes: e.target.value})} />
        {drivers && drivers.length > 0 && (
            <div className="mb-3">
                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Driver (Who drove?)</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.createdBy} onChange={(e:any) => setData({...data, createdBy: e.target.value})}>
                    <option value="Me">Me</option>
                    {drivers.map((d:any) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
            </div>
        )}
        <div className="flex gap-2 mt-4"><Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button><Button onClick={() => onSave(data)} className="flex-1">Save Log</Button></div>
      </Card>
    </div>
  );
};

const AddExpenseModal = ({ isOpen, onClose, onSave, drivers }: any) => {
  const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], category: 'Fuel', amount: '', vendor: '', notes: '', createdBy: 'Me' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-md p-6 relative">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><DollarSign size={20} className="text-emerald-500"/> Add Expense</h2>
        <div className="grid grid-cols-2 gap-3"><Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} /><div className="mb-3"><label className="block text-slate-400 text-xs font-bold uppercase mb-1">Category</label><select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.category} onChange={(e:any) => setData({...data, category: e.target.value})}>{EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div><Input label="Amount (₹)" type="number" value={data.amount} onChange={(e:any) => setData({...data, amount: e.target.value})} /><Input label="Vendor" placeholder="e.g. Shell" value={data.vendor} onChange={(e:any) => setData({...data, vendor: e.target.value})} /></div>
        <Input label="Notes" placeholder="Details..." value={data.notes} onChange={(e:any) => setData({...data, notes: e.target.value})} />
        {drivers && drivers.length > 0 && (
            <div className="mb-3">
                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Who Paid?</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.createdBy} onChange={(e:any) => setData({...data, createdBy: e.target.value})}>
                    <option value="Me">Me</option>
                    {drivers.map((d:any) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
            </div>
        )}
        <div className="flex gap-2 mt-4"><Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button><Button variant="success" onClick={() => onSave({...data, amount: Number(data.amount)})} className="flex-1">Save</Button></div>
      </Card>
    </div>
  );
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
        <h3 className="font-bold text-white text-lg mb-2">Smart Bill Scanner</h3>
        {step === 1 && (
          <div className="py-8 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all" onClick={simulateScan}>
            <Camera className="mx-auto text-slate-500 mb-2" size={32} />
            <p className="text-slate-400 text-sm">Tap to Upload Bill</p>
          </div>
        )}
        {step === 2 && (
          <div className="py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-400 text-sm animate-pulse">Extracting Line Items...</p>
          </div>
        )}
        {step === 3 && scanned && (
          <div className="text-left space-y-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex gap-2 items-center">
              <CheckCircle size={16} className="text-emerald-500" />
              <span className="text-emerald-400 text-sm font-bold">Scan Complete</span>
            </div>
            <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex justify-between text-xs text-slate-500 uppercase font-bold border-b border-slate-800 pb-1 mb-1">
                <span>Item</span><span>Cost</span>
              </div>
              {scanned.items.map((i:any, idx:number) => (
                <div key={idx} className="flex justify-between text-sm text-slate-300">
                  <span>{i.item}</span><span>₹{i.cost}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2 mt-2">
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
        <div className="space-y-4"><div><label className="block text-xs text-slate-500 uppercase font-bold mb-2">Severity</label><div className="flex gap-2">{['low', 'medium', 'critical'].map(s => (<button key={s} onClick={() => setData({...data, severity: s})} className={cn("flex-1 py-2 rounded text-xs font-bold capitalize border", data.severity === s ? (s === 'critical' ? 'bg-red-500 border-red-500 text-white' : 'bg-yellow-500 border-yellow-500 text-black') : 'bg-slate-950 border-slate-800 text-slate-400')}>{s}</button>))}</div></div><Input label="Est. Cost (Optional)" type="number" placeholder="₹" value={data.cost} onChange={(e:any) => setData({...data, cost: e.target.value})} /><div><label className="block text-slate-400 text-xs font-bold uppercase mb-1">Description</label><textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white h-20 focus:outline-none focus:border-red-500" placeholder="Describe the problem..." value={data.description} onChange={(e) => setData({...data, description: e.target.value})} /></div><div className="border-dashed border-2 border-slate-700 p-4 rounded-lg text-center cursor-pointer hover:border-purple-500 transition-colors"><Camera className="mx-auto text-slate-500 mb-2" /><p className="text-xs text-slate-400">Upload Photo (Pro)</p></div></div>
        <div className="flex gap-2 mt-4"><Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button><Button variant="danger" onClick={() => onSave(data)} className="flex-1">Log Defect</Button></div>
      </Card>
    </div>
  );
};

const AddDriverModal = ({ isOpen, onClose, onSave }: any) => {
    const [driver, setDriver] = useState({ name: '', role: 'Driver' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm p-6">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><Users className="text-blue-500"/> Add Driver</h3>
                <Input label="Name" placeholder="Family Member Name" value={driver.name} onChange={(e:any) => setDriver({...driver, name: e.target.value})} />
                <div className="mb-4">
                    <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Role</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={driver.role} onChange={(e:any) => setDriver({...driver, role: e.target.value})}>
                        <option value="Driver">Driver (Log Trips Only)</option>
                        <option value="Admin">Admin (Full Access)</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button onClick={() => onSave(driver)} className="flex-1">Add Member</Button>
                </div>
            </Card>
        </div>
    );
};

// --- Main App ---

export default function AutologApp() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSwitchingCar, setIsSwitchingCar] = useState(false);
  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(false);
  
  // Data
  const [trips, setTrips] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>(MAINTENANCE_TASKS.map(t => ({ id: t.id, lastChecked: null, status: 'pending' })));
  const [vehicles, setVehicles] = useState<any[]>([{ id: 'v1', make: 'My Car', model: '', regNumber: '', drivers: [] }]);
  const [activeVehicleId, setActiveVehicleId] = useState('v1');

  // Modals
  const [modals, setModals] = useState({ trip: false, expense: false, scan: false, pro: false, addCar: false, resale: false, sell: false, driver: false });
  const [issueTarget, setIssueTarget] = useState<any>(null);

  // Load/Save
  useEffect(() => {
      const savedUser = localStorage.getItem('autolog_user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      setUser(u);
      
      const uid = u ? u.id : 'guest';
      const p = `autolog_${uid}`;
      
      try {
          const t = JSON.parse(localStorage.getItem(`${p}_trips`) || '[]');
          const e = JSON.parse(localStorage.getItem(`${p}_expenses`) || '[]');
          const ts = JSON.parse(localStorage.getItem(`${p}_tasks`) || 'null');
          const v = JSON.parse(localStorage.getItem(`${p}_vehicles`) || 'null');
          
          if(t.length) setTrips(t);
          if(e.length) setExpenses(e);
          if(ts) setTasks(ts);
          if(v) { setVehicles(v); setActiveVehicleId(v[0].id); }
          else if(!u) loadDemoData(); 
      } catch(err) { console.log("Init error", err); }
  }, []);

  const saveData = () => {
      const uid = user ? user.id : 'guest';
      const p = `autolog_${uid}`;
      localStorage.setItem(`${p}_trips`, JSON.stringify(trips));
      localStorage.setItem(`${p}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${p}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${p}_vehicles`, JSON.stringify(vehicles));
  };
  useEffect(() => { saveData() }, [trips, expenses, tasks, vehicles]);

  const loadDemoData = () => {
      setTrips([{ id: 't1', date: '2023-12-01', startOdometer: 45000, endOdometer: 45150, distance: 150, type: 'Highway', notes: 'Weekend Trip', vehicleId: 'v1', createdBy: 'Dad' }]);
      setExpenses([{ id: 'e1', date: '2023-12-02', category: 'Fuel', amount: 2500, vendor: 'Shell', notes: 'Full Tank', vehicleId: 'v1', createdBy: 'Mom' }]);
      setTasks(tasks.map(t => t.id === 'd1' ? { ...t, status: 'issue', severity: 'critical', issueDetails: 'Low pressure', lastChecked: '2023-12-06' } : t));
      setVehicles([{ id: 'v1', make: 'Toyota', model: 'Fortuner', variant: 'Legender', regNumber: 'KA-01-MJ-2024', vin: 'SAMPLE123', purchaseDate: '2022-01-15', fuelType: 'Diesel', insuranceExpiry: '2024-12-31', pucExpiry: '2024-06-30', fastagBalance: 450, owner: 'Dad', drivers: [{name: 'Dad', role: 'Admin'}, {name: 'Mom', role: 'Driver'}] }]);
      setActiveVehicleId('v1');
  };

  const handleSwitchCar = (newId: string) => {
      setVehicleMenuOpen(false);
      setIsSwitchingCar(true);
      setTimeout(() => {
          setActiveVehicleId(newId);
          setIsSwitchingCar(false);
      }, 300);
  };

  const activeProfile = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];
  const vehicleTrips = trips.filter(t => t.vehicleId === activeVehicleId);
  const vehicleExpenses = expenses.filter(e => e.vehicleId === activeVehicleId);
  const lastOdometer = vehicleTrips.length > 0 ? Math.max(...vehicleTrips.map(t => t.endOdometer)) : 0;
  const totalSpent = vehicleExpenses.reduce((a, b) => a + (b.amount || 0), 0);

  const healthScore = useMemo(() => {
    let score = 100;
    tasks.filter(t => t.status === 'issue').forEach(i => score -= (i.severity === 'critical' ? 25 : 10));
    return Math.max(0, score);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex">
      {/* Modals */}
      <AddTripModal isOpen={modals.trip} onClose={() => setModals({...modals, trip: false})} drivers={activeProfile.drivers} onSave={(d:any) => { setTrips([{id: generateId(), ...d, distance: d.endOdometer - d.startOdometer, vehicleId: activeVehicleId}, ...trips]); setModals({...modals, trip: false}); }} lastOdometer={lastOdometer} />
      <AddExpenseModal isOpen={modals.expense} onClose={() => setModals({...modals, expense: false})} drivers={activeProfile.drivers} onSave={(d:any) => { setExpenses([{id: generateId(), ...d, vehicleId: activeVehicleId}, ...expenses]); setModals({...modals, expense: false}); }} />
      <IssueReportModal isOpen={!!issueTarget} taskName={issueTarget?.name} onClose={() => setIssueTarget(null)} onSave={(d:any) => { setTasks(tasks.map(t => t.id === issueTarget.id ? { ...t, status: 'issue', severity: d.severity, issueDetails: d.description } : t)); setIssueTarget(null); }} />
      <AddFamilyCarModal isOpen={modals.addCar} onClose={() => setModals({...modals, addCar: false})} onSave={(v:any) => { const newId = generateId(); setVehicles([...vehicles, {id: newId, ...v}]); setActiveVehicleId(newId); setModals({...modals, addCar: false}); }} />
      <ResaleReportModal isOpen={modals.resale} onClose={() => setModals({...modals, resale: false})} profile={activeProfile} healthScore={healthScore} />
      <SellCarModal isOpen={modals.sell} onClose={() => setModals({...modals, sell: false})} profile={activeProfile} />
      <AddDriverModal isOpen={modals.driver} onClose={() => setModals({...modals, driver: false})} onSave={(d:any) => { const updatedVehicles = vehicles.map(v => v.id === activeVehicleId ? { ...v, drivers: [...(v.drivers || []), d] } : v); setVehicles(updatedVehicles); setModals({...modals, driver: false}); }} />
      <SmartScanModal isOpen={modals.scan} onClose={() => setModals({...modals, scan: false})} onSave={(d:any) => { setExpenses([{id: generateId(), ...d, vehicleId: activeVehicleId}, ...expenses]); }} />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Car className="text-white"/></div>
           <div><h1 className="font-bold text-xl text-white">AUTOLOG</h1><p className="text-xs text-slate-500">Pro Edition</p></div>
        </div>
        
        {/* Animated Vehicle Switcher */}
        <div className="px-4 mt-6 relative">
            <div className="relative group">
                <div onClick={() => setVehicleMenuOpen(!vehicleMenuOpen)} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center border border-blue-500/30">
                            <Car size={16} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{activeProfile.owner || 'My Car'}</p>
                            <p className="text-sm font-bold text-white truncate w-24">{activeProfile.make} {activeProfile.model}</p>
                        </div>
                    </div>
                    <ChevronDown size={16} className={cn("text-slate-400 transition-transform", vehicleMenuOpen ? "rotate-180" : "")} />
                </div>
                
                {/* Dropdown Menu */}
                {vehicleMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-slate-900 border border-slate-700 rounded-lg mt-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        {vehicles.map(v => (
                            <div key={v.id} onClick={() => handleSwitchCar(v.id)} className={cn("p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800/50 last:border-0", v.id === activeVehicleId ? "bg-slate-800/50" : "")}>
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", v.id === activeVehicleId ? "bg-blue-500" : "bg-slate-600")}></div>
                                    <span className={cn("text-sm", v.id === activeVehicleId ? "text-blue-400 font-bold" : "text-slate-300")}>{v.make} {v.model}</span>
                                </div>
                            </div>
                        ))}
                        <div className="p-2 border-t border-slate-800">
                            <button onClick={() => { setModals({...modals, addCar: true}); setVehicleMenuOpen(false); }} className="w-full text-xs text-center text-blue-400 py-2 font-bold hover:text-blue-300 hover:bg-slate-800 rounded flex items-center justify-center gap-1 transition-colors">+ Add Family Vehicle</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
           <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
           <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
           <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
           <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
           <NavButton id="history" icon={Clock} label="Service History" active={activeTab} set={setActiveTab} />
           <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
           <NavButton id="profile" icon={Settings} label="Vehicle & Docs" active={activeTab} set={setActiveTab} />
           
           <p className="text-xs font-bold text-purple-500 uppercase px-4 mb-2 mt-6 flex items-center gap-1"><Shield size={10}/> Pro Tools</p>
           <NavButton id="resale" icon={FileCheck} label="Resale Report" active={activeTab} set={() => setModals({...modals, resale: true})} />
           <NavButton id="sell" icon={DollarSign} label="Sell Car" active={activeTab} set={() => setModals({...modals, sell: true})} />
        </div>
        
        <div className="p-4 border-t border-slate-800">
           {user ? (
             <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm font-bold text-white">{user.name}</span>
                <button onClick={() => window.location.reload()} className="text-red-400"><LogOut size={16}/></button>
             </div>
           ) : (
             <Button className="w-full" onClick={() => setUser({id: generateId(), name: 'User', isPro: false})}>Sign In</Button>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("md:ml-64 flex-1 p-8 min-h-screen pb-24 md:pb-8 transition-opacity duration-300", isSwitchingCar ? 'opacity-50' : 'opacity-100')}>
         {activeTab === 'dashboard' && (
             <div className="space-y-6 animate-in fade-in">
                 <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                        <p className="text-slate-400 text-sm">Overview for {activeProfile.make} {activeProfile.model}</p>
                    </div>
                    {!user && <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">Guest Mode</span>}
                 </div>

                 {/* Insurance Status Widget (Restored) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className={cn("p-2 rounded-lg", activeProfile.insuranceExpiry && new Date(activeProfile.insuranceExpiry) < new Date() ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500")}>
                                 <Shield size={20} />
                             </div>
                             <div>
                                 <p className="text-xs text-slate-400 uppercase font-bold">Insurance Status</p>
                                 <h3 className="text-sm font-bold text-white">{activeProfile.insuranceExpiry ? `Expires: ${activeProfile.insuranceExpiry}` : 'No Date Set'}</h3>
                             </div>
                         </div>
                         <Button variant="ghost" onClick={() => setActiveTab('profile')}><Settings size={16}/></Button>
                     </div>
                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className={cn("p-2 rounded-lg", activeProfile.pucExpiry && new Date(activeProfile.pucExpiry) < new Date() ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500")}>
                                 <FileCheck size={20} />
                             </div>
                             <div>
                                 <p className="text-xs text-slate-400 uppercase font-bold">PUC Status</p>
                                 <h3 className="text-sm font-bold text-white">{activeProfile.pucExpiry ? `Expires: ${activeProfile.pucExpiry}` : 'No Date Set'}</h3>
                             </div>
                         </div>
                         <Button variant="ghost" onClick={() => setActiveTab('profile')}><Settings size={16}/></Button>
                     </div>
                 </div>

                 {/* Emergency Assist (Pro Highlight) */}
                 <div className="bg-gradient-to-r from-red-900/40 to-slate-900 border border-red-500/30 rounded-xl p-4 flex justify-between items-center">
                     <div className="flex items-center gap-4">
                         <div className="bg-red-500 p-3 rounded-full animate-pulse shadow-lg shadow-red-500/20">
                             <Siren size={24} className="text-white" />
                         </div>
                         <div>
                             <h3 className="font-bold text-white text-lg">24/7 Roadside Assistance</h3>
                             <p className="text-slate-400 text-sm">{user?.isPro ? 'Active & Ready' : 'Upgrade to Pro for guaranteed response.'}</p>
                         </div>
                     </div>
                     <Button variant={user?.isPro ? "danger" : "secondary"} onClick={() => alert(user?.isPro ? "Connecting to RSA..." : "Please upgrade to access RSA.")}>
                         {user?.isPro ? "Call Help" : "Unlock"}
                     </Button>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard label="Odometer" value={`${lastOdometer} km`} icon={<Gauge size={18}/>} color="blue" />
                    <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign size={18}/>} color="emerald" />
                    <StatCard label="Health Score" value={`${healthScore}%`} icon={<Activity size={18}/>} color="purple" />
                    <StatCard label="FASTag" value={`₹${activeProfile.fastagBalance || 0}`} icon={<CreditCard size={18}/>} color="slate" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-5 border-l-4 border-l-blue-500 hover:bg-slate-800/50 cursor-pointer group" onClick={() => setModals({...modals, trip: true})}>
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2"><div className="bg-blue-600/20 p-2 rounded-lg text-blue-500"><Plus size={18} /></div><div><h3 className="font-bold text-white">Log Trip</h3><p className="text-xs text-slate-400">Add new journey</p></div></div>
                         <Car className="text-blue-500 group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-xs text-slate-500">Last Odo</span><span className="text-sm font-mono font-bold text-white">{lastOdometer} km</span></div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-emerald-500 hover:bg-slate-800/50 cursor-pointer group" onClick={() => setModals({...modals, expense: true})}>
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2"><div className="bg-emerald-600/20 p-2 rounded-lg text-emerald-500"><Plus size={18} /></div><div><h3 className="font-bold text-white">Add Expense</h3><p className="text-xs text-slate-400">Fuel, Repair, etc.</p></div></div>
                         <DollarSign className="text-emerald-500 group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-xs text-slate-500">Total Spent</span><span className="text-sm font-mono font-bold text-emerald-400">₹{totalSpent.toLocaleString()}</span></div>
                    </Card>
                 </div>
             </div>
         )}

         {activeTab === 'logs' && (
           <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">Trip Logs</h2><Button onClick={() => setModals({...modals, trip: true})}><Plus size={16}/> Log Trip</Button></div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300"><thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Odo</th><th className="px-4 py-3 text-right">Dist</th></tr></thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {vehicleTrips.map(t => (
                        <tr key={t.id}>
                            <td className="px-4 py-3">{t.date}</td>
                            <td className="px-4 py-3"><span className="text-xs bg-slate-800 px-2 py-1 rounded text-blue-300">{t.createdBy || 'Me'}</span></td>
                            <td className="px-4 py-3">{t.type}</td>
                            <td className="px-4 py-3">{t.startOdometer}-{t.endOdometer}</td>
                            <td className="px-4 py-3 text-right text-white font-bold">{t.distance} km</td>
                        </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {activeTab === 'expenses' && (
           <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">Expenses</h2><Button onClick={() => setModals({...modals, expense: true})}><Plus size={16}/> Add Expense</Button></div>
              
              {user?.isPro && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Card className="p-4 bg-slate-900/50 border-purple-500/20">
                        <p className="text-xs text-purple-400 font-bold uppercase mb-1">Forecast</p>
                        <p className="text-sm text-slate-300">Est. next month: <span className="text-white font-bold">₹{Math.round(totalSpent / Math.max(1, vehicleExpenses.length) * 2).toLocaleString()}</span></p>
                    </Card>
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300"><thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3 text-right">Amount</th></tr></thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {vehicleExpenses.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No expenses recorded for this vehicle.</td></tr>}
                   {vehicleExpenses.map(e => (
                       <tr key={e.id}>
                           <td className="px-4 py-3">{e.date}</td>
                           <td className="px-4 py-3"><span className="text-xs bg-slate-800 px-2 py-1 rounded text-emerald-300">{e.createdBy || 'Me'}</span></td>
                           <td className="px-4 py-3">{e.category}</td>
                           <td className="px-4 py-3">{e.vendor}</td>
                           <td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{e.amount}</td>
                       </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {activeTab === 'maintenance' && (
           <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white">Maintenance Checklist</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {['Daily', 'Monthly', 'Yearly'].map(freq => (
                   <Card key={freq} className="p-0 border-t-4 border-t-blue-500 h-fit">
                      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center"><h3 className="font-bold text-white">{freq} Checks</h3><span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{tasks.filter(t => MAINTENANCE_TASKS.find(def => def.id === t.id)?.frequency === freq && t.status === 'ok').length} / {MAINTENANCE_TASKS.filter(def => def.frequency === freq).length}</span></div>
                      <div className="divide-y divide-slate-800/50">
                         {MAINTENANCE_TASKS.filter(def => def.frequency === freq).map(def => {
                            const state = tasks.find(t => t.id === def.id);
                            return (
                              <div key={def.id} className={cn("p-3 flex items-center justify-between", state?.status === 'issue' ? 'bg-red-500/5' : 'hover:bg-slate-800/50')}>
                                 <div><p className={cn("text-sm", state?.status === 'ok' ? 'text-slate-500 line-through' : state?.status === 'issue' ? 'text-red-400 font-bold' : 'text-slate-300')}>{def.label}</p><p className="text-[10px] text-slate-500 uppercase">{def.category}</p></div>
                                 <div className="flex gap-2"><button onClick={() => setTasks(tasks.map(t => t.id === def.id ? {...t, status: t.status === 'ok' ? 'pending' : 'ok'} : t))} className={cn("p-1 rounded border", state?.status === 'ok' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-slate-500')}><CheckCircle size={14}/></button><button onClick={() => setIssueTarget({id: def.id, name: def.label})} className={cn("p-1 rounded border", state?.status === 'issue' ? 'bg-red-600 border-red-500 text-white' : 'border-slate-700 text-slate-500')}><AlertOctagon size={14}/></button></div>
                              </div>
                            )
                         })}
                      </div>
                   </Card>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'history' && (
            <div className="animate-in fade-in space-y-6">
                <div className="flex justify-between items-end">
                    <div><h2 className="text-2xl font-bold text-white">Service History</h2><p className="text-slate-400 text-sm">Maintenance events for {activeProfile.make}</p></div>
                    <Button variant="pro" onClick={() => setModals({...modals, scan: true})}><Camera size={16} className="mr-2"/> Scan Bill</Button>
                </div>
                <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                    {vehicleExpenses.filter(e => e.category.includes('Service')).length === 0 && <p className="text-slate-500 italic">No service records.</p>}
                    {vehicleExpenses.filter(e => e.category.includes('Service')).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                        <div key={e.id} className="relative">
                            <div className="absolute -left-[39px] w-8 h-8 bg-slate-900 border-2 border-purple-500 rounded-full flex items-center justify-center z-10"><Wrench size={14} className="text-purple-400" /></div>
                            <Card className="p-4">
                                <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-white">{e.vendor || 'Unknown'}</h4><p className="text-xs text-slate-500">{e.date}</p></div><span className="font-bold text-emerald-400">₹{e.amount}</span></div>
                                {e.lineItems && <div className="mt-3 border-t border-slate-800 pt-2 space-y-1">{e.lineItems.map((item:any, i:number) => <div key={i} className="flex justify-between text-xs text-slate-400"><span>{item.item}</span><span>{item.cost}</span></div>)}</div>}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
         )}
         
         {activeTab === 'warnings' && (
            <div className="animate-in fade-in space-y-6">
                <div className="mb-6"><h2 className="text-2xl font-bold text-white mb-2">Dashboard Warning Lights</h2><p className="text-slate-400 text-sm">Quick reference guide.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{WARNING_LIGHTS_DATA.map(light => <WarningLightCard key={light.id} light={light} />)}</div>
            </div>
        )}

         {activeTab === 'profile' && (
           <Card className="p-8 max-w-2xl mx-auto animate-in fade-in space-y-6">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-2xl font-bold text-white">Vehicle & Docs</h2>
                 {!user && <Button onClick={loadDemoData} variant="pro">Load Demo Data</Button>}
              </div>
              
              <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b border-slate-800 pb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Make" value={activeProfile.make} onChange={(e:any) => updateActiveProfile({make: e.target.value})} />
                    <Input label="Model" value={activeProfile.model} onChange={(e:any) => updateActiveProfile({model: e.target.value})} />
                    <Input label="Reg Number" value={activeProfile.regNumber} onChange={(e:any) => updateActiveProfile({regNumber: e.target.value})} />
                    <Input label="Fuel Type" value={activeProfile.fuelType} onChange={(e:any) => updateActiveProfile({fuelType: e.target.value})} />
                  </div>
              </div>

              <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b border-slate-800 pb-2">Documents & FASTag</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Insurance Expiry" type="date" value={activeProfile.insuranceExpiry} onChange={(e:any) => updateActiveProfile({insuranceExpiry: e.target.value})} />
                    <Input label="PUC Expiry" type="date" value={activeProfile.pucExpiry} onChange={(e:any) => updateActiveProfile({pucExpiry: e.target.value})} />
                    <div className="col-span-2">
                        <Input label="FASTag Balance (₹)" type="number" value={activeProfile.fastagBalance} onChange={(e:any) => updateActiveProfile({fastagBalance: e.target.value})} />
                    </div>
                  </div>
              </div>

              <div>
                  <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                      <h3 className="text-sm font-bold text-slate-500 uppercase">Family Sharing</h3>
                      <button onClick={() => setModals({...modals, driver: true})} className="text-xs text-blue-400 flex items-center gap-1"><Plus size={12}/> Add Driver</button>
                  </div>
                  <div className="space-y-2">
                      {activeProfile.drivers?.map((d:any, i:number) => (
                          <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded">
                              <span className="text-sm text-white">{d.name}</span>
                              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{d.role}</span>
                          </div>
                      ))}
                      {(!activeProfile.drivers || activeProfile.drivers.length === 0) && <p className="text-xs text-slate-500 italic">No shared drivers added.</p>}
                  </div>
              </div>

              {user && <Button className="mt-4 w-full" onClick={saveData}>Save All Changes</Button>}
           </Card>
         )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 z-50 flex justify-around p-2">
          <MobileNavBtn id="dashboard" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="logs" icon={FileText} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="expenses" icon={DollarSign} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="maintenance" icon={Wrench} active={activeTab} set={setActiveTab} />
          <button onClick={() => setActiveTab('profile')} className={cn("p-3 rounded-xl", activeTab === 'profile' ? "text-blue-400 bg-blue-500/10" : "text-slate-500")}>
              <Menu size={20} />
          </button>
      </div>
    </div>
  );
}
