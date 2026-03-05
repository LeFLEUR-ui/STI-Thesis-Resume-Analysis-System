import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Header from '../components/HRHeader';
import CreateJobModal from '../components/CreateJobModal';
import EditJobModal from '../components/EditJobModal';
import JobPreviewModal from '../components/JobPreviewModal'; 
import { Loader2 } from 'lucide-react';


// --- Sub-component: JobCard ---
const JobCard = ({ job, onEdit, onView }) => {
  const skillsArray = typeof job.skills_requirements === 'string' 
    ? job.skills_requirements.split(',').map(s => s.trim()) 
    : [];
  
  const displaySkills = skillsArray.slice(0, 4);
  const remainingCount = skillsArray.length - 4;

  return (
    <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm group hover:border-pink-200 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            <span className={`w-fit text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 uppercase ${
              job.is_active 
                ? "bg-emerald-50 text-emerald-500 border-emerald-100" 
                : "bg-gray-50 text-gray-400 border-gray-100"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${job.is_active ? "bg-emerald-500" : "bg-gray-400"}`}></span> 
              {job.is_active ? "active" : "inactive"}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gray-500 mb-6">
            <span className="flex items-center gap-2">
              <i className="far fa-building text-gray-400"></i> {job.department}
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-gray-400"></i> {job.location}
            </span>
            <span className="flex items-center gap-2">
              <i className="far fa-calendar text-gray-400"></i> 
              ID: {job.job_id}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6">
            <div className="flex items-center gap-2">
              <i className="fas fa-users text-[#d81159] text-sm opacity-60"></i>
              <span className="text-sm font-bold text-gray-700">0 applications</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-hand-holding-dollar text-[#d81159] text-sm opacity-60"></i>
              <span className="text-sm font-bold text-gray-700">{job.salary_range}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill, index) => (
              <span key={index} className="bg-gray-50 text-gray-600 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-gray-100">
                {skill}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="bg-gray-50 text-gray-400 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-gray-50">
                +{remainingCount} more
              </span>
            )}
          </div>
        </div>
        
        {/* Buttons: Stacked on mobile, side-by-side on desktop */}
        <div className="flex sm:flex-row md:flex-col lg:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={onEdit}
            className="flex-1 sm:flex-none justify-center px-4 py-2 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <i className="far fa-edit"></i> Edit
          </button>
          <button 
            onClick={onView}
            className="flex-1 sm:flex-none justify-center px-4 py-2 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <i className="far fa-eye"></i> View
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/hr/jobs');
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load jobs. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Job Management Page | Mariwasa HR Portal";
    fetchJobs();
  }, [fetchJobs]);

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setIsPreviewModalOpen(true);
  };

  const departments = useMemo(() => {
    const depts = jobs.map(j => j.department);
    return ["All Departments", ...new Set(depts)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchMatch = !searchQuery.trim() || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills_requirements?.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatch = selectedStatus === "All Status" || 
        (selectedStatus === "Active" && job.is_active) ||
        (selectedStatus === "Inactive" && !job.is_active);

      const deptMatch = selectedDept === "All Departments" || job.department === selectedDept;

      return searchMatch && statusMatch && deptMatch;
    });
  }, [searchQuery, selectedStatus, selectedDept, jobs]);

  return (
    <div className="bg-[#fdfafb] min-h-screen font-['Inter'] antialiased text-gray-800">
      <Header />
      
      {/* Responsive horizontal padding: px-4 for mobile, px-12 for large screens */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        
        {/* Header: Stacks on small screens */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Job Management</h2>
            <p className="text-gray-500 text-sm mt-1">Create and manage job postings</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#d81159] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-pink-100 transition-all active:scale-95"
          >
            <i className="fas fa-plus text-xs"></i>
            Create Job
          </button>
        </div>

        {/* Filter Bar: Re-arranged for mobile screens */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-50 placeholder:text-gray-300 transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative min-w-[160px]">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-100 px-5 py-3 rounded-xl text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] pointer-events-none"></i>
            </div>

            <div className="relative min-w-[160px]">
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-100 px-5 py-3 rounded-xl text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-[#d81159]" />
            <p className="font-medium">Fetching job listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 p-10 md:p-20 rounded-2xl text-center text-gray-400">
            <i className="fas fa-search h-10 w-10 mx-auto mb-4 opacity-20"></i>
            <p className="font-medium">No jobs match your filters.</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onEdit={() => handleEditClick(job)}
                onView={() => handleViewClick(job)} 
              />
            ))}
          </div>
        )}
      </main>

      <CreateJobModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchJobs} />
      <EditJobModal isOpen={isEditModalOpen} onClose={() => {setIsEditModalOpen(false); setSelectedJob(null);}} job={selectedJob} onSuccess={fetchJobs} />
      <JobPreviewModal isOpen={isPreviewModalOpen} onClose={() => {setIsPreviewModalOpen(false); setSelectedJob(null);}} job={selectedJob} onEdit={handleEditClick} />
    </div>
  );
};

export default JobManagement;