import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const DetailsForm = () => {
  const [company, setCompany] = useState("PFL Finance");
  const [active, setActive] = useState(true);
  const [useEmail, setUseEmail] = useState(false);
  const [useSms, setUseSms] = useState(true);
  const [activeTab, setActiveTab] = useState("PERMISSION");

  // const tabs = [
  //   "BASIC INFO",
  //   "PERMISSION",
  //   "IL LOAN CONFIG",
  //   "ACCOUNT CONFIG",
  //   "SCV QUESTIONNAIRE",
  //   "PASSWORD POLICY",
  //   "DOCUMENT MANAGEMENT",
  // ];

  return (
    <div className="max-w-[1096px] w-full mx-auto bg-gray-50 min-h-screen p-4 sm:p-6" style={{ opacity: 1 }}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 flex flex-wrap">
        <span className="hover:underline cursor-pointer text-blue-600">Home</span>
        <span className="mx-1">\</span>
        <span className="hover:underline cursor-pointer text-blue-600">Legal Entity</span>
        <span className="mx-1">\</span>
        <span className="text-gray-700">Edit Legal Entity</span>
      </div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Edit Legal Entity
      </h1>

      {/* Details Card */}
      <div className="bg-white shadow rounded border">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="font-semibold text-gray-700">Details</h2>
          <button className="text-gray-500">
            <RiArrowDropDownLine size={24} />
          </button>
        </div>

        {/* Form Row */}
        <div className="flex flex-col md:flex-row md:items-center px-4 py-3 md:space-x-6 space-y-4 md:space-y-0">
          {/* Company Dropdown */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-xs text-gray-600 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full md:w-auto"
            >
              <option value="PFL Finance">PFL Finance</option>
              <option value="XYZ Finance">XYZ Finance</option>
              <option value="ABC Corp">ABC Corp</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Active</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useEmail}
                onChange={(e) => setUseEmail(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Use Email</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useSms}
                onChange={(e) => setUseSms(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Use SMS</span>
            </label>
          </div>
        </div>

        {/* Tabs
        <div className="border-t bg-white overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DetailsForm;
