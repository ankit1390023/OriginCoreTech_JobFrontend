// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import MainLayout from "../../../components/layout/MainLayout";
// import RecruiterApplicationData from "./RecruiterApplicationData";
// import { jobPostApi } from "../../../api/jobPostApi";
// import { useParams ,useLocation} from "react-router-dom";

// export default function SendAssignment() {
//   const [message, setMessage] = useState(
//     "Thank you for your interest in our internship opening. As a next step, we are expecting you to complete a short assignment.\n\nThanks,\nMansi"
//   );
//   const [file, setFile] = useState(null);
//   const [deadline, setDeadline] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const { token } = useSelector((state) => state.auth);
//   // Get applicationId from route params or props
//   const applicationId =   useParams().application_id;
//   const location = useLocation();
//   const applicant = location.state?.applicant || {};

//   console.log("Applicant data:", applicant);

//   console.log("Application ID:", applicationId);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
//       setFile(selectedFile);
//     } else {
//       alert("File size exceeds 5MB!");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!deadline) {
//       alert("Please select a submission deadline");
//       return;
//     }


//     try {
//       setIsSubmitting(true);
      
//       const assignmentData = {
//         message,
//         deadline,
//         file
//       };

//       const response = await jobPostApi.getSendAssignment(applicationId, assignmentData, token);
      
//       console.log("Assignment sent:", response);
//       alert("Assignment sent successfully!");
      
//       // Reset form
//       setMessage("");
//       setDeadline("");
//       setFile(null);
      
//     } catch (error) {
//       console.error("Error sending assignment:", error);
//       alert(error.response?.data?.message || "Failed to send assignment");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//      <MainLayout>
//               <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
//                 <div className="flex-grow hidden lg:block"></div>
//                 <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
                               
//                                <RecruiterApplicationData />
//                            </aside>
        
//       <div
//       className="bg-white shadow-md rounded-lg p-6 w-[729px] min-h-[499px] flex flex-col gap-5"
//       style={{ top: "150px", left: "522px" }}
//     >
//       <h2 className="text-2xl font-bold">Send Assignment</h2>

//       {/* To Field */}
//       <div className="flex items-center gap-2">
//         <span className="font-medium text-gray-700">To:</span>
//         <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
//           {applicant.name || 'No Name'}
//         </span>
//       </div>

//       {/* Message Box */}
//       <textarea
//         className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[120px]"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />

//       {/* Attachment */}
//       <div>
//         <label
//           htmlFor="file-upload"
//           className="text-blue-600 cursor-pointer hover:underline"
//         >
//           + Attachment
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           className="hidden"
//           onChange={handleFileChange}
//           accept=".jpeg,.jpg,.png,.gif,.bmp,.pdf,.zip,.xls,.doc"
//         />
//         <p className="mt-1 text-sm text-gray-500">
//           Maximum file size 5 MB <br />
//           Only jpeg, jpg, png, gif, bmp, pdf, zip, xls, doc allowed
//         </p>
//         {file && (
//           <p className="mt-1 text-sm text-green-600">Selected: {file.name}</p>
//         )}
//       </div>

//       {/* Deadline */}
//       <div>
//         <input
//           type="date"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={deadline}
//           onChange={(e) => setDeadline(e.target.value)}
//         />
//       </div>

//       {/* Send Button */}
//       <button
//         onClick={handleSubmit}
//         disabled={isSubmitting}
//         className={`bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all ${
//           isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//         }`}
//       >
//         {isSubmitting ? 'Sending...' : 'Send Assignment'}
//       </button>
//        </div>
    
//                             {/* Right Spacer */}
//                             <div className="flex-grow hidden lg:block "></div>
//           </div>
//         </MainLayout> 
    
//   );
// }



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterApplicationData from "./RecruiterApplicationData";
import { jobPostApi } from "../../../api/jobPostApi";
import { useParams, useLocation } from "react-router-dom";

export default function SendAssignment() {
  const [message, setMessage] = useState(
    "Thank you for your interest in our internship opening. As a next step, we are expecting you to complete a short assignment.\n\nThanks,\nMansi"
  );
  const [file, setFile] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const applicationId = useParams().application_id;
  const location = useLocation();
  const applicant = location.state?.applicant || {};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert("File size exceeds 5MB!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deadline) {
      alert("Please select a submission deadline");
      return;
    }

    try {
      setIsSubmitting(true);
      const assignmentData = { message, deadline, file };

      const response = await jobPostApi.getSendAssignment(
        applicationId,
        assignmentData,
        token
      );

      alert("Assignment sent successfully!");
      setMessage("");
      setDeadline("");
      setFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen gap-6 px-4 py-6 bg-gray-100">
        {/* Left Sidebar */}
        <aside>
          <RecruiterApplicationData  />
        </aside>

        {/* Right Main Section */}
        <div
          className="flex flex-col gap-5 bg-white rounded-lg shadow-md"
          style={{
            width: "729px",
            height: "499px",
            top: "99px",
            left: "522px",
            borderRadius: "10px",
            padding: "20px 24px",
          }}
        >
          <h2 className="text-2xl font-bold">Send Assignment</h2>

          {/* To Field */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">To:</span>
            <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
              {applicant.name || "No Name"}
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
            <p className="mt-1 text-sm text-gray-500">
              Maximum file size 5 MB <br />
              Only jpeg, jpg, png, gif, bmp, pdf, zip, xls, doc allowed
            </p>
            {file && (
              <p className="mt-1 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Assignment"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

