import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../api/applicationApi";

// Helper: format applied date into "x days ago"
const formatAppliedDate = (dateStr) => {
  if (!dateStr) return "Unknown";
  const appliedDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now - appliedDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

export const useApplications = (job_id) => {
  const { token } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!job_id) return; // skip if no job_id

    const fetchApplications = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("You must be logged in to view applicants");
          setLoading(false);
          return;
        }

        const res = await applicationApi.getAllApplicantsByJob(job_id, token);

        const formatted = res.applicants.map((app) => {
          let match = "Low";
          let matchColor = "bg-red-100 text-red-600";
          if (app.skillMatchPercentage >= 70) {
            match = "High";
            matchColor = "bg-green-100 text-green-600";
          } else if (app.skillMatchPercentage >= 40) {
            match = "Moderate";
            matchColor = "bg-orange-100 text-orange-600";
          }

          return {
            application_id: app.application_id,
            name: app.name,
            location: app.currentLocation || "Not specified",
            experience: app.totalExperience
              ? `${app.totalExperience} years`
              : "Not specified",
            applied: formatAppliedDate(app.appliedDate),
            match,
            matchColor,
          };
        });

        setApplications(formatted);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [job_id, token]);

  return { applications, loading, error };
};

export const useApplicantDetail = (job_id, application_id) => {
  const { token } = useSelector((state) => state.auth);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!application_id) return;

    const fetchApplicantDetail = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("You must be logged in to view this applicant");
          setLoading(false);
          return;
        }

        const res = await applicationApi.getApplicationById(
          job_id,
          application_id,
          token
        );
        console.log("Full API response:", JSON.stringify(res, null, 2));
        console.log("applicationDetails in response:", res.applicationDetails);

        console.log("API response:", res); // Debug log
        
        setApplicant({
          application_id: res.application_id,
          user_id: res.user_id,
          job_post_id: res.job_post_id,
          status: res.status,
          name: res.name,
          email: res.email,
          phone: res.phone,
          location: res.currentLocation || "Not specified",
          experience: res.experience || [],
          totalExperience: res.totalExperience
            ? `${res.totalExperience} years`
            : "Not specified",
          appliedDate: res.appliedDate,
          skills: res.skills || [],
          resumeUrl: res.resumeUrl || null,
          education: res.education || [],
          projects: res.projects || [],
          certifications: res.certifications || [],
          screeningQuestions: res.screeningQuestions || [],
          skillMatchPercentage: res.skillMatchPercentage || 0,
          applicationDetails: res.applicationDetails || null
        });

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applicant");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetail();
  }, [job_id, application_id, token]);

  return { applicant, loading, error };
};
export const useScheduleInterview = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const scheduleInterview = async (application_id, formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        setError("You must be logged in to schedule an interview");
        setLoading(false);
        return;
      }
      console.log("hooks", formData);
      const res = await applicationApi.scheduleInterview(
        application_id,
        formData,
        token
      );

      setSuccess(res.message || "Interview scheduled successfully");
      console.log("the res is ", res);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return { scheduleInterview, loading, error, success };
};

export const useUpdateApplicationStatus = () => {
  const { token, user } = useSelector((state) => state.auth); // recruiter info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatedApplication, setUpdatedApplication] = useState(null);

  const updateStatus = useCallback(
    async (application_id, job_post_id, status) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setUpdatedApplication(null);

      try {
        if (!token || !user?.id) {
          setError("You must be logged in as recruiter to update status");
          setLoading(false);
          return;
        }

        const res = await applicationApi.updateApplicationStatus(
          application_id,
          job_post_id,
          user.id, // ✅ recruiter id
          status,
          token
        );

        setSuccess(res.message || "Application status updated");
        setUpdatedApplication(res.data || null); // backend sends updated app in res.data
        return res;
      } catch (err) {
        setError(err.message || "Failed to update application status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, user?.id]
  );

  return { updateStatus, loading, error, success, updatedApplication };
};