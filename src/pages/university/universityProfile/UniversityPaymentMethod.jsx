import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import UniversityRightSide1 from "./UniversityRightSide1";

const PaymentSelection = () => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const paymentMethods = [
    { id: "card", label: "Debit / Credit Card", icon: "💳" },
    { id: "upi", label: "UPI", icon: "📱" },
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
        height: "243px",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
      <p className="text-sm text-gray-500 mb-5">Select Payment Method</p>

      <div className="flex flex-col gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`flex items-center justify-between w-full border rounded-lg px-4 py-3 text-left transition 
              ${selectedMethod === method.id ? "border-red-500 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-600">{method.icon}</span>
              {method.label}
            </span>
            <span className="text-gray-500">▼</span>
          </button>
        ))}
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

export default PaymentSelection;
