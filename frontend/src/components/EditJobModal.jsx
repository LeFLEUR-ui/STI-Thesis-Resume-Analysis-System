import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, ChevronDown, Loader2 } from 'lucide-react';

const EditJobModal = ({ isOpen, onClose, onSuccess, job }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    job_type: 'On-site', // Matches your backend Form field
    employment_type: 'Full-time',
    salary_range: '',
    description: '',
    skills_requirements: '',
    is_active: true
  });

  // Pre-fill form when the modal opens with a specific job
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        job_type: job.job_type || 'On-site',
        employment_type: job.employment_type || 'Full-time',
        salary_range: job.salary_range || '',
        description: job.description || '',
        skills_requirements: job.skills_requirements || '',
        is_active: job.is_active ?? true
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      // 1. Get the token from storage (make sure this matches where you store it at login)
      const token = localStorage.getItem('token'); 

      // 2. Add the headers object to your put request
      await axios.put(
        `http://localhost:8000/hr/job-description/${job.job_id}`, 
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' // Axios usually sets this automatically for FormData
          }
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      // Detailed error logging
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert("Failed to update job. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto relative font-['Inter']">
        
        <button 
          onClick={onClose}
          className="absolute right-5 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="px-7 pt-7 pb-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Edit Job Posting</h2>
          <p className="text-gray-500 text-[14px] mt-0.5">Update the details for this position</p>
        </div>

        <form onSubmit={handleSubmit} className="px-7 pb-8 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[14px] font-semibold text-gray-800">Job Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[14px] font-semibold text-gray-800">Department</label>
              <div className="relative">
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full appearance-none px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-900 cursor-pointer"
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[14px] font-semibold text-gray-800">Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[14px] font-semibold text-gray-800">Employment Type</label>
              <div className="relative">
                <select 
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full appearance-none px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-900 cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[14px] font-semibold text-gray-800">Salary Range</label>
            <input 
              type="text" 
              name="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              placeholder="₱00,000 - ₱00,000"
              className="w-full px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[14px] font-semibold text-gray-800">Job Description</label>
            <textarea 
              name="description"
              rows="3" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role..." 
              className="w-full px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm placeholder:text-gray-400 resize-none"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[14px] font-semibold text-gray-800">Required Skills (comma-separated)</label>
            <input 
              type="text" 
              name="skills_requirements"
              value={formData.skills_requirements}
              onChange={handleChange}
              placeholder="e.g. Production Planning, Quality Control" 
              className="w-full px-3 py-2.5 bg-[#FCFCFD] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#D1004D] text-sm font-bold text-white hover:bg-[#B00041] transition-all shadow-lg shadow-pink-500/10 active:scale-95 disabled:opacity-70"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditJobModal;