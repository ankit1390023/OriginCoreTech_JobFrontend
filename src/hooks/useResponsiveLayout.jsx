
import { useState, useEffect } from 'react';

const useResponsiveLayout = () => {
    const [isLargeDevice, setIsLargeDevice] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeDevice(window.innerWidth >= 1024); // lg breakpoint
        };

        // Check on mount
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { isLargeDevice };
};

export default useResponsiveLayout;