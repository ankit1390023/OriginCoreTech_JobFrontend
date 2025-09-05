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
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Wrapper Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Don't redirect if it's the OTP verification page
  if (location.pathname === '/signup-verify-otp-email') {
    return children;
  }

  // For all other public routes, redirect based on user role if authenticated
  if (isAuthenticated) {
    switch (user?.user_role) {
      case 'STUDENT':
        return <Navigate to="/student-fill-account-details" replace />;
      case 'COMPANY':
        return <Navigate to="/recruiter-profile" replace />;
      case 'UNIVERSITY':
        return <Navigate to="/university-profile" replace />;
      default:
        return <Navigate to="/" replace />;
    }
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
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterPostJobInternDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/all-jobs",
    element: <AllJObs />
  },
  {
    path: "/jobs/:job_id",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <JobDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'UNIVERSITY']}>
        <FeedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-my-profile",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedMyProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-view",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
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
      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'UNIVERSITY']}>
        <FeedTerms />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-resume",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedResume />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-ticket",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'UNIVERSITY']}>
        <FeedTicket />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-profile",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'UNIVERSITY']}>
        <Feedprofile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-change-email",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'UNIVERSITY']}>
        <FeedChangeEmail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-change-password",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'UNIVERSITY']}>
        <FeedChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-your-skills",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedYourSkills />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-your-education",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedYourEducation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-your-experience",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedYourExprience />
      </ProtectedRoute>
    ),
  },

  {
    path: "/feed-dashboard",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-authentication",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedAuthentication />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-faq",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedFaq />
      </ProtectedRoute>
    ),
  },
  {
    path: "/application-mymassage",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <MyMassage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/application-mynotification",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <MyNotification />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-dashboard",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <FeedDashBoard />
      </ProtectedRoute>
    ),
  },


  // Recruiter related routes

  {
    path: "/recruiter-profile",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <CompanyRecruiterProfile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/recruiter-dashboard",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-total-job-post",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterTotalJobPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-application",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterApplication />
      </ProtectedRoute>
    ),
  },

  {
    path: "/recruiter-application-details",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterApplicationDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-send-assignment",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterSendAssignment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-interview",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterApproval />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-pipeline",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruitePipeline />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-upcoming-interview",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterUpcommingInterview />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-pending-task",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterPendingTask />
      </ProtectedRoute>
    ),
  },

  {
    path: "/recruiter-visiter",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-terms",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterTerms />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-payment",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterPayment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-pricing",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterPricing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-payment-method",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterPaymentMethod />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-payment-password",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-change-email",
    element: (
      <ProtectedRoute allowedRoles={['COMPANY']}>
        <RecruiterChangeEmail />
      </ProtectedRoute>
    ),
  },

  // University related routes

  {
    path: "/university-fill-details",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityFillDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-profile",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-change-email",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityChangeEmail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-faq",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityFaq />
      </ProtectedRoute>
    ),
  },

  {
    path: "/university-terms",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityTerms />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-view",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-ticket",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityTicket />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-pricing",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityPricing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-payment",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityPayment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-payment-method",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityPaymentMethod />
      </ProtectedRoute>
    ),
  },
  {
    path: "/university-approval",
    element: (
      <ProtectedRoute allowedRoles={['UNIVERSITY']}>
        <UniversityApproval />
      </ProtectedRoute>
    ),
  },

  // Ai prediction related routes

  {
    path: "/ai-prediction",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <AiProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ai-prediction1",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <AiProfile1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/all-jobs-part",
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        <AllJObsPart />
      </ProtectedRoute>
    ),
  },
]);