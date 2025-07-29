import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import SignUpChooseRole from "../pages/auth/SignUpChooseRole";
import SignUp from "../pages/auth/SignUp";
import SignUpVerifyOtpEmail from "../pages/auth/SignUpVerifyOtpEmail";
import StudentFillAccountDetails from "../pages/student/studentFillAccountDetails/StudentFillAccountDetails";
import RecruiterPostJobInternDetails from "../pages/recruiter/RecruiterPostJobInternDetails";
import UniversityFillDetails from "../pages/university/UniversityFillDetails";
import AllJObs from "../pages/student/jobSection/AllJObs";
import JobDetailsPage from "../pages/student/jobSection/JobDetailsPage";
import LoginVerifyOtpEmail from "../pages/auth/LoginVerifyOtpEmail";
import LoginSendOtpEmail from "../pages/auth/LoginSendOtpEmail";
import CompanyRecruiterProfile from "../pages/recruiter/CompanyRecuiterProfile";
import FeedPage from "../pages/student/feed/FeedPage";
import FeedMyProfile from "../pages/student/feed/FeedMyProfile";
import FeedView from "../pages/student/feed/FeedView";
import FeedApplication from "../pages/student/feed/FeedApplication";
import FeedTerms from "../pages/student/feed/FeedTerms";
import FeedResume from "../pages/student/feed/FeedResume";
import FeedTicket from "../pages/student/feed/FeedTicket";
import FeedHelp from "../pages/student/feed/FeedHelp";
import Feedprofile from "../pages/student/feed/Feedprofile";
import FeedChangeEmail from "../pages/student/feed/FeedchangeEmail";
import FeedChangePassword from "../pages/student/feed/FeedChangePassword";
import FeedYourSkills from "../pages/student/feed/FeedYourSkills";
import FeedYourEducation from "../pages/student/feed/FeedYourEducation";
import FeedYourExprience from "../pages/student/feed/FeedYourExprience";

export const appRouter = createBrowserRouter([
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
        path: "/login-send-otp-email",
        element: <LoginSendOtpEmail />,
    },
    {
        path: "/login-verify-otp-email",
        element: <LoginVerifyOtpEmail />,
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
        path: "/signup-verify-otp-email",
        element: <SignUpVerifyOtpEmail />,
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
        element: <AllJObs />,
    },
    {
        path: "/jobs/:jobId",
        element: <JobDetailsPage />,
    },
    {
        path: "/recruiter-profile",
        element: <CompanyRecruiterProfile />
    },
    {
        path: "/university-fill-details",
        element: <UniversityFillDetails />
    },
    {
        path: "/feed",
        element: <FeedPage />
    },
    {
        path: "/feed-my-profile",
        element: <FeedMyProfile />,
    },
    {
        path: "/feed-view",
        element: <FeedView />,
    },
    {
        path: "/feed-application",
        element: <FeedApplication />,
    },
    {
        path: "/feed-terms",
        element: <FeedTerms />,
    },
    {
        path: "/feed-resume",
        element: <FeedResume />,
    },
    {
        path: "/feed-ticket",
        element: <FeedTicket />,
    },
    {
        path: "/feed-help",
        element: <FeedHelp />,
    },
    {
        path: "/feed-profile",
        element: <Feedprofile />,
    },
    {
        path: "/feed-change-email",
        element: <FeedChangeEmail />,
    },
    {
        path: "/feed-change-password",
        element: <FeedChangePassword />,
    },
    {
        path: "/feed-your-skills",
        element: <FeedYourSkills />,
    },
    {
        path: "/feed-your-education",
        element: <FeedYourEducation />,
    },
    {
        path: "/feed-your-exprience",
        element: <FeedYourExprience />,
    },
    
    
    
    
   
])
