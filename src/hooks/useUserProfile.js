import { useState, useEffect } from "react";
import { userService } from "../api/userService";

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const result = await userService.getUserDetails(userId);

      if (result.success) {
        console.log("Full API response:", result.data);

        const userDetail = result.data?.userDetail || {};
        setProfile(userDetail);
        setEducationData(userDetail?.userEducations || []);
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return { profile, educationData, loading, error };
}
