import React, {useState} from "react";
import { useParams, useLocation } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterApplicationData from "./RecruiterApplicationData";
import { useApplicantDetail } from "../../../hooks/useApplications";
import { useNavigate } from "react-router-dom";
import { useUpdateApplicationStatus } from "../../../hooks/useApplications";
import { getImageUrl } from "../../../../utils";

const ApplicationDetail = () => {
  const { job_id, application_id } = useParams();
  const { applicant, loading, error } = useApplicantDetail(
    job_id,
    application_id
  );
  const location = useLocation();
  const app = location.state?.app;
  const navigate = useNavigate();

  const {
    updateStatus,
    updating,
    error: updateError,
  } = useUpdateApplicationStatus();

  // Handler for updating status
  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus(application_id, job_id, newStatus);
      alert(`Status updated to ${newStatus}`);
      // Optionally: navigate back or refresh applicant detail
      // navigate(-1);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.message || "Failed to update status");
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading applicant details...</p>
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );

  if (!applicant)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>No applicant data found</p>
        </div>
      </MainLayout>
    );

    //To show few skills and show more 

    const SkillList = ({ skills = [] }) => {
      const [expanded, setExpanded] = useState(false);
      const skillNames = [...new Set(skills.map(skill => skill.name))];

      if (skillNames.length === 0) {
        return <p className="mt-2 text-sm">Skills: No skills specified</p>;
      }

      const displayedSkills = expanded ? skillNames : skillNames.slice(0, 3);

      return (
        <p className="mt-2 text-sm">
          Skills: {displayedSkills.join(", ")}
          {skillNames.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-2 text-blue-500 hover:underline"
            >
              {expanded ? "Show less" : `+${skillNames.length - 3} more`}
            </button>
          )}
        </p>
      );
    };


  //Format Education
  const transformedEducation =
    applicant.applicationDetails.education?.map((edu) => ({
      degree: edu.level || edu.educationCourse?.name || "Unknown Degree",
      institution:
        edu.schoolCollegeEducations?.name ||
        edu.board_or_university ||
        "Unknown Institution",
      startYear: edu.start_year || "Unknown",
      endYear: edu.end_year || "Present",
      fieldOfStudy:
        edu.educationSpecialization?.name || edu.educationCourse?.name || null,
      grade: edu.percentage_or_cgpa || null,
    })) || [];

  const transformedExperiences = (
  applicant.applicationDetails.experiences || []
).map((exp) => {
  let responsibilities = [];

  // Parse responsibilities if present (can be stringified JSON or array)
  try {
    if (Array.isArray(exp.responsibilities)) {
      responsibilities = exp.responsibilities;
    } else if (typeof exp.responsibilities === "string") {
      responsibilities = JSON.parse(exp.responsibilities);
      if (!Array.isArray(responsibilities)) responsibilities = [];
    }
  } catch (e) {
    responsibilities = [];
  }

  // Determine if the experience is current
  const isCurrent = !exp.end_date;

  // Format duration
  let duration = "";
  if (exp.start_date) {
    const start = new Date(exp.start_date);
    const end = exp.end_date ? new Date(exp.end_date) : new Date(); // use current date if still working

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0) duration += `${years} yr${years > 1 ? "s" : ""}`;
    if (months > 0) duration += ` ${months} mo`;
    duration = duration.trim();
  }

  return {
    title: exp.jobRole?.title || "—",
    company: exp.companyRecruiterProfile?.company_name || `Company ${exp.company_id}` || "—",
    location: exp.companyRecruiterProfile?.companyLocation?.name || null,
    startDate: exp.start_date || null,
    endDate: exp.end_date || null,
    isCurrent,
    duration: duration || null,
    description: exp.description || exp.jobRole?.description || null,
    responsibilities,
    isInternship: false, 
  };
});



  //calculate total experience
  const calculateTotalExperience = (experiences) => {
    if (!Array.isArray(experiences) || experiences.length === 0) return "0 years";

    let totalMonths = 0;

    experiences.forEach((exp) => {
      if (!exp.start_date) return;

      const start = new Date(exp.start_date);
      const end = exp.end_date ? new Date(exp.end_date) : new Date();

      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();

      const durationInMonths = years * 12 + months;

      if (durationInMonths > 0) {
        totalMonths += durationInMonths;
      }
    });

    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    const yearStr = totalYears > 0 ? `${totalYears} year${totalYears > 1 ? "s" : ""}` : "";
    const monthStr = remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : "";

    return [yearStr, monthStr].filter(Boolean).join(" ");
  };


  console.log("applicant detail are", applicant);
  const appDetails = applicant?.applicationDetails;

  return (
    <MainLayout>
      <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-4 ">
        {/* <div className="hidden lg:block w-[250px]"></div> */}
        <aside className="hidden lg:block  max-w-full sticky top-4 h-fit mt-2">
          {/* hidden lg:block w-[350px] xl:w-[450px] 2xl:w-[550px] h-screen sticky top-0 pt-6  overflow-y-auto" */}
          <RecruiterApplicationData job_id={job_id} />
        </aside>

        <div className="bg-white rounded-lg shadow-md w-full max-w-[850px] min-h-[843px] py-5 px-6 flex flex-col gap-2 overflow-y-auto mt-2">
          {" "}
          {/* Header */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h2 className="text-lg font-semibold">
                {appDetails.name || "N/A"}
              </h2>
              <p className="text-sm text-gray-500">
                {appDetails.currentLocation?.name || "Location not specified"}
                {applicant.willingToRelocate ? " (Open to relocate)" : ""}
              </p>
              <p className="text-sm text-gray-500">
                Total work experience:{" "}
                {calculateTotalExperience(
                  applicant.applicationDetails.experiences
                )}{" "}
              </p>
              <SkillList skills={applicant.applicationDetails.skills || []} />
              <p className="mt-1 text-sm">
                Languages: {appDetails.language || "Not specified"}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  applicant.skillMatchPercentage >= 70
                    ? "bg-green-100 text-green-600"
                    : applicant.skillMatchPercentage >= 40
                    ? "bg-orange-100 text-orange-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                Resume match:{" "}
                {applicant.skillMatchPercentage >= 70
                  ? "High"
                  : applicant.skillMatchPercentage >= 40
                  ? "Moderate"
                  : "Low"}{" "}
                ({applicant.skillMatchPercentage || 0}%)
              </span>
              <p className="mt-1 text-xs text-gray-400">
                Applied{" "}
                {applicant.appliedDate
                  ? new Date(applicant.appliedDate).toLocaleDateString()
                  : "recently"}
              </p>
            </div>
          </div>
          {/* Screening Questions */}
          {applicant.screeningQuestions &&
            applicant.screeningQuestions.length > 0 && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="mb-2 font-semibold">Screening Questions</h3>
                {applicant.screeningQuestions.map((qna, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-medium">{qna.question}</p>
                    <p className="text-sm text-gray-600">{qna.answer}</p>
                  </div>
                ))}
              </div>
            )}
          {/* Application Details */}
          {applicant.applicationDetails && (
            <div className="p-4 mb-4 border border-gray-200 rounded-lg">
              <h3 className="mb-3 font-semibold">Application Details</h3>

              {applicant.applicationDetails.why_should_we_hire_you && (
                <div className="mb-4">
                  <h4 className="mb-1 font-medium text-gray-700">
                    Why should we hire you?
                  </h4>
                  <p className="text-sm text-gray-600">
                    {applicant.applicationDetails.why_should_we_hire_you}
                  </p>
                </div>
              )}

              {applicant.applicationDetails.project && (
                <div className="mb-4">
                  <h4 className="mb-1 font-medium text-gray-700">Project</h4>
                  <p className="text-sm text-gray-600">
                    {applicant.applicationDetails.project}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {applicant.applicationDetails.github_link && (
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="mb-1 font-medium text-gray-700">GitHub</h4>
                    <a
                      href={applicant.applicationDetails.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 break-all hover:underline"
                    >
                      {applicant.applicationDetails.github_link}
                    </a>
                  </div>
                )}

                {applicant.applicationDetails.portfolio_link && (
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="mb-1 font-medium text-gray-700">
                      Portfolio
                    </h4>
                    <a
                      href={applicant.applicationDetails.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 break-all hover:underline"
                    >
                      {applicant.applicationDetails.portfolio_link}
                    </a>
                  </div>
                )}

                {applicant.applicationDetails.confirm_availability && (
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="mb-1 font-medium text-gray-700">
                      Availability Confirmation
                    </h4>
                    <p className="text-sm text-gray-600">
                      {applicant.applicationDetails.confirm_availability == 1
                        ? "✅ Available for the position"
                        : applicant.applicationDetails.confirm_availability}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Resume */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="mb-3 font-semibold">Resume</h3>

            {/* Education */}
            {transformedEducation.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-blue-600">Education</h4>
                {transformedEducation.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-gray-500">
                      {edu.institution} ({edu.startYear} - {edu.endYear})
                    </p>
                    {edu.fieldOfStudy && (
                      <p className="text-sm text-gray-500">
                        {edu.fieldOfStudy}
                      </p>
                    )}
                    {edu.grade && (
                      <p className="text-sm text-gray-500">
                        Grade: {edu.grade}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {Array.isArray(transformedExperiences) &&
              transformedExperiences.length > 0 && (
                <div className="mb-6">
                  {" "}
                  {/* Slightly more breathing room */}
                  <h4 className="mb-3 font-semibold text-blue-600">
                    {" "}
                    {/* Added mb-3 for spacing */}
                    {transformedExperiences.some((exp) => exp?.isInternship)
                      ? "Internships & Experience"
                      : "Experience"}
                  </h4>
                  <div className="space-y-4">
                    {" "}
                    {/* Better vertical rhythm than mb-3 on each */}
                    {transformedExperiences.map((exp, index) => (
                      <div
                        key={index}
                        className="pl-4 border-l-4 border-gray-200"
                      >
                        {" "}
                        {/* Optional: left accent bar like resume */}
                        <p className="font-medium text-gray-900">
                          {exp.title} –{" "}
                          <span className="font-normal">{exp.company}</span>
                          {exp.location && (
                            <span className="text-gray-500">
                              , {exp.location}
                            </span>
                          )}
                        </p>
                        {exp.startDate && (
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(exp.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            –{" "}
                            {exp.isCurrent
                              ? "Present"
                              : exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Present"}
                            {exp.duration && <span> · {exp.duration}</span>}
                          </p>
                        )}
                        {exp.description && (
                          <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            {exp.description}
                          </p>
                        )}
                        {exp.responsibilities &&
                          exp.responsibilities.length > 0 && (
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                              {exp.responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="mt-1 mr-2 text-gray-400">
                                    •
                                  </span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Projects */}
            {applicant.projects && applicant.projects.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-blue-600">Projects</h4>
                {applicant.projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-medium">{project.name}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-500">
                        Technologies: {project.technologies.join(", ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-600">
                      {project.description}
                    </p>
                    {project.responsibilities &&
                      project.responsibilities.length > 0 && (
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {project.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Certifications */}
          {applicant.certifications && applicant.certifications.length > 0 && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="mb-3 font-semibold text-blue-600">
                Certifications
              </h4>
              {applicant.certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  <p className="font-medium">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-sm text-gray-500">
                      Issued by: {cert.issuer}
                    </p>
                  )}
                  {cert.issueDate && (
                    <p className="text-sm text-gray-500">
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      {cert.expirationDate &&
                        ` • Expires: ${new Date(
                          cert.expirationDate
                        ).toLocaleDateString()}`}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Additional Links */}
          {applicant.links && applicant.links.length > 0 && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="mb-3 font-semibold text-blue-600">
                Additional Links
              </h4>
              <div className="space-y-2">
                {applicant.links.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 truncate hover:underline"
                      title={link.url}
                    >
                      {link.label || link.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Resume Download */}
          {appDetails.resume && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="mb-3 font-semibold text-blue-600">Resume</h4>
              <a
                href={getImageUrl(appDetails.resume)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-500 hover:underline"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Resume
              </a>
            </div>
          )}
          {/* Contact Information */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="mb-3 font-semibold text-blue-600">
              Contact Information
            </h4>
            <div className="space-y-2">
              {applicant.applicationDetails.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href={`mailto:${applicant.applicationDetails.email}`}
                    className="text-blue-500 hover:underline"
                  >
                    {applicant.applicationDetails.email}
                  </a>
                </p>
              )}
              {applicant?.applicationDetails?.phone && (
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  <a
                    href={`tel:${applicant.applicationDetails.phone.replace(
                      /\D/g,
                      ""
                    )}`}
                    className="text-blue-500 hover:underline"
                  >
                    {applicant.applicationDetails.phone}
                  </a>
                </p>
              )}
              {applicant.linkedInUrl && (
                <p className="text-sm">
                  <span className="font-medium">LinkedIn:</span>{" "}
                  <a
                    href={applicant.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {applicant.linkedInUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 mt-6 border-t border-gray-200">
            <button
              onClick={() =>
                navigate("/recruiter-send-assignment/" + app.application_id, {
                  state: { applicant: app },
                })
              }
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex-1 min-w-[120px]"
            >
              Send Assignment
            </button>

            <button
              onClick={() =>
                navigate(
                  "/recruiter-schedule-interview/" + app.application_id,
                  { state: { applicationData: app } }
                )
              }
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex-1 min-w-[120px]"
            >
              Schedule Interview
            </button>

            <button
              onClick={() => handleStatusChange("Hired")}
              disabled={updating}
              className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 flex-1 min-w-[80px]"
            >
              {updating ? "Updating..." : "Hire"}
            </button>

            <button
              onClick={() => handleStatusChange("NotInterested")}
              disabled={updating}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 flex-1 min-w-[120px]"
            >
              {updating ? "Updating..." : "Not Interested"}
            </button>

            <button
              onClick={() => handleStatusChange("ShortList")}
              disabled={updating}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 flex-1 min-w-[100px]"
            >
              {updating ? "Updating..." : "Shortlist"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationDetail;
