import React, { useState } from 'react';
import { Button } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile';
import { getImageUrl } from "../../../../utils.js";
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
    <MainLayout>
  <div className="flex items-start justify-center min-h-screen gap-2 px-2 bg-gray-100 lg:px-8">
  {/* Left Spacer */}
  <div className="flex-grow hidden lg:block "></div>
    {/* Left Spacer */}
    {/* Resume Template Section */}
      <section 
        className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-auto opacity-100 gap-[10px]"
      
      >
        {/* Page Title */}
        <h1 className="px-2 mb-4 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl sm:mb-6 lg:mb-8">
          Choose Resume template
        </h1>

        {/* Resume Templates Grid */}
        <div className="grid grid-cols-1 gap-3 px-2 mb-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6 sm:mb-8">
          {resumeTemplates.map((template) => (
            <div
              key={template.id}
                             className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                 template.selected ? 'ring-4 ring-red-500' : 'ring-1 ring-gray-200'
               }`}
               onClick={() => handleTemplateSelect(template.id)}
             >
               {/* Resume Template Card */}
               <div className="h-64 overflow-hidden bg-white rounded-lg shadow-lg sm:h-72 lg:h-96">
                {/* Header */}
                <div className={`h-2 ${getAccentColorClass(template.accentColor)}`}></div>
                
                                 {/* Resume Content */}
                 <div className="h-full p-2 sm:p-3 lg:p-4">
                   <div className="flex items-center mb-2 sm:mb-3">
                     <div className="flex items-center justify-center w-8 h-8 mr-2 text-sm bg-gray-200 rounded-full sm:w-10 sm:h-10 lg:w-12 lg:h-12 sm:text-base lg:text-lg sm:mr-3">
                       {template.content.leftColumn?.photo || template.content.rightColumn?.photo}
                     </div>
                     <div>
                       <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">
                         {template.name}
                       </h3>
                       <p className="text-xs text-gray-600">
                         {template.jobTitle}
                       </p>
                     </div>
                   </div>

                                     {/* Template Preview Content */}
                   <div className="space-y-1 text-xs text-gray-600 sm:space-y-2">
                     {template.id === 1 || template.id === 5 ? (
                       // Olivia Wilson template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div>
                           <p className="text-xs font-medium text-gray-800">Contact</p>
                           <p className="text-xs">Phone, Email, Address</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">Education</p>
                           <p className="text-xs">Bachelor of Fine Arts</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">Skills</p>
                           <p className="text-xs">Digital Marketing, Branding</p>
                         </div>
                         <div>
                           <p className="text-xs font-medium text-gray-800">Profile</p>
                           <p className="text-xs">Creative designer with 5+ years...</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">Experience</p>
                           <p className="text-xs">Senior Graphic Designer</p>
                         </div>
                       </div>
                     ) : template.id === 2 ? (
                       // Sally Branders template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div className={`${getAccentColorClass(template.accentColor)} p-1 sm:p-2 rounded`}>
                           <p className="text-xs font-medium text-white">CONTACTO</p>
                           <p className="mt-1 text-xs font-medium text-white sm:mt-2">SKILLS</p>
                           <p className="text-xs text-white">Excel, CRM, Problem-solving</p>
                         </div>
                         <div>
                           <p className="text-xs font-medium text-gray-800">EXPERIENCE</p>
                           <p className="text-xs">Professional Experience</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">EDUCATION</p>
                           <p className="text-xs">MBA, Bachelor of Commerce</p>
                         </div>
                       </div>
                     ) : template.id === 3 || template.id === 4 ? (
                       // Harry Lewis template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div>
                           <p className="text-xs font-medium text-gray-800">OBJECTIVE</p>
                           <p className="text-xs">Resume Objective</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">SKILLS</p>
                           <p className="text-xs">Professional Skills</p>
                         </div>
                         <div>
                           <p className="text-xs font-medium text-gray-800">CONTACT</p>
                           <p className="text-xs">Contact Information</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">HISTORY</p>
                           <p className="text-xs">Work History</p>
                         </div>
                       </div>
                     ) : (
                       // Richard Sanchez template
                       <div className="grid grid-cols-2 gap-1 sm:gap-2">
                         <div>
                           <p className="text-xs font-medium text-gray-800">CONTACT</p>
                           <p className="text-xs">Contact Information</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">EDUCATION</p>
                           <p className="text-xs">Education Details</p>
                         </div>
                         <div>
                           <p className="text-xs font-medium text-gray-800">PROFILE</p>
                           <p className="text-xs">Professional Profile</p>
                           <p className="mt-1 text-xs font-medium text-gray-800 sm:mt-2">EXPERIENCE</p>
                           <p className="text-xs">Work Experience</p>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              </div>

                             {/* Selection Indicator */}
               {template.selected && (
                 <div className="absolute flex items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-1 -right-1 sm:-top-2 sm:-right-2 sm:w-6 sm:h-6">
                   <svg className="w-3 h-3 text-white sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
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
            className="w-full px-4 py-2 text-sm sm:px-6 lg:px-8 sm:py-3 sm:text-base lg:text-lg sm:w-auto"
          >
            Download
          </Button>
        </div>
      </section>

    {/* Profile Card */}
    <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit ml-4">
                    <FeedRightProfile />
                </aside>
                {/* Right Spacer */}
                <div className="flex-grow hidden lg:block "></div>
                </div>
    </MainLayout>
  );
};

export default FeedResume;
