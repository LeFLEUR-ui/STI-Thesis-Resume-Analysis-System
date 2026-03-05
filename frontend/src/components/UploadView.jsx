import React from 'react';

const UploadView = ({ onFileSelect, selectedFile, removeFile, onProcess, isExtracting }) => (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 shadow-sm flex flex-col items-center w-full">
        <div className="flex items-center gap-3 mb-8 justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            <h3 className="font-bold text-gray-900">Upload Your Resume</h3>
        </div>

        <div className={`w-full border border-dashed border-gray-200 rounded-2xl py-16 flex flex-col items-center justify-center transition-all ${!selectedFile ? 'hover:bg-gray-50 cursor-pointer' : 'bg-white'}`}>
            {!selectedFile ? (
                <>
                    <input 
                        type="file" 
                        className="hidden" 
                        id="fileUpload" 
                        onChange={onFileSelect} 
                        accept=".pdf,.docx,.txt" 
                    />
                    <label htmlFor="fileUpload" className="flex flex-col items-center cursor-pointer w-full text-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <p className="font-bold text-sm mb-1 text-gray-700 px-4">Drag and drop your resume here, or click to browse</p>
                        <p className="text-xs text-gray-400">Supported formats: PDF, DOCX, TXT (Max 5MB)</p>
                        <div className="mt-8 bg-gray-100 px-6 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 border border-gray-100 transition-colors">
                            Choose File
                        </div>
                    </label>
                </>
            ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-4 border border-pink-100">
                        <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <p className="font-bold text-sm text-gray-800 mb-1">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mb-6">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                        onClick={removeFile} 
                        className="text-xs font-bold text-gray-500 hover:text-red-500 underline transition-colors"
                    >
                        Remove File
                    </button>
                </div>
            )}
        </div>

        {selectedFile && (
            <div className="w-full flex justify-center">
                <button 
                    onClick={onProcess}
                    disabled={isExtracting}
                    className="w-full max-w-md mt-8 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-pink-100 active:scale-[0.98]"
                >
                    {isExtracting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <span>Process with AI</span>
                            <i className="fas fa-arrow-right text-xs"></i>
                        </>
                    )}
                </button>
            </div>
        )}
    </div>
);

export default UploadView;