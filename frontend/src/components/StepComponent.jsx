const StepItem = ({ stepNum, label, currentStep }) => {
    const isCompleted = currentStep > stepNum;
    const isActive = currentStep === stepNum;
    
    return (
        <div className={`flex items-center gap-3 ${isActive || isCompleted ? 'text-pink-600 font-semibold' : ''}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-all ${
                isCompleted ? 'bg-pink-600 text-white border-pink-600' : 
                isActive ? 'bg-pink-50 text-pink-600 border-pink-600' : 'bg-gray-100 text-gray-400 border-gray-100'
            }`}>
                {isCompleted ? '✓' : stepNum}
            </span>
            {label}
        </div>
    );
};

const StepStepper = ({ currentStep }) => (
    <div className="flex items-center justify-between px-4 mb-10 text-xs text-gray-400 max-w-4xl mx-auto">
        <StepItem stepNum={1} label="Upload Resume" currentStep={currentStep} />
        <div className="flex-1 h-px bg-gray-200 mx-6"></div>
        <StepItem stepNum={2} label="Preview & Verify" currentStep={currentStep} />
        <div className="flex-1 h-px bg-gray-200 mx-6"></div>
        <StepItem stepNum={3} label="Complete Application" currentStep={currentStep} />
    </div>
);

export default StepStepper;