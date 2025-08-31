// // import React, { useState, useEffect } from "react";
// // import { useSelector } from "react-redux";
// // import { useParams, useLocation } from "react-router-dom";
// // import MainLayout from "../../../components/layout/MainLayout";
// // import RecruiterApplicationData from "./RecruiterApplicationData";
// // import { jobPostApi } from "../../../api/jobPostApi";

// // const ScheduleInterview = () => {
// //   const { application_id } = useParams();
// //   const { token } = useSelector((state) => state.auth);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [interviewData, setInterviewData] = useState(null);
  
// //   const [formData, setFormData] = useState({
// //     interview_type: "Video call",
// //     date: "",
// //     start_time: "",
// //     end_time: "",
// //     video_link: "",
// //   });

// //   const location=useLocation();
// //   const applicationData = location.state?.applicationData;
// //   // Get the application ID from URL params or fallback to state/props if needed
// //   // const applicationId = id || new URLSearchParams(window.location.search).get('applicationId');

  

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleInterviewType = (type) => {
// //     setFormData({
// //       ...formData,
// //       interview_type: type,
// //     });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log("Scheduled Interview:", formData);
// //     alert("Interview Scheduled Successfully!");
// //   };

  

// //   if (loading) {
// //     return (
// //       <MainLayout>
// //         <div className="flex items-center justify-center min-h-screen">
// //           <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
// //         </div>
// //       </MainLayout>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <MainLayout>
// //         <div className="flex items-center justify-center min-h-screen">
// //           <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
// //             <p>Error: {error}</p>
// //             <button 
// //               onClick={() => window.location.reload()}
// //               className="px-4 py-1 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //       </MainLayout>
// //     );
// //   }

// //   return (
// //     <MainLayout>
// //       <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
// //         <div className="flex-grow hidden lg:block"></div>
// //         <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
// //           <RecruiterApplicationData />
// //         </aside>

// //         <div className="w-[729px] h-[749px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-10 flex flex-col gap-5">
// //           {/* Header */}
// //           <h2 className="text-2xl font-semibold text-gray-800">
// //             Schedule Interview
// //           </h2>

// //           {/* To */}
// //           <div>
// //             <p className="text-sm text-gray-600">To:</p>
// //             <span className="inline-block px-3 py-1 mt-1 text-gray-700 bg-gray-100 rounded-md">
// //               Nidhi Sharma
// //             </span>
// //           </div>

// //           {/* Email Body */}
// //           <textarea
// //             className="w-full p-3 text-sm text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             rows="6"
// //             defaultValue={`Hi Nidhi,

// // Can you please confirm your availability for the mentioned date and time? Let me know in case of reschedule.

// // I am available at +91-9996222046 for any further clarification.

// // Thanks,
// // Rishabh`}
// //           />

// //           {/* Interview Type */}
// //           <div>
// //             <p className="mb-2 text-sm text-gray-600">Interview type</p>
// //             <div className="flex gap-4">
// //               {["Video call", "Phone", "In-office"].map((type) => (
// //                 <label
// //                   key={type}
// //                   className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${
// //                     formData.interview_type === type
// //                       ? "border-blue-500 bg-blue-50"
// //                       : "border-gray-300"
// //                   }`}
// //                 >
// //                   <input
// //                     type="radio"
// //                     name="interview_type"
// //                     checked={formData.interview_type === type}
// //                     onChange={() => handleInterviewType(type)}
// //                     className="hidden"
// //                   />
// //                   <span className="text-gray-700">{type}</span>
// //                 </label>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Interview Date */}
// //           <div>
// //             <p className="mb-2 text-sm text-gray-600">Interview date</p>
// //             <input
// //               type="date"
// //               name="date"
// //               value={formData.date}
// //               onChange={handleChange}
// //               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           {/* Interview Time */}
// //           <div>
// //             <p className="mb-2 text-sm text-gray-600">Interview time</p>
// //             <div className="flex gap-3">
// //               <input
// //                 type="time"
// //                 name="start_time"
// //                 value={formData.start_time}
// //                 onChange={handleChange}
// //                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //               <input
// //                 type="time"
// //                 name="end_time"
// //                 value={formData.end_time}
// //                 onChange={handleChange}
// //                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Video Link */}
// //           {formData.interview_type === "Video call" && (
// //             <div>
// //               <p className="mb-2 text-sm text-gray-600">
// //                 Share video call link
// //               </p>
// //               <input
// //                 type="url"
// //                 name="video_link"
// //                 value={formData.video_link}
// //                 onChange={handleChange}
// //                 placeholder="e.g. https://meet.google.com/uvw-ulva-uv"
// //                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           )}

// //           {/* Submit Button */}
// //           <button
// //             onClick={handleSubmit}
// //             className="px-6 py-3 font-medium text-white transition duration-200 bg-red-500 rounded-lg shadow-md hover:bg-red-600"
// //           >
// //             Schedule Interview
// //           </button>
// //         </div>

// //         {/* Right Spacer */}
// //         <div className="flex-grow hidden lg:block "></div>
// //       </div>
// //     </MainLayout>
// //   );
// // };

// // export default ScheduleInterview;




// // import React, { useState } from "react";
// // import { useSelector } from "react-redux";
// // import { useParams, useLocation, useNavigate } from "react-router-dom";
// // import MainLayout from "../../../components/layout/MainLayout";
// // import RecruiterApplicationData from "./RecruiterApplicationData";
// // import  {useScheduleInterview} from "../../../hooks/useApplications"; // hook/api method we created

// // const ScheduleInterview = () => {
// //   const { application_id } = useParams();
// //   const { token } = useSelector((state) => state.auth);
// //   const navigate = useNavigate();
// //   const { scheduleInterview } = useScheduleInterview();

// //   const [formData, setFormData] = useState({
// //     interview_type: "Video call",
// //     date: "",
// //     start_time: "",
// //     end_time: "",
// //     video_link: "",
// //   });

// //   const location = useLocation();
// //   const applicationData = location.state?.applicationData;

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleInterviewType = (type) => {
// //     setFormData({
// //       ...formData,
// //       interview_type: type,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const payload = {
// //         application_id,
// //         ...formData,
// //       };

// //       await scheduleInterview(application_id, {
// //   message: "Interview is scheduled for you",
// //   interview_type: formData.interview_type,
// //   interview_date: formData.date,
// //   start_time: formData.start_time,
// //   end_time: formData.end_time,
// //   video_link: formData.video_link,
// // });

// //       alert("Interview Scheduled Successfully!");
// //       navigate("/recruiter-dashboard"); // 🔴 redirect to dashboard after success
// //     } catch (err) {
// //       setError(err.message || "Failed to schedule interview.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <MainLayout>
// //       <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
// //         <div className="flex-grow hidden lg:block"></div>
// //         <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
// //           <RecruiterApplicationData />
// //         </aside>

// //         <div className="w-[729px] h-[749px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-10 flex flex-col gap-5">
// //           {/* Header */}
// //           <h2 className="text-2xl font-semibold text-gray-800">
// //             Schedule Interview
// //           </h2>

// //           {/* To */}
// //           <div>
// //             <p className="text-sm text-gray-600">To:</p>
// //             <span className="inline-block px-3 py-1 mt-1 text-gray-700 bg-gray-100 rounded-md">
// //               {applicationData?.name || "Candidate"}
// //             </span>
// //           </div>

// //           {/* Email Body */}
// //           <textarea
// //             className="w-full p-3 text-sm text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             rows="6"
// //             defaultValue={`Hi ${applicationData?.name || "Candidate"},

// // Can you please confirm your availability for the mentioned date and time? Let me know in case of reschedule.

// // I am available at +91-9996222046 for any further clarification.

// // Thanks,
// // Recruiter`}
// //           />

// //           {/* Interview Type */}
// //           <div>
// //             <p className="mb-2 text-sm text-gray-600">Interview type</p>
// //             <div className="flex gap-4">
// //               {["Video call", "Phone", "In-office"].map((type) => (
// //                 <label
// //                   key={type}
// //                   className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${
// //                     formData.interview_type === type
// //                       ? "border-blue-500 bg-blue-50"
// //                       : "border-gray-300"
// //                   }`}
// //                 >
// //                   <input
// //                     type="radio"
// //                     name="interview_type"
// //                     checked={formData.interview_type === type}
// //                     onChange={() => handleInterviewType(type)}
// //                     className="hidden"
// //                   />
// //                   <span className="text-gray-700">{type}</span>
// //                 </label>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Interview Date */}
// //           <div>
// //             <p className="mb-2 text-sm text-gray-600">Interview date</p>
// //             <input
// //               type="date"
// //               name="date"
// //               value={formData.date}
// //               onChange={handleChange}
// //               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           {/* Interview Time */}
// //           <div>
// //             <p className="mb-2 text-sm text-gray-600">Interview time</p>
// //             <div className="flex gap-3">
// //               <input
// //                 type="time"
// //                 name="start_time"
// //                 value={formData.start_time}
// //                 onChange={handleChange}
// //                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //               <input
// //                 type="time"
// //                 name="end_time"
// //                 value={formData.end_time}
// //                 onChange={handleChange}
// //                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Video Link */}
// //           {formData.interview_type === "Video call" && (
// //             <div>
// //               <p className="mb-2 text-sm text-gray-600">
// //                 Share video call link
// //               </p>
// //               <input
// //                 type="url"
// //                 name="video_link"
// //                 value={formData.video_link}
// //                 onChange={handleChange}
// //                 placeholder="e.g. https://meet.google.com/uvw-ulva-uv"
// //                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           )}

// //           {/* Error Message */}
// //           {error && <p className="text-sm text-red-500">{error}</p>}

// //           {/* Submit Button */}
// //           <button
// //             onClick={handleSubmit}
// //             disabled={loading}
// //             className="px-6 py-3 font-medium text-white transition duration-200 bg-red-500 rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50"
// //           >
// //             {loading ? "Scheduling..." : "Schedule Interview"}
// //           </button>
// //         </div>

// //         <div className="flex-grow hidden lg:block "></div>
// //       </div>
// //     </MainLayout>
// //   );
// // };

// // export default ScheduleInterview;





// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import MainLayout from "../../../components/layout/MainLayout";
// import RecruiterApplicationData from "./RecruiterApplicationData";
// import { useScheduleInterview } from "../../../hooks/useApplications"; // hook/api method we created

// const ScheduleInterview = () => {
//   const { application_id } = useParams();
//   const { token } = useSelector((state) => state.auth);
//   // const { first_name } = useSelector((state) => state.user?.first_name);
//   const navigate = useNavigate();
//   const { scheduleInterview } = useScheduleInterview();

//   const [formData, setFormData] = useState({
//     message: "",
//     interview_type: "Video call",
//     date: "",
//     start_time: "",
//     end_time: "",
//     video_link: "",
//   });

//   const location = useLocation();
//   const applicationData = location.state?.applicationData;

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleInterviewType = (type) => {
//     setFormData({
//       ...formData,
//       interview_type: type,
//     });
//   };

//   const validateForm = () => {
//     if(!formData.message) return "Message is required.";
//     if (!formData.date) return "Interview date is required.";
//     if (!formData.start_time) return "Start time is required.";
//     if (!formData.end_time) return "End time is required.";
//     if (formData.interview_type === "Video call" && !formData.video_link)
//       return "Video call link is required.";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);


//     console.log(formData);
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       setLoading(false);
//       return;
//     }

//     try {

//       await scheduleInterview(application_id, formData);

//       alert("Interview Scheduled Successfully!");
//       navigate("/recruiter-dashboard"); // redirect to dashboard after success
//     } catch (err) {
//       setError(err.message || "Failed to schedule interview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <MainLayout>
//       <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
//         <div className="flex-grow hidden lg:block"></div>
//         <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
//           <RecruiterApplicationData />
//         </aside>

//         <div className="w-[729px] h-[749px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-10 flex flex-col gap-5">
//           {/* Header */}
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Schedule Interview
//           </h2>

//           {/* To */}
//           <div>
//             <p className="text-sm text-gray-600">To:</p>
//             <span className="inline-block px-3 py-1 mt-1 text-gray-700 bg-gray-100 rounded-md">
//               {applicationData?.name || "Candidate"}
//             </span>
//           </div>

//           {/* Email Body */}
//           <textarea
//             type="message"
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//             className="w-full p-3 text-sm text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows="6"
//             defaultValue={`Hi ${applicationData?.name || "Candidate"},

// Can you please confirm your availability for the mentioned date and time? Let me know in case of reschedule.

// I am available at +91-9996222046 for any further clarification.

// Thanks,
// Recruiter`}
//           />

//           {/* Interview Type */}
//           <div>
//             <p className="mb-2 text-sm text-gray-600">Interview type</p>
//             <div className="flex gap-4">
//               {["Video call", "Phone", "In-office"].map((type) => (
//                 <label
//                   key={type}
//                   className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${
//                     formData.interview_type === type
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="interview_type"
//                     checked={formData.interview_type === type}
//                     onChange={() => handleInterviewType(type)}
//                     className="hidden"
//                   />
//                   <span className="text-gray-700">{type}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Interview Date */}
//           <div>
//             <p className="mb-2 text-sm text-gray-600">Interview date</p>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Interview Time */}
//           <div>
//             <p className="mb-2 text-sm text-gray-600">Interview time</p>
//             <div className="flex gap-3">
//               <input
//                 type="time"
//                 name="start_time"
//                 value={formData.start_time}
//                 onChange={handleChange}
//                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="time"
//                 name="end_time"
//                 value={formData.end_time}
//                 onChange={handleChange}
//                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Video Link */}
//           {formData.interview_type === "Video call" && (
//             <div>
//               <p className="mb-2 text-sm text-gray-600">
//                 Share video call link
//               </p>
//               <input
//                 type="url"
//                 name="video_link"
//                 value={formData.video_link}
//                 onChange={handleChange}
//                 placeholder="e.g. https://meet.google.com/uvw-ulva-uv"
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           )}

//           {/* Error Message */}
//           {error && <p className="text-sm text-red-500">{error}</p>}

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-6 py-3 font-medium text-white transition duration-200 bg-red-500 rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50"
//           >
//             {loading ? "Scheduling..." : "Schedule Interview"}
//           </button>
//         </div>

//         <div className="flex-grow hidden lg:block "></div>
//       </div>
//     </MainLayout>
//   );
// };

// export default ScheduleInterview;



// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import MainLayout from "../../../components/layout/MainLayout";
// import RecruiterApplicationData from "./RecruiterApplicationData";
// import  {useScheduleInterview} from "../../../hooks/useApplications"; // hook/api method we created

// const ScheduleInterview = () => {
//   const { application_id } = useParams();
//   const { token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const { scheduleInterview } = useScheduleInterview();

//   const [formData, setFormData] = useState({
//     interview_type: "Video call",
//     date: "",
//     start_time: "",
//     end_time: "",
//     video_link: "",
//   });

//   const location = useLocation();
//   const applicationData = location.state?.applicationData;

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleInterviewType = (type) => {
//     setFormData({
//       ...formData,
//       interview_type: type,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         application_id,
//         ...formData,
//       };

//       await scheduleInterview(application_id, {
//   message: "Interview is scheduled for you",
//   interview_type: formData.interview_type,
//   interview_date: formData.date,
//   start_time: formData.start_time,
//   end_time: formData.end_time,
//   video_link: formData.video_link,
// });

//       alert("Interview Scheduled Successfully!");
//       navigate("/recruiter-dashboard"); //  redirect to dashboard after success
//     } catch (err) {
//       setError(err.message || "Failed to schedule interview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <MainLayout>
//       <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
//         <div className="flex-grow hidden lg:block"></div>
//         <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
//           <RecruiterApplicationData />
//         </aside>

//         <div className="w-[729px] h-[749px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-2 flex flex-col gap-5">
//           {/* Header */}
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Schedule Interview
//           </h2>

//           {/* To */}
//           <div>
//             <p className="text-sm text-gray-600">To:</p>
//             <span className="inline-block px-3 py-1 mt-1 text-gray-700 bg-gray-100 rounded-md">
//               {applicationData?.name || "Candidate"}
//             </span>
//           </div>

//           {/* Email Body */}
//           <textarea
//             className="w-full p-3 text-sm text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows="6"
//             defaultValue={`Hi ${applicationData?.name || "Candidate"},

// Can you please confirm your availability for the mentioned date and time? Let me know in case of reschedule.

// I am available at +91-9996222046 for any further clarification.

// Thanks,
// Recruiter`}
//           />

//           {/* Interview Type */}
//           <div>
//             <p className="mb-2 text-sm text-gray-600">Interview type</p>
//             <div className="flex gap-4">
//               {["Video call", "Phone", "In-office"].map((type) => (
//                 <label
//                   key={type}
//                   className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${
//                     formData.interview_type === type
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="interview_type"
//                     checked={formData.interview_type === type}
//                     onChange={() => handleInterviewType(type)}
//                     className="hidden"
//                   />
//                   <span className="text-gray-700">{type}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Interview Date */}
//           <div>
//             <p className="mb-2 text-sm text-gray-600">Interview date</p>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Interview Time */}
//           <div>
//             <p className="mb-2 text-sm text-gray-600">Interview time</p>
//             <div className="flex gap-3">
//               <input
//                 type="time"
//                 name="start_time"
//                 value={formData.start_time}
//                 onChange={handleChange}
//                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="time"
//                 name="end_time"
//                 value={formData.end_time}
//                 onChange={handleChange}
//                 className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Video Link */}
//           {formData.interview_type === "Video call" && (
//             <div>
//               <p className="mb-2 text-sm text-gray-600">
//                 Share video call link
//               </p>
//               <input
//                 type="url"
//                 name="video_link"
//                 value={formData.video_link}
//                 onChange={handleChange}
//                 placeholder="e.g. https://meet.google.com/uvw-ulva-uv"
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           )}

