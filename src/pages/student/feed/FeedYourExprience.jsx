import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Select, Button, Badge } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightSide1 from "../feed/FeedRightSide1";
import { IoIosArrowBack } from "react-icons/io";
import { useMasterData } from "../../../hooks/master/useMasterData";
import { userDetailsApi } from "../../../api/userDetailsApi";

const FeedYourExperience = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch master data
  const {
    companies: allCompanies,
    jobRoles: allJobRoles,
    isLoading: isMasterDataLoading,
    error: masterDataError,
  } = useMasterData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const [experienceEntries, setExperienceEntries] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState({});
  const [showRoleDropdown, setShowRoleDropdown] = useState({});
  const [companySearchQuery, setCompanySearchQuery] = useState({});
  const [roleSearchQuery, setRoleSearchQuery] = useState({});
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showMainCompanyDropdown, setShowMainCompanyDropdown] = useState(false);
  const [mainCompanySearchQuery, setMainCompanySearchQuery] = useState("");

  // Field mapping configuration
  const fieldMapping = {
    company_id: "company_id",
    company_name: "company.name",
    role_id: "job_role_id",
    role_name: "job_role.title",
    start_year: "start_date",
    end_year: "end_date",
    certificate: "experienceCertificate",
  };

  // Utility function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Fetch user profile and initialize experience entries
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !token || !user?.id) {
        console.warn("User not authenticated or missing user ID");
        setLoading(false);
        initializeEmptyExperience();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching user details for ID:", user.id);
        const result = await userDetailsApi.getUserDetails(user.id);

        if (result.success) {
          const fetchedProfile = result.data.userDetail;
          setProfile(fetchedProfile);

          const experiences = fetchedProfile?.experiences || [];

          if (experiences.length > 0) {
            // Map ALL experience entries and sort by start date (newest first)
            const mappedEntries = experiences.map((exp, index) => {
              const bgColors = [
                "bg-white",
                "bg-orange-50",
                "bg-green-50",
                "bg-red-50",
                "bg-blue-50",
                "bg-purple-50",
                "bg-yellow-50",
              ];
              const bgColor = bgColors[index % bgColors.length];

              return {
                id: exp.id || Date.now() + index,
                company_id: exp[fieldMapping.company_id] || null,
                company_name: getNestedValue(exp, fieldMapping.company_name) || "",
                role_id: exp[fieldMapping.role_id] || null,
                role_name: getNestedValue(exp, fieldMapping.role_name) || "",
                start_year: exp[fieldMapping.start_year] 
                  ? new Date(exp[fieldMapping.start_year]).getFullYear().toString() 
                  : "",
                end_year: exp[fieldMapping.end_year] 
                  ? new Date(exp[fieldMapping.end_year]).getFullYear().toString() 
                  : "",
                is_present: !exp[fieldMapping.end_year], // If no end date, mark as present
                ctc: exp.ctc || "",
                certificate: exp[fieldMapping.certificate] ? "uploaded" : null,
                certificateFile: null,
                certificateName: exp[fieldMapping.certificate] || "",
                bgColor: bgColor,
              };
            }).sort((a, b) => {
              // Sort by start year descending (newest first)
              return parseInt(b.start_year) - parseInt(a.start_year);
            });

            setExperienceEntries(mappedEntries);
          } else {
            initializeEmptyExperience();
          }
        } else {
          const errorMsg = result.error || "Failed to fetch user details.";
          console.error("API Error:", errorMsg);
          setError(errorMsg);
          initializeEmptyExperience();
        }
      } catch (err) {
        console.error("Caught Exception:", err);
        setError("Failed to fetch user details.");
        initializeEmptyExperience();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, token, user?.id]);

  const initializeEmptyExperience = () => {
    setExperienceEntries([
      {
        id: Date.now(),
        company_id: null,
        company_name: "",
        role_id: null,
        role_name: "",
        start_year: "",
        end_year: "",
        is_present: false,
        ctc: "",
        certificate: null,
        certificateFile: null,
        certificateName: "",
        bgColor: "bg-white",
      },
    ]);
  };

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const companyDropdowns = document.querySelectorAll(
        "[data-company-dropdown]"
      );
      const roleDropdowns = document.querySelectorAll("[data-role-dropdown]");
      const mainCompanyDropdown = document.querySelector(
        "[data-main-company-dropdown]"
      );

      let clickedInsideCompany = false;
      let clickedInsideRole = false;
      let clickedInsideMainCompany = false;

      companyDropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) {
          clickedInsideCompany = true;
        }
      });

      roleDropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) {
          clickedInsideRole = true;
        }
      });

      if (mainCompanyDropdown && mainCompanyDropdown.contains(event.target)) {
        clickedInsideMainCompany = true;
      }

      if (!clickedInsideCompany) {
        setShowCompanyDropdown({});
      }

      if (!clickedInsideRole) {
        setShowRoleDropdown({});
      }

      if (!clickedInsideMainCompany) {
        setShowMainCompanyDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleRemoveExperience = (id) => {
    setExperienceEntries((entries) =>
      entries.filter((entry) => entry.id !== id)
    );
  };

  const handleAddExperience = () => {
    const newId = Date.now();
    const bgColors = [
      "bg-white",
      "bg-orange-50",
      "bg-green-50",
      "bg-red-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-yellow-50",
    ];
    const randomBgColor = bgColors[experienceEntries.length % bgColors.length];

    const newExperience = {
      id: newId,
      company_id: null,
      company_name: "",
      role_id: null,
      role_name: "",
      start_year: "",
      end_year: "",
      is_present: false,
      ctc: "",
      certificate: null,
      certificateFile: null,
      certificateName: "",
      bgColor: randomBgColor,
    };

    setExperienceEntries((entries) => [...entries, newExperience]);
  };

  const handleInputChange = (id, field, value) => {
    setExperienceEntries((entries) =>
      entries.map((entry) => {
        if (entry.id === id) {
          // If changing start year, ensure end year is not before start year
          if (field === "start_year") {
            if (entry.end_year && parseInt(value) > parseInt(entry.end_year)) {
              return { ...entry, [field]: value, end_year: "" };
            }
          }
          // If changing end year, ensure it's not before start year
          if (field === "end_year") {
            if (entry.start_year && parseInt(value) < parseInt(entry.start_year)) {
              return entry; // Don't update if invalid
            }
          }
          return { ...entry, [field]: value };
        }
        return entry;
      })
    );
  };

  const handlePresentToggle = (id) => {
    setExperienceEntries((entries) =>
      entries.map((entry) => {
        if (entry.id === id) {
          if (entry.is_present) {
            // If currently present, uncheck it
            return { ...entry, is_present: false };
          } else {
            // If not present, check it and clear end year
            return { ...entry, is_present: true, end_year: "" };
          }
        }
        return entry;
      })
    );
  };

  // New function to handle company selection with ID
  const handleCompanySelect = (id, company) => {
    handleInputChange(id, "company_id", company.id);
    handleInputChange(id, "company_name", company.company_name || "");
    setShowCompanyDropdown((prev) => ({ ...prev, [id]: false }));
    setCompanySearchQuery((prev) => ({ ...prev, [id]: "" }));
  };

  // New function to handle role selection with ID
  const handleRoleSelect = (id, role) => {
    handleInputChange(id, "role_id", role.id);
    handleInputChange(id, "role_name", role.title || "");
    setShowRoleDropdown((prev) => ({ ...prev, [id]: false }));
    setRoleSearchQuery((prev) => ({ ...prev, [id]: "" }));
  };

  const handleMainCompanySelect = (company) => {
    setSearchQuery(company.company_name || "");
    setShowMainCompanyDropdown(false);
    setMainCompanySearchQuery("");
    
    // Add new experience entry with selected company
    const newId = Date.now();
    const bgColors = [
      "bg-white",
      "bg-orange-50",
      "bg-green-50",
      "bg-red-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-yellow-50",
    ];
    const randomBgColor = bgColors[experienceEntries.length % bgColors.length];

    const newExperience = {
      id: newId,
      company_id: company.id,
      company_name: company.company_name || "",
      role_id: null,
      role_name: "",
      start_year: "",
      end_year: "",
      is_present: false,
      ctc: "",
      certificate: null,
      certificateFile: null,
      certificateName: "",
      bgColor: randomBgColor,
    };

    setExperienceEntries((entries) => [...entries, newExperience]);
  };

  const handleSaveChanges = async () => {
  console.log("Saving experience ", experienceEntries);
  
  // Format experiences for backend
  const formattedExperiences = experienceEntries.map(entry => ({
    id: entry.id > 1000000000000 ? null : entry.id,
    company_id: entry.company_id,
    job_role_id: entry.role_id,
    start_date: entry.start_year ? `${entry.start_year}-01-01` : null,
    end_date: entry.is_present ? null : (entry.end_year ? `${entry.end_year}-12-31` : null),
    status: "approved",
    experienceCertificate: entry.certificateName || null,
  }));

  // Send only the experiences array
  const requestData = {
    experiences: formattedExperiences
  };

  try {
    // Call your API to save experiences
    // Example:
    const response = await userDetailsApi.updateUserDetails(user.id, requestData,token);
    console.log("save response from api", response)
    if (
      response.success ||
      response.message == "User details updated successfully."
    ) {
      alert("Experience details saved successfully!");
      navigate("/feed-view");
    } else {
      throw new Error(response.message || "Failed to save");
    }
  } catch (err) {
    console.error("Save error:", err);
    setError("Failed to save experiences");
  }
};

  const handleGoBack = () => {
    navigate("/feed-view");
  };

  // Filter companies based on search query - with null checks
  const filteredCompanies = (id) => {
    if (!allCompanies || !Array.isArray(allCompanies)) return [];
    
    const searchTerm = companySearchQuery[id] || "";
    return allCompanies.filter((company) =>
      company.company_name && 
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter main company search - with null checks
  const filteredMainCompanies = () => {
    if (!allCompanies || !Array.isArray(allCompanies)) return [];
    
    return allCompanies.filter((company) =>
      company.company_name && 
      company.company_name.toLowerCase().includes(mainCompanySearchQuery.toLowerCase())
    );
  };

  // Filter job roles based on search query - with null checks
  const filteredRoles = (id) => {
    if (!allJobRoles || !Array.isArray(allJobRoles)) return [];
    
    const searchTerm = roleSearchQuery[id] || "";
    return allJobRoles.filter((role) =>
      role.title && 
      role.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            // Update experience entry with certificate info
            setExperienceEntries((entries) =>
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
    setExperienceEntries((entries) =>
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </MainLayout>
    );
  }

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
                <button
                  onClick={handleGoBack}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100"
                >
                  <IoIosArrowBack className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
                  Your Experience
                </h1>
              </div>
              {/* Search Bar */}
              <div className="relative mb-4 sm:mb-6" data-main-company-dropdown>
                <input
                  type="text"
                  placeholder="Select your company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowMainCompanyDropdown(true)}
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

                {/* Main Company Dropdown */}
                {showMainCompanyDropdown && (
                  <div className="absolute z-20 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={mainCompanySearchQuery}
                      onChange={(e) =>
                        setMainCompanySearchQuery(e.target.value)
                      }
                      className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    {filteredMainCompanies().map((company, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => handleMainCompanySelect(company)}
                      >
                        {company.company_name || "Unnamed Company"}
                      </div>
                    ))}
                    {filteredMainCompanies().length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No companies found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Experience Entries */}
            <div className="px-4 pb-4 space-y-4 sm:px-6 sm:pb-6">
              {experienceEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`${entry.bgColor} border-2 border-blue-200 rounded-lg p-4 sm:p-6`}
                >
                  {/* Company Badge and Certificate Section */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="primary"
                      className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-500 rounded-full"
                    >
                      {entry.company_name || "Company Name"}
                      <button
                        onClick={() => handleRemoveExperience(entry.id)}
                        className="hover:bg-blue-600 rounded-full p-0.5"
                      >
                        <svg
                          className="w-3 h-3"
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
                    </Badge>

                    <div className="flex flex-col items-end gap-2">
                      {entry.certificate ? (
                        <button
                          onClick={() => handleViewCertificate(entry)}
                          className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                        >
                          View/Edit Certificate
                        </button>
                      ) : (
                        <label className="text-sm text-gray-600 transition-colors cursor-pointer hover:text-blue-600">
                          Upload Certificate
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(entry.id, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddExperience}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {/* Only show remove button for cards that are not the original entry */}
                        {experienceEntries.length > 1 && (
                          <button
                            onClick={() => handleRemoveExperience(entry.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  {uploadProgress[entry.id] !== undefined &&
                    uploadProgress[entry.id] < 100 && (
                      <div className="mb-4">
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
                  <div className="space-y-4">
                    {/* Company Selection */}
                    <div className="relative" data-company-dropdown>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Select company"
                          value={entry.company_name}
                          onChange={(e) => {
                            handleInputChange(
                              entry.id,
                              "company_name",
                              e.target.value
                            );
                            setShowCompanyDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }));
                          }}
                          onFocus={() =>
                            setShowCompanyDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }))
                          }
                          className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            handleInputChange(entry.id, "company_id", null);
                            handleInputChange(entry.id, "company_name", "");
                          }}
                          className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
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
                      </div>
                      {showCompanyDropdown[entry.id] && (
                        <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
                          <input
                            type="text"
                            placeholder="Search companies..."
                            value={companySearchQuery[entry.id] || ""}
                            onChange={(e) =>
                              setCompanySearchQuery((prev) => ({
                                ...prev,
                                [entry.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          {isMasterDataLoading ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Loading companies...
                            </div>
                          ) : masterDataError ? (
                            <div className="px-3 py-2 text-sm text-red-500">
                              {masterDataError}
                            </div>
                          ) : filteredCompanies(entry.id).length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No companies found
                            </div>
                          ) : (
                            filteredCompanies(entry.id).map((company) => (
                              <div
                                key={company.id}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleCompanySelect(entry.id, company)
                                }
                              >
                                {company.company_name || "Unnamed Company"}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Job Role/Profile */}
                    <div className="relative" data-role-dropdown>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Job Role/Profile
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Select job role"
                          value={entry.role_name}
                          onChange={(e) => {
                            handleInputChange(
                              entry.id,
                              "role_name",
                              e.target.value
                            );
                            setShowRoleDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }));
                          }}
                          onFocus={() =>
                            setShowRoleDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }))
                          }
                          className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            handleInputChange(entry.id, "role_id", null);
                            handleInputChange(entry.id, "role_name", "");
                          }}
                          className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
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
                      </div>
                      {showRoleDropdown[entry.id] && (
                        <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
                          <input
                            type="text"
                            placeholder="Search roles..."
                            value={roleSearchQuery[entry.id] || ""}
                            onChange={(e) =>
                              setRoleSearchQuery((prev) => ({
                                ...prev,
                                [entry.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          {isMasterDataLoading ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Loading roles...
                            </div>
                          ) : masterDataError ? (
                            <div className="px-3 py-2 text-sm text-red-500">
                              {masterDataError}
                            </div>
                          ) : filteredRoles(entry.id).length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No roles found
                            </div>
                          ) : (
                            filteredRoles(entry.id).map((role) => (
                              <div
                                key={role.id}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleRoleSelect(entry.id, role)
                                }
                              >
                                {role.title || "Unnamed Role"}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Year Selection */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Start year
                        </label>
                        <div className="relative">
                          <select
                            value={entry.start_year}
                            onChange={(e) =>
                              handleInputChange(
                                entry.id,
                                "start_year",
                                e.target.value
                              )
                            }
                            className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Choose year</option>
                            {yearOptions.map((year) => (
                              <option key={year.value} value={year.value}>
                                {year.label}
                              </option>
                            ))}
                          </select>
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
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          End year
                        </label>
                        <div className="relative">
                          <select
                            value={entry.end_year}
                            onChange={(e) =>
                              handleInputChange(
                                entry.id,
                                "end_year",
                                e.target.value
                              )
                            }
                            disabled={entry.is_present}
                            className={`w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                              entry.is_present ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <option value="">Choose year</option>
                            {yearOptions
                              .filter(year => 
                                !entry.start_year || parseInt(year.value) >= parseInt(entry.start_year)
                              )
                              .map((year) => (
                                <option key={year.value} value={year.value}>
                                  {year.label}
                                </option>
                              ))}
                          </select>
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

                    {/* Present Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`present-${entry.id}`}
                        checked={entry.is_present}
                        onChange={() => handlePresentToggle(entry.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`present-${entry.id}`}
                        className="block ml-2 text-sm font-medium text-gray-700"
                      >
                        I currently work here
                      </label>
                    </div>

                    {/* CTC */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        CTC
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Eg. 4,00,000"
                          value={entry.ctc}
                          onChange={(e) =>
                            handleInputChange(entry.id, "ctc", e.target.value)
                          }
                          className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-center px-4 pb-4 mt-6 lg:mt-8 sm:px-6 sm:pb-6">
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
                      Company
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.company_name}
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

export default FeedYourExperience;