import React from "react";
import { useNavigate } from "react-router-dom";
import dummyProfile1 from "../../../assets/dummyProfile1.jpg";
import dummyProfile2 from "../../../assets/dummyProfile2.jpg";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";

const RecruiterRightProfile = () => {
    const navigate = useNavigate();

    const profileVisitors = [
        { name: "Olivia Rhye", img: dummyProfile1 },
        { name: "Phoenix Baker", img: dummyProfile2 },
        { name: "Lana Steiner", img: dummyProfile3 },
        { name: "Milo Thorne", img: dummyProfile1 },
        { name: "Olivia Rhye", img: dummyProfile1 },
        { name: "Lana Steiner", img: dummyProfile3 },
        { name: "Milo Thorne", img: dummyProfile1 },
        { name: "Phoenix Baker", img: dummyProfile2 },
    ];

    const stats = [
        { value: "367", label: "Views today" },
        { value: "15", label: "Post views" },
        { value: "09", label: "Search appearance" },
    ];

    return (
        <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
            <div className="hidden lg:block flex-grow"></div>

            <div
                className="w-[375px] h-[553px] bg-white rounded-[10px] shadow-md 
                   p-[20px] px-[10px] flex flex-col gap-[30px] mt-[99px]"
            >
                {/* Post a Job Button */}
                <button
                    onClick={() => navigate("/recruiter-post-job-intern-details")}
                    className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg text-lg font-medium"
                >
                    Post a Job
                </button>

                {/* Profile Visitors */}
                <div>
                    <h2 className="font-semibold text-lg">Profile Visitors</h2>
                    <div className="grid grid-cols-4 gap-3 mt-3">
                        {profileVisitors.map((visitor, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <img
                                    src={visitor.img}
                                    alt={visitor.name}
                                    className="w-14 h-14 rounded-md object-cover"
                                />
                                <p className="text-xs text-gray-700 mt-1 text-center">
                                    {visitor.name}
                                </p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate("/recruiter-see-more-visitors")}
                        className="text-blue-500 text-sm mt-2 hover:underline block text-center"
                    >
                        See more
                    </button>
                </div>

                {/* Divider */}
                <hr />

                {/* Dashboard Stats */}
                <div>
                    <h2 className="font-semibold text-lg">Your Dashboard</h2>
                    <div className="grid grid-cols-3 text-center mt-3">
                        {stats.map((stat, idx) => (
                            <div key={idx}>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate("/recruiter-see-more-dashboard-stats")}
                        className="text-blue-500 text-sm mt-2 hover:underline block text-center"
                    >
                        See more
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruiterRightProfile;
