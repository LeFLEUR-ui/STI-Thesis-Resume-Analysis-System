import React, { useState, useEffect } from "react";
import { InfoBox } from "./StatusStates";

const PreviewView = ({ data, file, onBack, onNext }) => {
    const [fileUrl, setFileUrl] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    // Helper to handle "null" display for missing values
    const formatValue = (val) => (val ? val : "null");

    const handleBackClick = async () => {
        try {
            setIsDeleting(true);
            // We call the onBack function which will trigger the DELETE API in the parent
            await onBack();
        } catch (error) {
            console.error("Error during back navigation:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-4">
            {/* Main Content Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-10 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <h2 className="font-bold text-slate-800">Extracted Information</h2>
                </div>
                <p className="text-slate-500 text-sm mb-10">Review the information extracted from your resume</p>

                {/* Personal Information */}
                <div className="mb-10">
                    <h3 className="font-bold text-slate-800 mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                        <InfoBox label="Full Name" value={formatValue(data?.name)} />
                        <InfoBox label="Email" value={formatValue(data?.email)} />
                        <InfoBox label="Phone" value={formatValue(data?.phone)} />
                        <InfoBox label="Location" value={formatValue(data?.location)} />
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-10">
                    <h3 className="font-bold text-slate-800 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data?.skills?.length > 0 ? (
                            data.skills.map((skill, index) => (
                                <span key={index} className="px-4 py-1.5 bg-[#f8f4f2] text-slate-700 text-xs font-semibold rounded-full border border-gray-100">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-slate-400 italic">null</span>
                        )}
                    </div>
                </div>

                {/* Experience */}
                <div className="mb-10">
                    <h3 className="font-bold text-slate-800 mb-4">Experience</h3>
                    <div className="pl-4 border-l-4 border-[#d1004b]">
                        <h4 className="font-bold text-slate-800">
                            {formatValue(data?.experience?.role)}
                        </h4>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            {formatValue(data?.experience?.company)} • {formatValue(data?.experience?.years)}
                        </p>
                        <p className="text-[15px] text-slate-800 mt-1">
                            {formatValue(data?.experience?.description)}
                        </p>
                    </div>
                </div>

                {/* Education */}
                <div className="mb-2">
                    <h3 className="font-bold text-slate-800 mb-4">Education</h3>
                    <div>
                        <h4 className="font-bold text-slate-800">
                            {formatValue(data?.education?.degree)}
                        </h4>
                        <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-tight">
                            {formatValue(data?.education?.school)} • {formatValue(data?.education?.year)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <button 
                    onClick={handleBackClick}
                    disabled={isDeleting}
                    className="w-full md:w-auto px-8 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-800 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {isDeleting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800"></div>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                    )}
                    Back
                </button>
                
                <div className="w-full md:flex-1 flex flex-col md:flex-row gap-4 justify-end">
                    <button 
                        onClick={() => window.open(fileUrl, '_blank')}
                        className="flex-1 max-w-xs px-8 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-800 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        Preview Resume
                    </button>
                    
                    <button 
                        onClick={onNext}
                        className="flex-1 max-w-xs px-8 py-3 bg-[#d1004b] text-white rounded-lg text-sm font-bold hover:bg-[#b0003f] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-100"
                    >
                        Continue to Application
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreviewView;