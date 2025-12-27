import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Fuel, 
  Wrench, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Save, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Droplet, 
  Gauge, 
  Calendar,
  DollarSign,
  FileText,
  Activity,
  Zap,
  Thermometer,
  Disc,
  Info
} from 'lucide-react';

// --- Types ---

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

type VehicleProfile = {
  make: string;
  model: string;
  variant: string;
  regNumber: string;
  vin: string;
  purchaseDate: string;
  fuelType: string;
};

type MaintenanceTask = {
  id: string;
  label: string;
  frequency: 'Daily' | 'Monthly' | 'Yearly';
  lastChecked: string | null;
  status: 'pending' | 'ok' | 'issue';
};

// --- Mock Data / Defaults ---

const defaultProfile: VehicleProfile = {
  make: 'Toyota',
  model: 'Fortuner',
  variant: 'Legender 4x4',
  regNumber: 'KA-01-MJ-2024',
  vin: '',
  purchaseDate: '2024-01-15',
  fuelType: 'Diesel',
};

const defaultTasks: MaintenanceTask[] = [
  { id: 'd1', label: 'Tyre Pressure Check', frequency: 'Daily', lastChecked: null, status: 'pending' },
  { id: 'd2', label: 'Visual Body Inspection', frequency: 'Daily', lastChecked: null, status: 'pending' },
  { id: 'd3', label: 'Warning Lights Check', frequency: 'Daily', lastChecked: null, status: 'pending' },
  { id: 'm1', label: 'Engine Oil Level', frequency: 'Monthly', lastChecked: null, status: 'pending' },
  { id: 'm2', label: 'Coolant Level', frequency: 'Monthly', lastChecked: null, status: 'pending' },
  { id: 'm3', label: 'Brake Fluid Check', frequency: 'Monthly', lastChecked: null, status: 'pending' },
  { id: 'm4', label: 'Wash Wiper Fluid', frequency: 'Monthly', lastChecked: null, status: 'pending' },
  { id: 'y1', label: 'Annual Full Service', frequency: 'Yearly', lastChecked: null, status: 'pending' },
  { id: 'y2', label: 'Insurance Renewal', frequency: 'Yearly', lastChecked: null, status: 'pending' },
  { id: 'y3', label: 'Tyre Rotation', frequency: 'Yearly', lastChecked: null, status: 'pending' },
];

const warningLights = [
  { id: 1, name: 'Check Engine', icon: <Activity className="text-yellow-500" />, severity: 'Medium', desc: 'Engine malfunction. Drive moderately to service.' },
  { id: 2, name: 'Oil Pressure', icon: <Droplet className="text-red-500" />, severity: 'Critical', desc: 'Low oil pressure. Stop immediately.' },
  { id: 3, name: 'Battery', icon: <Zap className="text-red-500" />, severity: 'Critical', desc: 'Charging system failure. Car may stop soon.' },
  { id: 4, name: 'Temperature', icon: <Thermometer className="text-red-500" />, severity: 'Critical', desc: 'Engine overheating. Stop and let cool.' },
  { id: 5, name: 'Brake/ABS', icon: <Disc className="text-yellow-500" />, severity: 'Medium', desc: 'Brake system issue. Drive with caution.' },
  { id: 6, name: 'TPMS', icon: <Gauge className="text-yellow-500" />, severity: 'Low', desc: 'Low tyre pressure detected.' },
];

// --- Components ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '' }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>
    <input 
      {...props} 
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-600"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>
    <select 
      {...props} 
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// --- Main App ---

