import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import FeedRightSidebar from "../feed/FeedRightSidebar";
import { userProfileApi } from "../../../api/userProfileApi";
import { updateUser } from "../../../redux/feature/authSlice";


const FeedchangeEmail = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        user_id: user?.id || user?.user_id,
        newEmail: email,
        password,
      };

      await userProfileApi.changeEmail(data, token);

      dispatch(updateUser({ email }));

      setSuccess(true);
      setEmail(""); 
      setPassword("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between min-h-screen gap-2 px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block "></div>

        <section className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-[500px] opacity-100 gap-[10px]">
          <h2 className="mb-1 text-2xl font-bold sm:text-3xl">Change email</h2>
          <p className="mb-4 text-xs text-gray-500 sm:text-sm">
            Please note that all the data associated with your account will be
            linked to your new email address after this change.
          </p>

          <form className="flex flex-col flex-1 gap-4"
           onSubmit={handleSubmit}>
            <Input
              label="New Email ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute text-gray-400 bg-white right-3 bottom-2"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>

            {error && <div className="text-xs text-red-500">{error}</div>}
            {success && (
              <div className="text-xs text-green-600">
                Email changed successfully!
              </div>
            )}

            <div className="flex justify-center mt-2">
              <Button
                type="submit"
                className="w-full sm:w-[180px] h-[44px] sm:h-[48px] text-base rounded-full bg-[#F44336] hover:bg-[#d32f2f]"
                loading={loading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </section>

        {/* Profile Card (only on large screens) */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightSidebar />
        </aside>

        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default FeedchangeEmail;
