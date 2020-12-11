import React, {useState, useCallback, useRef} from 'react'

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";

// import LocationMarker from './LocationMarker'
// import LocationInfoBox from './LocationInfoBox'
import Loader from './Loader'
import Search, {Locate} from './Search'

import mapDefaults from './mapDefaults';

export const Map = () => {

  const libraries = ["places"];

  const [markers, setMarkers]  = useState([]);
  const [markerSel, setMarkerSel] = useState(null);

  const mapRef = useRef();
  const onMapLoad = useCallback(map => (mapRef.current = map), []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GCP_MAPS_API,
    libraries
  });

  const onMapClick = useCallback((e) => setMarkers(current => [...current, {
    lat: e.latLng.lat(),
    lng: e.latLng.lng(),
    time: new Date()
  }]), []);

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(14);
  }, []);  

  if(loadError) return "Load Error";
  if(!isLoaded) return <Loader />;

  return <div>
    <h1 className="title">Title</h1>
    <Search panTo={panTo} />
    <Locate panTo={panTo} />

    <GoogleMap
      mapContainerStyle={mapDefaults.containerStyle} 
      zoom={8} center={mapDefaults.center}
      options={mapDefaults.options}
      onClick={onMapClick}
      onLoad={onMapLoad}
      >
        {markers.map(marker => 
        <Marker 
          key={marker.time.toISOString()} 
          position = {{lat:marker.lat, lng:marker.lng}}
          onClick = {() => setMarkerSel(marker)}
          />)}
        
        {markerSel ? <InfoWindow 
          position={{lat:markerSel.lat, lng:markerSel.lng}}
          onCloseClick={() => setMarkerSel(null)}><div>
            <h2>Marker placed</h2>
            <p>Placed {formatRelative(markerSel.time, new Date())}</p>
          </div>
          </InfoWindow> : null}
      </GoogleMap>
  </div>
}

export default Map;