'use client';

import {
    useEffect,
    useState
} from 'react';
import { GlobalLoaderTile } from '@/app/[locale]/(global)/(tiles)/GlobalLoader.tile';


export function StaffAddPermissionsWidget() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown | null>(null);
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                // Routes fetch logic here if needed
                setLoading(false);
            } catch (err) {
                setError(err);
            }
        };

        fetchRoutes();
    }, []);

    if (loading) return <GlobalLoaderTile />;
    if (error) return <div>Error: {(error as Error)?.message || 'Unknown error'}</div>;

    return (
        <div>
            <h1>Routes</h1>
        </div>
    );
}


