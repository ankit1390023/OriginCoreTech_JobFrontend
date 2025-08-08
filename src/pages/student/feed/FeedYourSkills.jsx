import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';
import { HiOutlineEye } from 'react-icons/hi';
import { FaEdit } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { useDomainsApi } from '../../../hooks/useDomainsApi';
import { useEducationData } from '../../../hooks/useEducationData';
import { skillApi } from '../../../api/skillApi';
import { useSelector } from 'react-redux';

const FeedYourSkills = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoreSkills, setShowMoreSkills] = useState({});
  const [showCollegeDropdown, setShowCollegeDropdown] = useState({});
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [collegeSearchQuery, setCollegeSearchQuery] = useState({});
  const [skillsSearchQuery, setSkillsSearchQuery] = useState('');
  
  // New state for first card functionality
  const [firstCardCertificate, setFirstCardCertificate] = useState(null);
  const [firstCardSelectedSkills, setFirstCardSelectedSkills] = useState([]);
  const [firstCardLearningSource, setFirstCardLearningSource] = useState('');
  const [currentMainSkill, setCurrentMainSkill] = useState('');
  const [showFirstCard, setShowFirstCard] = useState(true);
  
  // State for other cards' selected skills
  const [otherCardsSelectedSkills, setOtherCardsSelectedSkills] = useState({});
  const [saving, setSaving] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: 'Web Development',
      learningSource: 'Delhi University',
      hasCertificate: false,
      borderColor: 'border-gray-200',
      bgColor: 'bg-white'
    },
    {
      id: 3,
      name: 'Design',
      learningSource: 'Delhi Technological University',
      hasCertificate: true,
      certificateName: 'UI/UX Design Certificate',
      certificateUrl: 'https://example.com/certificates/design-cert-1.pdf',
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-50'
    },
    {
      id: 4,
      name: 'Design',
      learningSource: 'Delhi Technological University',
      hasCertificate: true,
      certificateName: 'Graphic Design Certificate',
      certificateUrl: 'https://example.com/certificates/design-cert-2.jpg',
      borderColor: 'border-green-300',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      name: 'Design',
      learningSource: 'Delhi Technological University',
      hasCertificate: true,
      certificateName: 'Digital Design Certificate',
      certificateUrl: 'https://example.com/certificates/design-cert-3.pdf',
      borderColor: 'border-red-300',
      bgColor: 'bg-red-50'
    }
  ]);

  // Use the domains API hook
  const { 
    allDomains, 
    skillsByDomain, 
    loading, 
    error, 
    fetchAllDomains, 
    fetchSkillsByDomain 
  } = useDomainsApi('Web Development');

  // Use the education data hook to get colleges
  const { data: educationData, loading: collegesLoading, error: collegesError } = useEducationData();
  
  // Fallback dummy colleges in case API fails or returns empty data
  const fallbackColleges = [
    'Delhi University', 'IIT Delhi', 'Delhi Technological University', 'JNU Delhi',
    'Amity University', 'GGSIPU', 'NSIT Delhi', 'DTU Delhi', 'IIIT Delhi',
    'Google India', 'Microsoft India', 'Amazon India', 'TCS', 'Infosys',
    'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture', 'IBM India'
  ];
  
  const colleges = educationData.colleges && educationData.colleges.length > 0 
    ? educationData.colleges 
    : fallbackColleges;

  // Set initial main skill when domains are loaded
  useEffect(() => {
    if (allDomains.length > 0 && !currentMainSkill) {
      setCurrentMainSkill(allDomains[0]);
    }
  }, [allDomains, currentMainSkill]);

  // Fetch skills for current main skill
  useEffect(() => {
    if (currentMainSkill) {
      fetchSkillsByDomain(currentMainSkill);
    }
  }, [currentMainSkill, fetchSkillsByDomain]);

  // Get related skills for main domain skills from API
  const getRelatedSkillsForMainDomain = (mainSkill) => {
    if (mainSkill === currentMainSkill) {
      return skillsByDomain || [];
    }
    // For other skills, return empty array as we'll fetch them when needed
    return [];
  };

  // Get all available domains for search
  const getMainDomainSkills = () => {
    return allDomains || [];
  };

  // Flatten all skills for search functionality
  const getAllSkills = () => {
    return skillsByDomain || [];
  };

  // Default related skills (fallback)
  const defaultRelatedSkills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Bootstrap'];

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const collegeDropdowns = document.querySelectorAll('[data-college-dropdown]');
      const skillsDropdown = document.querySelector('[data-skills-dropdown]');
      
      let clickedInsideCollege = false;
      let clickedInsideSkills = false;
      
      collegeDropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
          clickedInsideCollege = true;
        }
      });
      
      if (skillsDropdown && skillsDropdown.contains(event.target)) {
        clickedInsideSkills = true;
      }
      
      if (!clickedInsideCollege) {
        setShowCollegeDropdown({});
      }
      
      if (!clickedInsideSkills) {
        setShowSkillsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // First card specific functions
  const handleCertificateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the file to display it
      const fileUrl = URL.createObjectURL(file);
      setFirstCardCertificate({
        name: file.name,
        file: file,
        url: fileUrl
      });
    }
  };

  const handleRemoveCertificate = () => {
    setFirstCardCertificate(null);
  };

  const handleSkillToggle = (skill) => {
    setFirstCardSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleOtherCardSkillToggle = (skillId, skill) => {
    setOtherCardsSelectedSkills(prev => {
      const currentSkills = prev[skillId] || [];
      if (currentSkills.includes(skill)) {
        return {
          ...prev,
          [skillId]: currentSkills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          [skillId]: [...currentSkills, skill]
        };
      }
    });
  };

  const handleRemoveSkill = (skillId) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  const handleViewCertificate = (skillId) => {
    // Find the skill to get certificate information
    const skill = skills.find(s => s.id === skillId);
    
    if (skill && skill.hasCertificate) {
      // For the first card
      if (skillId === 1 && firstCardCertificate) {
        setSelectedCertificate({
          name: firstCardCertificate.name,
          url: firstCardCertificate.url || firstCardCertificate.file,
          type: firstCardCertificate.file ? firstCardCertificate.file.type : 'url'
        });
      } else {
        // For other cards, you might have certificate URL stored
        setSelectedCertificate({
          name: skill.certificateName || `Certificate for ${skill.name}`,
          url: skill.certificateUrl || null,
          type: 'url'
        });
      }
      setShowCertificateModal(true);
    } else {
      alert('No certificate available for this skill.');
    }
  };

  const handleEditCertificate = (skillId) => {
    // Handle edit certificate functionality
    console.log('Editing certificate for skill:', skillId);
    // You can implement file upload or certificate editing
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a URL for the file to display it
        const fileUrl = URL.createObjectURL(file);
        
        // Update the skill with certificate info
        const updatedSkills = skills.map(s => 
          s.id === skillId ? { 
            ...s, 
            hasCertificate: true, 
            certificateName: file.name,
            certificateUrl: fileUrl
          } : s
        );
        setSkills(updatedSkills);
        
        // Show success message
        alert(`Certificate uploaded for skill ${skillId}: ${file.name}`);
      }
    };
    input.click();
  };

  const handleAddRelatedSkill = (skillName) => {
    const newSkill = {
      id: Date.now(),
      name: skillName,
      learningSource: '',
      hasCertificate: false,
      borderColor: 'border-gray-200',
      bgColor: 'bg-white'
    };
    setSkills([newSkill, ...skills]);
    
  };

  const handleShowMoreSkills = (cardId) => {
    setShowMoreSkills(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      // Prepare skills data for API
      const skillsData = [];
      
      // Add first card data if it exists
      if (showFirstCard && currentMainSkill) {
        skillsData.push({
          domain: currentMainSkill,
          skills: firstCardSelectedSkills,
          learning_source: firstCardLearningSource,
          has_certificate: !!firstCardCertificate,
          certificate_url: firstCardCertificate?.url || null
        });
      }
      
      // Add other skills data
      skills.slice(1).forEach(skill => {
        const selectedSkills = otherCardsSelectedSkills[skill.id] || [];
        skillsData.push({
          domain: skill.name,
          skills: selectedSkills,
          learning_source: skill.learningSource,
          has_certificate: skill.hasCertificate,
          certificate_url: skill.certificateUrl || null
        });
      });
      
      // Get user ID from Redux store
      const user_id = user?.id || 1;
      
      // Call the API to save skills
      await skillApi.uploadSkills(user_id, skillsData, [], token);
      
      console.log('Skills saved successfully:', skillsData);
      navigate('/feed-view');
    } catch (error) {
      console.error('Error saving skills:', error);
      // You can add error handling UI here
      alert('Failed to save skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigate('/feed-view');
  };

  // Get related skills based on the current skill
  const getRelatedSkills = (skillName) => {
    return defaultRelatedSkills;
  };

  // Filter colleges based on search query
  const filteredColleges = (query, id) => {
    const searchTerm = collegeSearchQuery[id] || '';
    if (!colleges || colleges.length === 0) return [];
    
    return colleges.filter(college => {
      // Handle both string and object formats for college data
      const collegeName = typeof college === 'string' ? college : college.name || college.college_name || '';
      return collegeName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Filter skills based on search query
  const filteredSkills = () => {
    return getAllSkills().filter(skill =>
      skill.toLowerCase().includes(skillsSearchQuery.toLowerCase())
    );
  };

  // Handle skill selection from search
  const handleSkillSelect = async (skillName) => {
    try {
      // Always add as a new card, don't replace the first card
      const newSkill = {
        id: Date.now(),
        name: skillName,
        learningSource: '',
        hasCertificate: false,
        borderColor: 'border-gray-200',
        bgColor: 'bg-white'
      };
     
       // Insert new skill at index 1 (after the first card)
       const updatedSkills = [...skills];
       updatedSkills.splice(1, 0, newSkill);
       setSkills(updatedSkills);
       setSkillsSearchQuery('');
       setShowSkillsDropdown(false);
    } catch (error) {
      console.error('Error adding skill:', error);
      // Still add the skill even if there's an error
      const newSkill = {
        id: Date.now(),
        name: skillName,
        learningSource: '',
        hasCertificate: false,
        borderColor: 'border-gray-200',
        bgColor: 'bg-white'
      };
      const updatedSkills = [...skills];
      updatedSkills.splice(1, 0, newSkill);
      setSkills(updatedSkills);
      setSkillsSearchQuery('');
      setShowSkillsDropdown(false);
    }
  };

  // Function to get related skills for any domain
  const getRelatedSkillsForDomain = async (domainName) => {
    try {
      const skills = await fetchSkillsByDomain(domainName);
      return skills;
    } catch (error) {
      console.error('Error fetching skills for domain:', domainName, error);
      return [];
    }
  };

  // Handle college selection
  const handleCollegeSelect = (id, college) => {
    // Extract college name from the college object or string
    const collegeName = typeof college === 'string' ? college : college.name || college.college_name || '';
    
    const updatedSkills = skills.map(s => 
      s.id === id ? { ...s, learningSource: collegeName } : s
    );
    setSkills(updatedSkills);
    setShowCollegeDropdown(prev => ({ ...prev, [id]: false }));
    setCollegeSearchQuery(prev => ({ ...prev, [id]: '' }));
  };


  

  useEffect(() => {
    if (currentMainSkill) {
      setShowFirstCard(true);
    }
  }, [currentMainSkill]);

  return (
    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
      {/* Left Spacer */}
      <div className="hidden lg:block flex-grow "></div>

    <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoIosArrowBack className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Your Skills</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[750px]" data-skills-dropdown>
  <Input
    type="text"
    placeholder="List your skills here"
    value={skillsSearchQuery}
    onChange={(e) => {
      setSkillsSearchQuery(e.target.value);
      setShowSkillsDropdown(true);
    }}
    onFocus={() => setShowSkillsDropdown(true)}
    className="pr-10 h-[46px] w-full"
    disabled={loading}
  />
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    {loading ? (
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
    ) : (
      <IoIosSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
    )}
  </div>

  {/* Error Message */}
  {error && (
    <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
      {error}
    </div>
  )}

  {/* Skills Dropdown */}
  {showSkillsDropdown && (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      {loading ? (
        <div className="px-3 py-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Loading domains...
        </div>
      ) : (
        <>
          {getMainDomainSkills()
            .filter(skill =>
              skill.toLowerCase().includes(skillsSearchQuery.toLowerCase())
            )
            .map((skill, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between"
                onClick={() => handleSkillSelect(skill)}
              >
                <span>{skill}</span>
                <span className="text-gray-400 text-xs">Click to select</span>
              </div>
            ))}
          {getMainDomainSkills().filter(skill =>
            skill.toLowerCase().includes(skillsSearchQuery.toLowerCase())
          ).length === 0 && !loading && (
            <div className="px-3 py-2 text-gray-500 text-sm">
              {skillsSearchQuery ? 'No domains found matching your search.' : 'No domains available.'}
            </div>
          )}
        </>
      )}
    </div>
  )}
</div>

      </div>

      {/* Skills Sections */}
      <div className="space-y-4 sm:space-y-6">
        {showFirstCard && (
  <div key={currentMainSkill}>
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
      {/* Skill Tag and Certificate Section */}
      <div className="flex items-center justify-between mb-4">
        <Badge 
          variant="primary"
          className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
        >
          {currentMainSkill}
          <button
            onClick={() => handleRemoveSkill(1)}
            className="hover:bg-blue-600 rounded-full p-0.5"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </Badge>
         
        <div className="flex items-right space-x-1 justyfy-between">
          <label className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Upload Certificate
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleCertificateUpload}
              className="hidden"
            />
            
          </label>
          <IoIosInformationCircleOutline className="w-4 h-4 text-gray-400" />

           {/* Remove Button */}
           <button
          onClick={() => setShowFirstCard(false)}
          className="ml-2 px-3 py-1 text-white rounded hover:bg-red-600 text-sm"
        >
          <RxCross2  className='text-gray-400'/>

        </button>
        </div>    


      </div>
      {/* Certificate Display */}
      {firstCardCertificate && (
        <div className="mb-4">
          <div className="flex items-center  p-3 rounded-lg">
            <span className="text-sm text-gray-700 mr-2">Certificate:</span>
            <a
              href={firstCardCertificate.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-medium hover:underline mr-4"
            >
              {firstCardCertificate.name}
            </a>
           
            <button
          onClick={handleRemoveCertificate}
          className="ml-2 px-3 py-1 text-white rounded hover:bg-red-600 text-sm"
        >
          <RxCross2  className='text-gray-400'/>

        </button>
          </div>
        </div>
      )}
      {/* Skills Selection */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">Select related skills for {currentMainSkill}:</p>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-gray-500 text-sm">Loading related skills...</span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-2">
              {getRelatedSkillsForMainDomain(currentMainSkill).slice(0, showMoreSkills['firstCard'] ? getRelatedSkillsForMainDomain(currentMainSkill).length : 6).map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    firstCardSelectedSkills.includes(skill)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {getRelatedSkillsForMainDomain(currentMainSkill).length > 6 && (
              <button
                onClick={() => handleShowMoreSkills('firstCard')}
                className="text-blue-600 text-sm hover:underline"
              >
                {showMoreSkills['firstCard'] ? 'Show less' : `See more +${getRelatedSkillsForMainDomain(currentMainSkill).length - 6}`}
              </button>
            )}
            {firstCardSelectedSkills.length > 0 && (
              <p className="text-green-600 text-sm">Selected: {firstCardSelectedSkills.length} skill(s)</p>
            )}
            {getRelatedSkillsForMainDomain(currentMainSkill).length === 0 && !loading && (
              <p className="text-gray-500 text-sm">No related skills available for this domain.</p>
            )}
          </>
        )}
      </div>
      {/* Learning Source */}
      <div className="mb-4 relative" data-college-dropdown>
        <p className="text-sm text-gray-700 mb-2">Where did you learn this skill?</p>
        <div className="relative">
          <Input
            type="text"
            placeholder="College/ Company name"
            value={firstCardLearningSource}
            onChange={(e) => {
              setFirstCardLearningSource(e.target.value);
              setCollegeSearchQuery(prev => ({ ...prev, 'firstCard': e.target.value }));
            }}
            onFocus={() => setShowCollegeDropdown(prev => ({ ...prev, 'firstCard': true }))}
            className="w-full h-12 rounded-lg px-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={() => {
              setFirstCardLearningSource('');
              setCollegeSearchQuery(prev => ({ ...prev, 'firstCard': '' }));
            }}
            className="absolute bg-white right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4 " fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* College Dropdown */}
        {showCollegeDropdown['firstCard'] && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <input
              type="text"
              placeholder="Search colleges..."
              value={collegeSearchQuery['firstCard'] || ''}
              onChange={(e) => setCollegeSearchQuery(prev => ({ ...prev, 'firstCard': e.target.value }))}
              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {collegesLoading ? (
              <div className="px-3 py-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Loading colleges...
              </div>
            ) : collegesError ? (
              <div className="px-3 py-2 text-red-600 text-sm">
                Error loading colleges. Please try again.
              </div>
            ) : filteredColleges('', 'firstCard').length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {collegeSearchQuery['firstCard'] ? 'No colleges found matching your search.' : 'No colleges available.'}
              </div>
            ) : (
              <>
                {filteredColleges('', 'firstCard').map((college, collegeIndex) => {
                  const collegeName = typeof college === 'string' ? college : college.name || college.college_name || '';
                  return (
                    <div
                      key={collegeIndex}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setFirstCardLearningSource(collegeName);
                        setShowCollegeDropdown(prev => ({ ...prev, 'firstCard': false }));
                        setCollegeSearchQuery(prev => ({ ...prev, 'firstCard': '' }));
                      }}
                    >
                      {collegeName}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}

        {/* Other Skills Cards */}
        {skills.slice(1).map((skill, index) => (
          <div key={skill.id}>
            <div 
              className={`${skill.bgColor} border-2 ${skill.borderColor} rounded-lg p-4 sm:p-6`}
            >
              {/* Skill Tag and Action Buttons */}
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="primary"
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {skill.name}
                </Badge>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewCertificate(skill.id)}
                    className="flex items-center gap-1 bg-white text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <HiOutlineEye className="w-4 h-4 text-gray-500 rounded-full" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEditCertificate(skill.id)}
                    className="flex items-center gap-1 bg-white text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    Edit Certificate
                  </button>
                  
                  {/* Remove Button - Only show for newly added skills (not the existing Design cards) */}
                  {![3, 4, 5].includes(skill.id) && (
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      <RxCross2 />
                    </button>
                  )}
                </div>
                
              </div>

              {/* Skills Selection */}
              <div className="mb-4">
                {![3, 4, 5].includes(skill.id) && (
                  <p className="text-sm text-gray-700 mb-2">Select related skills for {skill.name}:</p>
                )}
                {![3, 4, 5].includes(skill.id) && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {getRelatedSkillsForMainDomain(skill.name).slice(0, showMoreSkills[skill.id] ? getRelatedSkillsForMainDomain(skill.name).length : 6).map((relatedSkill) => (
                      <button
                        key={relatedSkill}
                        onClick={() => handleOtherCardSkillToggle(skill.id, relatedSkill)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          (otherCardsSelectedSkills[skill.id] || []).includes(relatedSkill)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {relatedSkill}
                      </button>
                    ))}
                  </div>
                )}
                {![3, 4, 5].includes(skill.id) && getRelatedSkillsForMainDomain(skill.name).length > 6 && (
                  <button
                    onClick={() => handleShowMoreSkills(skill.id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {showMoreSkills[skill.id] ? 'Show less' : `See more +${getRelatedSkillsForMainDomain(skill.name).length - 6}`}
                  </button>
                )}
                {(otherCardsSelectedSkills[skill.id] || []).length > 0 && (
                  <p className="text-green-600 text-sm">Selected: {(otherCardsSelectedSkills[skill.id] || []).length} skill(s)</p>
                )}
                {![3, 4, 5].includes(skill.id) && getRelatedSkillsForMainDomain(skill.name).length === 0 && !loading && (
                  <p className="text-gray-500 text-sm">No related skills available for this domain.</p>
                )}
              </div>

              {/* Learning Source */}
              <div className="mb-4 relative" data-college-dropdown>
                <p className="text-sm text-gray-600 mb-2 text-start">Where did you learn this skill?</p>
                
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="College/Company name"
                    value={skill.learningSource}
                    onChange={(e) => {
                      const updatedSkills = skills.map(s => 
                        s.id === skill.id ? { ...s, learningSource: e.target.value } : s
                      );
                      setSkills(updatedSkills);
                      setCollegeSearchQuery(prev => ({ ...prev, [skill.id]: e.target.value }));
                    }}
                    onFocus={() => setShowCollegeDropdown(prev => ({ ...prev, [skill.id]: true }))}
                    className="w-full h-12 rounded-lg px-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <button
                    onClick={() => {
                      const updatedSkills = skills.map(s => 
                        s.id === skill.id ? { ...s, learningSource: '' } : s
                      );
                      setSkills(updatedSkills);
                      setCollegeSearchQuery(prev => ({ ...prev, [skill.id]: '' }));
                    }}
                    className="absolute bg-white right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* College Dropdown */}
                {showCollegeDropdown[skill.id] && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search colleges..."
                      value={collegeSearchQuery[skill.id] || ''}
                      onChange={(e) => setCollegeSearchQuery(prev => ({ ...prev, [skill.id]: e.target.value }))}
                      className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    {collegesLoading ? (
                      <div className="px-3 py-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        Loading colleges...
                      </div>
                    ) : collegesError ? (
                      <div className="px-3 py-2 text-red-600 text-sm">
                        Error loading colleges. Please try again.
                      </div>
                    ) : filteredColleges('', skill.id).length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        {collegeSearchQuery[skill.id] ? 'No colleges found matching your search.' : 'No colleges available.'}
                      </div>
                    ) : (
                      <>
                        {filteredColleges('', skill.id).map((college, collegeIndex) => {
                          const collegeName = typeof college === 'string' ? college : college.name || college.college_name || '';
                          return (
                            <div
                              key={collegeIndex}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => handleCollegeSelect(skill.id, college)}
                            >
                              {collegeName}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Save Changes Button */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <Button
          variant="primary"
          size="large"
          onClick={handleSaveChanges}
          disabled={saving || loading}
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm sm:text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </section>
     {/* Profile Card */}
     <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
    <FeedRightProfile />
  </aside>
  {/* Right Spacer */}
  <div className="hidden lg:block flex-grow"></div>
</div>

      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RxCross2 className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {selectedCertificate.type === 'url' && selectedCertificate.url ? (
                <div className="space-y-4">
                  {/* PDF Viewer */}
                  {selectedCertificate.url.includes('.pdf') ? (
                    <iframe
                      src={selectedCertificate.url}
                      className="w-full h-96 border border-gray-300 rounded"
                      title={selectedCertificate.name}
                    />
                  ) : (
                    /* Image Viewer */
                    <div className="flex justify-center">
                      <img
                        src={selectedCertificate.url}
                        alt={selectedCertificate.name}
                        className="max-w-full max-h-96 object-contain rounded border border-gray-300"
                      />
                    </div>
                  )}
                  
                  {/* Download Link */}
                  <div className="flex justify-center">
                    <a
                      href={selectedCertificate.url}
                      download={selectedCertificate.name}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Certificate
                    </a>
                  </div>
                </div>
              ) : selectedCertificate.type === 'file' ? (
                <div className="text-center space-y-4">
                  <div className="p-8 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-4">{selectedCertificate.name}</p>
                    <p className="text-sm text-gray-500">This certificate file is ready for upload</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Certificate uploaded successfully!</p>
                  <p className="text-sm text-gray-500 mt-2">The certificate has been saved for this skill.</p>
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
