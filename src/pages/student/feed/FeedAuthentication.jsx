import React, { useState } from 'react';
import { Button, Input, Label } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightSide1 from '../feed/FeedRightSide1';


const FeedAuthentication = () => {
  const [phoneNumber, setPhoneNumber] = useState('+91 XXXXXXXXXX');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [linkedPhoneNumber, setLinkedPhoneNumber] = useState('+91 XXXXXXXXXX');
  const [aadharOtp, setAadharOtp] = useState('');
  const [email, setEmail] = useState('Amangupta@gmail.com');
  const [phoneResendTime, setPhoneResendTime] = useState(15);
  const [aadharResendTime, setAadharResendTime] = useState(15);

  const handleSendPhoneOtp = () => {
    // Handle phone OTP sending logic
    console.log('Sending phone OTP...');
  };

  const handleVerifyPhone = () => {
    // Handle phone verification logic
    console.log('Verifying phone number...');
  };

  const handleSendAadharOtp = () => {
    // Handle Aadhar OTP sending logic
    console.log('Sending Aadhar OTP...');
  };

  const handleVerifyAadhar = () => {
    // Handle Aadhar verification logic
    console.log('Verifying Aadhar card...');
  };

  const handleSaveChanges = () => {
    // Handle save changes logic
    console.log('Saving changes...');
  };

  const handleEditEmail = () => {
    // Handle email editing logic
    console.log('Editing email...');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <MainLayout>
    <div className="flex justify-center  bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
    {/* Left Spacer */}
    <div className="hidden lg:block flex-grow "></div>
    <section
     className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-[1100px] opacity-100 gap-[10px]"
    >
      {/* Title */}
      <h1 className="text-2xl font-bold text-black mb-6">Authentication</h1>

      {/* Phone Number Verification Section */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
            Phone Number
          </Label>
        </div>
        <div className="flex gap-2 mb-3">
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
            placeholder="+91 XXXXXXXXXX"
          />
          <Button
            variant="secondary"
            size="default"
            onClick={handleSendPhoneOtp}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4"
          >
            Send OTP
          </Button>
        </div>
        
        <div className="mb-3">
          <Label htmlFor="phoneOtp" className="text-sm font-semibold text-gray-700">
            OTP
          </Label>
          <Input
            id="phoneOtp"
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
            placeholder="6 Digit Number"
            maxLength={6}
          />
        </div>
        
        <Button
          variant="danger"
          size="default"
          onClick={handleVerifyPhone}
          className="w-full mb-2"
        >
          Verify Phone number
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Resend code in {phoneResendTime} seconds
        </p>
      </div>

      {/* Aadhar Card Verification Section */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="mb-3">
          <Label htmlFor="aadharNumber" className="text-sm font-semibold text-gray-700">
            Aadhar Card
          </Label>
          <Input
            id="aadharNumber"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            placeholder="Aadhar Card Number"
            maxLength={12}
          />
        </div>
        
        <div className="mb-3">
          <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder="YYYY/MM/DD"
          />
        </div>
        
        <div className="mb-3">
          <Label htmlFor="fileUpload" className="text-sm font-semibold text-gray-700">
            Upload file
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
            <input
              id="fileUpload"
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">Browse file</span>
              </div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Label htmlFor="linkedPhoneNumber" className="text-sm font-semibold text-gray-700">
            Linked Phone Number
          </Label>
        </div>
        <div className="flex gap-2 mb-3">
          <Input
            id="linkedPhoneNumber"
            value={linkedPhoneNumber}
            onChange={(e) => setLinkedPhoneNumber(e.target.value)}
            className="flex-1"
            placeholder="+91 XXXXXXXXXX"
          />
          <Button
            variant="secondary"
            size="default"
            onClick={handleSendAadharOtp}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4"
          >
            Send OTP
          </Button>
        </div>
        
        <div className="mb-3">
          <Label htmlFor="aadharOtp" className="text-sm font-semibold text-gray-700">
            OTP
          </Label>
          <Input
            id="aadharOtp"
            value={aadharOtp}
            onChange={(e) => setAadharOtp(e.target.value)}
            placeholder="6 Digit Number"
            maxLength={6}
          />
        </div>
        
        <Button
          variant="danger"
          size="default"
          onClick={handleVerifyAadhar}
          className="w-full mb-2"
        >
          Verify Aadhar Card
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Resend code in {aadharResendTime} seconds
        </p>
      </div>

      {/* Email ID Display Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <Label className="text-sm font-semibold text-gray-700">
          Email ID
        </Label>
        <p className="text-sm text-gray-800 mt-1 mb-2">{email}</p>
        <button
          onClick={handleEditEmail}
          className="text-blue-600 text-sm hover:text-blue-800 underline"
        >
          Edit/Change
        </button>
      </div>

      {/* Save Changes Button */}
      <div className="text-center">
        <Button
          variant="danger"
          size="large"
          onClick={handleSaveChanges}
          className="w-full max-w-xs"
        >
          Save Changes
        </Button>
      </div>
    </section>
        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit ml-4">
                    <FeedRightSide1 />
                </aside>
                {/* Right Spacer */}
                <div className="hidden lg:block flex-grow "></div>
                </div>
    </MainLayout>
  );
};

export default FeedAuthentication;
