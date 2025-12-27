import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Car, Fuel, Wrench, AlertTriangle, Settings, 
  Plus, Save, Trash2, ChevronRight, LogOut, Droplet, Gauge, 
  DollarSign, FileText, Activity, Zap, Thermometer, Disc, Info, 
  User, Smartphone, Mail, Lock, Shield, CreditCard, Users, 
  TrendingUp, CheckCircle, XCircle, Search, RefreshCw
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

// --- Types ---

type UserRole = 'user' | 'admin';

type UserAccount = {
  id: string;
  email: string;
  mobile: string;
  password: string; 
  name: string;
  isOnboarded: boolean;
  role: UserRole;
  isPro: boolean;
  joinedDate: string;
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
  type: 'Personal' | 'Office' | 'Highway' | 'City';
  notes: string;
};

type ExpenseLog = {
  id: string;
  date: string;
  category: 'Fuel' | 'Toll' | 'Parking' | 'Wash' | 'Service' | 'Insurance' | 'Fine' | 'Accessory' | 'Other';
  amount: number;
  odometer?: number;
  vendor?: string;
  notes?: string;
};

type MaintenanceTask = {
  id: string;
  label: string;
  frequency: 'Daily' | 'Monthly' | 'Yearly';
  lastChecked: string | null;
  status: 'pending' | 'ok' | 'issue';
};

type AdminConfig = {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  proPlanPrice: number;
  currency: string;
};

// --- Defaults ---

const defaultTasks: MaintenanceTask[] = [
  { id: 'd1', label: 'Tyre Pressure Check', frequency: 'Daily', lastChecked: null, status: 'pending' },
  { id: 'd2', label: 'Visual Body Inspection', frequency: 'Daily', lastChecked: null, status: 'pending' },
  { id: 'd3', label: 'Warning Lights Check', frequency: 'Daily', lastChecked: null, status: 'pending' },
  { id: 'm1', label: 'Engine Oil Level', frequency: 'Monthly', lastChecked: null, status: 'pending' },
  { id: 'm2', label: 'Coolant Level', frequency: 'Monthly', lastChecked: null, status: 'pending' },
  { id: 'y1', label: 'Annual Full Service', frequency: 'Yearly', lastChecked: null, status: 'pending' },
];

const defaultAdminConfig: AdminConfig = {
  razorpayKeyId: '',
  razorpayKeySecret: '',
  proPlanPrice: 499,
  currency: 'INR'
};

// --- Components ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-slate-900 border border-slate-800 rounded-xl shadow-sm", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
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
    <button type={type} onClick={onClick} disabled={disabled} className={cn(baseStyle, variants[variant as keyof typeof variants], className)}>
      {children}
    </button>
  );
};

