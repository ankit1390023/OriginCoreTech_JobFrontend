import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterApplicationData from "./RecruiterApplicationData";
import useUploadImageApi from "../../../hooks/useUploadImageApi";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SendAssignment() {
  const [message, setMessage] = useState(
    "Thank you for your interest in our internship opening. As a next step, we are expecting you to complete a short assignment.\n\nThanks,\nMansi"
  );
  const { token } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { job_id,application_id } = useParams();
  const applicationId=application_id;
  const location = useLocation();
  const applicant = location.state?.applicant || {};
  const { uploadImage } = useUploadImageApi();

  /** Validate and set file */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert(" File size exceeds 5MB!");
      return;
    }
    setFile(selectedFile);
  };

  /** Upload file to server */
  const uploadAssignmentFile = async (selectedFile) => {
    try {
      const url = await uploadImage(selectedFile, "certificateImage");
      if (!url) throw new Error("Failed to upload file");
      return url;
    } catch (error) {
      console.error("Assignment upload failed:", error);
      throw new Error(error.message || "Upload failed");
    }
  };


//Submit assignment to server 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!deadline) {
    alert(" Please select a submission deadline");
    return;
  }
  if (!file) {
    alert(" Please select a file");
    return;
  }

  try {
    setIsSubmitting(true);

    // Upload file first
    const fileUrl = await uploadAssignmentFile(file);

    // Prepare payload
    const assignmentData = {
      message,
      deadline,
      assignment_url: fileUrl,
    };

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }
    const response = await axios.post(
      `${BASE_URL}/assignments/${applicationId}`,
      assignmentData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Assignment created:", response.data);

    alert("Assignment sent successfully!");
    setMessage("");
    setDeadline("");
    setFile(null);
  } catch (error) {
    console.error("Assignment submission failed:", error);

    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to send assignment";

    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen gap-6 px-4 py-6 bg-gray-100">
        {/* Left Sidebar */}
        <aside>
          <RecruiterApplicationData job_id={job_id} />
        </aside>

        {/* Right Main Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-white rounded-lg shadow-md w-[729px] h-[499px] p-6"
        >
          <h2 className="text-2xl font-bold">Send Assignment</h2>

          {/* Recipient */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">To:</span>
            <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
              {applicant.name || "No Name"}
            </span>
          </div>

          {/* Message */}
          <textarea
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* File Upload */}
          <div>
            <label
              htmlFor="file-upload"
              className="text-blue-600 cursor-pointer hover:underline"
            >
              + Attachment
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpeg,.jpg,.png,.gif,.bmp,.pdf,.zip,.xls,.doc"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum file size: 5 MB <br />
              Allowed: jpeg, jpg, png, gif, bmp, pdf, zip, xls, doc
            </p>
            {file && (
              <p className="mt-1 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Deadline */}
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Processing..." : "Prepare Assignment"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
