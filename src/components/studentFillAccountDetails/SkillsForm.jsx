import React, { useState, useEffect } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { useDomainsApi } from "../../hooks/useDomainsApi";
import { useSkillApi } from "../../hooks/useSkillApi";
import { domainApi } from "../../api/domainApi";

const initialDomains = [];

export default function DomainsForm() {
  const [domains, setDomains] = useState(initialDomains);
  const [input, setInput] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [domainSkills, setDomainSkills] = useState({}); // Store skills for each domain
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

  const handleAddDomain = async (domain) => {
    if (!domains.find((d) => d.name === domain)) {
      // Fetch skills for this specific domain
      try {
        const skills = await domainApi.getSkillsByDomain(domain);
        setDomainSkills((prev) => ({
          ...prev,
          [domain]: skills,
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

      // Prepare skills data for API
      const skills = domainsWithCertificates.map((domain, index) => ({
        skill_id: index + 1, // This should come from the actual skill database
        skill: domain.name,
        authority: domain.company || "Self",
      }));

      // Get certificate files
      const certificateFiles = domainsWithCertificates.map(
        (domain) => domain.certificate
      );

      // Upload skills using custom hook
      const userId = 123; // This should come from authentication context
      const response = await uploadSkills(userId, skills, certificateFiles);

      console.log("Skills uploaded successfully:", response);
      alert("Skills uploaded successfully!");
    } catch (error) {
      console.error("Error uploading skills:", error);

      // Show specific error message from backend
      let errorMessage = "Error uploading skills. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      alert(errorMessage);
    }
  };

  if (domainsLoading && domains.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading domains...</span>
      </div>
    );
  }

  if (domainsError && domains.length === 0) {
    return (
      <div className="text-red-500 text-center py-4">
        {domainsError}
        <button onClick={handleRetry} className="ml-2 text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          if (input.trim()) {
            handleAddDomain(input.trim());
          }
        }
      }}
    >
      <div className="mb-4">
        <label className="block font-semibold mb-2">Areas of Interest</label>
        <div className="flex items-center border rounded px-3 py-2 mb-2">
          <input
            className="flex-1 outline-none"
            placeholder="List your skills here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                if (input.trim()) {
                  handleAddDomain(input.trim());
                }
              }
            }}
          />
          <button
            className="ml-2 text-gray-400"
            onClick={() => input.trim() && handleAddDomain(input.trim())}
            type="button"
          >
            <svg width="20" height="20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#888" />
              <path
                d="M10 5v10M5 10h10"
                stroke="#888"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Show all domains with "Show more" option */}
        <div className="mb-4">
          <div className="text-xs mb-2 text-gray-500">Available domains</div>
          <div className="flex flex-wrap gap-2">
            {allDomains
              .slice(0, showMore ? allDomains.length : 6)
              .map((domain) => (
                <button
                  key={domain.domain_name || domain}
                  type="button"
                  className="bg-gray-100 rounded-full px-3 py-1 text-xs border hover:bg-gray-200"
                  onClick={() => handleAddDomain(domain.domain_name || domain)}
                >
                  {domain.domain_name || domain} +
                </button>
              ))}
            {allDomains.length > 6 && (
              <button
                type="button"
                className="text-blue-500 underline text-xs"
                onClick={() => setShowMore((v) => !v)}
              >
                {showMore ? "Show less" : "Show more"} +
              </button>
            )}
          </div>
        </div>

        {/* Display added domains with their related skills */}
        {domains.map((domain, idx) => (
          <div
            key={domain.name}
            className="border rounded-lg p-3 mb-3 flex flex-col gap-2 relative"
          >
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {domain.name}
              </span>
              <button
                className="ml-2 text-gray-400"
                onClick={() => handleRemoveDomain(idx)}
                type="button"
              >
                <FaTimes />
              </button>
              <button
                className="ml-2 text-blue-500 text-xs underline"
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
              <div className="flex items-center gap-2 mt-2">
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
                <div className="mt-2">
                  <div className="text-xs mb-2 text-gray-500">
                    Related skills for {domain.name}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {domainSkills[domain.name].map((skill) => (
                      <span
                        key={skill}
                        className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div>
              <label className="block text-xs mb-1">
                Where did you learn this skill?
              </label>
              <input
                className="w-full border rounded px-2 py-2"
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
      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmitSkills}
          disabled={skillUploadLoading}
          className={`w-full px-6 py-3 rounded font-semibold ${
            skillUploadLoading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {skillUploadLoading ? "Uploading Skills..." : "Upload Skills"}
        </button>
      </div>

      {/* Show skill upload error if any */}
      {skillUploadError && (
        <div className="mt-4 text-red-500 text-center">{skillUploadError}</div>
      )}
    </div>
  );
}
