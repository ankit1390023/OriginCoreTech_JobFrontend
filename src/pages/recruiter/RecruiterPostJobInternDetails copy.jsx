import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

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
import { useSelector } from "react-redux";

// ==================== ZOD VALIDATION SCHEMAS ====================

// Base schema with common fields
const baseJobPostSchema = z.object({
  opportunity_type: z.enum(["Internship", "Job", "Project"]),
  job_role_id: z.number({ invalid_type_error: "Job role is required" }).positive("Job role is required"),
  skill_ids: z.array(z.number()).min(1, "At least one skill is required"),
  job_type: z.enum(["In office", "Hybrid", "Remote"], {
    required_error: "Job type is required",
    invalid_type_error: "Job type is required"
  }),
  days_in_office: z.number().nullable().optional(),
  job_time: z.enum(["Day Shift", "Night Shift", "Part-time"], {
    required_error: "Work schedule is required",
    invalid_type_error: "Work schedule is required"
  }),
  number_of_openings: z.number({ invalid_type_error: "Number of openings must be a number" })
    .positive("Number of openings must be at least 1"),
  job_description: z.string().min(10, "Description is required (minimum 10 characters)"),
  candidate_preferences: z.string().optional(),
  women_preferred: z.boolean().optional(),
  stipend_type: z.enum(["Paid", "Unpaid", "Fixed"]).optional(),
  stipend_min: z.number().nullable().optional(),
  stipend_max: z.number().nullable().optional(),
  incentive_per_year: z.string().optional(),
  perks: z.array(z.string()).optional(),
  screening_questions: z.union([z.string(), z.array(z.string())]).optional(),
  phone_contact: z.string().min(10, "Phone number is required"),
  alternate_phone_number: z.string().optional().nullable(),
  eligiblecity_ids: z.array(z.number()).min(1, "At least one city is required"),
});

// Internship-specific extensions
const internshipSchema = baseJobPostSchema.extend({
  duration_id: z.number({ invalid_type_error: "Duration is required" }).positive("Duration is required"),
  internship_start_date: z.string().optional(),
  internship_from_date: z.string().optional(),
  internship_to_date: z.string().optional(),
  is_custom_internship_date: z.boolean().optional(),
  eligiblecollege_ids: z.array(z.number()).optional(),
  eligiblecourse_ids: z.array(z.number()).optional(),
});

// Job-specific extensions
const jobSchema = baseJobPostSchema.extend({
  // Jobs use Fixed stipend type by default
});

// Project-specific extensions
const projectSchema = baseJobPostSchema.extend({
  // Projects are similar to jobs
});

// Main schema with conditional validation
const jobPostSchema = z.object({
  opportunity_type: z.enum(["Internship", "Job", "Project"]),
  job_role_id: z.number().positive("Job role is required"),
  skill_ids: z.array(z.number()).min(1, "At least one skill is required"),
  job_type: z.enum(["In office", "Hybrid", "Remote"]),
  days_in_office: z.number().nullable().optional(),
  job_time: z.enum(["Day Shift", "Night Shift", "Part-time"]),
  number_of_openings: z.number().positive("Number of openings is required"),
  job_description: z.string().min(10, "Description is required (minimum 10 characters)"),
  candidate_preferences: z.string().optional(),
  women_preferred: z.boolean().optional(),
  stipend_type: z.enum(["Paid", "Unpaid", "Fixed"]).optional(),
  stipend_min: z.number().nullable().optional(),
  stipend_max: z.number().nullable().optional(),
  incentive_per_year: z.string().optional(),
  perks: z.array(z.string()).optional(),
  screening_questions: z.union([z.string(), z.array(z.string())]).optional(),
  phone_contact: z.string().min(10, "Phone number is required"),
  alternate_phone_number: z.string().optional().nullable(),
  eligiblecity_ids: z.array(z.number()).min(1, "At least one city is required"),
  duration_id: z.union([z.number(), z.string(), z.undefined()]).optional(),
  internship_start_date: z.string().optional(),
  internship_from_date: z.string().optional(),
  internship_to_date: z.string().optional(),
  is_custom_internship_date: z.boolean().optional(),
  eligiblecollege_ids: z.array(z.number()).optional(),
  eligiblecourse_ids: z.array(z.number()).optional(),
}).superRefine((data, ctx) => {
  // Conditional validations based on opportunity type
  if (data.opportunity_type === "Internship") {
    // Duration is required for internships only
    if (!data.duration_id || (typeof data.duration_id === 'number' && data.duration_id <= 0) || data.duration_id === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Internship duration is required",
        path: ["duration_id"],
      });
    }
    
    if (data.is_custom_internship_date) {
      if (!data.internship_from_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date is required",
          path: ["internship_from_date"],
        });
      }
      if (!data.internship_to_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date is required",
          path: ["internship_to_date"],
        });
      }
      if (data.internship_from_date && data.internship_to_date) {
        const fromDate = new Date(data.internship_from_date);
        const toDate = new Date(data.internship_to_date);
        if (fromDate > toDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date",
            path: ["internship_to_date"],
          });
        }
      }
    }
  }

  // Stipend validation
  if ((data.opportunity_type === "Internship" && data.stipend_type === "Paid") ||
      (data.opportunity_type === "Job" && data.stipend_type === "Fixed") ||
      (data.opportunity_type === "Project")) {
    
    if (data.stipend_min == null || data.stipend_max == null) {
      const fieldType = data.opportunity_type === "Internship" ? "stipend" : 
                       data.opportunity_type === "Job" ? "salary" : "budget";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${fieldType} range is required`,
        path: ["stipend_min"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${fieldType} range is required`,
        path: ["stipend_max"],
      });
    } else if (data.stipend_min > data.stipend_max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum amount must be greater than minimum",
        path: ["stipend_max"],
      });
    }
  }

  // Removed duplicate validation - handled in the consolidated block above

  // Hybrid job type requires days in office
  if (data.job_type === "Hybrid" && (!data.days_in_office || data.days_in_office <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Number of in-office days is required for hybrid positions",
      path: ["days_in_office"],
    });
  }
});

