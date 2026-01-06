import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our data
export interface Client {
  id: string;
  company: string;
  contact: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  source: string;
  status: string;
  salesRep: string;
  nextContactDate: string;
}

export interface Activity {
  id: string;
  date: string;
  name: string;
  company: string;
  description: string;
  type: string;
}

export interface Deal {
  id: string;
  date: string;
  value: string;
  status: string;
  description: string;
  company: string;
  contact: string;
}

export interface Task {
  id: string;
  dueDate: string;
  category: string;
  owner: string;
  task: string;
  priority: string;
  status: string;
  overdue?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  value: string;
  company: string;
  description: string;
  status: string;
}

export interface Gift {
  id: string;
  date: string;
  client: string;
  recipient: string;
  description: string;
  value: string;
  occasion: string;
}

export interface AppSettings {
  dashboardTitle: string;
  companyName: string;
  address: string;
  cityStateZip: string;
  country: string;
  logo: string | null;
}

interface DataContextType {
  clients: Client[];
  activities: Activity[];
  deals: Deal[];
  tasks: Task[];
  invoices: Invoice[];
  gifts: Gift[];
  settings: AppSettings;
  
  addClient: (client: Client) => void;
  updateClient: (updatedClient: Client) => void;
  deleteClient: (id: string) => void;

  addActivity: (activity: Activity) => void;
  
  addDeal: (deal: Deal) => void;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (id: string) => void;

  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;

  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;

  addGift: (gift: Gift) => void;
  updateGift: (gift: Gift) => void;
  deleteGift: (id: string) => void;

