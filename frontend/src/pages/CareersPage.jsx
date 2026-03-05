import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const CareersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [jobs, setJobs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/hr/jobs');
        if (!response.ok) throw new Error('Failed to fetch job postings');
        
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const departments = ['All Departments', ...new Set(jobs.map(job => job.department))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills_requirements.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All Departments' || job.department === selectedDept;
    
    return matchesSearch && matchesDept;
  });

  return (
    <div className="text-[#333] font-['Inter',_sans-serif] min-h-screen bg-white antialiased">
      <nav className="flex items-center justify-between px-10 py-4 bg-white sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <img src="src/assets/logo.png" alt="Mariwasa Logo" className="h-8 w-8 object-contain" />
          <div className="border-l pl-3 border-gray-200">
            <h1 className="font-bold text-[16px] text-gray-800 leading-tight">Resume Analysis System</h1>
            <p className="text-[11px] text-gray-400 font-medium">Career Opportunities</p>
          </div>
        </div>
        <div className="flex items-center gap-10 text-[14px] font-medium text-gray-600">
          <a href="/" className="hover:text-[#D60041] transition-colors">Home</a>
          <a href="/jobs" className="text-[#D60041] font-bold">Jobs</a>
        </div>
      </nav>


      <header className="bg-gradient-to-b from-[#fce4ec] to-white pt-16 pb-32 text-center px-4">
        <h2 className="text-[44px] font-extrabold tracking-tight mb-3">
          Find Your <span className="text-[#D60041]">Career</span> at Mariwasa
        </h2>
        <p className="text-gray-500 text-[16px] max-w-2xl mx-auto leading-relaxed">
          Explore exciting opportunities in ceramic manufacturing.<br />
          Join our team and build your future with us.
        </p>
      </header>


      <div className="max-w-5xl mx-auto px-6 -mt-12">
        <div className="bg-white p-5 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search jobs by title, department, or skills.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D60041]/10 focus:border-[#D60041] transition-all text-[14px]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          
          <div className="relative w-full md:w-64">
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D60041]/10 focus:border-[#D60041] text-[14px] text-gray-600 cursor-pointer"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
          </div>
        </div>
        
        <div className="mt-10 mb-6 flex justify-between items-center">
          <p className="text-gray-500 text-[14px]">
            {isLoading ? 'Loading opportunities...' : (
              <>Showing <span className="font-bold text-black">{filteredJobs.length}</span> open positions</>
            )}
          </p>
        </div>

    
        {error && (
          <div className="text-center py-10 text-red-500 bg-red-50 rounded-2xl border border-red-100 mb-10">
            <i className="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
            <p className="font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm underline font-bold">Try Refreshing</button>
          </div>
        )}

 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {isLoading ? (
            [1, 2, 3, 4].map(n => (
              <div key={n} className="h-64 bg-gray-50 rounded-[16px] animate-pulse border border-gray-100"></div>
            ))
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-[18px] font-bold text-gray-800">{job.title}</h3>
                    <p className="text-[13px] text-gray-400 mt-1 flex items-center gap-2">
                      <i className="fa-regular fa-building"></i> {job.department}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.is_active ? 'bg-[#e6fcf5] text-[#20c997] border border-[#c3fae8]' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {job.is_active ? 'Active' : 'Closed'}
                  </span>
                </div>
                
                <p className="text-gray-500 text-[13px] leading-relaxed mb-5 line-clamp-3">
                  {job.skills_requirements}
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-gray-500 mb-5 mt-auto">
                  <span className="flex items-center gap-1.5"><i className="fa-solid fa-location-dot text-gray-400"></i> {job.location || 'Bulacan'}</span>
                  <span className="flex items-center gap-1.5"><i className="fa-regular fa-clock text-gray-400"></i> {job.job_type || 'Full-time'}</span>
                  <span className="flex items-center gap-1.5 font-bold text-gray-700">{job.salary_range}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="py-2.5 rounded-lg border border-gray-200 font-bold text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                    View Details
                  </button>

                  <button 
  onClick={() => navigate(`/apply/${job.id}`)}
  className="py-2.5 rounded-lg bg-[#D60041] hover:bg-[#b30037] text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
>
  Apply Now <i className="fa-solid fa-arrow-right text-[10px]"></i>
</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <i className="fa-solid fa-box-open text-gray-300 text-4xl mb-4"></i>
              <h3 className="text-gray-800 font-bold text-lg">No jobs found</h3>
              <p className="text-gray-500 text-sm mt-1">Try changing your search or department filter.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedDept('All Departments');}} 
                className="mt-4 text-[#D60041] font-bold text-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="py-10 text-center text-[12px] text-gray-400 border-t border-gray-100 bg-gray-50">
        <p>© 2025 Mariwasa Siam Ceramics Inc. All rights reserved.</p>
        <p className="mt-1 font-medium">Automated Resume Analysis System - Secure & Confidential</p>
      </footer>
    </div>
  );
};

export default CareersPage;