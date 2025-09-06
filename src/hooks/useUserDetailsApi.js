import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { userDetailsApi } from "../api/userDetailsApi";
import { formatDate, calculateTimeSpan } from "../../utils";

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
  const createUserDetails = useCallback(
    async (userData) => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const response = await userDetailsApi.createUserDetails(
          userData,
          token
        );
        return response;
      } catch (err) {
        console.error("Error creating user details:", err);
        setError("Failed to create user details. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Get user details by user_id
  const getUserDetails = useCallback(async (user_id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userDetailsApi.getUserDetails(user_id);
      return response;
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get public user profile by ID
  const getUserPublicProfileById = useCallback(async (user_id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userDetailsApi.getUserPublicProfileById(user_id);
      return response;
    } catch (err) {
      console.error("Error fetching public user profile:", err);
      setError("Failed to fetch public user profile. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserPublicProfile = useCallback(
    async (user_id, userToken, dataType = "all") => {
      try {
        setLoading(true);
        setError(null);
        const response = await userDetailsApi.getUserPublicProfile(
          user_id,
          userToken,
          dataType
        );

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
              like_count: activity.like_count || 0,
              comment_count: activity.comment_count || 0,
              created_at: activity.created_at,
              user: {
                first_name: data.publicProfile?.first_name || "User",
                last_name: data.publicProfile?.last_name || "",
                profileImage:
                  data.publicProfile?.profileImage ||
                  "/src/assets/profile1.png",
                user_type: data.publicProfile?.user_type || "User",
              },
            }));
            setUserActivity(formattedActivity);
          } else {
            setUserActivity([]);
          }

          // Format and set experiences data
          if (data.experiences?.length) {
            formattedExperiences = data.experiences.map((exp, index) => ({
              id: exp.id || index + 1,
              logo: exp.company_logo || "/src/assets/WebsiteLogo.svg",
              company: exp.company_name || "Unknown Company",
              position: exp.job_role_title || "Unknown Position",
              duration: `${formatDate(exp.start_date)} - ${formatDate(
                exp.end_date
              )}`,
              timeSpan: calculateTimeSpan(exp.start_date, exp.end_date),
              description: `Worked as ${
                exp.job_role_title || "employee"
              } at ${exp.company_name || "company"}. Status: ${
                exp.status || "unknown"
              }`,
              status: exp.status,
            }));
            setWorkExperiences(formattedExperiences);
          } else {
            setWorkExperiences([]);
          }

          // Format and set education data
          if (data.educations?.length) {
            formattedEducation = data.educations.map((edu, index) => ({
              id: edu.id || index + 1,
              logo: edu.schoolCollegeEducations.logo_pic,
              institution: edu.schoolCollegeEducations.name || "Unknown Institution",
              degree: `${edu.level || "Education"}${
                edu.course ? `, ${edu.course}` : ""
              }${edu.specialization ? ` - ${edu.specialization}` : ""}`,
              duration: `${edu.start_year || "N/A"} - ${edu.end_year || "N/A"}`,
              description: `Studied at ${
                edu.schoolOrCollege || "institution"
              } under ${edu.board_or_university || "board"}. ${
                edu.percentage_or_cgpa
                  ? `Achieved ${edu.percentage_or_cgpa}%`
                  : ""
              }`,
              percentage: edu.percentage_or_cgpa,
              board: edu.board_or_university,
            }));
            console.log(formattedEducation);
            setEducationData(formattedEducation);
          } else {
            setEducationData([]);
          }

          
          // Format and set skills data
          if (data.skills?.length) {
            formattedSkills = data.skills.map((skill, index) => {
              // Handle both string skills and object skills
              if (typeof skill === "string") {
                return {
                  id: index + 1,
                  logo: "/src/assets/WebsiteLogo.svg",
                  skill: skill,
                  category: "Technical Skills",
                  description: `Proficient in ${skill} with practical experience and knowledge.`,
                };
              } else if (typeof skill === "object" && skill !== null) {
                // Handle object skills with domain, subSkills, authority, certificate_image
                const skillName =
                  skill.domain || skill.name || skill.skill || "Unknown Skill";
                const skillDescription =
                  skill.subSkills &&
                  Array.isArray(skill.subSkills) &&
                  skill.subSkills.length > 0
                    ? `Sub-skills: ${skill.subSkills.join(", ")}`
                    : `Proficient in ${skillName} with practical experience and knowledge.`;
                  const skillLogo =
                    Array.isArray(skill.authority) && skill.authority.length > 0
                      ? skill.authority[0].logo_url
                      : "/src/assets/WebsiteLogo.svg";
  
                return {
                  id: skill._id || skill.id || index + 1,
                  logo: skillLogo,
                  skill: skillName,
                  category: skill.category || "Technical Skills",
                  description: skillDescription,
                  authority: skill.authority,
                  subSkills: skill.subSkills,
                  certificate_image: skill.certificate_image,
                  domain: skill.domain,
                };
              } else {
                // Fallback for unexpected data types
                return {
                  id: index + 1,
                  logo: "/src/assets/WebsiteLogo.svg",
                  skill: "Unknown Skill",
                  category: "Technical Skills",
                  description: "Skill information not available.",
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
            skills: formattedSkills,
          };
        } else {
          setError(response.error || "Failed to fetch user details.");
          setProfile(null);
          setUserActivity([]);
          setWorkExperiences([]);
          setEducationData([]);
          setSkillsData([]);
          return null;
        }
      } catch (err) {
        console.error("Error fetching public user profile:", err);
        setError("Failed to fetch public user profile. Please try again.");
        setProfile(null);
        setUserActivity([]);
        setWorkExperiences([]);
        setEducationData([]);
        setSkillsData([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
    setError,
  };
};