  updateSettings: (settings: AppSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data Imports
import { recentActivity, recentDeals, upcomingTasks, upcomingInvoices } from '../data';

const initialClientsData: Client[] = [
  { id: 'ID-0001', company: 'Nova Creative Co.', contact: 'Sophie Reynolds', jobTitle: 'Marketing Manager', email: 'sophie@novacreative.co', phone: '(212) 555-0198', location: 'New York, NY', source: 'WebForm', status: 'Prospect', salesRep: 'David Smith', nextContactDate: '5/13/2025' },
  { id: 'ID-0002', company: 'Summit Solutions', contact: 'Mark Thompson', jobTitle: 'Creative Director', email: 'mark@summitsolutions.com', phone: '(310) 555-4832', location: 'Los Angeles, CA', source: 'LinkedIn', status: 'Prospect', salesRep: 'Emily Reyes', nextContactDate: '5/16/2025' },
  { id: 'ID-0003', company: 'Brightside Marketing', contact: 'Ava Patel', jobTitle: 'Operations Manager', email: 'ava@brightsidemarketing.com', phone: '(415) 555-7264', location: 'San Francisco, CA', source: 'Referral', status: 'Prospect', salesRep: 'Emily Reyes', nextContactDate: '5/27/2025' },
  { id: 'ID-0004', company: 'Horizon Legal Group', contact: 'Daniel Nguyen', jobTitle: 'Chief Executive Officer', email: 'daniel@horizonlegal.com', phone: '(646) 555-2045', location: 'Brooklyn, NY', source: 'Cold Outreach', status: 'Cold Lead', salesRep: 'David Smith', nextContactDate: '5/28/2025' },
  { id: 'ID-0005', company: 'Blue Fern Interiors', contact: 'Isla Morgan', jobTitle: 'Business Development Lead', email: 'isla@blueferninteriors.com', phone: '(305) 555-7710', location: 'Miami, FL', source: 'Job Fair', status: 'Prospect', salesRep: 'Jess Patel', nextContactDate: '5/29/2025' },
  { id: 'ID-0006', company: 'Stellar Events & Co.', contact: 'Jake Turner', jobTitle: 'Social Media Coordinator', email: 'jake@stellarevents.co', phone: '(312) 555-6601', location: 'Chicago, IL', source: 'Website Chat', status: 'Cold Lead', salesRep: 'David Smith', nextContactDate: '5/30/2025' },
  { id: 'ID-0010', company: 'Radiant Skin Clinic', contact: 'Grace Bennett', jobTitle: 'Office Manager', email: 'grace@radiantskinclinic.com', phone: '(404) 555-2388', location: 'Atlanta, GA', source: 'Job Fair', status: 'Inactive', salesRep: 'Emily Reyes', nextContactDate: '6/3/2025' },
  { id: 'ID-0014', company: 'Jetstream Media', contact: 'Ethan James', jobTitle: 'Financial Consultant', email: 'ethan@jetstreammedia.com', phone: '(303) 555-8376', location: 'Denver, CO', source: 'Cold Outreach', status: 'Inactive', salesRep: 'Jess Patel', nextContactDate: '6/7/2025' },
  { id: 'ID-0015', company: 'Lumière Photography', contact: 'Chloe Anderson', jobTitle: 'Design Lead', email: 'chloe@lumierephotography.com', phone: '(713) 555-3340', location: 'Houston, TX', source: 'WebForm', status: 'Cold Lead', salesRep: 'David Smith', nextContactDate: '6/8/2025' },
  { id: 'ID-0020', company: 'Elevate Financial Co.', contact: 'Sophia Green', jobTitle: 'Financial Consultant', email: 'sophia@elevatefinancial.co', phone: '(305) 555-4430', location: 'Miami, FL', source: 'Referral', status: 'Inactive', salesRep: 'Jess Patel', nextContactDate: '6/13/2025' },
  { id: 'ID-0021', company: 'The Social Nest', contact: 'Daniel Brooks', jobTitle: 'Social Media Strategist', email: 'daniel@thesocialnest.com', phone: '(646) 555-7290', location: 'Brooklyn, NY', source: 'Cold Outreach', status: 'Prospect', salesRep: 'Emily Reyes', nextContactDate: '6/14/2025' },
  { id: 'ID-0022', company: 'Maple Row Publishing', contact: 'Emily Carter', jobTitle: 'Publishing Coordinator', email: 'emily@maplerowpublishing.com', phone: '(206) 555-3381', location: 'Seattle, WA', source: 'Job Fair', status: 'Onboarding', salesRep: 'Emily Reyes', nextContactDate: '6/15/2025' },
  { id: 'ID-0023', company: 'Urban Grid Agency', contact: 'Michael Reyes', jobTitle: 'Project Manager', email: 'michael@urbangridagency.com', phone: '(480) 555-9924', location: 'Phoenix, AZ', source: 'Website Chat', status: 'Inactive', salesRep: 'Emily Reyes', nextContactDate: '6/16/2025' },
  { id: 'ID-0024', company: 'Clearwater Coaching', contact: 'Hannah Nguyen', jobTitle: 'Executive Coach', email: 'hannah@clearwatercoaching.co', phone: '(702) 555-1407', location: 'Las Vegas, NV', source: 'Internal Event', status: 'Inactive', salesRep: 'Jess Patel', nextContactDate: '6/17/2025' },
  { id: 'ID-0025', company: 'Indigo Legal Services', contact: 'Jason Bell', jobTitle: 'Senior Legal Advisor', email: 'jason@indigolegal.com', phone: '(212) 555-6853', location: 'Manhattan, NY', source: 'Referral', status: 'Cold Lead', salesRep: 'Jess Patel', nextContactDate: '6/18/2025' },
];

const initialGiftsData: Gift[] = [
  { id: 'G-001', date: '5/12/2025', client: 'Nova Creative Co.', recipient: 'Sophie Reynolds', description: 'Branded Coffee Mug', value: '25.00', occasion: 'Kick-off' },
  { id: 'G-002', date: '5/15/2025', client: 'Summit Solutions', recipient: 'Mark Thompson', description: 'Premium Notebook', value: '45.00', occasion: 'Birthday' },
  { id: 'G-003', date: '5/20/2025', client: 'Lumière Photography', recipient: 'Chloe Anderson', description: 'Gift Basket', value: '150.00', occasion: 'Deal Closed' },
];

// Helper hook for LocalStorage persistence with Error Handling
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      // Return default value if parsing fails to prevent app crash
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
       console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use Sticky State to persist data to localStorage
  const [clients, setClients] = useStickyState<Client[]>(initialClientsData, 'crm_clients');
  
  const [activities, setActivities] = useStickyState<Activity[]>(recentActivity.map((a, i) => ({
    id: `ACT-${i}`,
    ...a, 
    type: a.description.split(':')[0]
  })), 'crm_activities');
  
  const [deals, setDeals] = useStickyState<Deal[]>(recentDeals.map((d, i) => ({
    id: `DL-${i}`,
    ...d, 
    company: 'Unknown', 
    contact: 'Unknown'
  })), 'crm_deals');
  
  const [tasks, setTasks] = useStickyState<Task[]>(upcomingTasks.map((t, i) => ({
    id: `TSK-${i}`,
    ...t,
    priority: i % 3 === 0 ? 'High' : 'Medium',
    status: t.overdue ? 'Overdue' : 'Pending'
  })), 'crm_tasks');
  
  const [invoices, setInvoices] = useStickyState<Invoice[]>(upcomingInvoices.map((inv, i) => ({
    id: `INV-${i}`,
    invoiceNumber: `INV-000${i+1}`,
    ...inv,
    status: i === 0 ? 'Pending' : 'Paid'
  })), 'crm_invoices');

  const [gifts, setGifts] = useStickyState<Gift[]>(initialGiftsData, 'crm_gifts');

  const [settings, setSettings] = useStickyState<AppSettings>({
    dashboardTitle: 'ABC Consulting Client Dashboard',
    companyName: 'Your Company Name',
    address: '123 Business Rd',
    cityStateZip: 'New York, NY 10012',
    country: 'USA',
    logo: null
  }, 'crm_settings');

  // Client Methods
  const addClient = (client: Client) => setClients(prev => [...prev, client]);
  const updateClient = (updatedClient: Client) => setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  // Activity Methods
  const addActivity = (activity: Activity) => setActivities(prev => [activity, ...prev]);

  // Deal Methods
  const addDeal = (deal: Deal) => setDeals(prev => [deal, ...prev]);
  const updateDeal = (deal: Deal) => setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
  const deleteDeal = (id: string) => setDeals(prev => prev.filter(d => d.id !== id));

  // Invoice Methods
  const addInvoice = (invoice: Invoice) => setInvoices(prev => [invoice, ...prev]);
  const updateInvoice = (invoice: Invoice) => setInvoices(prev => prev.map(i => i.id === invoice.id ? invoice : i));
  const deleteInvoice = (id: string) => setInvoices(prev => prev.filter(i => i.id !== id));

  // Task Methods
  const addTask = (task: Task) => setTasks(prev => [task, ...prev]);
  const updateTask = (task: Task) => setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  // Gift Methods
  const addGift = (gift: Gift) => setGifts(prev => [gift, ...prev]);
  const updateGift = (gift: Gift) => setGifts(prev => prev.map(g => g.id === gift.id ? gift : g));
  const deleteGift = (id: string) => setGifts(prev => prev.filter(g => g.id !== id));

  // Settings
  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings);

  return (
    <DataContext.Provider value={{ 
      clients, activities, deals, tasks, invoices, gifts, settings,
      addClient, updateClient, deleteClient,
      addActivity,
      addDeal, updateDeal, deleteDeal,
      addInvoice, updateInvoice, deleteInvoice,
      addTask, updateTask, deleteTask,
      addGift, updateGift, deleteGift,
      updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};