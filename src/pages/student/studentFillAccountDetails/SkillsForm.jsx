import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { useDomainsApi } from "../../../hooks/useDomainsApi";
import { useSkillApi } from "../../../hooks/useSkillApi";
import {
  Input,
  Label,
  Button,
  ErrorMessage,
  Loader,
} from "../../../components/ui";
import useUploadImageApi from "../../../hooks/useUploadImageApi";

const initialDomains = [];

export default function DomainsForm() {
  const [domains, setDomains] = useState(initialDomains);
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState(""); // New state for search
  const [domainSkills, setDomainSkills] = useState({}); // Store skills for each domain
  const [selectedSkills, setSelectedSkills] = useState({}); // Store selected skills for each domain
  const [showMoreSkills, setShowMoreSkills] = useState({}); // Track show more state for each domain
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainId, setDomainId] = useState(1);

  // Use custom hook for skills API with Web Development as default domain
  const {
    allDomains,
    skillsByDomain,
    loading: domainsLoading,
    error: domainsError,
    refreshDomains,
    fetchSkillsByDomain,
  } = useDomainsApi(domainId);
  console.log("SkillsByDomain ", skillsByDomain);
  // Use custom hook for skill uploads
  const {
    loading: skillUploadLoading,
    error: skillUploadError,
    uploadSkills,
  } = useSkillApi();

  // Add the image upload hook
  const { uploadImage, batchUploadImages } = useUploadImageApi();

  // Get user_id from Redux state
  const user_id = useSelector((state) => state.auth.user?.id);

  // Filter domains based on search input
  const filteredDomains = allDomains.filter((domain) => {
    const domainName = typeof domain === "string" ? domain : domain.name || "";
    return (
      domainName &&
      domainName.toString().toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  const handleAddDomain = async (domain) => {
    if (!domains.find((d) => d.id === domain.id)) {
      // Fetch skills for this specific domain
      try {
        const skills = await fetchSkillsByDomain(domain.id);
        setDomainSkills((prev) => ({
          ...prev,
          [domain.id]: skills,
        }));
        // Initialize selected skills for this domain
        setSelectedSkills((prev) => ({
          ...prev,
          [domain.id]: [],
        }));
        // Initialize show more state for this domain
        setShowMoreSkills((prev) => ({
          ...prev,
          [domain.id]: false,
        }));
      } catch (err) {
        console.error("Error fetching skills for domain:", domain, err);
        setDomainSkills((prev) => ({
          ...prev,
          [domain.id]: [],
        }));
      }

      setDomains([
        ...domains,
        { id: domain.id, name: domain.name, certificate: null, company: "" },
      ]);
    }
    setInput("");
    setSearchInput(""); // Clear search input after adding domain
  };

  const handleRemoveDomain = (domainId) => {
    const domainToRemove = domains.find((domain) => domain.id === domainId);
    setDomains(domains.filter((domain) => domain.id !== domainId));

    // Remove skills for this domain from state
    setDomainSkills((prev) => {
      const newSkills = { ...prev };
      delete newSkills[domainId];
      return newSkills;
    });

    // Remove selected skills for this domain
    setSelectedSkills((prev) => {
      const newSelectedSkills = { ...prev };
      delete newSelectedSkills[domainId];
      return newSelectedSkills;
    });

    // Remove show more state for this domain
    setShowMoreSkills((prev) => {
      const newShowMoreSkills = { ...prev };
      delete newShowMoreSkills[domainId];
      return newShowMoreSkills;
    });
  };

  const handleCompanyChange = (domainId, value) => {
    setDomains(
      domains.map((domain) =>
        domain.id === domainId ? { ...domain, company: value } : domain
      )
    );
  };

  const handleCertificateChange = (domainId, file) => {
    setDomains(
      domains.map((domain) =>
        domain.id === domainId ? { ...domain, certificate: file } : domain
      )
    );
  };

  const handleRetry = async () => {
    setDomainsError("");
    try {
      await refreshDomains();
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  const handleSkillToggle = (domainId, skill) => {
    setSelectedSkills((prev) => {
      const currentSelected = prev[domainId] || [];
      const isSelected = currentSelected.some((s) => s.id === skill.id);

      if (isSelected) {
        // Remove skill
        return {
          ...prev,
          [domainId]: currentSelected.filter((s) => s.id !== skill.id),
        };
      } else {
        // Add skill
        return {
          ...prev,
          [domainId]: [...currentSelected, skill],
        };
      }
    });
  };

  const toggleShowMoreSkills = (domainId) => {
    setShowMoreSkills((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const handleSubmitSkills = async () => {
    try {
      // Filter domains that have certificates
      const domainsWithCertificates = domains.filter(
        (domain) => domain.certificate
      );

      if (domainsWithCertificates.length === 0) {
        alert("Please upload at least one certificate to submit skills.");
        return;
      }

      // Prepare skills data for API - only include selected skills
      const skills = [];
      domainsWithCertificates.forEach((domain) => {
        const selectedSkillsForDomain = selectedSkills[domain.id] || [];

        if (selectedSkillsForDomain.length > 0) {
          // Add selected skills for this domain
          selectedSkillsForDomain.forEach((skill) => {
            skills.push({
              skill_id: skill.id,
              skill: skill.name,
              authority: domain.company || "Self",
            });
          });
        } else {
          // If no skills selected, add the domain itself
          skills.push({
            skill_id: domain.id,
            skill: domain.name,
            authority: domain.company || "Self",
          });
        }
      });

      if (skills.length === 0) {
        alert("Please select at least one skill to submit.");
        return;
      }

      // Get certificate files (in the same order as domainsWithCertificates)
      const certificateFiles = domainsWithCertificates.map(
        (domain) => domain.certificate
      );
      console.log("Step 1: Certificate files to upload:", certificateFiles);

      // 1. Upload all certificate files and get URLs (Promise.all)
      const certificateUrls = await Promise.all(
        certificateFiles.map((file) => uploadImage(file, "certificateImage"))
      );
      console.log("Step 2: Certificate URLs after upload:", certificateUrls);

      // Check for failed uploads
      if (certificateUrls.some((url) => !url)) {
        alert("One or more certificate uploads failed. Please try again.");
        return;
      }

      // 2. Clean up skills array - remove certificate_image property as it will be sent separately
      skills.forEach((skill) => {
        delete skill.certificate_image;
      });
      console.log("Step 3: Final skills array (cleaned):", skills);

      // 3. Upload skills using custom hook - pass certificate URLs separately
      console.log("Step 4: Certificate URLs to pass to API:", certificateUrls);
      const response = await uploadSkills(user_id, skills, certificateUrls);

      console.log("Skills uploaded successfully:", response);
      alert("Skills uploaded successfully!");

      // Clear form after successful upload
      setDomains([]);
      setDomainSkills({});
      setSelectedSkills({});
      setShowMoreSkills({});
    } catch (error) {
      console.error("Error uploading skills:", error);
      // Error message is already set in the hook, so we don't need to show alert here
      // The error will be displayed in the UI below the form
    }
  };

  if (domainsLoading && domains.length === 0) {
    return <Loader message="Loading domains..." />;
  }

  if (domainsError && domains.length === 0) {
    return (
      <ErrorMessage>
        {domainsError}
        <button onClick={handleRetry} className="ml-2 text-blue-500 underline">
          Retry
        </button>
      </ErrorMessage>
    );
  }

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          if (searchInput.trim() && filteredDomains.length > 0) {
            handleAddDomain(filteredDomains[0]);
          }
        }
      }}
    >
      <div className="mb-2 sm:mb-3">
        <Label>Areas of Interest</Label>
        <div className="flex items-center border rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 mb-1 sm:mb-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
          <input
            type="text"
            className="flex-1 outline-none text-xs"
            placeholder="Search and add domains..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                if (searchInput.trim() && filteredDomains.length > 0) {
                  handleAddDomain(filteredDomains[0]);
                }
              }
            }}
          />
        </div>

        {/* Show matched domains when searching */}
        {searchInput.trim() && filteredDomains.length > 0 && (
          <div className="mb-2 sm:mb-3">
            <div className="text-xs mb-1 sm:mb-2 text-gray-500">
              Matched domains
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {filteredDomains.slice(0, 8).map((domain) => (
                <button
                  key={domain.id}
                  type="button"
                  className="bg-blue-100 text-blue-800 rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs border border-blue-300 hover:border-blue-400 transition-all duration-200"
                  onClick={() => handleAddDomain(domain)}
                >
                  {domain.name} +
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show "No matches found" message */}
        {searchInput.trim() && filteredDomains.length === 0 && (
          <div className="mb-2 sm:mb-3">
            <div className="text-xs text-gray-500">
              No domains found matching "{searchInput}"
            </div>
          </div>
        )}

        {/* Display added domains with their related skills */}
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="border rounded-md p-2 sm:p-3 mb-2 sm:mb-3 flex flex-col gap-1 sm:gap-2 relative"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="bg-blue-600 text-white px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md text-xs font-medium">
                {domain.name}
              </span>
              <button
                className="ml-1 sm:ml-2 text-gray-400"
                onClick={() => handleRemoveDomain(domain.id)}
                type="button"
              >
                <FaTimes className="text-xs" />
              </button>
              <button
                className="ml-1 sm:ml-2 text-blue-500 text-xs underline"
                type="button"
                onClick={() =>
                  document.getElementById(`cert-${domain.id}`).click()
                }
              >
                Upload Certificate
              </button>
              <input
                id={`cert-${domain.id}`}
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleCertificateChange(domain.id, e.target.files[0])
                }
              />
            </div>

            {/* Display uploaded certificate name */}
            {domain.certificate && (
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-xs text-gray-600">Certificate:</span>
                <span className="text-xs font-medium text-green-600">
                  {domain.certificate.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleCertificateChange(domain.id, null)}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Display related skills for this specific domain */}
            {domainSkills[domain.id] && domainSkills[domain.id].length > 0 && (
              <div className="mt-1 sm:mt-2">
                <div className="text-xs mb-1 sm:mb-2 text-gray-500">
                  Select related skills for {domain.name}:
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {(showMoreSkills[domain.id]
                    ? domainSkills[domain.id]
                    : domainSkills[domain.id].slice(0, 6)
                  ).map((skill) => {
                    const isSelected = (selectedSkills[domain.id] || []).some(
                      (s) => s.id === skill.id
                    );
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillToggle(domain.id, skill)}
                        className={`rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs border transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>

                {/* Show more/less button for skills */}
                {domainSkills[domain.id].length > 6 && (
                  <button
                    type="button"
                    className="text-blue-500 underline text-xs mt-1 sm:mt-2"
                    onClick={() => toggleShowMoreSkills(domain.id)}
                  >
                    {showMoreSkills[domain.id]
                      ? "Show less skills"
                      : "Show more skills"}
                  </button>
                )}

                {/* Show selected skills count */}
                {(selectedSkills[domain.id] || []).length > 0 && (
                  <div className="text-xs text-green-600 mt-1 sm:mt-2">
                    Selected: {(selectedSkills[domain.id] || []).length}{" "}
                    skill(s)
                  </div>
                )}
              </div>
            )}

            <div className="mb-2 sm:mb-3">
              <Label>Where did you learn this skill?</Label>
              <input
                type="text"
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
                placeholder="College/ Company name"
                value={domain.company}
                onChange={(e) => handleCompanyChange(domain.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit button for skills */}
      <div className="mt-2 sm:mt-3">
        <Button
          type="button"
          variant="secondary"
          loading={skillUploadLoading}
          disabled={skillUploadLoading}
          className="w-full"
          onClick={handleSubmitSkills}
        >
          {skillUploadLoading ? "Uploading Skills..." : "Upload Skills"}
        </Button>
      </div>

      {/* Show skill upload error if any */}
      {skillUploadError && (
        <ErrorMessage className="mt-2 sm:mt-3 text-center">
          {skillUploadError}
        </ErrorMessage>
      )}
    </div>
  );
}
