import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import SendOtpEmail from "./components/auth/SendOtpEmail";
import VerifyOtpEmail from "./components/auth/VerifyOtpEmail";
import Home from "./components/Home";
import SignUpChooseRole from "./components/auth/SignUpChooseRole";
import SignUp from "./components/auth/SignUP";
import SignUpSendOtpEmail from "./components/auth/SignUpSendOtpEmail";
import RecruiterPostJobInternDetails from "./components/recuiterPostJobInternDetails/RecuiterPostJobInternDetails";
import StudentFillAccountDetails from "./components/studentFillAccountDetails/StudentFillAccountDetails.jsx"
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
    element:<StudentFillAccountDetails/>
  },
  {
    path: "/recruiter-post-job-intern-details",
    element: <RecruiterPostJobInternDetails />,
  },
]);
const App = () => {
  return <RouterProvider router={appRouter} />;
};
export default App;
