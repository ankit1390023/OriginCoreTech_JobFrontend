import React, { useState } from "react";
import { Button, Input, Label } from "../../components/ui";
import MainLayout from "../../components/layout/MainLayout";
import RecruiterRightSidebarWithJobPost from "../recruiter/profile/RecruiterRightSidebarWithJobPost";

const CompanyAuthentication = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");


    return (
        <MainLayout>
            <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
                {/* Left Spacer */}
                <div className="flex-grow hidden lg:block "></div>

                <section className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] max-h-[1080px] overflow-y-auto opacity-100 gap-[10px]">
                    {/* Title */}
                    <h1 className="mb-6 text-2xl font-bold text-black">Authentication</h1>

                    {/* Phone Number Verification Section */}
                    <div className="p-4 mb-4 border border-orange-200 rounded-lg bg-orange-50">
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
                                className="px-4 text-white bg-orange-500 h-9 hover:bg-orange-600"
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

                        <p className="text-xs text-center text-gray-600">
                            Resend code in 60 seconds
                        </p>
                    </div>

                    

                    {/* Title */}
                    <h1 className="mb-6 text-2xl font-bold text-black">GST Authentication</h1>

                    {/* Phone Number Verification Section */}
                    <div className="p-4 mb-4 border border-orange-200 rounded-lg bg-orange-50">
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
                                className="px-4 text-white bg-orange-500 h-9 hover:bg-orange-600"
                            >
                                Verify
                            </Button>
                        </div>
                    </div>
                                       
                </section>

                {/* Profile Card */}
                <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit ml-4">
                    <RecruiterRightSidebarWithJobPost />
                </aside>

                {/* Right Spacer */}
                <div className="flex-grow hidden lg:block "></div>
            </div>
        </MainLayout>
    );
};

export default CompanyAuthentication;
