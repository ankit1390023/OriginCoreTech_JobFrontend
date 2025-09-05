import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Select, Button, Badge } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightSide1 from "../feed/FeedRightSide1";
import { IoIosArrowBack } from "react-icons/io";
import { useMasterData } from "../../../hooks/master/useMasterData"; // Add this import
import { userDetailsApi } from "../../../api/userDetailsApi";

const FeedYourEducation = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);




const [loading, setLoading] = useState(true);

const [profile, setProfile] = useState(null);

// Main education entries state — will be set from API data
const [educationEntries, setEducationEntries] = useState([]);

// Fetch user profile and initialize education entries
useEffect(() => {
  const fetchUserProfile = async () => {
    if (!isAuthenticated || !token || !user?.id) {
      console.warn("User not authenticated or missing user ID");
      setLoading(false);
      // Initialize with empty entry if no user
      setEducationEntries([
        {
          id: Date.now(),
          course: "",
          courseId: "",
          college_name: "",
          collegeId: "",
          specialization: "",
          specializationId: "",
          start_year: "",
          end_year: "",
          certificate: null,
          certificateFile: null,
          certificateName: "",
          bgColor: "bg-white",
        },
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching user details for ID:", user.id);
      const result = await userDetailsApi.getUserDetails(user.id);

      console.log("API Response:", result);

      if (result.success) {
        const fetchedProfile = result.data;
        setProfile(fetchedProfile);

        const educations = fetchedProfile?.educations || [];
        console.log("Educations",educations);

        if (educations.length > 0) {
  // ✅ Map ALL education entries
  const mappedEntries = educations.map((edu) => ({
    id: edu.id,
    course: edu.educationCourse?.name || "",
    courseId: edu.course_id || "",
    college_name: edu.schoolCollegeEducations?.name || "",
    collegeId: edu.school_college_id || "",
    specialization: edu.educationSpecialization?.name || "",
    specializationId: edu.specialization_id || "",
    start_year: edu.start_year || "",
    end_year: edu.end_year || "",
    certificate: edu.education_certificate ? "uploaded" : null,
    certificateFile: null,
    certificateName: edu.education_certificate || "",
    bgColor: "bg-white",
  }));

  setEducationEntries(mappedEntries);
}
 else {
  // No education → one blank entry
  setEducationEntries([
    {
      id: Date.now(),
      course: "",
      courseId: "",
      college_name: "",
      collegeId: "",
      specialization: "",
      specializationId: "",
      start_year: "",
      end_year: "",
      certificate: null,
      certificateFile: null,
      certificateName: "",
      bgColor: "bg-white",
    },
  ]);
}
      } else {
        const errorMsg = result.error || "Failed to fetch user details.";
        console.error("API Error:", errorMsg);
        setError(errorMsg);

        // // Still initialize with blank entry
        // setEducationEntries([
        //   {
        //     id: Date.now(),
        //     course: "",
        //     courseId: "",
        //     college_name: "",
        //     collegeId: "",
        //     specialization: "",
        //     specializationId: "",
        //     start_year: "",
        //     end_year: "",
        //     certificate: null,
        //     certificateFile: null,
        //     certificateName: "",
        //     bgColor: "bg-white",
        //   },
        // ]);
      }
    } catch (err) {
      console.error("Caught Exception:", err);
      setError("Failed to fetch user details.");
      setEducationEntries([
        {
          id: Date.now(),
          course: "",
          courseId: "",
          college_name: "",
          collegeId: "",
          specialization: "",
          specializationId: "",
          start_year: "",
          end_year: "",
          certificate: null,
          certificateFile: null,
          certificateName: "",
          bgColor: "bg-white",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  fetchUserProfile();
}, [isAuthenticated, token, user?.id]);

  // Replace with the correct data from useMasterData
  const {
    courses,
    specializations,
    schoolColleges, // Changed from colleges to schoolColleges
    specializationByCourse,
    getSpecializationsForCourse,
    isLoading: isMasterDataLoading,
    error: masterDataError,
  } = useMasterData();

  // Update educationData state to use master data
  const [educationData, setEducationData] = useState({
    courses: [],
    specializations: [],
    colleges: [],
    jobRoles: [],
    locations: [],
  });

  const handleRemoveCourse = (id) => {
  // Prevent removing the default first course
  // if (id === educationEntries[0].id) {
  //   alert("You cannot remove the primary course.");
  //   return;
  // }
  

  // Confirm before deletion
  const confirmed = window.confirm(
    "Are you sure you want to remove this course? All data will be lost."
  );
  if (!confirmed) return;

  setEducationEntries((prevEntries) =>
    prevEntries.filter((entry) => entry.id !== id)
  );

  // Clean up dropdown states if needed
  setShowCollegeDropdown((prev) => {
    const newDropdown = { ...prev };
    delete newDropdown[id];
    return newDropdown;
  });

  setShowSpecializationDropdown((prev) => {
    const newDropdown = { ...prev };
    delete newDropdown[id];
    return newDropdown;
  });

  setCollegeSearchQuery((prev) => {
    const newQuery = { ...prev };
    delete newQuery[id];
    return newQuery;
  });

  setSpecializationSearchQuery((prev) => {
    const newQuery = { ...prev };
    delete newQuery[id];
    return newQuery;
  });

  setUploadProgress((prev) => {
    const newProgress = { ...prev };
    delete newProgress[id];
    return newProgress;
  });
};
  // Update the data fetching logic with proper mapping
  useEffect(() => {
    if (courses && specializationByCourse && schoolColleges) {
      setEducationData({
        courses: courses.map((course) => ({
          id: course.id,
          name: course.name || course.course_name,
          value: course.id,
          label: course.name || course.course_name,
        })),
        specializations:
          specializations?.map((spec) => ({
            id: spec.id,
            name: spec.name || spec.specialization_name,
            courseId: spec.course_id,
            courseName:
              courses.find((c) => c.id === spec.course_id)?.name ||
              "Unknown Course",
            value: spec.id,
            label: spec.name || spec.specialization_name,
          })) || [],
        colleges:
          schoolColleges?.map((college) => ({
            id: college.id,
            name: college.name || college.college_name,
            value: college.id,
            label: college.name || college.college_name,
          })) || [],
        jobRoles: [],
        locations: [],
      });
    }
  }, [courses, specializationByCourse, schoolColleges, specializations]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);





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

const currentYear = new Date().getFullYear();

const yearOptions = Array.from({ length: 38 }, (_, i) => {
  const year = currentYear - 30 + i; // Starts at (2025 - 30) = 1995 → goes to 1995 + 37 = 2032
  return {
    value: year.toString(),
    label: year
  };
});

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  const handleInputChange = (id, field, value) => {
  setEducationEntries((prev) =>
    prev.map((entry) =>
      entry.id === id ? { ...entry, [field]: value  } : entry
    )
  );
};


  const handleAddCourse = (course) => {
    // Prevent duplicate courses
    if (educationEntries.some((entry) => entry.courseId === course.id)) return;

    const newEntry = {
      id: Date.now(),
      course: course.name,
      courseId: course.id,
      college_name: "",
      collegeId: "",
      specialization: "",
      specializationId: "",
      start_year: "",
      end_year: "",
      certificate: null,
      certificateFile: null,
      certificateName: "",
      bgColor: "bg-white",
    };

    setEducationEntries((entries) => [
      entries[0],
      newEntry,
      ...entries.slice(1),
    ]);

    setSearchQuery("");
    setShowCourseDropdown(false);
  };

  const handleSpecializationSelect = (id, specialization) => {
    setEducationEntries((entries) =>
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              specialization: specialization.name || specialization,
              specializationId: specialization.id || "",
            }
          : entry
      )
    );
    setShowSpecializationDropdown((prev) => ({ ...prev, [id]: false }));
  };

  
  const handleSaveChanges = async () => {
  // --- LINE 1: Authentication check ---
  if (!isAuthenticated || !token) {
    setError("User not authenticated. Please login to continue.");
    return;
  }

  // --- LINE 2: Ensure user ID exists ---
  if (!user?.id) {
    setError("User ID not found.");
    return;
  }

  try {
    // --- LINE 3: Set loading state ---
    setIsLoading(true);

    // --- LINE 4: Map educationEntries to backend format ---
    const educations = educationEntries.map((entry) => ({
      course_id: entry.courseId,
      course: entry.course,
      specialization_id: entry.specializationId,
      specialization: entry.specialization,
      school_college_id: entry.collegeId,           // ← matches backend
      college_name: entry.college_name,
      start_year: entry.start_year,
      end_year: entry.end_year,
      education_certificate: entry.certificateName || null, // Optional: if you add file upload later
    }));

    
    const userData = {
      educations, // ← This is critical: backend looks for `educations` array
    };

    
    console.log("Saving educations:", userData);

    
    const result = await userDetailsApi.updateUserDetails(user.id, userData, token);

    console.log("Update response:", result);
    if (result.success || result.message) {
      alert("Education details saved successfully!");
      navigate("/feed-view");
    } else {
      throw new Error(result.message || "Failed to save");
    }
  } catch (error) {
    // --- LINE 9: Error handling ---
    console.error("Error saving education data:", error);
    const errorMsg = error.message || "Failed to save education data. Please try again.";
    setError(errorMsg);
    alert(errorMsg);
  } finally {
    // --- LINE 10: Reset loading ---
    setIsLoading(false);
  }
};

  const handleCollegeSelect = (id, college) => {
    setEducationEntries((entries) =>
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              college_name: college.name || college,
              collegeId: college.id || "",
            }
          : entry
      )
    );
    setShowCollegeDropdown((prev) => ({ ...prev, [id]: false }));
  };

  const handleCourseSelect = async (id, selectedCourse) => {
    try {
      setEducationEntries((entries) =>
        entries.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                course: selectedCourse.name || selectedCourse,
                courseId: selectedCourse.id || "",
                specialization: "",
                specializationId: "",
              }
            : entry
        )
      );

      // Use getSpecializationsForCourse to get course-specific specializations
      if (selectedCourse.id) {
        const courseSpecializations = getSpecializationsForCourse(
          selectedCourse.id
        );

        setEducationData((prev) => ({
          ...prev,
          specializations: courseSpecializations.map((spec) => ({
            id: spec.id,
            name: spec.name || spec.specialization_name,
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            value: spec.id,
            label: spec.name || spec.specialization_name,
          })),
        }));
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Update loading state to properly reflect data loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !isMasterDataLoading &&
      courses &&
      specializationByCourse &&
      schoolColleges
    ) {
      setIsLoading(false);
    }
    if (masterDataError) {
      setError(masterDataError);
    }
  }, [
    isMasterDataLoading,
    masterDataError,
    courses,
    specializationByCourse,
    schoolColleges,
  ]);

  // Add loading indicator
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-b-2 border-red-500 rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }




  // Handle file upload
  const handleFileUpload = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => ({ ...prev, [id]: progress }));
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(
            () => setUploadProgress((prev) => ({ ...prev, [id]: undefined })),
            1000
          );
        }
      }, 100);

      setEducationEntries((prev) =>
        prev.map((entry) =>
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
    };
    reader.readAsDataURL(file);
  };

  // Handle view certificate
  const handleViewCertificate = (entry) => {
    setSelectedCertificate(entry);
    setShowCertificateModal(true);
  };

  // Handle delete certificate
  const handleDeleteCertificate = (id) => {
    setEducationEntries((prev) =>
      prev.map((entry) =>
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
    setShowCertificateModal(false);
  };

  return (
    <MainLayout>
      <div className="flex items-start justify-center min-h-screen px-4 bg-gray-100 sm:px-6 lg:px-8">
        <div className="flex-grow hidden lg:block "></div>

        {/* Responsive Main Card */}
        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
          <div className="flex flex-col w-full bg-white rounded">
            {/* Header */}
            <div className="px-4 pt-4 mb-4 sm:mb-6 sm:px-6 sm:pt-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <button>
                  <IoIosArrowBack className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base"
                />
                <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                  <svg
                    className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5"
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
                  <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
                    {educationData.courses
                      .filter(
                        (course) =>
                          course.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) &&
                          !educationEntries.some(
                            (entry) => entry.courseId === course.id
                          )
                      )
                      .map((course, idx) => (
                        <div
                          key={course.id || idx}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                          onClick={() => handleAddCourse(course)}
                        >
                          {course.name}
                        </div>
                      ))}
                    {/* Show message if no results */}
                    {educationData.courses.filter(
                      (course) =>
                        course.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) &&
                        !educationEntries.some(
                          (entry) => entry.courseId === course.id
                        )
                    ).length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        No courses found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Education Entries */}
            <div className="px-4 pb-4 space-y-3 sm:space-y-4 sm:px-6 sm:pb-6">
              {educationEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`${entry.bgColor} border border-gray-200 rounded-lg flex flex-col items-stretch justify-center`}
                >
                  {/* Course Tag and Certificate Section */}
                  <div className="flex flex-col gap-2 px-3 pt-3 mb-3 sm:flex-row sm:items-center sm:justify-between sm:mb-4 sm:gap-3 sm:pt-4 sm:px-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="primary"
                        className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-blue-500 rounded-full sm:px-3 sm:gap-2 sm:text-sm"
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

                    <div className="flex items-center gap-1 text-xs text-gray-600 sm:gap-2 sm:text-sm">
                      {entry.certificate ? (
                        <button
                          onClick={() => handleViewCertificate(entry)}
                          className="flex items-center gap-1 transition-colors sm:gap-2 hover:text-blue-600"
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
                        <label className="flex items-center gap-1 transition-colors cursor-pointer sm:gap-2 hover:text-blue-600">
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
                      <div className="px-3 mb-2 sm:px-4">
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                            style={{ width: `${uploadProgress[entry.id]}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                          Uploading... {uploadProgress[entry.id]}%
                        </p>
                      </div>
                    )}

                  {/* Form Fields */}
                  <div
                    className="flex flex-col justify-between w-full p-2 rounded-lg opacity-100 sm:p-3"
                    style={{ gap: "4px" }}
                  >
                    <div className="flex flex-col gap-2 sm:gap-3">
                      {/* College Name Dropdown */}
                      <div className="relative" data-college-dropdown>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
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
                          className="w-full h-10 px-3 text-sm bg-transparent border border-gray-200 rounded-lg opacity-100 sm:h-12 sm:px-4 sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showCollegeDropdown[entry.id] && (
                          <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
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
                            {educationData.colleges
                              .filter((college) => {
                                const searchTerm =
                                  collegeSearchQuery[entry.id] || "";
                                return college.name
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase());
                              })
                              .map((college, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                  onClick={() =>
                                    handleCollegeSelect(entry.id, college)
                                  }
                                >
                                  {college.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Specialization Dropdown */}
                      <div className="relative" data-specialization-dropdown>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
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
                          className="w-full h-10 px-3 text-sm bg-transparent border border-gray-200 rounded-lg opacity-100 sm:h-12 sm:px-4 sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showSpecializationDropdown[entry.id] && (
                          <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
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
                            {educationData.specializations
                              .filter(
                                (spec) =>
                                  spec.courseId === entry.courseId &&
                                  spec.name
                                    ?.toLowerCase()
                                    .includes(
                                      (
                                        specializationSearchQuery[entry.id] ||
                                        ""
                                      ).toLowerCase()
                                    )
                              )
                              .map((spec, index) => (
                                <div
                                  key={spec.id || index}
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                  onClick={() =>
                                    handleSpecializationSelect(entry.id, spec)
                                  }
                                >
                                  {spec.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Start year
                        </label>
                        <div className="">
                          {/* <Select
                            placeholder="Choose year"
                            options={yearOptions}
                            value={yearOptions.find(opt => opt.value === entry.start_year)}
                            onChange={(opt) =>{
                              console.log("Selected start year:", opt?.value);
                               handleInputChange(entry.id, "start_year", opt?.value)}}
                          /> */}

                          <Select
                            placeholder="Choose year"
                            options={yearOptions}
                            value={entry.start_year || ""}
                            onChange={(e) => {
                              handleInputChange(entry.id, "start_year", e.target.value.toString());
                            }}
                          />
                          

                          <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"f
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          End year
                        </label>
                        <div className="">
                          <Select
                            placeholder="Choose year"
                            options={yearOptions}
                            value={entry.end_year || ""}
                            onChange={(e) => {
                              handleInputChange(entry.id, "end_year", e.target.value.toString());
                            }}
                          />

                          <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
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
            <div className="flex justify-center px-4 pb-4 mt-4 sm:mt-6 lg:mt-8 sm:px-6 sm:pb-6">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.course}
                    </p>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Certificate Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.certificateName}
                    </p>
                  </div>

                  {selectedCertificate.certificateFile && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
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
                      className="flex-1 px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCertificate(selectedCertificate.id)
                      }
                      className="flex-1 px-4 py-2 text-sm text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="pt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default FeedYourEducation;



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Input, Select, Button, Badge } from "../../../components/ui";
// import MainLayout from "../../../components/layout/MainLayout";
// import FeedRightSide1 from "../feed/FeedRightSide1";
// import { IoIosArrowBack } from "react-icons/io";
// import { useMasterData } from "../../../hooks/master/useMasterData"; // Add this import
// import { userDetailsApi } from "../../../api/userDetailsApi";

// const FeedYourEducation = () => {
//   const navigate = useNavigate();


//   const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);
// const [profile, setProfile] = useState(null);
// const { user, token, isAuthenticated } = useSelector((state) => state.auth);

// useEffect(() => {
//   async function fetchUserProfile() {
//     if (!isAuthenticated || !token || !user?.id) {
//       console.warn("User not authenticated or missing user ID");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       console.log("Fetching user details for ID:", user.id);
//       const result = await userDetailsApi.getUserDetails(user.id);

//       console.log("API Response:", result); // 🔴 Critical: Check this in browser console

//       if (result.success) {
//         const fetchedProfile = result.data.publicProfile;
//         console.log("Fetched Public Profile:", fetchedProfile);

//         // Log education specifically
//         console.log("Education Data:", fetchedProfile?.educations);

//         setProfile(fetchedProfile);
//       } else {
//         const errorMsg = result.error || "Failed to fetch user details.";
//         console.error("API Error:", errorMsg);
//         setError(errorMsg);
//         setProfile(null);
//       }
//     } catch (err) {
//       console.error("Caught Exception:", err);
//       setError("Failed to fetch user details due to network or server error.");
//       setProfile(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchUserProfile();
// }, [token, user?.id, isAuthenticated]);

//   return (
//     <div>
// <div className="fixed bottom-0 right-0 z-50 p-4 overflow-y-auto text-xs bg-white border rounded shadow-lg w-96 max-h-96">
//   <h3 className="font-bold">🔧 Debug: Fetched Profile Data</h3>
//   {loading && <p>Loading...</p>}
//   {error && <p className="text-red-500">Error: {error}</p>}
//   {profile && (
//     <pre className="mt-2 overflow-auto text-xs">
//       {JSON.stringify(profile, null, 2)}
//     </pre>
//   )}
// </div>
// </div>
//   );
// };

// export default FeedYourEducation;