// ==================== REUSABLE COMPONENTS ====================

// Generic Searchable Select Component (like in skills form)
const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Search...",
  error,
  isMulti = false,
  getOptionLabel = (option) => option.label || option.name || option.title || String(option),
  getOptionValue = (option) => option.value || option.id,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredOptions = options.filter(option =>
    getOptionLabel(option).toLowerCase().includes(searchInput.toLowerCase())
  );

  // Handle selection
  const handleSelect = (option) => {
    const optionValue = getOptionValue(option);
    
    if (isMulti) {
      // For multi-select, toggle the value
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValue);
    } else {
      // For single-select
      onChange(optionValue);
      setSearchInput("");
      setShowDropdown(false);
    }
  };

  // Handle removal for multi-select tags
  const handleRemove = (optionValue) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      onChange(currentValues.filter(v => v !== optionValue));
    }
  };

  // Get selected options for display
  const getSelectedOptions = () => {
    if (isMulti) {
      return Array.isArray(value) 
        ? options.filter(opt => value.includes(getOptionValue(opt)))
        : [];
    } else {
      return options.find(opt => getOptionValue(opt) === value) || null;
    }
  };

  const selectedOptions = getSelectedOptions();

  return (
    <div className="relative">
      <div className="flex items-center px-2 py-2 transition-all duration-200 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent hover:border-gray-400">
        <input
          type="text"
          className="flex-1 text-sm outline-none"
          placeholder={
            isMulti 
              ? (Array.isArray(selectedOptions) && selectedOptions.length 
                  ? `${selectedOptions.length} selected` 
                  : placeholder)
              : (selectedOptions 
                  ? getOptionLabel(selectedOptions) 
                  : placeholder)
          }
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && searchInput.trim() && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-48">
          {filteredOptions.slice(0, 10).map((option) => {
            const optionValue = getOptionValue(option);
            const isSelected = isMulti 
              ? Array.isArray(value) && value.includes(optionValue)
              : value === optionValue;
              
            return (
              <button
                key={optionValue}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors ${
                  isSelected ? 'bg-blue-100 text-blue-800' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {getOptionLabel(option)}
                {isSelected && (
                  <span className="float-right text-blue-600">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Display selected items for multi-select */}
      {isMulti && Array.isArray(selectedOptions) && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedOptions.map((option) => (
            <span key={getOptionValue(option)} className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
              {getOptionLabel(option)}
              <button
                type="button"
                className="ml-1 text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemove(getOptionValue(option));
                }}
              >
                <FaTimes className="w-2 h-2" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Display selected item for single-select */}
      {!isMulti && selectedOptions && (
        <div className="mt-1 text-sm text-gray-600">
          Selected: <span className="font-medium">{getOptionLabel(selectedOptions)}</span>
          <button
            type="button"
            className="ml-2 text-xs text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.preventDefault();
              onChange(null);
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


// // Domain and Skills Selector Component
// const DomainSkillsSelector = ({ 
//   domains = [], 
//   getSkillsForDomain,
//   onSkillsChange,
//   error
// }) => {
//   const [selectedDomains, setSelectedDomains] = useState([]);
//   const [domainSkillsMap, setDomainSkillsMap] = useState({});
//   const [selectedSkillsByDomain, setSelectedSkillsByDomain] = useState({});
//   const [searchInput, setSearchInput] = useState("");

//   // Filter domains based on search
//   const filteredDomains = domains.filter(domain =>
//     (domain.domain_name || domain.name || '').toLowerCase().includes(searchInput.toLowerCase())
//   );

//   // Add domain function
//   const handleAddDomain = (domain) => {
//     const domainId = domain.domain_id || domain.id;
//     const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
    
//     // Check if already selected
//     if (!selectedDomains.find(d => (d.domain_id || d.id) === domainId)) {
//       // Get skills for this domain
//       const skills = getSkillsForDomain(domainId) || [];
      
//       // Update all states
//       setSelectedDomains(prev => [...prev, { ...domain, id: domainId, name: domainName }]);
//       setDomainSkillsMap(prev => ({ ...prev, [domainId]: skills }));
//       setSelectedSkillsByDomain(prev => ({ ...prev, [domainId]: [] }));
//     }
    
//     setSearchInput("");
//   };

//   // Remove domain function
//   const handleRemoveDomain = (domainId) => {
//     // Remove domain from selected list
//     setSelectedDomains(prev => prev.filter(d => (d.domain_id || d.id) !== domainId));
    
//     // Remove from skills map
//     setDomainSkillsMap(prev => {
//       const newMap = { ...prev };
//       delete newMap[domainId];
//       return newMap;
//     });
    
//     // Remove from selected skills and notify parent
//     setSelectedSkillsByDomain(prev => {
//       const newMap = { ...prev };
//       delete newMap[domainId];
      
//       // Notify parent of remaining skills
//       const allRemainingSkills = Object.values(newMap).flat();
//       onSkillsChange(allRemainingSkills.map(s => s.skill_id));
      
//       return newMap;
//     });
//   };

//   // Toggle skill selection
//   const toggleSkill = (domainId, skill) => {
//     setSelectedSkillsByDomain(prev => {
//       const currentSkills = prev[domainId] || [];
//       const skillExists = currentSkills.some(s => s.skill_id === skill.skill_id);
      
//       // Toggle the skill
//       const updatedSkills = skillExists
//         ? currentSkills.filter(s => s.skill_id !== skill.skill_id)
//         : [...currentSkills, { skill_id: skill.skill_id, skill_name: skill.skill_name }];
      
//       // Update state for this domain
//       const newSelection = {
//         ...prev,
//         [domainId]: updatedSkills,
//       };
      
//       // Collect ALL selected skills and notify parent
//       const allSelectedSkills = Object.values(newSelection).flat();
//       onSkillsChange(allSelectedSkills.map(s => s.skill_id));
      
//       return newSelection;
//     });
//   };

//   return (
//     <div>
//       <Label htmlFor="skills">Skills Required</Label>
      
//       {/* Domain Search */}
//       <div className="flex items-center px-2 py-2 mb-2 transition-all duration-200 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent hover:border-gray-400">
//         <input
//           type="text"
//           className="flex-1 text-sm outline-none"
//           placeholder="Search and add domains..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//         />
//       </div>

//       {/* Matched Domains */}
//       {searchInput.trim() && filteredDomains.length > 0 && (
//         <div className="mb-3">
//           <div className="mb-2 text-xs text-gray-500">Matched domains</div>
//           <div className="flex flex-wrap gap-2">
//             {filteredDomains.slice(0, 8).map((domain) => {
//               const domainId = domain.domain_id || domain.id;
//               const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
//               return (
//                 <button
//                   key={domainId}
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleAddDomain(domain);
//                   }}
//                   className="px-2 py-1 text-xs text-blue-800 transition-all duration-200 bg-blue-100 border border-blue-300 rounded-md hover:border-blue-400"
//                 >
//                   {domainName} +
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Selected Domains + Skills */}
//       <div className="space-y-3">
//         {selectedDomains.map((domain) => {
//           const domainId = domain.domain_id || domain.id;
//           const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
//           const skills = domainSkillsMap[domainId] || [];
//           const selectedSkills = selectedSkillsByDomain[domainId] || [];
          
//           return (
//             <div key={domainId} className="flex flex-col gap-2 p-3 border rounded-md">
//               <div className="flex items-center justify-between">
//                 <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md">
//                   {domainName}
//                 </span>
//                 <button
//                   type="button"
//                   className="text-xs text-red-500 hover:text-red-700"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleRemoveDomain(domainId);
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>

//               {/* Skills for this domain */}
//               {skills.length > 0 && (
//                 <div>
//                   <div className="mb-2 text-xs text-gray-500">
//                     Select skills for {domainName}:
//                   </div>
//                   <div className="flex flex-wrap gap-1">
//                     {skills.map((skill) => {
//                       const isSelected = selectedSkills.some(s => s.skill_id === skill.skill_id);
//                       return (
//                         <button
//                           key={`${domainId}-${skill.skill_id}`} // UNIQUE KEY
//                           type="button"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             toggleSkill(domainId, skill);
//                           }}
//                           className={`rounded-md px-2 py-1 text-xs border transition-all duration-200 ${
//                             isSelected
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400"
//                           }`}
//                         >
//                           {skill.skill_name}
//                         </button>
//                       );
//                     })}
//                   </div>

//                   {selectedSkills.length > 0 && (
//                     <div className="mt-2 text-xs text-green-600">
//                       Selected: {selectedSkills.length} skill(s)
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };















// const DomainSkillsSelector = ({ 
//   domains = [], 
//   getSkillsForDomain,
//   onSkillsChange,
//   error
// }) => {
//   const [searchInput, setSearchInput] = useState("");
//   const [selectedDomains, setSelectedDomains] = useState([]);
//   const [domainSkillsCache, setDomainSkillsCache] = useState({}); // Cache skills by domain ID

//   // Filter domains based on search
//   const filteredDomains = domains.filter(domain =>
//     (domain.domain_name || domain.name || '').toLowerCase().includes(searchInput.toLowerCase())
//   );

//   // Add domain
//   const handleAddDomain = (domain) => {
//     const domainId = domain.domain_id || domain.id;
//     const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
    
//     // Check if already selected
//     if (!selectedDomains.find(d => (d.domain_id || d.id) === domainId)) {
//       // Get skills for this domain (cache them)
//       const skills = getSkillsForDomain(domainId) || [];
      
//       setSelectedDomains(prev => [...prev, { ...domain, id: domainId, name: domainName }]);
//       setDomainSkillsCache(prev => ({ ...prev, [domainId]: skills }));
//     }
    
//     setSearchInput("");
//   };

//   // Remove domain
//   const handleRemoveDomain = (domainId) => {
//     const newSelectedDomains = selectedDomains.filter(d => (d.domain_id || d.id) !== domainId);
//     setSelectedDomains(newSelectedDomains);
    
//     // Remove from cache
//     setDomainSkillsCache(prev => {
//       const newCache = { ...prev };
//       delete newCache[domainId];
//       return newCache;
//     });
    
//     // Recalculate all selected skills
//     const allSelectedSkills = newSelectedDomains
//       .flatMap(domain => domain.selectedSkills || [])
//       .map(skill => skill.skill_id);
//     onSkillsChange(allSelectedSkills);
//   };

//   // Toggle skill for a domain
//   const toggleSkill = (domainId, skill) => {
//     setSelectedDomains(prev => {
//       return prev.map(domain => {
//         if ((domain.domain_id || domain.id) === domainId) {
//           const currentSkills = domain.selectedSkills || [];
//           const skillExists = currentSkills.some(s => s.skill_id === skill.skill_id);
          
//           const updatedSkills = skillExists
//             ? currentSkills.filter(s => s.skill_id !== skill.skill_id)
//             : [...currentSkills, { skill_id: skill.skill_id, skill_name: skill.skill_name }];
          
//           // Update the domain with selected skills
//           const updatedDomain = { ...domain, selectedSkills: updatedSkills };
          
//           // Notify parent of all selected skills
//           const allSelectedSkills = [...selectedDomains]
//             .map(d => d.id === domainId ? updatedDomain : d)
//             .flatMap(d => d.selectedSkills || [])
//             .map(s => s.skill_id);
//           onSkillsChange(allSelectedSkills);
          
//           return updatedDomain;
//         }
//         return domain;
//       });
//     });
//   };

//   return (
//     <div>
//       <Label htmlFor="skills">Skills Required</Label>
      
//       {/* Domain Search */}
//       <div className="flex items-center px-2 py-2 mb-2 transition-all duration-200 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent hover:border-gray-400">
//         <input
//           type="text"
//           className="flex-1 text-sm outline-none"
//           placeholder="Search and add domains..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//         />
//       </div>

//       {/* Matched Domains */}
//       {searchInput.trim() && filteredDomains.length > 0 && (
//         <div className="mb-3">
//           <div className="mb-2 text-xs text-gray-500">Matched domains</div>
//           <div className="flex flex-wrap gap-2">
//             {filteredDomains.slice(0, 8).map((domain) => {
//               const domainId = domain.domain_id || domain.id;
//               const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
//               return (
//                 <button
//                   key={domainId}
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleAddDomain(domain);
//                   }}
//                   className="px-2 py-1 text-xs text-blue-800 transition-all duration-200 bg-blue-100 border border-blue-300 rounded-md hover:border-blue-400"
//                 >
//                   {domainName} +
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Selected Domains + Skills */}
//       <div className="space-y-3">
//         {selectedDomains.map((domain) => {
//           const domainId = domain.domain_id || domain.id;
//           const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
//           const skills = domainSkillsCache[domainId] || [];
//           const selectedSkills = domain.selectedSkills || [];
          
//           return (
//             <div key={domainId} className="flex flex-col gap-2 p-3 border rounded-md">
//               <div className="flex items-center justify-between">
//                 <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md">
//                   {domainName}
//                 </span>
//                 <button
//                   type="button"
//                   className="text-xs text-red-500 hover:text-red-700"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleRemoveDomain(domainId);
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>

//               {/* Skills for this domain */}
//               {skills.length > 0 && (
//                 <div>
//                   <div className="mb-2 text-xs text-gray-500">
//                     Select skills for {domainName}:
//                   </div>
//                   <div className="flex flex-wrap gap-1">
//                     {skills.map((skill) => {
//                       const isSelected = selectedSkills.some(s => s.skill_id === skill.skill_id);
//                       return (
//                         <button
//                           key={skill.skill_id}
//                           type="button"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             toggleSkill(domainId, skill);
//                           }}
//                           className={`rounded-md px-2 py-1 text-xs border transition-all duration-200 ${
//                             isSelected
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400"
//                           }`}
//                         >
//                           {skill.skill_name}
//                         </button>
//                       );
//                     })}
//                   </div>

//                   {selectedSkills.length > 0 && (
//                     <div className="mt-2 text-xs text-green-600">
//                       Selected: {selectedSkills.length} skill(s)
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };


const DomainSkillsSelector = ({ 
  domains = [], 
  getSkillsForDomain,
  onSkillsChange,
  error,
  selectedDomainSkills = [], // Controlled by parent
  onDomainSkillsChange // Update parent state
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [domainSkillsCache, setDomainSkillsCache] = useState({});

  // Filter domains based on search
  const filteredDomains = domains.filter(domain =>
    (domain.domain_name || domain.name || '').toLowerCase().includes(searchInput.toLowerCase())
  );

  // Add domain
  const handleAddDomain = (domain) => {
    // console.log("🔵 handleAddDomain called with:", domain);
    
    const domainId = domain.domain_id || domain.id;
    const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
    
    // console.log("🔵 Processing - domainId:", domainId, "domainName:", domainName);
    
    // Check if already selected
    if (!selectedDomainSkills.find(d => (d.domain_id || d.id) === domainId)) {
      // console.log("🔵 Domain not found in selected, adding...");
      
      // Get skills for this domain (cache them)
      const skills = getSkillsForDomain(domainId) || [];
      // console.log("🔵 Got skills for domain:", skills.length, "skills");
      
      const newDomainSkills = [...selectedDomainSkills, { ...domain, id: domainId, name: domainName, selectedSkills: [] }];
      onDomainSkillsChange(newDomainSkills);
      setDomainSkillsCache(prev => ({ ...prev, [domainId]: skills }));
      
      // console.log("🔵 Domain added successfully");
    } else {
      // console.log("🔵 Domain already exists in selected domains");
    }
    
    setSearchInput("");
  };

  // Remove domain
  const handleRemoveDomain = (domainId) => {
    // console.log("🟡 Removing domain:", domainId);
    
    const remainingDomains = selectedDomainSkills.filter(d => (d.domain_id || d.id) !== domainId);
    onDomainSkillsChange(remainingDomains);
    
    setDomainSkillsCache(prev => {
      const newCache = { ...prev };
      delete newCache[domainId];
      return newCache;
    });
    
    // Notify parent with remaining skills
    const allSkills = remainingDomains.flatMap(d => d.selectedSkills || []).map(s => s.skill_id);
    onSkillsChange(allSkills);
  };

  // Toggle skill for a domain
  const toggleSkill = (domainId, skill) => {
    // console.log("🔴 Toggling skill:", skill.skill_name, "for domain:", domainId);
    
    const updatedDomains = selectedDomainSkills.map(domain => {
      const currentDomainId = domain.domain_id || domain.id;
      
      if (currentDomainId === domainId) {
        const currentSkills = domain.selectedSkills || [];
        const skillExists = currentSkills.some(s => s.skill_id === skill.skill_id);
        
        const updatedSkills = skillExists
          ? currentSkills.filter(s => s.skill_id !== skill.skill_id)
          : [...currentSkills, { skill_id: skill.skill_id, skill_name: skill.skill_name }];
        
        const updatedDomain = { ...domain, selectedSkills: updatedSkills };
        // console.log("🔴 Updated domain with skills:", updatedDomain);
        
        return updatedDomain;
      }
      return domain;
    });
    
    // Update parent state and notify
    onDomainSkillsChange(updatedDomains);
    
    // Notify parent of skill changes
    const allSkills = updatedDomains.flatMap(d => d.selectedSkills || []).map(s => s.skill_id);
    onSkillsChange(allSkills);
  };

  return (
    <div>
      <Label htmlFor="skills">Skills Required</Label>
      
      {/* Domain Search */}
      <div className="flex items-center px-2 py-2 mb-2 transition-all duration-200 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-transparent hover:border-gray-400">
        <input
          type="text"
          className="flex-1 text-sm outline-none"
          placeholder="Search and add domains..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Matched Domains */}
      {searchInput.trim() && filteredDomains.length > 0 && (
        <div className="mb-3">
          <div className="mb-2 text-xs text-gray-500">Matched domains</div>
          <div className="flex flex-wrap gap-2">
            {filteredDomains.slice(0, 8).map((domain) => {
              const domainId = domain.domain_id || domain.id;
              const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
              return (
                <button
                  key={domainId}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // console.log("🔵 Domain button clicked:", domain);
                    handleAddDomain(domain);
                  }}
                  className="px-2 py-1 text-xs text-blue-800 transition-all duration-200 bg-blue-100 border border-blue-300 rounded-md hover:border-blue-400"
                >
                  {domainName} +
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Domains + Skills */}
      <div className="space-y-3">
        {selectedDomainSkills.map((domain, index) => {
          const domainId = domain.domain_id || domain.id;
          const domainName = domain.domain_name || domain.name || `Domain ${domainId}`;
          
          // Get skills for this domain - fetch directly without causing re-renders
          const skills = domainSkillsCache[domainId] || getSkillsForDomain(domainId) || [];
          const selectedSkills = domain.selectedSkills || [];
          
          return (
            <div key={domainId} className="flex flex-col gap-2 p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md">
                  {domainName}
                </span>
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveDomain(domainId);
                  }}
                >
                  Remove
                </button>
              </div>

              {/* Skills for this domain */}
              {skills.length > 0 && (
                <div>
                  <div className="mb-2 text-xs text-gray-500">
                    Select skills for {domainName}:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill) => {
                      const isSelected = selectedSkills.some(s => s.skill_id === skill.skill_id);
                      return (
                        <button
                          key={skill.skill_id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSkill(domainId, skill);
                          }}
                          className={`rounded-md px-2 py-1 text-xs border transition-all duration-200 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {skill.skill_name}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSkills.length > 0 && (
                    <div className="mt-2 text-xs text-green-600">
                      Selected: {selectedSkills.length} skill(s)
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};





 

// ==================== MAIN COMPONENT ====================
export default function RecruiterPostJobInternDetails() {
  // console.log("🔄 RecruiterPostJobInternDetails component rendered/re-rendered");
  
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      opportunity_type: "Internship",
      job_role_id: "",
      skill_ids: [],
      job_type: "In office",
      days_in_office: null,
      job_time: "Day Shift",
      number_of_openings: "",
      job_description: "",
      candidate_preferences: "",
      women_preferred: false,
      stipend_type: "Paid",
      stipend_min: null,
      stipend_max: null,
      incentive_per_year: "",
      perks: [],
      screening_questions: "",
      phone_contact: "",
      alternate_phone_number: "",
      eligiblecity_ids: [],
      duration_id: undefined,
      internship_start_date: "",
      internship_from_date: "",
      internship_to_date: "",
      is_custom_internship_date: false,
      eligiblecollege_ids: [],
      eligiblecourse_ids: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Store domain selection state at parent level to survive re-renders
  const [selectedDomainSkills, setSelectedDomainSkills] = useState([]);

  // Simple skill change handler
  const handleSkillsChange = (skillIds) => {
    methods.setValue("skill_ids", skillIds, { shouldValidate: false });
  };

  const {
    masterData,
    durations,
    locations,
    courses,
    jobRoles,
    schoolColleges,
    domains,
    getSkillsForDomain,
    isLoading: masterDataLoading,
    isError: masterDataError,
    error: masterDataErrorMsg,
    refetch: refetchMasterData,
  } = useMasterData();

  // Watch form values for conditional rendering
  const opportunity_type = methods.watch("opportunity_type");
  const job_type = methods.watch("job_type");
  const stipend_type = methods.watch("stipend_type");
  const is_custom_internship_date = methods.watch("is_custom_internship_date");
  const current_skill_ids = methods.watch("skill_ids");
  
  // console.log("🎯 Current form skill_ids:", current_skill_ids);

  // Handle opportunity type change - just clear everything
  const handleOpportunityTypeChange = (newType) => {
    // Clear all form fields
    methods.reset({
      opportunity_type: newType,
      job_role_id: "",
      skill_ids: [],
      job_type: "In office",
      days_in_office: null,
      job_time: "Day Shift",
      number_of_openings: "",
      job_description: "",
      candidate_preferences: "",
      women_preferred: false,
      stipend_type: newType === "Internship" ? "Paid" : "Fixed",
      stipend_min: null,
      stipend_max: null,
      incentive_per_year: "",
      perks: [],
      screening_questions: "",
      phone_contact: "",
      alternate_phone_number: "",
      eligiblecity_ids: [],
      duration_id: newType === "Internship" ? "" : undefined,
      internship_start_date: "",
      internship_from_date: "",
      internship_to_date: "",
      is_custom_internship_date: false,
      eligiblecollege_ids: [],
      eligiblecourse_ids: [],
    });
    
    // Clear domain skills
    setSelectedDomainSkills([]);
    
    // Clear messages
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Transform form data to match backend API
  const transformFormDataToAPI = (formData) => {
    const apiData = {
      opportunity_type: formData.opportunity_type,
      job_role_id: formData.job_role_id,
      skill_ids: formData.skill_ids,
      job_type:
        formData.eligiblecity_ids.length === 0 ? "Remote" : formData.job_type,
      days_in_office:
        formData.job_type === "Remote" ? null : formData.days_in_office,
      job_time: formData.job_time,
      number_of_openings: formData.number_of_openings,
      job_description: formData.job_description,
      candidate_preferences: formData.candidate_preferences,
      women_preferred: formData.women_preferred,
      stipend_type:
        formData.opportunity_type === "Job" ? "Fixed" : formData.stipend_type,
      stipend_min:
        formData.stipend_type === "Unpaid"
          ? null
          : formData.stipend_min || null,
      stipend_max:
        formData.stipend_type === "Unpaid"
          ? null
          : formData.stipend_max || null,
      incentive_per_year: formData.incentive_per_year,
      perks: Array.isArray(formData.perks)
        ? formData.perks
        : (formData.perks?.split(",") || []).map((p) => p.trim()),
      screening_questions: Array.isArray(formData.screening_questions)
        ? formData.screening_questions
        : formData.screening_questions?.split("\n").filter((q) => q.trim()) ||
          [],
      phone_contact: formData.phone_contact,
      alternate_phone_number: formData.alternate_phone_number,
      eligiblecity_ids: formData.eligiblecity_ids,

      // Conditional fields
      ...(formData.opportunity_type === "Internship" && {
        duration_id: formData.duration_id,
        internship_start_date: formData.is_custom_internship_date
          ? formData.internship_from_date
          : new Date().toISOString().split("T")[0], // Today's date for immediate start
        internship_from_date: formData.is_custom_internship_date
          ? formData.internship_from_date
          : null,
        internship_to_date: formData.is_custom_internship_date
          ? formData.internship_to_date
          : null,
        is_custom_internship_date: formData.is_custom_internship_date,
        eligiblecollege_ids: formData.eligiblecollege_ids || [],
        eligiblecourse_ids: formData.eligiblecourse_ids || [],
      }),

      ...(formData.opportunity_type === "Job" && {
        // Job-specific transformations if needed
        internship_start_date: formData.is_custom_internship_date
          ? formData.internship_from_date
          : new Date().toISOString().split("T")[0],
      }),

      ...(formData.opportunity_type === "Project" &&
        {
          // Project-specific transformations if needed
        }),
    };
    
    return apiData;
  };

  const onSubmit = async (data) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("📊 Raw Form Data:", data);
    console.log("🏷️ Opportunity Type:", data.opportunity_type);
    
    // Log internship date info
    if (data.opportunity_type === "Internship") {
      console.log("📅 Internship Date Info:", {
        is_custom_internship_date: data.is_custom_internship_date,
        internship_from_date: data.internship_from_date,
        internship_to_date: data.internship_to_date,
        today_date: new Date().toISOString().split('T')[0],
        will_use_today: !data.is_custom_internship_date
      });
    }
    
    console.log("💰 Stipend Info:", {
      opportunity_type: data.opportunity_type,
      stipend_type: data.stipend_type,
      stipend_min: data.stipend_min,
      stipend_max: data.stipend_max
    });
    console.log("📊 Current selected domain skills:", selectedDomainSkills);
    console.log("📊 Current form skill_ids:", methods.getValues("skill_ids"));
    console.log("📊 User token:", token ? "Present" : "Missing");
    
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Transform form data to match backend API
      const jobPostData = transformFormDataToAPI(data);
      
      console.log("=== TRANSFORMED DATA FOR API ===");
      console.log("📤 Job post data being sent to API:");
      console.log(JSON.stringify(jobPostData, null, 2));

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Call the API
      console.log("📡 Calling API...");
      const response = await jobPostApi.createJobPost(jobPostData, token);
      
      console.log("=== API SUCCESS ===");
      console.log("📥 Response from API:", response);
      
      setSuccessMessage(`${data.opportunity_type} posted successfully!`);
      
      // Clear domain skills state and reset form
      setSelectedDomainSkills([]);
      methods.reset();
      
      // Redirect to recruiter dashboard after successful posting
      setTimeout(() => {
        console.log("🚀 Redirecting to dashboard...");
        navigate('/recruiter-dashboard');
      }, 2000);
      
    } catch (error) {
      console.log("=== API ERROR ===");
      console.log("❌ Error:", error);
      console.log("❌ Error response:", error.response);
      console.log("❌ Error message:", error.message);
      
      const errorMsg = error.response?.data?.message || error.message || "Failed to post. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input styles
  const radioStyles = "w-3 h-3 text-blue-600 border-gray-300 focus:outline-none focus:ring-0";
  const checkboxStyles = "w-3 h-3 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-0";
  const radioContainerStyles = "flex gap-3 p-2 border border-gray-300 rounded-lg bg-white";

  const FormContent = () => {
    return (
      <div className="w-full max-w-full p-6 mt-4 bg-white shadow-none rounded-xl sm:shadow-xl sm:max-w-2xl sm:p-8">
        <FormProvider {...methods}>
          <form onSubmit={(e) => {
            console.log("📝 Form submit event triggered");
            methods.handleSubmit(
              (data) => {
                console.log("✅ Validation passed, calling onSubmit");
                onSubmit(data);
              },
              (errors) => {
                console.log("❌ Validation failed:");
                console.log("Errors:", errors);
                console.log("Form values:", methods.getValues());
              }
            )(e);
          }} className="space-y-4">
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
                {["Internship", "Job", "Project"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={type}
                      className={radioStyles}
                      checked={opportunity_type === type}
                      onChange={(e) => handleOpportunityTypeChange(e.target.value)}
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Role - Searchable Select */}
            <div>
              <Label htmlFor="job_role_id">
                {opportunity_type === "Internship" 
                  ? "Internship Profile" 
                  : opportunity_type === "Job" 
                    ? "Job Title" 
                    : "Project Title"}
              </Label>
              <SearchableSelect
                options={jobRoles || []}
                value={methods.watch("job_role_id")}
                onChange={(value) => {
                  console.log("💼 Job role changed to:", value);
                  methods.setValue("job_role_id", value, { shouldValidate: true });
                  console.log("💼 Job role setValue completed");
                }}
                placeholder={`Search ${opportunity_type.toLowerCase()} roles...`}
                error={methods.formState.errors.job_role_id?.message}
                getOptionLabel={(option) => option.title}
                getOptionValue={(option) => option.id}
              />
            </div>

            {/* Domain-based Skill Selection */}
            <DomainSkillsSelector
              domains={domains || []}
              getSkillsForDomain={getSkillsForDomain}
              selectedDomainSkills={selectedDomainSkills}
              onDomainSkillsChange={setSelectedDomainSkills}
              onSkillsChange={handleSkillsChange}
              error={methods.formState.errors.skill_ids?.message}
            />

            {/* Conditional Fields based on Opportunity Type */}
            {opportunity_type === "Internship" && (
              <>
                {/* Internship-specific fields */}
                <div>
                  <Label htmlFor="duration_id">Internship duration</Label>
                  <SearchableSelect
                    options={durations || []}
                    value={methods.watch("duration_id")}
                    onChange={(value) => methods.setValue("duration_id", value, { shouldValidate: true })}
                    placeholder="Select duration"
                    error={methods.formState.errors.duration_id?.message}
                    getOptionLabel={(option) => option.value}
                    getOptionValue={(option) => option.id}
                  />
                </div>

                {/* Internship Start Date */}
                <div>
                  <Label htmlFor="internship_start_date">Internship start date</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="false"
                        className={radioStyles}
                        checked={!is_custom_internship_date}
                        onChange={() => methods.setValue("is_custom_internship_date", false)}
                      />
                      <span className="text-sm text-gray-700">Immediately (within 30 days)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="true"
                        className={radioStyles}
                        checked={is_custom_internship_date}
                        onChange={() => methods.setValue("is_custom_internship_date", true)}
                      />
                      <span className="text-sm text-gray-700">Custom</span>
                    </label>
                  </div>
                </div>

                {is_custom_internship_date && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <div className="flex-1">
                      <Label>From Date</Label>
                      <Input
                        type="date"
                        {...methods.register("internship_from_date")}
                        error={methods.formState.errors.internship_from_date?.message}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>To Date</Label>
                      <Input
                        type="date"
                        {...methods.register("internship_to_date")}
                        error={methods.formState.errors.internship_to_date?.message}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Job Type */}
            <div>
              <Label htmlFor="job_type">
                {opportunity_type === "Internship" 
                  ? "Internship Type" 
                  : opportunity_type === "Job" 
                    ? "Job Type" 
                    : "Project Type"}
              </Label>
              <div className={radioContainerStyles}>
                {["In office", "Hybrid", "Remote"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={type}
                      className={radioStyles}
                      {...methods.register("job_type", {
                        onChange: (e) => {
                          console.log("🏢 Job type changed to:", e.target.value);
                        }
                      })}
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Days in Office for Hybrid */}
            {job_type === "Hybrid" && (
              <div className="my-3">
                <Label htmlFor="days_in_office">
                  No. of in-office days in a week:
                </Label>
                <div className="flex gap-1 sm:gap-3 md:gap-8">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`w-10 h-10 rounded-full border text-sm font-semibold flex items-center justify-center
                          ${
                            methods.getValues("days_in_office") === day
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300"
                          }
                          hover:border-blue-400 transition`}
                      onClick={() =>
                        methods.setValue("days_in_office", day, {
                          shouldValidate: true,
                        })
                      }
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {methods.formState.errors.days_in_office?.message && (
                  <p className="mt-1 text-sm text-red-600">{methods.formState.errors.days_in_office?.message}</p>
                )}
              </div>
            )}

            {/* Work Schedule */}
            <div>
              <Label htmlFor="job_time">Work Schedule</Label>
              <div className={radioContainerStyles}>
                {["Day Shift", "Night Shift", "Part-time"].map((schedule) => (
                  <label key={schedule} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={schedule}
                      className={radioStyles}
                      {...methods.register("job_time")}
                    />
                    <span className="text-sm text-gray-700">{schedule}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Number of Openings */}
            <div>
              <Label htmlFor="number_of_openings">Number of openings</Label>
              <Input
                type="number"
                placeholder="e.g. 4"
                min="1"
                {...methods.register("number_of_openings", { valueAsNumber: true })}
                error={methods.formState.errors.number_of_openings?.message}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="job_description">
                {opportunity_type === "Internship" 
                  ? "Intern's responsibility" 
                  : opportunity_type === "Job" 
                    ? "Job description" 
                    : "Project description"}
              </Label>
              <Textarea
                rows={4}
                placeholder={
                  opportunity_type === "Internship"
                    ? "Selected intern day-to-day responsibilities include..."
                    : opportunity_type === "Job"
                      ? "Key responsibilities:\n1.\n2.\n3."
                      : "Project requirements:\n1.\n2.\n3."
                }
                {...methods.register("job_description")}
                error={methods.formState.errors.job_description?.message}
              />
            </div>

            {/* Candidate Preferences */}
            <div>
              <Label htmlFor="candidate_preferences">Additional candidate preferences</Label>
              <Textarea
                rows={3}
                placeholder={
                  opportunity_type === "Internship"
                    ? "e.g. Candidates pursuing B.Tech. preferred"
                    : opportunity_type === "Job"
                      ? "e.g. Experience with similar roles preferred"
                      : "e.g. Experience with similar projects preferred"
                }
                {...methods.register("candidate_preferences")}
              />
            </div>

            {/* Women Only */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
              <input
                type="checkbox"
                className={checkboxStyles}
                {...methods.register("women_preferred")}
              />
              <span className="text-sm text-gray-700">
                Allow applications from women who are willing to start/restart their career.
              </span>
            </div>

            {/* Stipend Type */}
            <div>
              <Label htmlFor="stipend_type">
                {opportunity_type === "Internship" 
                  ? "Stipend" 
                  : opportunity_type === "Job" 
                    ? "Fixed Pay" 
                    : "Project Budget"}
              </Label>
              <div className={radioContainerStyles}>
                {(opportunity_type === "Internship" 
                  ? ["Paid", "Unpaid"] 
                  : ["Fixed"]
                ).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={type}
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stipend Amount */}
            {((opportunity_type === "Internship" && stipend_type === "Paid") || 
             (opportunity_type === "Job" && stipend_type === "Fixed") ||
             (opportunity_type === "Project")) && (
              <div>
                <Label htmlFor="stipend_range">
                  {opportunity_type === "Internship" 
                    ? "Stipend Range" 
                    : opportunity_type === "Job" 
                      ? "Fixed Pay Range" 
                      : "Project Budget Range"}
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Input
                    type="number"
                    placeholder="₹ Min"
                    min="0"
                    {...methods.register("stipend_min", { valueAsNumber: true })}
                    error={methods.formState.errors.stipend_min?.message}
                  />
                  <Input
                    type="number"
                    placeholder="₹ Max"
                    min="0"
                    {...methods.register("stipend_max", { valueAsNumber: true })}
                    error={methods.formState.errors.stipend_max?.message}
                  />
                </div>
              </div>
            )}

            {/* Incentives (Internship only) */}
            {opportunity_type === "Internship" && stipend_type === "Paid" && (
              <div>
                <Label htmlFor="incentive_per_year">Incentives (per year)</Label>
                <Input
                  type="text"
                  placeholder="e.g. Performance based, ₹5000-10000"
                  {...methods.register("incentive_per_year")}
                />
              </div>
            )}

            {/* Perks */}
            <div>
              <Label htmlFor="perks">
                {opportunity_type === "Internship" 
                  ? "Perks (Select all that apply)" 
                  : "Benefits (Select all that apply)"}
              </Label>
              <div className="grid grid-cols-1 gap-2 p-3 rounded-lg sm:grid-cols-2 sm:gap-3 bg-gray-50">
                {(opportunity_type === "Internship"
                  ? [
                      "Certificate of completion",
                      "Letter of recommendation",
                      "Flexible work hours",
                      "5 days a week",
                      "Informal dress code",
                      "Free snacks & beverages",
                    ]
                  : [
                      "5 days a week",
                      "Health Insurance",
                      "Life Insurance",
                      "Flexible work hours",
                    ]
                ).map((perk) => (
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
              <Label htmlFor="screening_questions">Screening Questions</Label>
              <Textarea
                rows={4}
                placeholder={
                  opportunity_type === "Internship"
                    ? "Add screening questions (one per line):\n1. Please confirm your availability for this internship\n2. Share your relevant experience\n3. Add your own questions..."
                    : opportunity_type === "Job"
                      ? "Add screening questions (one per line):\n1. Please confirm your availability for this job\n2. How early would you be able to join?\n3. Add your own questions..."
                      : "Add screening questions (one per line):\n1. Please confirm your availability for this project\n2. Share your relevant project experience\n3. Add your own questions..."
                }
                {...methods.register("screening_questions")}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter each question on a new line. Each line will be treated as a separate question.
              </p>
            </div>

            {/* Location Selection */}
            <div>
              <Label htmlFor="eligiblecity_ids">City/Cities</Label>
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
                <SearchableSelect
                  options={locations || []}
                  value={methods.watch("eligiblecity_ids")}
                  onChange={(value) => {
                    console.log("🏙️ City selection changed to:", value);
                    methods.setValue("eligiblecity_ids", value, { shouldValidate: true });
                    console.log("🏙️ City setValue completed");
                  }}
                  placeholder="Search and select cities..."
                  error={methods.formState.errors.eligiblecity_ids?.message}
                  isMulti={true}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              )}
            </div>

            {/* Phone Contact */}
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

            {/* Alternate Phone */}
            <div>
              <Label htmlFor="alternate_phone_number">
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
                  {...methods.register("alternate_phone_number")}
                />
              </div>
            </div>

            {/* Internship-specific additional fields */}
            {opportunity_type === "Internship" && (
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <Label htmlFor="eligiblecollege_ids">College Name</Label>
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
                  <SearchableSelect
                    options={schoolColleges || []}
                    value={methods.watch("eligiblecollege_ids")}
                    onChange={(value) => methods.setValue("eligiblecollege_ids", value, { shouldValidate: true })}
                    placeholder="Search and select colleges..."
                    isMulti={true}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                )}

                <div className="mt-4">
                  <Label htmlFor="eligiblecourse_ids">Course</Label>
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
                    <SearchableSelect
                      options={courses || []}
                      value={methods.watch("eligiblecourse_ids")}
                      onChange={(value) => methods.setValue("eligiblecourse_ids", value, { shouldValidate: true })}
                      placeholder="Search and select courses..."
                      isMulti={true}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )}
                </div>
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
              <Button 
                type="submit" 
                loading={isSubmitting} 
                variant="primary"
                onClick={() => {
                  console.log("🔘 Post button clicked");
                  console.log("📊 Form values:", methods.getValues());
                  console.log("❌ Form errors:", methods.formState.errors);
                  console.log("✅ Form isValid:", methods.formState.isValid);
                  console.log("🎯 Selected domain skills:", selectedDomainSkills);
                }}
              >
                {isSubmitting ? "Posting..." : `Post ${opportunity_type}`}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  };

  return (
    <SignUpLayout
      heading="Post Internship/Job"
      subheading="Post your internship/job to attract the best candidates."
      hideMobileIllustration={true}
    >
      <div className="relative flex w-full min-h-screen overflow-hidden md:items-center md:justify-center">
        <div className="flex justify-center flex-1 w-full mt-6 md:mt-0">
          <FormContent />
        </div>
      </div>
    </SignUpLayout>
  );
}
