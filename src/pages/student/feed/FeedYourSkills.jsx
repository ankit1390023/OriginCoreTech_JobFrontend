import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Badge } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightSide1 from "../feed/FeedRightSide1";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineEye } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { useMasterData } from "../../../hooks/master/useMasterData";
import { useSelector } from "react-redux";
import useUploadImageApi from "../../../hooks/useUploadImageApi";
import { userDetailsApi } from "../../../api/userDetailsApi";
import { z } from "zod";


// validation schema for feed your skills component
const skillsValidationSchema = z.array(z.object({
  domainName: z.string().min(1, "Domain name is required"),
  subSkills: z.array(z.object({
    skill_name: z.string().min(1, "Skill name is required")
  })).min(1, "At least one skill must be selected"),
  authority_id: z.string().min(1, "Learning Source is required")
})).min(1, "At least one domain with skills is required");


const FeedYourSkills = () => {
  const navigate = useNavigate();
  const [domainSearchQuery, setDomainSearchQuery] = useState("");
  const [showMoreSkills, setShowMoreSkills] = useState({});
  const [saving, setSaving] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // State for skills management
  const [skills, setSkills] = useState([]);

  // Get the required methods from useMasterData hook
  const {
    domains: allDomains,
    getSkillsForDomain,
    isLoading: isMasterDataLoading,
    companies,
    error: masterDataError,
  } = useMasterData();

  const { uploadImage } = useUploadImageApi();
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch user profile and initialize skills
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        const result = await userDetailsApi.getUserDetails(user.id);
        console.log("Profile ", result);
        if (result.success) {
          initializeSkillsFromProfile(result.data.skills);
        } else {
          initializeSkillsFromProfile([]);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        initializeSkillsFromProfile([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, token]);

  // Initialize skills from API response - ENHANCED VERSION
const initializeSkillsFromProfile = (fetchedSkills = []) => {
  console.log("Initializing skills from profile:", fetchedSkills);
  
  const initializedSkills = (fetchedSkills || []).map((skillDomain, index) => {
    // Find domain object by name to get the domain ID
    const domainObj = allDomains?.find(d => 
      (d.domain_name || d.name) === skillDomain.domain
    );
    
    const domainId = domainObj?.domain_id || domainObj?.id || null;
    
    // Get authority from the new format
    const authorityId = skillDomain.authority_ids?.[0] || null; // Use authority_ids array
    const authorityName = skillDomain.authority?.[0]?.name || ""; // Get name from authority object
    
    return {
      id: Date.now() + index,
      domainId: domainId,
      domainName: skillDomain.domain,
      subSkills: (skillDomain.subSkills || []).map(subSkillName => ({
        skill_name: subSkillName
      })),
      authority_id: authorityId, // Store single ID
      authorityName: authorityName, // Store the name for display
      certificateImages: skillDomain.certificate_image || [],
      borderColor: ["border-gray-200", "border-orange-300", "border-green-300", "border-red-300"][index % 4],
      bgColor: ["bg-white", "bg-orange-50", "bg-green-50", "bg-red-50"][index % 4],
    };
  });

  setSkills(initializedSkills);
};

  // Get main domain skills for search
  const getMainDomainSkills = () => {
    if (!allDomains || !Array.isArray(allDomains)) return [];
    return allDomains;
  };

  // Filter domains for search
  const filteredDomains = () => {
    if (!domainSearchQuery.trim()) return [];
    
    const allDomainSkills = getMainDomainSkills();
    return allDomainSkills.filter(domainObj => {
      const domainName = domainObj.domain_name || domainObj.name || "";
      const isAlreadySelected = skills.some(skill => skill.domainName === domainName);
      const matchesSearch = domainName.toLowerCase().includes(domainSearchQuery.toLowerCase());
      return matchesSearch && !isAlreadySelected;
    });
  };

  // Handle selecting a domain from dropdown - THIS IS THE CORRECT FUNCTION NAME
  // Handle selecting a domain from dropdown
const handleSkillSelect = (domainObj) => {
  console.log("=== SELECTING DOMAIN ===");
  console.log("Selected domain object:", domainObj);
  
  const domainId = domainObj.domain_id || domainObj.id;
  const domainName = domainObj.domain_name || domainObj.name;
  
  console.log("Domain ID:", domainId);
  console.log("Domain Name:", domainName);
  
  // Check if domain already exists
  const isAlreadyAdded = skills.some(skill => skill.domainName === domainName);
  console.log("Is already added:", isAlreadyAdded);
  
  if (isAlreadyAdded) {
    console.log("Domain already exists, not adding");
    setDomainSearchQuery("");
    return;
  }
  
  // Get skills for this domain using master data function
  const domainSkills = getSkillsForDomain(domainId) || [];
  console.log("Domain skills found:", domainSkills);
  
  const newSkill = {
    id: Date.now() + Math.random(),
    domainId: domainId,
    domainName: domainName,
    subSkills: [], // Start with empty sub-skills
    authority: "",
    certificateImages: [],
    borderColor: "border-gray-200",
    bgColor: "bg-white",
  };

  console.log("Adding new skill:", newSkill);
  setSkills(prev => [...prev, newSkill]);
  setDomainSearchQuery("");
  console.log("Domain search query cleared");
};

  // Handle removing a skill
  const handleRemoveSkill = (skillId) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  // Handle sub-skill selection
  const handleSubSkillToggle = (skillId, skillObj) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        const subSkills = [...skill.subSkills];
        const existingIndex = subSkills.findIndex(s => 
          s.skill_name === skillObj.skill_name
        );
        
        if (existingIndex > -1) {
          // Remove sub-skill
          subSkills.splice(existingIndex, 1);
        } else {
          // Add sub-skill
          subSkills.push(skillObj);
        }
        
        return { ...skill, subSkills };
      }
      return skill;
    }));
  };

  // Handle authority change
  const handleAuthorityChange = (skillId, authority) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, authority } : skill
    ));
  };

  // Handle certificate upload
  const handleCertificateUpload = async (skillId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Upload certificate file
      const uploadedUrl = await uploadImage(file, 'certificate', token);
      
      if (uploadedUrl) {
        setSkills(prev => prev.map(skill => {
          if (skill.id === skillId) {
            return { 
              ...skill, 
              certificateImages: [...skill.certificateImages, uploadedUrl] 
            };
          }
          return skill;
        }));
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert("Failed to upload certificate. Please try again.");
    }
  };

  // Handle removing certificate
  const handleRemoveCertificate = (skillId, certIndex) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        const certificateImages = [...skill.certificateImages];
        certificateImages.splice(certIndex, 1);
        return { ...skill, certificateImages };
      }
      return skill;
    }));
  };

  // View certificate
  const handleViewCertificate = (certificateUrl) => {
    if (certificateUrl) {
      setSelectedCertificate({
        name: "Certificate",
        url: certificateUrl,
        type: certificateUrl.includes('.pdf') ? 'pdf' : 'image'
      });
      setShowCertificateModal(true);
    }
  };

  
  // Get related skills for a domain - ENHANCED VERSION
