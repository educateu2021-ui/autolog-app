import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings, 
  Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge, 
  DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info, 
  Shield, CheckCircle, Search, X, LogIn, 
  AlertOctagon, Camera, Clock, Upload, Calendar, AlertCircle,
  MoreVertical, FileCheck, PenTool, Layers, Download, Sparkles, MessageSquare, Bot, Send, 
  HelpCircle, ArrowRight
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

// --- Gemini API Integration ---
const apiKey = ""; // API Key provided by execution environment

async function callGemini(prompt: string) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Service temporarily unavailable. Please check your connection or try again later.";
  }
}

// --- Data Constants ---

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

const WALKTHROUGH_STEPS = [
  { 
    title: "Welcome to Autolog", 
    desc: "Your intelligent vehicle companion. Track expenses, maintenance, and health scores in one place. Let's show you around.", 
    targetTab: 'dashboard' 
  },
  { 
    title: "Your Dashboard", 
    desc: "This is your command center. Check your Odometer, Total Spend, and Vehicle Health Score at a glance. Use the Quick Action cards to log trips or expenses instantly.", 
    targetTab: 'dashboard' 
  },
  { 
    title: "Maintenance & Health", 
    desc: "Never miss a check-up. Use the Daily, Monthly, and Yearly checklists. Mark items as 'OK' or 'Report Issue' to update your Vehicle Health Score.", 
    targetTab: 'maintenance' 
  },
  { 
    title: "AI Mechanic", 
    desc: "Got a weird noise or dashboard light? Chat with our AI Mechanic to diagnose issues instantly before visiting a garage.", 
    targetTab: 'ai_mechanic' 
  },
  { 
    title: "Service History", 
    desc: "Keep a permanent digital record of every service. Upload bills, let our Smart Scanner extract the details, and maintain your car's resale value.", 
    targetTab: 'history' 
  },
  { 
    title: "Ready to Drive?", 
    desc: "That's it! We've loaded some demo data for you to explore. Sign up whenever you're ready to save your own vehicle history.", 
    targetTab: 'dashboard' 
  }
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
};

type IssueSeverity = 'low' | 'medium' | 'critical';

type MaintenanceTaskState = {
  id: string;
  lastChecked: string | null;
  status: 'pending' | 'ok' | 'issue';
  issueDetails?: string;
  severity?: IssueSeverity;
  estimatedCost?: number;
};

type VehicleProfile = {
  make: string;
  model: string;
  variant: string;
  regNumber: string;
  vin: string;
  purchaseDate: string;
  fuelType: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
};