//           {/* Error Message */}
//           {error && <p className="text-sm text-red-500">{error}</p>}

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-6 py-3 font-medium text-white transition duration-200 bg-red-500 rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50"
//           >
//             {loading ? "Scheduling..." : "Schedule Interview"}
//           </button>
//         </div>

//         <div className="flex-grow hidden lg:block "></div>
//       </div>
//     </MainLayout>
//   );
// };

// export default ScheduleInterview;









import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterApplicationData from "./RecruiterApplicationData";
import { useScheduleInterview } from "../../../hooks/useApplications";

const ScheduleInterview = () => {
  const { application_id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { scheduleInterview } = useScheduleInterview();

  const [formData, setFormData] = useState({
    interview_type: "Video call",
    date: "",
    start_time: "",
    end_time: "",
    video_link: "",
  });

  const location = useLocation();
  const applicationData = location.state?.applicationData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};

    if (!formData.interview_type) errors.interview_type = "Please select interview type.";
    if (!formData.date) errors.date = "Please select interview date.";
    if (!formData.start_time) errors.start_time = "Please enter start time.";
    if (!formData.end_time) errors.end_time = "Please enter end time.";
    if (formData.interview_type === "Video call" && !formData.video_link) {
      errors.video_link = "Please enter video call link.";
    }

    // Extra: logical validations
    if (formData.date && formData.start_time && formData.end_time) {
      const start = new Date(`${formData.date}T${formData.start_time}`);
      const end = new Date(`${formData.date}T${formData.end_time}`);
      const now = new Date();

      if (end <= start) {
        errors.end_time = "End time must be later than start time.";
      }

      if (start <= now) {
        errors.date = "Interview must be scheduled for a future date/time.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await scheduleInterview(application_id, {
        message: "Interview is scheduled for you",
        interview_type: formData.interview_type,
        interview_date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        video_link: formData.video_link,
      });

      alert("Interview Scheduled Successfully!");
      navigate("/recruiter-dashboard");
    } catch (err) {
      setError(err.message || "Failed to schedule interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        <div className="flex-grow hidden lg:block"></div>
        <aside className="hidden lg:block w-[729px] max-w-[729px] p-2 sticky top-4 h-fit ml-4 mt-2 ">
          <RecruiterApplicationData />
        </aside>

        <div className="w-[729px] h-[749px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-2 flex flex-col gap-5">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800">Schedule Interview</h2>

          {/* To */}
          <div>
            <p className="text-sm text-gray-600">To:</p>
            <span className="inline-block px-3 py-1 mt-1 text-gray-700 bg-gray-100 rounded-md">
              {applicationData?.name || "Candidate"}
            </span>
          </div>

          {/* Email Body */}
          <textarea
            className="w-full p-3 text-sm text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            defaultValue={`Hi ${applicationData?.name || "Candidate"},

Can you please confirm your availability for the mentioned date and time? Let me know in case of reschedule.

I am available at +91-9996222046 for any further clarification.

Thanks,
Recruiter`}
          />

          {/* Interview Type */}
          <div>
            <p className="mb-2 text-sm text-gray-600">Interview type</p>
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
            {fieldErrors.interview_type && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.interview_type}</p>
            )}
          </div>

          {/* Interview Date */}
          <div>
            <p className="mb-2 text-sm text-gray-600">Interview date</p>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.date && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.date}</p>
            )}
          </div>

          {/* Interview Time */}
          <div>
            <p className="mb-2 text-sm text-gray-600">Interview time</p>
            <div className="flex gap-3">
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {fieldErrors.start_time && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.start_time}</p>
            )}
            {fieldErrors.end_time && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.end_time}</p>
            )}
          </div>

          {/* Video Link */}
          {formData.interview_type === "Video call" && (
            <div>
              <p className="mb-2 text-sm text-gray-600">Share video call link</p>
              <input
                type="url"
                name="video_link"
                value={formData.video_link}
                onChange={handleChange}
                placeholder="e.g. https://meet.google.com/uvw-ulva-uv"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.video_link && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.video_link}</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 font-medium text-white transition duration-200 bg-red-500 rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Scheduling..." : "Schedule Interview"}
          </button>
        </div>

        <div className="flex-grow hidden lg:block "></div>
      </div>
    </MainLayout>
  );
};

export default ScheduleInterview;
