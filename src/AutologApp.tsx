import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings, 
  Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge, 
  DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info, 
  Shield, CheckCircle, Search, X, LogIn, 
  AlertOctagon, Camera, Clock, Upload, Calendar, AlertCircle,
  MoreVertical, FileCheck, PenTool, Layers, Download,
  Users, PhoneCall, MapPin, ChevronDown, Bell, ShieldAlert, Lock, UserPlus,
  ClipboardCheck, TrendingUp, History, FileWarning, ClipboardList, Check
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

// --- Brand Data ---
const CAR_BRANDS = [
    { id: 'maruti', name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Maruti_Suzuki_logo.svg' },
    { id: 'hyundai', name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { id: 'tata', name: 'Tata Motors', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg' },
    { id: 'mahindra', name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Mahindra_Rise_New_Logo.svg' },
    { id: 'toyota', name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
    { id: 'kia', name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg' },
    { id: 'honda', name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { id: 'merc', name: 'Mercedes', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo.svg' },
    { id: 'bmw', name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { id: 'audi', name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
    { id: 'skoda', name: 'Skoda', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Skoda_Auto_logo_%282023%29.svg' },
    { id: 'vw', name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
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

type UserAccount = {
  id: string;
  name: string;
  mobile: string;
  isPro: boolean;
};

type Vehicle = {
    id: string;
    make: string; // Brand Name
    logo?: string; // Brand Logo URL
    model: string;
    regNumber: string;
    color: string;
    role: 'Owner' | 'Driver';
    fuelType?: 'Petrol' | 'Diesel' | 'EV' | 'CNG';
};

type FamilyMember = {
    id: string;
    name: string;
    role: 'Admin' | 'Driver' | 'Viewer';
    avatar: string;
};

type Document = {
    id: string;
    type: 'Insurance' | 'PUC' | 'RC' | 'FastTag';
    provider: string;
    number: string;
    expiryDate: string;
    fileUrl?: string;
};

type Accident = {
    id: string;
    date: string;
    location: string;
    description: string;
    damageType: 'Minor' | 'Major' | 'Total Loss';
    insuranceClaimed: boolean;
    cost: number;
    status: 'Pending' | 'Fixed';
    photos: number; 
};

// --- Shared UI Components ---

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={cn("bg-slate-900 border border-slate-800 rounded-xl shadow-sm", className)}>
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
  <Card className={cn("p-4 border-l-4 transform hover:scale-105 transition-all duration-300", color === 'blue' ? 'border-l-blue-500' : color === 'emerald' ? 'border-l-emerald-500' : color === 'purple' ? 'border-l-purple-500' : 'border-l-slate-500')}>
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

const NavButton = ({ id, icon: Icon, label, active, set }: any) => (
  <button onClick={() => set(id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all", active === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white')}>
    <Icon size={18} /><span>{label}</span>
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

const AddVehicleModal = ({ isOpen, onClose, onSave }: any) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<any>({ make: '', model: '', regNumber: '', fuelType: 'Petrol', logo: '' });

    if (!isOpen) return null;

    const handleBrandSelect = (brand: any) => {
        setData({ ...data, make: brand.name, logo: brand.logo });
        setStep(2);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg p-0 relative overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {step === 1 ? <><Car size={20} className="text-blue-500"/> Select Brand</> : <><Settings size={20} className="text-blue-500"/> Vehicle Details</>}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step === 1 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {CAR_BRANDS.map(brand => (
                                <div key={brand.id} onClick={() => handleBrandSelect(brand)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-slate-800/50 cursor-pointer transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-white text-center font-medium">{brand.name}</span>
                                </div>
                            ))}
                            <div onClick={() => setStep(2)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-slate-800/50 cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <Plus size={24}/>
                                </div>
                                <span className="text-xs text-slate-400 text-center font-medium">Other</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-10 fade-in duration-300">
                            <div className="flex items-center gap-4 mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
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
                                    <p className="text-xs text-slate-400 uppercase font-bold">Selected Brand</p>
                                    <p className="text-white font-bold text-lg">{data.make || 'Custom'}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="ml-auto text-xs text-blue-400 underline">Change</button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Model Name" placeholder="e.g. Fortuner" value={data.model} onChange={(e:any) => setData({...data, model: e.target.value})} />
                                <Input label="Registration No." placeholder="KA-01-AB-1234" value={data.regNumber} onChange={(e:any) => setData({...data, regNumber: e.target.value.toUpperCase()})} />
                            </div>
                            
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Fuel Type</label>
                                <div className="flex gap-2">
                                    {['Petrol', 'Diesel', 'CNG', 'EV'].map(f => (
                                        <button key={f} onClick={() => setData({...data, fuelType: f})} className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", data.fuelType === f ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900")}>
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
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Car size={20} className="text-blue-500"/> Log Trip</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} />
          <div className="mb-3">
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Type</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.type} onChange={(e:any) => setData({...data, type: e.target.value})}>
              {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Start Odo" type="number" value={data.startOdometer} onChange={(e:any) => setData({...data, startOdometer: Number(e.target.value)})} />
          <Input label="End Odo" type="number" value={data.endOdometer} onChange={(e:any) => setData({...data, endOdometer: Number(e.target.value)})} />
        </div>
        <div className="bg-slate-800/50 p-3 rounded mb-3 text-center border border-slate-800">
           <span className="text-xs text-slate-400 uppercase">Distance Driven</span>
           <p className="text-xl font-bold text-white">{Math.max(0, data.endOdometer - data.startOdometer)} km</p>
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
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><DollarSign size={20} className="text-emerald-500"/> Add Expense</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} />
          <div className="mb-3">
            <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Category</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.category} onChange={(e:any) => setData({...data, category: e.target.value})}>
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
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><AlertOctagon size={20} className="text-red-500"/> Log Accident</h2>
             <div className="grid grid-cols-2 gap-3">
                 <Input label="Date" type="date" value={data.date} onChange={(e:any) => setData({...data, date: e.target.value})} />
                 <div className="mb-3">
                     <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Severity</label>
                     <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.damageType} onChange={(e:any) => setData({...data, damageType: e.target.value})}>
                         <option>Minor</option><option>Major</option><option>Total Loss</option>
                     </select>
                 </div>
                 <Input label="Location" placeholder="Street/City" value={data.location} onChange={(e:any) => setData({...data, location: e.target.value})} />
                 <Input label="Repair Cost" type="number" placeholder="₹" value={data.cost} onChange={(e:any) => setData({...data, cost: e.target.value})} />
             </div>
             <div className="flex items-center gap-3 mb-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                 <input type="checkbox" checked={data.insuranceClaimed} onChange={(e) => setData({...data, insuranceClaimed: e.target.checked})} className="w-4 h-4 rounded" />
                 <span className="text-sm text-slate-300">Insurance Claimed?</span>
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

const ResellFormModal = ({ isOpen, onClose }: any) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md p-6 relative">
             <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><TrendingUp size={20} className="text-amber-500"/> Transfer Ownership</h2>
             <p className="text-xs text-slate-400 mb-4">This will generate a Transfer Form and lock current logs.</p>
             <div className="space-y-3">
                 <Input label="Buyer Name" placeholder="Full Legal Name"/>
                 <Input label="Buyer Mobile" placeholder="+91"/>
                 <Input label="Sale Price" type="number" placeholder="₹"/>
                 <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                     <p className="text-xs text-slate-400 mb-2 font-bold uppercase">Included in Transfer:</p>
                     <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                         <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> Service History</span>
                         <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> Valid Insurance</span>
                         <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> PUC Certificate</span>
                         <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> Spare Keys</span>
                     </div>
                 </div>
             </div>
             <div className="flex gap-2 mt-4">
                 <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                 <Button variant="gold" onClick={() => {alert("Transfer Initiated!"); onClose();}} className="flex-1">Generate Form</Button>
             </div>
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
                <h2 className="text-lg font-bold text-white mb-4">Upload Document</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="mb-3">
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Type</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm" value={data.type} onChange={(e:any) => setData({...data, type: e.target.value})}>
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

// --- Main App Component ---

export default function AutologApp() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  
  // Data State - Multi-vehicle support
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null);
  
  // Context Data (filtered by currentVehicleId mostly)
  const [trips, setTrips] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>(MAINTENANCE_TASKS.map(t => ({ id: t.id, lastChecked: null, status: 'pending' })));
  const [docs, setDocs] = useState<Document[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [accidents, setAccidents] = useState<Accident[]>([]);

  // UI States
  const [modals, setModals] = useState({ trip: false, expense: false, scan: false, pro: false, doc: false, accident: false, resell: false, addVehicle: false });
  const [issueTarget, setIssueTarget] = useState<{id: string, name: string} | null>(null);

  // Load Data on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('autolog_user');
    const u = savedUser ? JSON.parse(savedUser) : null;
    setUser(u);
    
    if (!u) {
        loadDemoData();
    } else {
        loadDemoData(); // Fallback for prototype
    }
  }, []);

  // Demo Data Loader 
  const loadDemoData = () => {
    const dVehicles: Vehicle[] = [
        { id: 'v1', make: 'Toyota', model: 'Fortuner', regNumber: 'KA-01-MJ-2024', color: 'White', role: 'Owner', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
        { id: 'v2', make: 'Hyundai', model: 'Creta', regNumber: 'TN-09-AB-1234', color: 'Black', role: 'Owner', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' }
    ];
    setVehicles(dVehicles);
    setCurrentVehicleId('v1');

    setTrips([
      { id: 't1', date: '2023-12-01', startOdometer: 45000, endOdometer: 45150, distance: 150, type: 'Highway', notes: 'Weekend Trip' },
      { id: 't2', date: '2023-12-05', startOdometer: 45150, endOdometer: 45180, distance: 30, type: 'City', notes: 'Office' }
    ]);

    setExpenses([
      { id: 'e1', date: '2023-12-02', category: 'Fuel', amount: 2500, vendor: 'Shell', notes: 'Full Tank' },
      { id: 'e2', date: '2023-11-15', category: 'Service & Maintenance', amount: 5400, vendor: 'Toyota Service', notes: 'Annual Service', isVerified: true, lineItems: [{item: 'Oil', cost: 2000}, {item: 'Filter', cost: 400}, {item: 'Labor', cost: 3000}] }
    ]);

    setDocs([
        { id: 'doc1', type: 'Insurance', provider: 'HDFC Ergo', number: 'POL-998877', expiryDate: '2023-12-30' },
        { id: 'doc2', type: 'PUC', provider: 'Govt', number: 'PUC-1122', expiryDate: '2024-06-15' }
    ]);

    setFamily([
        { id: 'f1', name: 'Father', role: 'Admin', avatar: 'F' },
        { id: 'f2', name: 'Wife', role: 'Driver', avatar: 'W' }
    ]);

    setAccidents([
        { id: 'a1', date: '2022-06-10', location: 'City Center, Bangalore', description: 'Rear bumper scratch by bike', damageType: 'Minor', insuranceClaimed: false, cost: 2500, status: 'Fixed', photos: 2 }
    ]);

    const dTasks = tasks.map(t => {
      if(t.id === 'd1') return { ...t, status: 'issue', severity: 'critical', issueDetails: 'Low pressure left rear', lastChecked: '2023-12-06' };
      if(t.id === 'm1') return { ...t, status: 'ok', lastChecked: '2023-12-01' };
      return t;
    });
    setTasks(dTasks);
  };

  const lastOdometer = trips.length > 0 ? Math.max(...trips.map(t => t.endOdometer)) : 0;
  const totalSpent = expenses.reduce((a, b) => a + (b.amount || 0), 0);
  const currentVehicle = vehicles.find(v => v.id === currentVehicleId) || vehicles[0];

  const healthScore = useMemo(() => {
    let score = 100;
    const issues = tasks.filter(t => t.status === 'issue');
    const overdue = tasks.filter(t => t.status === 'pending').length;
    issues.forEach(i => score -= (i.severity === 'critical' ? 25 : i.severity === 'medium' ? 10 : 5));
    score -= (overdue * 2);
    return Math.max(0, score);
  }, [tasks]);

  // --- Views ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Overview for</span>
                <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 flex items-center gap-1">
                    {currentVehicle?.logo && <img src={currentVehicle.logo} className="w-3 h-3 object-contain"/>}
                    {currentVehicle?.regNumber}
                </span>
            </div>
        </div>
        {!user && <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">Guest Mode</span>}
      </div>

      {/* Health Score */}
      <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div>
              <h3 className="text-purple-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><Activity size={14}/> Vehicle Health Score</h3>
              <p className="text-slate-400 text-xs mt-1">Based on open issues & maintenance</p>
            </div>
            <span className={cn("text-3xl font-black", healthScore > 80 ? "text-emerald-400" : healthScore > 50 ? "text-yellow-400" : "text-red-400")}>{healthScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative z-10 mb-4">
            <div className={cn("h-full transition-all duration-1000", healthScore > 80 ? "bg-emerald-500" : healthScore > 50 ? "bg-yellow-500" : "bg-red-500")} style={{width: `${healthScore}%`}}></div>
          </div>
          <div className="absolute -right-10 -bottom-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

      {/* Alerts */}
      <div className="space-y-2">
         {docs.some(d => new Date(d.expiryDate) < new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)) && (
             <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><FileText size={16}/></div>
                     <div>
                         <p className="text-red-200 text-sm font-bold">Insurance Expiring Soon</p>
                         <p className="text-red-300/70 text-xs">Renew within 7 days to avoid penalty.</p>
                     </div>
                 </div>
                 <Button variant="danger" className="py-1 text-xs">Renew</Button>
             </div>
         )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Odometer" value={`${lastOdometer} km`} icon={<Gauge size={18}/>} color="blue" />
        <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign size={18}/>} color="emerald" />
        <StatCard label="Docs Active" value={`${docs.length}`} icon={<Shield size={18}/>} color="purple" />
        <StatCard label="Family" value={family.length + 1} icon={<Users size={18}/>} color="slate" />
      </div>

      {/* Quick Checks (Daily) */}
      <div className="space-y-2">
          <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2"><ClipboardCheck size={16} className="text-blue-400"/> Quick Checks (Daily)</h3>
              <button onClick={() => setActiveTab('maintenance')} className="text-xs text-blue-400">View All</button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800/50">
              {MAINTENANCE_TASKS.filter(def => def.frequency === 'Daily').map(def => {
                   const state = tasks.find(t => t.id === def.id);
                   return (
                     <div key={def.id} className={cn("p-3 flex items-center justify-between", state?.status === 'issue' ? 'bg-red-500/5' : 'hover:bg-slate-800/50')}>
                         <div className="flex-1">
                            <p className={cn("text-sm", state?.status === 'ok' ? 'text-slate-500 line-through' : state?.status === 'issue' ? 'text-red-400 font-bold' : 'text-slate-300')}>{def.label}</p>
                            {state?.status === 'issue' && <p className="text-xs text-red-400 mt-1">{state.issueDetails}</p>}
                         </div>
                         <div className="flex gap-2">
                            <button title="Mark OK" onClick={() => setTasks(tasks.map(t => t.id === def.id ? {...t, status: t.status === 'ok' ? 'pending' : 'ok', lastChecked: new Date().toISOString().split('T')[0]} : t))} className={cn("p-1.5 rounded-lg border transition-all", state?.status === 'ok' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-slate-500 hover:text-white hover:bg-slate-800')}><CheckCircle size={16}/></button>
                            <button title="Report Issue" onClick={() => setIssueTarget({id: def.id, name: def.label})} className={cn("p-1.5 rounded-lg border transition-all", state?.status === 'issue' ? 'bg-red-600 border-red-500 text-white' : 'border-slate-700 text-slate-500 hover:text-red-400 hover:bg-slate-800')}><AlertOctagon size={16}/></button>
                         </div>
                     </div>
                   )
               })}
          </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500 hover:bg-slate-800/50 cursor-pointer group transition-all" onClick={() => setModals({...modals, trip: true})}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500"><Plus size={18} /></div>
                 <div><h3 className="font-bold text-white">Log Trip</h3><p className="text-xs text-slate-400">Add new journey</p></div>
              </div>
              <Car className="text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-emerald-500 hover:bg-slate-800/50 cursor-pointer group transition-all" onClick={() => setModals({...modals, expense: true})}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <div className="bg-emerald-600/20 p-2 rounded-lg text-emerald-500"><Plus size={18} /></div>
                 <div><h3 className="font-bold text-white">Add Expense</h3><p className="text-xs text-slate-400">Fuel, Repair, etc.</p></div>
              </div>
              <DollarSign className="text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
        </Card>
      </div>
    </div>
  );

  const renderServiceHistory = () => (
      <div className="animate-in fade-in space-y-6">
           <div className="flex justify-between items-center">
              <div><h2 className="text-2xl font-bold text-white">Service Timeline</h2><p className="text-slate-400 text-sm">Maintenance & Repairs history</p></div>
              <Button onClick={() => setModals({...modals, scan: true})}><Camera size={16}/> Scan Bill</Button>
           </div>
           
           <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-800">
               {expenses.filter(e => e.category === 'Service & Maintenance' || e.category === 'Repairs').length === 0 && <p className="text-slate-500 italic pl-4">No service history records.</p>}
               
               {expenses.filter(e => e.category === 'Service & Maintenance' || e.category === 'Repairs')
                 .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                 .map(e => (
                   <div key={e.id} className="relative pl-6">
                       <div className={cn("absolute -left-[23px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-slate-950 z-10", e.category === 'Repairs' ? 'border-orange-500 text-orange-500' : 'border-blue-500 text-blue-500')}>
                           <Wrench size={12}/>
                       </div>
                       <Card className="p-4 hover:border-blue-500/50 transition-colors">
                           <div className="flex justify-between items-start">
                               <div>
                                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">{e.date}</p>
                                   <h3 className="font-bold text-white">{e.vendor}</h3>
                                   <p className="text-sm text-slate-400">{e.notes}</p>
                                   {e.isVerified && <span className="inline-flex items-center gap-1 mt-2 text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20"><FileCheck size={10}/> Verified by Autolog</span>}
                               </div>
                               <div className="text-right">
                                   <span className="block font-bold text-emerald-400 text-lg">₹{e.amount}</span>
                                   <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">{e.category}</span>
                               </div>
                           </div>
                           {e.lineItems && (
                               <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800">
                                   {e.lineItems.map((li:any, idx:number) => (
                                       <div key={idx} className="flex justify-between text-xs text-slate-400 mb-1">
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
      <div className="animate-in fade-in space-y-6">
          <div className="flex justify-between items-center">
              <div><h2 className="text-2xl font-bold text-white">Accident Log</h2><p className="text-slate-400 text-sm">Damage history & insurance claims</p></div>
              <Button variant="danger" onClick={() => setModals({...modals, accident: true})}><AlertOctagon size={16}/> Log Accident</Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
              {accidents.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                      <Shield size={48} className="mx-auto text-emerald-500 mb-2 opacity-50"/>
                      <h3 className="text-white font-bold">No Accidents Reported</h3>
                      <p className="text-slate-500 text-sm">Your vehicle history is clean.</p>
                  </div>
              )}
              {accidents.map(acc => (
                  <Card key={acc.id} className="p-0 overflow-hidden border-l-4 border-l-red-500">
                      <div className="p-4 bg-slate-900 flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{acc.date}</span>
                                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded uppercase", acc.damageType === 'Minor' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400')}>{acc.damageType}</span>
                              </div>
                              <h3 className="font-bold text-white text-lg">{acc.location}</h3>
                              <p className="text-sm text-slate-400 mt-1">{acc.description}</p>
                          </div>
                          <div className="text-right">
                               <p className="text-red-400 font-bold text-lg">₹{acc.cost}</p>
                               {acc.insuranceClaimed ? <span className="text-[10px] text-blue-400 flex items-center justify-end gap-1"><FileText size={10}/> Insurance Claimed</span> : <span className="text-[10px] text-slate-500">Out of Pocket</span>}
                          </div>
                      </div>
                      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-500">{acc.photos} Photos Attached</span>
                          <span className={cn("font-bold uppercase", acc.status === 'Fixed' ? 'text-emerald-500' : 'text-orange-500')}>{acc.status}</span>
                      </div>
                  </Card>
              ))}
          </div>
      </div>
  );

  const renderResale = () => (
      <div className="animate-in fade-in space-y-6">
          <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 border border-amber-500/20 rounded-xl p-6 text-center">
               <TrendingUp size={48} className="mx-auto text-amber-500 mb-2"/>
               <h2 className="text-2xl font-bold text-white">Resale Center</h2>
               <p className="text-amber-100/70 text-sm mb-6">Manage value & transfer ownership</p>
               
               <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                   <div className="bg-slate-900/50 p-3 rounded border border-amber-500/30">
                       <p className="text-xs text-amber-500 uppercase font-bold">Est. Market Value</p>
                       <p className="text-xl font-bold text-white">₹18.5L - 19.2L</p>
                   </div>
                   <div className="bg-slate-900/50 p-3 rounded border border-amber-500/30">
                       <p className="text-xs text-amber-500 uppercase font-bold">History Score</p>
                       <p className="text-xl font-bold text-white">Excellent</p>
                   </div>
               </div>

               <div className="flex gap-3 justify-center">
                   <Button variant="secondary" className="border-amber-500/30 text-amber-200 hover:text-white" onClick={() => alert("PDF Report Generated!")}><Download size={16}/> Download Report</Button>
                   <Button variant="gold" onClick={() => setModals({...modals, resell: true})}>Sell Car</Button>
               </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="p-4">
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><ClipboardList size={16} className="text-blue-500"/> Transfer Checklist</h3>
                   <div className="space-y-2 text-sm text-slate-400">
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-600"></div> Clear Insurance Dues</div>
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-600"></div> Get NOC from Bank (if Loan)</div>
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-600"></div> Original RC Smart Card</div>
                       <div className="flex gap-2"><div className="w-4 h-4 rounded-full border border-slate-600"></div> Both Keys</div>
                   </div>
               </Card>
               <Card className="p-4">
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><History size={16} className="text-purple-500"/> Ownership History</h3>
                   <div className="text-sm">
                       <div className="flex justify-between py-2 border-b border-slate-800">
                           <span className="text-white">Current Owner</span>
                           <span className="text-slate-400">Since Jan 2022</span>
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

  const renderDocuments = () => (
      <div className="animate-in fade-in space-y-6">
          <div className="flex justify-between items-center">
             <div><h2 className="text-2xl font-bold text-white">Documents</h2><p className="text-slate-400 text-sm">Insurance, Pollution & RC</p></div>
             <Button onClick={() => setModals({...modals, doc: true})}><Upload size={16}/> Upload</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.map(doc => {
                  const daysLeft = Math.ceil((new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  const isExpired = daysLeft < 0;
                  const isDue = daysLeft < 30;

                  return (
                      <Card key={doc.id} className="p-4 relative overflow-hidden">
                          <div className={cn("absolute top-0 left-0 w-1 h-full", isExpired ? "bg-red-500" : isDue ? "bg-yellow-500" : "bg-emerald-500")}></div>
                          <div className="flex justify-between items-start mb-4 pl-2">
                              <div>
                                  <p className="text-xs text-slate-500 uppercase font-bold">{doc.type}</p>
                                  <h3 className="text-white font-bold text-lg">{doc.provider}</h3>
                                  <p className="text-slate-400 font-mono text-sm">{doc.number}</p>
                              </div>
                              <div className={cn("px-2 py-1 rounded text-xs font-bold", isExpired ? "bg-red-500/20 text-red-400" : isDue ? "bg-yellow-500/20 text-yellow-400" : "bg-emerald-500/20 text-emerald-400")}>
                                  {isExpired ? "EXPIRED" : `${daysLeft} days left`}
                              </div>
                          </div>
                          <div className="flex gap-2 pl-2">
                              <Button variant="secondary" className="text-xs py-1 h-8 flex-1">View</Button>
                              {(isExpired || isDue) && <Button variant="primary" className="text-xs py-1 h-8 flex-1">Renew</Button>}
                          </div>
                      </Card>
                  )
              })}
              
              {/* Add New Placeholder */}
              <div onClick={() => setModals({...modals, doc: true})} className="border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-slate-600 hover:bg-slate-900/50 cursor-pointer transition-all">
                  <Plus size={32} className="mb-2 opacity-50"/>
                  <span className="text-sm font-bold">Add Document</span>
              </div>
          </div>
      </div>
  );

  const renderFamily = () => (
      <div className="animate-in fade-in space-y-6">
          <div className="flex justify-between items-center">
             <div><h2 className="text-2xl font-bold text-white">Family & Sharing</h2><p className="text-slate-400 text-sm">Manage who can view/drive this vehicle</p></div>
             <Button><UserPlus size={16}/> Invite</Button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {/* Owner */}
              <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">You</div>
                      <div>
                          <h4 className="font-bold text-white">{user?.name || 'Owner'}</h4>
                          <p className="text-xs text-slate-400">Primary Owner • Full Access</p>
                      </div>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">Admin</span>
              </div>
              
              {/* Family Members */}
              {family.map(mem => (
                   <div key={mem.id} className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">{mem.avatar}</div>
                       <div>
                           <h4 className="font-bold text-white">{mem.name}</h4>
                           <p className="text-xs text-slate-400">Family Member</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-3">
                       <select className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1 outline-none">
                           <option>{mem.role}</option>
                           <option>Viewer</option>
                           <option>Driver</option>
                       </select>
                       <button className="text-slate-600 hover:text-red-400"><Trash2 size={16}/></button>
                   </div>
               </div>
              ))}
          </div>
      </div>
  );

  const renderRSA = () => (
      <div className="animate-in fade-in space-y-6">
          <div className="bg-red-600 rounded-xl p-6 text-center shadow-lg shadow-red-900/50">
              <ShieldAlert size={48} className="mx-auto text-white/90 mb-2"/>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Emergency Mode</h2>
              <p className="text-red-100 text-sm mb-6">One-tap assistance for {currentVehicle?.regNumber}</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center gap-2 text-white font-mono mb-2">
                  <MapPin size={16}/> <span>12.9716° N, 77.5946° E</span>
              </div>
              <p className="text-xs text-red-200 opacity-75">Location auto-shared with service provider</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
              {RSA_SERVICES.map(svc => (
                  <Card key={svc.id} className="p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer border-slate-800" onClick={() => alert(`Connecting to ${svc.name} provider...`)}>
                      <div className={cn("p-3 rounded-full bg-slate-900 border", 
                          svc.color === 'red' ? 'text-red-500 border-red-500/30' : 
                          svc.color === 'orange' ? 'text-orange-500 border-orange-500/30' : 
                          svc.color === 'yellow' ? 'text-yellow-500 border-yellow-500/30' :
                          'text-blue-500 border-blue-500/30'
                      )}>
                          {svc.icon}
                      </div>
                      <span className="font-bold text-slate-200 text-sm">{svc.name}</span>
                  </Card>
              ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex">
      {/* Modals */}
      <AddTripModal isOpen={modals.trip} onClose={() => setModals({...modals, trip: false})} onSave={(d:any) => {
        const trip = { id: generateId(), ...d, distance: d.endOdometer - d.startOdometer };
        setTrips([trip, ...trips]); setModals({...modals, trip: false});
      }} lastOdometer={lastOdometer} />
      
      <AddExpenseModal isOpen={modals.expense} onClose={() => setModals({...modals, expense: false})} onSave={(d:any) => {
        setExpenses([{id: generateId(), ...d}, ...expenses]); setModals({...modals, expense: false});
      }} />
      
      <SmartScanModal isOpen={modals.scan} onClose={() => setModals({...modals, scan: false})} onSave={(d:any) => {
        setExpenses([{id: generateId(), ...d}, ...expenses]); 
      }} />

      <AddDocumentModal isOpen={modals.doc} onClose={() => setModals({...modals, doc: false})} onSave={(d:any) => {
          setDocs([...docs, {id: generateId(), ...d}]); setModals({...modals, doc: false});
      }} />

      <AddAccidentModal isOpen={modals.accident} onClose={() => setModals({...modals, accident: false})} onSave={(d:any) => {
          setAccidents([...accidents, {id: generateId(), ...d, status: 'Pending', photos: 1}]); setModals({...modals, accident: false});
      }} />
      
      <ResellFormModal isOpen={modals.resell} onClose={() => setModals({...modals, resell: false})} />

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

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
           <h1 className="font-bold text-xl text-white flex items-center gap-2 mb-4"><Car className="text-blue-500"/> AUTOLOG <span className="text-[10px] bg-purple-500 px-1 rounded text-white">PRO</span></h1>
           
           {/* Multi-Vehicle Switcher */}
           <div className="relative group">
               <button className="w-full bg-slate-950 border border-slate-700 hover:border-blue-500 rounded-lg p-3 flex items-center justify-between transition-all">
                   <div className="text-left flex items-center gap-3">
                       {currentVehicle?.logo ? (
                           <img src={currentVehicle.logo} alt="brand" className="w-8 h-8 object-contain" />
                       ) : (
                           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">{currentVehicle?.make[0]}</div>
                       )}
                       <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Current Vehicle</p>
                           <p className="text-sm font-bold text-white truncate w-24">{currentVehicle?.make} {currentVehicle?.model}</p>
                       </div>
                   </div>
                   <ChevronDown size={16} className="text-slate-500"/>
               </button>
               {/* Dropdown */}
               <div className="absolute top-full left-0 w-full bg-slate-900 border border-slate-700 rounded-lg mt-1 shadow-xl hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                   {vehicles.map(v => (
                       <div key={v.id} onClick={() => setCurrentVehicleId(v.id)} className="p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800/50 last:border-0">
                           <div className="flex items-center gap-2">
                               {v.logo ? <img src={v.logo} className="w-5 h-5 object-contain"/> : <Car size={16} className="text-slate-500"/>}
                               <span className={cn("text-sm", v.id === currentVehicleId ? "text-blue-400 font-bold" : "text-slate-300")}>{v.make} {v.model}</span>
                           </div>
                           {v.id === currentVehicleId && <Check size={14} className="text-blue-500"/>}
                       </div>
                   ))}
                   <div className="p-2 border-t border-slate-800">
                       <button onClick={() => setModals({...modals, addVehicle: true})} className="w-full text-xs text-center text-blue-400 py-1 font-bold hover:text-blue-300 flex items-center justify-center gap-1">+ Add Vehicle</button>
                   </div>
               </div>
           </div>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
           <p className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-2">Manage</p>
           <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
           <NavButton id="docs" icon={Shield} label="Documents" active={activeTab} set={setActiveTab} />
           <NavButton id="family" icon={Users} label="Family" active={activeTab} set={setActiveTab} />
           <NavButton id="resell" icon={TrendingUp} label="Resale Center" active={activeTab} set={setActiveTab} />
           
           <p className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-6">Track</p>
           <NavButton id="history" icon={History} label="Service History" active={activeTab} set={setActiveTab} />
           <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
           <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
           <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
           
           <p className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-6">Safety</p>
           <NavButton id="accidents" icon={FileWarning} label="Accident Log" active={activeTab} set={setActiveTab} />
           <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
           <NavButton id="rsa" icon={PhoneCall} label="Emergency / RSA" active={activeTab} set={setActiveTab} />
        </div>
        
        <div className="p-4 border-t border-slate-800">
             <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">{user?.name ? user.name[0] : 'G'}</div>
                   <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user?.name || 'Guest User'}</p>
                      <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1 rounded border border-purple-500/20">PRO Plan</span>
                   </div>
                </div>
                <button onClick={() => {setUser(null); localStorage.removeItem('autolog_user'); window.location.reload()}} className="text-xs text-red-400 flex items-center gap-1 hover:underline"><LogOut size={12}/> Sign Out</button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-8 min-h-screen pb-24 md:pb-8">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'docs' && renderDocuments()}
         {activeTab === 'family' && renderFamily()}
         {activeTab === 'rsa' && renderRSA()}
         {activeTab === 'history' && renderServiceHistory()}
         {activeTab === 'accidents' && renderAccidents()}
         {activeTab === 'resell' && renderResale()}

         {activeTab === 'logs' && (
           <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">Trip Logs</h2>
                 <Button onClick={() => setModals({...modals, trip: true})}><Plus size={16}/> Log Trip</Button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Odometer</th><th className="px-4 py-3 text-right">Distance</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {trips.map(t => (
                     <tr key={t.id}><td className="px-4 py-3">{t.date}</td><td className="px-4 py-3">{t.type}</td><td className="px-4 py-3 font-mono">{t.startOdometer}-{t.endOdometer}</td><td className="px-4 py-3 text-right text-white font-bold">{t.distance} km</td></tr>
                   ))}
                 </tbody>
               </table>
              </div>
           </div>
         )}

         {activeTab === 'expenses' && (
           <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">Expenses</h2>
                 <Button onClick={() => setModals({...modals, expense: true})}><Plus size={16}/> Add Expense</Button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3 text-right">Amount</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {expenses.map(e => (
                     <tr key={e.id}><td className="px-4 py-3">{e.date}</td><td className="px-4 py-3">{e.category}</td><td className="px-4 py-3">{e.vendor}</td><td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{e.amount}</td></tr>
                   ))}
                 </tbody>
               </table>
              </div>
           </div>
         )}
         
         {activeTab === 'warnings' && (
            <div className="animate-in fade-in space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Dashboard Warning Lights</h2>
                    <p className="text-slate-400 text-sm">Quick reference guide for dashboard symbols.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {WARNING_LIGHTS_DATA.map(light => <WarningLightCard key={light.id} light={light} />)}
                </div>
            </div>
        )}

         {activeTab === 'maintenance' && (
           <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white">Maintenance Checklist</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {['Daily', 'Monthly', 'Yearly'].map(freq => (
                   <Card key={freq} className="p-0 border-t-4 border-t-blue-500 h-fit">
                      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                         <h3 className="font-bold text-white">{freq} Checks</h3>
                         <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{tasks.filter(t => MAINTENANCE_TASKS.find(def => def.id === t.id)?.frequency === freq && t.status === 'ok').length} / {MAINTENANCE_TASKS.filter(def => def.frequency === freq).length}</span>
                      </div>
                      <div className="divide-y divide-slate-800/50">
                         {MAINTENANCE_TASKS.filter(def => def.frequency === freq).map(def => {
                           const state = tasks.find(t => t.id === def.id);
                           return (
                             <div key={def.id} className={cn("p-3 flex items-center justify-between", state?.status === 'issue' ? 'bg-red-500/5' : 'hover:bg-slate-800/50')}>
                                 <div>
                                    <p className={cn("text-sm", state?.status === 'ok' ? 'text-slate-500 line-through' : state?.status === 'issue' ? 'text-red-400 font-bold' : 'text-slate-300')}>{def.label}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">{def.category}</p>
                                    {state?.status === 'issue' && <p className="text-xs text-red-400 mt-1">Issue: {state.issueDetails}</p>}
                                 </div>
                                 <div className="flex gap-2">
                                    <button title="Mark OK" onClick={() => setTasks(tasks.map(t => t.id === def.id ? {...t, status: t.status === 'ok' ? 'pending' : 'ok', lastChecked: new Date().toISOString().split('T')[0]} : t))} className={cn("p-1 rounded border", state?.status === 'ok' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-slate-500')}><CheckCircle size={14}/></button>
                                    <button title="Report Issue" onClick={() => setIssueTarget({id: def.id, name: def.label})} className={cn("p-1 rounded border", state?.status === 'issue' ? 'bg-red-600 border-red-500 text-white' : 'border-slate-700 text-slate-500')}><AlertOctagon size={14}/></button>
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

      {/* Auth Overlay */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-sm p-8 text-center">
             <h2 className="text-xl font-bold text-white mb-2">Welcome to Autolog</h2>
             <p className="text-slate-400 text-sm mb-6">Sign in to save your vehicle history.</p>
             <Button className="w-full mb-3" onClick={() => {
                 const u = {id: generateId(), name: 'User', mobile: '9999999999', isPro: false};
                 setUser(u); localStorage.setItem('autolog_user', JSON.stringify(u)); setShowAuth(false);
             }}>Sign In / Register</Button>
             <button onClick={() => { loadDemoData(); setShowAuth(false); }} className="text-sm text-blue-400 hover:underline">Try Demo Mode (Pro Features)</button>
             <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-slate-500"><X size={20}/></button>
           </Card>
        </div>
      )}
    </div>
  );
}
