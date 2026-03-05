import React from 'react';

const StatusRow = ({ label, value, isBadge, isMono }) => (
  <div className="flex justify-between items-center ">
    <span className="text-sm text-gray-600">{label}</span>
    {isBadge ? (
      <span className="text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100">
        {value}
      </span>
    ) : (
      <span className={`text-sm ${isMono ? 'font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 text-xs' : 'text-gray-400'}`}>
        {value}
      </span>
    )}
  </div>
);

const SubmissionSuccess = () => {
  const applicationData = {
    id: "#APP-2024-001",
    status: "Under Review",
    date: "9/26/2025"
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans bg-gradient-to-br from-white via-[#fff5f7] to-[#ffeef2]">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">

          <div className="w-12 h-12 flex items-center justify-center">
            <img src="src/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Resume Analysis System</h1>
            <p className="text-xs text-gray-500">AI-Powered Recruitment Platform</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
        
        {/* Success Icon */}
        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 text-emerald-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-4xl font-extrabold mb-4 text-center">Resume Submitted Successfully!</h2>
        <p className="text-gray-500 text-center max-w-md mb-12">
          Thank you for your application. Our HR team will review your resume and contact you soon.
        </p>

        {/* Status Card */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-10">
          <div className="text-center mb-8">
            <h3 className="font-bold text-sm">Application Status</h3>
            <p className="text-xs text-gray-400">Track your application progress</p>
          </div>

          <div className="space-y-4">
            <StatusRow 
              label="Application ID:" 
              value={applicationData.id} 
              isMono={true} 
            />
            <StatusRow 
              label="Status:" 
              value={applicationData.status} 
              isBadge={true} 
            />
            <StatusRow 
              label="Submitted:" 
              value={applicationData.date} 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => console.log('Redirecting to upload...')}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            Submit Another Resume
          </button>
          
          <button 
            onClick={() => console.log('Viewing resume...')}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Submitted Resume</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default SubmissionSuccess;