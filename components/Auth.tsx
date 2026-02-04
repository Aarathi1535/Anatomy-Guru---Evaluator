
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, name || email.split('@')[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-slate-100 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#001219] rounded-2xl flex items-center justify-center text-white font-black text-2xl sm:text-3xl mx-auto mb-5 sm:mb-6 shadow-xl">M</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001219] tracking-tighter">
            {isLogin ? 'Professional Login' : 'Register Account'}
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] mt-2">
            Academic Integrity Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium text-sm sm:text-base"
                placeholder="Dr. John Doe"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium text-sm sm:text-base"
              placeholder="academic@university.edu"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 sm:py-5 bg-[#001219] hover:bg-[#006a4e] text-white rounded-xl sm:rounded-2xl font-black text-[12px] sm:text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 mt-4"
          >
            {isLogin ? 'Sign In' : 'Join Network'}
          </button>
        </form>

        <div className="mt-8 sm:mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:text-[#001219] transition-colors"
          >
            {isLogin ? "New to Anatomy Guru? Register" : "Existing Member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
