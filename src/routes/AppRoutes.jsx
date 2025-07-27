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
import FeedActivity from "../pages/student/feed/FeedActivity";
import FeedView from "../pages/student/feed/FeedView";
import FeedApplication from "../pages/student/feed/FeedApplication";
import FeedTerms from "../pages/student/feed/FeedTerms";

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
        path: "/feed-activity",
        element: <FeedActivity />,
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
   
])
