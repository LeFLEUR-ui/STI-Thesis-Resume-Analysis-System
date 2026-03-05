import React, { useState } from 'react';

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/hr/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess(true);


    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-[#fff5f7] to-[#ffeef2] font-['Inter',_sans-serif] antialiased">
      
      {/* Back to Login */}
      <a href="/signin" className="text-gray-500 hover:text-gray-800 text-[13px] flex items-center mb-6 transition-colors group">
        <i className="fa-solid fa-arrow-left mr-2 text-[10px] transition-transform group-hover:-translate-x-1"></i> 
        Back to Login
      </a>

      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="src/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-[26px] font-bold text-[#1a1a1a] mb-1 tracking-[-0.025em]">Create Account</h1>
        <p className="text-gray-500 text-[14px]">Join our talent pool and find your next opportunity</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[480px] p-10 border border-gray-50">
        
        <div className="flex items-center justify-center mb-2">
          <h2 className="text-[19px] font-bold text-[#1a1a1a] flex items-center tracking-[-0.025em]">
            <i className="fa-regular fa-user mr-2 text-[16px]"></i> Registration
          </h2>
        </div>

        <p className="text-center text-[13px] text-gray-500 mb-8 px-6 leading-relaxed">
          Fill in your details to create your account and start your application
        </p>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-[12px] rounded-xl text-center font-medium animate-pulse">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 text-[12px] rounded-xl text-center font-medium">
            <i className="fa-solid fa-circle-check mr-2"></i>Registration successful! You can now sign in.
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Marvin" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white placeholder:text-gray-300" 
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Fabricante" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white placeholder:text-gray-300" 
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="marvin123@gmail.com" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white placeholder:text-gray-300" 
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+63 9XX XXX XXXX" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white placeholder:text-gray-300" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white placeholder:text-gray-300" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[14px]`}></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-[#D60041] transition-all text-[14px] bg-white placeholder:text-gray-300" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-[14px]`}></i>
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center justify-center space-x-2 py-1">
            <input 
              type="checkbox" 
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[#D60041] focus:ring-[#D60041]" 
            />
            <p className="text-[12px] text-gray-500">
              I agree to the <a href="#" className="text-[#D60041] font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-[#D60041] font-semibold hover:underline">Privacy Policy</a>
            </p>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D60041] hover:bg-[#b50037] text-white font-semibold py-3.5 rounded-xl transition-all text-[15px] shadow-lg shadow-pink-100 mt-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin text-[18px]"></i>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[14px] text-gray-600">
            Already have an account? 
            <a href="/login" className="text-[#D60041] font-bold hover:underline ml-1">Sign In</a>
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center text-[11px] text-gray-400 space-y-1.5 font-medium">
        <p className="tracking-tight">&copy; 2025 Mariwasa Siam Ceramics Inc. All rights reserved.</p>
        <p className="opacity-80">Automated Resume Analysis System - Secure & Confidential</p>
      </footer>

    </div>
  );
};

export default CreateAccount;