import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import sub-components from the components directory
import StepStepper from '../components/StepStepper';
import UploadView from '../components/UploadView';
import PreviewView from '../components/PreviewView';
// Note: Based on your screenshot, this file is named StepComponent.jsx but used as ApplicationForm
import ApplicationForm from '../components/StepComponent'; 
import { LoadingState, ErrorState } from '../components/StatusStates';


const ApplyPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setIsLoading(true);
                // Ensure your backend URL matches your environment
                const response = await fetch(`http://localhost:8000/hr/jobs/${jobId}`);
                if (!response.ok) throw new Error('Job not found');
                const data = await response.json();
                setJob(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (jobId) fetchJobDetails();
    }, [jobId]);

    const handleProcessAI = async () => {
        if (!selectedFile || !jobId) return;
        const formData = new FormData();
        formData.append('job_id', jobId);
        formData.append('files', selectedFile);

        try {
            setIsExtracting(true);
            const response = await fetch('http://127.0.0.1:8000/candidate/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to extract data');
            }
            
            const data = await response.json();
            const result = data[0];
            
            setResumeData({
                resumeId: result.resume_id,
                email: result.emails?.[0] || 'N/A',
                phone: result.phone_numbers?.[0] || 'N/A',
                followupQuestions: result.followup_questions || [],
                recommendations: result.recommended_jobs || [],
                name: selectedFile.name.split('.')[0].replace(/_/g, ' '),
                location: 'Not Specified'
            });
            
            setStep(2);
        } catch (err) {
            alert("Extraction failed: " + err.message);
        } finally {
            setIsExtracting(false);
        }
    };

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} onBack={() => navigate('/careers')} />;

    return (
        <div className="text-gray-800 bg-[#fcfbfc] min-h-screen font-['Inter',_sans-serif]">
            <nav className="bg-white border-b border-gray-100 px-10 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                    <div>
                        <h1 className="font-bold text-sm tracking-tight text-gray-900">Resume Analysis System</h1>
                        <p className="text-[10px] text-gray-400">AI-Powered Recruitment Platform</p>
                    </div>
                </div>
                <button onClick={() => navigate('/careers')} className="text-xs font-semibold flex items-center gap-2 text-gray-600 hover:text-black">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Jobs
                </button>
            </nav>

            <div className={`mx-auto mt-12 px-4 pb-20 transition-all duration-300 ${step === 2 ? 'max-w-6xl' : 'max-w-4xl'}`}>
                {/* Job Header */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 flex justify-between items-start shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{job?.title}</h2>
                        <p className="text-sm text-gray-400 font-medium lowercase first-letter:uppercase">
                            {job?.department} • {job?.location || 'Bulacan, Philippines'} • {job?.job_type || 'Full-time'}
                        </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                        {job?.is_active ? 'Active' : 'Closed'}
                    </span>
                </div>

                <StepStepper currentStep={step} />

                <main>
                    {step === 1 && (
                        <UploadView 
                            onFileSelect={(e) => setSelectedFile(e.target.files[0])} 
                            selectedFile={selectedFile}
                            removeFile={() => setSelectedFile(null)}
                            onProcess={handleProcessAI}
                            isExtracting={isExtracting} 
                        />
                    )}
                    {step === 2 && (
                        <PreviewView 
                            data={resumeData} 
                            file={selectedFile}
                            onBack={() => setStep(1)} 
                            onNext={() => setStep(3)} 
                        />
                    )}
                    {step === 3 && (
                        <ApplicationForm 
                            job={job} 
                            resumeData={resumeData} 
                            onBack={() => setStep(2)} 
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ApplyPage;