'use client'

import {
    useEffect,
    useRef
} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PublicMapBoxWidgetProps {
    containerHeight: number;
}

const PublicMapBoxWidget = ({ containerHeight }: PublicMapBoxWidgetProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        // Initialize map only once
        if (map.current) return;
        if (!mapContainer.current) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FnYXNoZXMiLCJhIjoiY2xoa3k1OGp1MHFhMDNmb3hrNnMwbDNueCJ9.x5B4eELi1JD9bc109ph2dQ';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/gagashes/clhkyv6bt01ov01p6esxs5v4h',
            center: [49.8424767, 40.3802289],
            zoom: 15
        });

        const currentMap = map.current;

        // Wait for map to load before adding marker
        currentMap.on('load', () => {
            // Add marker
            new mapboxgl.Marker({
                color: '#0066FF',
                scale: 1.2 // Make it slightly larger
            })
                .setLngLat([49.8424767, 40.3802289])
                .addTo(currentMap);
        });

        // Clean up on unmount
        return () => {
            currentMap.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{
                height: `${containerHeight}vh`,
                width: '100%'
            }}
            className='w-full col-span-12'
        />
    );
}

export default PublicMapBoxWidget;
