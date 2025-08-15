import React, { useState } from "react";

export default function SendAssignment() {
  const [message, setMessage] = useState(
    "Thank you for your interest in our internship opening. As a next step, we are expecting you to complete a short assignment.\n\nThanks,\nMansi"
  );
  const [file, setFile] = useState(null);
  const [deadline, setDeadline] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert("File size exceeds 5MB!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deadline) {
      alert("Please select a submission deadline");
      return;
    }
    console.log({
      message,
      file,
      deadline,
    });
    alert("Assignment sent successfully!");
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 w-[729px] min-h-[499px] flex flex-col gap-5"
      style={{ top: "99px", left: "522px" }}
    >
      <h2 className="text-2xl font-bold">Send Assignment</h2>

      {/* To Field */}
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">To:</span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Nidhi Sharma
        </span>
      </div>

      {/* Message Box */}
      <textarea
        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[120px]"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Attachment */}
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
        <p className="text-gray-500 text-sm mt-1">
          Maximum file size 5 MB <br />
          Only jpeg, jpg, png, gif, bmp, pdf, zip, xls, doc allowed
        </p>
        {file && (
          <p className="mt-1 text-green-600 text-sm">Selected: {file.name}</p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <input
          type="date"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      {/* Send Button */}
      <button
        onClick={handleSubmit}
        className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all"
      >
        Send Assignment
      </button>
    </div>
  );
}
