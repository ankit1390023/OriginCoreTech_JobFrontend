import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';
import { HiOutlineEye } from 'react-icons/hi';
import { FaEdit } from 'react-icons/fa';


const FeedYourSkills = () => {
  const navigate = useNavigate();
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
  const [currentMainSkill, setCurrentMainSkill] = useState('Web Development');
  const [showFirstCard, setShowFirstCard] = useState(true);
  
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
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-50'
    },
    {
      id: 4,
      name: 'Design',
      learningSource: 'Delhi Technological University',
      hasCertificate: true,
      borderColor: 'border-green-300',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      name: 'Design',
      learningSource: 'Delhi Technological University',
      hasCertificate: true,
      borderColor: 'border-red-300',
      bgColor: 'bg-red-50'
    }
  ]);

  // Dummy college/company names for suggestions
  const dummyColleges = [
    'Delhi University', 'IIT Delhi', 'Delhi Technological University', 'JNU Delhi',
    'Amity University', 'GGSIPU', 'NSIT Delhi', 'DTU Delhi', 'IIIT Delhi',
    'Google India', 'Microsoft India', 'Amazon India', 'TCS', 'Infosys',
    'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture', 'IBM India'
  ];


  // // Web Development related skills for first card
  // const webDevelopmentSkills = ['HTML', 'CSS', 'JavaScript', 'React', 'Bootstrap'];

  // Categorized related skills for search bar
  const categorizedSkills = {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Rust', 'TypeScript'],
    'Web Development': ['HTML', 'CSS', 'React', 'Node.js', 'Vue.js', 'Angular', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Less', 'jQuery'],
    'Database & Backend': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'Express.js', 'Django', 'Flask'],
    'Cloud & DevOps': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'CI/CD', 'Jenkins', 'Terraform'],
    'Data Science & AI': ['Data Analysis', 'Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter'],
    'Mobile Development': ['React Native', 'Flutter', 'Android Development', 'iOS Development', 'Mobile App Design', 'Xamarin', 'Ionic'],
    'Design & Creative': ['UI/UX Design', 'Graphic Design', 'Illustration', 'Typography', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch'],
    'Digital Marketing': ['SEO', 'Content Writing', 'Social Media Marketing', 'Email Marketing', 'Google Ads', 'Analytics', 'PPC', 'Brand Management'],
    'Business & Management': ['Project Management', 'Agile', 'Scrum', 'Product Management', 'Business Analysis', 'Team Leadership', 'Quality Assurance'],
    'Cybersecurity': ['Cybersecurity', 'Network Security', 'Application Security', 'Penetration Testing', 'Ethical Hacking', 'Security Auditing'],
    'Emerging Technologies': ['Blockchain', 'Web3', 'IoT', 'AR/VR', 'Metaverse', 'Quantum Computing', 'Robotics', 'Automation'],
    'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Critical Thinking', 'Creativity', 'Adaptability', 'Time Management']
  };

  // Flatten all skills for search functionality
  const allSkills = Object.values(categorizedSkills).flat();

  // Default related skills (fallback)
  const defaultRelatedSkills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Bootstrap'];

  // Related skills by category (fallback)
  const relatedSkillsByCategory = {
    'Web Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Vue.js', 'Angular', 'Bootstrap', 'Tailwind CSS'],
    'Design': ['UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Typography'],
    'Programming': ['JavaScript', 'Python', 'Java', 'C++', 'PHP', 'Ruby', 'Go', 'Swift']
  };

  // Main domain skills that can replace the first card
  const mainDomainSkills = [
    'Web Development', 'Mobile Development', 'Data Science', 'Data Analysis', 
    'Machine Learning', 'Artificial Intelligence', 'UI/UX Design', 'Graphic Design',
    'Digital Marketing', 'Cybersecurity', 'Cloud Computing', 'DevOps',
    'Software Engineering', 'Product Management', 'Business Analysis'
  ];

  // Related skills for main domain skills
  const getRelatedSkillsForMainDomain = (mainSkill) => {
    const relatedSkillsMap = {
      'Web Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Vue.js', 'Angular', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Less', 'jQuery', 'Express.js', 'Django', 'Flask'],
      'Mobile Development': ['React Native', 'Flutter', 'Android Development', 'iOS Development', 'Mobile App Design', 'Xamarin', 'Ionic', 'Cordova', 'Swift', 'Kotlin', 'Java'],
      'Data Science': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter', 'Tableau', 'Power BI'],
      'Data Analysis': ['Excel', 'SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Google Analytics', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Statistics'],
      'Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'Keras', 'OpenCV', 'NLTK'],
      'Artificial Intelligence': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Neural Networks', 'OpenAI', 'Hugging Face'],
      'UI/UX Design': ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems', 'Typography', 'Color Theory', 'Accessibility Design'],
      'Graphic Design': ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Canva', 'Typography', 'Color Theory', 'Layout Design', 'Brand Identity', 'Logo Design', 'Print Design'],
      'Digital Marketing': ['SEO', 'Content Writing', 'Social Media Marketing', 'Email Marketing', 'Google Ads', 'Facebook Ads', 'Analytics', 'PPC', 'Google Analytics', 'Facebook Pixel', 'Brand Management'],
      'Cybersecurity': ['Network Security', 'Application Security', 'Penetration Testing', 'Ethical Hacking', 'Security Auditing', 'Incident Response', 'Threat Intelligence', 'Cryptography', 'Security Compliance'],
      'Cloud Computing': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'Microservices', 'Serverless'],
      'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'CI/CD', 'Terraform', 'Ansible', 'AWS', 'Azure', 'Monitoring', 'Logging'],
      'Software Engineering': ['Java', 'Python', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS', 'Testing', 'Agile'],
      'Product Management': ['Agile', 'Scrum', 'Kanban', 'User Research', 'Market Research', 'Data Analysis', 'Stakeholder Management', 'Roadmapping', 'A/B Testing', 'Analytics'],
      'Business Analysis': ['Requirements Gathering', 'Process Modeling', 'Data Analysis', 'SQL', 'Excel', 'Power BI', 'Stakeholder Management', 'Documentation', 'UML', 'Business Process']
    };
    return relatedSkillsMap[mainSkill] || [];
  };

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
      setFirstCardCertificate({
        name: file.name,
        file: file
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

  const handleRemoveSkill = (skillId) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  const handleViewCertificate = (skillId) => {
    // Handle view certificate functionality
    console.log('Viewing certificate for skill:', skillId);
    // You can implement modal or navigation to view certificate
    alert('View certificate functionality - Skill ID: ' + skillId);
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
        alert(`Certificate uploaded for skill ${skillId}: ${file.name}`);
        // Update the skill with certificate info
        const updatedSkills = skills.map(s => 
          s.id === skillId ? { ...s, hasCertificate: true, certificateName: file.name } : s
        );
        setSkills(updatedSkills);
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

  const handleSaveChanges = () => {
    // Handle save functionality
    console.log('Saving skills:', skills);
    // Navigate back to feed view after saving
    navigate('/feed-view');
  };

  const handleGoBack = () => {
    navigate('/feed-view');
  };

  // Get related skills based on the current skill
  const getRelatedSkills = (skillName) => {
    return relatedSkillsByCategory[skillName] || defaultRelatedSkills;
  };

  // Filter colleges based on search query
  const filteredColleges = (query, id) => {
    const searchTerm = collegeSearchQuery[id] || '';
    return dummyColleges.filter(college =>
      college.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter skills based on search query
  const filteredSkills = () => {
    return allSkills.filter(skill =>
      skill.toLowerCase().includes(skillsSearchQuery.toLowerCase())
    );
  };

  // Handle college selection
  const handleCollegeSelect = (id, college) => {
    const updatedSkills = skills.map(s => 
      s.id === id ? { ...s, learningSource: college } : s
    );
    setSkills(updatedSkills);
    setShowCollegeDropdown(prev => ({ ...prev, [id]: false }));
    setCollegeSearchQuery(prev => ({ ...prev, [id]: '' }));
  };

  // Handle skill selection from search
  const handleSkillSelect = (skillName) => {
    // Check if it's a main domain skill
    if (mainDomainSkills.includes(skillName)) {
      // Replace the first card
      setCurrentMainSkill(skillName);
      setFirstCardSelectedSkills([]); // Reset selected related skills
      setFirstCardLearningSource(''); // Reset learning source
      setFirstCardCertificate(null); // Reset certificate
    } else {
      // Add as a new card
      const newSkill = {
        id: Date.now(),
        name: skillName,
        learningSource: '',
        hasCertificate: false,
        borderColor: 'border-gray-200',
        bgColor: 'bg-white'
      };
      setSkills([newSkill, ...skills]);
    }
    setSkillsSearchQuery('');
    setShowSkillsDropdown(false);
  };

  useEffect(() => {
    setShowFirstCard(true);
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
  />
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    <IoIosSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
  </div>

  {/* Skills Dropdown */}
  {showSkillsDropdown && (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      {mainDomainSkills
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
      {mainDomainSkills.filter(skill =>
        skill.toLowerCase().includes(skillsSearchQuery.toLowerCase())
      ).length === 0 && (
        <div className="px-3 py-2 text-gray-500 text-sm">
          No main domain skills found.
        </div>
      )}
    </div>
  )}
</div>

      </div>

      {/* Skills Sections */}
      <div className="space-y-4 sm:space-y-6">
        {showFirstCard && (
  <div>
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
          {/* Remove Button */}
          <button
          onClick={() => setShowFirstCard(false)}
          className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Remove
        </button>
          <IoIosInformationCircleOutline className="w-4 h-4 text-gray-400" />
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
              className="bg-transparent text-red-500 px-3 py-1 rounded text-sm bg-red-600 text-white transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      {/* Skills Selection */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">Select related skills for {currentMainSkill}:</p>
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
            {filteredColleges('', 'firstCard').map((college, collegeIndex) => (
              <div
                key={collegeIndex}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setFirstCardLearningSource(college);
                  setShowCollegeDropdown(prev => ({ ...prev, 'firstCard': false }));
                  setCollegeSearchQuery(prev => ({ ...prev, 'firstCard': '' }));
                }}
              >
                {college}
              </div>
            ))}
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
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="hover:bg-blue-600 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
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
                </div>
                
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
                    {filteredColleges('', skill.id).map((college, collegeIndex) => (
                      <div
                        key={collegeIndex}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleCollegeSelect(skill.id, college)}
                      >
                        {college}
                      </div>
                    ))}
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
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm sm:text-base transition-colors duration-200"
        >
          Save Changes
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
</MainLayout>
  );
};

export default FeedYourSkills;
