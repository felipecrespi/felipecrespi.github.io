import { useMemo, useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import CustomMarker from './CustomMarker';
import './style.css';

const containerStyle = {
    width: '100%',
    height: '40vh'
  };

export default function Map ({ latitude, longitude, studios }){
    const { isLoaded } = useLoadScript({ googleMapsApiKey: 'AIzaSyDkTvBwhsBtS5ZUd5k48ucGeJZMeJuDkIM' });

    if (!isLoaded) return <div>Loading...</div>;
    return <GMap latitude={latitude} longitude={longitude} studios={studios}/>;
}

function GMap({ latitude, longitude, studios }){
    const center = useMemo(() => ({lat: latitude, lng: longitude }), []);

    return (
        
        <GoogleMap 
        zoom={10} 
        center={center} 
        mapContainerStyle={containerStyle}
        >
            {studios.map((studio) => (
                <CustomMarker key={studio.id} position={{lat: parseFloat(studio.latitude), lng: parseFloat(studio.longitude) }}  title={studio.name}></CustomMarker>
            ))}
        </GoogleMap>
    );
}