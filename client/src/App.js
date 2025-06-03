import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { listLogEntries } from "./API";

const getMarkerSize = (zoom) => {
  // Base size is 24px (matching your SVG viewBox), increases as zoom increases
  // Minimum size is 16px to ensure visibility
  return Math.max(16, 24 + zoom * 2);
};

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 3,
  });
  const [showPopup, setShowPopup] = useState({});

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
    })();
  }, []);

  const showAddMarkerPopup = (event) => {
    console.log(event);
  };

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      initialViewState={viewport}
      onMove={(evt) => setViewport(evt.viewState)}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      mapStyle="mapbox://styles/chrisarias/cmb5n6ffd00tp01qyeyyr08zm"
    onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            longitude={entry.longitude}
            latitude={entry.latitude}
          >
            <div
              onClick={() => setShowPopup({ [entry._id]: true })}
              style={{ cursor: 'pointer' }}
            >
              <svg
                className="marker"
                viewBox="0 0 24 24"
                height={getMarkerSize(viewport.zoom)}
                width={getMarkerSize(viewport.zoom)}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {showPopup[entry._id] && (
            <Popup
              longitude={entry.longitude}
              latitude={entry.latitude}
              anchor="bottom"
              onClose={() => setShowPopup({})}
              closeButton={true}
              closeOnClick={false}
            >
              <div style={{ padding: '10px' }}>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <small>
                  Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </Map>
  );
};

export default App;
