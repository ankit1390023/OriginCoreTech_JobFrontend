import React from "react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightSide2 from "./RecruiterRightSide2";

const PremiumJobs = () => {
  const plans = [
    {
      id: 1,
      title: "1 Job listing",
      price: "INR 999",
      oldPrice: "INR 12,999",
      discount: "Save 15%",
    },
    {
      id: 2,
      title: "2 Job listings",
      price: "INR 1,499",
      oldPrice: "INR 1,999",
      discount: "Save 25%",
    },
  ];

  return (
      <MainLayout>
        <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
            {/* Left Spacer */}
            <div className="hidden lg:block flex-grow"></div>

    <div
      className="bg-white shadow-md"
      style={{
        width: "729px",
        height: "500px",
        borderRadius: "10px",
        padding: "20px",
        marginTop: "40px",
      }}
    >
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Post <span className="text-red-500">premium</span> internships and jobs
      </h2>

      {/* Plans */}
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex justify-between items-center border rounded-lg p-5 shadow-sm"
          >
            {/* Left content */}
            <div>
              <p className="text-gray-600 text-sm">{plan.title}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold">{plan.price}</p>
                <p className="text-gray-400 line-through text-sm">
                  {plan.oldPrice}
                </p>
              </div>
              <button className="mt-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-md transition">
                Buy Now
              </button>
            </div>

            {/* Discount badge */}
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
              {plan.discount}
            </span>
          </div>
        ))}
      </div>
    </div>
      {/* Profile Card */}
      <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                        <RecruiterRightSide2 />
                    </aside>
                    {/* Right Spacer */}
                    <div className="hidden lg:block flex-grow "></div>
                </div>
            </MainLayout>
  );
};

export default PremiumJobs;
