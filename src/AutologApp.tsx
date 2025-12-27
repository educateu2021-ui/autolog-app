import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings, 
  Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge, 
  DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info, 
  User, Smartphone, Mail, Lock, Shield, CreditCard, Users, 
  TrendingUp, CheckCircle, Search, RefreshCw, X, LogIn, 
  AlertCircle, Battery, Fan, Layers, Calendar, Smile, Meh, Frown,
  Upload, Camera, FileCheck, Clock, AlertOctagon
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

const EXPENSE_CATEGORIES = [
  'Fuel', 'Toll', 'Parking', 'Car Wash', 'Service & Maintenance', 
  'Repairs', 'Insurance', 'Fines/Challan', 'Accessories', 
  'Tuning/Mods', 'EMI', 'Tyres', 'Other'
];

const TRIP_TYPES = ['City', 'Highway', 'Office Commute', 'Personal', 'Road Trip', 'Off-Road'];

const MAINTENANCE_TASKS = [
  { id: 'd1', label: 'Check Tyre Pressure', frequency: 'Daily', category: 'Safety' },
  { id: 'd2', label: 'Check Warning Lights', frequency: 'Daily', category: 'Electronics' },
  { id: 'd3', label: 'Visual Body Inspection', frequency: 'Daily', category: 'Exterior' },
  { id: 'm1', label: 'Check Engine Oil Level', frequency: 'Monthly', category: 'Engine' },
  { id: 'm2', label: 'Check Coolant Level', frequency: 'Monthly', category: 'Engine' },
  { id: 'm3', label: 'Check Brake Fluid', frequency: 'Monthly', category: 'Safety' },
  { id: 'm4', label: 'Check Wiper Fluid', frequency: 'Monthly', category: 'Exterior' },
  { id: 'm5', label: 'Check Lights (Head/Tail)', frequency: 'Monthly', category: 'Electronics' },
  { id: 'm6', label: 'Inspect Battery Terminals', frequency: 'Monthly', category: 'Electronics' },
  { id: 'y1', label: 'Full Annual Service', frequency: 'Yearly', category: 'General' },
  { id: 'y2', label: 'Rotate Tyres', frequency: 'Yearly', category: 'Tyres' },
  { id: 'y3', label: 'Wheel Alignment & Balancing', frequency: 'Yearly', category: 'Tyres' },
  { id: 'y4', label: 'Replace Cabin Air Filter', frequency: 'Yearly', category: 'Interior' },
  { id: 'y5', label: 'Check Insurance Expiry', frequency: 'Yearly', category: 'Admin' },
  { id: 'y6', label: 'Emission (PUC) Test', frequency: 'Yearly', category: 'Admin' },
];

const WARNING_LIGHTS_DATA = [
  { id: 1, name: 'Check Engine', icon: <Activity className="text-yellow-500" />, severity: 'Warning', desc: 'Engine issue. Safe to drive short distance, but check soon.', action: 'Visit Garage' },
  { id: 2, name: 'Oil Pressure', icon: <Droplet className="text-red-500" />, severity: 'Critical', desc: 'Low oil pressure. Engine damage imminent.', action: 'STOP IMMEDIATELY' },
  { id: 3, name: 'Battery Alert', icon: <Zap className="text-red-500" />, severity: 'Critical', desc: 'Alternator/Battery failure. Car will die soon.', action: 'Turn off AC/Radio' },
  { id: 4, name: 'Engine Temp', icon: <Thermometer className="text-red-500" />, severity: 'Critical', desc: 'Overheating. Continued driving will crack the block.', action: 'Stop & Cool Down' },
  { id: 5, name: 'ABS Warning', icon: <Disc className="text-yellow-500" />, severity: 'Warning', desc: 'Anti-lock Brakes disabled. Normal brakes still work.', action: 'Drive Carefully' },
  { id: 6, name: 'TPMS', icon: <Gauge className="text-yellow-500" />, severity: 'Info', desc: 'Low tyre pressure detected.', action: 'Inflate Tyres' },
  { id: 7, name: 'Airbag (SRS)', icon: <Shield className="text-red-500" />, severity: 'Critical', desc: 'Airbags may not deploy in a crash.', action: 'Service Immediately' },
  { id: 8, name: 'Traction Control', icon: <Car className="text-yellow-500" />, severity: 'Warning', desc: 'Traction control active or disabled.', action: 'Drive Carefully' },
  { id: 9, name: 'Fog Lights', icon: <Layers className="text-green-500" />, severity: 'Info', desc: 'Front fog lights are on.', action: 'Use in Fog/Rain' },
  { id: 10, name: 'Diesel Glow Plug', icon: <Zap className="text-yellow-500" />, severity: 'Info', desc: 'Engine is pre-heating (Diesel only).', action: 'Wait to Start' },
  { id: 11, name: 'Washer Fluid', icon: <Droplet className="text-blue-400" />, severity: 'Info', desc: 'Windshield washer fluid low.', action: 'Top Up Fluid' },
  { id: 12, name: 'Brake Pad Wear', icon: <Disc className="text-yellow-500" />, severity: 'Warning', desc: 'Brake pads are thin.', action: 'Replace Soon' },
];

