import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { userDetailsApi } from '../api/userDetailsApi';
import { formatDate, calculateTimeSpan } from '../../utils';

export const useUserDetailsApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userActivity, setUserActivity] = useState([]);
    const [workExperiences, setWorkExperiences] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [skillsData, setSkillsData] = useState([]);
    const { token } = useSelector((state) => state.auth);



    // Create user details
    const createUserDetails = useCallback(async (userData) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.createUserDetails(userData, token);
            return response;
        } catch (err) {
            console.error('Error creating user details:', err);
            setError('Failed to create user details. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Get user details by userId
    const getUserDetails = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.getUserDetails(userId);
            return response;
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get public user profile by ID
    const getUserPublicProfileById = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.getUserPublicProfileById(userId);
            return response;
        } catch (err) {
            console.error('Error fetching public user profile:', err);
            setError('Failed to fetch public user profile. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserPublicProfile = useCallback(async (userId, userToken, dataType = 'all') => {
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.getUserPublicProfile(userId, userToken, dataType);
            
            if (response.success && response.data) {
                const data = response.data;
                
                // Set profile data
                setProfile(data.publicProfile || data);
                
                // Initialize formatted data variables
                let formattedActivity = [];
                let formattedExperiences = [];
                let formattedEducation = [];
                let formattedSkills = [];
                
                // Format and set activity data
                if (data.activity?.length) {
                    formattedActivity = data.activity.map((activity, index) => ({
                        id: activity._id || index + 1,
                        content: activity.caption || "",
                        image: activity.image,
                        likeCount: activity.likeCount || 0,
                        commentCount: activity.commentCount || 0,
                        createdAt: activity.createdAt,
                        user: {
                            firstName: data.publicProfile?.firstName || "User",
                            lastName: data.publicProfile?.lastName || "",
                            profileImage: data.publicProfile?.profileImage || "/src/assets/profile1.png",
                            userType: data.publicProfile?.userType || "User"
                        }
                    }));
                    setUserActivity(formattedActivity);
                } else {
                    setUserActivity([]);
                }
                
                // Format and set experiences data
                if (data.experiences?.length) {
                    formattedExperiences = data.experiences.map((exp, index) => ({
                        id: index + 1,
                        logo: "/src/assets/WebsiteLogo.svg",
                        company: exp.currentCompany || "Unknown Company",
                        position: exp.currentJobRole || "Unknown Position",
                        duration: `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`,
                        timeSpan: calculateTimeSpan(exp.startDate, exp.endDate),
                        description: `Worked as ${exp.currentJobRole || "employee"} at ${exp.currentCompany || "company"}. Status: ${exp.status || "unknown"}`,
                        status: exp.status
                    }));
                    setWorkExperiences(formattedExperiences);
                } else {
                    setWorkExperiences([]);
                }
                
                // Format and set education data
                if (data.educations?.length) {
                    formattedEducation = data.educations.map((edu, index) => ({
                        id: edu.id || index + 1,
                        logo: "/src/assets/WebsiteLogo.svg",
                        institution: edu.schoolOrCollege || "Unknown Institution",
                        degree: `${edu.level || "Education"}${edu.course ? `, ${edu.course}` : ""}${edu.specialization ? ` - ${edu.specialization}` : ""}`,
                        duration: `${edu.startYear || "N/A"} - ${edu.endYear || "N/A"}`,
                        description: `Studied at ${edu.schoolOrCollege || "institution"} under ${edu.boardOrUniversity || "board"}. ${edu.percentageOrCgpa ? `Achieved ${edu.percentageOrCgpa}%` : ""}`,
                        percentage: edu.percentageOrCgpa,
                        board: edu.boardOrUniversity
                    }));
                    setEducationData(formattedEducation);
                } else {
                    setEducationData([]);
                }
                
                // Format and set skills data
                if (data.skills?.length) {
                    formattedSkills = data.skills.map((skill, index) => {
                        // Handle both string skills and object skills
                        if (typeof skill === 'string') {
                            return {
                                id: index + 1,
                                logo: "/src/assets/WebsiteLogo.svg",
                                skill: skill,
                                category: "Technical Skills",
                                description: `Proficient in ${skill} with practical experience and knowledge.`
                            };
                        } else if (typeof skill === 'object' && skill !== null) {
                            // Handle object skills with domain, subSkills, authority, certificate_image
                            const skillName = skill.domain || skill.name || skill.skill || 'Unknown Skill';
                            const skillDescription = skill.subSkills && Array.isArray(skill.subSkills) && skill.subSkills.length > 0
                                ? `Sub-skills: ${skill.subSkills.join(', ')}`
                                : `Proficient in ${skillName} with practical experience and knowledge.`;
                            const skillLogo = skill.certificate_image || skill.logo || "/src/assets/WebsiteLogo.svg";
                            
                            return {
                                id: skill._id || skill.id || index + 1,
                                logo: skillLogo,
                                skill: skillName,
                                category: skill.category || "Technical Skills",
                                description: skillDescription,
                                authority: skill.authority,
                                subSkills: skill.subSkills,
                                certificate_image: skill.certificate_image,
                                domain: skill.domain
                            };
                        } else {
                            // Fallback for unexpected data types
                            return {
                                id: index + 1,
                                logo: "/src/assets/WebsiteLogo.svg",
                                skill: 'Unknown Skill',
                                category: "Technical Skills",
                                description: 'Skill information not available.'
                            };
                        }
                    });
                    setSkillsData(formattedSkills);
                } else {
                    setSkillsData([]);
                }
                
                return {
                    profile: data.publicProfile || data,
                    activity: formattedActivity,
                    experiences: formattedExperiences,
                    education: formattedEducation,
                    skills: formattedSkills
                };
            } else {
                setError(response.error || 'Failed to fetch user details.');
                setProfile(null);
                setUserActivity([]);
                setWorkExperiences([]);
                setEducationData([]);
                setSkillsData([]);
                return null;
            }
        } catch (err) {
            console.error('Error fetching public user profile:', err);
            setError('Failed to fetch public user profile. Please try again.');
            setProfile(null);
            setUserActivity([]);
            setWorkExperiences([]);
            setEducationData([]);
            setSkillsData([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        profile,
        userActivity,
        workExperiences,
        educationData,
        skillsData,
        createUserDetails,
        getUserDetails,
        getUserPublicProfileById,
        getUserPublicProfile,
        setError
    };
}; 