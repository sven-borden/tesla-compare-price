import { useState, useEffect } from 'react';
import { fetchTeslaData } from '../services/airtable';

/**
 * Custom hook to fetch and manage Tesla data from Airtable
 * @returns {Object} { data, loading, error, refetch }
 */
export const useTeslaData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await fetchTeslaData();
      setData(records);
    } catch (err) {
      setError(err.message);
      console.error('Error in useTeslaData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