// --- Types ---

type UserAccount = {
  id: string;
  email: string;
  name: string;
  mobile: string;
  password?: string;
  role: 'user' | 'admin';
  isPro: boolean;
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

type TripLog = {
  id: string;
  date: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  type: string;
  notes: string;
};

type ExpenseLog = {
  id: string;
  date: string;
  category: string;
  amount: number;
  vendor: string;
  notes: string;
  isVerified?: boolean; // From smart scan
};

type MaintenanceTaskState = {
  id: string;
  lastChecked: string | null;
  status: 'pending' | 'ok' | 'issue';
  issueDetails?: string;
};

const DEFAULT_PROFILE: VehicleProfile = {
  make: '',
  model: '',
  variant: '',
  regNumber: '',
  vin: '',
  purchaseDate: '',
  fuelType: 'Petrol'
};

// --- Shared Components ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-slate-900 border border-slate-800 rounded-xl shadow-sm", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, title = '' }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800",
    pro: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(baseStyle, variants[variant as keyof typeof variants], className)} title={title}>
      {children}
    </button>
  );
};

const Input = ({ label, className, ...props }: any) => (
  <div className={cn("mb-4", className)}>
    {label && <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>}
    <input 
      {...props} 
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-600 disabled:opacity-50 disabled:bg-slate-900 disabled:cursor-not-allowed"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>
    <select 
      {...props} 
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <Card className={cn("p-4 border-l-4", 
    color === 'blue' ? 'border-l-blue-500' : 
    color === 'emerald' ? 'border-l-emerald-500' : 
    color === 'purple' ? 'border-l-purple-500' : 'border-l-slate-500'
  )}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase">{label}</p>
        <h3 className="text-xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={cn("p-2 rounded-lg opacity-80", 
        color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 
        color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 
        color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-500/10 text-slate-400'
      )}>
        {icon}
      </div>
    </div>
  </Card>
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

