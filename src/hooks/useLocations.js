import { useState, useEffect } from 'react';
import { locationApi } from '../api/locationApi';

export const useLocations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationApi.getLocations();
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const refetch = () => {
    fetchLocations();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
