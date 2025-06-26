import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import SendOtpEmail from "./components/auth/SendOtpEmail";
import VerifyOtpEmail from "./components/auth/VerifyOtpEmail";
import Home from "./components/Home";
import SignUpChooseRole from "./components/auth/SignUpChooseRole";
import SignUp from "./components/auth/SignUP";
import SignUpSendOtpEmail from "./components/auth/SignUpSendOtpEmail";
import StudentFillAccountDetails from "./components/studentFillAccountDetails/studentFillAccountDetails";
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
    element: <StudentFillAccountDetails />,
  },
]);
const App = () => {
  return <RouterProvider router={appRouter} />;
};
export default App;
