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
import FeedRightSide1 from "../pages/student/feed/FeedRightSide1";
import FeedRightSide2 from "../pages/student/feed/FeedRightSide2";
import Myapplication1 from "../pages/student/application/Myapplication1";
import Myapplication3 from "../pages/student/application/Myapplication3";
import MyMassage from "../pages/student/application/MyMassage";
import MyNotification from "../pages/student/application/MyNotification"; 
import Myapplication6 from "../pages/student/application/Myapplication6";
import Myapplication5 from "../pages/student/application/Myapplication5";
import Myapplication4 from "../pages/student/application/Myapplication4";
import Myapplication2 from "../pages/student/application/Myapplication2";
import RecruiterDashboard from "../pages/recruiter/dashboard/RecruiterDashboard";
import RecruiterRightProfile from "../pages/recruiter/dashboard/RecruiterRightProfile";
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
import RecruiterRightSide1 from "../pages/recruiter/profile/RecruiterRightSide1";
import RecruiterRightSide2 from "../pages/recruiter/profile/RecruiterRightSide2";
import RecruiterRightSide3 from "../pages/recruiter/profile/RecruiterRightSide3";
import RecruiterTerms from "../pages/recruiter/profile/RecruiterTerms";
import RecruiterView from "../pages/recruiter/profile/RecruiterView";
import UniversityRightSide1 from "../pages/university/universityProfile/UniversityRightSide1";
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
import AllCoursesPart from "../pages/aiprediction/CoursePart";
import FeedRightSide3 from "../pages/student/feed/FeedRightSide3";
import Sidebar from "../components/shared/Sidebar";
import Header1 from "../components/shared/Header1";
import Footer1 from "../components/shared/Footer1";
import FinanceLayout from "../components/layout/FinanceLayout";










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

// Recruiter related routes

{
    path: "/recruiter-profile",
    element: <CompanyRecruiterProfile />
},

{
    path: "/recruiter-dashboard",
    element: <RecruiterDashboard />
},
{
    path: "/recruiter-right-profile",
    element: <RecruiterRightProfile />
},
{
    path: "/recruiter-total-job-post",
    element: <RecruiterTotalJobPost /> 
},
{
    path: "/recruiter-application",
    element: <RecruiterApplication />
},

{
    path: "/recruiter-application-details",
    element: <RecruiterApplicationDetails />
},

{
    path: "/recruiter-application-data",
    element: <RecruiterApplicationData />
},
{
    path: "/recruiter-send-assignment",
    element: <RecruiterSendAssignment />
},
{
    path: "/recruiter-interview",
    element: <RecruiterInterview />
},
{
    path: "/recruiter-approval",
    element: <RecruiterApproval />
},
{
    path: "/recruiter-pipeline",
    element: <RecruitePipeline />
},
{
    path: "/recruiter-upcoming-interview",
    element: <RecruiterUpcommingInterview />
},
{
    path: "/recruiter-pending-task",
    element: <RecruiterPendingTask />
},

    {
        path: "/recruiter-visiter",
        element: <RecruiterProfile />
    },
    {
        path: "/recruiter-right-side1",
        element: <RecruiterRightSide1 />
    },
    {
        path: "/recruiter-right-side2",
        element: <RecruiterRightSide2 />
    },
    {
        path: "/recruiter-right-side3",
        element: <RecruiterRightSide3 />
    },
    {
        path: "/recruiter-terms",
        element: <RecruiterTerms />
    },
    {
        path: "/recruiter-view",
        element: <RecruiterView />
    },
    {
        path: "/recruiter-payment",
        element: <RecruiterPayment />
    },
    {
        path: "/recruiter-pricing",
        element: <RecruiterPricing />
    },
    {
        path: "/recruiter-payment-method",
        element: <RecruiterPaymentMethod />
    },
    {
        path: "/recruiter-payment-password",
        element: <RecruiterChangePassword />
    },
    {
        path: "/recruiter-change-email",
        element: <RecruiterChangeEmail />
    },
   

// University related routes



    {
        path: "/university-fill-details",
        element: <UniversityFillDetails />
    },
    {
        path: "/university-profile",
        element: <UniversityProfile />
    },
    {
        path: "/university-right-side1",
        element: <UniversityRightSide1 />
    },
    {
        path: "/university-change-email",
        element: <UniversityChangeEmail />
    },
    {
        path: "/university-change-password",
        element: <UniversityChangePassword />
    },
    {
        path: "/university-faq",
        element: <UniversityFaq />
    },
    
    {
        path: "/university-terms",
        element: <UniversityTerms />
    },
    {
        path: "/university-view",
        element: <UniversityView />
    },
    {
        path: "/university-ticket",
        element: <UniversityTicket />
    },
    {
        path: "/university-pricing",
        element: <UniversityPricing />
    },
    {
        path: "/university-payment",
        element: <UniversityPayment />
    },
    {
        path: "/university-payment-method",
        element: <UniversityPaymentMethod />
    },
    {
        path: "/university-approval",
        element: <UniversityApproval />
    },




    // Feed related routes
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
        element: <FeedDashBoard />
    },
    {
        path: "/feed-authentication",
        element: <FeedAuthentication />
    },
    {
        path: "/feed-faq",
        element: <FeedFaq />
    },

    {
        path: "/application-myapplication1",
        element: <Myapplication1 />
    },

    {
        path: "/application-myapplication2",
        element: <Myapplication2 />
    },

    {
        path: "/application-myapplication3",
        element: <Myapplication3 />
    },
    {
        path: "/application-mymassage",
        element: <MyMassage />
    },
    {
        path: "/application-mynotification",
        element: <MyNotification />
    },
    {
        path: "/application-myapplication6",
        element: <Myapplication6 />
    },
    {
        path: "/application-myapplication5",
        element: <Myapplication5 />
    },
    {
        path: "/application-myapplication4",
        element: <Myapplication4 />
    },

    {
        path: "/feed-dashboard",
        element: <FeedDashBoard />
    },
    {
        path: "/feed-right-side1",
        element: <FeedRightSide1 />
    },
    {
        path: "/feed-right-side2",
        element: <FeedRightSide2 />
    },
    {
        path: "/feed-right-side3",
        element: <FeedRightSide3 />
    },
   

// Ai prediction related routes

    {
        path: "/ai-prediction",
        element: <AiProfile />
    },
    {
        path: "/ai-prediction1",
        element: <AiProfile1 />
    },
    {
        path: "/all-jobs-part",
        element: <AllJObsPart />
    },
    {
        path: "/all-courses-part",
        element: <AllCoursesPart />
    },
    {
        path: "/sidebar",
        element: <Sidebar />
    },
    {
        path: "/header1",
        element: <Header1 />
    },
    {
        path: "/footer1",
        element: <Footer1 />
    },
    
    {
        path: "/finance-layout",
        element: <FinanceLayout />
    },

])
