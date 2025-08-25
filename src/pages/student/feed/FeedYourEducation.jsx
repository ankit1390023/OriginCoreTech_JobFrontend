import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Select, Button, Badge } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightSide1 from "../feed/FeedRightSide1";
import { IoIosArrowBack } from "react-icons/io";
import { educationApi } from "../../../api/educationApi";

const FeedYourEducation = () => {
  const navigate = useNavigate();

  // Redux state for authentication
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // State for API data
  const [educationData, setEducationData] = useState({
    courses: [],
    specializations: [],
    colleges: [],
    jobRoles: [],
    locations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

  // Fetch education data from API
  const fetchEducationData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated and has token from Redux
      if (!isAuthenticated || !token) {
        throw new Error("User not authenticated. Please login to continue.");
      }

      const data = await educationApi.getAllEducationData(token);
      setEducationData(data);
      setIsUsingFallbackData(false);
    } catch (err) {
      console.error("Error fetching education data:", err);
      setError(err.message || "Failed to fetch education data");
      setIsUsingFallbackData(true);

      // Fallback to dummy data if API fails
      setEducationData({
        courses: [
          "B.Tech",
          "M.Tech",
          "MBA",
          "B.Sc",
          "M.Sc",
          "BCA",
          "MCA",
          "BBA",
          "PhD",
          "Diploma",
          "PGDM",
          "B.Des",
          "M.Des",
          "B.Com",
          "M.Com",
          "LLB",
          "LLM",
          "MBBS",
          "B.Pharm",
          "M.Pharm",
        ],
        specializations: [
          "Computer Science Engineering",
          "Information Technology",
          "Electronics and Communication Engineering",
          "Electrical Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Chemical Engineering",
          "Biotechnology",
          "Aerospace Engineering",
          "Automobile Engineering",
          "Industrial Engineering",
          "Textile Engineering",
          "Agricultural Engineering",
          "Mining Engineering",
          "Metallurgical Engineering",
          "Petroleum Engineering",
          "Environmental Engineering",
          "Biomedical Engineering",
          "Robotics Engineering",
          "Artificial Intelligence and Machine Learning",
          "Data Science",
          "Cybersecurity",
          "Cloud Computing",
          "Software Engineering",
          "Network Engineering",
        ],
        colleges: [
          "Indian Institute of Technology (IIT) Delhi",
          "Indian Institute of Technology (IIT) Bombay",
          "Indian Institute of Technology (IIT) Madras",
          "Indian Institute of Technology (IIT) Kanpur",
          "Indian Institute of Technology (IIT) Kharagpur",
          "National Institute of Technology (NIT) Trichy",
          "National Institute of Technology (NIT) Surathkal",
          "Delhi Technological University (DTU)",
          "Netaji Subhas University of Technology (NSUT)",
          "Vellore Institute of Technology (VIT)",
          "SRM Institute of Science and Technology",
          "Manipal Institute of Technology",
          "BITS Pilani",
          "Amrita School of Engineering",
          "PES University",
          "RV College of Engineering",
          "MS Ramaiah Institute of Technology",
          "JSS Academy of Technical Education",
          "Dayananda Sagar College of Engineering",
          "Bangalore Institute of Technology",
        ],
        jobRoles: [],
        locations: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchEducationData();
    }
  }, [isAuthenticated, token]);

  // Education entries state
  const [educationEntries, setEducationEntries] = useState([
    {
      id: 1,
      course: "B.Tech",
      college_name: "",
      specialization: "",
      start_year: "",
      end_year: "",
      certificate: null,
      certificateFile: null,
      certificateName: "",
      bgColor: "bg-white",
    },
    {
      id: 2,
      course: "Design",
      college_name: "",
      specialization: "",
      start_year: "",
      end_year: "",
      certificate: "uploaded",
      certificateFile: null,
      certificateName: "design_certificate.pdf",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      course: "Design",
      college_name: "",
      specialization: "",
      start_year: "",
      end_year: "",
      certificate: "uploaded",
      certificateFile: null,
      certificateName: "advanced_design_cert.pdf",
      bgColor: "bg-green-50",
    },
    {
      id: 4,
      course: "Design",
      college_name: "",
      specialization: "",
      start_year: "",
      end_year: "",
      certificate: "uploaded",
      certificateFile: null,
      certificateName: "ui_ux_certificate.pdf",
      bgColor: "bg-red-50",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCollegeDropdown, setShowCollegeDropdown] = useState({});
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(
    {}
  );
  const [collegeSearchQuery, setCollegeSearchQuery] = useState({});
  const [specializationSearchQuery, setSpecializationSearchQuery] = useState(
    {}
  );
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const collegeDropdowns = document.querySelectorAll(
        "[data-college-dropdown]"
      );
      const specializationDropdowns = document.querySelectorAll(
        "[data-specialization-dropdown]"
      );

      let clickedInsideCollege = false;
      let clickedInsideSpecialization = false;

      collegeDropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) {
          clickedInsideCollege = true;
        }
      });

      specializationDropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) {
          clickedInsideSpecialization = true;
        }
      });

      if (!clickedInsideCollege) {
        setShowCollegeDropdown({});
      }

      if (!clickedInsideSpecialization) {
        setShowSpecializationDropdown({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideCourse = (event) => {
      const courseDropdown = document.querySelector(".course-dropdown");
      if (courseDropdown && !courseDropdown.contains(event.target)) {
        setShowCourseDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideCourse);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCourse);
    };
  }, []);

  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleRemoveCourse = (id) => {
    setEducationEntries((entries) =>
      entries.filter((entry) => entry.id !== id)
    );
  };

  const handleInputChange = (id, field, value) => {
    setEducationEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving education data:", educationEntries);
    console.log("User ID:", user?._id || user?.id);
    console.log("User authenticated:", isAuthenticated);

    // Add your save logic here with user ID
    const educationDataToSave = {
      user_id: user?._id || user?.id,
      userEmail: user?.email,
      educationEntries: educationEntries,
      timestamp: new Date().toISOString(),
    };

    console.log("Education data to save:", educationDataToSave);

    // TODO: Implement API call to save education data
    // Example: await saveEducationData(educationDataToSave, token);

    // Navigate back to feed view after saving
    navigate("/feed-view");
  };

  const handleGoBack = () => {
    navigate("/feed-view");
  };

  const filteredColleges = (query, id) => {
    const searchTerm = collegeSearchQuery[id] || "";
    return educationData.colleges.filter((college) =>
      college.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredSpecializations = (query, id) => {
    const searchTerm = specializationSearchQuery[id] || "";
    return educationData.specializations.filter((specialization) =>
      specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCollegeSelect = (id, college) => {
    handleInputChange(id, "college_name", college);
    setShowCollegeDropdown((prev) => ({ ...prev, [id]: false }));
    setCollegeSearchQuery((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSpecializationSelect = (id, specialization) => {
    handleInputChange(id, "specialization", specialization);
    setShowSpecializationDropdown((prev) => ({ ...prev, [id]: false }));
    setSpecializationSearchQuery((prev) => ({ ...prev, [id]: "" }));
  };

  // Certificate handling functions
  const handleFileUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only PDF, JPEG, or PNG files.");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB.");
        return;
      }

      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev[id] + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Update education entry with certificate info
            setEducationEntries((entries) =>
              entries.map((entry) =>
                entry.id === id
                  ? {
                      ...entry,
                      certificate: "uploaded",
                      certificateFile: file,
                      certificateName: file.name,
                    }
                  : entry
              )
            );
            return { ...prev, [id]: 100 };
          }
          return { ...prev, [id]: newProgress };
        });
      }, 100);
    }
  };

  const handleViewCertificate = (entry) => {
    setSelectedCertificate(entry);
    setShowCertificateModal(true);
  };

  const handleDeleteCertificate = (id) => {
    setEducationEntries((entries) =>
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              certificate: null,
              certificateFile: null,
              certificateName: "",
            }
          : entry
      )
    );
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAddCourse = (course) => {
    // Prevent duplicate courses
    if (educationEntries.some((entry) => entry.course === course)) return;
    setEducationEntries((entries) => [
      entries[0],
      {
        id: Date.now(),
        course,
        college_name: "",
        specialization: "",
        start_year: "",
        end_year: "",
        certificate: null,
        certificateFile: null,
        certificateName: "",
        bgColor: "bg-white",
      },
      ...entries.slice(1),
    ]);
    setSearchQuery("");
    setShowCourseDropdown(false);
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-start bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:block flex-grow "></div>

        {/* Responsive Main Card */}
        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
        
        
          <div className="bg-white rounded  w-full flex flex-col">
            {/* Header */}
            <div className="mb-4 sm:mb-6 px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoIosArrowBack className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
                    Your Education
                  </h1>
                 
                </div>
              </div>
              {/* Search Bar */}
              <div className="relative mb-4 sm:mb-6">
                <input
                  type="text"
                  placeholder="Select your course"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowCourseDropdown(true);
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {showCourseDropdown && searchQuery.trim() && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {educationData.courses
                      .filter(
                        (course) =>
                          course
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) &&
                          !educationEntries.some(
                            (entry) => entry.course === course
                          )
                      )
                      .map((course, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleAddCourse(course)}
                        >
                          {course}
                        </div>
                      ))}
                    {/* Show message if no results */}
                    {educationData.courses.filter(
                      (course) =>
                        course
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) &&
                        !educationEntries.some(
                          (entry) => entry.course === course
                        )
                    ).length === 0 && (
                      <div className="px-3 py-2 text-gray-400 text-sm">
                        No courses found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Education Entries */}
            <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              {educationEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`${entry.bgColor} border border-gray-200 rounded-lg flex flex-col items-stretch justify-center`}
                >
                  {/* Course Tag and Certificate Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 pt-3 sm:pt-4 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="primary"
                        className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        {entry.course}
                        {idx === 0 && (
                          <button
                            onClick={() => handleRemoveCourse(entry.id)}
                            className="ml-1 sm:ml-2 hover:bg-blue-600 rounded-full p-0.5"
                          >
                            <svg
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      {entry.certificate ? (
                        <button
                          onClick={() => handleViewCertificate(entry)}
                          className="flex items-center gap-1 sm:gap-2 hover:text-blue-600 transition-colors"
                        >
                          <span className="hidden sm:inline">
                            View/Edit Certificate
                          </span>
                          <span className="sm:hidden">View/Edit</span>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <label className="flex items-center gap-1 sm:gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                          <span className="hidden sm:inline">
                            Upload Certificate
                          </span>
                          <span className="sm:hidden">Upload</span>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(entry.id, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  {uploadProgress[entry.id] !== undefined &&
                    uploadProgress[entry.id] < 100 && (
                      <div className="px-3 sm:px-4 mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[entry.id]}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Uploading... {uploadProgress[entry.id]}%
                        </p>
                      </div>
                    )}

                  {/* Form Fields */}
                  <div
                    className="w-full rounded-lg p-2 sm:p-3 opacity-100 flex flex-col justify-between"
                    style={{ gap: "4px" }}
                  >
                    <div className="flex flex-col gap-2 sm:gap-3">
                      {/* College Name Dropdown */}
                      <div className="relative" data-college-dropdown>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          College Name
                        </label>
                        <input
                          type="text"
                          placeholder="College name"
                          value={entry.college_name}
                          onChange={(e) =>
                            handleInputChange(
                              entry.id,
                              "college_name",
                              e.target.value
                            )
                          }
                          onFocus={() =>
                            setShowCollegeDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }))
                          }
                          className="bg-transparent w-full h-10 sm:h-12 rounded-lg px-3 sm:px-4 opacity-100 border border-gray-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showCollegeDropdown[entry.id] && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <input
                              type="text"
                              placeholder="Search colleges..."
                              value={collegeSearchQuery[entry.id] || ""}
                              onChange={(e) =>
                                setCollegeSearchQuery((prev) => ({
                                  ...prev,
                                  [entry.id]: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            {filteredColleges("", entry.id).map(
                              (college, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={() =>
                                    handleCollegeSelect(entry.id, college)
                                  }
                                >
                                  {college}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Specialization Dropdown */}
                      <div className="relative" data-specialization-dropdown>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization
                        </label>
                        <input
                          type="text"
                          placeholder="Eg. Computer Science"
                          value={entry.specialization}
                          onChange={(e) =>
                            handleInputChange(
                              entry.id,
                              "specialization",
                              e.target.value
                            )
                          }
                          onFocus={() =>
                            setShowSpecializationDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }))
                          }
                          className="bg-transparent w-full h-10 sm:h-12 rounded-lg px-3 sm:px-4 opacity-100 border border-gray-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showSpecializationDropdown[entry.id] && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <input
                              type="text"
                              placeholder="Search specializations..."
                              value={specializationSearchQuery[entry.id] || ""}
                              onChange={(e) =>
                                setSpecializationSearchQuery((prev) => ({
                                  ...prev,
                                  [entry.id]: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            {filteredSpecializations("", entry.id).map(
                              (specialization, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={() =>
                                    handleSpecializationSelect(
                                      entry.id,
                                      specialization
                                    )
                                  }
                                >
                                  {specialization}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start year
                        </label>
                        <div className="">
                          <Select
                            placeholder="Choose year"
                            options={yearOptions}
                            value={entry.start_year}
                            onChange={(e) =>
                              handleInputChange(
                                entry.id,
                                "start_year",
                                e.target.value
                              )
                            }
                            className="w-full h-12 rounded-lg px-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End year
                        </label>
                        <div className="">
                          <Select
                            placeholder="Choose year"
                            options={yearOptions}
                            value={entry.end_year}
                            onChange={(e) =>
                              handleInputChange(
                                entry.id,
                                "end_year",
                                e.target.value
                              )
                            }
                            className="w-full h-12 rounded-lg px-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 pb-4 sm:pb-6">
              <Button
                variant="primary"
                size="large"
                onClick={handleSaveChanges}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm sm:text-base transition-colors duration-200"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </section>

        {/* Certificate Modal */}
        {showCertificateModal && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Certificate Details
                  </h3>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.course}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.certificateName}
                    </p>
                  </div>

                  {selectedCertificate.certificateFile && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        File Details
                      </label>
                      <p className="text-sm text-gray-900">
                        Size:{" "}
                        {formatFileSize(
                          selectedCertificate.certificateFile.size
                        )}
                      </p>
                      <p className="text-sm text-gray-900">
                        Type: {selectedCertificate.certificateFile.type}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        // Simulate download
                        const link = document.createElement("a");
                        link.href = selectedCertificate.certificateFile
                          ? URL.createObjectURL(
                              selectedCertificate.certificateFile
                            )
                          : "#";
                        link.download = selectedCertificate.certificateName;
                        link.click();
                      }}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Download
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCertificate(selectedCertificate.id)
                      }
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Replace Certificate
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        handleFileUpload(selectedCertificate.id, e);
                        setShowCertificateModal(false);
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightSide1 />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FeedYourEducation;
