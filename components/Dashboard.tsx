
import React from 'react';
import { HistoryItem, BillingInfo } from '../types';

interface DashboardProps {
  history: HistoryItem[];
  billing: BillingInfo;
  onViewReport: (item: HistoryItem) => void;
  onDeleteReport: (id: string) => void;
  onNewEvaluation: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, billing, onViewReport, onDeleteReport, onNewEvaluation }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
      {/* SaaS Billing Notification */}
      {billing.pendingAmount > 0 && !billing.isPaid && (
        <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-between shadow-lg shadow-red-50/50">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Monthly Bill Pending</p>
              <h3 className="text-lg font-black text-red-900 tracking-tight">
                Current Due: ${billing.pendingAmount.toFixed(2)}
              </h3>
              <p className="text-sm text-red-700 font-medium">Auto-invoice generated for {billing.sheetsEvaluatedThisMonth} sheets.</p>
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
            Settlement
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#001219] tracking-tighter">Academic Hub</h1>
          <p className="text-[#006a4e] text-[11px] font-black uppercase tracking-[0.2em] mt-1.5">History, Billing & Global Metrics</p>
        </div>
        <button 
          onClick={onNewEvaluation}
          className="bg-[#001219] hover:bg-[#006a4e] text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center gap-3 uppercase text-[11px] tracking-[0.2em]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4" /></svg>
          Evaluate New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Evaluations</p>
          <p className="text-4xl font-black text-[#001219] tracking-tighter">{history?.length || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Monthly Charge</p>
          <p className="text-4xl font-black text-[#001219] tracking-tighter">${billing.pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Avg Performance</p>
          <p className="text-4xl font-black text-[#001219] tracking-tighter">
            {history?.length > 0 
              ? (history.reduce((acc, h) => acc + h.report.percentage, 0) / history.length).toFixed(0) 
              : 0}%
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Renewal Date</p>
          <p className="text-lg font-black text-slate-600 uppercase tracking-tighter mt-2">{billing.dueDate}</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Evaluation Records</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ENCRYPTED VAULT</span>
        </div>
        
        {history.length === 0 ? (
          <div className="p-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">No data found for current billing cycle</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Student / Date</th>
                  <th className="px-10 py-5">Course</th>
                  <th className="px-10 py-5">Audit Result</th>
                  <th className="px-10 py-5">Pages</th>
                  <th className="px-10 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-7">
                      <p className="font-black text-[#001219] text-[13px] tracking-tight mb-1 uppercase">{item.report.studentInfo.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-7">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {item.report.studentInfo.subject}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className={`font-black text-[14px] tracking-tighter ${item.report.percentage >= 40 ? 'text-[#006a4e]' : 'text-red-500'}`}>
                          {item.report.percentage.toFixed(1)}%
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SCORE RATIO</p>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.sheetsCount} PAGES</span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onViewReport(item)} className="p-3 text-slate-400 hover:text-[#006a4e] hover:bg-[#00cc99]/10 rounded-xl transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => onDeleteReport(item.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
