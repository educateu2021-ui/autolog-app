import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings, 
  Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge, 
  DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info, 
  User, Smartphone, Mail, Lock, Shield, CreditCard, Users, 
  TrendingUp, CheckCircle, Search, RefreshCw, X, LogIn, 
  AlertCircle, Battery, Fan, Layers
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
};

type MaintenanceTaskState = {
  id: string;
  lastChecked: string | null;
  status: 'pending' | 'ok';
};

// --- Shared Components (Defined Outside to Fix Focus Bug) ---

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
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800"
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

// --- Main App ---

export default function AutologApp() {
  // Global State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTaskState[]>(
    MAINTENANCE_TASKS.map(t => ({ id: t.id, lastChecked: null, status: 'pending' }))
  );
  const [profile, setProfile] = useState<any>({ regNumber: 'KA-01-XX-0000', make: 'My Car' });

  // Input State (Lifted up to avoid re-renders)
  const [newTrip, setNewTrip] = useState<Partial<TripLog>>({ 
    date: new Date().toISOString().split('T')[0], type: 'City' 
  });
  const [newExpense, setNewExpense] = useState<Partial<ExpenseLog>>({ 
    date: new Date().toISOString().split('T')[0], category: 'Fuel' 
  });
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Computed
  const lastOdometer = trips.length > 0 ? Math.max(...trips.map(t => t.endOdometer)) : 0;
  const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

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
  };

  const saveUserData = () => {
    if (!currentUser) return;
    const p = `autolog_${currentUser.id}`;
    localStorage.setItem(`${p}_trips`, JSON.stringify(trips));
    localStorage.setItem(`${p}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${p}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${p}_profile`, JSON.stringify(profile));
  };

  useEffect(() => { saveUserData(); }, [trips, expenses, tasks, profile]);

  // Handlers
  const requireAuth = (callback: () => void) => {
    if (currentUser) {
      callback();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAddTrip = () => {
    if (!newTrip.endOdometer || newTrip.endOdometer <= (newTrip.startOdometer || lastOdometer)) {
      alert("End odometer must be greater than start."); return;
    }
    const distance = (newTrip.endOdometer || 0) - (newTrip.startOdometer || lastOdometer);
    const trip: TripLog = {
      id: generateId(),
      date: newTrip.date!,
      startOdometer: newTrip.startOdometer || lastOdometer,
      endOdometer: newTrip.endOdometer,
      distance,
      type: newTrip.type!,
      notes: newTrip.notes || ''
    };
    setTrips([trip, ...trips]);
    setShowAddTrip(false);
    setNewTrip({ ...newTrip, startOdometer: trip.endOdometer, endOdometer: undefined, notes: '' });
  };

  const handleAddExpense = () => {
    if (!newExpense.amount || newExpense.amount <= 0) return;
    const expense: ExpenseLog = {
      id: generateId(),
      date: newExpense.date!,
      category: newExpense.category!,
      amount: Number(newExpense.amount),
      vendor: newExpense.vendor || '',
      notes: newExpense.notes || ''
    };
    setExpenses([expense, ...expenses]);
    setShowAddExpense(false);
    setNewExpense({ ...newExpense, amount: 0, vendor: '', notes: '' });
  };

  const toggleTask = (taskId: string) => {
    requireAuth(() => {
      setTasks(tasks.map(t => t.id === taskId ? { 
        ...t, 
        status: t.status === 'ok' ? 'pending' : 'ok',
        lastChecked: new Date().toISOString().split('T')[0]
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
        {/* Log Trip Card */}
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white">Log a Trip</h3>
            <Car size={20} className="text-blue-400" />
          </div>
          {showAddTrip ? (
             <div className="animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="grid grid-cols-2 gap-2 mb-2">
                 <Input 
                   className="mb-0" 
                   type="number" 
                   label="End Odo"
                   placeholder={lastOdometer} 
                   value={newTrip.endOdometer || ''} 
                   onChange={(e:any) => setNewTrip(prev => ({...prev, endOdometer: Number(e.target.value)}))} 
                 />
                 <Input 
                   className="mb-0" 
                   type="text" 
                   label="Notes"
                   placeholder="Destination..." 
                   value={newTrip.notes || ''} 
                   onChange={(e:any) => setNewTrip(prev => ({...prev, notes: e.target.value}))} 
                 />
               </div>
               <div className="flex gap-2">
                 <Button onClick={handleAddTrip} className="flex-1 py-1 text-sm h-8">Save</Button>
                 <Button variant="secondary" onClick={() => setShowAddTrip(false)} className="py-1 text-sm h-8">Cancel</Button>
               </div>
             </div>
          ) : (
            <>
               <p className="text-sm text-slate-400 mb-3">Last Odo: <span className="text-white font-mono">{lastOdometer} km</span></p>
               <Button onClick={() => requireAuth(() => { setNewTrip(p => ({...p, startOdometer: lastOdometer})); setShowAddTrip(true); })} className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 shadow-none">
                  <Plus size={16} /> New Trip Log
               </Button>
            </>
          )}
        </Card>

        {/* Add Expense Card */}
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white">Add Expense</h3>
            <DollarSign size={20} className="text-emerald-400" />
          </div>
          {showAddExpense ? (
             <div className="animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="grid grid-cols-2 gap-2 mb-2">
                 <Input 
                    className="mb-0" 
                    type="number" 
                    placeholder="0.00" 
                    label="Amount"
                    value={newExpense.amount || ''} 
                    onChange={(e:any) => setNewExpense(prev => ({...prev, amount: Number(e.target.value)}))} 
                 />
                 <Select 
                    className="mb-0 h-[42px] py-2" 
                    label="Type"
                    options={EXPENSE_CATEGORIES} 
                    value={newExpense.category} 
                    onChange={(e:any) => setNewExpense(prev => ({...prev, category: e.target.value}))} 
                 />
               </div>
               <div className="flex gap-2">
                 <Button onClick={handleAddExpense} className="bg-emerald-600 hover:bg-emerald-500 flex-1 py-1 text-sm h-8">Save</Button>
                 <Button variant="secondary" onClick={() => setShowAddExpense(false)} className="py-1 text-sm h-8">Cancel</Button>
               </div>
             </div>
          ) : (
            <>
               <p className="text-sm text-slate-400 mb-3">Total Spent: <span className="text-white font-mono">₹{totalSpent}</span></p>
               <Button onClick={() => requireAuth(() => setShowAddExpense(true))} className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 shadow-none">
                  <Plus size={16} /> New Expense
               </Button>
            </>
          )}
        </Card>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Km" value={`${totalDistance} km`} icon={<Gauge size={20}/>} color="blue" />
        <StatCard label="Spent" value={`₹${totalSpent}`} icon={<DollarSign size={20}/>} color="emerald" />
        <StatCard label="Trips" value={trips.length} icon={<LayoutDashboard size={20}/>} color="purple" />
        <StatCard label="Profile" value={currentUser ? profile.regNumber : 'Guest'} icon={<Car size={20}/>} color="slate" />
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
              {[...trips.map(t => ({...t, type: 'trip'})), ...expenses.map(e => ({...e, type: 'expense'}))]
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-800 rounded transition-colors">
                  <div className="flex gap-3 items-center">
                      <div className={`p-2 rounded-full ${item.type === 'trip' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {item.type === 'trip' ? <Car size={14} /> : <DollarSign size={14} />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.type === 'trip' ? 'Trip Logged' : item.category}</p>
                        <p className="text-slate-500 text-xs">{item.date}</p>
                      </div>
                  </div>
                  <span className="font-bold text-slate-300">{item.type === 'trip' ? `${item.distance} km` : `₹${item.amount}`}</span>
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
                <div key={t.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-transparent hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleTask(t.id)}
                        className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", 
                          t.status === 'ok' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-slate-300'
                        )}
                      >
                        {t.status === 'ok' && <CheckCircle size={12} className="text-white" />}
                      </button>
                      <div>
                        <span className={cn("text-sm block", t.status === 'ok' ? "text-slate-500 line-through" : "text-slate-300")}>{taskDef?.label}</span>
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

  const renderWarningLights = () => (
    <div className="animate-in fade-in space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Warning Lights</h2>
        <p className="text-slate-400 text-sm">A quick reference guide to understand what your car is telling you.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WARNING_LIGHTS_DATA.map(light => <WarningLightCard key={light.id} light={light} />)}
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="animate-in fade-in space-y-6">
      <h2 className="text-2xl font-bold text-white">Maintenance Checklist</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['Daily', 'Monthly', 'Yearly'].map(freq => (
           <Card key={freq} className="p-0 overflow-hidden h-fit">
              <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center backdrop-blur-sm">
                <h3 className="font-bold text-white">{freq} Checks</h3>
                <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400">
                  {tasks.filter(t => MAINTENANCE_TASKS.find(def => def.id === t.id)?.frequency === freq && t.status === 'ok').length} / 
                  {MAINTENANCE_TASKS.filter(def => def.frequency === freq).length}
                </span>
              </div>
              <div className="divide-y divide-slate-800">
                {MAINTENANCE_TASKS.filter(def => def.frequency === freq).map(def => {
                   const state = tasks.find(t => t.id === def.id);
                   return (
                     <div key={def.id} className="p-4 flex gap-3 hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => state && toggleTask(state.id)}>
                       <div className={cn("mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0", 
                          state?.status === 'ok' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                       )}>
                         {state?.status === 'ok' && <CheckCircle size={12} className="text-white" />}
                       </div>
                       <div>
                         <p className={cn("text-sm font-medium", state?.status === 'ok' ? "text-slate-500 line-through" : "text-slate-200")}>{def.label}</p>
                         <p className="text-xs text-slate-500 mt-1">{def.category}</p>
                       </div>
                     </div>
                   );
                })}
              </div>
           </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex">
      
      {/* Auth Modal (Overlay) */}
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
               // Simplified login for demo
               const user = { id: generateId(), name: 'User', email: 'user@demo.com', mobile: '9999999999', role: 'user', isPro: false } as UserAccount;
               setCurrentUser(user);
               localStorage.setItem('autolog_current_user', JSON.stringify(user));
               setShowAuthModal(false);
            }}>
               <Input label="Mobile Number" placeholder="Enter Mobile" required />
               <Input label="Password" type="password" placeholder="Enter Password" required />
               <Button type="submit" className="w-full">Sign In / Register</Button>
            </form>
            <p className="text-xs text-center text-slate-500 mt-4">By continuing, you agree to our Terms of Service.</p>
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
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4 mb-2 mt-4">Menu</div>
          <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
          <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
          <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
          <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
          <NavButton id="warnings" icon={AlertTriangle} label="Warning Lights" active={activeTab} set={setActiveTab} />
          <NavButton id="profile" icon={Settings} label="Vehicle Profile" active={activeTab} set={setActiveTab} />
        </div>

        <div className="p-4 border-t border-slate-800">
          {currentUser ? (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
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
        {activeTab === 'warnings' && renderWarningLights()}
        {activeTab === 'maintenance' && renderMaintenance()}
        {activeTab === 'logs' && (
          <div className="space-y-4 animate-in fade-in">
             <h2 className="text-2xl font-bold text-white">Trip Logs</h2>
             <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-4 py-3">Date</th>
                     <th className="px-4 py-3">Type</th>
                     <th className="px-4 py-3">Route/Notes</th>
                     <th className="px-4 py-3 text-right">Distance</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {trips.map(t => (
                     <tr key={t.id}>
                       <td className="px-4 py-3">{t.date}</td>
                       <td className="px-4 py-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{t.type}</span></td>
                       <td className="px-4 py-3">{t.notes || '-'}</td>
                       <td className="px-4 py-3 text-right text-white font-bold">{t.distance} km</td>
                     </tr>
                   ))}
                   {trips.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No trips logged yet.</td></tr>}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        {activeTab === 'expenses' && (
          <div className="space-y-4 animate-in fade-in">
             <h2 className="text-2xl font-bold text-white">Expense History</h2>
             <div className="overflow-x-auto rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-4 py-3">Date</th>
                     <th className="px-4 py-3">Category</th>
                     <th className="px-4 py-3">Note</th>
                     <th className="px-4 py-3 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {expenses.map(e => (
                     <tr key={e.id}>
                       <td className="px-4 py-3">{e.date}</td>
                       <td className="px-4 py-3"><span className="text-blue-400">{e.category}</span></td>
                       <td className="px-4 py-3">{e.notes || '-'}</td>
                       <td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{e.amount}</td>
                     </tr>
                   ))}
                   {expenses.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No expenses yet.</td></tr>}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        {activeTab === 'profile' && (
          <Card className="p-8 max-w-xl mx-auto animate-in fade-in">
             <h2 className="text-2xl font-bold text-white mb-6">Vehicle Profile</h2>
             <div className="space-y-4">
               <Input label="Make & Model" value={profile.make} onChange={(e:any) => setProfile({...profile, make: e.target.value})} disabled={!currentUser} />
               <Input label="Registration Number" value={profile.regNumber} onChange={(e:any) => setProfile({...profile, regNumber: e.target.value})} disabled={!currentUser} />
               {!currentUser && <p className="text-sm text-yellow-500 bg-yellow-500/10 p-2 rounded">Sign in to edit your profile.</p>}
               {currentUser && <Button onClick={saveUserData}>Save Profile</Button>}
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
