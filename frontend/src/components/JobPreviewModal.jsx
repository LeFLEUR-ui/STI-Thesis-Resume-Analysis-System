import React, { useState } from 'react';
import { 
  X, Check, Users, DollarSign, Edit3, 
  Archive, UserCheck, ChevronDown, ChevronUp 
} from 'lucide-react';

const JobPreviewModal = ({ isOpen, onClose, job, onEdit }) => {
  const [openSections, setOpenSections] = useState({
    description: true,
    requirements: true,
    responsibilities: false,
    skills: false,
    benefits: false
  });

  if (!isOpen || !job) return null;

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const skillsArray = typeof job.skills_requirements === 'string' 
    ? job.skills_requirements.split(',').map(s => s.trim()) 
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto relative custom-scrollbar font-['Inter']">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Header Section */}
        <div className="px-7 pt-7 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">{job.title}</h2>
              <p className="text-gray-500 text-sm font-medium">{job.department}</p>
            </div>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              job.is_active 
                ? "bg-green-50 text-green-600 border-green-100" 
                : "bg-gray-50 text-gray-400 border-gray-100"
            }`}>
              <Check size={12} strokeWidth={3} />
              {job.is_active ? "active" : "inactive"}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-[#D1004D] rounded-full flex items-center justify-center text-white shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">0</p>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide">Applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center text-[#D1004D] shrink-0">
                <DollarSign size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900 leading-tight">{job.salary_range}</p>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide">Salary Range</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <button 
              onClick={() => { onEdit(job); onClose(); }}
              className="flex items-center justify-center gap-2 bg-[#D1004D] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#B00041] transition-all active:scale-95"
            >
              <Edit3 size={14} strokeWidth={2.5} />
              Edit Job
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all active:scale-95">
              <Archive size={14} strokeWidth={2.5} />
              Archive
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap px-1">
              <UserCheck size={14} strokeWidth={2.5} />
              Applicants
            </button>
          </div>
        </div>

        {/* Content Sections (Accordions) */}
        <div className="px-7 pb-8 space-y-3">
          
          {/* Job Description */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('description')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/30 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-800">Job Description</span>
              {openSections.description ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {openSections.description && (
              <div className="p-4 bg-white border-t border-gray-50">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {job.description || "No description provided."}
                </p>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('requirements')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/30 hover:bg-gray-50"
            >
              <span className="text-sm font-bold text-gray-800">Requirements</span>
              {openSections.requirements ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {openSections.requirements && (
              <div className="p-4 bg-white border-t border-gray-50 space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-green-50 flex items-center justify-center border border-green-200 shrink-0">
                    <Check size={10} strokeWidth={4} className="text-[#10b981]" />
                  </div>
                  <span className="text-gray-700 text-xs font-medium">{job.location} based role.</span>
                </div>
                {/* Dynamic requirements can be mapped here if split by newline */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-green-50 flex items-center justify-center border border-green-200 shrink-0">
                    <Check size={10} strokeWidth={4} className="text-[#10b981]" />
                  </div>
                  <span className="text-gray-700 text-xs font-medium">Employment: {job.employment_type || job.job_type}</span>
                </div>
              </div>
            )}
          </div>

          {/* Required Skills */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection('skills')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/30 hover:bg-gray-50"
            >
              <span className="text-sm font-bold text-gray-800">Required Skills</span>
              {openSections.skills ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {openSections.skills && (
              <div className="p-4 bg-white border-t border-gray-50 flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-lg border border-gray-200/50">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobPreviewModal;