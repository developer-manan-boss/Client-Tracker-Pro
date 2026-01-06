import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, FileText, X } from 'lucide-react';
import { useData } from './DataContext';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number | string;
  price: number | string;
  taxRate: number | string;
}

export const InvoiceGenerator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings } = useData();
  
  // --- State ---
  const [logo, setLogo] = useState<string | null>(settings.logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [senderDetails, setSenderDetails] = useState({
    companyName: settings.companyName,
    address: settings.address,
    cityStateZip: settings.cityStateZip,
    country: settings.country,
  });

  const [recipientDetails, setRecipientDetails] = useState({
    companyName: '',
    address: '',
    cityStateZip: '',
    country: '',
  });

  const [invoiceMeta, setInvoiceMeta] = useState({
    number: '0000001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: 'Service Fee', quantity: 1, price: 0, taxRate: 0 }
  ]);

  const [notes, setNotes] = useState('Payment is due within 15 days. Thank you for your business.');
  const [discount, setDiscount] = useState<number | string>(0);

  // --- Handlers ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0, taxRate: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  // We allow string inputs to support typing decimals like "10." without it snapping back to "10"
  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // --- Calculations ---
  // Helper to safely parse numbers
  const safeNum = (val: string | number) => {
      const num = parseFloat(String(val));
      return isNaN(num) ? 0 : num;
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (safeNum(item.quantity) * safeNum(item.price)), 0);
  const calculateTax = () => items.reduce((acc, item) => acc + (safeNum(item.quantity) * safeNum(item.price) * (safeNum(item.taxRate) / 100)), 0);
  const total = calculateSubtotal() + calculateTax() - safeNum(discount);

  // --- Print / Generate PDF Logic ---
  const handleGenerate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = items.map(item => `
      <tr class="item-row">
        <td class="description">${item.description}</td>
        <td class="qty">${item.quantity}</td>
        <td class="price">$${safeNum(item.price).toFixed(2)}</td>
        <td class="tax">${item.taxRate}%</td>
        <td class="amount">$${(safeNum(item.quantity) * safeNum(item.price)).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${invoiceMeta.number}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; background: white; color: #111; -webkit-print-color-adjust: exact; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 50px; }
          .logo-area { max-width: 200px; }
          .logo-img { max-height: 80px; object-fit: contain; margin-bottom: 10px; }
          .invoice-title { font-size: 40px; font-weight: 300; line-height: 1; }
          .sender-info { text-align: right; font-size: 14px; line-height: 1.5; color: #333; }
          
          .meta-section { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .bill-to { font-size: 14px; }
          .bill-to h3 { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .bill-to .client-name { font-size: 18px; font-weight: 700; margin-bottom: 5px; }
          
          .invoice-details { text-align: right; font-size: 14px; }
          .invoice-details .row { display: flex; justify-content: flex-end; gap: 20px; margin-bottom: 4px; }
          .invoice-details .label { color: #666; text-transform: uppercase; font-size: 11px; font-weight: 600; }
          
          table { w-full; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; font-size: 11px; text-transform: uppercase; color: #666; border-bottom: 2px solid #eee; padding: 10px 0; }
          th.amount, td.amount, th.price, td.price, th.qty, td.qty, th.tax, td.tax { text-align: right; }
          td { padding: 15px 0; border-bottom: 1px solid #eee; font-size: 14px; }
          
          .totals { display: flex; flex-direction: column; align-items: flex-end; margin-top: 20px; }
          .totals .row { display: flex; justify-content: space-between; width: 250px; margin-bottom: 5px; font-size: 14px; }
          .totals .total-row { font-size: 24px; font-weight: 700; margin-top: 10px; border-top: 2px solid #eee; padding-top: 10px; }
          
          .notes { margin-top: 60px; font-size: 13px; color: #555; }
          .notes h4 { font-size: 11px; text-transform: uppercase; color: #333; margin-bottom: 5px; }
          
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #f5f5f5; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="logo-area">
              ${logo ? `<img src="${logo}" class="logo-img" />` : ''}
              <div class="invoice-title">Invoice</div>
            </div>
            <div class="sender-info">
              <strong>${senderDetails.companyName}</strong><br>
              ${senderDetails.address}<br>
              ${senderDetails.cityStateZip}<br>
              ${senderDetails.country}
            </div>
          </div>

          <div class="meta-section">
            <div class="bill-to">
              <h3>Bill To:</h3>
              <div class="client-name">${recipientDetails.companyName || 'Client Name'}</div>
              ${recipientDetails.address}<br>
              ${recipientDetails.cityStateZip}<br>
              ${recipientDetails.country}
            </div>
            <div class="invoice-details">
              <div class="row">
                <span class="label">Invoice #</span>
                <span>${invoiceMeta.number}</span>
              </div>
              <div class="row">
                <span class="label">Date</span>
                <span>${invoiceMeta.date}</span>
              </div>
              <div class="row">
                <span class="label">Due Date</span>
                <span>${invoiceMeta.dueDate}</span>
              </div>
            </div>
          </div>

          <table width="100%">
            <thead>
              <tr>
                <th width="50%">Item / Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Tax</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
             <div class="row">
                <span>Subtotal</span>
                <span>$${calculateSubtotal().toFixed(2)}</span>
             </div>
             <div class="row">
                <span>Tax</span>
                <span>$${calculateTax().toFixed(2)}</span>
             </div>
             ${safeNum(discount) > 0 ? `
             <div class="row">
                <span>Discount</span>
                <span>-$${safeNum(discount).toFixed(2)}</span>
             </div>` : ''}
             <div class="row total-row">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
             </div>
          </div>

          <div class="notes">
            <h4>Notes / Terms</h4>
            <p>${notes}</p>
          </div>

          <div class="footer">
             Generated by ClientTrackerPro
          </div>
        </div>
        <script>
            window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1e293b] w-full max-w-5xl rounded-lg shadow-2xl border border-slate-600 flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800 rounded-t-lg">
          <div className="flex items-center gap-2 text-white">
            <FileText className="text-emerald-400" />
            <h2 className="text-lg font-medium">Create Sending Invoice</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Column: Form Inputs */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* Top Row: Logo & Sender */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-800/50 rounded border border-slate-700/50">
                <div>
                   <label className="block text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Your Business Logo</label>
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-slate-700/50 transition-all h-32"
                   >
                      {logo ? (
                        <img src={logo} alt="Logo" className="h-full object-contain" />
                      ) : (
                        <>
                          <Upload className="text-slate-400 mb-2" />
                          <span className="text-xs text-slate-500">Click to upload PNG/JPG</span>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Your Business Details</label>
                   <input value={senderDetails.companyName} onChange={e => setSenderDetails({...senderDetails, companyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Your Company Name" />
                   <input value={senderDetails.address} onChange={e => setSenderDetails({...senderDetails, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Address" />
                   <div className="grid grid-cols-2 gap-2">
                     <input value={senderDetails.cityStateZip} onChange={e => setSenderDetails({...senderDetails, cityStateZip: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="City, State Zip" />
                     <input value={senderDetails.country} onChange={e => setSenderDetails({...senderDetails, country: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Country" />
                   </div>
                </div>
              </div>

              {/* Client & Meta */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Bill To (Client)</label>
                    <input value={recipientDetails.companyName} onChange={e => setRecipientDetails({...recipientDetails, companyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Client Company" />
                    <input value={recipientDetails.address} onChange={e => setRecipientDetails({...recipientDetails, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Client Address" />
                    <input value={recipientDetails.cityStateZip} onChange={e => setRecipientDetails({...recipientDetails, cityStateZip: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="City, State Zip" />
                    <input value={recipientDetails.country} onChange={e => setRecipientDetails({...recipientDetails, country: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Country" />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Invoice Details</label>
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-700 rounded px-2 py-1">
                        <span className="text-slate-500 text-xs">Invoice #</span>
                        <input value={invoiceMeta.number} onChange={e => setInvoiceMeta({...invoiceMeta, number: e.target.value})} className="bg-transparent text-right text-sm text-white outline-none w-24" />
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-700 rounded px-2 py-1">
                        <span className="text-slate-500 text-xs">Date</span>
                        <input type="date" value={invoiceMeta.date} onChange={e => setInvoiceMeta({...invoiceMeta, date: e.target.value})} className="bg-transparent text-right text-sm text-white outline-none" />
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-700 rounded px-2 py-1">
                        <span className="text-slate-500 text-xs">Due Date</span>
                        <input type="date" value={invoiceMeta.dueDate} onChange={e => setInvoiceMeta({...invoiceMeta, dueDate: e.target.value})} className="bg-transparent text-right text-sm text-white outline-none" />
                    </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Items</label>
                  <div className="bg-slate-900 rounded border border-slate-700 overflow-hidden">
                      <table className="w-full text-left">
                          <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase">
                              <tr>
                                  <th className="p-2">Description</th>
                                  <th className="p-2 w-16">Qty</th>
                                  <th className="p-2 w-24">Price</th>
                                  <th className="p-2 w-16">Tax %</th>
                                  <th className="p-2 w-24 text-right">Amount</th>
                                  <th className="p-2 w-8"></th>
                              </tr>
                          </thead>
                          <tbody className="text-sm">
                              {items.map((item) => (
                                  <tr key={item.id} className="border-b border-slate-800 last:border-0">
                                      <td className="p-2">
                                          <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full bg-transparent outline-none text-white" placeholder="Item name" />
                                      </td>
                                      <td className="p-2">
                                          <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} className="w-full bg-transparent outline-none text-white text-center" />
                                      </td>
                                      <td className="p-2">
                                          <input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} className="w-full bg-transparent outline-none text-white" />
                                      </td>
                                      <td className="p-2">
                                          <input type="number" value={item.taxRate} onChange={e => updateItem(item.id, 'taxRate', e.target.value)} className="w-full bg-transparent outline-none text-white text-center" />
                                      </td>
                                      <td className="p-2 text-right text-slate-300 font-mono">
                                          ${(safeNum(item.quantity) * safeNum(item.price)).toFixed(2)}
                                      </td>
                                      <td className="p-2 text-center">
                                          <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={14}/></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <button onClick={addItem} className="mt-2 text-emerald-400 text-xs font-bold flex items-center gap-1 hover:text-emerald-300">
                      <Plus size={14} /> ADD ITEM
                  </button>
              </div>

              {/* Notes */}
              <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Terms & Notes</label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white h-24 focus:border-emerald-500 outline-none" 
                    placeholder="Enter terms, payment details, or thank you note..."
                  />
              </div>

            </div>

            {/* Right Column: Preview/Totals */}
            <div className="col-span-12 lg:col-span-4 bg-slate-800/30 p-4 rounded border border-slate-700 h-fit">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Summary</h3>
                <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                        <span>Discount</span>
                        <div className="flex items-center bg-slate-900 rounded border border-slate-700 w-24 px-1">
                            <span className="text-slate-500 text-xs">$</span>
                            <input 
                                type="number" 
                                value={discount} 
                                onChange={e => setDiscount(e.target.value)} 
                                className="bg-transparent text-right text-white w-full outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-slate-600">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleGenerate}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <FileText size={18} />
                        GENERATE & PRINT PDF
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-2">
                        Opens a print-ready version in a new window.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
