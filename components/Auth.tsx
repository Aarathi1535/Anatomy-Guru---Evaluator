
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
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-slate-100 p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#001219] rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-xl">M</div>
          <h1 className="text-3xl font-black text-[#001219] tracking-tighter">
            {isLogin ? 'Professional Login' : 'Register Account'}
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Academic Integrity Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium"
                placeholder="Dr. John Doe"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium"
              placeholder="academic@university.edu"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-[#001219] hover:bg-[#006a4e] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Join Network'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#001219] transition-colors"
          >
            {isLogin ? "New to Anatomy Guru? Register" : "Existing Member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
