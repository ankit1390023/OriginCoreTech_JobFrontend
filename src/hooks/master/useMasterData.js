// src/hooks/useMasterData.js
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { masterDataApi } from '../../api/master/masterDataApi';

export const useMasterData = () => {
    const { token } = useSelector((state) => state.auth);

    // 🔹 Single query for all master data
    const masterDataQuery = useQuery({
        queryKey: ['masterData'],
        queryFn: async () => {
            const res = await masterDataApi.getAllMasterData(token);
            return res;
        },
        enabled: !!token, // run only when token exists
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
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
