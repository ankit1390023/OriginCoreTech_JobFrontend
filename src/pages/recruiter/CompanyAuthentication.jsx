import React, { useState } from "react";
import { Button, Input, Label } from "../../components/ui";
import MainLayout from "../../components/layout/MainLayout";
import RecruiterRightSide2 from "../recruiter/profile/RecruiterRightSide2";

const CompanyAuthentication = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");


    return (
        <MainLayout>
            <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
                {/* Left Spacer */}
                <div className="hidden lg:block flex-grow "></div>

                <section className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] max-h-[1080px] overflow-y-auto opacity-100 gap-[10px]">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-black mb-6">Authentication</h1>

                    {/* Phone Number Verification Section */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Label
                                htmlFor="phoneNumber"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Phone Number
                            </Label>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <div className="flex-1">
                                <Input
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+91 XXXXXXXXXX"
                                />
                            </div>
                            <Button
                                variant="secondary"
                                size="small"
                                className="bg-orange-500  h-9 hover:bg-orange-600 text-white px-4"
                            >
                                Send OTP
                            </Button>
                        </div>

                        <div className="mb-3">
                            <Label
                                htmlFor="phoneOtp"
                                className="text-sm font-semibold text-gray-700"
                            >
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

                        <Button variant="danger" size="default" className="w-full mb-2">
                            Verify Phone number
                        </Button>

                        <p className="text-xs text-gray-600 text-center">
                            Resend code in 60 seconds
                        </p>
                    </div>

                    

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-black mb-6">GST Authentication</h1>

                    {/* Phone Number Verification Section */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Label
                                htmlFor="gstNumber"
                                className="text-sm font-semibold text-gray-700"
                            >
                                GST Number
                            </Label>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <div className="flex-1">
                                <Input
                                    id="gstNumber"
                                    placeholder="Enter GST Number"
                                />
                            </div>
                            <Button
                                variant="secondary"
                                size="small"
                                className="bg-orange-500  h-9 hover:bg-orange-600 text-white px-4"
                            >
                                Verify
                            </Button>
                        </div>
                    </div>
                                       
                </section>

                {/* Profile Card */}
                <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit ml-4">
                    <RecruiterRightSide2 />
                </aside>

                {/* Right Spacer */}
                <div className="hidden lg:block flex-grow "></div>
            </div>
        </MainLayout>
    );
};

export default CompanyAuthentication;
