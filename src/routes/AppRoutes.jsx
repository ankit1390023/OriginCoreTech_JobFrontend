import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import SendOtpEmail from "../pages/auth/SendOtpEmail";
import VerifyOtpEmail from "../pages/auth/VerifyOtpEmail";
import SignUpChooseRole from "../pages/auth/SignUpChooseRole";
import SignUp from "../pages/auth/SignUp";
import SignUpSendOtpEmail from "../pages/auth/SignUpSendOtpEmail";
import StudentFillAccountDetails from "../pages/student/studentFillAccountDetails/StudentFillAccountDetails";
import RecruiterPostJobInternDetails from "../pages/recruiter/recruiterPostJobInternDetails/RecruiterPostJobInternDetails";
import RecruiterProfile from "../pages/recruiter/recruiterProfile/recuiterProfile";
import UniversityFillDetails from "../pages/university/UniversityFillDetails";
import AllJObs from "../pages/student/jobSection/AllJObs";
import JobDetailsPage from "../pages/student/jobSection/JobDetailsPage";

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
        element: <AllJObs />,
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
    }
])
