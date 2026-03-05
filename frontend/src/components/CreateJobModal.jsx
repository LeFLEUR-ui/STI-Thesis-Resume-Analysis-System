import React, { useState } from 'react';
import axios from 'axios';
import { X, ChevronDown, Loader2 } from 'lucide-react';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Initial state updated to include 'description' to match backend
  const initialFormState = {
    job_id: `JOB-${Math.floor(Math.random() * 9000) + 1000}`,
    title: '',
    department: '',
    location: 'Bulacan, Philippines',
    job_type: 'Full-time',
    salary_range: '',
    description: '', // Matches backend: description = Form(None)
    skills_requirements: '',
    is_active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get token from localStorage (assuming that's where your auth.get_current_hr looks)
    const token = localStorage.getItem('token');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post('http://localhost:8000/hr/job-description', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setFormData(initialFormState); // Reset form
      onSuccess(); // Trigger parent refresh
      onClose();   // Close modal
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Failed to create job posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Create New Job Posting</h2>
          <p className="text-gray-500 text-sm mt-0.5 font-medium tracking-tight">Post a new position to the Mariwasa HR Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-800">Job Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Electronics Engineer" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-800">Department</label>
              <div className="relative">
                <select required name="department" value={formData.department} onChange={handleChange} className="w-full appearance-none px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-700">
                  <option value="">Select Dept</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Logistics">Logistics</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-800">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-800">Job Type</label>
              <div className="relative">
                <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full appearance-none px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm text-gray-700">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">Salary Range</label>
            <input name="salary_range" value={formData.salary_range} onChange={handleChange} type="text" placeholder="e.g. ₱35,000 - ₱45,000" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm" />
          </div>

          {/* New Description Field to match Backend */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">Job Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Briefly describe the role..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm resize-none"></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">Required Skills</label>
            <textarea required name="skills_requirements" value={formData.skills_requirements} onChange={handleChange} rows="2" placeholder="Skill A, Skill B, Skill C..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-[#D1004D] text-sm resize-none"></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-[#D1004D] text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;