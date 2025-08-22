import { useState, useEffect, useCallback } from "react";
import { domainApi } from "../api/domainApi";
import { useSelector } from "react-redux";

export const useDomainsApi = (defaultDomain) => {
  const [allDomains, setAllDomains] = useState([]);
  const [skillsByDomain, setSkillsByDomain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  // Fetch all domains
  const fetchAllDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const domainsData = await domainApi.getAllDomains(token);
      // Ensure domainsData is always an array
      setAllDomains(Array.isArray(domainsData) ? domainsData : []);
      return domainsData;
    } catch (err) {
      console.error("Error fetching all domains:", err);
      setError("Failed to load domains. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch skills by domain
  const fetchSkillsByDomain = useCallback(
    async (domain_id) => {
      try {
        setLoading(true);
        setError("");
        const domainsData = await domainApi.getSkillsByDomain(domain_id, token);
        // Ensure domainsData is always an array
        setSkillsByDomain(Array.isArray(domainsData) ? domainsData : []);
        return domainsData;
      } catch (err) {
        console.error("Error fetching skills by domain:", err);
        setError("Failed to load related skills. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Refresh all data
  const refreshDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([
        fetchAllDomains(),
        fetchSkillsByDomain(defaultDomain),
      ]);
    } catch (err) {
      console.error("Error refreshing domains:", err);
      setError("Failed to refresh domains. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchAllDomains, fetchSkillsByDomain, defaultDomain]);

  // Initialize skills data on mount
  useEffect(() => {
    refreshDomains();
  }, [refreshDomains]);

  return {
    allDomains,
    skillsByDomain,
    loading,
    error,
    fetchAllDomains,
    fetchSkillsByDomain,
    refreshDomains,
    setError,
  };
};
