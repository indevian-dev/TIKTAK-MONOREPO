'use client'

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxStyle } from '@/app/hooks/useMapboxStyle';

// Office / contact location
const OFFICE_LNG = 49.8424767;
const OFFICE_LAT = 40.3802289;

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface PublicMapBoxWidgetProps {
    containerHeight: number;
}

const PublicMapBoxWidget = ({ containerHeight }: PublicMapBoxWidgetProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapStyle = useMapboxStyle();

    // React to theme changes: swap the map style in-place
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setStyle(mapStyle);
        }
    }, [mapStyle]);

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [OFFICE_LNG, OFFICE_LAT],
            zoom: 15,
        });
        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
            new mapboxgl.Marker({ color: '#5B23FF', scale: 1.2 })
                .setLngLat([OFFICE_LNG, OFFICE_LAT])
                .addTo(map);
        });

        return () => { map.remove(); mapRef.current = null; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{ height: `${containerHeight}vh`, width: '100%' }}
            className='w-full col-span-12 rounded-2xl overflow-hidden'
        />
    );
}

export default PublicMapBoxWidget;

