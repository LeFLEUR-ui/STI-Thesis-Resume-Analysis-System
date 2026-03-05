import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Briefcase, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Sign In | Mariwasa Resume Analysis System";
  }, []);

  // Quick Login Helper
  const quickLogin = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/hr/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to sign in. Please check your credentials.');
      }

      localStorage.setItem('token', data.access_token);
      navigate('/hrdashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-[#fff5f7] to-[#ffeef2] font-['Inter',_sans-serif] antialiased">
      
      <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 text-[13px] flex items-center mb-8 transition-colors group">
        <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </button>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-5">
          <img src="src/assets/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
        </div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-1 tracking-[-0.025em]">Welcome Back</h1>
        <p className="text-gray-500 text-[14px] font-normal">Sign in to access the Resume Analysis System</p>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[440px] p-10 border border-gray-50">
        <div className="text-center mb-9">
            <h2 className="text-[19px] font-bold text-[#1a1a1a] tracking-[-0.025em]">Sign In</h2>
            <p className="text-[13px] text-gray-500 mt-2 px-6">Enter your credentials to manage your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-[12px] rounded-xl text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-[12px] font-bold text-[#D60041] hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-[#D60041] hover:bg-[#b50037] text-white font-bold py-4 rounded-xl transition-all text-[15px] shadow-lg shadow-pink-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In to Portal"}
          </button>
        </form>

        {/* --- ADDED QUICK LOGIN OPTIONS --- */}
        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-4 bg-white text-[11px] font-bold text-gray-400 uppercase tracking-widest">Login As</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => quickLogin('applicant@example.com', 'password123')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white">
                <Users size={18} className="text-gray-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-600">Applicant</span>
            </button>

            <button 
              onClick={() => quickLogin('hr@mariwasa.com', 'hr_pass_2025')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-50 bg-pink-50/30 hover:bg-pink-50 hover:border-pink-200 transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm">
                <Briefcase size={18} className="text-[#D60041]" />
              </div>
              <span className="text-[10px] font-bold text-[#D60041]">HR Staff</span>
            </button>

            <button 
              onClick={() => quickLogin('admin@mariwasa.com', 'admin_root')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white">
                <ShieldCheck size={18} className="text-slate-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-600">System</span>
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[14px] text-gray-600">
            Don't have an account? 
            <a href="#" className="text-[#D60041] font-bold hover:underline ml-1">Create Account</a>
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center text-[11px] text-gray-400 space-y-1.5 font-medium uppercase tracking-wider">
        <p>&copy; 2026 Mariwasa Siam Ceramics Inc.</p>
        <p className="opacity-60">Secure Enterprise Portal v2.0</p>
      </footer>
    </div>
  );
};

export default SignIn;