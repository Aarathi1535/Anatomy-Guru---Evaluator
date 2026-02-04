
import React, { useState } from 'react';
import { supabase } from '../supabase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        // NOTE: To completely stop Supabase from sending emails, 
        // you must disable "Confirm email" in your Supabase Project Settings.
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        
        if (signUpError) throw signUpError;

        if (data.session) {
          // If email confirmation is disabled in Supabase, we get a session immediately.
          // The App.tsx listener will handle the redirect.
          setSuccess("Welcome! Account created.");
        } else {
          // If email confirmation is enabled in Supabase, the user is created but needs to wait.
          setSuccess("Account created successfully! Proceed to Sign In.");
          setIsLogin(true); // Switch to login mode for convenience
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-shake bg-red-50 text-red-600 border border-red-100">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in bg-[#00cc99]/10 text-[#006a4e] border border-[#00cc99]/20">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium text-sm sm:text-base disabled:opacity-50"
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
              disabled={loading}
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium text-sm sm:text-base disabled:opacity-50"
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
              disabled={loading}
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00cc99]/20 focus:border-[#00cc99] transition-all font-medium text-sm sm:text-base disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 sm:py-5 bg-[#001219] hover:bg-[#006a4e] text-white rounded-xl sm:rounded-2xl font-black text-[12px] sm:text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 mt-4 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isLogin ? 'Sign In' : 'Join Network'}
          </button>
        </form>

        <div className="mt-8 sm:mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
            disabled={loading}
            className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:text-[#001219] transition-colors disabled:opacity-50"
          >
            {isLogin ? "New to Anatomy Guru? Register" : "Existing Member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
