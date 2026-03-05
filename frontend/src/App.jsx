import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import CareersPage from "./pages/CareersPage";
import LandingPage from "./pages/LandingPage";
import ApplyPage from "./pages/ApplyPage";
import HRDashboard from "./pages/HRDashboard";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import ScreeningPortal from "./pages/ScreeningPortal";
import JobManagement from "./pages/JobManagementPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Applicant's view */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/apply/:jobId" element={<ApplyPage />} />
        <Route path="/success" element={<SubmissionSuccess />} />

        {/* HR Endpoints */}
        <Route path="/hrdashboard" element={<HRDashboard />} />
        <Route path="/screening" element={<ScreeningPortal />} />
        <Route path="/jobmanagement" element={<JobManagement />} />
      </Routes>
    </Router>
  );
}

export default App;