// --- Shared UI Components ---

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={cn("bg-slate-900 border border-slate-800 rounded-xl shadow-sm", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30",
    pro: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40",
    ai: "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white shadow-lg shadow-teal-500/30",
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
    <input {...props} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600 text-sm" />
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

const NavButton = ({ id, icon: Icon, label, active, set, isAi = false }: any) => (
  <button 
    onClick={() => set(id)} 
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all", 
      active === id 
        ? isAi ? 'bg-teal-600/20 text-teal-400 border border-teal-600/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : isAi ? 'text-teal-400 hover:bg-teal-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
      active === id 
        ? id === 'ai_mechanic' ? 'text-teal-400 bg-teal-500/10' : 'text-blue-400 bg-blue-500/10' 
        : 'text-slate-500'
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

// --- Modals (Defined OUTSIDE to fix focus bugs) ---

const AuthModal = ({ isOpen, onClose, onLogin, onLoadDemo }: any) => {
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [data, setData] = useState({ email: '', mobile: '', otp: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateAndSendOTP = () => {
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(data.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!mobileRegex.test(data.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setStep('otp');
    // Simulate OTP
    setTimeout(() => alert(`Your OTP is 1234`), 500);
  };

  const verifyOTP = () => {
    if (data.otp === '1234') {
        const generatedUser = { 
            id: generateId(), 
            name: data.email.split('@')[0], 
            mobile: data.mobile, 
            isPro: false 
        };
        onLogin(generatedUser);
    } else {
        setError('Invalid OTP. Please enter 1234.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
       <Card className="w-full max-w-sm p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
          
          <div className="mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
               <Car className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Welcome to Autolog</h2>
            <p className="text-slate-400 text-xs mt-1">Sign in to sync your vehicle data</p>
          </div>

          {step === 'input' ? (
              <div className="space-y-4">
                  <Input 
                    label="Email Address" 
                    placeholder="user@example.com" 
                    value={data.email} 
                    onChange={(e:any) => setData({...data, email: e.target.value})} 
                  />
                  <Input 
                    label="Mobile Number" 
                    placeholder="9876543210" 
                    type="tel"
                    value={data.mobile} 
                    onChange={(e:any) => setData({...data, mobile: e.target.value})} 
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <Button className="w-full" onClick={validateAndSendOTP}>Get OTP</Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or</span></div>
                  </div>
                  <button onClick={() => { onLoadDemo(); onClose(); }} className="text-sm text-blue-400 hover:underline w-full">Try Demo Mode</button>
              </div>
          ) : (
              <div className="space-y-4 animate-in slide-in-from-right">
                  <p className="text-sm text-slate-300">Enter the code sent to <br/><span className="text-white font-mono">{data.mobile}</span></p>
                  <Input 
                    label="One Time Password" 
                    placeholder="1234" 
                    className="text-center tracking-[0.5em] font-mono text-lg"
                    maxLength={4}
                    value={data.otp} 
                    onChange={(e:any) => setData({...data, otp: e.target.value})} 
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <Button className="w-full" onClick={verifyOTP}>Verify & Login</Button>
                  <button onClick={() => setStep('input')} className="text-xs text-slate-500 hover:text-white">Change details</button>
              </div>
          )}
       </Card>
    </div>
  );
};

const WalkthroughModal = ({ stepIndex, onNext, onSkip }: any) => {
  const step = WALKTHROUGH_STEPS[stepIndex];
  if (!step) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in slide-in-from-bottom-10 fade-in duration-500 pointer-events-none">
      <div className="bg-slate-900/95 backdrop-blur border border-blue-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative shadow-black/50 pointer-events-auto ring-1 ring-blue-500/20">
        <div className="flex justify-between items-start mb-4">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold">{stepIndex + 1}</span>
           </div>
           <button onClick={onSkip} className="text-slate-500 hover:text-white text-xs">Skip Tour</button>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{step.desc}</p>
        
        <div className="flex justify-between items-center">
           <div className="flex gap-1">
              {WALKTHROUGH_STEPS.map((_, i) => (
                 <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === stepIndex ? "bg-blue-500 w-4" : "bg-slate-700")} />
              ))}
           </div>
           <Button onClick={onNext} className="gap-2">
              {stepIndex === WALKTHROUGH_STEPS.length - 1 ? "Get Started" : "Next"} <ArrowRight size={16}/>
           </Button>
        </div>
      </div>
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
          <div className="border-dashed border-2 border-slate-700 p-4 rounded-lg text-center cursor-pointer hover:border-purple-500 transition-colors">
            <Camera className="mx-auto text-slate-500 mb-2" />
            <p className="text-xs text-slate-400">Upload Photo (Pro)</p>
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

// --- Main App Component ---

export default function AutologApp() {
  const [user, setUser] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  
  // Data State - Initialized safely
  const [trips, setTrips] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>(MAINTENANCE_TASKS.map(t => ({ id: t.id, lastChecked: null, status: 'pending' })));
  const [profile, setProfile] = useState<any>({ make: '', model: '', variant: '', regNumber: '', vin: '', purchaseDate: '', fuelType: 'Petrol' });

  // UI States
  const [modals, setModals] = useState({ trip: false, expense: false, scan: false, pro: false });
  const [issueTarget, setIssueTarget] = useState<{id: string, name: string} | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: "Hello! I'm your AI Mechanic. Ask me about car issues, dashboard lights, or maintenance tips.", timestamp: Date.now() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Load Data on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('autolog_user');
    const u = savedUser ? JSON.parse(savedUser) : null;
    setUser(u);
    
    // Check Walkthrough Status
    const tourCompleted = localStorage.getItem('autolog_tour_completed');
    if (!u && !tourCompleted) {
        // First time guest -> Start tour and load demo data
        loadDemoData(); 
        setWalkthroughStep(1); // Start tour at step 1
    }
    
    // If no user/data found, check for Guest data or load defaults
    const uid = u ? u.id : 'guest';
    const p = `autolog_${uid}`;
    
    const savedTrips = localStorage.getItem(`${p}_trips`);
    if (savedTrips) {
        loadData(uid);
    } 
  }, []);

  const loadData = (uid: string) => {
    const p = `autolog_${uid}`;
    try {
      const savedTrips = JSON.parse(localStorage.getItem(`${p}_trips`) || '[]');
      const savedExpenses = JSON.parse(localStorage.getItem(`${p}_expenses`) || '[]');
      const savedTasks = JSON.parse(localStorage.getItem(`${p}_tasks`) || 'null');
      const savedProfile = JSON.parse(localStorage.getItem(`${p}_profile`) || 'null');

      setTrips(savedTrips);
      setExpenses(savedExpenses);
      if(savedTasks) setTasks(savedTasks);
      if(savedProfile) setProfile(savedProfile);
    } catch (e) {
      console.error("Data load error", e);
    }
  };

  const saveData = () => {
    const uid = user ? user.id : 'guest';
    const p = `autolog_${uid}`;
    localStorage.setItem(`${p}_trips`, JSON.stringify(trips));
    localStorage.setItem(`${p}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${p}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${p}_profile`, JSON.stringify(profile));
  };

  // Auto-save when state changes
  useEffect(() => { saveData(); }, [trips, expenses, tasks, profile]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Demo Data Loader (Called automatically for new guests)
  const loadDemoData = () => {
    // Note: We don't set a 'user' object here so it stays in Guest Mode, but with data
    const dTrips = [
      { id: 't1', date: '2023-12-01', startOdometer: 45000, endOdometer: 45150, distance: 150, type: 'Highway', notes: 'Weekend Trip' },
      { id: 't2', date: '2023-12-05', startOdometer: 45150, endOdometer: 45180, distance: 30, type: 'City', notes: 'Office' }
    ];
    setTrips(dTrips);

    const dExpenses = [
      { id: 'e1', date: '2023-12-02', category: 'Fuel', amount: 2500, vendor: 'Shell', notes: 'Full Tank' },
      { id: 'e2', date: '2023-11-15', category: 'Service & Maintenance', amount: 5400, vendor: 'Toyota Service', notes: 'Annual Service', isVerified: true, lineItems: [{item: 'Oil', cost: 2000}, {item: 'Filter', cost: 400}, {item: 'Labor', cost: 3000}] }
    ];
    setExpenses(dExpenses);

    const dTasks = tasks.map(t => {
      if(t.id === 'd1') return { ...t, status: 'issue', severity: 'critical', issueDetails: 'Low pressure left rear', lastChecked: '2023-12-06' };
      if(t.id === 'm1') return { ...t, status: 'ok', lastChecked: '2023-12-01' };
      return t;
    });
    setTasks(dTasks);

    setProfile({ make: 'Toyota', model: 'Fortuner', variant: 'Legender', regNumber: 'KA-01-MJ-2024', vin: 'SAMPLEVIN123', purchaseDate: '2022-01-15', fuelType: 'Diesel' });
  };

  // Walkthrough Navigation
  const handleWalkthroughNext = () => {
      if (walkthroughStep < WALKTHROUGH_STEPS.length) {
          const next = walkthroughStep + 1;
          setWalkthroughStep(next);
          setActiveTab(WALKTHROUGH_STEPS[next-1].targetTab);
      } else {
          // Finish
          setWalkthroughStep(0);
          localStorage.setItem('autolog_tour_completed', 'true');
          setActiveTab('dashboard');
      }
  };

  // Export Mock
  const handleExport = () => {
      alert("Pro Feature: Report downloaded successfully!");
  };

  // Safe Math
  const lastOdometer = trips.length > 0 ? Math.max(...trips.map(t => t.endOdometer)) : 0;
  const totalDist = trips.reduce((a, b) => a + (b.distance || 0), 0);
  const totalSpent = expenses.reduce((a, b) => a + (b.amount || 0), 0);

  // Health Score (Safe)
  const healthScore = useMemo(() => {
    let score = 100;
    const issues = tasks.filter(t => t.status === 'issue');
    const overdue = tasks.filter(t => t.status === 'pending').length;
    issues.forEach(i => score -= (i.severity === 'critical' ? 25 : i.severity === 'medium' ? 10 : 5));
    score -= (overdue * 2);
    return Math.max(0, score);
  }, [tasks]);

  // Service Prediction (Safe)
  const servicePrediction = useMemo(() => {
    const kmUntilService = 10000 - (lastOdometer % 10000);
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default +30 days
    return { date: date.toDateString(), km: lastOdometer + kmUntilService };
  }, [lastOdometer]);

  // --- Gemini Functions ---

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { id: generateId(), role: 'user' as const, text: chatInput, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    const prompt = `You are an expert car mechanic AI assistant. 
    Context: The user drives a ${profile.make} ${profile.model} (${profile.fuelType}). 
    They have a health score of ${healthScore}% and last service was predicted at ${servicePrediction.km} km.
    User Question: ${userMsg.text}
    Provide a helpful, concise answer.`;

    const aiResponseText = await callGemini(prompt);
    
    const aiMsg = { id: generateId(), role: 'assistant' as const, text: aiResponseText, timestamp: Date.now() };
    setChatMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const analyzeExpenses = async () => {
    if (expenses.length === 0) {
      alert("No expenses to analyze yet!");
      return;
    }
    const prompt = `Analyze these car expenses and provide 3 short bullet points on spending trends and one tip to save money. 
    Expenses: ${JSON.stringify(expenses.map(e => ({ cat: e.category, amt: e.amount, date: e.date })))}`;
    
    const analysis = await callGemini(prompt);
    alert(analysis); // Simple alert for now, could be a modal
  };

  // --- Renderers ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
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
          
          {/* Part Life Bars */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-3 relative z-10">
             {['Engine Oil', 'Brake Pads', 'Tyres'].map((part, i) => {
               const max = i === 0 ? 10000 : i === 1 ? 25000 : 40000;
               const current = lastOdometer % max;
               const left = max - current;
               const pct = (left / max) * 100;
               return (
                 <div key={part}>
                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{part}</p>
                   <div className="h-1 bg-slate-800 rounded-full mb-1"><div className="h-full bg-blue-500 rounded-full" style={{width: `${pct}%`}}></div></div>
                   <p className="text-[10px] text-slate-300">{Math.floor(left/1000)}k km left</p>
                 </div>
               )
             })}
          </div>
          <div className="absolute -right-10 -bottom-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

      {/* Critical Alerts */}
      {tasks.some(t => t.status === 'issue') && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
           <h3 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-2"><AlertOctagon size={16}/> Attention Needed</h3>
           <div className="space-y-2">
             {tasks.filter(t => t.status === 'issue').map(t => (
               <div key={t.id} className="flex justify-between items-center text-sm bg-red-500/5 p-2 rounded border border-red-500/10">
                 <span className="text-red-200">{MAINTENANCE_TASKS.find(def => def.id === t.id)?.label}</span>
                 <div className="flex items-center gap-2">
                   <span className={cn("text-[10px] px-1.5 py-0.5 rounded uppercase font-bold", t.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black')}>{t.severity}</span>
                   <button onClick={() => setIssueTarget({id: t.id, name: ''})} className="text-xs underline text-red-300">Update</button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Odometer" value={`${lastOdometer} km`} icon={<Gauge size={18}/>} color="blue" />
        <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign size={18}/>} color="emerald" />
        <StatCard label="Trips" value={trips.length} icon={<Car size={18}/>} color="purple" />
        <StatCard label="Vehicle" value={profile.regNumber || 'N/A'} icon={<FileText size={18}/>} color="slate" />
      </div>

      {/* Quick Actions (Updated with Icon and Details) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500 hover:bg-slate-800/50 cursor-pointer group transition-all" onClick={() => setModals({...modals, trip: true})}>
           <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2">
                <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500"><Plus size={18} /></div>
                <div><h3 className="font-bold text-white">Log Trip</h3><p className="text-xs text-slate-400">Add new journey</p></div>
             </div>
             <Car className="text-blue-500 group-hover:scale-110 transition-transform" />
           </div>
           <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">Last Odo</span>
              <span className="text-sm font-mono font-bold text-white">{lastOdometer} km</span>
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
           <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">Total Spent</span>
              <span className="text-sm font-mono font-bold text-emerald-400">₹{totalSpent.toLocaleString()}</span>
           </div>
        </Card>
      </div>

      {/* Service Prediction */}
      <Card className="p-4 bg-gradient-to-r from-slate-900 to-slate-800/50 border border-slate-700">
         <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg"><Clock size={20} className="text-orange-400"/></div>
            <div>
               <h3 className="text-white font-bold text-sm">Next Service Forecast</h3>
               <p className="text-xs text-slate-400">Estimated based on your driving habits</p>
            </div>
         </div>
         <div className="flex justify-between items-center text-sm bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-slate-400">Due Date: <b className="text-white">{servicePrediction.date}</b></span>
            <span className="text-slate-400">at <b className="text-white">{servicePrediction.km} km</b></span>
         </div>
      </Card>
    </div>
  );

  const renderServiceHistory = () => (
    <div className="animate-in fade-in space-y-6">
       <div className="flex justify-between items-end">
          <div><h2 className="text-2xl font-bold text-white">Service History</h2><p className="text-slate-400 text-sm">Timeline of maintenance events</p></div>
          <Button variant="pro" onClick={() => setModals({...modals, scan: true})}><Camera size={16} className="mr-2"/> Scan Bill</Button>
       </div>
       
       <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
          {expenses.filter(e => e.category.includes('Service')).length === 0 && <p className="text-slate-500 italic">No service records found.</p>}
          
          {expenses.filter(e => e.category.includes('Service')).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
            <div key={e.id} className="relative">
               <div className="absolute -left-[39px] w-8 h-8 bg-slate-900 border-2 border-purple-500 rounded-full flex items-center justify-center z-10">
                  <Wrench size={14} className="text-purple-400" />
               </div>
               <Card className="p-4">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <h4 className="font-bold text-white">{e.vendor || 'Unknown Garage'}</h4>
                        <p className="text-xs text-slate-500">{e.date}</p>
                     </div>
                     <span className="font-bold text-emerald-400">₹{e.amount}</span>
                  </div>
                  {e.lineItems && (
                    <div className="mt-3 border-t border-slate-800 pt-2 space-y-1">
                       {e.lineItems.map((item:any, i:number) => (
                         <div key={i} className="flex justify-between text-xs text-slate-400"><span>{item.item}</span><span>{item.cost}</span></div>
                       ))}
                    </div>
                  )}
                  {e.isVerified && <div className="mt-2 inline-flex items-center gap-1 text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded"><FileCheck size={10}/> Verified Bill</div>}
               </Card>
            </div>
          ))}
       </div>
    </div>
  );

  // --- Render AI Mechanic ---
  const renderAIMechanic = () => (
    <div className="animate-in fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-teal-500/20 p-2 rounded-lg text-teal-400"><Sparkles size={24}/></div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Mechanic</h2>
          <p className="text-slate-400 text-sm">Powered by Gemini • Ask anything about your car</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-y-auto space-y-4 mb-4">
        {chatMessages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-blue-600" : "bg-teal-600")}>
              {msg.role === 'user' ? <User size={16} className="text-white"/> : <Bot size={16} className="text-white"/>}
            </div>
            <div className={cn("max-w-[80%] p-3 rounded-xl text-sm", msg.role === 'user' ? "bg-blue-600/20 text-blue-100 border border-blue-600/30" : "bg-slate-800 text-slate-200 border border-slate-700")}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0"><Bot size={16} className="text-white"/></div>
             <div className="bg-slate-800 p-3 rounded-xl text-sm text-slate-400 border border-slate-700 animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input 
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-600"
          placeholder="e.g., 'What does code P0300 mean?' or 'Why do my brakes squeak?'"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button variant="ai" onClick={handleSendMessage} disabled={isTyping || !chatInput.trim()}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex">
      {/* Walkthrough Overlay */}
      {walkthroughStep > 0 && (
          <WalkthroughModal 
              stepIndex={walkthroughStep - 1} 
              onNext={handleWalkthroughNext} 
              onSkip={() => { setWalkthroughStep(0); localStorage.setItem('autolog_tour_completed', 'true'); setActiveTab('dashboard'); }}
          />
      )}

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

      <IssueReportModal isOpen={!!issueTarget} taskName={issueTarget ? MAINTENANCE_TASKS.find(t => t.id === issueTarget.id)?.label : ''} onClose={() => setIssueTarget(null)} onSave={(d:any) => {
        if(issueTarget) {
           setTasks(tasks.map(t => t.id === issueTarget.id ? { ...t, status: 'issue', severity: d.severity, issueDetails: d.description, estimatedCost: d.cost, lastChecked: new Date().toISOString().split('T')[0] } : t));
           setIssueTarget(null);
        }
      }} />

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLogin={(u: any) => { setUser(u); localStorage.setItem('autolog_user', JSON.stringify(u)); setShowAuth(false); }}
        onLoadDemo={() => { loadDemoData(); setShowAuth(false); }}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Car className="text-white"/></div>
           <div><h1 className="font-bold text-xl text-white">AUTOLOG</h1><p className="text-xs text-slate-500">Pro Edition</p></div>
        </div>
        <div className="flex-1 p-4 space-y-1">
           <p className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-4">Menu</p>
           <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
           <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
           <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
           <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
           <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
           <NavButton id="history" icon={Clock} label="Service History" active={activeTab} set={setActiveTab} />
           
           <div className="h-4"></div>
           <p className="text-xs font-bold text-teal-600 uppercase px-4 mb-2 mt-4 flex items-center gap-1"><Sparkles size={10}/> AI Tools</p>
           <NavButton id="ai_mechanic" icon={MessageSquare} label="AI Mechanic" active={activeTab} set={setActiveTab} isAi={true} />

           <div className="h-4"></div>
           <NavButton id="export" icon={Download} label="Export Data" active={activeTab} set={() => user?.isPro ? handleExport() : setModals({...modals, pro: true})} />
           <NavButton id="profile" icon={Settings} label="Vehicle Profile" active={activeTab} set={setActiveTab} />
        </div>
        <div className="p-4 border-t border-slate-800">
           {user ? (
             <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">{user.name[0]}</div>
                   <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      {user.isPro && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1 rounded border border-purple-500/20">PRO User</span>}
                   </div>
                </div>
                <button onClick={() => {setUser(null); localStorage.removeItem('autolog_user'); window.location.reload()}} className="text-xs text-red-400 flex items-center gap-1 hover:underline"><LogOut size={12}/> Sign Out</button>
             </div>
           ) : (
             <Button className="w-full" onClick={() => setShowAuth(true)}>Sign In</Button>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-8 min-h-screen pb-24 md:pb-8">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'history' && renderServiceHistory()}
         {activeTab === 'ai_mechanic' && renderAIMechanic()}
         
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
                   {trips.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No trips logged.</td></tr> : trips.map(t => (
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
                 <div className="flex gap-2">
                    <Button variant="ai" onClick={analyzeExpenses}><Sparkles size={16} className="mr-1" /> Analyze</Button>
                    <Button onClick={() => setModals({...modals, expense: true})}><Plus size={16}/> Add Expense</Button>
                 </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3 text-right">Amount</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {expenses.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No expenses logged.</td></tr> : expenses.map(e => (
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

         {activeTab === 'profile' && (
           <Card className="p-8 max-w-2xl mx-auto animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Vehicle Profile</h2>
                 <Button variant="ghost" onClick={() => { localStorage.removeItem('autolog_tour_completed'); setWalkthroughStep(1); }} className="text-xs"><HelpCircle size={14} className="mr-1"/> Restart Tour</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Make" value={profile.make} onChange={(e:any) => setProfile({...profile, make: e.target.value})} />
                 <Input label="Model" value={profile.model} onChange={(e:any) => setProfile({...profile, model: e.target.value})} />
                 <Input label="Reg Number" value={profile.regNumber} onChange={(e:any) => setProfile({...profile, regNumber: e.target.value})} />
                 <Input label="VIN" value={profile.vin} onChange={(e:any) => setProfile({...profile, vin: e.target.value})} />
                 <Input label="Fuel Type" value={profile.fuelType} onChange={(e:any) => setProfile({...profile, fuelType: e.target.value})} />
              </div>
              <Button className="mt-4" onClick={saveData}>Save Changes</Button>
           </Card>
         )}
      </main>

      {/* Mobile Bottom Nav (Updated) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur border-t border-slate-800 flex justify-around p-2 pb-4 z-20">
        <MobileNavBtn id="dashboard" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
        <MobileNavBtn id="logs" icon={FileText} active={activeTab} set={setActiveTab} />
        <MobileNavBtn id="expenses" icon={DollarSign} active={activeTab} set={setActiveTab} />
        <MobileNavBtn id="ai_mechanic" icon={Sparkles} active={activeTab} set={setActiveTab} />
      </div>
      
      {/* Pro Upsell Modal */}
      {modals.pro && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-md p-0 overflow-hidden border-purple-500/50">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 text-center">
                 <Shield size={48} className="mx-auto text-white mb-4 opacity-80"/>
                 <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                 <p className="text-purple-200 text-sm">Unlock advanced fleet-level tools</p>
              </div>
              <div className="p-6 space-y-3">
                 <div className="flex gap-3 text-slate-300 text-sm"><CheckCircle size={16} className="text-purple-400"/> Smart Bill Scanning & OCR</div>
                 <div className="flex gap-3 text-slate-300 text-sm"><CheckCircle size={16} className="text-purple-400"/> Vehicle Health Score Algorithm</div>
                 <div className="flex gap-3 text-slate-300 text-sm"><CheckCircle size={16} className="text-purple-400"/> Critical Issue Tracking</div>
                 <Button variant="pro" className="w-full mt-4" onClick={() => {
                    if(user) { setUser({...user, isPro: true}); setModals({...modals, pro: false}); alert("Pro Activated!"); }
                    else setShowAuth(true);
                 }}>Get Pro - ₹499/yr</Button>
                 <button onClick={() => setModals({...modals, pro: false})} className="w-full text-center text-xs text-slate-500 mt-2">Close</button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
