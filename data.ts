// Data exactly matching the screenshot
export const kpiData = [
  { label: 'TOTAL CLIENTS', value: 15 },
  { label: 'ACTIVITIES LAST 7 DAYS', value: 2 },
  { label: 'ACTIVITIES LAST 30 DAYS', value: 2 },
  { label: 'ACTIVE DEALS', value: 14 },
  { label: 'CLOSED-WON DEALS', value: 3 },
  { label: 'CLOSED-LOST DEALS', value: 3 },
];

export const clientStatusData = [
  { name: 'Prospect', value: 5 },
  { name: 'Cold Lead', value: 3 },
  { name: 'Warm Lead', value: 4 },
  { name: 'Buying', value: 2 },
  { name: 'Inactive', value: 3 },
  { name: 'Onboarding', value: 1 },
];

export const clientActivityData = [
  { name: 'Text Message', value: 4 },
  { name: 'Phone', value: 3 },
  { name: 'Email', value: 4 },
  { name: 'Contact Form', value: 2 },
  { name: 'Meeting-Virtual', value: 3 },
  { name: 'Meeting-In Person', value: 1 },
];

export const clientSourceData = [
  { name: 'WebForm', value: 7, fill: '#60a5fa' }, // Blue
  { name: 'LinkedIn', value: 12, fill: '#f472b6' }, // Pink
  { name: 'Referral', value: 9, fill: '#2dd4bf' }, // Teal
  { name: 'Cold Outreach', value: 3, fill: '#818cf8' }, // Indigo
  { name: 'Job Fair', value: 2, fill: '#34d399' }, // Green
  { name: 'Internal Event', value: 1, fill: '#a78bfa' }, // Purple
];

export const dealStatusData = [
  { name: 'On Hold', value: 4, fill: '#2dd4bf' }, // Teal
  { name: 'Pending', value: 4, fill: '#f472b6' }, // Pink
  { name: 'Under Review', value: 10, fill: '#60a5fa' }, // Blue
  { name: 'Closed-Lost', value: 2, fill: '#475569' }, // Slate
  { name: 'Closed-Won', value: 12, fill: '#34d399' }, // Green
];

export const activeTaskStatusData = [
  { name: 'Pending', value: 8 },
  { name: 'Sent', value: 4 },
  { name: 'Received', value: 6 },
  { name: 'Overdue', value: 2 },
  { name: 'Canceled', value: 1 },
  { name: 'Refunded', value: 0 },
];

// Note: Reusing invoice status data structure for simplicity as layout is identical to bar charts
export const invoiceStatusData = [
  { name: 'Overdue', value: 2, fill: '#f472b6' },
  { name: 'Pending', value: 4, fill: '#f472b6' },
  { name: 'Paid', value: 8, fill: '#f472b6' }, // Using similar pink color from screenshot
];

export const recentActivity = [
  { date: '5/30/2025', name: 'Grace Bennett [ID-0010]', company: 'Radiant Skin Clinic', description: 'Text Message: Discussed potential upsell for premium service tier—client interested.' },
  { date: '5/29/2025', name: 'Ethan James [ID-0014]', company: 'Jetstream Media', description: 'Phone: Checked in post-project to gather feedback and offer support.' },
  { date: '5/28/2025', name: 'Ethan James [ID-0014]', company: 'Jetstream Media', description: 'Email: Followed up on previous inquiry—client requested more examples.' },
  { date: '5/27/2025', name: 'Chloe Anderson [ID-0015]', company: 'Lumière Photography', description: 'Contact Form: Shared onboarding documents and scheduled kick-off meeting.' },
  { date: '5/26/2025', name: 'Chloe Anderson [ID-0015]', company: 'Lumière Photography', description: 'Text Message: Confirmed availability for June collaboration and sent updated quote.' },
];

export const upcomingTasks = [
  { dueDate: '5/12/2025', category: 'Team', owner: 'David Smith', task: 'Send proposal to client', overdue: true }, // Simulating red highlight
  { dueDate: '5/13/2025', category: 'Planning', owner: 'Emily Reyes', task: 'Follow up on unpaid invoice' },
  { dueDate: '5/15/2025', category: 'Marketing', owner: 'Michael Tran', task: 'Prepare Q2 performance report' },
  { dueDate: '5/16/2025', category: 'Team', owner: 'Jess Patel', task: 'Update client contact details' },
  { dueDate: '5/17/2025', category: 'Research', owner: 'David Smith', task: 'Design marketing mockups' },
];

export const recentDeals = [
  { date: '6/2/2025', value: '1,000.00', status: 'On Hold', description: 'End-of-Year Reporting Project' },
  { date: '6/1/2025', value: '4,000.00', status: 'Pending', description: 'Sales Funnel Optimization' },
  { date: '5/31/2025', value: '3,000.00', status: 'Under Review', description: 'UX/UI App Audit' },
  { date: '5/30/2025', value: '1,000.00', status: 'Closed-Lost', description: 'Email Marketing Overhaul' },
  { date: '5/29/2025', value: '1,200.00', status: 'Closed-Won', description: 'New Client Welcome Package' },
];

export const upcomingInvoices = [
  { date: '5/13/2025', value: '1,200.00', company: 'Brightside Marketing', description: 'Website Redesign Deposit' },
  { date: '5/13/2025', value: '950.00', company: 'Lumière Photograph', description: 'Social Media Management - May' },
  { date: '5/14/2025', value: '3,000.00', company: 'Horizon Legal Group', description: 'Legal Retainer - Q2' },
  { date: '5/15/2025', value: '1,750.00', company: 'Jetstream Media', description: 'Brand Strategy Package' },
  { date: '5/17/2025', value: '2,400.00', company: 'Jetstream Media', description: 'Event Coordination Services' },
];