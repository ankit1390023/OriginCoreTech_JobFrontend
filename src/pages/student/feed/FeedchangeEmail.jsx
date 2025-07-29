import React, { useState } from 'react';
import { Input, Button } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import FeedRightProfile from './FeedRightProfile';
import {userProfileApi} from '../../../api/userProfileApi';

const FeedchangeEmail = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = { email, password };
      await userProfileApi.changeEmail(data);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to change email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-gray-100 px-2 sm:px-4 md:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>
        <section
          className="w-full max-w-[95vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[729px] h-auto rounded-[10px] p-4 sm:p-6 md:p-8 bg-white flex flex-col gap-2 shadow-md mx-auto mt-4 lg:mt-8 border border-blue-200"
          style={{ top: '99px', left: '159px', opacity: 1 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Change email</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-4">
            Please note that all the data associated with your account will be linked to your new email address after this change.
          </p>
          <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
            <Input
              label="New Email ID"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter new email"
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
            {success && <div className="text-green-600 text-xs">Email changed successfully!</div>}
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
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit lg:mt-8">
          <FeedRightProfile />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FeedchangeEmail;
