// import React, { useState } from "react";
// import { Search } from "lucide-react";


// const applicationsData = [
//   {
//     name: "Saloni Ahuja",
//     location: "Delhi (Open to relocate)",
//     experience: "5 months",
//     match: "Moderate",
//     matchColor: "bg-orange-100 text-orange-600",
//     cardBg: "bg-red-50",
//     applied: "2 days ago",
//     onClick: () => console.log("Application clicked"),
//   },
//   {
//     name: "Aman Sharma",
//     location: "Delhi (Open to relocate)",
//     experience: "9 months",
//     match: "High",
//     matchColor: "bg-green-100 text-green-600",
//     cardBg: "bg-white",
//     applied: "2 days ago",
//     onClick: () => console.log("Application clicked"),
//       },
//   {
//     name: "Saloni Ahuja",
//     location: "Delhi (Open to relocate)",
//     experience: "5 months",
//     match: "Moderate",
//     matchColor: "bg-orange-100 text-orange-600",
//     cardBg: "bg-white",
//     applied: "2 days ago",
//     onClick: () => console.log("Application clicked"),
//       },
//   {
//     name: "Aman Sharma",
//     location: "Delhi (Open to relocate)",
//     experience: "9 months",
//     match: "High",
//     matchColor: "bg-green-100 text-green-600",
//     cardBg: "bg-white",
//     applied: "2 days ago",
//     onClick: () => console.log("Application clicked"),
//           },
// ];

// const ApplicationsSmall = () => {
//   const [search, setSearch] = useState("");

  

//   const filteredApps = applicationsData.filter((app) =>
//     app.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
     
//           <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
             
//             <div className="flex-grow hidden lg:block"></div>
    
//     <div className="bg-white rounded-lg shadow-md w-[447px] h-[627px] mt-2 py-5 px-2 flex flex-col gap-[30px]">
//       {/* Title */}
//       <div>
//         <h1 className="text-2xl font-bold">Applications</h1>
//         <p className="text-sm text-gray-500">Graphic design internship</p>
//       </div>

//       {/* Applications List */}
//       <div className="flex flex-col gap-4 pr-1 overflow-y-auto">
//         {filteredApps.map((app, index) => (
//           <div
//             key={index}
//             className={`flex justify-between items-start rounded-lg border border-gray-200 p-3 ${app.cardBg}`}
//             onClick={app.onClick}
//                               >
//             {/* Left Info */}
//             <div>
//               <h2 className="font-semibold">{app.name}</h2>
//               <p className="text-sm text-gray-500">{app.location}</p>
//               <p className="text-sm text-gray-500">
//                 Total work experience: {app.experience}
//               </p>
//               <p className="mt-1 text-xs text-gray-400">
//                 Applied {app.applied}
//               </p>
//             </div>

//             {/* Resume Match */}
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${app.matchColor}`}
//             >
//               Resume match: {app.match}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
  
//                         {/* Right Spacer */}
//                         <div className="flex-grow hidden lg:block "></div>
//       </div>
    
//   );
// };

// export default ApplicationsSmall;





import React, { useState } from "react";
import { Search } from "lucide-react";
import { useApplications } from "../../../hooks/useApplications"; // adjust path if needed

const ApplicationsSmall = ({ job_id }) => {
  const [search, setSearch] = useState("");

  // use hook with job_id from prop
  const { applications, loading, error } = useApplications(job_id);

  // filter apps by name search
  const filteredApps = applications.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
      {/* Left Spacer */}
      <div className="flex-grow hidden lg:block"></div>

      {/* Applications Box */}
      <div className="bg-white rounded-lg shadow-md w-[447px] h-[627px] mt-2 py-5 px-2 flex flex-col gap-[30px]">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-sm text-gray-500">Graphic design internship</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Applications List */}
        <div className="flex flex-col gap-4 pr-1 overflow-y-auto">
          {loading && (
            <p className="text-sm text-gray-500">Loading applications...</p>
          )}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          {!loading && !error && filteredApps.length === 0 && (
            <p className="text-sm text-gray-500">No applications found</p>
          )}

          {!loading &&
            !error &&
            filteredApps.map((app, index) => (
              <div
                key={app.application_id || index}
                className={`flex justify-between items-start rounded-lg border border-gray-200 p-3 ${app.cardBg || "bg-white"}`}
                onClick={() =>
                  console.log("Application clicked:", app.application_id)
                }
              >
                {/* Left Info */}
                <div>
                  <h2 className="font-semibold">{app.name}</h2>
                  <p className="text-sm text-gray-500">{app.location}</p>
                  <p className="text-sm text-gray-500">
                    Total work experience: {app.experience}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Applied {app.applied}
                  </p>
                </div>

                {/* Resume Match */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${app.matchColor}`}
                >
                  Resume match: {app.match}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Right Spacer */}
      <div className="flex-grow hidden lg:block "></div>
    </div>
  );
};

export default ApplicationsSmall;
