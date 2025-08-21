import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import UniversityRightSide1 from "./UniversityRightSide1";
    
const GSTAuth = () => {
  const [gstNumber, setGstNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gstNumber) {
      alert("Please enter your GST Number");
      return;
    }
    // You can add API call here for GST validation
    alert(`GST Number submitted: ${gstNumber}`);
  };

  return (
<MainLayout>
        <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
            {/* Left Spacer */}
            <div className="hidden lg:block flex-grow"></div>


    <div
      className="bg-white shadow-md"
      style={{
        width: "729px",
        height: "243px",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        GST Authentication
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST Number
          </label>
          <input
            type="text"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            placeholder="Enter GST Number"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          Submit
        </button>
      </form>
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

export default GSTAuth;
