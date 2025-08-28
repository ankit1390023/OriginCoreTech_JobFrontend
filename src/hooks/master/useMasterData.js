// src/hooks/useMasterData.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { masterDataApi } from '../../api/master/masterDataApi';

// Cache time constants
const ONE_HOUR = 1000 * 60 * 60;
const TWENTY_FOUR_HOURS = ONE_HOUR * 24;
const SEVEN_DAYS = TWENTY_FOUR_HOURS * 7;

export const MASTER_DATA_QUERY_KEY = 'masterData';

export const prefetchMasterData = async (queryClient, token) => {
  if (!token) return;
  
  return queryClient.prefetchQuery({
    queryKey: [MASTER_DATA_QUERY_KEY],
    queryFn: () => masterDataApi.getAllMasterData(token),
    staleTime: TWENTY_FOUR_HOURS,
    cacheTime: SEVEN_DAYS,
  });
};

export const useMasterData = (options = {}) => {
    const { token } = useSelector((state) => state.auth);
    const queryClient = useQueryClient();

    // 🔹 Single query for all master data
    const masterDataQuery = useQuery({
        queryKey: [MASTER_DATA_QUERY_KEY],
        queryFn: () => masterDataApi.getAllMasterData(token),
        enabled: !!token && !options.skip,
        staleTime: TWENTY_FOUR_HOURS,
        cacheTime: SEVEN_DAYS,
        refetchOnWindowFocus: false, // Prevent refetch on window focus
        retry: 1, // Only retry once on failure
        ...options, // Allow overriding default options
    });

    
    // 🔹 Selectors (industry style)
    const durations = masterDataQuery?.data?.duration || [];
    const locations = masterDataQuery?.data?.locations || [];
    const courses = masterDataQuery?.data?.courses || [];
    const schoolColleges = masterDataQuery?.data?.schoolColleges || [];
    const jobRoles = masterDataQuery?.data?.jobRoles || [];
    const specializations = masterDataQuery?.data?.specializations || [];
    const domains = masterDataQuery?.data?.domains || [];
    const skillsByDomain = masterDataQuery?.data?.skillsByDomain || [];
    const specializationByCourse = masterDataQuery?.data?.specializationByCourse || [];

    // 🔹 Helper functions for relationships
    const getSkillsForDomain = (domainId) => {
        const domain = skillsByDomain?.find((d) => d.domain_id === domainId);
        return domain ? domain.skills : [];
    };

    const getSpecializationsForCourse = (courseId) => {
        const course = specializationByCourse?.find((c) => c.id === courseId);
        return course ? course.specializations : [];
    };

    return {
        ...masterDataQuery, // includes isLoading, isError, refetch, etc.
        durations,
        locations,
        courses,
        schoolColleges,
        jobRoles,
        specializations,
        domains,
        skillsByDomain,
        getSkillsForDomain,
        specializationByCourse,
        getSpecializationsForCourse,
    };
};