const AddTripModal = ({ isOpen, onClose, onSave, lastOdometer }: any) => {
  const [formData, setFormData] = useState<Partial<TripLog>>({
    date: new Date().toISOString().split('T')[0],
    type: 'City',
    startOdometer: lastOdometer,
    endOdometer: lastOdometer + 1,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'City',
        startOdometer: lastOdometer,
        endOdometer: lastOdometer,
        notes: ''
      });
    }
  }, [isOpen, lastOdometer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Car className="text-blue-500" /> Log New Trip
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" type="date" value={formData.date} onChange={(e:any) => setFormData({...formData, date: e.target.value})} />
          <Select label="Trip Type" options={TRIP_TYPES} value={formData.type} onChange={(e:any) => setFormData({...formData, type: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Odometer" type="number" value={formData.startOdometer} onChange={(e:any) => setFormData({...formData, startOdometer: Number(e.target.value)})} />
          <Input label="End Odometer" type="number" value={formData.endOdometer} onChange={(e:any) => setFormData({...formData, endOdometer: Number(e.target.value)})} />
        </div>

        <div className="mb-4">
            <label className="block text-slate-400 text-sm font-medium mb-1">Distance (Calculated)</label>
            <div className="text-2xl font-bold text-white font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                {Math.max(0, (formData.endOdometer || 0) - (formData.startOdometer || 0))} km
            </div>
        </div>

        <Input label="Notes (Route/Purpose)" placeholder="e.g. Office to Home via Highway" value={formData.notes} onChange={(e:any) => setFormData({...formData, notes: e.target.value})} />
        
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => onSave(formData)} className="flex-1">Save Trip Log</Button>
        </div>
      </Card>
    </div>
  );
};

const AddExpenseModal = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState<Partial<ExpenseLog>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Fuel',
    amount: 0,
    vendor: '',
    notes: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <DollarSign className="text-emerald-500" /> Add Expense
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" type="date" value={formData.date} onChange={(e:any) => setFormData({...formData, date: e.target.value})} />
          <Select label="Category" options={EXPENSE_CATEGORIES} value={formData.category} onChange={(e:any) => setFormData({...formData, category: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <Input label="Amount (₹)" type="number" placeholder="0.00" value={formData.amount || ''} onChange={(e:any) => setFormData({...formData, amount: Number(e.target.value)})} />
           <Input label="Vendor / Payee" placeholder="e.g. Shell Petrol Pump" value={formData.vendor} onChange={(e:any) => setFormData({...formData, vendor: e.target.value})} />
        </div>

        <Input label="Notes" placeholder="Details (Litres, Invoice No, etc.)" value={formData.notes} onChange={(e:any) => setFormData({...formData, notes: e.target.value})} />
        
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="success" onClick={() => onSave(formData)} className="flex-1">Save Expense</Button>
        </div>
      </Card>
    </div>
  );
};

// --- Smart Scan Modal (PRO Feature) ---
const SmartScanModal = ({ isOpen, onClose, onSave }: any) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Scanning, 3: Confirm
  const [scannedData, setScannedData] = useState<Partial<ExpenseLog>>({});

  const handleSimulateScan = () => {
    setStep(2);
    setTimeout(() => {
        // Mock extracted data
        setScannedData({
            date: new Date().toISOString().split('T')[0],
            category: 'Service & Maintenance',
            amount: 4500,
            vendor: 'City Auto Care',
            notes: 'Detected Items: Engine Oil, Oil Filter, Labor Charges',
            isVerified: true
        });
        setStep(3);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <Card className="w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30">
               <Camera className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Smart Bill Scanner <span className="text-xs bg-purple-500 px-1.5 py-0.5 rounded text-white ml-2">PRO</span></h2>
        </div>

        {step === 1 && (
            <div className="space-y-4">
                <div 
                    onClick={handleSimulateScan}
                    className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-950/50"
                >
                    <Upload className="mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-300 font-medium">Click to Upload Bill</p>
                    <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, PDF</p>
                </div>
                <p className="text-xs text-center text-slate-500">AI will auto-detect vendor, amount, and items.</p>
            </div>
        )}

        {step === 2 && (
            <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-purple-300 animate-pulse">Analyzing document...</p>
                <div className="text-xs text-slate-500 space-y-1">
                    <p>Detecting Vendor...</p>
                    <p>Extracting Line Items...</p>
                    <p>Calculating Total...</p>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex gap-3 items-start">
                    <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                    <div className="text-sm">
                        <p className="text-emerald-400 font-bold">Scan Complete!</p>
                        <p className="text-slate-400">Please verify the extracted details below.</p>
                    </div>
                </div>
                <Input label="Vendor" value={scannedData.vendor} onChange={(e:any) => setScannedData({...scannedData, vendor: e.target.value})} />
                <Input label="Total Amount" type="number" value={scannedData.amount} onChange={(e:any) => setScannedData({...scannedData, amount: Number(e.target.value)})} />
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-400">
                    <strong>Extracted Notes:</strong> {scannedData.notes}
                </div>
                <Button onClick={() => { onSave(scannedData); onClose(); }} variant="success" className="w-full">Confirm & Add to Log</Button>
            </div>
        )}
      </Card>
    </div>
  );
};

const IssueReportModal = ({ isOpen, onClose, onSave, taskName }: any) => {
    const [notes, setNotes] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm p-6 relative">
                <h3 className="font-bold text-white text-lg mb-4 flex gap-2 items-center"><AlertOctagon className="text-red-500"/> Report Issue</h3>
                <p className="text-sm text-slate-400 mb-4">What's wrong with <strong>{taskName}</strong>?</p>
                <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500/50 min-h-[100px]"
                    placeholder="Describe the issue (e.g. Low tread depth, leak visible)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button onClick={() => onSave(notes)} variant="danger" className="flex-1">Log Issue</Button>
                </div>
            </Card>
        </div>
    );
};

// --- Main App ---

export default function AutologApp() {
  // Global State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTaskState[]>(
    MAINTENANCE_TASKS.map(t => ({ id: t.id, lastChecked: null, status: 'pending' }))
  );
  const [profile, setProfile] = useState<VehicleProfile>(DEFAULT_PROFILE);
  const [vehicleMood, setVehicleMood] = useState('Excellent');

  // Modal State
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSmartScanOpen, setIsSmartScanOpen] = useState(false);
  const [reportIssueData, setReportIssueData] = useState<{id: string, name: string} | null>(null);

  // Computed
  const lastOdometer = trips.length > 0 ? Math.max(...trips.map(t => t.endOdometer)) : 0;
  const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  
  // Health Score Calculation
  const pendingIssues = tasks.filter(t => t.status === 'issue').length;
  const overdueTasks = tasks.filter(t => t.status === 'pending').length;
  const healthScore = Math.max(0, 100 - (pendingIssues * 15) - (overdueTasks * 2));

  // Effects
  useEffect(() => {
    const savedUser = localStorage.getItem('autolog_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      loadUserData(user.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const p = `autolog_${userId}`;
    setTrips(JSON.parse(localStorage.getItem(`${p}_trips`) || '[]'));
    setExpenses(JSON.parse(localStorage.getItem(`${p}_expenses`) || '[]'));
    const savedTasks = localStorage.getItem(`${p}_tasks`);
    if(savedTasks) setTasks(JSON.parse(savedTasks));
    const savedProfile = localStorage.getItem(`${p}_profile`);
    if(savedProfile) setProfile(JSON.parse(savedProfile));
    else setProfile(DEFAULT_PROFILE);
    const savedMood = localStorage.getItem(`${p}_mood`);
    if(savedMood) setVehicleMood(savedMood);
  };

  const saveUserData = () => {
    if (!currentUser) return;
    const p = `autolog_${currentUser.id}`;
    localStorage.setItem(`${p}_trips`, JSON.stringify(trips));
    localStorage.setItem(`${p}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${p}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${p}_profile`, JSON.stringify(profile));
    localStorage.setItem(`${p}_mood`, vehicleMood);
  };

  useEffect(() => { saveUserData(); }, [trips, expenses, tasks, profile, vehicleMood]);

  // Handlers
  const requireAuth = (callback: () => void) => {
    if (currentUser) {
      callback();
    } else {
      setShowAuthModal(true);
    }
  };

  const requirePro = (callback: () => void) => {
      if (currentUser?.isPro) {
          callback();
      } else {
          setShowProModal(true);
      }
  };

  const handleSaveTrip = (data: Partial<TripLog>) => {
    if (!data.endOdometer || data.endOdometer <= (data.startOdometer || 0)) {
      alert("End odometer must be greater than start."); return;
    }
    const distance = (data.endOdometer || 0) - (data.startOdometer || 0);
    const trip: TripLog = {
      id: generateId(),
      date: data.date!,
      startOdometer: data.startOdometer || 0,
      endOdometer: data.endOdometer,
      distance,
      type: data.type!,
      notes: data.notes || ''
    };
    setTrips([trip, ...trips]);
    setIsTripModalOpen(false);
  };

  const handleSaveExpense = (data: Partial<ExpenseLog>) => {
    if (!data.amount || data.amount <= 0) {
        alert("Please enter a valid amount"); return;
    }
    const expense: ExpenseLog = {
      id: generateId(),
      date: data.date!,
      category: data.category!,
      amount: Number(data.amount),
      vendor: data.vendor || '',
      notes: data.notes || '',
      isVerified: data.isVerified
    };
    setExpenses([expense, ...expenses]);
    setIsExpenseModalOpen(false);
  };

  const handleGoPro = () => {
    setTimeout(() => {
        if(!currentUser) return;
        const updatedUser = { ...currentUser, isPro: true };
        setCurrentUser(updatedUser);
        localStorage.setItem('autolog_current_user', JSON.stringify(updatedUser));
        setShowProModal(false);
        alert('Welcome to Pro! Payment successful.');
    }, 1500);
  };

  const updateTaskStatus = (taskId: string, status: 'ok' | 'issue' | 'pending', details?: string) => {
    requireAuth(() => {
      setTasks(tasks.map(t => t.id === taskId ? { 
        ...t, 
        status: status,
        lastChecked: new Date().toISOString().split('T')[0],
        issueDetails: details || t.issueDetails
      } : t));
    });
  };

  // --- Views ---

  const renderDashboard = () => (
    <div className="animate-in fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        {!currentUser && (
          <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 animate-pulse">
            Guest Mode - Sign in to save data
          </span>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-l-4 border-l-blue-500 hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => requireAuth(() => setIsTripModalOpen(true))}>
           <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-white text-lg">Log a Trip</h3>
                  <p className="text-slate-400 text-sm">Record new journey details</p>
               </div>
               <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                   <Car size={24} />
               </div>
           </div>
           <p className="text-sm text-slate-500">Last Odo: <span className="text-white font-mono font-bold">{lastOdometer} km</span></p>
        </Card>

        <Card className="p-6 border-l-4 border-l-emerald-500 hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => requireAuth(() => setIsExpenseModalOpen(true))}>
           <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-white text-lg">Add Expense</h3>
                  <p className="text-slate-400 text-sm">Fuel, service, or repairs</p>
               </div>
               <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                   <DollarSign size={24} />
               </div>
           </div>
           <p className="text-sm text-slate-500">Total Spent: <span className="text-white font-mono font-bold">₹{totalSpent.toLocaleString()}</span></p>
        </Card>
      </div>
      
      {/* Health Score Bar (PRO) */}
      {currentUser?.isPro && (
          <div className="bg-slate-900 rounded-xl p-4 border border-purple-500/30 relative overflow-hidden">
              <div className="flex justify-between items-end mb-2 relative z-10">
                  <div>
                      <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Activity size={14}/> Vehicle Health Score</h3>
                      <p className="text-slate-400 text-xs">Based on maintenance & issues</p>
                  </div>
                  <span className="text-3xl font-bold text-white">{healthScore}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative z-10">
                  <div className={cn("h-full transition-all duration-1000", 
                      healthScore > 80 ? "bg-emerald-500" : healthScore > 50 ? "bg-yellow-500" : "bg-red-500"
                  )} style={{ width: `${healthScore}%` }}></div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
          </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Km" value={`${totalDistance} km`} icon={<Gauge size={20}/>} color="blue" />
        <StatCard label="Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign size={20}/>} color="emerald" />
        <StatCard label="Trips" value={trips.length} icon={<LayoutDashboard size={20}/>} color="purple" />
        <StatCard label="Vehicle" value={currentUser && profile.regNumber ? profile.regNumber : 'Setup Needed'} icon={<Car size={20}/>} color="slate" />
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
              {[...trips.map(t => ({...t, recordType: 'trip'})), ...expenses.map(e => ({...e, recordType: 'expense'}))]
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-800 rounded transition-colors">
                  <div className="flex gap-3 items-center">
                      <div className={`p-2 rounded-full ${item.recordType === 'trip' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {item.recordType === 'trip' ? <Car size={14} /> : <DollarSign size={14} />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.recordType === 'trip' ? 'Trip Logged' : item.category}</p>
                        <p className="text-slate-500 text-xs">{item.date} • {item.recordType === 'trip' ? item.type : item.vendor || 'No Vendor'}</p>
                      </div>
                  </div>
                  <span className="font-bold text-slate-300">{item.recordType === 'trip' ? `${item.distance} km` : `₹${item.amount}`}</span>
                </div>
              ))}
              {trips.length === 0 && expenses.length === 0 && <p className="text-slate-500 text-sm italic">No activity yet. Start by logging a trip!</p>}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-bold text-white mb-4">Maintenance Health</h3>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(t => {
               const taskDef = MAINTENANCE_TASKS.find(def => def.id === t.id);
               return (
                <div key={t.id} className={cn("flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-transparent transition-all", t.status === 'issue' ? 'border-red-500/50 bg-red-500/5' : 'hover:border-slate-700')}>
                  <div className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", 
                          t.status === 'ok' ? 'bg-emerald-500 border-emerald-500' : t.status === 'issue' ? 'bg-red-500 border-red-500' : 'border-slate-500'
                        )}
                      >
                        {t.status === 'ok' && <CheckCircle size={12} className="text-white" />}
                        {t.status === 'issue' && <AlertOctagon size={12} className="text-white" />}
                      </div>
                      <div>
                        <span className={cn("text-sm block", t.status === 'ok' ? "text-slate-500 line-through" : t.status === 'issue' ? "text-red-300 font-bold" : "text-slate-300")}>{taskDef?.label}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{taskDef?.frequency}</span>
                      </div>
                  </div>
                </div>
               );
            })}
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => setActiveTab('maintenance')} className="text-xs text-blue-400 hover:text-blue-300 hover:underline">View Full Checklist</button>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex">
      
      {/* Modals */}
      <AddTripModal 
        isOpen={isTripModalOpen} 
        onClose={() => setIsTripModalOpen(false)} 
        onSave={handleSaveTrip} 
        lastOdometer={lastOdometer}
      />
      <AddExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        onSave={handleSaveExpense} 
      />
      <SmartScanModal 
        isOpen={isSmartScanOpen}
        onClose={() => setIsSmartScanOpen(false)}
        onSave={handleSaveExpense}
      />
      <IssueReportModal
        isOpen={!!reportIssueData}
        taskName={reportIssueData?.name}
        onClose={() => setReportIssueData(null)}
        onSave={(notes: string) => {
            if(reportIssueData) updateTaskStatus(reportIssueData.id, 'issue', notes);
            setReportIssueData(null);
        }}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md p-6 relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Car className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Sign In to Save</h2>
              <p className="text-slate-400 text-sm mt-1">Create an account to track your vehicle history permanently.</p>
            </div>
            
            <form className="space-y-3" onSubmit={(e) => {
               e.preventDefault();
               const user = { id: generateId(), name: 'Demo User', email: 'user@demo.com', mobile: '9999999999', role: 'user', isPro: false } as UserAccount;
               setCurrentUser(user);
               localStorage.setItem('autolog_current_user', JSON.stringify(user));
               setShowAuthModal(false);
            }}>
               <Input label="Mobile Number" placeholder="Enter Mobile" required />
               <Input label="Password" type="password" placeholder="Enter Password" required />
               <Button type="submit" className="w-full">Sign In / Register</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Pro Modal */}
      {showProModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <Card className="w-full max-w-md p-0 overflow-hidden border-purple-500/30">
                  <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 text-center">
                      <Shield className="w-16 h-16 text-white mx-auto mb-4 opacity-90" strokeWidth={1.5} />
                      <h2 className="text-2xl font-bold text-white mb-2">Upgrade to PRO</h2>
                      <p className="text-purple-200 text-sm">Unlock Cloud Backup, PDF Exports & Smart Tools</p>
                  </div>
                  <div className="p-8 space-y-6">
                      <div className="space-y-3">
                          <div className="flex gap-3 items-center text-slate-300"><CheckCircle size={18} className="text-purple-400"/> Smart Bill Scanning</div>
                          <div className="flex gap-3 items-center text-slate-300"><CheckCircle size={18} className="text-purple-400"/> Service History Timeline</div>
                          <div className="flex gap-3 items-center text-slate-300"><CheckCircle size={18} className="text-purple-400"/> Issue Reporting & Tracking</div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                          <div>
                              <p className="text-sm text-slate-500">Yearly Plan</p>
                              <p className="text-2xl font-bold text-white">₹499 <span className="text-sm font-normal text-slate-500">/year</span></p>
                          </div>
                      </div>
                      
                      <Button onClick={handleGoPro} variant="pro" className="w-full py-3">
                          Pay Now (Secure)
                      </Button>
                      <button onClick={() => setShowProModal(false)} className="w-full text-center text-sm text-slate-500 hover:text-slate-300 mt-2">No thanks, I'll stay on free plan</button>
                  </div>
              </Card>
          </div>
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Car className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">AUTOLOG</h1>
              <p className="text-xs text-slate-500">Web Edition</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {!currentUser?.isPro && (
            <div 
                onClick={() => setShowProModal(true)}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 cursor-pointer group hover:border-purple-500/50 transition-all"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-purple-400" />
                    <span className="font-bold text-white text-sm">Go PRO</span>
                </div>
                <p className="text-xs text-purple-200 mb-2">Unlock cloud sync & smart tools.</p>
                <div className="text-xs font-bold text-white bg-purple-600 px-2 py-1 rounded inline-block">Upgrade</div>
            </div>
          )}

          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4 mb-2 mt-4">Menu</div>
          <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
          <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
          <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
          <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
          <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
          <NavButton id="profile" icon={Settings} label="Vehicle Profile" active={activeTab} set={setActiveTab} />

          {/* Pro Tools Section */}
          <div className="text-xs font-bold text-purple-500 uppercase tracking-wider px-4 mb-2 mt-6 flex items-center gap-1"><Shield size={10}/> Pro Tools</div>
          <NavButton id="service_history" icon={Clock} label="Service History" active={activeTab} set={() => requirePro(() => setActiveTab('service_history'))} />
        </div>

        <div className="p-4 border-t border-slate-800">
          {currentUser ? (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white relative">
                  {currentUser.name.charAt(0)}
                  {currentUser.isPro && <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5 border-2 border-slate-900"><Shield size={8} fill="currentColor" className="text-white"/></div>}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      {currentUser.isPro && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1 rounded border border-purple-500/20">PRO</span>}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{currentUser.mobile}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => { setCurrentUser(null); localStorage.removeItem('autolog_current_user'); window.location.reload(); }} className="w-full justify-start text-red-400 h-8 text-xs">
                <LogOut size={14} className="mr-2" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuthModal(true)} className="w-full">
              <LogIn size={16} /> Sign In
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 pt-20 md:pt-8 min-h-screen pb-24 md:pb-8 w-full max-w-[100vw] overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-20 px-4 py-3 flex items-center justify-between">
           <span className="font-bold text-white flex items-center gap-2"><Car size={18} className="text-blue-500"/> AUTOLOG</span>
           <button onClick={() => currentUser ? setCurrentUser(null) : setShowAuthModal(true)}>{currentUser ? <LogOut size={18}/> : <LogIn size={18}/>}</button>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        
        {/* Other Tabs with Warning Lights Component Inline for brevity */}
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

        {/* PRO: Service History Tab */}
        {activeTab === 'service_history' && (
            <div className="animate-in fade-in space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Clock className="text-purple-500"/> Service Timeline</h2>
                        <p className="text-slate-400 text-sm">A visual history of all services and smart-scanned bills.</p>
                    </div>
                    <Button onClick={() => setIsSmartScanOpen(true)} variant="pro" className="gap-2">
                        <Camera size={16} /> Scan Service Bill
                    </Button>
                </div>

                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-0 before:h-full before:w-[2px] before:bg-slate-800">
                    {/* Auto Reminder Card */}
                    <div className="relative pl-10">
                        <div className="absolute left-0 top-0 w-10 h-10 bg-slate-900 border-2 border-purple-500 rounded-full flex items-center justify-center z-10">
                            <Clock size={20} className="text-purple-500" />
                        </div>
                        <Card className="p-4 border-l-4 border-l-purple-500 bg-gradient-to-r from-slate-900 to-purple-900/20">
                            <h3 className="font-bold text-white mb-1">Next Service Due</h3>
                            <p className="text-sm text-slate-400 mb-3">Predicted based on your average usage of 45km/day.</p>
                            <div className="flex gap-4">
                                <div className="bg-slate-900 px-3 py-2 rounded border border-slate-700">
                                    <span className="text-xs text-slate-500 block">Date</span>
                                    <span className="text-white font-bold">12 Oct 2024</span>
                                </div>
                                <div className="bg-slate-900 px-3 py-2 rounded border border-slate-700">
                                    <span className="text-xs text-slate-500 block">Odometer</span>
                                    <span className="text-white font-bold">{lastOdometer + 5000} km</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Timeline Items (From Expenses filtered by Service) */}
                    {expenses.filter(e => e.category === 'Service & Maintenance').map(service => (
                        <div key={service.id} className="relative pl-10">
                            <div className="absolute left-0 top-0 w-10 h-10 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center z-10">
                                <Wrench size={18} className="text-slate-400" />
                            </div>
                            <Card className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{service.vendor || 'Unknown Service'}</h4>
                                    <span className="text-emerald-400 font-bold">₹{service.amount}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{service.date}</p>
                                <p className="text-sm text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                                    {service.notes}
                                </p>
                                {service.isVerified && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
                                        <CheckCircle size={12} /> Verified by Smart Scan
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
            <div className="animate-in fade-in space-y-8">
              
              {/* 1. Vehicle Mood Tracker (New Engagement Feature) */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">Maintenance Log</h2>
                    <p className="text-slate-400">Track routine checks and how your car feels.</p>
                </div>
                <Card className="p-4 flex items-center gap-4 bg-slate-800/50 border-slate-700">
                     <span className="text-sm font-bold text-slate-300">Current Vehicle Mood:</span>
                     <div className="flex gap-2">
                        {['Excellent', 'Good', 'Okay', 'Bad'].map(mood => (
                            <button 
                                key={mood}
                                onClick={() => setVehicleMood(mood)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                    vehicleMood === mood 
                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg scale-105" 
                                        : "bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800"
                                )}
                            >
                                {mood}
                            </button>
                        ))}
                     </div>
                </Card>
              </div>
        
              {/* 2. Checklists (Restyled to 1st Version + Progress) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Daily', 'Monthly', 'Yearly'].map(freq => {
                   const freqTasks = MAINTENANCE_TASKS.filter(def => def.frequency === freq);
                   const completedCount = tasks.filter(t => freqTasks.find(def => def.id === t.id) && t.status === 'ok').length;
                   const progress = (completedCount / freqTasks.length) * 100;
        
                   return (
                   <Card key={freq} className="p-0 overflow-hidden h-fit border-t-4 border-t-blue-500">
                      <div className="p-4 bg-slate-900 border-b border-slate-800">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-white text-lg">{freq} Checks</h3>
                            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                {completedCount} / {freqTasks.length}
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <div className="divide-y divide-slate-800/50">
                        {freqTasks.map(def => {
                           const state = tasks.find(t => t.id === def.id);
                           const isChecked = state?.status === 'ok';
                           const isIssue = state?.status === 'issue';
                           
                           return (
                             <div 
                                key={def.id} 
                                className={cn(
                                    "p-3 flex gap-3 items-center transition-all hover:bg-slate-800/30",
                                    isChecked ? "bg-slate-900/50" : isIssue ? "bg-red-900/10" : ""
                                )}
                             >
                               <div className="flex-1">
                                 <p className={cn("text-sm font-medium", isChecked ? "text-slate-500 line-through" : isIssue ? "text-red-400" : "text-slate-200")}>
                                    {def.label}
                                 </p>
                                 <p className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{def.category}</p>
                                 {isIssue && state.issueDetails && (
                                     <p className="text-xs text-red-400 bg-red-500/10 p-1 rounded mt-1 border border-red-500/20">{state.issueDetails}</p>
                                 )}
                               </div>
                               
                               <div className="flex gap-2">
                                   {/* Pass Button */}
                                   <button 
                                        onClick={() => updateTaskStatus(def.id, isChecked ? 'pending' : 'ok')}
                                        className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors border", 
                                            isChecked ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-600 text-slate-500 hover:bg-emerald-600/20 hover:text-emerald-500 hover:border-emerald-500"
                                        )}
                                        title="Mark OK"
                                   >
                                       <CheckCircle size={14} />
                                   </button>
                                   {/* Fail Button */}
                                   <button 
                                        onClick={() => isIssue ? updateTaskStatus(def.id, 'pending') : setReportIssueData({id: def.id, name: def.label})}
                                        className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors border", 
                                            isIssue ? "bg-red-600 border-red-500 text-white" : "border-slate-600 text-slate-500 hover:bg-red-600/20 hover:text-red-500 hover:border-red-500"
                                        )}
                                        title="Report Issue"
                                   >
                                       <AlertOctagon size={14} />
                                   </button>
                               </div>
                             </div>
                           );
                        })}
                      </div>
                   </Card>
                )})}
              </div>
            </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">Trip Logs</h2>
                 <Button onClick={() => requireAuth(() => setIsTripModalOpen(true))}>
                     <Plus size={16} /> New Trip
                 </Button>
             </div>
             <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-4 py-3">Date</th>
                     <th className="px-4 py-3">Type</th>
                     <th className="px-4 py-3">Route/Notes</th>
                     <th className="px-4 py-3">Odometer</th>
                     <th className="px-4 py-3 text-right">Distance</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {trips.map(t => (
                     <tr key={t.id}>
                       <td className="px-4 py-3">{t.date}</td>
                       <td className="px-4 py-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{t.type}</span></td>
                       <td className="px-4 py-3 max-w-xs truncate">{t.notes || '-'}</td>
                       <td className="px-4 py-3 font-mono text-slate-500">{t.startOdometer} - {t.endOdometer}</td>
                       <td className="px-4 py-3 text-right text-white font-bold">{t.distance} km</td>
                     </tr>
                   ))}
                   {trips.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No trips logged yet.</td></tr>}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">Expense History</h2>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsSmartScanOpen(true)} className="hidden md:flex">
                        <Camera size={16} className="mr-2"/> Smart Scan
                    </Button>
                    <Button onClick={() => requireAuth(() => setIsExpenseModalOpen(true))}>
                        <Plus size={16} /> New Expense
                    </Button>
                 </div>
             </div>
             <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-4 py-3">Date</th>
                     <th className="px-4 py-3">Category</th>
                     <th className="px-4 py-3">Vendor</th>
                     <th className="px-4 py-3">Note</th>
                     <th className="px-4 py-3 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {expenses.map(e => (
                     <tr key={e.id}>
                       <td className="px-4 py-3">{e.date}</td>
                       <td className="px-4 py-3"><span className="text-blue-400">{e.category}</span></td>
                       <td className="px-4 py-3">{e.vendor || '-'}</td>
                       <td className="px-4 py-3 max-w-xs truncate">
                           {e.notes || '-'}
                           {e.isVerified && <span className="ml-2 text-[10px] text-purple-400 border border-purple-500/30 px-1 rounded">Auto-Scan</span>}
                       </td>
                       <td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{e.amount}</td>
                     </tr>
                   ))}
                   {expenses.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No expenses yet.</td></tr>}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card className="p-8 max-w-3xl mx-auto animate-in fade-in">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Car className="text-blue-500" /> Vehicle Profile
                </h2>
                {currentUser && <Button onClick={saveUserData}>Save Changes</Button>}
             </div>
             
             {!currentUser && <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                 <Info className="shrink-0" />
                 <div>
                     <p className="font-bold">Guest Mode Active</p>
                     <p className="text-sm opacity-80">Sign in to securely save your vehicle details and history to your account.</p>
                 </div>
             </div>}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input label="Make (Brand)" placeholder="e.g. Toyota" value={profile.make} onChange={(e:any) => setProfile({...profile, make: e.target.value})} disabled={!currentUser} />
               <Input label="Model" placeholder="e.g. Fortuner" value={profile.model} onChange={(e:any) => setProfile({...profile, model: e.target.value})} disabled={!currentUser} />
               <Input label="Variant / Trim" placeholder="e.g. Legender 4x4" value={profile.variant} onChange={(e:any) => setProfile({...profile, variant: e.target.value})} disabled={!currentUser} />
               <Input label="Registration Number" placeholder="KA-01-XX-0000" value={profile.regNumber} onChange={(e:any) => setProfile({...profile, regNumber: e.target.value})} disabled={!currentUser} />
               <Input label="VIN / Chassis No." placeholder="Optional" value={profile.vin} onChange={(e:any) => setProfile({...profile, vin: e.target.value})} disabled={!currentUser} />
               <Select label="Fuel Type" options={['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']} value={profile.fuelType} onChange={(e:any) => setProfile({...profile, fuelType: e.target.value})} disabled={!currentUser} />
               <Input label="Purchase Date" type="date" value={profile.purchaseDate} onChange={(e:any) => setProfile({...profile, purchaseDate: e.target.value})} disabled={!currentUser} />
             </div>
          </Card>
        )}

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-20">
          <MobileNavBtn id="dashboard" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="logs" icon={FileText} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="warnings" icon={AlertTriangle} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="maintenance" icon={Wrench} active={activeTab} set={setActiveTab} />
        </div>
      </main>
    </div>
  );
}

// --- Helper Components (Defined Outside) ---

const NavButton = ({ id, icon: Icon, label, active, set }: any) => (
  <button 
    onClick={() => set(id)}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all",
      active === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    )}
  >
    <Icon size={20} />
    <span>{label}</span>
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
