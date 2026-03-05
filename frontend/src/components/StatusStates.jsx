import React from 'react';

export const LoadingState = () => (
    <div className="flex flex-col justify-center items-center h-screen bg-[#fcfbfc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
        <p className="font-bold text-gray-400">Loading Job Details...</p>
    </div>
);

export const ErrorState = ({ error, onBack }) => (
    <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
            onClick={onBack} 
            className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-pink-700 transition-all"
        >
            Return to Careers
        </button>
    </div>
);

// If you are using the InfoBox in multiple places, you can add it here too
export const InfoBox = ({ label, value }) => (
    <div>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mb-1">{label}:</p>
        <p className="text-sm font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
);