import React, { useEffect, useState } from 'react';
import HRHeader from '../components/HRHeader';
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

const ScreeningPortal = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    document.title = "HR Portal - Resume Screening";
    fetchCandidates();
  }, []);

  useEffect(() => {
    let result = candidates;

    if (statusFilter !== "All Status") {
      result = result.filter(c => c.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name?.toLowerCase().includes(q) || 
        c.preferredJob?.toLowerCase().includes(q) ||
        (Array.isArray(c.skills) && c.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    setFilteredCandidates(result);
  }, [searchQuery, statusFilter, candidates]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/hr/resumes`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.status === 401 ? "Unauthorized access. Please login." : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toISOString().replace('T', ' ').substring(0, 16);
  };

  return (
    <div className="min-h-screen text-gray-800 font-['Inter',_sans-serif] bg-[#fdfafb]">
      <HRHeader />

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Screening</h2>
            <p className="text-gray-500">Review and manage candidate applications</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <i className="fas fa-download text-gray-400"></i>
            Export List
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex gap-4">
          <div className="relative flex-grow">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search by name, position, or skills..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-48 relative">
            <select 
              className="w-full appearance-none bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Reviewed</option>
            </select>
            <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20"><i className="fas fa-circle-notch animate-spin text-[#d81159] text-3xl"></i></div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">{error}</div>
          ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400">No candidates found.</div>
          ) : (
            filteredCandidates.map(candidate => {
              const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
              
              // --- SUPABASE IMAGE LOGIC ---
              const imageUrl = candidate.profileImage 
                ? (candidate.profileImage.startsWith('http') 
                    ? candidate.profileImage 
                    : `${BASE_URL}/${candidate.profileImage}`)
                : null;
              
              const status = candidate.status?.toLowerCase() || 'pending';

              return (
                <div key={candidate.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-pink-100 transition-colors">
                  <div className="flex gap-4">
                    {/* User Avatar - Displaying Image instead of Icon */}
                    <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center text-pink-400 overflow-hidden shrink-0 border border-pink-100">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${candidate.name}&background=fdf2f8&color=d81159`; 
                          }}
                        />
                      ) : (
                        <i className="fas fa-user text-xl"></i>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900">{candidate.name || "N/A"}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          status === 'reviewed' 
                          ? 'bg-blue-50 text-blue-400 border-blue-100' 
                          : 'bg-orange-50 text-orange-400 border-orange-100'
                        }`}>
                          {status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-pink-50 text-[#d81159] text-[11px] px-3 py-1 rounded-full border border-pink-100 flex items-center gap-1 font-medium">
                          <i className="far fa-star"></i> Preferred: {candidate.preferredJob || "Not specified"}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills.length > 0 ? (
                          <>
                            {skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-md">
                                {skill}
                              </span>
                            ))}
                            {skills.length > 4 && (
                              <span className="bg-gray-50 text-gray-400 text-[11px] px-2 py-1 rounded-md">
                                +{skills.length - 4} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-[11px] italic">No skills listed</span>
                        )}
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center gap-6 text-[12px] text-gray-400">
                        <span className="flex items-center gap-1.5"><i className="far fa-calendar"></i> {formatDate(candidate.date)}</span>
                        <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt"></i> {candidate.location || "Location Unknown"}</span>
                        <span className={`flex items-center gap-1.5 font-semibold ${candidate.matchScore ? 'text-emerald-500' : 'text-gray-300'}`}>
                          <i className="far fa-star"></i> {candidate.matchScore ? `${candidate.matchScore}% Match` : "No Score"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                      <i className="far fa-eye"></i> View Details
                    </button>
                    <button className="px-5 py-2 bg-[#d81159] text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm shadow-pink-100">
                      <i className="far fa-calendar-check"></i> Schedule Interview
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default ScreeningPortal;