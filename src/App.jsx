import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import SendOtpEmail from "./components/auth/SendOtpEmail";
import VerifyOtpEmail from "./components/auth/VerifyOtpEmail";
import Home from "./components/Home";
import SignUpChooseRole from "./components/auth/SignUpChooseRole";
import SignUp from "./components/auth/SignUp";
import SignUpSendOtpEmail from "./components/auth/SignUpSendOtpEmail";
import AllJobs from "./components/student/jobSection/AllJObs.jsx"
import JobDetailsPage from "./components/student/jobSection/JobDetailsPage.jsx";
import StudentFillAccountDetails from "./components/student/studentFillAccountDetails/StudentFillAccountDetails.jsx";
import RecruiterPostJobInternDetails from "./components/recruiter/recruiterPostJobInternDetails/RecruiterPostJobInternDetails.jsx";
import RecruiterProfile from "./components/recruiter/recruiterProfile/recuiterProfile.jsx";
import UniversityFillDetails from "./components/university/UniversityFillDetails.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/send-otp-email",
    element: <SendOtpEmail />,
  },
  {
    path: "/verify-otp-email",
    element: <VerifyOtpEmail />,
  },
  {
    path: "/signup-choose-role",
    element: <SignUpChooseRole />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signup-send-otp-email",
    element: <SignUpSendOtpEmail />,
  },
  {
    path: "/student-fill-account-details",
    element: <StudentFillAccountDetails />
  },
  {
    path: "/recruiter-post-job-intern-details",
    element: <RecruiterPostJobInternDetails />,
  },
  {
    path: "/all-jobs",
    element: <AllJobs />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetailsPage />,
  },
  {
    path: "/recruiter-profile",
    element: <RecruiterProfile />
  },
  {
    path: "/university-fill-details",
    element: <UniversityFillDetails />
  },


]);
const App = () => {
  return <RouterProvider router={appRouter} />;
};
export default App;
