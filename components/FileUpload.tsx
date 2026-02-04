
import React from 'react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  label: string;
  onFilesSelected: (files: File[]) => void;
  files: UploadedFile[];
  multiple?: boolean;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFilesSelected, files, multiple = true, required = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[10px] sm:text-[11px] font-black text-[#001219] uppercase tracking-[0.1em]">
          {label} {required && <span className="text-[#00cc99] font-black">*</span>}
        </label>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          {files.length} {files.length === 1 ? 'OBJECT' : 'OBJECTS'}
        </span>
      </div>
      
      <div className="space-y-4">
        <label className="relative flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-[#00cc99] hover:bg-[#00cc99]/5 transition-all group bg-slate-50/30">
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-[#006a4e] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#001219] font-black uppercase tracking-wider">
              DRAG OR SELECT FILES
            </p>
            <p className="mt-1 text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tight">PDF / JPG / PNG • MAX 3MB</p>
          </div>
          <input type="file" className="hidden" multiple={multiple} onChange={handleChange} accept="image/*,application/pdf" />
        </label>
        
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-slate-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                  {f.file.type.includes('image') ? (
                    <img src={f.preview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16h1v1h-1v-1zm1-11H7v14h10V9h-4V5zm-1 4h3l-3-3v3z" /></svg>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black text-[#001219] truncate tracking-tight uppercase max-w-full block">{f.file.name}</span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${f.status === 'complete' ? 'bg-[#00cc99]' : 'bg-[#001219]'}`}
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                </div>
                {f.status === 'complete' && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#006a4e]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
