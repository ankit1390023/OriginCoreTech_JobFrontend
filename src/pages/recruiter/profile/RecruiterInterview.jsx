import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterApplicationData from "./RecruiterApplicationData";

const ScheduleInterview = () => {
  const [formData, setFormData] = useState({
    interview_type: "Video call",
    date: "",
    startTime: "",
    endTime: "",
    video_link: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInterviewType = (type) => {
    setFormData({
      ...formData,
      interview_type: type,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Scheduled Interview:", formData);
    alert("Interview Scheduled Successfully!");
  };

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
        <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
          <RecruiterApplicationData />
        </aside>

        <div className="w-[729px] h-[749px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-10 flex flex-col gap-5">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800">
            Schedule Interview
          </h2>

          {/* To */}
          <div>
            <p className="text-sm text-gray-600">To:</p>
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-md mt-1">
              Nidhi Sharma
            </span>
          </div>

          {/* Email Body */}
          <textarea
            className="w-full border rounded-lg p-3 text-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            defaultValue={`Hi Nidhi,

Can you please confirm your availability for the mentioned date and time? Let me know in case of reschedule.

I am available at +91-9996222046 for any further clarification.

Thanks,
Rishabh`}
          />

          {/* Interview Type */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Interview type</p>
            <div className="flex gap-4">
              {["Video call", "Phone", "In-office"].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${
                    formData.interview_type === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="interview_type"
                    checked={formData.interview_type === type}
                    onChange={() => handleInterviewType(type)}
                    className="hidden"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interview Date */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Interview date</p>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Interview Time */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Interview time</p>
            <div className="flex gap-3">
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Video Link */}
          {formData.interview_type === "Video call" && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Share video call link
              </p>
              <input
                type="url"
                name="video_link"
                value={formData.video_link}
                onChange={handleChange}
                placeholder="e.g. https://meet.google.com/uvw-ulva-uv"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-200"
          >
            Schedule Interview
          </button>
        </div>

        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow "></div>
      </div>
    </MainLayout>
  );
};

export default ScheduleInterview;
