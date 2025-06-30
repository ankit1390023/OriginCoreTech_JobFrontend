import { useState, useEffect, useCallback } from 'react';
import { domainApi } from '../api/domainApi';

export const useDomainsApi = (defaultDomain) => {
    const [allDomains, setAllDomains] = useState([]);
    const [skillsByDomain, setSkillsByDomain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all domains
    const fetchAllDomains = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const domainsData = await domainApi.getAllDomains();
            setAllDomains(domainsData);
            return domainsData;
        } catch (err) {
            console.error("Error fetching all domains:", err);
            setError("Failed to load domains. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch skills by domain
    const fetchSkillsByDomain = useCallback(async (domainName) => {
        try {
            setLoading(true);
            setError("");
            const domainsData = await domainApi.getSkillsByDomain(domainName);
            setSkillsByDomain(domainsData);
            return domainsData;
        } catch (err) {
            console.error("Error fetching skills by domain:", err);
            setError("Failed to load related skills. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh all data
    const refreshDomains = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            await Promise.all([
                fetchAllDomains(),
                fetchSkillsByDomain(defaultDomain)
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
        setError
    };
}; 