export default function AutologApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State
  const [profile, setProfile] = useState<VehicleProfile>(defaultProfile);
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(defaultTasks);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('autolog_profile');
    const savedTrips = localStorage.getItem('autolog_trips');
    const savedExpenses = localStorage.getItem('autolog_expenses');
    const savedTasks = localStorage.getItem('autolog_tasks');

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // Save to local storage on change
  useEffect(() => { localStorage.setItem('autolog_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('autolog_trips', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('autolog_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('autolog_tasks', JSON.stringify(tasks)); }, [tasks]);

  // Derived Stats
  const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const fuelSpent = expenses.filter(e => e.category === 'Fuel').reduce((acc, e) => acc + e.amount, 0);
  const serviceSpent = expenses.filter(e => e.category === 'Service').reduce((acc, e) => acc + e.amount, 0);
  
  const lastOdometer = trips.length > 0 
    ? Math.max(...trips.map(t => t.endOdometer)) 
    : 0;

  // Forms State
  const [newTrip, setNewTrip] = useState<Partial<TripLog>>({ 
    date: new Date().toISOString().split('T')[0], 
    type: 'City',
    startOdometer: lastOdometer
  });

  const [newExpense, setNewExpense] = useState<Partial<ExpenseLog>>({ 
    date: new Date().toISOString().split('T')[0], 
    category: 'Fuel',
    amount: 0
  });

  // Handlers
  const handleAddTrip = () => {
    if (!newTrip.endOdometer || newTrip.endOdometer <= (newTrip.startOdometer || 0)) {
      alert("End odometer must be greater than start.");
      return;
    }
    const distance = (newTrip.endOdometer || 0) - (newTrip.startOdometer || 0);
    const trip: TripLog = {
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { 
        ...t, 
        lastChecked: t.lastChecked && t.status === 'ok' ? null : new Date().toISOString().split('T')[0],
        status: t.status === 'ok' ? 'pending' : 'ok'
      } : t
    ));
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Odometer</p>
              <h3 className="text-3xl font-bold text-white mt-1">{lastOdometer.toLocaleString()} <span className="text-lg text-slate-500 font-normal">km</span></h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Gauge size={24} /></div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Spent</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹{totalSpent.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400"><DollarSign size={24} /></div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Fuel Cost</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹{fuelSpent.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400"><Fuel size={24} /></div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Trips</p>
              <h3 className="text-3xl font-bold text-white mt-1">{trips.length}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><LayoutDashboard size={24} /></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" size={20} /> Recent Activity
          </h3>
          <div className="space-y-4">
            {trips.length === 0 && expenses.length === 0 ? (
              <p className="text-slate-500 italic text-center py-8">No activity recorded yet. Start logging!</p>
            ) : (
              [...trips.map(t => ({...t, type: 'trip'})), ...expenses.map(e => ({...e, type: 'expense'}))]
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${item.type === 'trip' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {item.type === 'trip' ? <Car size={18} /> : <DollarSign size={18} />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.type === 'trip' ? `Drive: ${item.distance} km` : `Expense: ${item.category}`}</p>
                        <p className="text-slate-500 text-xs">{item.date} • {item.notes || (item.type === 'trip' ? item.type : item.vendor) || 'No notes'}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${item.type === 'trip' ? 'text-slate-300' : 'text-emerald-400'}`}>
                      {item.type === 'trip' ? `+${item.distance} km` : `-₹${item.amount}`}
                    </span>
                  </div>
                ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Wrench className="text-orange-400" size={20} /> Pending Maintenance
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'pending').slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.frequency === 'Daily' ? 'bg-blue-400' : task.frequency === 'Monthly' ? 'bg-orange-400' : 'bg-red-400'}`} />
                  <span className="text-slate-300 text-sm">{task.label}</span>
                </div>
                <button onClick={() => toggleTask(task.id)} className="text-xs bg-slate-700 hover:bg-green-600 text-slate-300 hover:text-white px-2 py-1 rounded transition-colors">
                  Done
                </button>
              </div>
            ))}
            {tasks.filter(t => t.status === 'pending').length === 0 && (
              <div className="text-center py-8 text-emerald-500 flex flex-col items-center">
                <div className="bg-emerald-500/10 p-3 rounded-full mb-2">
                  <Checkmark size={24} /> 
                </div>
                <p>All clear! Good job.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const LogsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Daily Logs</h2>
        <Button onClick={() => setShowAddTrip(!showAddTrip)}>
          <Plus size={18} /> New Trip
        </Button>
      </div>

      {showAddTrip && (
        <Card className="p-6 bg-slate-800 border-blue-500/30 border">
          <h3 className="text-lg font-bold text-white mb-4">Add New Trip</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" label="Date" value={newTrip.date} onChange={(e: any) => setNewTrip({...newTrip, date: e.target.value})} />
            <Select label="Trip Type" options={['City', 'Highway', 'Office', 'Personal']} value={newTrip.type} onChange={(e: any) => setNewTrip({...newTrip, type: e.target.value})} />
            <Input type="number" label="Start Odometer" value={newTrip.startOdometer} onChange={(e: any) => setNewTrip({...newTrip, startOdometer: Number(e.target.value)})} />
            <Input type="number" label="End Odometer" value={newTrip.endOdometer || ''} onChange={(e: any) => setNewTrip({...newTrip, endOdometer: Number(e.target.value)})} />
            <div className="md:col-span-2">
              <Input label="Notes (Optional)" placeholder="Destination, purpose..." value={newTrip.notes} onChange={(e: any) => setNewTrip({...newTrip, notes: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setShowAddTrip(false)}>Cancel</Button>
            <Button onClick={handleAddTrip}>Save Log</Button>
          </div>
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Odometer (Start - End)</th>
              <th className="px-6 py-4 text-right">Distance</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-800">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{trip.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${trip.type === 'Highway' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {trip.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-400">{trip.startOdometer} - {trip.endOdometer}</td>
                <td className="px-6 py-4 text-right font-bold text-white">{trip.distance} km</td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{trip.notes}</td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No trips recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ExpensesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Expense Tracker</h2>
        <Button onClick={() => setShowAddExpense(!showAddExpense)} className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50">
          <Plus size={18} /> Add Expense
        </Button>
      </div>

      {showAddExpense && (
        <Card className="p-6 bg-slate-800 border-emerald-500/30 border">
          <h3 className="text-lg font-bold text-white mb-4">Add Expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" label="Date" value={newExpense.date} onChange={(e: any) => setNewExpense({...newExpense, date: e.target.value})} />
            <Select label="Category" options={['Fuel', 'Toll', 'Parking', 'Wash', 'Service', 'Insurance', 'Fine', 'Accessory']} value={newExpense.category} onChange={(e: any) => setNewExpense({...newExpense, category: e.target.value})} />
            <Input type="number" label="Amount (₹)" value={newExpense.amount || ''} onChange={(e: any) => setNewExpense({...newExpense, amount: e.target.value})} />
            <Input label="Vendor / Location" placeholder="Shell Station, Mechanic..." value={newExpense.vendor} onChange={(e: any) => setNewExpense({...newExpense, vendor: e.target.value})} />
            <div className="md:col-span-2">
              <Input label="Notes" placeholder="Details..." value={newExpense.notes} onChange={(e: any) => setNewExpense({...newExpense, notes: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setShowAddExpense(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={handleAddExpense}>Save Expense</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 overflow-x-auto rounded-xl border border-slate-700 shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{expense.date}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      {expense.category === 'Fuel' && <Fuel size={14} className="text-orange-400"/>}
                      {expense.category === 'Service' && <Wrench size={14} className="text-blue-400"/>}
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{expense.vendor || '-'}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">₹{expense.amount}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No expenses recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-4">Cost Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Fuel', val: fuelSpent, color: 'bg-orange-500' },
                { label: 'Service', val: serviceSpent, color: 'bg-blue-500' },
                { label: 'Other', val: totalSpent - fuelSpent - serviceSpent, color: 'bg-slate-500' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{stat.label}</span>
                    <span className="text-white font-bold">₹{stat.val.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`${stat.color} h-2 rounded-full`} 
                      style={{ width: `${totalSpent > 0 ? (stat.val / totalSpent) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-sm">Cost per KM</span>
                <span className="text-xl font-bold text-white">
                  ₹{totalDistance > 0 ? (totalSpent / totalDistance).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const MaintenanceView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Maintenance Log</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Daily', 'Monthly', 'Yearly'].map(freq => (
          <Card key={freq} className="p-0 overflow-hidden">
            <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-white">{freq} Checks</h3>
              <span className="text-xs font-mono text-slate-500">
                {tasks.filter(t => t.frequency === freq && t.status === 'ok').length} / {tasks.filter(t => t.frequency === freq).length}
              </span>
            </div>
            <div className="divide-y divide-slate-700/50">
              {tasks.filter(t => t.frequency === freq).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${task.status === 'ok' ? 'bg-slate-800/50 opacity-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${task.status === 'ok' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                      {task.status === 'ok' && <Checkmark size={14} className="text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${task.status === 'ok' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{task.label}</p>
                      {task.lastChecked && <p className="text-xs text-slate-500">Last: {task.lastChecked}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" /> Dashboard Warning Lights Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warningLights.map(light => (
            <div key={light.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex gap-4 items-start">
              <div className="mt-1 p-2 bg-slate-800 rounded-lg">{light.icon}</div>
              <div>
                <h4 className="font-bold text-white text-sm">{light.name}</h4>
                <p className={`text-xs font-bold uppercase mb-1 ${light.severity === 'Critical' ? 'text-red-500' : light.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'}`}>
                  {light.severity}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{light.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const SettingsView = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Car className="text-blue-500" /> Vehicle Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Make" value={profile.make} onChange={(e: any) => setProfile({...profile, make: e.target.value})} />
          <Input label="Model" value={profile.model} onChange={(e: any) => setProfile({...profile, model: e.target.value})} />
          <Input label="Variant" value={profile.variant} onChange={(e: any) => setProfile({...profile, variant: e.target.value})} />
          <Input label="Registration Number" value={profile.regNumber} onChange={(e: any) => setProfile({...profile, regNumber: e.target.value})} />
          <Input label="VIN / Chassis No." value={profile.vin} onChange={(e: any) => setProfile({...profile, vin: e.target.value})} placeholder="Optional" />
          <Select label="Fuel Type" options={['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']} value={profile.fuelType} onChange={(e: any) => setProfile({...profile, fuelType: e.target.value})} />
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700">
           <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-blue-200 text-sm flex gap-3">
             <Info className="shrink-0" size={20} />
             <p>This data is stored locally in your browser. Clearing your cache will remove this data. To create a permanent account, the Pro version is required.</p>
           </div>
           
           <div className="mt-6 flex justify-between items-center">
             <Button variant="outline" className="text-red-400 border-red-900/30 hover:bg-red-900/20" onClick={() => {
               if(confirm('Are you sure? This will delete all logs.')) {
                 localStorage.clear();
                 window.location.reload();
               }
             }}>
               <Trash2 size={16} /> Reset App Data
             </Button>
             <Button>
               <Save size={16} /> Save Profile
             </Button>
           </div>
        </div>
      </Card>
    </div>
  );

  // --- Layout ---

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar (Desktop) */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Car className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">AUTOLOG</h1>
              <p className="text-xs text-slate-500">Edition 1.0 (Web)</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4 mb-2 mt-4">Menu</div>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="logs" icon={FileText} label="Daily Logs" />
          <NavItem id="expenses" icon={DollarSign} label="Expenses" />
          <NavItem id="maintenance" icon={Wrench} label="Maintenance" />
          
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4 mb-2 mt-8">System</div>
          <NavItem id="settings" icon={Settings} label="Vehicle Profile" />
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
               {profile.make.substring(0,1)}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-white truncate">{profile.model}</p>
               <p className="text-xs text-slate-500 truncate">{profile.regNumber}</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-800 z-20 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
              <Car className="text-white" size={18} />
            </div>
            <span className="font-bold text-white">AUTOLOG</span>
         </div>
         <button className="p-2 text-slate-400" onClick={() => setActiveTab('settings')}>
           <Settings size={20} />
         </button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 z-20 flex justify-around p-2">
        <MobileNavItem id="dashboard" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
        <MobileNavItem id="logs" icon={FileText} active={activeTab} set={setActiveTab} />
        <MobileNavItem id="expenses" icon={DollarSign} active={activeTab} set={setActiveTab} />
        <MobileNavItem id="maintenance" icon={Wrench} active={activeTab} set={setActiveTab} />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen pb-24 md:pb-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'logs' && <LogsView />}
        {activeTab === 'expenses' && <ExpensesView />}
        {activeTab === 'maintenance' && <MaintenanceView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

    </div>
  );
}

const MobileNavItem = ({ id, icon: Icon, active, set }: any) => (
  <button 
    onClick={() => set(id)}
    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
      active === id ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500'
    }`}
  >
    <Icon size={20} />
  </button>
);

const Checkmark = ({size = 24, className = ""}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
