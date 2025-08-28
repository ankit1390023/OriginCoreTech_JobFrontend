import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
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
import Feedprofile from "../pages/student/feed/Feedprofile";
import FeedChangeEmail from "../pages/student/feed/FeedchangeEmail";
import FeedChangePassword from "../pages/student/feed/FeedChangePassword";
import FeedYourSkills from "../pages/student/feed/FeedYourSkills";
import FeedYourEducation from "../pages/student/feed/FeedYourEducation";
import FeedYourExprience from "../pages/student/feed/FeedYourExprience";
import FeedDashBoard from "../pages/student/feed/FeedDashBoard";
import FeedAuthentication from "../pages/student/feed/FeedAuthentication";
import FeedFaq from "../pages/student/feed/FeedFaq";
import MyMassage from "../pages/student/application/MyMassage";
import MyNotification from "../pages/student/application/MyNotification";
import RecruiterDashboard from "../pages/recruiter/dashboard/RecruiterDashboard";
import RecruiterTotalJobPost from "../pages/recruiter/dashboard/RecruiterTotalJobPost";
import RecruiterApplication from "../pages/recruiter/dashboard/RecruiterApplication";
import RecruiterApplicationDetails from "../pages/recruiter/dashboard/RecruiterApplicationDetails";
import RecruiterApplicationData from "../pages/recruiter/dashboard/RecruiterApplicationData";
import RecruiterSendAssignment from "../pages/recruiter/dashboard/RecruiterSendAssignment";
import RecruiterInterview from "../pages/recruiter/dashboard/RecruiterInterview";
import RecruiterApproval from "../pages/recruiter/dashboard/RecruiterApproval";
import RecruitePipeline from "../pages/recruiter/dashboard/RecruiterPipeline";
import RecruiterUpcommingInterview from "../pages/recruiter/dashboard/RecruiterUpcommingInterview";
import RecruiterPendingTask from "../pages/recruiter/dashboard/RecruiterPendingTask";
import RecruiterProfile from "../pages/recruiter/profile/RecruiterVisitores";
import RecruiterTerms from "../pages/recruiter/profile/RecruiterTerms";
import RecruiterView from "../pages/recruiter/profile/RecruiterView";
import UniversityProfile from "../pages/university/universityProfile/UniversityProfile";
import UniversityChangeEmail from "../pages/university/universityProfile/UniversityChangeEmail";
import UniversityChangePassword from "../pages/university/universityProfile/UniversityChangePassword";
import UniversityFaq from "../pages/university/universityProfile/UniversityFaq";
import UniversityView from "../pages/university/universityProfile/UniversityView";
import UniversityTerms from "../pages/university/universityProfile/UniversityTerm";
import RecruiterPayment from "../pages/recruiter/profile/RecruiterPayment";
import RecruiterPricing from "../pages/recruiter/profile/RecruiterPricing";
import RecruiterPaymentMethod from "../pages/recruiter/profile/RecruiterPaymentMethod";
import RecruiterChangePassword from "../pages/recruiter/profile/RecruiterChangePassword";
import RecruiterChangeEmail from "../pages/recruiter/profile/RecruiterChangeEmail";
import UniversityTicket from "../pages/university/universityProfile/UniversityTicket";
import UniversityPricing from "../pages/university/universityProfile/UniversityPricing";
import UniversityPayment from "../pages/university/universityProfile/UniversityPayment";
import UniversityPaymentMethod from "../pages/university/universityProfile/UniversityPaymentMethod";
import UniversityApproval from "../pages/university/universityProfile/UniversityApproval";
import AiProfile from "../pages/aiprediction/AiProfile";
import AiProfile1 from "../pages/aiprediction/AiProfile1";
import AllJObsPart from "../pages/aiprediction/AlljobsPart";
import RecruiterRightProfile from "../pages/recruiter/dashboard/RecruiterRightProfile";

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, userRole } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Wrapper Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Don't redirect if it's the OTP verification page
  if (location.pathname === '/signup-verify-otp-email') {
    return children;
  }

  // For all other public routes, redirect to student-fill-account-details if authenticated
  if (isAuthenticated) {
    return <Navigate to="/student-fill-account-details" replace />;
  }

  return children;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />,
      </PublicRoute>
    )
  },
  {
    path: "/login-send-otp-email",
    element: (
      <PublicRoute>
        <LoginSendOtpEmail />
      </PublicRoute>
    )
  },
  {
    path: "/login-verify-otp-email",
    element: (
      <PublicRoute>
        <LoginVerifyOtpEmail />,
      </PublicRoute>
    )
  },
  {
    path: "/signup-choose-role",
    element: (
      <PublicRoute>
        <SignUpChooseRole />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />,
      </PublicRoute>
    )
  },
  {
    path: "/signup-verify-otp-email",
    element: (
      <PublicRoute>
        <SignUpVerifyOtpEmail />,
      </PublicRoute>
    )
  },
  {
    path: "/student-fill-account-details",
    element: (
      <ProtectedRoute>
        <StudentFillAccountDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-post-job-intern-details",
    element: (
      <ProtectedRoute>
        <RecruiterPostJobInternDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/all-jobs",
    element: (
      <ProtectedRoute>
        <AllJObs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobs/:job_id",
    element: (
      <ProtectedRoute>
        <JobDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed",
    element: (
      <ProtectedRoute>
        <FeedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-my-profile",
    element: (
      <ProtectedRoute>
        <FeedMyProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-view",
    element: (
      <ProtectedRoute>
        <FeedView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-application",
    element: (
      <ProtectedRoute>
        <FeedApplication />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-terms",
    element: (
      <ProtectedRoute>
        <FeedTerms />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-resume",
    element: (
      <ProtectedRoute>
        <FeedResume />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-ticket",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'RECRUITER', 'UNIVERSITY']}>
        <FeedTicket />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-profile",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'RECRUITER', 'UNIVERSITY']}>
        <Feedprofile />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-change-email",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'RECRUITER', 'UNIVERSITY']}>
        <FeedChangeEmail />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-change-password",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'RECRUITER', 'UNIVERSITY']}>
        <FeedChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-your-skills",
    element: (
      <ProtectedRoute>
        <FeedYourSkills />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-your-education",
    element: (
      <ProtectedRoute>
        <FeedYourEducation />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-your-experience",
    element: (
      <ProtectedRoute>
        <FeedYourExprience />
      </ProtectedRoute>
    ),
  },

  {
    path: "feed-dashboard",
    element: (
      <ProtectedRoute>
        <FeedDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "feed-authentication",
    element: (
      <ProtectedRoute>
        <FeedAuthentication />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-faq",
    element: <FeedFaq />,
  },
  {
    path: "/application-mymassage",
    element: <MyMassage />,
  },
  {
    path: "/application-mynotification",
    element: <MyNotification />,
  },
  {
    path: "/feed-dashboard",
    element: <FeedDashBoard />,
  },


  // Recruiter related routes

  {
    path: "/recruiter-profile",
    element: <RecruiterRightProfile />,
  },

  {
    path: "/recruiter-dashboard",
    element: <RecruiterDashboard />,
  },
  {
    path: "/recruiter-total-job-post",
    element: <RecruiterTotalJobPost />,
  },
  {
    path: "/recruiter-application",
    element: <RecruiterApplication />,
  },

  {
    path: "/recruiter-application-details",
    element: <RecruiterApplicationDetails />,
  },
  {
    path: "/recruiter-send-assignment",
    element: <RecruiterSendAssignment />,
  },
  {
    path: "/recruiter-interview",
    element: <RecruiterInterview />,
  },
  {
    path: "/recruiter-approval",
    element: <RecruiterApproval />,
  },
  {
    path: "/recruiter-pipeline",
    element: <RecruitePipeline />,
  },
  {
    path: "/recruiter-upcoming-interview",
    element: <RecruiterUpcommingInterview />,
  },
  {
    path: "/recruiter-pending-task",
    element: <RecruiterPendingTask />,
  },

  {
    path: "/recruiter-visiter",
    element: <RecruiterProfile />,
  },
  {
    path: "/recruiter-terms",
    element: <RecruiterTerms />,
  },
  {
    path: "/recruiter-view",
    element: <RecruiterView />,
  },
  {
    path: "/recruiter-payment",
    element: <RecruiterPayment />,
  },
  {
    path: "/recruiter-pricing",
    element: <RecruiterPricing />,
  },
  {
    path: "/recruiter-payment-method",
    element: <RecruiterPaymentMethod />,
  },
  {
    path: "/recruiter-payment-password",
    element: <RecruiterChangePassword />,
  },
  {
    path: "/recruiter-change-email",
    element: <RecruiterChangeEmail />,
  },

  // University related routes

  {
    path: "/university-fill-details",
    element: <UniversityFillDetails />,
  },
  {
    path: "/university-profile",
    element: <UniversityProfile />,
  },
  {
    path: "/university-change-email",
    element: <UniversityChangeEmail />,
  },
  {
    path: "/university-change-password",
    element: <UniversityChangePassword />,
  },
  {
    path: "/university-faq",
    element: <UniversityFaq />,
  },

  {
    path: "/university-terms",
    element: <UniversityTerms />,
  },
  {
    path: "/university-view",
    element: <UniversityView />,
  },
  {
    path: "/university-ticket",
    element: <UniversityTicket />,
  },
  {
    path: "/university-pricing",
    element: <UniversityPricing />,
  },
  {
    path: "/university-payment",
    element: <UniversityPayment />,
  },
  {
    path: "/university-payment-method",
    element: <UniversityPaymentMethod />,
  },
  {
    path: "/university-approval",
    element: <UniversityApproval />,
  },

  // Ai prediction related routes

  {
    path: "/ai-prediction",
    element: <AiProfile />,
  },
  {
    path: "/ai-prediction1",
    element: <AiProfile1 />,
  },
  {
    path: "/all-jobs-part",
    element: <AllJObsPart />,
  },
]);
