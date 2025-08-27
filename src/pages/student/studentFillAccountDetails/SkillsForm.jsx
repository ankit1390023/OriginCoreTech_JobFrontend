import React, { useState } from "react";
import { Input, Label, Button, ErrorMessage, Loader } from "../../../components/ui";
import useUploadImageApi from '../../../hooks/useUploadImageApi';
import { useMasterData } from '../../../hooks/master/useMasterData';
import { FaTimes } from "react-icons/fa";
 
const initialDomains = [];
 
export default function SkillsForm({ onNext, onBack }) {
  const [domains, setDomains] = useState(initialDomains);
  const [searchInput, setSearchInput] = useState("");
  const [domainSkills, setDomainSkills] = useState({});
  const [selectedSkills, setSelectedSkills] = useState({});
  const [showMoreSkills, setShowMoreSkills] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  // Use master data hook
  const {
    domains: allDomains,
    getSkillsForDomain,
    isLoading: isMasterDataLoading,
    error: masterDataError
  } = useMasterData();
 
  // Add the image upload hook
  const { uploadImage } = useUploadImageApi();
 
  // Filter domains based on search input
  const filteredDomains = allDomains.filter((domain) => {
    const domainName = domain.domain_name || domain.name || domain;
    return domainName.toLowerCase().includes(searchInput.toLowerCase());
  });
 
  const handleAddDomain = async (domain) => {
    const domainName = domain.domain_name || domain.name || domain;
    const domainId = domain.id || domain.domain_id;
 
    if (!domains.find(d => (d.domain_name || d.name) === domainName)) {
      try {
        const skills = getSkillsForDomain(domainId) || [];
        setDomainSkills((prev) => ({
          ...prev,
          [domainName]: skills,
        }));
        setSelectedSkills((prev) => ({
          ...prev,
          [domainName]: [],
        }));
        setShowMoreSkills((prev) => ({
          ...prev,
          [domainName]: false,
        }));
 
        setDomains([
          ...domains,
          { id: domainId, name: domainName, certificate: null, company: "" },
        ]);
      } catch (err) {
        console.error("Error fetching skills for domain:", domainName, err);
        setDomainSkills((prev) => ({
          ...prev,
          [domainName]: [],
        }));
      }
      setSearchInput("");
    }
  };
 
  const handleRemoveDomain = (idx) => {
    const domainToRemove = domains[idx];
    setDomains(domains.filter((_, i) => i !== idx));
 
    setDomainSkills((prev) => {
      const newSkills = { ...prev };
      delete newSkills[domainToRemove.name];
      return newSkills;
    });
 
    setSelectedSkills((prev) => {
      const newSelectedSkills = { ...prev };
      delete newSelectedSkills[domainToRemove.name];
      return newSelectedSkills;
    });
 
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
 
  const handleSkillToggle = (domainName, skill) => {
    setSelectedSkills((prev) => {
      const currentSelected = prev[domainName] || [];
      const isSelected = currentSelected.some(s => s.skill_id === skill.skill_id);
 
      if (isSelected) {
        return {
          ...prev,
          [domainName]: currentSelected.filter((s) => s.skill_id !== skill.skill_id),
        };
      } else {
        return {
          ...prev,
          [domainName]: [...currentSelected, skill],
        };
      }
    });
  };
 
  const toggleShowMoreSkills = (domainName) => {
    setShowMoreSkills((prev) => ({
      ...prev,
      [domainName]: !prev[domainName],
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
 
    try {
      // Filter domains that have certificates
      const domainsWithCertificates = domains.filter(
        (domain) => domain.certificate
      );
 
      if (domainsWithCertificates.length === 0) {
        alert("Please upload at least one certificate to submit skills.");
        setIsSubmitting(false);
        return;
      }
 
      // Prepare skills data for API - only include selected skills
      const skills = [];
      const certificatePromises = [];
 
      // First, upload all certificates in parallel
      for (const domain of domainsWithCertificates) {
        if (domain.certificate) {
          certificatePromises.push(
            uploadImage(domain.certificate, 'certificates')
              .then(url => ({
                domain: domain.name,
                url
              }))
          );
        }
      }
 
      // Wait for all certificate uploads to complete
      const uploadedCertificates = await Promise.all(certificatePromises);
      const certificateMap = {};
      uploadedCertificates.forEach(item => {
        certificateMap[item.domain] = item.url;
      });
 
      // Now process skills with certificate URLs
      for (const domain of domainsWithCertificates) {
        const selectedSkillsForDomain = selectedSkills[domain.name] || [];
        const certificateUrl = certificateMap[domain.name];
 
        if (selectedSkillsForDomain.length > 0) {
          // Add selected skills for this domain
          selectedSkillsForDomain.forEach((skill) => {
            skills.push({
              skill: skill.skill_name,
              domain: domain.name,
              authority: domain.company || "Self",
              certificate_image: certificateUrl,
            });
          });
        } else if (certificateUrl) {
          // If no skills selected, add the domain itself
          skills.push({
            skill: domain.name,
            domain: domain.name,
            authority: domain.company || "Self",
            certificate_image: certificateUrl,
          });
        }
      }
 
      if (skills.length === 0) {
        alert("Please select at least one skill to submit.");
        setIsSubmitting(false);
        return;
      }
 
      // Upload skills using the API
      const userId = localStorage.getItem("userId");
      // TODO: Uncomment and implement actual API call
      // await uploadSkillsApi(userId, skills);
 
      console.log("Skills to be uploaded:", skills);
      alert("Skills uploaded successfully!");
 
      // Clear form
      setDomains([]);
      setDomainSkills({});
      setSelectedSkills({});
      setShowMoreSkills({});
 
      // Call onNext to proceed to next step
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error("Error uploading skills:", error);
      alert("Failed to upload skills. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
 
  if (isMasterDataLoading && domains.length === 0) {
    return <Loader message="Loading master data..." />;
  }
 
  if (masterDataError && domains.length === 0) {
    return (
      <ErrorMessage>
        {masterDataError}
        <button onClick={() => window.location.reload()} className="ml-2 text-blue-500 underline">
          Retry
        </button>
      </ErrorMessage>
    );
  }
 
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="mb-4">
        <Label>Areas of Interest</Label>
        <div className="flex items-center border rounded-md px-3 py-2 mb-2 focus-within:ring-2 focus-within:ring-blue-400 focus:border-transparent text-sm transition-all duration-200 border-gray-300 hover:border-gray-400">
          <input
            className="flex-1 outline-none text-sm"
            placeholder="Search and add domains..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (searchInput.trim() && filteredDomains.length > 0) {
                  handleAddDomain(filteredDomains[0]);
                }
              }
            }}
          />
        </div>
 
        {/* Show matched domains when searching */}
        {searchInput.trim() && filteredDomains.length > 0 && (
          <div className="mb-3">
            <div className="text-xs mb-2 text-gray-500 font-medium">Matched domains</div>
            <div className="flex flex-wrap gap-2">
              {filteredDomains.slice(0, 8).map((domain, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="bg-blue-50 text-blue-700 rounded-md px-3 py-1.5 text-sm font-medium border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors duration-200"
                  onClick={() => handleAddDomain(domain)}
                >
                  {domain.domain_name || domain.name || domain} +
                </button>
              ))}
            </div>
          </div>
        )}
         
        {/* Show "No matches found" message */}
        {searchInput.trim() && filteredDomains.length === 0 && (
          <div className="text-sm text-gray-500 py-2">
            No domains found matching "{searchInput}"
          </div>
        )}
      </div>
 
      {/* Display added domains with their related skills */}
      <div className="space-y-4">
        {domains.map((domain, idx) => (
          <div
            key={`${domain.name}-${idx}`}
            className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  {domain.name}
                </span>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => handleRemoveDomain(idx)}
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
 
              <div>
                <input
                  id={`cert-${idx}`}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleCertificateChange(idx, e.target.files[0])}
                />
                <label
                  htmlFor={`cert-${idx}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  {domain.certificate ? 'Change Certificate' : 'Upload Certificate'}
                </label>
              </div>
            </div>
 
            {/* Display uploaded certificate name */}
            {domain.certificate && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-3">
                <div className="flex items-center">
                  <span className="text-xs text-gray-600 mr-2">Certificate:</span>
                  <span className="text-xs font-medium text-green-600 truncate max-w-xs">
                    {domain.certificate.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCertificateChange(idx, null)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            )}
 
            {/* Display related skills for this specific domain */}
            {domainSkills[domain.name]?.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-small text-gray-700 mb-2">
                  Select related skills for {domain.name} :
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(showMoreSkills[domain.name]
                    ? domainSkills[domain.name]
                    : domainSkills[domain.name].slice(0, 6)
                  ).map((skill, skillIdx) => {
                    const isSelected = (selectedSkills[domain.name] || []).some(s => s.skill_id === skill.skill_id);
                    return (
                      <button
                        key={skill.skill_id || skillIdx}
                        type="button"
                        onClick={() => handleSkillToggle(domain.name, skill)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${isSelected
                          ? "bg-blue-100 text-blue-800 border-blue-200 font-medium"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                      >
                        {skill.skill_name}
                      </button>
                    );
                  })}
                </div>
 
                {/* Show more/less button for skills */}
                {domainSkills[domain.name].length > 6 && (
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 focus:outline-none"
                    onClick={() => toggleShowMoreSkills(domain.name)}
                  >
                    {showMoreSkills[domain.name] ? "Show less" : `+${domainSkills[domain.name].length - 6} more`}
                  </button>
                )}
 
                {/* Show selected skills count */}
                {(selectedSkills[domain.name] || []).length > 0 && (
                  <div className="text-xs text-green-600 mt-2">
                    Selected: <span className="font-medium">{(selectedSkills[domain.name] || []).length}</span> skill(s)
                  </div>
                )}
              </div>
            )}
 
            <div className="mt-4">
              <Label>Where did you learn this skill?</Label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all duration-200 border-gray-300 hover:border-gray-400"
                placeholder="College/Company name"
                value={domain.company}
                onChange={(e) => handleCompanyChange(idx, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
 
      {/* Form actions */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="secondary"
          loading={isSubmitting}
          disabled={isSubmitting || domains.length === 0}
          size="small"
          className="w-full"
          type="button"
          onClick={handleSubmit}
        >
          {isSubmitting ? "Uploading Skills..." : "Upload Skills"}
        </Button>
      </div>
    </form>
  );
}
 