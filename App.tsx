
import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import EvaluationReportView from './components/EvaluationReportView';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { UploadedFile, EvaluationReport, HistoryItem, User, BillingInfo } from './types';
import { evaluateAnswerSheet } from './services/geminiService';

const MAX_FILE_SIZE_MB = 3;
const STORAGE_KEY_PREFIX = 'anatomyguru_user_';
const AUTH_KEY = 'anatomyguru_auth_session';
const COST_PER_SHEET = 0.50; // $0.50 per sheet SaaS pricing

type ViewMode = 'uploader' | 'dashboard' | 'report';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('uploader');
  const [qpFiles, setQpFiles] = useState<UploadedFile[]>([]);
  const [keyFiles, setKeyFiles] = useState<UploadedFile[]>([]);
  const [studentFiles, setStudentFiles] = useState<UploadedFile[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<EvaluationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hasApiKey, setHasApiKey] = useState(!!process.env.API_KEY);

  // Persistence & Auth Sync
  useEffect(() => {
    const session = localStorage.getItem(AUTH_KEY);
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
    
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        if (selected) setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${currentUser.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setHistory(parsed);
        } catch (e) {
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${currentUser.id}`, JSON.stringify(history));
    }
  }, [history, currentUser]);

  // Billing Calculation
  const getBillingInfo = (): BillingInfo => {
    const totalSheets = history.reduce((acc, h) => acc + (h.sheetsCount || 0), 0);
    const amount = totalSheets * COST_PER_SHEET;
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);

    return {
      pendingAmount: amount,
      dueDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isPaid: false,
      sheetsEvaluatedThisMonth: totalSheets
    };
  };

  const handleLogin = (email: string, name: string) => {
    const newUser: User = {
      id: btoa(email), // Mock ID
      email,
      name,
      organization: 'Medical Faculty',
      createdAt: Date.now()
    };
    setCurrentUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    setHistory([]);
    setViewMode('uploader');
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const simulateProgress = async (fileId: string, type: 'qp' | 'key' | 'student') => {
    const updateProgress = (p: number) => {
      const updater = (prev: UploadedFile[]): UploadedFile[] => 
        prev.map(f => f.file.name === fileId ? { 
          ...f, 
          progress: p, 
          status: (p === 100 ? 'complete' : 'uploading') as any 
        } : f);
      
      if (type === 'qp') setQpFiles(updater);
      else if (type === 'key') setKeyFiles(updater);
      else setStudentFiles(updater);
    };

    for (let p = 0; p <= 100; p += 25) {
      updateProgress(p);
      await new Promise(r => setTimeout(r, 60));
    }
  };

  const handleFileSelection = (type: 'qp' | 'key' | 'student') => async (files: File[]) => {
    setError(null);
    const validFiles = files.filter(f => {
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`"${f.name}" exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return false;
      }
      return true;
    });

    const newFiles = await Promise.all(validFiles.map(async (file) => {
      const preview = await fileToBase64(file);
      return { file, preview, progress: 0, status: 'uploading' as const };
    }));

    if (type === 'qp') setQpFiles(prev => [...prev, ...newFiles]);
    if (type === 'key') setKeyFiles(prev => [...prev, ...newFiles]);
    if (type === 'student') setStudentFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(f => simulateProgress(f.file.name, type));
  };

  const runEvaluation = async () => {
    if (!currentUser) return;
    if (qpFiles.length === 0 || studentFiles.length === 0) {
      setError("Input Error: Mandatory documentation (QP & Student Sheets) required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const qpBase64 = qpFiles.map(f => f.preview);
      const keyBase64 = keyFiles.map(f => f.preview);
      const studentBase64 = studentFiles.map(f => f.preview);

      const result = await evaluateAnswerSheet(qpBase64, keyBase64, studentBase64);
      
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        timestamp: Date.now(),
        report: result,
        sheetsCount: studentFiles.length
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setCurrentReport(result);
      setViewMode('report');
    } catch (err: any) {
      console.error("Evaluation Engine Crash:", err);
      if (err.message === 'API_KEY_MISSING') {
        setError("System Error: API Configuration missing. Please use the Setup tool.");
      } else {
        setError(err.message || "A clinical evaluation error occurred. Please retry.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startNew = () => {
    setQpFiles([]);
    setKeyFiles([]);
    setStudentFiles([]);
    setCurrentReport(null);
    setViewMode('uploader');
    setError(null);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#001219] selection:bg-[#00cc99]/30 flex flex-col">
      <nav className="border-b border-slate-200 px-10 py-5 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-2xl z-50 no-print">
        <div className="flex items-center gap-5 cursor-pointer group" onClick={startNew}>
          <div className="w-11 h-11 bg-[#001219] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:bg-[#006a4e] transition-all">M</div>
          <div className="leading-tight">
            <span className="text-xl font-black text-[#001219] block tracking-tighter">Anatomy Guru's AI Grader</span>
            <span className="text-[10px] text-[#006a4e] font-black uppercase tracking-[0.2em]">Academic SaaS</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setViewMode('uploader')}
              className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all tracking-wider ${viewMode === 'uploader' || viewMode === 'report' ? 'bg-white text-[#001219] shadow-sm' : 'text-slate-500 hover:text-[#001219]'}`}
            >
              AUDIT
            </button>
            <button 
              onClick={() => setViewMode('dashboard')}
              className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all tracking-wider ${viewMode === 'dashboard' ? 'bg-white text-[#001219] shadow-sm' : 'text-slate-500 hover:text-[#001219]'}`}
            >
              HUB
            </button>
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <div className="text-right">
              <p className="text-[11px] font-black text-[#001219] uppercase leading-none">{currentUser.name}</p>
              <p className="text-[9px] text-[#006a4e] font-black uppercase tracking-widest mt-1">TIER: PRO</p>
            </div>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl mx-auto w-full px-8 py-20">
        {viewMode === 'uploader' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-20">
              <h1 className="text-6xl font-black text-[#001219] mb-8 tracking-tighter leading-[0.9]">
                Professional <br/> <span className="text-[#00cc99]">Audit Engine.</span>
              </h1>
              <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed text-xl">
                Deploying strict medical academic criteria to ensure grading integrity. Automated auditing for high-stakes medical examinations.
              </p>
            </div>

            <div className="bg-white shadow-2xl rounded-[48px] p-16 border border-slate-100 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <FileUpload label="Core Question Paper" required files={qpFiles} onFilesSelected={handleFileSelection('qp')} />
                <FileUpload label="Expert Marking Scheme" files={keyFiles} onFilesSelected={handleFileSelection('key')} />
              </div>
              
              <FileUpload label="Student Scripts (Handwritten)" required files={studentFiles} onFilesSelected={handleFileSelection('student')} />

              {error && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-700 text-sm font-black flex items-center gap-5 animate-shake">
                   <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <div className="flex flex-col">
                      <span className="uppercase tracking-tight">{error}</span>
                      {!hasApiKey && (
                        <button onClick={handleOpenKeySelector} className="text-[11px] underline mt-1.5 font-black uppercase tracking-[0.2em] text-red-900">Configure Cloud Keys</button>
                      )}
                   </div>
                </div>
              )}

              <div className="pt-8">
                <button
                  onClick={runEvaluation}
                  disabled={isLoading || qpFiles.length === 0 || studentFiles.length === 0}
                  className={`w-full py-7 rounded-[28px] font-black text-2xl transition-all flex items-center justify-center gap-5 shadow-2xl ${
                    isLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-[#001219] text-white hover:bg-[#006a4e] active:scale-[0.97]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-7 h-7 border-4 border-slate-300 border-t-[#00cc99] rounded-full animate-spin"></div>
                      PERFORMING MEDICAL AUDIT...
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      INITIATE EVALUATION
                    </>
                  )}
                </button>
                <div className="flex justify-center mt-6 gap-4">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
                    USAGE FEE: ${(studentFiles.length * COST_PER_SHEET).toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'dashboard' && (
          <Dashboard 
            history={history} 
            billing={getBillingInfo()}
            onViewReport={(item) => { setCurrentReport(item.report); setViewMode('report'); }} 
            onDeleteReport={(id) => setHistory(prev => prev.filter(item => item.id !== id))}
            onNewEvaluation={startNew}
          />
        )}

        {viewMode === 'report' && currentReport && (
          <EvaluationReportView report={currentReport} onReset={startNew} />
        )}
      </main>

      <footer className="py-24 mt-auto text-center no-print border-t border-slate-100 bg-white/50">
        <div className="w-16 h-1.5 bg-slate-200 mx-auto mb-10 rounded-full"></div>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] mb-3">&copy; 2025 ANATOMY GURU'S AI GRADER • Developed from the minds of Aarshiv.ai</p>
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">ENTERPRISE MEDICAL GRADE MANAGEMENT</p>
      </footer>
    </div>
  );
};

export default App;
