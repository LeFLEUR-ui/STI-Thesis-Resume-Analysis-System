import { useNavigate } from 'react-router-dom';

const CareersPage = () => {
  const navigate = useNavigate(); 
  


  return (

    

    <button 
      onClick={() => navigate(`/apply/${job.job_id}`)} 
      className="py-2.5 rounded-lg bg-[#D60041] hover:bg-[#b30037] text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
    >
      Apply Now <i className="fa-solid fa-arrow-right text-[10px]"></i>
    </button>
  );
};