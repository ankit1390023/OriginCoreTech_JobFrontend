import React, { useState, useEffect } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { useDomainsApi } from "../../../hooks/useDomainsApi";
import { useSkillApi } from "../../../hooks/useSkillApi";
import { domainApi } from "../../../api/domainApi";
import { Input, Label, Button, ErrorMessage, Loader } from "../../../components/ui";

const initialDomains = [];

export default function DomainsForm() {
  const [domains, setDomains] = useState(initialDomains);
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState(""); // New state for search
  const [domainSkills, setDomainSkills] = useState({}); // Store skills for each domain
  const [selectedSkills, setSelectedSkills] = useState({}); // Store selected skills for each domain
  const [showMoreSkills, setShowMoreSkills] = useState({}); // Track show more state for each domain
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom hook for skills API with Web Development as default domain
  const {
    allDomains,
    skillsByDomain,
    loading: domainsLoading,
    error: domainsError,
    refreshDomains,
    setError: setDomainsError,
    fetchSkillsByDomain,
  } = useDomainsApi("Web Development");

  // Use custom hook for skill uploads
  const {
    loading: skillUploadLoading,
    error: skillUploadError,
    uploadSkills,
    setError: setSkillUploadError,
  } = useSkillApi();

  // Filter domains based on search input
  const filteredDomains = allDomains.filter((domain) => {
    const domainName = domain.domain_name || domain;
    return domainName.toLowerCase().includes(searchInput.toLowerCase());
  });

  const handleAddDomain = async (domain) => {
    if (!domains.find((d) => d.name === domain)) {
      // Fetch skills for this specific domain
      try {
        const skills = await domainApi.getSkillsByDomain(domain);
        setDomainSkills((prev) => ({
          ...prev,
          [domain]: skills,
        }));
        // Initialize selected skills for this domain
        setSelectedSkills((prev) => ({
          ...prev,
          [domain]: [],
        }));
        // Initialize show more state for this domain
        setShowMoreSkills((prev) => ({
          ...prev,
          [domain]: false,
        }));
      } catch (err) {
        console.error("Error fetching skills for domain:", domain, err);
        setDomainSkills((prev) => ({
          ...prev,
          [domain]: [],
        }));
      }

      setDomains([
        ...domains,
        { name: domain, certificate: null, company: "" },
      ]);
    }
    setInput("");
    setSearchInput(""); // Clear search input after adding domain
  };

  const handleRemoveDomain = (idx) => {
    const domainToRemove = domains[idx];
    setDomains(domains.filter((_, i) => i !== idx));

    // Remove skills for this domain from state
    setDomainSkills((prev) => {
      const newSkills = { ...prev };
      delete newSkills[domainToRemove.name];
      return newSkills;
    });

    // Remove selected skills for this domain
    setSelectedSkills((prev) => {
      const newSelectedSkills = { ...prev };
      delete newSelectedSkills[domainToRemove.name];
      return newSelectedSkills;
    });

    // Remove show more state for this domain
    setShowMoreSkills((prev) => {
      const newShowMoreSkills = { ...prev };
      delete newShowMoreSkills[domainToRemove.name];
      return newShowMoreSkills;
    });
  };

  const handleCompanyChange = (idx, value) => {
    setDomains(
      domains.map((d, i) => (i === idx ? { ...d, company: value } : d))
    );
  };

  const handleCertificateChange = (idx, file) => {
    setDomains(
      domains.map((d, i) => (i === idx ? { ...d, certificate: file } : d))
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

  const handleSkillToggle = (domainName, skill) => {
    setSelectedSkills((prev) => {
      const currentSelected = prev[domainName] || [];
      const isSelected = currentSelected.includes(skill);

      if (isSelected) {
        // Remove skill
        return {
          ...prev,
          [domainName]: currentSelected.filter(s => s !== skill)
        };
      } else {
        // Add skill
        return {
          ...prev,
          [domainName]: [...currentSelected, skill]
        };
      }
    });
  };

  const toggleShowMoreSkills = (domainName) => {
    setShowMoreSkills((prev) => ({
      ...prev,
      [domainName]: !prev[domainName]
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
      domainsWithCertificates.forEach((domain, index) => {
        const selectedSkillsForDomain = selectedSkills[domain.name] || [];

        if (selectedSkillsForDomain.length > 0) {
          // Add selected skills for this domain
          selectedSkillsForDomain.forEach((skill, skillIndex) => {
            skills.push({
              skill_id: skills.length + 1,
              skill: skill,
              domain: domain.name,
              authority: domain.company || "Self",
            });
          });
        } else {
          // If no skills selected, add the domain itself
          skills.push({
            skill_id: skills.length + 1,
            skill: domain.name,
            domain: domain.name,
            authority: domain.company || "Self",
          });
        }
      });

      if (skills.length === 0) {
        alert("Please select at least one skill to submit.");
        return;
      }

      // Get certificate files
      const certificateFiles = domainsWithCertificates.map(
        (domain) => domain.certificate
      );

      // Upload skills using custom hook
      // TODO: Replace with actual user ID from authentication context
      const userId = localStorage.getItem("userId");
      console.log("userId from upload skills", userId);
      const response = await uploadSkills(userId, skills, certificateFiles);
     
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
            handleAddDomain(filteredDomains[0].domain_name || filteredDomains[0]);
          }
        }
      }}
    >
      <div className="mb-2 sm:mb-3">
        <Label>Areas of Interest</Label>
        <div className="flex items-center border rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 mb-1 sm:mb-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
          <input
            className="flex-1 outline-none text-xs"
            placeholder="Search and add domains..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                if (searchInput.trim() && filteredDomains.length > 0) {
                  handleAddDomain(filteredDomains[0].domain_name || filteredDomains[0]);
                }
              }
            }}
          />
          <button
            className="ml-2 text-gray-400"
            onClick={() => searchInput.trim() && filteredDomains.length > 0 && handleAddDomain(filteredDomains[0].domain_name || filteredDomains[0])}
            type="button"
          >
            <svg width="16" height="16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#888" />
              <path
                d="M8 4v8M4 8h8"
                stroke="#888"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Show matched domains when searching */}
        {searchInput.trim() && filteredDomains.length > 0 && (
          <div className="mb-2 sm:mb-3">
            <div className="text-xs mb-1 sm:mb-2 text-gray-500">Matched domains</div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {filteredDomains.slice(0, 8).map((domain) => (
                <button
                  key={domain.domain_name || domain}
                  type="button"
                  className="bg-blue-100 text-blue-800 rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs border border-blue-300 hover:border-blue-400 transition-all duration-200"
                  onClick={() => handleAddDomain(domain.domain_name || domain)}
                >
                  {domain.domain_name || domain} +
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show "No matches found" message */}
        {searchInput.trim() && filteredDomains.length === 0 && (
          <div className="mb-2 sm:mb-3">
            <div className="text-xs text-gray-500">No domains found matching "{searchInput}"</div>
          </div>
        )}



        {/* Display added domains with their related skills */}
        {domains.map((domain, idx) => (
          <div
            key={domain.name}
            className="border rounded-md p-2 sm:p-3 mb-2 sm:mb-3 flex flex-col gap-1 sm:gap-2 relative"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="bg-blue-600 text-white px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md text-xs font-medium">
                {domain.name}
              </span>
              <button
                className="ml-1 sm:ml-2 text-gray-400"
                onClick={() => handleRemoveDomain(idx)}
                type="button"
              >
                <FaTimes className="text-xs" />
              </button>
              <button
                className="ml-1 sm:ml-2 text-blue-500 text-xs underline"
                type="button"
                onClick={() => document.getElementById(`cert-${idx}`).click()}
              >
                Upload Certificate
              </button>
              <input
                id={`cert-${idx}`}
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleCertificateChange(idx, e.target.files[0])
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
                  onClick={() => handleCertificateChange(idx, null)}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Display related skills for this specific domain */}
            {domainSkills[domain.name] &&
              domainSkills[domain.name].length > 0 && (
                <div className="mt-1 sm:mt-2">
                  <div className="text-xs mb-1 sm:mb-2 text-gray-500">
                    Select related skills for {domain.name}:
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {(showMoreSkills[domain.name]
                      ? domainSkills[domain.name]
                      : domainSkills[domain.name].slice(0, 6)
                    ).map((skill) => {
                      const isSelected = (selectedSkills[domain.name] || []).includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(domain.name, skill)}
                          className={`rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs border transition-all duration-200 ${isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  {/* Show more/less button for skills */}
                  {domainSkills[domain.name].length > 6 && (
                    <button
                      type="button"
                      className="text-blue-500 underline text-xs mt-1 sm:mt-2"
                      onClick={() => toggleShowMoreSkills(domain.name)}
                    >
                      {showMoreSkills[domain.name] ? "Show less skills" : "Show more skills"}
                    </button>
                  )}

                  {/* Show selected skills count */}
                  {(selectedSkills[domain.name] || []).length > 0 && (
                    <div className="text-xs text-green-600 mt-1 sm:mt-2">
                      Selected: {(selectedSkills[domain.name] || []).length} skill(s)
                    </div>
                  )}
                </div>
              )}

            <div className="mb-2 sm:mb-3">
              <Label>Where did you learn this skill?</Label>
              <input
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
                placeholder="College/ Company name"
                value={domain.company}
                onChange={(e) => handleCompanyChange(idx, e.target.value)}
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