const getRelatedSkillsForDomain = (domainId, domainName = null) => {
  console.log("Getting skills for domain ID:", domainId, "Domain Name:", domainName);
  
  // If we have domainId, use it directly
  if (domainId) {
    const domainSkills = getSkillsForDomain(domainId);
    console.log("Domain skills returned (by ID):", domainSkills);
    return domainSkills || [];
  }
  
  // If no domainId but we have domainName, find the domain ID first
  if (domainName) {
    const domainObj = allDomains?.find(d => 
      (d.domain_name || d.name) === domainName
    );
    
    if (domainObj) {
      const foundDomainId = domainObj.domain_id || domainObj.id;
      const domainSkills = getSkillsForDomain(foundDomainId);
      console.log("Domain skills returned (by name lookup):", domainSkills);
      return domainSkills || [];
    }
  }
  
  console.log("No domain ID or name match found");
  return [];
};



  // Add this useEffect near your other useEffect hooks
  useEffect(() => {
    if (skills.length > 0 && companies && companies.length > 0) {
      // Update skills with authority names if they have authority_id but no authorityName
      setSkills(prevSkills => 
        prevSkills.map(skill => {
          if (skill.authority_id && !skill.authorityName) {
            const company = companies.find(c => c.id === parseInt(skill.authority_id));
            if (company) {
              return {
                ...skill,
                authorityName: company.company_name
              };
            }
          }
          return skill;
        })
      );
    }
  }, [companies, skills.length]);

  // Save changes to API - UPDATED TO INCLUDE ALL SKILLS
