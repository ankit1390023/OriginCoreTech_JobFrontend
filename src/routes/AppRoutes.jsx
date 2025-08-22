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
import Feedprofile from "../pages/student/feed/Feedprofile";
import FeedChangeEmail from "../pages/student/feed/FeedchangeEmail";
import FeedChangePassword from "../pages/student/feed/FeedChangePassword";
import FeedYourSkills from "../pages/student/feed/FeedYourSkills";
import FeedYourEducation from "../pages/student/feed/FeedYourEducation";
import FeedYourExprience from "../pages/student/feed/FeedYourExprience";
import FeedDashBoard from "../pages/student/feed/FeedDashBoard";
import FeedAuthentication from "../pages/student/feed/FeedAuthentication";
import FeedFaq from "../pages/student/feed/FeedFaq";
import Myapplication1 from "../pages/student/application/Myapplication1";
import Myapplication3 from "../pages/student/application/Myapplication3";
import Myapplication5 from "../pages/student/application/Myapplication5";
import Myapplication6 from "../pages/student/application/Myapplication6";
import Myapplication9 from "../pages/student/application/Myapplication9";
import Myapplication8 from "../pages/student/application/Myapplication8";
import Myapplication7 from "../pages/student/application/Myapplication7";
import Myapplication2 from "../pages/student/application/Myapplication2";
import RecruiterDashboard from "../pages/recruiter/profile/RecruiterDashboard";
import RecruiterRightProfile from "../pages/recruiter/profile/RecruiterRightProfile";
import RecruiterTotalJobPost from "../pages/recruiter/profile/RecruiterTotalJobPost";
import RecruiterApplication from "../pages/recruiter/profile/RecruiterApplication";
import RecruiterApplicationDetails from "../pages/recruiter/profile/RecruiterApplicationDetails";
import RecruiterApplicationData from "../pages/recruiter/profile/RecruiterApplicationData";
import RecruiterSendAssignment from "../pages/recruiter/profile/RecruiterSendAssignment";
import RecruiterInterview from "../pages/recruiter/profile/RecruiterInterview";
import RecruiterApproval from "../pages/recruiter/profile/RecruiterApproval";
import RecruitePipeline from "../pages/recruiter/profile/RecruiterPipeline";
import RecruiterUpcommingInterview from "../pages/recruiter/profile/RecruiterUpcommingInterview";
import RecruiterPendingTask from "../pages/recruiter/profile/RecruiterPendingTask";

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
    element: <StudentFillAccountDetails />,
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
    path: "/jobs/:job_id",
    element: <JobDetailsPage />,
  },
  {
    path: "/recruiter-profile",
    element: <CompanyRecruiterProfile />,
  },
  {
    path: "/university-fill-details",
    element: <UniversityFillDetails />,
  },
  {
    path: "/feed",
    element: <FeedPage />,
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

  {
    path: "feed-dashboard",
    element: <FeedDashBoard />,
  },
  {
    path: "/feed-authentication",
    element: <FeedAuthentication />,
  },
  {
    path: "/feed-faq",
    element: <FeedFaq />,
  },

  {
    path: "/application-myapplication1",
    element: <Myapplication1 />,
  },

  {
    path: "/application-myapplication2",
    element: <Myapplication2 />,
  },

  {
    path: "/application-myapplication3",
    element: <Myapplication3 />,
  },

  {
    path: "/application-myapplication5",
    element: <Myapplication5 />,
  },
  {
    path: "/application-myapplication6",
    element: <Myapplication6 />,
  },
  {
    path: "/application-myapplication9",
    element: <Myapplication9 />,
  },
  {
    path: "/application-myapplication8",
    element: <Myapplication8 />,
  },
  {
    path: "/application-myapplication7",
    element: <Myapplication7 />,
  },

  {
    path: "/recruiter-dashboard",
    element: <RecruiterDashboard />,
  },
  {
    path: "/recruiter-dashboard-profile",
    element: <RecruiterRightProfile />,
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
    path: "/recruiter-application-data",
    element: <RecruiterApplicationData />,
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
    path: "/recruiter-pipeline-candidates",
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
]);
