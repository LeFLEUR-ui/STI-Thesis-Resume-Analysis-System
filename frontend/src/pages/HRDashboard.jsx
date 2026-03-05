import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/HRHeader';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  Clock, 
  BarChart3, 
  Zap, 
  Users, 
  Briefcase, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const BASE_URL = "http://localhost:8000";

const StatCard = ({ icon: Icon, label, value, trend, trendColor, bgColor, iconColor }) => (
  <div className="flex items-center space-x-4 p-4 border border-gray-50 rounded-2xl hover:border-pink-100 hover:shadow-md transition-all group bg-white">
    <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
      <h4 className="text-2xl font-black">{value}</h4>
      {trend && (
        <p className={`text-[10px] ${trendColor} flex items-center`}>
          {trend}
        </p>
      )}
    </div>
  </div>
);

const CandidateRow = ({ name, role, skills, match, status, profileImage }) => {
  const statusStyles = {
    pending: "bg-gray-100 text-gray-500",
    reviewed: "bg-white border border-gray-100 text-gray-400",
    approved: "bg-[#D60041] text-white",
    rejected: "bg-red-50 text-red-400"
  };

  const skillsList = Array.isArray(skills) 
    ? skills 
    : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : []);

  return (
    <div className="flex items-center justify-between p-4 border border-gray-50 rounded-[24px] hover:border-pink-100 hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        {/* Exact Layout: 12x12 Container. Displays Image if exists, else fallback to Icon */}
        <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50">
          {profileImage ? (
            <img 
              src={profileImage.startsWith('http') ? profileImage : `${BASE_URL}${profileImage}`} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className="text-pink-600 h-5 w-5" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-[15px] text-gray-900">{name || "Unnamed Applicant"}</h3>
          <p className="text-[12px] text-gray-400 font-medium">{role || "General Application"}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex gap-2">
          {skillsList.slice(0, 2).map((skill, i) => (
            <span key={i} className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-600">
              {skill}
            </span>
          ))}
          {skillsList.length > 2 && (
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-400">
              +{skillsList.length - 2}
            </span>
          )}
        </div>
        <div className="text-center w-20">
          <p className="text-[#D60041] font-extrabold text-lg leading-none">{match || 0}%</p>
          <p className="text-[9px] text-gray-400 uppercase font-extrabold tracking-tighter mt-1">Match</p>
        </div>
        <div className="w-24 flex justify-center">
          <span className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[status] || statusStyles.pending}`}>
            {status}
          </span>
        </div>
        <button className="px-6 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors">
          Review
        </button>
      </div>
    </div>
  );
};

const HRDashboard = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dbStats, setDbStats] = useState({ total: 0, pending: 0, reviewed: 0 });
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [recentCandidates, setRecentCandidates] = useState([]);

  const fetchDashboardData = useCallback(async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const statsRes = await axios.get(`${BASE_URL}/hr/resumes/stats`, config);
      setDbStats(statsRes.data);

      const jobsRes = await axios.get(`${BASE_URL}/hr/jobs`, config);
      setActiveJobsCount(jobsRes.data.length);

      const resumesRes = await axios.get(`${BASE_URL}/hr/resumes`, config);
      
      const sortedResumes = resumesRes.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      
      setRecentCandidates(sortedResumes);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    document.title = "Human Resource Dashboard | Mariwasa HR Portal";
    
    if (!token) {
      navigate('/signin'); 
    } else {
      setIsAuthorized(true);
      fetchDashboardData(token);
    }
  }, [navigate, fetchDashboardData]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-bold text-gray-400">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] text-gray-800 antialiased min-h-screen font-['Inter']">
      <Header />
      <main className="max-w-[1400px] mx-auto px-10 py-8">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-sm text-gray-400">Live recruitment analytics from database</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl hover:shadow-sm transition-all text-xs font-semibold text-gray-600 flex items-center">
              Real-time <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl hover:shadow-sm transition-all text-xs font-semibold text-gray-600 flex items-center">
              <Download className="h-3 w-3 mr-2" /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[24px] p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-sm">Key Metrics</h3>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">Overview of recruitment performance</p>
            </div>
            <ChevronUp className="h-4 w-4 text-gray-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={FileText} label="Total Resumes" value={dbStats.total} trend="Live Database" trendColor="text-gray-400" bgColor="bg-pink-50" iconColor="text-[#D10043]" />
            <StatCard icon={Clock} label="Pending Review" value={dbStats.pending} trend="Requires attention" trendColor="text-orange-500" bgColor="bg-orange-50" iconColor="text-orange-400" />
            <StatCard icon={Briefcase} label="Active Jobs" value={activeJobsCount} trend="Current Openings" trendColor="text-blue-500" bgColor="bg-blue-50" iconColor="text-blue-400" />
            <StatCard icon={Zap} label="Avg Processing" value="1.8s" trend="AI analysis time" trendColor="text-gray-400" bgColor="bg-purple-50" iconColor="text-purple-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm h-[400px] mb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-[15px] font-bold text-gray-900">Application Trends</h3>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">Daily submission trends and average scores</p>
                </div>
                <ChevronUp className="h-4 w-4 text-gray-300" />
            </div>
            <div className="w-full h-[250px] relative border-b border-l border-gray-200 mt-10">
                <div className="absolute -left-6 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400">
                    <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
                </div>
                <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-gray-400 px-2">
                    <span>Jan 15</span><span>Jan 14</span><span>Jan 13</span><span>Jan 12</span><span>Jan 11</span><span>Jan 10</span><span>Jan 09</span>
                </div>
                <div className="w-full h-full flex flex-col justify-between">
                    {[1,2,3,4].map(i => <div key={i} className="border-t border-gray-100 border-dashed w-full h-px"></div>)}
                </div>
            </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Recent Submissions</h3>
              <p className="text-sm text-gray-400 mt-1 font-medium">Latest resume submissions from the database</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/screening')} className="bg-gray-50 text-gray-700 px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">
                View All
              </button>
              <ChevronUp className="text-xs text-gray-300" />
            </div>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <Loader2 className="animate-spin h-6 w-6 mb-2" />
                <p className="text-xs font-bold uppercase">Syncing with database...</p>
              </div>
            ) : recentCandidates.length > 0 ? (
              recentCandidates.map((can) => (
                <CandidateRow 
                  key={can.id} 
                  name={can.name}
                  role={can.preferredJob}
                  skills={can.skills}
                  match={can.matchScore}
                  status={can.status}
                  profileImage={can.profileImage}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 border border-dashed rounded-[24px]">
                No submissions found.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div onClick={() => navigate('/screening')} className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start gap-5">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="text-orange-500 h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Pending Reviews</h4>
                    <p className="text-[13px] text-gray-400 font-medium mt-1">{dbStats.pending} applications waiting</p>
                </div>
            </div>
            <div onClick={() => navigate('/jobs')} className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start gap-5">
                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-pink-600 h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Active Positions</h4>
                    <p className="text-[13px] text-gray-400 font-medium mt-1">{activeJobsCount} roles currently open</p>
                </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-blue-500 h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Department Reports</h4>
                    <p className="text-[13px] text-gray-400 font-medium mt-1">Detailed analytics</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;