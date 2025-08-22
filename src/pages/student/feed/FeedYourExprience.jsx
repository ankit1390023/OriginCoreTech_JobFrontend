import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Badge } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightProfile from "../feed/FeedRightProfile";
import { IoIosArrowBack } from "react-icons/io";

const FeedYourExprience = () => {
  const navigate = useNavigate();
  // Dummy data for companies and roles
  const dummyCompanies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Netflix",
    "Uber",
    "Airbnb",
    "Spotify",
    "Twitter",
    "LinkedIn",
    "Salesforce",
    "Adobe",
    "Oracle",
    "IBM",
    "Intel",
    "Cisco",
    "Dell",
    "HP",
    "Samsung",
  ];

  const dummyRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "DevOps Engineer",
    "QA Engineer",
    "System Administrator",
    "Network Engineer",
    "Database Administrator",
    "Business Analyst",
    "Project Manager",
    "Marketing Manager",
    "Sales Representative",
    "Customer Success Manager",
    "Content Writer",
    "Digital Marketing Specialist",
    "Human Resources Manager",
  ];

  const [experienceEntries, setExperienceEntries] = useState([
    {
      id: 1,
      company: "Company Name",
      role: "Digital Marketing",
      start_year: "",
      end_year: "",
      ctc: "",
      certificate: null,
      certificateFile: null,
      certificateName: "",
      bgColor: "bg-white",
    },
    {
      id: 2,
      company: "Company Name",
      role: "Digital Marketing",
      start_year: "",
      end_year: "",
      ctc: "",
      certificate: "uploaded",
      certificateFile: null,
      certificateName: "experience_certificate.pdf",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      company: "Company Name",
      role: "Digital Marketing",
      start_year: "",
      end_year: "",
      ctc: "",
      certificate: "uploaded",
      certificateFile: null,
      certificateName: "advanced_experience_cert.pdf",
      bgColor: "bg-green-50",
    },
    {
      id: 4,
      company: "Company Name",
      role: "Digital Marketing",
      start_year: "",
      end_year: "",
      ctc: "",
      certificate: "uploaded",
      certificateFile: null,
      certificateName: "senior_experience_cert.pdf",
      bgColor: "bg-red-50",
    },
  ]);

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
    const newId =
      Math.max(...experienceEntries.map((entry) => entry.id), 0) + 1;
    const bgColors = [
      "bg-white",
      "bg-orange-50",
      "bg-green-50",
      "bg-red-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-yellow-50",
    ];
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newExperience = {
      id: newId,
      company: "Company Name",
      role: "Digital Marketing",
      start_year: "",
      end_year: "",
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
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving experience data:", experienceEntries);
    // Add your save logic here
    // Navigate back to feed view after saving
    navigate("/feed-view");
  };

  const handleGoBack = () => {
    navigate("/feed-view");
  };

  const filteredCompanies = (query, id) => {
    const searchTerm = companySearchQuery[id] || "";
    return dummyCompanies.filter((company) =>
      company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredMainCompanies = () => {
    return dummyCompanies.filter((company) =>
      company.toLowerCase().includes(mainCompanySearchQuery.toLowerCase())
    );
  };

  const filteredRoles = (query, id) => {
    const searchTerm = roleSearchQuery[id] || "";
    return dummyRoles.filter((role) =>
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCompanySelect = (id, company) => {
    handleInputChange(id, "company", company);
    setShowCompanyDropdown((prev) => ({ ...prev, [id]: false }));
    setCompanySearchQuery((prev) => ({ ...prev, [id]: "" }));
  };

  const handleMainCompanySelect = (company) => {
    setSearchQuery(company);
    setShowMainCompanyDropdown(false);
    setMainCompanySearchQuery("");
  };

  const handleRoleSelect = (id, role) => {
    handleInputChange(id, "role", role);
    setShowRoleDropdown((prev) => ({ ...prev, [id]: false }));
    setRoleSearchQuery((prev) => ({ ...prev, [id]: "" }));
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

  return (
    <MainLayout>
      <div className="flex justify-center items-start bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:block flex-grow "></div>

        {/* Responsive Main Card */}
        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
          <div className="bg-white rounded   w-full flex flex-col">
            {/* Header */}
            <div className="mb-4 sm:mb-6 px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoIosArrowBack className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
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

                {/* Main Company Dropdown */}
                {showMainCompanyDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleMainCompanySelect(company)}
                      >
                        {company}
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
            <div className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              {experienceEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`${entry.bgColor} border-2 border-blue-200 rounded-lg p-4 sm:p-6`}
                >
                  {/* Company Badge and Certificate Section */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="primary"
                      className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {entry.company}
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
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          View/Edit Certificate
                        </button>
                      ) : (
                        <label className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
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
                        {/* Only show remove button for cards that are not the original 4 default cards */}
                        {entry.id > 4 && (
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
                  <div className="space-y-4">
                    {/* Job Role/Profile */}
                    <div className="relative" data-role-dropdown>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Role/Profile
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Digital Marketing"
                          value={entry.role}
                          onChange={(e) =>
                            handleInputChange(entry.id, "role", e.target.value)
                          }
                          onFocus={() =>
                            setShowRoleDropdown((prev) => ({
                              ...prev,
                              [entry.id]: true,
                            }))
                          }
                          className="w-full h-12 rounded-lg px-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <button
                          onClick={() =>
                            handleInputChange(entry.id, "role", "")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                          {filteredRoles("", entry.id).map((role, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => handleRoleSelect(entry.id, role)}
                            >
                              {role}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Year Selection */}
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

                    {/* CTC */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-6 lg:mt-8 px-4 sm:px-6 pb-4 sm:pb-6">
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
                      Company
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.company}
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
          <FeedRightProfile />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FeedYourExprience;
