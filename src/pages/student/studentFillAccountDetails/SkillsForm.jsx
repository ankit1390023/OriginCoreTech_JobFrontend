import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "../../../components/ui";
import { useMasterData } from "../../../hooks/master/useMasterData";
import { FaTimes } from "react-icons/fa";
import useUploadImageApi from "../../../hooks/useUploadImageApi";

export default function SkillsForm() {
    const { setValue, control } = useFormContext();
    const domains = useWatch({ control, name: "domains" }) || [];

    const [searchInput, setSearchInput] = useState("");
    const [localCompanyValues, setLocalCompanyValues] = useState({});
    const { domains: allDomains, getSkillsForDomain } = useMasterData();
    const { uploadImage, loading: uploading } = useUploadImageApi();
    const debounceTimeouts = useRef({});

    // Add console logging to debug re-renders
    console.log("SkillsForm re-rendered, domains:", domains.length);

    // Initialize local company values when domains change
    useEffect(() => {
        const newLocalValues = {};
        domains.forEach((domain, idx) => {
            if (localCompanyValues[idx] === undefined) {
                newLocalValues[idx] = domain.company || "";
            } else {
                newLocalValues[idx] = localCompanyValues[idx];
            }
        });
        setLocalCompanyValues(newLocalValues);
    }, [domains.length]); // Only update when domain count changes

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimeouts.current).forEach(timeout => {
                if (timeout) clearTimeout(timeout);
            });
        };
    }, []);
    const getDomainSkills = (domain) => {
        const domainId = domain.id;
        return getSkillsForDomain(domainId) || [];
    };

    const handleAddDomain = (domain) => {
        const domainName = domain.domain_name || domain.name || domain;
        const domainId = domain.id || domain.domain_id;

        if (!domains.find((d) => d.name === domainName)) {
            const newDomains = [
                ...domains,
                {
                    id: domainId,
                    name: domainName,
                    company: "",
                    certificate: null,
                    skills: [],
                    // Add a unique identifier for stable keys
                    _tempId: Date.now() + Math.random()
                },
            ];
            setValue("domains", newDomains, { shouldValidate: true, shouldDirty: true });
        }
        setSearchInput("");
    };

    const handleRemoveDomain = (idx) => {
        const newDomains = domains.filter((_, i) => i !== idx);
        setValue("domains", newDomains, { shouldValidate: true, shouldDirty: true });
    };

    const handleCompanyChange = useCallback((idx, value) => {
        console.log(`Company change for domain ${idx}:`, value);

        // Update local state immediately for responsive UI
        setLocalCompanyValues(prev => ({
            ...prev,
            [idx]: value
        }));

        // Clear existing timeout for this domain
        if (debounceTimeouts.current[idx]) {
            clearTimeout(debounceTimeouts.current[idx]);
        }

        // Debounce the form update to reduce re-renders
        debounceTimeouts.current[idx] = setTimeout(() => {
            const newDomains = [...domains];
            newDomains[idx] = { ...newDomains[idx], company: value };
            console.log("Setting new domains (debounced):", newDomains);
            setValue("domains", newDomains, { shouldValidate: false, shouldDirty: true });
        }, 300); // 300ms debounce
    }, [domains, setValue]);

    const handleCertificateChange = async (idx, file) => {
        if (!file) {
            // Remove certificate
            const newDomains = [...domains];
            newDomains[idx] = {
                ...newDomains[idx],
                certificate: [],
                certificateName: ""
            };
            setValue("domains", newDomains, { shouldValidate: true, shouldDirty: true });
            return;
        }

        try {
            const url = await uploadImage(file, "certificateImage");
            if (url) {
                const newDomains = [...domains];
                newDomains[idx] = {
                    ...newDomains[idx],
                    certificate: [url], // ✅ store only URL for backend
                    certificateName: file.name // 👀 store name for UI
                };
                setValue("domains", newDomains, { shouldValidate: true, shouldDirty: true });
            }
        } catch (err) {
            console.error("Failed to upload certificate:", err);
        }
    };

    const handleSkillToggle = (idx, skill) => {
        const newDomains = [...domains];
        const domain = { ...newDomains[idx] };
        const exists = domain.skills.some((s) => s.skill_id === skill.skill_id);

        domain.skills = exists
            ? domain.skills.filter((s) => s.skill_id !== skill.skill_id)
            : [...domain.skills, skill];

        newDomains[idx] = domain;
        setValue("domains", newDomains, { shouldValidate: true, shouldDirty: true });
    };

    const filteredDomains = allDomains.filter((domain) => {
        const domainName = domain.domain_name || domain.name || domain;
        return domainName.toLowerCase().includes(searchInput.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <Label>Areas of Interest</Label>
                <div className="flex items-center border rounded-md px-3 py-2 mb-2">
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

                {searchInput.trim() && filteredDomains.length > 0 && (
                    <div className="mb-3">
                        <div className="text-xs mb-2 text-gray-500 font-medium">Matched domains</div>
                        <div className="flex flex-wrap gap-2">
                            {filteredDomains.slice(0, 8).map((domain, idx) => (
                                <button
                                    key={domain.id || idx}
                                    type="button"
                                    className="bg-blue-50 text-blue-700 rounded-md px-3 py-1.5 text-sm font-medium border border-blue-100 hover:bg-blue-100"
                                    onClick={() => handleAddDomain(domain)}
                                >
                                    {domain.domain_name || domain.name || domain} +
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {domains.map((domain, idx) => {
                    const skills = getDomainSkills(domain);
                    // Use a more stable key that doesn't change when the domain object is modified
                    const stableKey = domain._tempId || domain.id || `domain-${idx}`;

                    return (
                        <div
                            key={stableKey}
                            className="border rounded-lg p-4 bg-white hover:shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                        {domain.name}
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-400 hover:text-red-500"
                                        onClick={() => handleRemoveDomain(idx)}
                                    >
                                        <FaTimes className="h-3 w-3" />
                                    </button>
                                </div>

                                <div>
                                    <input
                                        id={`cert-${stableKey}`}
                                        type="file"
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleCertificateChange(idx, e.target.files[0])}
                                    />
                                    <label
                                        htmlFor={`cert-${stableKey}`}
                                        className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                                    >
                                        {domain.certificate ? "Change Certificate" : "Upload Certificate"}
                                    </label>
                                </div>
                            </div>

                            {domain.certificate && (
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-3">
                                    <span className="text-xs font-medium text-green-600 truncate max-w-xs">
                                        {domain.certificateName || "Uploaded file"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCertificateChange(idx, null)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {skills.length > 0 && (
                                <div className="mt-4">
                                    <div className="text-sm text-gray-700 mb-2">
                                        Select related skills for {domain.name}:
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {skills.map((skill, skillIdx) => {
                                            const isSelected = domain.skills.some(
                                                (s) => s.skill_id === skill.skill_id
                                            );
                                            return (
                                                <button
                                                    key={skill.skill_id || skillIdx}
                                                    type="button"
                                                    onClick={() => handleSkillToggle(idx, skill)}
                                                    className={`px-3 py-1.5 rounded-full text-sm border ${isSelected
                                                        ? "bg-blue-100 text-blue-800 border-blue-200 font-medium"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                                                        }`}
                                                >
                                                    {skill.skill_name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <Label>Where did you learn this skill?</Label>
                                <input
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="College/Company name"
                                    value={localCompanyValues[idx] || domain.company || ""} // Use local state first
                                    onChange={(e) => {
                                        console.log(`Input change for domain ${idx}, value:`, e.target.value);
                                        handleCompanyChange(idx, e.target.value);
                                    }}
                                    onFocus={() => console.log(`Input focused for domain ${idx}`)}
                                    onBlur={() => console.log(`Input blurred for domain ${idx}`)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}