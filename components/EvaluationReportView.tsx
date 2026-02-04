
import React from 'react';
import { EvaluationReport } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface EvaluationReportViewProps {
  report: EvaluationReport;
  onReset: () => void;
}

const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({ report, onReset }) => {
  const barData = report.grades.map(g => ({
    name: `Q${g.questionNumber}`,
    score: g.marksObtained,
    total: g.totalMarks
  }));

  const handleDownload = () => window.print();

  // Custom Radial Gauge component with dynamic sizing
  const RadialGauge = ({ score, max, size = 180 }: { score: number, max: number, size?: number }) => {
    const percentage = Math.min(100, Math.max(0, (score / max) * 100));
    const radius = size * 0.38;
    const strokeWidth = size * 0.08;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#001219"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-black text-[#001219] tracking-tighter leading-none print:text-3xl">
              {score}
            </span>
            <div className="w-8 sm:w-10 h-[2px] sm:h-[3px] bg-[#001219] my-1 sm:my-1.5 rounded-full print:w-8 print:h-[2px]"></div>
            <span className="text-base sm:text-lg font-black text-slate-400 tracking-tight leading-none print:text-sm">
              {max}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 print-container overflow-hidden">
      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          body {
            background-color: white !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            margin-bottom: 24px !important;
          }
          .student-card {
            padding: 24px !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            border-radius: 20px !important;
          }
          table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
          }
          th, td {
            font-size: 8.5px !important;
            padding: 8px 6px !important;
            line-height: 1.4 !important;
            word-break: break-word !important;
            vertical-align: top !important;
            border-bottom: 1px solid #f1f5f9 !important;
          }
          th {
            background-color: #f8fafc !important;
            color: #64748b !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
          }
          .logs-container {
            border-radius: 12px !important;
            border: 1px solid #e2e8f0 !important;
            margin-top: 30px !important;
            box-shadow: none !important;
            page-break-inside: auto !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-start mb-10 sm:mb-12 gap-6 no-print">
        <div>
          <button 
            onClick={onReset}
            className="text-slate-400 hover:text-[#006a4e] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK TO UPLOADER
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-[#001219] tracking-tighter">Academic Transcript</h1>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
          <button 
            onClick={handleDownload}
            className="flex-1 sm:flex-none bg-white border border-slate-200 text-[#001219] px-5 sm:px-6 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3"
          >
            <svg className="w-4 h-4 text-[#00cc99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PRINT RECORD
          </button>
          <button 
            onClick={onReset}
            className="flex-1 sm:flex-none bg-[#001219] text-white px-5 sm:px-6 py-3 rounded-xl hover:bg-[#006a4e] transition-all shadow-xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest text-center"
          >
            NEW ANALYSIS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-8 sm:mb-10 print-grid">
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl lg:col-span-2 student-card">
          <div className="flex items-center gap-4 mb-8 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00cc99]/10 text-[#006a4e] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div>
              <h2 className="text-[10px] sm:text-[11px] font-black text-[#001219] uppercase tracking-[0.2em]">Student Profile</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 sm:gap-y-10 gap-x-6 sm:gap-x-10 print:gap-y-8">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</p>
              <p className="text-sm sm:text-base font-black text-[#001219] uppercase leading-none print:text-sm truncate">{report.studentInfo.name || '---'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</p>
              <p className="text-sm sm:text-base font-black text-[#001219] leading-none print:text-sm">{report.studentInfo.rollNumber || '---'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</p>
              <p className="text-sm sm:text-base font-black text-[#006a4e] uppercase leading-none print:text-sm truncate">{report.studentInfo.subject || '---'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Name</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase leading-none print:text-xs truncate">{report.studentInfo.examName || '---'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Class/Grade</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 leading-none print:text-xs">{report.studentInfo.class || '---'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 leading-none print:text-xs">{report.studentInfo.date || '---'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center student-card">
          <h2 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 sm:mb-8">Performance Metric</h2>
          
          <RadialGauge score={report.totalScore} max={report.maxScore} size={window.matchMedia('(max-width: 640px)').matches ? 140 : 180} />

          <div className={`mt-6 sm:mt-10 px-5 sm:px-6 py-2 rounded-full text-[10px] sm:text-[11px] font-black tracking-widest border uppercase print:mt-6 print:text-[10px] ${report.percentage >= 40 ? 'bg-[#00cc99]/10 border-[#00cc99]/20 text-[#006a4e]' : 'bg-red-50 border-red-100 text-red-600'}`}>
            {report.percentage >= 40 ? 'MERIT SECURED' : 'REVIEW REQUIRED'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-8 sm:mb-10 print-grid">
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl lg:col-span-2 student-card">
          <h2 className="text-[10px] sm:text-[11px] font-black text-[#001219] uppercase tracking-[0.2em] mb-8 sm:mb-10 print:mb-6">Grade Distribution</h2>
          <div className="h-56 sm:h-72 print:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{backgroundColor: '#001219', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '10px'}} itemStyle={{color: '#fff'}} />
                <Bar dataKey="score" fill="#006a4e" radius={[4, 4, 0, 0]} barSize={window.matchMedia('(max-width: 640px)').matches ? 16 : 32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#001219] p-6 sm:p-10 rounded-2xl sm:rounded-3xl text-white flex flex-col shadow-2xl relative overflow-hidden group student-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00cc99]/10 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-[#00cc99]/20 transition-all duration-700"></div>
          <h2 className="text-[10px] sm:text-[11px] font-black text-[#00cc99] uppercase tracking-[0.2em] mb-4 sm:mb-6 print:mb-4">Pedagogical Feedback</h2>
          <p className="text-sm sm:text-base leading-relaxed italic font-medium text-slate-200 print:text-[11px]">
            "{report.generalFeedback}"
          </p>
          <div className="mt-8 sm:mt-auto pt-4 sm:pt-8 flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#00cc99] print:pt-4">
             <div className="w-2 h-2 rounded-full bg-[#00cc99] animate-pulse"></div>
             AI Validated Evaluation
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] sm:rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-12 sm:mb-16 logs-container">
        <div className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/40 print:p-5">
           <h2 className="text-[10px] sm:text-[11px] font-black text-[#001219] uppercase tracking-[0.2em]">Detailed Analysis Log</h2>
        </div>
        <div className="overflow-x-auto print:overflow-visible scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left min-w-[768px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 sm:px-10 py-4 sm:py-5 w-[10%]">Item</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5 w-[25%]">Student Response</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5 w-[25%]">Standard Answer</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5 w-[15%] text-center">Score</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5 w-[25%]">Evaluator Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px] sm:text-[13px] print:text-[9.5px]">
              {report.grades.map((grade, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 sm:px-10 py-6 sm:py-8 font-black text-[#001219] align-top">Q{grade.questionNumber}</td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8 text-slate-700 font-medium leading-relaxed align-top">{grade.studentAnswer}</td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8 text-slate-400 italic leading-relaxed align-top">{grade.correctAnswer}</td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8 align-top text-center">
                    <div className="font-black text-[#006a4e] bg-[#00cc99]/5 px-3 py-1 rounded-lg border border-[#00cc99]/10 inline-block text-[10px] sm:text-[11px] print:text-[8px] tracking-tight whitespace-nowrap">
                      {grade.marksObtained} / {grade.totalMarks}
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8 text-slate-500 italic font-medium leading-relaxed align-top">{grade.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hidden print:block text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] py-16">
        Anatomy Guru's AI Grader Official Transcript • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default EvaluationReportView;
