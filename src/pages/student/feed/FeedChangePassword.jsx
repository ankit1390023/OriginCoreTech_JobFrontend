import React, { useState } from 'react';
import { Input, Button } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import FeedRightProfile from '../feed/FeedRightProfile';
import { userProfileApi } from '../../../api/userProfileApi';

const FeedChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!oldPassword.trim() || !newPassword.trim() || !retypePassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== retypePassword) {
      setError('New password and retype password do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = { 
        oldPassword, 
        newPassword, 
        retypePassword 
      };
      await userProfileApi.changePassword(data);
      setSuccess(true);
      // Clear form after successful password change
      setOldPassword('');
      setNewPassword('');
      setRetypePassword('');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
     <div className="flex justify-between gap-2 bg-gray-100 min-h-screen px-2 lg:px-8"> {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>
        <section
     className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-[500px] opacity-100 gap-[10px]"
    >
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Change password</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-4">
            Please enter your current password and choose a new password to update your account security.
          </p>
          <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
            {/* Old Password Input */}
            <div className="relative">
              <Input
                label="Old password"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 bg-white  bottom-2.5 text-gray-400 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowOldPassword((prev) => !prev)}
              >
                {showOldPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>

            {/* New Password Input */}
            <div className="relative">
              <Input
                label="Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 bg-white bottom-2.5 text-gray-400 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>

            {/* Retype Password Input */}
            <div className="relative">
              <Input
                label="Retype Password"
                type={showRetypePassword ? 'text' : 'password'}
                value={retypePassword}
                onChange={e => setRetypePassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 bg-white bottom-2.5 text-gray-400 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowRetypePassword((prev) => !prev)}
              >
                {showRetypePassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>

            {error && <div className="text-red-500 text-xs">{error}</div>}
            {success && <div className="text-green-600 text-xs">Password changed successfully!</div>}
            
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
          <FeedRightProfile />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FeedChangePassword;