const handleSaveChanges = async () => {
  if (!user?.id || !token) {
    alert("User not authenticated");
    return;
  }

  // Validate skills before saving
  try {
    skillsValidationSchema.parse(skills);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      alert(firstError.message);
      return;
    }
  }

  setSaving(true);

  try {
    // Prepare skills payload in the correct format
    const skillsPayload = [];
    const certificateImages = [];

    skills.forEach((skill) => {
      // Process ALL sub-skills
      if (skill.subSkills && skill.subSkills.length > 0) {
        skill.subSkills.forEach((subSkill) => {
          // Find the full skill object to get skill_id
          const domainSkills = getSkillsForDomain(skill.domainId);
          const fullSkillObj = domainSkills?.find(
            (s) => s.skill_name === subSkill.skill_name
          );

          if (fullSkillObj) {
            skillsPayload.push({
              skill_id: fullSkillObj.skill_id,
              authority_id: skill.authority_id
                ? [parseInt(skill.authority_id)]
                : [], // Send as array
            });

            // Add certificate images
            if (skill.certificateImages && skill.certificateImages.length > 0) {
              certificateImages.push(...skill.certificateImages);
            } else {
              certificateImages.push("");
            }
          }
        });
      }
    });

    console.log(skills);

    // Ensure certificate_images array matches skills array length
    while (certificateImages.length < skillsPayload.length) {
      certificateImages.push("");
    }

    const payload = {
      skills: skillsPayload.length > 0 ? skillsPayload : [],
      certificate_images: certificateImages.length > 0 ? certificateImages : [],
    };

    console.log("Sending payload:", payload);

    const result = await userDetailsApi.updateUserDetails(
      user.id,
      payload,
      token
    );

    if (
      result.success ||
      result.message == "User details updated successfully."
    ) {
      alert("Skills updated successfully!");
      navigate("/feed-view");
    } else {
      throw new Error(result.message || "Failed to update skills");
    }
  } catch (error) {
    console.error("Error saving skills:", error);
    alert("Failed to save skills: " + (error.message || "Please try again"));
  } finally {
    setSaving(false);
  }
};

  const handleGoBack = () => {
    navigate("/feed-view");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <p>Loading skills...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block"></div>

        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <button
                onClick={handleGoBack}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <IoIosArrowBack className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
                Your Skills
              </h1>
            </div>
          </div>
          
          {/* Searchable Dropdown Input */}
          <div className="relative w-full max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[750px]">
            {isMasterDataLoading ? (
              <div className="px-3 py-4 text-center text-gray-500">
                <div className="w-6 h-6 mx-auto mb-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                Loading domains...
              </div>
            ) : masterDataError ? (
              <div className="px-3 py-2 text-sm text-red-600">
                Error loading domains: {masterDataError.message}
              </div>
            ) : (
              <div className="relative">
                {/* Input with dropdown inside */}
                <Input
                  type="text"
                  placeholder="Search domains..."
                  value={domainSearchQuery}
                  onChange={(e) => setDomainSearchQuery(e.target.value)}
                  className="w-full pr-8"
                />

                {/* Dropdown - Always show when there's search text */}
                {domainSearchQuery.trim() && (
                  <div className="absolute left-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                    <div className="overflow-y-auto max-h-60">
                      {filteredDomains().map((domainObj, index) => {
                        console.log("Rendering domain option:", domainObj);
                        return (
                          <div
                            key={domainObj.domain_id || domainObj.id || index}
                            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              console.log("Clicked on domain:", domainObj);
                              handleSkillSelect(domainObj);
                            }}
                          >
                            <span>{domainObj.domain_name || domainObj.name}</span>
                            <span className="text-xs text-gray-400">Click to add</span>
                          </div>
                        );
                      })}

                      {/* No results message */}
                      {filteredDomains().length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {domainSearchQuery
                            ? "No domains found matching your search."
                            : "Start typing to search domains..."}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills Sections */}
          <div className="space-y-4 sm:space-y-6">
            {skills.map((skill, index) => (
              <div key={skill.id}>
                <div className={`${skill.bgColor} border-2 ${skill.borderColor} rounded-lg p-4 sm:p-6`}>
                  {/* Skill Tag and Action Buttons */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="primary"
                      className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-500 rounded-full"
                    >
                      {skill.domainName}
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
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

                    <div className="flex space-x-1 items-right justyfy-between">
                      <label className="text-sm text-gray-600 transition-colors cursor-pointer hover:text-blue-600">
                        Upload Certificate
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleCertificateUpload(skill.id, e)}
                          className="hidden"
                        />
                      </label>
                      <IoIosInformationCircleOutline className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Certificate Display */}
                  {skill.certificateImages && skill.certificateImages.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-sm text-gray-700">Certificates:</p>
                      <div className="flex flex-wrap gap-2">
                        {skill.certificateImages.map((certUrl, certIndex) => (
                          <div key={certIndex} className="flex items-center p-2 rounded-lg bg-gray-50">
                            <span className="mr-2 text-sm text-gray-700">
                              Certificate {certIndex + 1}
                            </span>
                            <button
                              onClick={() => handleViewCertificate(certUrl)}
                              className="mr-2 text-green-700 hover:underline"
                            >
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveCertificate(skill.id, certIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <RxCross2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Selection */}
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-gray-700">
                      Select related skills for {skill.domainName}
                    </p>
                    {isMasterDataLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-6 h-6 mr-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500">
                          Loading related skills...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getRelatedSkillsForDomain(skill.domainId, skill.domainName)
                            .slice(0, showMoreSkills[skill.id] ? undefined : 6)
                            .map((skillObj, subIndex) => (
                              <button
                                key={skillObj.skill_id || skillObj.id || subIndex}
                                onClick={() => handleSubSkillToggle(skill.id, skillObj)}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                  skill.subSkills.some(s => 
                                    s.skill_name === skillObj.skill_name
                                  )
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }`}
                              >
                                {skillObj.skill_name || skillObj.name}
                              </button>
                            ))}
                        </div>
                        {getRelatedSkillsForDomain(skill.domainId, skill.domainName).length > 6 && (
                          <button
                            onClick={() => setShowMoreSkills(prev => ({
                              ...prev,
                              [skill.id]: !prev[skill.id]
                            }))}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {showMoreSkills[skill.id]
                              ? "Show less"
                              : `See more +${getRelatedSkillsForDomain(skill.domainId, skill.domainName).length - 6}`}
                          </button>
                        )}
                        {skill.subSkills.length > 0 && (
                          <p className="text-sm text-green-600">
                            Selected: {skill.subSkills.length} skill(s)
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  
  

                  {/* Replace the learning source input with searchable company dropdown */}
                  {/* Update the authority dropdown section */}
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-gray-700">
                      Where did you learn this skill?
                    </p>
                    <div className="relative">
                      <select
                        value={skill.authority_id || ""} // Use authority_id for value
                        onChange={(e) => {
                          const selectedCompanyId = e.target.value;
                          // Find company name for display
                          const company = companies?.find(c => c.id === parseInt(selectedCompanyId));
                          const companyName = company ? company.company_name : "";
                          
                          setSkills(prev => prev.map(s => 
                            s.id === skill.id 
                              ? { 
                                  ...s, 
                                  authority_id: selectedCompanyId || null,
                                  authorityName: companyName
                                } 
                              : s
                          ));
                        }}
                        className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a company/institution</option>
                        {companies && companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.company_name}
                          </option>
                        ))}
                      </select>
                      
                      {/* Show current selection for pre-filled skills */}
                      {skill.authorityName && (
                        <div className="mt-1 text-sm text-gray-600">
                          Currently: {skill.authorityName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer - Save Changes Button */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <Button
              onClick={handleSaveChanges}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </section>
        
        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightSide1 />
        </aside>
        
        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block"></div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedCertificate.name}
              </h3>
              <button
                onClick={() => {
                  setShowCertificateModal(false);
                  setSelectedCertificate(null);
                }}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <RxCross2 className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {selectedCertificate.url ? (
                <div className="space-y-4">
                  {/* PDF Viewer */}
                  {selectedCertificate.url.includes(".pdf") ? (
                    <iframe
                      src={selectedCertificate.url}
                      className="w-full border border-gray-300 rounded h-96"
                      title={selectedCertificate.name}
                    />
                  ) : (
                    /* Image Viewer */
                    <div className="flex justify-center">
                      <img
                        src={selectedCertificate.url}
                        alt={selectedCertificate.name}
                        className="object-contain max-w-full border border-gray-300 rounded max-h-96"
                      />
                    </div>
                  )}

                  {/* Download Link */}
                  <div className="flex justify-center">
                    <a
                      href={selectedCertificate.url}
                      download={selectedCertificate.name}
                      className="inline-flex items-center px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Certificate
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mb-4 text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Certificate uploaded successfully!
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    The certificate has been saved for this skill.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default FeedYourSkills;