const Input = ({ label, className, ...props }: any) => (
  <div className={cn("mb-4", className)}>
    {label && <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>}
    <input 
      {...props} 
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-600 disabled:opacity-50"
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

// --- Auth & Onboarding Components ---

const AuthScreen = ({ onLogin }: { onLogin: (user: UserAccount) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', mobile: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Robust Admin Check (Trim + Lowercase)
    const normalizedEmail = formData.email.trim().toLowerCase();
    
    if (normalizedEmail === 'admin@autolog.com' && formData.password === 'admin123') {
      const adminUser: UserAccount = {
        id: 'admin_master',
        email: 'admin@autolog.com',
        mobile: '0000000000',
        password: 'XXX',
        name: 'Super Admin',
        isOnboarded: true,
        role: 'admin',
        isPro: true,
        joinedDate: new Date().toISOString()
      };
      onLogin(adminUser);
      return;
    }

    const users = JSON.parse(localStorage.getItem('autolog_users') || '[]');

    if (isLogin) {
      const user = users.find((u: UserAccount) => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (users.find((u: UserAccount) => u.email === formData.email)) {
        setError('User already exists');
        return;
      }
      const newUser: UserAccount = {
        id: generateId(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        mobile: formData.mobile,
        isOnboarded: false,
        role: 'user',
        isPro: false,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('autolog_users', JSON.stringify([...users, newUser]));
      onLogin(newUser);
    }
  };

  const handleReset = () => {
    if(confirm('This will delete all stored data on this device to fix login issues. Are you sure?')) {
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Car className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">AUTOLOG</h1>
          <p className="text-slate-400">Smart Vehicle Journal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <>
              <Input 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={(e:any) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <Input 
                placeholder="Mobile Number" 
                type="tel"
                value={formData.mobile} 
                onChange={(e:any) => setFormData({...formData, mobile: e.target.value})} 
                required 
              />
            </>
          )}
          <Input 
            type="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={(e:any) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={(e:any) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          
          {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}
          
          <Button type="submit" className="w-full py-3">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-slate-400 hover:text-white text-sm transition-colors mb-4 block w-full"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
          
          <button onClick={handleReset} className="text-xs text-slate-600 hover:text-red-400 flex items-center gap-1 mx-auto">
             <RefreshCw size={10} /> Trouble logging in? Reset Data
          </button>
        </div>
      </Card>
    </div>
  );
};

const OnboardingScreen = ({ user, onComplete }: { user: UserAccount, onComplete: (profile: VehicleProfile) => void }) => {
  const [profile, setProfile] = useState<VehicleProfile>({
    make: '', model: '', variant: '', regNumber: '', vin: '', purchaseDate: '', fuelType: 'Petrol'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 border-slate-800">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Vehicle Setup</h2>
          <p className="text-slate-400">Let's set up your vehicle profile to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Make (Brand)" placeholder="e.g. Toyota" value={profile.make} onChange={(e:any) => setProfile({...profile, make: e.target.value})} required />
          <Input label="Model" placeholder="e.g. Fortuner" value={profile.model} onChange={(e:any) => setProfile({...profile, model: e.target.value})} required />
          <Input label="Variant" placeholder="e.g. Legender 4x4" value={profile.variant} onChange={(e:any) => setProfile({...profile, variant: e.target.value})} required />
          <Input label="Registration Number" placeholder="KA-01-MJ-2024" value={profile.regNumber} onChange={(e:any) => setProfile({...profile, regNumber: e.target.value})} required />
          <Select label="Fuel Type" options={['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']} value={profile.fuelType} onChange={(e:any) => setProfile({...profile, fuelType: e.target.value})} />
          <Input label="Purchase Date" type="date" value={profile.purchaseDate} onChange={(e:any) => setProfile({...profile, purchaseDate: e.target.value})} required />
          
          <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" className="w-full md:w-auto">Complete Setup <ChevronRight size={18} /></Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- Main App Logic ---

export default function AutologApp() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  
  // Data State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<VehicleProfile | null>(null);
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(defaultTasks);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(defaultAdminConfig);
  
  // UI State
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  // Load User Session
  useEffect(() => {
    const savedUser = localStorage.getItem('autolog_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    const savedConfig = localStorage.getItem('autolog_admin_config');
    if (savedConfig) {
      setAdminConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Load User Data when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      const prefix = `autolog_${currentUser.id}`;
      const savedProfile = localStorage.getItem(`${prefix}_profile`);
      const savedTrips = localStorage.getItem(`${prefix}_trips`);
      const savedExpenses = localStorage.getItem(`${prefix}_expenses`);
      const savedTasks = localStorage.getItem(`${prefix}_tasks`);

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedTrips) setTrips(JSON.parse(savedTrips));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } else if (currentUser?.role === 'admin') {
        setActiveTab('admin-dashboard');
    }
  }, [currentUser]);

  // Persist User Data
  useEffect(() => {
    if (currentUser && profile && currentUser.role !== 'admin') {
      const prefix = `autolog_${currentUser.id}`;
      localStorage.setItem(`${prefix}_profile`, JSON.stringify(profile));
      localStorage.setItem(`${prefix}_trips`, JSON.stringify(trips));
      localStorage.setItem(`${prefix}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${prefix}_tasks`, JSON.stringify(tasks));
    }
  }, [currentUser, profile, trips, expenses, tasks]);

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('autolog_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfile(null);
    setTrips([]);
    setExpenses([]);
    localStorage.removeItem('autolog_current_user');
  };

  const handleOnboardingComplete = (vehicleProfile: VehicleProfile) => {
    if (!currentUser) return;
    
    // Update user status
    const updatedUser = { ...currentUser, isOnboarded: true };
    const users = JSON.parse(localStorage.getItem('autolog_users') || '[]');
    const updatedUsers = users.map((u: UserAccount) => u.id === currentUser.id ? updatedUser : u);
    
    localStorage.setItem('autolog_users', JSON.stringify(updatedUsers));
    localStorage.setItem('autolog_current_user', JSON.stringify(updatedUser));
    
    setProfile(vehicleProfile);
    setCurrentUser(updatedUser);
  };

  const handleUpgradeToPro = () => {
      // Mock Payment Processing
      setTimeout(() => {
          if(!currentUser) return;
          const updatedUser = { ...currentUser, isPro: true };
          
          // Update in local storage
          const users = JSON.parse(localStorage.getItem('autolog_users') || '[]');
          const updatedUsers = users.map((u: UserAccount) => u.id === currentUser.id ? updatedUser : u);
          localStorage.setItem('autolog_users', JSON.stringify(updatedUsers));
          
          setCurrentUser(updatedUser);
          localStorage.setItem('autolog_current_user', JSON.stringify(updatedUser));
          setShowProModal(false);
          alert('Welcome to Pro! Your payment was successful.');
      }, 1500);
  };

  const saveAdminConfig = () => {
      localStorage.setItem('autolog_admin_config', JSON.stringify(adminConfig));
      alert('Settings Saved Successfully');
  };

  // Forms State
  const lastOdometer = trips.length > 0 ? Math.max(...trips.map(t => t.endOdometer)) : 0;
  
  const [newTrip, setNewTrip] = useState<Partial<TripLog>>({ 
    date: new Date().toISOString().split('T')[0], type: 'City', startOdometer: lastOdometer 
  });
  
  const [newExpense, setNewExpense] = useState<Partial<ExpenseLog>>({ 
    date: new Date().toISOString().split('T')[0], category: 'Fuel', amount: 0 
  });

  const handleAddTrip = () => {
    if (!newTrip.endOdometer || newTrip.endOdometer <= (newTrip.startOdometer || 0)) {
      alert("End odometer must be greater than start."); return;
    }
    const distance = (newTrip.endOdometer || 0) - (newTrip.startOdometer || 0);
    const trip: TripLog = {
      id: generateId(),
      date: newTrip.date!,
      startOdometer: newTrip.startOdometer || 0,
      endOdometer: newTrip.endOdometer,
      distance,
      type: newTrip.type as any,
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
      category: newExpense.category as any,
      amount: Number(newExpense.amount),
      vendor: newExpense.vendor || '',
      notes: newExpense.notes || ''
    };
    setExpenses([expense, ...expenses]);
    setShowAddExpense(false);
    setNewExpense({ ...newExpense, amount: 0, vendor: '', notes: '' });
  };

  // --- ADMIN Views ---
  
  const AdminDashboard = () => {
      const allUsers: UserAccount[] = JSON.parse(localStorage.getItem('autolog_users') || '[]');
      const [searchTerm, setSearchTerm] = useState('');
      
      const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.includes(searchTerm));
      const totalRevenue = allUsers.filter(u => u.isPro).length * adminConfig.proPlanPrice;

      return (
          <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-white mb-6">Super Admin Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Total Users" value={allUsers.length} icon={<Users size={20}/>} color="blue" />
                  <StatCard label="Pro Users" value={allUsers.filter(u => u.isPro).length} icon={<Shield size={20}/>} color="purple" />
                  <StatCard label="Est. Revenue" value={`₹${totalRevenue}`} icon={<TrendingUp size={20}/>} color="emerald" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white">Registered Users</h3>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-slate-500" />
                            <input 
                                className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Name / Email</th>
                                        <th className="px-6 py-4">Mobile</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-white">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">{user.mobile}</td>
                                            <td className="px-6 py-4">
                                                {user.isPro ? 
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold border border-purple-500/20">
                                                        <Shield size={10} fill="currentColor" /> PRO
                                                    </span> 
                                                : 
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs font-bold">
                                                        FREE
                                                    </span>
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{user.joinedDate || 'N/A'}</td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Settings Panel */}
                <div className="space-y-4">
                    <h3 className="font-bold text-white">Payment Settings</h3>
                    <Card className="p-6 space-y-4 border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                             <CreditCard className="text-emerald-500" size={20} />
                             <h4 className="font-bold text-white">Razorpay Setup</h4>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Configure your API keys to accept payments.</p>
                        
                        <Input 
                            label="Key ID" 
                            type="password"
                            value={adminConfig.razorpayKeyId} 
                            onChange={(e:any) => setAdminConfig({...adminConfig, razorpayKeyId: e.target.value})} 
                            placeholder="rzp_test_..."
                        />
                        <Input 
                            label="Key Secret" 
                            type="password"
                            value={adminConfig.razorpayKeySecret} 
                            onChange={(e:any) => setAdminConfig({...adminConfig, razorpayKeySecret: e.target.value})} 
                        />
                        <div className="pt-4 border-t border-slate-800">
                             <Input 
                                label="Pro Plan Price (₹)" 
                                type="number"
                                value={adminConfig.proPlanPrice} 
                                onChange={(e:any) => setAdminConfig({...adminConfig, proPlanPrice: Number(e.target.value)})} 
                            />
                        </div>
                        <Button onClick={saveAdminConfig} className="w-full bg-emerald-600 hover:bg-emerald-500">Save Configuration</Button>
                    </Card>
                </div>
              </div>
          </div>
      );
  };

  // --- USER Views ---

  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;
  
  // Render Admin View
  if (currentUser.role === 'admin') {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex">
            <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                             <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white tracking-tight">ADMIN</h1>
                            <p className="text-xs text-slate-500">Super Admin Console</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 space-y-2">
                    <NavButton id="admin-dashboard" icon={LayoutDashboard} label="Overview" active={activeTab} set={setActiveTab} />
                </div>
                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-bold text-white">Super Admin</p>
                        <p className="text-xs text-slate-500">admin@autolog.com</p>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut size={16} /> Sign Out
                    </Button>
                </div>
            </aside>
            <main className="md:ml-64 flex-1 p-8 pt-8 min-h-screen">
                 <AdminDashboard />
            </main>
        </div>
      );
  }

  // Regular User Logic continues here
  if (!currentUser.isOnboarded) return <OnboardingScreen user={currentUser} onComplete={handleOnboardingComplete} />;
  if (!profile) return <div className="text-white p-10">Loading Profile...</div>;

  const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // User Dashboard Quick Actions
  const QuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="p-4 border-l-4 border-l-blue-500 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white">Log a Trip</h3>
            <Car size={20} className="text-blue-400" />
          </div>
          {showAddTrip ? (
             <div className="animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="grid grid-cols-2 gap-2 mb-2">
                 <Input className="mb-0" type="number" placeholder="End Odo" value={newTrip.endOdometer || ''} onChange={(e:any) => setNewTrip({...newTrip, endOdometer: Number(e.target.value)})} />
                 <Input className="mb-0" type="text" placeholder="Notes" value={newTrip.notes} onChange={(e:any) => setNewTrip({...newTrip, notes: e.target.value})} />
               </div>
               <div className="flex gap-2">
                 <Button onClick={handleAddTrip} className="flex-1 py-1 text-sm h-8">Save</Button>
                 <Button variant="secondary" onClick={() => setShowAddTrip(false)} className="py-1 text-sm h-8">Cancel</Button>
               </div>
             </div>
          ) : (
            <>
               <p className="text-sm text-slate-400 mb-3">Last Odo: <span className="text-white font-mono">{lastOdometer} km</span></p>
               <Button onClick={() => { setNewTrip({...newTrip, startOdometer: lastOdometer}); setShowAddTrip(true); }} className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 shadow-none">
                  <Plus size={16} /> New Trip Log
               </Button>
            </>
          )}
        </div>
      </Card>

      <Card className="p-4 border-l-4 border-l-emerald-500 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white">Add Expense</h3>
            <DollarSign size={20} className="text-emerald-400" />
          </div>
          {showAddExpense ? (
             <div className="animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="grid grid-cols-2 gap-2 mb-2">
                 <Input className="mb-0" type="number" placeholder="Amount" value={newExpense.amount || ''} onChange={(e:any) => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
                 <Select className="mb-0 h-10 py-1" options={['Fuel', 'Toll', 'Parking', 'Other']} value={newExpense.category} onChange={(e:any) => setNewExpense({...newExpense, category: e.target.value})} />
               </div>
               <div className="flex gap-2">
                 <Button onClick={handleAddExpense} className="bg-emerald-600 hover:bg-emerald-500 flex-1 py-1 text-sm h-8">Save</Button>
                 <Button variant="secondary" onClick={() => setShowAddExpense(false)} className="py-1 text-sm h-8">Cancel</Button>
               </div>
             </div>
          ) : (
            <>
               <p className="text-sm text-slate-400 mb-3">Total Spent: <span className="text-white font-mono">₹{totalSpent}</span></p>
               <Button onClick={() => setShowAddExpense(true)} className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 shadow-none">
                  <Plus size={16} /> New Expense
               </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex relative">
      
      {/* Pro Modal */}
      {showProModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <Card className="w-full max-w-md p-0 overflow-hidden border-purple-500/30">
                  <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 text-center">
                      <Shield className="w-16 h-16 text-white mx-auto mb-4 opacity-90" strokeWidth={1.5} />
                      <h2 className="text-2xl font-bold text-white mb-2">Upgrade to PRO</h2>
                      <p className="text-purple-200 text-sm">Unlock the full power of Autolog</p>
                  </div>
                  <div className="p-8 space-y-6">
                      <div className="space-y-3">
                          <div className="flex gap-3 items-center text-slate-300"><CheckCircle size={18} className="text-purple-400"/> Cloud Backup</div>
                          <div className="flex gap-3 items-center text-slate-300"><CheckCircle size={18} className="text-purple-400"/> Export PDF Reports</div>
                          <div className="flex gap-3 items-center text-slate-300"><CheckCircle size={18} className="text-purple-400"/> Multiple Vehicles</div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                          <div>
                              <p className="text-sm text-slate-500">Total Amount</p>
                              <p className="text-2xl font-bold text-white">₹{adminConfig.proPlanPrice} <span className="text-sm font-normal text-slate-500">/year</span></p>
                          </div>
                      </div>
                      
                      <Button onClick={handleUpgradeToPro} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50">
                          Pay Now (Secure)
                      </Button>
                      <button onClick={() => setShowProModal(false)} className="w-full text-center text-sm text-slate-500 hover:text-slate-300 mt-2">No thanks, I'll stay on free plan</button>
                  </div>
              </Card>
          </div>
      )}

      {/* Sidebar Desktop */}
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
        
        <div className="flex-1 p-4 space-y-2">
          {!currentUser.isPro && (
            <div 
                onClick={() => setShowProModal(true)}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 cursor-pointer group hover:border-purple-500/50 transition-all"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-purple-400" />
                    <span className="font-bold text-white text-sm">Go PRO</span>
                </div>
                <p className="text-xs text-purple-200 mb-2">Get cloud sync & exports.</p>
                <div className="text-xs font-bold text-white bg-purple-600 px-2 py-1 rounded inline-block">Upgrade</div>
            </div>
          )}

          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4 mb-2 mt-4">Menu</div>
          <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activeTab} set={setActiveTab} />
          <NavButton id="logs" icon={FileText} label="Trip Logs" active={activeTab} set={setActiveTab} />
          <NavButton id="expenses" icon={DollarSign} label="Expenses" active={activeTab} set={setActiveTab} />
          <NavButton id="maintenance" icon={Wrench} label="Maintenance" active={activeTab} set={setActiveTab} />
          <NavButton id="profile" icon={Settings} label="Vehicle Profile" active={activeTab} set={setActiveTab} />
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase relative">
                 {currentUser.name.charAt(0)}
                 {currentUser.isPro && <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5 border-2 border-slate-900"><Shield size={8} fill="currentColor" className="text-white"/></div>}
               </div>
               <div className="overflow-hidden">
                 <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                    {currentUser.isPro && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1 rounded border border-purple-500/20">PRO</span>}
                 </div>
                 <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
               </div>
             </div>
             <div className="text-xs text-slate-500 flex items-center gap-1">
               <Smartphone size={10} /> {currentUser.mobile}
             </div>
           </div>
           <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
             <LogOut size={16} /> Sign Out
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 pt-20 md:pt-8 min-h-screen pb-24 md:pb-8 w-full max-w-[100vw] overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-20 px-4 py-3 flex items-center justify-between">
           <span className="font-bold text-white flex items-center gap-2"><Car size={18} className="text-blue-500"/> AUTOLOG</span>
           <button onClick={handleLogout}><LogOut size={18} className="text-slate-400"/></button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
            <QuickActions />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Km" value={`${totalDistance} km`} icon={<Gauge size={20}/>} color="blue" />
              <StatCard label="Spent" value={`₹${totalSpent}`} icon={<DollarSign size={20}/>} color="emerald" />
              <StatCard label="Trips" value={trips.length} icon={<LayoutDashboard size={20}/>} color="purple" />
              <StatCard label="Vehicle" value={profile.regNumber} icon={<Car size={20}/>} color="slate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                   {[...trips.map(t => ({...t, type: 'trip'})), ...expenses.map(e => ({...e, type: 'expense'}))]
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-800 rounded">
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
                    {trips.length === 0 && expenses.length === 0 && <p className="text-slate-500 text-sm">No recent activity.</p>}
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-bold text-white mb-4">Maintenance Health</h3>
                <div className="space-y-2">
                  {tasks.slice(0,4).map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${t.status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                         <span className="text-sm text-slate-300">{t.label}</span>
                      </div>
                      <span className="text-xs text-slate-500">{t.status === 'ok' ? 'Good' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
           <Card className="p-8 max-w-2xl mx-auto">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500">
                 {profile.make.charAt(0)}
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-white">{profile.make} {profile.model}</h2>
                 <p className="text-slate-400">{profile.variant}</p>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Registration" value={profile.regNumber} icon={<FileText size={16}/>} />
                <InfoItem label="Fuel Type" value={profile.fuelType} icon={<Fuel size={16}/>} />
                <InfoItem label="VIN" value={profile.vin || 'Not Set'} icon={<Lock size={16}/>} />
                <InfoItem label="Purchase Date" value={profile.purchaseDate} icon={<CalendarIcon size={16}/>} />
             </div>
             
             <div className="mt-8 pt-6 border-t border-slate-800">
               <h3 className="text-lg font-bold text-white mb-4">Owner Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Name" value={currentUser.name} icon={<User size={16}/>} />
                  <InfoItem label="Mobile" value={currentUser.mobile} icon={<Smartphone size={16}/>} />
                  <InfoItem label="Email" value={currentUser.email} icon={<Mail size={16}/>} />
               </div>
             </div>
           </Card>
        )}

        {/* Other tabs can be expanded similarly, keeping logic from previous version but isolated */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-white">Expense History</h2>
             <div className="overflow-hidden rounded-xl border border-slate-800">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-4 py-3">Date</th>
                     <th className="px-4 py-3">Category</th>
                     <th className="px-4 py-3 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                   {expenses.map(e => (
                     <tr key={e.id}>
                       <td className="px-4 py-3">{e.date}</td>
                       <td className="px-4 py-3">{e.category}</td>
                       <td className="px-4 py-3 text-right text-emerald-400 font-bold">₹{e.amount}</td>
                     </tr>
                   ))}
                   {expenses.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">No expenses yet.</td></tr>}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        
        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-20">
          <MobileNavBtn id="dashboard" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="logs" icon={FileText} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="expenses" icon={DollarSign} active={activeTab} set={setActiveTab} />
          <MobileNavBtn id="profile" icon={User} active={activeTab} set={setActiveTab} />
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

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

const InfoItem = ({ label, value, icon }: any) => (
  <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
    <div className="mt-1 text-blue-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
);

const CalendarIcon = ({size, className}: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
