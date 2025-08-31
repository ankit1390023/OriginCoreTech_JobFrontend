import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { jobPostApi } from "../../api/jobPostApi";


import { useMasterData } from "../../hooks/master/useMasterData";
import {
  Input,
  Button,
  Textarea,
  Select,
  SuccessMessage,
  ErrorMessage,
  Label,
} from "../../components/ui";
import SignUpLayout from "../../components/layout/SignUpLayout";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import { useSelector } from "react-redux";

// Searchable Job Role Select Component
const JobRoleSearchableSelect = ({ jobRoles, value, onChange, placeholder, error }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredRoles = jobRoles.filter(role =>
    role.title.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  const selectedRole = jobRoles.find(role => role.id === value);
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
        <input
          type="text"
          className="flex-1 outline-none text-sm"
          placeholder={selectedRole ? selectedRole.title : placeholder}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && searchInput.trim() && filteredRoles.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredRoles.slice(0, 8).map((role) => (
            <button
              key={role.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors"
              onClick={() => {
                onChange(role.id);
                setSearchInput("");
                setShowDropdown(false);
              }}
            >
              <div>
                {role.title}
                {/* {role.description && (
                  <div className="text-xs text-gray-500 mt-0.5 font-light">{role.description}</div>
                )} */}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedRole && (
        <div className="mt-1 text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedRole.title}</span>
          <button
            type="button"
            className="ml-2 text-red-500 hover:text-red-700 text-xs"
            onClick={() => {
              onChange("");
              setSearchInput("");
            }}
          >
            Remove
          </button>
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Domain-based Skills Selector Component
const DomainSkillsSelector = ({ 
  domains, 
  getSkillsForDomain, 
  onSkillsChange, 
  error,
  // Props from parent for state management
  selectedDomains,
  setSelectedDomains,
  domainSkillsMap,
  setDomainSkillsMap,
  selectedSkillsByDomain,
  setSelectedSkillsByDomain,
  showMoreSkillsMap,
  setShowMoreSkillsMap
}) => {
  const [searchInput, setSearchInput] = useState("");

  // Debounce search input
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchInput(searchInput), 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter domains based on search
  const filteredDomains = domains.filter(domain =>
    domain.domain_name.toLowerCase().includes(debouncedSearchInput.toLowerCase())
  );

  const handleAddDomain = (domain) => {
    if (!selectedDomains.find(d => d.domain_id === domain.domain_id)) {
      const skills = getSkillsForDomain(domain.domain_id);
      setDomainSkillsMap(prev => ({ ...prev, [domain.domain_id]: skills }));
      setSelectedSkillsByDomain(prev => ({ ...prev, [domain.domain_id]: [] }));
      setShowMoreSkillsMap(prev => ({ ...prev, [domain.domain_id]: false }));
      setSelectedDomains([...selectedDomains, domain]);
    }
    setSearchInput("");
  };

  const handleRemoveDomain = (domainId) => {
    setSelectedDomains(selectedDomains.filter(d => d.domain_id !== domainId));
    setDomainSkillsMap(prev => { const copy = { ...prev }; delete copy[domainId]; return copy; });
    setSelectedSkillsByDomain(prev => { const copy = { ...prev }; delete copy[domainId]; return copy; });
    setShowMoreSkillsMap(prev => { const copy = { ...prev }; delete copy[domainId]; return copy; });
    
    // Update parent component with remaining skill IDs
    setTimeout(() => {
      const remainingSkillIds = Object.values(selectedSkillsByDomain).flat().filter(id => {
        // Remove skills from deleted domain
        const domainSkills = domainSkillsMap[domainId] || [];
        return !domainSkills.some(skill => skill.skill_id === id);
      });
      onSkillsChange(remainingSkillIds);
    }, 0);
  };

  const toggleSkill = (domainId, skillId) => {
    setSelectedSkillsByDomain(prev => {
      const current = prev[domainId] || [];
      const newSelection = {
        ...prev,
        [domainId]: current.includes(skillId)
          ? current.filter(id => id !== skillId)
          : [...current, skillId],
      };
      
      // Update parent component with all selected skill IDs
      const allSelectedSkillIds = Object.values(newSelection).flat();
      onSkillsChange(allSelectedSkillIds);
      
      return newSelection;
    });
  };

  const toggleShowMoreSkills = (domainId) => {
    setShowMoreSkillsMap(prev => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  return (
    <div>
      <Label htmlFor="skills">Skills Required</Label>
      
      {/* Domain Search */}
      <div className="flex items-center border rounded-md px-2 py-2 mb-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
        <input
          type="text"
          className="flex-1 outline-none text-sm"
          placeholder="Search and add domains..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Matched Domains */}
      {searchInput.trim() && filteredDomains.length > 0 && (
        <div className="mb-3">
          <div className="text-xs mb-2 text-gray-500">Matched domains</div>
          <div className="flex flex-wrap gap-2">
            {filteredDomains.slice(0, 8).map((domain) => (
              <button
                key={domain.domain_id}
                type="button"
                onClick={() => handleAddDomain(domain)}
                className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 text-xs border border-blue-300 hover:border-blue-400 transition-all duration-200"
              >
                {domain.domain_name} +
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No matches found */}
      {searchInput.trim() && filteredDomains.length === 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-500">
            No domains found matching "{searchInput}"
          </div>
        </div>
      )}

      {/* Selected Domains + Skills */}
      <div className="space-y-3">
        {selectedDomains.map((domain) => (
          <div key={domain.domain_id} className="border rounded-md p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                {domain.domain_name}
              </span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => handleRemoveDomain(domain.domain_id)}
              >
                Remove
              </button>
            </div>

            {/* Skills for this domain */}
            {domainSkillsMap[domain.domain_id] && (
              <div>
                <div className="text-xs mb-2 text-gray-500">
                  Select skills for {domain.domain_name}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {(showMoreSkillsMap[domain.domain_id]
                    ? domainSkillsMap[domain.domain_id]
                    : domainSkillsMap[domain.domain_id].slice(0, 6)
                  ).map((skill) => (
                    <button
                      key={skill.skill_id}
                      type="button"
                      onClick={() => toggleSkill(domain.domain_id, skill.skill_id)}
                      className={`rounded-md px-2 py-1 text-xs border transition-all duration-200 ${
                        (selectedSkillsByDomain[domain.domain_id] || []).includes(skill.skill_id)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {skill.skill_name}
                    </button>
                  ))}
                </div>

                {/* Show more/less button */}
                {domainSkillsMap[domain.domain_id].length > 6 && (
                  <button
                    type="button"
                    onClick={() => toggleShowMoreSkills(domain.domain_id)}
                    className="text-blue-500 underline text-xs mt-2"
                  >
                    {showMoreSkillsMap[domain.domain_id] ? "Show less" : "Show more"}
                  </button>
                )}

                {/* Selected skills count */}
                {(selectedSkillsByDomain[domain.domain_id] || []).length > 0 && (
                  <div className="text-xs text-green-600 mt-2">
                    Selected: {(selectedSkillsByDomain[domain.domain_id] || []).length} skill(s)
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Searchable Duration Select Component
const DurationSearchableSelect = ({ durations, value, onChange, placeholder, error }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredDurations = durations.filter(duration =>
    duration.value.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  const selectedDuration = durations.find(duration => duration.id === value);
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
        <input
          type="text"
          className="flex-1 outline-none text-sm"
          placeholder={selectedDuration ? selectedDuration.value : placeholder}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && searchInput.trim() && filteredDurations.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredDurations.slice(0, 8).map((duration) => (
            <button
              key={duration.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors"
              onClick={() => {
                onChange(duration.id);
                setSearchInput("");
                setShowDropdown(false);
              }}
            >
              {duration.value}
            </button>
          ))}
        </div>
      )}
      
      {/* Show no matches found */}
      {showDropdown && searchInput.trim() && filteredDurations.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2">
          <div className="text-sm text-gray-500">
            No durations found matching "{searchInput}"
          </div>
        </div>
      )}
      
      {selectedDuration && (
        <div className="mt-1 text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedDuration.value}</span>
          <button
            type="button"
            className="ml-2 text-red-500 hover:text-red-700 text-xs"
            onClick={() => {
              onChange("");
              setSearchInput("");
            }}
          >
            Remove
          </button>
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Multi-select Location Component  
const LocationMultiSelect = ({ locations, value = [], onChange, placeholder, error }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchInput.toLowerCase()) &&
    !value.includes(location.id)
  );
  
  const selectedLocations = locations.filter(location => value.includes(location.id));
  
  const addLocation = (locationId) => {
    if (!value.includes(locationId)) {
      onChange([...value, locationId]);
    }
    setSearchInput("");
  };
  
  const removeLocation = (locationId) => {
    onChange(value.filter(id => id !== locationId));
  };
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
        <input
          type="text"
          className="flex-1 outline-none text-sm"
          placeholder={selectedLocations.length > 0 ? "Add more cities..." : placeholder}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && searchInput.trim() && filteredLocations.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredLocations.slice(0, 10).map((location) => (
            <button
              key={location.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors"
              onClick={() => {
                addLocation(location.id);
                setShowDropdown(false);
              }}
            >
              {location.name}
            </button>
          ))}
        </div>
      )}
      
      {/* Show no matches found */}
      {showDropdown && searchInput.trim() && filteredLocations.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2">
          <div className="text-sm text-gray-500">
            No cities found matching "{searchInput}"
          </div>
        </div>
      )}
      
      {/* Selected locations */}
      {selectedLocations.length > 0 && (
        <div className="mt-1 text-sm text-gray-600">
          Selected: {selectedLocations.map((location, index) => (
            <span key={location.id}>
              <span className="font-medium">{location.name}</span>
              <button
                type="button"
                className="ml-1 text-red-500 hover:text-red-700 text-xs"
                onClick={() => removeLocation(location.id)}
              >
                Remove
              </button>
              {index < selectedLocations.length - 1 && <span className="mx-2">•</span>}
            </span>
          ))}
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Multi-select College Component
const CollegeMultiSelect = ({ colleges, value = [], onChange, placeholder, error }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchInput.toLowerCase()) &&
    !value.includes(college.id)
  );
  
  const selectedColleges = colleges.filter(college => value.includes(college.id));
  
  const addCollege = (collegeId) => {
    if (!value.includes(collegeId)) {
      onChange([...value, collegeId]);
    }
    setSearchInput("");
  };
  
  const removeCollege = (collegeId) => {
    onChange(value.filter(id => id !== collegeId));
  };
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
        <input
          type="text"
          className="flex-1 outline-none text-sm"
          placeholder={selectedColleges.length > 0 ? "Add more colleges..." : placeholder}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && searchInput.trim() && filteredColleges.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredColleges.slice(0, 10).map((college) => (
            <button
              key={college.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors"
              onClick={() => {
                addCollege(college.id);
                setShowDropdown(false);
              }}
            >
              {college.name}
            </button>
          ))}
        </div>
      )}
      
      {/* Show no matches found */}
      {showDropdown && searchInput.trim() && filteredColleges.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2">
          <div className="text-sm text-gray-500">
            No colleges found matching "{searchInput}"
          </div>
        </div>
      )}
      
      {/* Selected colleges */}
      {selectedColleges.length > 0 && (
        <div className="mt-1 text-sm text-gray-600">
          Selected: {selectedColleges.map((college, index) => (
            <span key={college.id}>
              <span className="font-medium">{college.name}</span>
              <button
                type="button"
                className="ml-1 text-red-500 hover:text-red-700 text-xs"
                onClick={() => removeCollege(college.id)}
              >
                Remove
              </button>
              {index < selectedColleges.length - 1 && <span className="mx-2">•</span>}
            </span>
          ))}
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Multi-select Course Component
const CourseMultiSelect = ({ courses, value = [], onChange, placeholder, error }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchInput.toLowerCase()) &&
    !value.includes(course.id)
  );
  
  const selectedCourses = courses.filter(course => value.includes(course.id));
  
  const addCourse = (courseId) => {
    if (!value.includes(courseId)) {
      onChange([...value, courseId]);
    }
    setSearchInput("");
  };
  
  const removeCourse = (courseId) => {
    onChange(value.filter(id => id !== courseId));
  };
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 border-gray-300 hover:border-gray-400">
        <input
          type="text"
          className="flex-1 outline-none text-sm"
          placeholder={selectedCourses.length > 0 ? "Add more courses..." : placeholder}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && searchInput.trim() && filteredCourses.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredCourses.slice(0, 10).map((course) => (
            <button
              key={course.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors"
              onClick={() => {
                addCourse(course.id);
                setShowDropdown(false);
              }}
            >
              {course.name}
            </button>
          ))}
        </div>
      )}
      
      {/* Show no matches found */}
      {showDropdown && searchInput.trim() && filteredCourses.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2">
          <div className="text-sm text-gray-500">
            No courses found matching "{searchInput}"
          </div>
        </div>
      )}
      
      {/* Selected courses */}
      {selectedCourses.length > 0 && (
        <div className="mt-1 text-sm text-gray-600">
          Selected: {selectedCourses.map((course, index) => (
            <span key={course.id}>
              <span className="font-medium">{course.name}</span>
              <button
                type="button"
                className="ml-1 text-red-500 hover:text-red-700 text-xs"
                onClick={() => removeCourse(course.id)}
              >
                Remove
              </button>
              {index < selectedCourses.length - 1 && <span className="mx-2">•</span>}
            </span>
          ))}
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const formSchema = z
  .object({
    opportunity_type: z.enum(["Internship", "Job", "Project"]),
    profile: z.union([z.string(), z.number()]).optional(),
    skills: z.array(z.number()).min(1, { message: "Skills are required" }),
    internshipType: z.string().optional(),
    job_type: z.enum(["In office", "Hybrid", "Remote"]).optional(),
    job_time: z.enum(["Day Shift", "Night Shift", "Part-time"]),
    city: z.array(z.number()).min(1, { message: "At least one city is required" }),
    onlyThisCity: z.boolean().optional(),
    openings: z.union([z.string(), z.number()]).optional(),
    startDateType: z.string().optional(),
    startDateFrom: z.string().optional(),
    startDateTo: z.string().optional(),
    inOfficeDays: z.string().optional(),
    jobTitle: z.union([z.string(), z.number()]).optional(),
    duration: z.union([z.string(), z.number()]).optional(),
    responsibilities: z
      .string()
      .min(1, { message: "Responsibilities required" }),
    preferences: z.string().optional(),
    womenOnly: z.boolean().optional(),
    stipend_type: z.string().optional(),
    stipend_min: z.union([z.string(), z.number()]).optional(),
    stipend_max: z.union([z.string(), z.number()]).optional(),
    stipendMode: z.string().optional(),
    incentivesMin: z.union([z.string(), z.number()]).optional(),
    incentivesMax: z.union([z.string(), z.number()]).optional(),
    incentivesMode: z.string().optional(),
    perks: z.array(z.string()).optional(),
    ppo: z.string().optional(),
    screening_questions: z.union([z.string(), z.array(z.string())]).optional(),
    alternatePhone: z.string().optional(),
    phone_contact: z.string().optional(),
    college_name: z.array(z.number()).optional(),
    course: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    // Common validation for all opportunity types
    if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Skills are required",
        path: ["skills"],
      });
    }

    if (!data.city || !Array.isArray(data.city) || data.city.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one city is required",
        path: ["city"],
      });
    }

    if (!data.responsibilities || data.responsibilities.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Responsibilities are required",
        path: ["responsibilities"],
      });
    }

    if (!data.job_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select work schedule",
        path: ["job_time"],
      });
    }

    // Conditional validation for internship fields
    if (data.opportunity_type === "Internship") {
      if (!data.profile || (typeof data.profile === 'string' && data.profile.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internship profile is required",
          path: ["profile"],
        });
      }
      if (!data.internshipType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internship type is required",
          path: ["internshipType"],
        });
      }
      if (!data.startDateType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date type is required",
          path: ["startDateType"],
        });
      }
      if (!data.duration || (typeof data.duration === 'string' && data.duration.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internship duration is required",
          path: ["duration"],
        });
      }
      if (!data.openings || (typeof data.openings === 'string' && data.openings.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of openings is required",
          path: ["openings"],
        });
      }

      // Validate custom date range
      if (data.startDateType === "Custom") {
        if (!data.startDateFrom || !data.startDateTo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Custom date range is required",
            path: ["startDateFrom"],
          });
        }
        if (new Date(data.startDateFrom) > new Date(data.startDateTo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date",
            path: ["startDateTo"],
          });
        }
      }

      // Validate stipend for internships
      if (data.stipend_type === "Paid") {
        if (
          !data.stipend_min ||
          !data.stipend_max ||
          (typeof data.stipend_min === 'string' && data.stipend_min.trim() === "") ||
          (typeof data.stipend_max === 'string' && data.stipend_max.trim() === "")
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Stipend amount is required for paid internships",
            path: ["stipend_min"],
          });
        }
        if (Number(data.stipend_min) > Number(data.stipend_max)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Maximum stipend must be greater than minimum",
            path: ["stipend_max"],
          });
        }
      }
    }

    // Conditional validation for job fields
    if (data.opportunity_type === "Job") {
      if (!data.jobTitle || (typeof data.jobTitle === 'string' && data.jobTitle.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job title is required",
          path: ["jobTitle"],
        });
      }
      if (!data.job_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job type is required",
          path: ["job_type"],
        });
      }

      // Jobs have fixed pay (stipend_min/stipend_max), not stipend type
      if (
        !data.stipend_min ||
        !data.stipend_max ||
        (typeof data.stipend_min === 'string' && data.stipend_min.trim() === "") ||
        (typeof data.stipend_max === 'string' && data.stipend_max.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Fixed pay amount is required",
          path: ["stipend_min"],
        });
      }
      if (Number(data.stipend_min) > Number(data.stipend_max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum pay must be greater than minimum",
          path: ["stipend_max"],
        });
      }
    }

    // Conditional validation for project fields
    if (data.opportunity_type === "Project") {
      if (!data.jobTitle || (typeof data.jobTitle === 'string' && data.jobTitle.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project title is required",
          path: ["jobTitle"],
        });
      }
      if (!data.job_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project type is required",
          path: ["job_type"],
        });
      }
      if (!data.openings || (typeof data.openings === 'string' && data.openings.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of openings is required",
          path: ["openings"],
        });
      }
      if (!data.phone_contact || (typeof data.phone_contact === 'string' && data.phone_contact.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone contact is required",
          path: ["phone_contact"],
        });
      }

      // Projects have budget (stipend_min/stipend_max)
      if (
        !data.stipend_min ||
        !data.stipend_max ||
        (typeof data.stipend_min === 'string' && data.stipend_min.trim() === "") ||
        (typeof data.stipend_max === 'string' && data.stipend_max.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project budget is required",
          path: ["stipend_min"],
        });
      }
      if (Number(data.stipend_min) > Number(data.stipend_max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum budget must be greater than minimum",
          path: ["stipend_max"],
        });
      }
    }
  });

export default function RecruiterPostJobInternDetails() {
  console.log('RecruiterPostJobInternDetails: Component rendered');
  
  const navigate = useNavigate();
  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      opportunity_type: "Internship",
      internshipType: "In office",
      job_type: "In office",
      job_time: "Day Shift",
      startDateType: "Immediately",
      stipend_type: "Paid",
      stipend_min: "",
      stipend_max: "",
      stipendMode: "Month",
      incentivesMin: "",
      incentivesMax: "",
      incentivesMode: "Month",
      city: [],
      onlyThisCity: false,
      startDateFrom: "",
      startDateTo: "",
      inOfficeDays: "",
      jobTitle: "",
      profile: "",
      skills: [],
      duration: "",
      responsibilities: "",
      openings: "",
      phone_contact: "",
      alternatePhone: "",
      college_name: [],
      course: [],
      preferences: "",
      womenOnly: false,
      perks: [],
      screening_questions: "",
      ppo: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // New state for domain-based skill selection
  const [allDomains, setAllDomains] = useState([]);
  const [domainSkills, setDomainSkills] = useState({});
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [domainError, setDomainError] = useState("");
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [showAllDomains, setShowAllDomains] = useState(false);
  // Add state to track if device is small
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  // Skills selection state management (moved from child component)
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [domainSkillsMap, setDomainSkillsMap] = useState({});
  const [selectedSkillsByDomain, setSelectedSkillsByDomain] = useState({});
  const [showMoreSkillsMap, setShowMoreSkillsMap] = useState({});

  

  // Master data hook for all master data (mock data)
  const {
    masterData,
    durations,
    locations,
    courses,
    jobRoles,
    specializations,
    domains,
    skillsByDomain,
    specializationByCourse,
    schoolColleges,
    getSkillsForDomain,
    getSpecializationsForCourse,
    isLoading: masterDataLoading,
    isError: masterDataError,
    error: masterDataErrorMsg,
    refetch: refetchMasterData,
  } = useMasterData();


  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 1024); // lg breakpoint
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  // Fetch all domains on component mount
  useEffect(() => {
    if (token) {
      fetchAllDomains(token);
    } else {
      setDomainError("Authentication required. Please log in again.");
    }
  }, [token]);

  const fetchAllDomains = async (authToken) => {
    try {
      setDomainsLoading(true);
      setDomainError("");
      if (!authToken) throw new Error("No authentication token available");
      // Use domainApi.getAllDomains to fetch domains from backend
      const domainsData = await domainApi.getAllDomains(authToken);
      setAllDomains(domainsData);
    } catch (error) {
      if (error.response?.status === 401) {
        setDomainError("Authentication expired. Please log in again.");
      } else {
        setDomainError("Failed to load domains. Please try again.");
      }
    } finally {
      setDomainsLoading(false);
    }
  };

  const handleDomainClick = async (domainName) => {
    try {
      setSelectedDomain(domainName);
      // Find the domain object by name
      const domainObj = allDomains.find(
        (d) => (typeof d === "string" ? d : d.name) === domainName
      );
      const domainId =
        typeof domainObj === "string"
          ? domainObj
          : domainObj?.id || domainObj?.name;
      // Only fetch if not already loaded
      if (!domainSkills[domainName]) {
        setSkillsLoading(true);
        if (!token) throw new Error("No authentication token available");
        // Use domainApi.getSkillsByDomain to fetch skills from backend
        const skills = await domainApi.getSkillsByDomain(domainId, token); // <-- CORRECT
        setDomainSkills((prev) => ({
          ...prev,
          [domainName]: skills,
        }));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setDomainError("Authentication expired. Please log in again.");
      } else {
        setDomainError("Failed to load skills for this domain.");
      }
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSelectAllSkills = () => {
    if (selectedDomain && domainSkills[selectedDomain]) {
      const skills = domainSkills[selectedDomain];
      const currentSkills = methods.getValues("skills");
      const skillsText = skills.join(", ");

      if (currentSkills) {
        const updatedSkills =
          currentSkills +
          (currentSkills.endsWith(",") ? " " : ", ") +
          skillsText;
        methods.setValue("skills", updatedSkills);
      } else {
        methods.setValue("skills", skillsText);
      }
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const onSubmit = async (data) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Opportunity type:", data.opportunity_type);
    console.log("Form data:", data);
    
    console.log("=== RUNNING VALIDATION ===");
    const isValid = await methods.trigger();
    console.log("Validation result:", isValid);

    if (!isValid) {
      // Get specific error messages
      console.log("=== VALIDATION FAILED ===");
      console.log("Form errors:", methods.formState.errors);
      const errorMessages = Object.values(methods.formState.errors)
        .map((error) => error?.message)
        .filter(Boolean);
      console.log("Error messages:", errorMessages);
      
      setErrorMessage(
        errorMessages.length > 0
          ? errorMessages.join(", ")
          : "Please fill in all required fields correctly."
      );
      return;
    }

    console.log("=== VALIDATION PASSED ===");
    console.log("Proceeding to API call...");

    setIsSubmitting(true);

    // Transform form data to match the exact backend API structure
    const jobPostData = {
      company_recruiter_profile_id: user?.id || user?.company_recruiter_profile_id, // Get from user data
      opportunity_type: data.opportunity_type,
      job_role_id: data.opportunity_type === "Internship" ? parseInt(data.profile) : parseInt(data.jobTitle), // Backend expects job_role_id (number)
      skill_ids: Array.isArray(data.skills) ? data.skills.map(id => parseInt(id)) : [], // Backend expects skill_ids (array of numbers)
      skill_required_note: Array.isArray(data.skills) ? null : data.skills,
      job_type: data.opportunity_type === "Internship" ? data.internshipType : data.job_type,
      job_time: data.job_time, // Direct mapping from form
      days_in_office: data.inOfficeDays ? parseInt(data.inOfficeDays) : null, // Integer
      number_of_openings: data.openings ? parseInt(data.openings) : null, // Integer
      job_description: data.responsibilities,
      candidate_preferences: data.preferences || null,
      women_preferred: data.womenOnly || false, // Boolean
      stipend_type: data.opportunity_type === "Job" ? "Fixed" : data.stipend_type,
      stipend_min: data.stipend_min ? parseInt(data.stipend_min) : null, // Integer
      stipend_max: data.stipend_max ? parseInt(data.stipend_max) : null, // Integer
      incentive_per_year: data.incentivesMin && data.incentivesMax
        ? `${data.incentivesMin}-${data.incentivesMax} ${data.incentivesMode || "Month"}`
        : "Performance based",
      perks: data.perks && Array.isArray(data.perks) ? data.perks : [], // Array of strings
      screening_questions: data.screening_questions 
        ? data.screening_questions.split('\n').filter(q => q.trim() !== '')
        : [], // Array of strings
      phone_contact: data.phone_contact || null,
      alternate_phone_number: data.alternatePhone || null,
      eligible_city_ids: Array.isArray(data.city) ? data.city : [], // Already array of numbers
      
      // TODO: REMOVE THIS - Backend incorrectly expects internship_start_date for all opportunity types
      // This field should only be required for Internship type, but backend currently validates it for Job/Project too
      internship_start_date: data.opportunity_type === "Internship" 
        ? (data.startDateType === "Immediately" ? new Date().toISOString().split('T')[0] : (data.startDateFrom || null))
        : new Date().toISOString().split('T')[0], // Send current date for Job/Project as workaround
      
      // Only include internship-specific fields for Internship opportunity type
      ...(data.opportunity_type === "Internship" && {
        duration_id: parseInt(data.duration), // Backend expects duration_id (number)
        is_custom_internship_date: data.startDateType === "Custom", // Boolean
        eligible_college_ids: Array.isArray(data.college_name) ? data.college_name : [], // Already array of numbers
        eligible_course_ids: Array.isArray(data.course) ? data.course : [], // Already array of numbers
      }),
    };

    // Get authentication token

    if (!token) {
      setErrorMessage("Authentication token not found. Please log in again.");
      return;
    }
    console.log("=== SENDING API REQUEST ===");
    console.log("Job post data:", jobPostData);

    try {
      // Call the API
      const response = await jobPostApi.createJobPost(jobPostData, token);
      console.log("=== API SUCCESS ===");
      console.log("Response:", response);
      setSuccessMessage(`${data.opportunity_type} posted successfully!`);

      // Reset form after successful submission
      methods.reset();
      setSelectedDomain(null);
      setDomainSkills({});
      setShowAllDomains(false);
alert("Your post has been submitted successfully! You will be redirected to the dashboard shortly.");
      clearMessages();
      // Redirect to recruiter dashboard after successful posting
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 2000); // 2 second delay to show success message
    } catch (error) {
      console.log("=== API ERROR ===");
      console.log("Error:", error);
      console.log("Error response:", error.response);
      setErrorMessage("Failed to post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input styles
  const radioStyles =
    "w-3 h-3 text-blue-600 border-gray-300 focus:outline-none focus:ring-0";
  const checkboxStyles =
    "w-3 h-3 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-0";
  const radioContainerStyles =
    "flex gap-3 p-2 border border-gray-300 rounded-lg bg-white";

  // Watch startDateType for conditional rendering
  const startDateType = methods.watch("startDateType");
  // Watch stipend_type for conditional rendering
  const stipend_type = methods.watch("stipend_type");
  // Watch internshipType for conditional rendering
  const internshipType = methods.watch("internshipType");
  // Watch opportunity_type for conditional rendering
  const opportunity_type = methods.watch("opportunity_type");
  // Watch job_type for conditional rendering
  const job_type = methods.watch("job_type");

  // Clear validation errors when opportunity type changes
  const handleOpportunityTypeChange = (e) => {
    const newType = e.target.value;

    // Reset entire form to empty values but keep the new opportunity type
    methods.reset({
      opportunity_type: newType,
      internshipType: "",
      job_type: "",
      job_time: "",
      startDateType: "",
      stipend_type: "",
      stipend_min: "",
      stipend_max: "",
      stipendMode: "",
      incentivesMin: "",
      incentivesMax: "",
      incentivesMode: "",
      city: [],
      onlyThisCity: false,
      startDateFrom: "",
      startDateTo: "",
      inOfficeDays: "",
      jobTitle: "",
      profile: "",
      skills: [],
      duration: "",
      responsibilities: "",
      openings: "",
      phone_contact: "",
      alternatePhone: "",
      college_name: [],
      course: [],
      preferences: "",
      womenOnly: false,
      perks: [],
      screening_questions: "",
      ppo: "",
    });

    // Clear any existing validation errors
    methods.clearErrors();

    // Clear success and error messages
    setSuccessMessage("");
    setErrorMessage("");

    // Clear domain-related state (legacy)
    setSelectedDomain(null);
    setDomainError("");
    setShowAllDomains(false);

    // Clear skills selection state
    setSelectedDomains([]);
    setDomainSkillsMap({});
    setSelectedSkillsByDomain({});
    setShowMoreSkillsMap({});
  };

  const FormContent = () => {
    return (
      <div className="w-full max-w-full p-6 mt-4 bg-white shadow-none rounded-xl sm:shadow-xl sm:max-w-2xl sm:p-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Success Message */}
            {successMessage && (
              <div className="relative">
                <SuccessMessage size="large">{successMessage}</SuccessMessage>
                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  className="absolute text-green-600 top-2 right-2 hover:text-green-800 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="relative">
                <ErrorMessage size="large">{errorMessage}</ErrorMessage>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="absolute text-red-600 top-2 right-2 hover:text-red-800 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Opportunity Type */}
            <div>
              <Label htmlFor="opportunity_type">Opportunity type</Label>
              <div className={radioContainerStyles}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Internship"
                    className={radioStyles}
                    checked={opportunity_type === "Internship"}
                    onChange={handleOpportunityTypeChange}
                  />
                  <span className="text-sm text-gray-700">Internship</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Job"
                    className={radioStyles}
                    checked={opportunity_type === "Job"}
                    onChange={handleOpportunityTypeChange}
                  />
                  <span className="text-sm text-gray-700">Job</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Project"
                    className={radioStyles}
                    checked={opportunity_type === "Project"}
                    onChange={handleOpportunityTypeChange}
                  />
                  <span className="text-sm text-gray-700">Project</span>
                </label>
              </div>
            </div>

            {/* Job title (only for Job and Project) - Searchable */}
            {(opportunity_type === "Job" || opportunity_type === "Project") && (
              <div>
                <Label htmlFor="jobTitle">
                  {opportunity_type === "Job" ? "Job title" : "Project title"}
                </Label>
                <JobRoleSearchableSelect
                  jobRoles={jobRoles}
                  value={methods.watch("jobTitle")}
                  onChange={(value) => methods.setValue("jobTitle", value)}
                  placeholder={
                    opportunity_type === "Job"
                      ? "Search job titles..."
                      : "Search project titles..."
                  }
                  error={methods.formState.errors.jobTitle?.message}
                />
              </div>
            )}

            {/* Internship Profile (only for Internship) - Searchable */}
            {opportunity_type === "Internship" && (
              <div>
                <Label htmlFor="profile">Internship profile</Label>
                <JobRoleSearchableSelect
                  jobRoles={jobRoles}
                  value={methods.watch("profile")}
                  onChange={(value) => methods.setValue("profile", value)}
                  placeholder="Search internship profiles..."
                  error={methods.formState.errors.profile?.message}
                />
              </div>
            )}

            {/* Domain-based Skill Selection */}
            <DomainSkillsSelector
              domains={domains}
              getSkillsForDomain={getSkillsForDomain}
              onSkillsChange={(skillIds) => methods.setValue("skills", skillIds)}
              error={methods.formState.errors.skills?.message}
              selectedDomains={selectedDomains}
              setSelectedDomains={setSelectedDomains}
              domainSkillsMap={domainSkillsMap}
              setDomainSkillsMap={setDomainSkillsMap}
              selectedSkillsByDomain={selectedSkillsByDomain}
              setSelectedSkillsByDomain={setSelectedSkillsByDomain}
              showMoreSkillsMap={showMoreSkillsMap}
              setShowMoreSkillsMap={setShowMoreSkillsMap}
            />

            {/* Internship Type */}
            {opportunity_type === "Internship" && (
              <>
                <div>
                  <Label htmlFor="internshipType">Internship type</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="In office"
                        className={radioStyles}
                        {...methods.register("internshipType")}
                      />
                      <span className="text-sm text-gray-700">In office</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Hybrid"
                        className={radioStyles}
                        {...methods.register("internshipType")}
                      />
                      <span className="text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Remote"
                        className={radioStyles}
                        {...methods.register("internshipType")}
                      />
                      <span className="text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>
                {/* No. of in-office days in a week (for Hybrid) */}
                {internshipType === "Hybrid" && (
                  <div className="my-3">
                    <Label htmlFor="inOfficeDays">
                      No. of in-office days in a week:
                    </Label>
                    <div className="flex gap-1 sm:gap-3 md:gap-8">
                      {[1, 2, 3, 4, 5].map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`w-10 h-10 rounded-full border text-sm font-semibold flex items-center justify-center
                              ${
                                methods.getValues("inOfficeDays") ===
                                String(day)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300"
                              }
                              hover:border-blue-400 transition`}
                          onClick={() =>
                            methods.setValue("inOfficeDays", String(day), {
                              shouldValidate: true,
                            })
                          }
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internship start date (only for Internship) */}
                <div>
                  <Label htmlFor="startDateType">Internship start date</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Immediately"
                        className={radioStyles}
                        {...methods.register("startDateType")}
                      />
                      <span className="text-sm text-gray-700">
                        Immediately (within 30 days)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Custom"
                        className={radioStyles}
                        {...methods.register("startDateType")}
                      />
                      <span className="text-sm text-gray-700">Custom</span>
                    </label>
                  </div>
                </div>

                {/* Show date pickers if Custom is selected */}
                {startDateType === "Custom" && (
                  <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:gap-3">
                    <div className="flex-1">
                      <Input
                        label="From"
                        type="date"
                        {...methods.register("startDateFrom")}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="To"
                        type="date"
                        {...methods.register("startDateTo")}
                      />
                    </div>
                  </div>
                )}

                {/* Internship duration (only for Internship) - Select Dropdown */}
                <div>
                  <Label htmlFor="duration">Internship duration</Label>
                  <select
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 cursor-pointer"
                    {...methods.register("duration")}
                  >
                    <option value="">Select duration</option>
                    {durations.map((duration) => (
                      <option key={duration.id} value={duration.id}>
                        {duration.value}
                      </option>
                    ))}
                  </select>
                  {methods.formState.errors.duration?.message && (
                    <p className="mt-1 text-sm text-red-600">{methods.formState.errors.duration?.message}</p>
                  )}
                </div>

                {/* Intern's responsibility (only for Internship) */}
                <Textarea
                  label="Intern's responsibility"
                  rows={4}
                  placeholder="Selected intern day-to-day responsibilities include..."
                  error={methods.formState.errors.responsibilities?.message}
                  {...methods.register("responsibilities")}
                />
              </>
            )}

            {/* Job type (only for Job) */}
            {opportunity_type === "Job" && (
              <>
                <div>
                  <Label htmlFor="job_type">Job type</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="In office"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">In office</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Hybrid"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Remote"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>

                {/* Job description */}
                <Textarea
                  label="Job description"
                  rows={4}
                  placeholder={"Key responsibilities:\n1.\n2.\n3."}
                  error={methods.formState.errors.responsibilities?.message}
                  {...methods.register("responsibilities")}
                />

                {/* Additional candidate preferences */}
                <Textarea
                  label="Additional candidate preferences"
                  rows={3}
                  placeholder="e.g. Candidates pursuing B.Tech. preferred"
                  {...methods.register("preferences")}
                />

                {/* Women only checkbox */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    className={checkboxStyles}
                    {...methods.register("womenOnly")}
                  />
                  <span className="text-sm text-gray-700">
                    Allow applications from women who are willing to
                    start/restart their career.
                  </span>
                </div>

                {/* Fixed pay (per year) */}
                <div>
                  <Label htmlFor="stipend_min">Fixed pay (per year)</Label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("stipend_min")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("stipend_max")}
                    />
                  </div>
                </div>

                {/* Variables/Incentives (per year) */}
                <div>
                  <Label htmlFor="incentivesMin">
                    Variables/ Incentives (per year)
                  </Label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("incentivesMin")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("incentivesMax")}
                    />
                  </div>
                </div>

                {/* Perks (Job-specific) */}
                <div>
                  <Label htmlFor="perks">Perks: (Select all that apply)</Label>
                  <div className="grid grid-cols-1 gap-2 p-3 rounded-lg md:grid-cols-2 bg-gray-50">
                    {[
                      "5 days a week",
                      "Health Insurance",
                      "Life Insurance",
                    ].map((perk) => (
                      <label
                        key={perk}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={perk}
                          className={checkboxStyles}
                          {...methods.register("perks")}
                        />
                        <span className="text-sm text-gray-700">{perk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Screening Questions */}
                <div>
                  <Label htmlFor="screening_questions">
                    Screening Questions
                  </Label>
                  <Textarea
                    rows={4}
                    placeholder="Add screening questions (one per line):&#10;1. Please confirm your availability for this job&#10;2. How early would you be able to join?&#10;3. Add your own questions..."
                    {...methods.register("screening_questions")}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter each question on a new line. Each line will be treated as a separate question.
                  </p>
                </div>

                {/* Primary phone number */}
                <div>
                  <Label htmlFor="phone_contact">Primary phone number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 text-sm text-gray-600 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9812345678"
                      className="flex-1 px-3 py-2 text-sm border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...methods.register("phone_contact")}
                    />
                  </div>
                  {methods.formState.errors.phone_contact?.message && (
                    <p className="mt-1 text-sm text-red-600">{methods.formState.errors.phone_contact?.message}</p>
                  )}
                </div>

                {/* Alternate phone number */}
                <div>
                  <Label htmlFor="alternatePhone">
                    Alternate phone number for this listing (Optional)
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 text-sm text-gray-600 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="flex-1 px-3 py-2 text-sm border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...methods.register("alternatePhone")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Project type (only for Project) */}
            {opportunity_type === "Project" && (
              <>
                <div>
                  <Label htmlFor="job_type">Project type</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="In office"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">In office</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Hybrid"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Remote"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>

                {/* Project description */}
                <Textarea
                  label="Project description"
                  rows={4}
                  placeholder={"Project requirements:\n1.\n2.\n3."}
                  error={methods.formState.errors.responsibilities?.message}
                  {...methods.register("responsibilities")}
                />

                {/* Additional candidate preferences */}
                <Textarea
                  label="Additional candidate preferences"
                  rows={3}
                  placeholder="e.g. Experience with similar projects preferred"
                  {...methods.register("preferences")}
                />

                {/* Women only checkbox */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    className={checkboxStyles}
                    {...methods.register("womenOnly")}
                  />
                  <span className="text-sm text-gray-700">
                    Allow applications from women who are willing to
                    start/restart their career.
                  </span>
                </div>

                {/* Project budget */}
                <div>
                  <Label htmlFor="stipend_min">Project budget</Label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("stipend_min")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("stipend_max")}
                    />
                  </div>
                </div>

                {/* Screening Questions */}
                <div>
                  <Label htmlFor="screening_questions">
                    Screening Questions
                  </Label>
                  <Textarea
                    rows={4}
                    placeholder="Add screening questions (one per line):&#10;1. Please confirm your availability for this project&#10;2. Share your relevant project experience&#10;3. Add your own questions..."
                    {...methods.register("screening_questions")}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter each question on a new line. Each line will be treated as a separate question.
                  </p>
                </div>

                {/* Primary phone number */}
                <div>
                  <Label htmlFor="phone_contact">Primary phone number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 text-sm text-gray-600 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9812345678"
                      className="flex-1 px-3 py-2 text-sm border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...methods.register("phone_contact")}
                    />
                  </div>
                  {methods.formState.errors.phone_contact?.message && (
                    <p className="mt-1 text-sm text-red-600">{methods.formState.errors.phone_contact?.message}</p>
                  )}
                </div>

                {/* Alternate phone number */}
                <div>
                  <Label htmlFor="alternatePhone">
                    Alternate phone number for this listing (Optional)
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 text-sm text-gray-600 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="flex-1 px-3 py-2 text-sm border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...methods.register("alternatePhone")}
                    />
                  </div>
                </div>

                {/* Number of openings for Project */}
                <Input
                  label="Number of openings"
                  type="number"
                  placeholder="e.g. 2"
                  min="1"
                  error={methods.formState.errors.openings?.message}
                  {...methods.register("openings")}
                />
              </>
            )}

            {/* City/Cities - Searchable */}
            <div>
              <Label htmlFor="city">City/Cities</Label>
              {masterDataLoading ? (
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-600">Loading cities...</p>
                </div>
              ) : masterDataError ? (
                <div className="p-2 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-xs text-red-800">{masterDataErrorMsg}</p>
                  <button
                    type="button"
                    onClick={() => refetchMasterData()}
                    className="mt-1 text-xs text-red-600 underline hover:text-red-800"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <LocationMultiSelect
                  locations={locations}
                  value={methods.watch("city")}
                  onChange={(value) => methods.setValue("city", value)}
                  placeholder="Search and select cities..."
                  error={methods.formState.errors.city?.message}
                />
              )}
            </div>

            {/* Only this city checkbox */}
            <div className="flex items-center gap-3 p-2 mt-[10px] rounded-lg">
              <input
                type="checkbox"
                className={checkboxStyles}
                {...methods.register("onlyThisCity")}
              />
              <span className="text-sm text-gray-700">
                Candidates from ONLY the above cities should be allowed to apply.
              </span>
            </div>

            {/* Job Time (Common for all opportunity types) */}
            <div>
              <Label htmlFor="job_time">Work Schedule</Label>
              <div className={radioContainerStyles}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Day Shift"
                    className={radioStyles}
                    {...methods.register("job_time")}
                  />
                  <span className="text-sm text-gray-700">Day Shift</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Night Shift"
                    className={radioStyles}
                    {...methods.register("job_time")}
                  />
                  <span className="text-sm text-gray-700">Night Shift</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Part-time"
                    className={radioStyles}
                    {...methods.register("job_time")}
                  />
                  <span className="text-sm text-gray-700">Part-time</span>
                </label>
              </div>
            </div>

            {/* Number of openings */}
            {opportunity_type === "Internship" && (
              <Input
                label="Number of openings"
                type="number"
                placeholder="e.g. 4"
                min="1"
                error={methods.formState.errors.openings?.message}
                {...methods.register("openings")}
              />
            )}

            {/* Stipend */}
            {opportunity_type !== "Job" && opportunity_type !== "Project" && (
              <div>
                <Label htmlFor="stipend_type">Stipend</Label>
                <div className={radioContainerStyles}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Paid"
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">Paid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Unpaid"
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">Unpaid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Fixed"
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">Fixed</span>
                  </label>
                </div>
                {stipend_type === "Paid" && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("stipend_min")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("stipend_max")}
                    />
                    <select
                      className="w-full px-3 py-2 text-sm transition-all duration-200 bg-white border border-gray-300 rounded-lg sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...methods.register("stipendMode")}
                    >
                      <option value="Month" className="text-sm">
                        Month
                      </option>
                      <option value="Lump sum" className="text-sm">
                        Lump sum
                      </option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* College Name & Course (Internship only, below stipend) */}
            {opportunity_type === "Internship" && (
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <Label htmlFor="college_name">College Name</Label>
                  <span className="ml-2 align-middle inline-block px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-300">
                    PRO Plan
                  </span>
                </div>
                {masterDataLoading ? (
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-gray-600">Loading colleges...</p>
                  </div>
                ) : masterDataError ? (
                  <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-800">{masterDataErrorMsg}</p>
                    <button
                      type="button"
                      onClick={() => refetchMasterData()}
                      className="mt-1 text-xs text-red-600 underline hover:text-red-800"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <CollegeMultiSelect
                    colleges={schoolColleges}
                    value={methods.watch("college_name")}
                    onChange={(value) => methods.setValue("college_name", value)}
                    placeholder="Search and select colleges..."
                    error={methods.formState.errors.college_name?.message}
                  />
                )}
                <div className="flex items-center mt-2 mb-4">
                  <input
                    type="checkbox"
                    className={checkboxStyles}
                    id="onlyThisCollege"
                  />
                  <label
                    htmlFor="onlyThisCollege"
                    className="ml-2 text-sm text-gray-500"
                  >
                    Candidates from ONLY the above colleges should be allowed to
                    apply.
                  </label>
                </div>

                <div>
                  <Label htmlFor="course">Course</Label>
                  {masterDataLoading ? (
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-gray-600">Loading courses...</p>
                    </div>
                  ) : masterDataError ? (
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-sm text-red-800">{masterDataErrorMsg}</p>
                      <button
                        type="button"
                        onClick={() => refetchMasterData()}
                        className="mt-1 text-xs text-red-600 underline hover:text-red-800"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <CourseMultiSelect
                      courses={courses}
                      value={methods.watch("course")}
                      onChange={(value) => methods.setValue("course", value)}
                      placeholder="Search and select courses..."
                      error={methods.formState.errors.course?.message}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Incentives */}
            {opportunity_type !== "Job" &&
              opportunity_type !== "Project" &&
              stipend_type === "Paid" && (
                <div>
                  <Label htmlFor="incentivesMin">Incentives</Label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("incentivesMin")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("incentivesMax")}
                    />
                    <select
                      className="w-full px-3 py-2 text-sm transition-all duration-200 bg-white border border-gray-300 rounded-lg sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...methods.register("incentivesMode")}
                    >
                      <option value="Month" className="text-sm">
                        Month
                      </option>
                      <option value="Lump sum" className="text-sm">
                        Lump sum
                      </option>
                    </select>
                  </div>
                </div>
              )}

            {/* Perks */}
            {opportunity_type !== "Job" && opportunity_type !== "Project" && (
              <div>
                <Label htmlFor="perks">Perks (Select all that apply)</Label>
                <div className="grid grid-cols-1 gap-2 p-3 rounded-lg sm:grid-cols-2 sm:gap-3 bg-gray-50">
                  {[
                    "Certificate of completion",
                    "Letter of recommendation",
                    "Flexible work hours",
                    "5 days a week",
                    "Informal dress code",
                    "Free snacks & beverages",
                    "Pre-placement offer (PPO)",
                  ].map((perk) => (
                    <label
                      key={perk}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={perk}
                        className={checkboxStyles}
                        {...methods.register("perks")}
                      />
                      <span className="text-sm text-gray-700">{perk}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* PPO Question */}
            {opportunity_type === "Internship" && (
              <div className="flex flex-col items-start gap-2 p-3 rounded-lg sm:flex-row sm:items-center sm:gap-3 bg-gray-50">
                <input
                  type="radio"
                  value="Yes"
                  className={radioStyles}
                  {...methods.register("ppo")}
                />
                <span className="text-sm font-semibold text-blue-700">
                  Does this internship come with a pre-placement offer (PPO)?
                </span>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-row justify-between gap-2 pt-4 mt-6 border-t border-gray-200 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => alert("Draft saved (not implemented)")}
              >
                Save Draft
              </Button>
              <Button type="submit" loading={isSubmitting} variant="primary">
                {isSubmitting ? "Posting..." : `Post ${opportunity_type}`}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  };

  // Replace layout logic with SignUpLayout for all devices
  return (
    <SignUpLayout
      heading="Post Internship/Job"
      subheading="Post your internship/job to attract the best candidates."
      hideMobileIllustration={true}
    >
      <div className="relative flex w-full min-h-screen overflow-hidden md:items-center md:justify-center">
        {/* Form */}
        <div className="flex justify-center flex-1 w-full mt-6 md:mt-0">
          <FormContent />
        </div>
      </div>
    </SignUpLayout>
  );
}
