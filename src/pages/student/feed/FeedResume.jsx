import React, { useState } from 'react';
import { Button } from '../../../components/ui';

const FeedResume = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const resumeTemplates = [
    {
      id: 1,
      name: "Olivia Wilson",
      jobTitle: "Graphics Designer",
      type: "Professional",
      layout: "two-column",
      accentColor: "gray",
      selected: selectedTemplate === 1,
      content: {
        leftColumn: {
          photo: "👩‍💼",
          contact: {
            phone: "+1 (555) 123-4567",
            email: "olivia.wilson@email.com",
            address: "123 Design Street, Creative City, CC 12345"
          },
          education: "Bachelor of Fine Arts in Graphic Design",
          expertise: ["Digital Marketing", "Branding", "Copywriting"],
          languages: ["English", "French"]
        },
        rightColumn: {
          profile: "Creative and detail-oriented graphic designer with 5+ years of experience in digital marketing and brand development.",
          workExperience: [
            {
              title: "Senior Graphic Designer",
              company: "Creative Studio Inc.",
              period: "2020 - Present"
            },
            {
              title: "Junior Designer",
              company: "Design Agency",
              period: "2018 - 2020"
            }
          ],
          references: "Available upon request"
        }
      }
    },
    {
      id: 2,
      name: "Sally Branders",
      jobTitle: "JOB TITLE",
      type: "Modern",
      layout: "sidebar",
      accentColor: "teal",
      selected: selectedTemplate === 2,
      content: {
        leftColumn: {
          photo: "👩‍💻",
          contact: "CONTACTO",
          profileSummary: "PROFILE SUMMARY",
          skills: ["Excel", "CRM", "Problem-solving", "Team leadership"],
          languages: [
            { name: "English", level: "Native" },
            { name: "Spanish", level: "Intermediate" },
            { name: "French", level: "Beginner" }
          ]
        },
        rightColumn: {
          professionalExperience: "PROFESSIONAL EXPERIENCE",
          education: [
            "Master of Business Administration",
            "Bachelor of Commerce in Marketing"
          ],
          certifications: "CERTIFICATIONS"
        }
      }
    },
    {
      id: 3,
      name: "Harry Lewis",
      jobTitle: "Professional",
      type: "Classic",
      layout: "two-column",
      accentColor: "orange",
      selected: selectedTemplate === 3,
      content: {
        leftColumn: {
          resumeObjective: "RESUME OBJECTIVE",
          professionalSkills: "PROFESSIONAL SKILLS",
          certifications: "CERTIFICATIONS"
        },
        rightColumn: {
          photo: "👨‍💼",
          contact: "CONTACT",
          skills: "SKILLS",
          education: "EDUCATION",
          workHistory: "WORK HISTORY"
        }
      }
    },
    {
      id: 4,
      name: "Harry Lewis",
      jobTitle: "Professional",
      type: "Classic",
      layout: "two-column",
      accentColor: "orange",
      selected: selectedTemplate === 4,
      content: {
        leftColumn: {
          resumeObjective: "RESUME OBJECTIVE",
          professionalSkills: "PROFESSIONAL SKILLS",
          certifications: "CERTIFICATIONS"
        },
        rightColumn: {
          photo: "👨‍💼",
          contact: "CONTACT",
          skills: "SKILLS",
          education: "EDUCATION",
          workHistory: "WORK HISTORY"
        }
      }
    },
    {
      id: 5,
      name: "Olivia Wilson",
      jobTitle: "Graphics Designer",
      type: "Professional",
      layout: "two-column",
      accentColor: "gray",
      selected: selectedTemplate === 5,
      content: {
        leftColumn: {
          photo: "👩‍💼",
          contact: {
            phone: "+1 (555) 123-4567",
            email: "olivia.wilson@email.com",
            address: "123 Design Street, Creative City, CC 12345"
          },
          education: "Bachelor of Fine Arts in Graphic Design",
          expertise: ["Digital Marketing", "Branding", "Copywriting"],
          languages: ["English", "French"]
        },
        rightColumn: {
          profile: "Creative and detail-oriented graphic designer with 5+ years of experience in digital marketing and brand development.",
          workExperience: [
            {
              title: "Senior Graphic Designer",
              company: "Creative Studio Inc.",
              period: "2020 - Present"
            },
            {
              title: "Junior Designer",
              company: "Design Agency",
              period: "2018 - 2020"
            }
          ],
          references: "Available upon request"
        }
      }
    },
    {
      id: 6,
      name: "Richard Sanchez",
      jobTitle: "MARKETING MANAGER",
      type: "Executive",
      layout: "two-column",
      accentColor: "blue",
      selected: selectedTemplate === 6,
      content: {
        leftColumn: {
          photo: "👨‍💼",
          contact: "CONTACT",
          education: "EDUCATION",
          skills: "SKILLS",
          languages: "LANGUAGES"
        },
        rightColumn: {
          profile: "PROFILE",
          workExperience: "WORK EXPERIENCE",
          reference: "REFERENCE"
        }
      }
    }
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleDownload = () => {
    // Simulate download functionality
    console.log(`Downloading template ${selectedTemplate}`);
    // Here you would implement actual download logic
    alert(`Downloading resume template ${selectedTemplate}`);
  };

  const getAccentColorClass = (color) => {
    switch (color) {
      case 'teal':
        return 'bg-teal-500';
      case 'orange':
        return 'bg-orange-500';
      case 'blue':
        return 'bg-blue-700';
      case 'gray':
      default:
        return 'bg-gray-200';
    }
  };

  const getAccentBorderClass = (color) => {
    switch (color) {
      case 'teal':
        return 'border-teal-500';
      case 'orange':
        return 'border-orange-500';
      case 'blue':
        return 'border-blue-700';
      case 'gray':
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-6">
      <div 
        className="mx-auto bg-white rounded-lg shadow-lg"
        style={{
          width: '100%',
          maxWidth: '729px',
          minHeight: 'auto',
          marginTop: '20px',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '10px',
          padding: '16px',
          gap: '10px',
          opacity: 1
        }}
      >
        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 px-2">
          Choose Resume template
        </h1>

        {/* Resume Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-2">
          {resumeTemplates.map((template) => (
            <div
              key={template.id}
                             className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                 template.selected ? 'ring-4 ring-red-500' : 'ring-1 ring-gray-200'
               }`}
               onClick={() => handleTemplateSelect(template.id)}
             >
               {/* Resume Template Card */}
               <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64 sm:h-72 lg:h-96">
                {/* Header */}
                <div className={`h-2 ${getAccentColorClass(template.accentColor)}`}></div>
                
                                 {/* Resume Content */}
                 <div className="p-2 sm:p-3 lg:p-4 h-full">
                   <div className="flex items-center mb-2 sm:mb-3">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm sm:text-base lg:text-lg mr-2 sm:mr-3">
                       {template.content.leftColumn?.photo || template.content.rightColumn?.photo}
                     </div>
                     <div>
                       <h3 className="font-semibold text-xs sm:text-sm text-gray-900">
                         {template.name}
                       </h3>
                       <p className="text-xs text-gray-600">
                         {template.jobTitle}
                       </p>
                     </div>
                   </div>

                                     {/* Template Preview Content */}
                   <div className="text-xs text-gray-600 space-y-1 sm:space-y-2">
                     {template.id === 1 || template.id === 5 ? (
                       // Olivia Wilson template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div>
                           <p className="font-medium text-gray-800 text-xs">Contact</p>
                           <p className="text-xs">Phone, Email, Address</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">Education</p>
                           <p className="text-xs">Bachelor of Fine Arts</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">Skills</p>
                           <p className="text-xs">Digital Marketing, Branding</p>
                         </div>
                         <div>
                           <p className="font-medium text-gray-800 text-xs">Profile</p>
                           <p className="text-xs">Creative designer with 5+ years...</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">Experience</p>
                           <p className="text-xs">Senior Graphic Designer</p>
                         </div>
                       </div>
                     ) : template.id === 2 ? (
                       // Sally Branders template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div className={`${getAccentColorClass(template.accentColor)} p-1 sm:p-2 rounded`}>
                           <p className="font-medium text-white text-xs">CONTACTO</p>
                           <p className="font-medium text-white text-xs mt-1 sm:mt-2">SKILLS</p>
                           <p className="text-white text-xs">Excel, CRM, Problem-solving</p>
                         </div>
                         <div>
                           <p className="font-medium text-gray-800 text-xs">EXPERIENCE</p>
                           <p className="text-xs">Professional Experience</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">EDUCATION</p>
                           <p className="text-xs">MBA, Bachelor of Commerce</p>
                         </div>
                       </div>
                     ) : template.id === 3 || template.id === 4 ? (
                       // Harry Lewis template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div>
                           <p className="font-medium text-gray-800 text-xs">OBJECTIVE</p>
                           <p className="text-xs">Resume Objective</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">SKILLS</p>
                           <p className="text-xs">Professional Skills</p>
                         </div>
                         <div>
                           <p className="font-medium text-gray-800 text-xs">CONTACT</p>
                           <p className="text-xs">Contact Information</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">HISTORY</p>
                           <p className="text-xs">Work History</p>
                         </div>
                       </div>
                     ) : (
                       // Richard Sanchez template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div>
                           <p className="font-medium text-gray-800 text-xs">CONTACT</p>
                           <p className="text-xs">Contact Information</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">EDUCATION</p>
                           <p className="text-xs">Education Details</p>
                         </div>
                         <div>
                           <p className="font-medium text-gray-800 text-xs">PROFILE</p>
                           <p className="text-xs">Professional Profile</p>
                           <p className="font-medium text-gray-800 mt-1 sm:mt-2 text-xs">EXPERIENCE</p>
                           <p className="text-xs">Work Experience</p>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              </div>

                             {/* Selection Indicator */}
               {template.selected && (
                 <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                   <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                 </div>
               )}
            </div>
          ))}
        </div>

        {/* Download Button */}
        <div className="flex justify-center px-2">
          <Button
            variant="primary"
            size="large"
            onClick={handleDownload}
            className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg w-full sm:w-auto"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedResume;
