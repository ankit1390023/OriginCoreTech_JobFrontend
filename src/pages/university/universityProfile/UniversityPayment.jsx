import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import UniversityRightSide1 from "./UniversityRightSide1";  

const PaymentPage = () => {
  const [method, setMethod] = useState("card");

  return (
<MainLayout>
        <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
            {/* Left Spacer */}
            <div className="hidden lg:block flex-grow"></div>


    <div
      className="bg-white shadow-md"
      style={{
        width: "729px",
        height: "545px",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
      <p className="text-sm text-gray-500 mb-4">Select Payment Method</p>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        {/* Debit / Credit Card */}
        <div className="border rounded-lg p-4 cursor-pointer">
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => setMethod("card")}
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-600">💳</span>
              Debit / Credit Card
            </span>
            <span>{method === "card" ? "▲" : "▼"}</span>
          </button>

          {method === "card" && (
            <form className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    placeholder="000"
                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    placeholder="mm/yyyy"
                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
              >
                Submit
              </button>
            </form>
          )}
        </div>

        {/* UPI Option */}
        <div className="border rounded-lg p-4 cursor-pointer">
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => setMethod("upi")}
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-600">📱</span>
              UPI
            </span>
            <span>{method === "upi" ? "▲" : "▼"}</span>
          </button>

          {method === "upi" && (
            <form className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="example@upi"
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
              >
                Pay Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
      {/* Profile Card */}
      <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                        <UniversityRightSide1 />
                    </aside>
                    {/* Right Spacer */}
                    <div className="hidden lg:block flex-grow "></div>
                </div>
            </MainLayout>
  );
};

export default PaymentPage;
