import { useEffect, useState } from "react";
import {userDetailsApi} from "../api/userDetailsApi.js";

const useGetMiniUserProfile = ({ user, token }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [miniProfile, setMiniProfile] = useState(null);

    useEffect(() => {
        const fetchMiniProfile = async () => {
            if (!token) return;
            setLoading(true);
            setError(null);
            try {
                const response = await userDetailsApi.getUserDetails(user,token);
                setMiniProfile(response);
                console.log("response from minidetail hook Profile", response);
            } catch (error) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchMiniProfile();
    }, [token, user?.id]);

    return { miniProfile, loading, error };

};

export { useGetMiniUserProfile };