import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchMasterData } from '../hooks/master/useMasterData';

export const MasterDataLoader = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      // Prefetch master data when component mounts
      prefetchMasterData(queryClient, token).catch(console.error);
    }
  }, [token, queryClient]);

  return children;
};

export default MasterDataLoader;
