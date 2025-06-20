import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { listLogEntries } from "./API";
import LogEntryForm from "./LogEntryForm";

<<<<<<< HEAD

=======
>>>>>>> 4fb4c1c55f24e2e99187d26abd5b1ae5693b7bb2
const getMarkerSize = (zoom) => {
  // Base size is 24px (matching your SVG viewBox), increases as zoom increases
  // Minimum size is 16px to ensure visibility
  return Math.max(16, 24 + zoom * 2);
};

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 3,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    (async () => {
      getEntries();
    })();
  }, []);

  const showAddMarkerPopup = (event) => {
    setAddEntryLocation({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
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
          <Marker longitude={entry.longitude} latitude={entry.latitude}>
            <div
              onClick={() => setShowPopup({ [entry._id]: true })}
              style={{ cursor: "pointer" }}
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
              <div style={{ padding: "10px" }}>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <small>
                  Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
                <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                  {entry.image ? (
                    <img src={entry.image} alt={entry.title} />
                  ) : null}
                </div>{" "}
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
      {addEntryLocation ? (
        <>
          <Marker
            longitude={addEntryLocation.longitude}
            latitude={addEntryLocation.latitude}
          >
            <div>
              <svg
                className="marker-red"
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
          <Popup
            className="popup"
            longitude={addEntryLocation.longitude}
            latitude={addEntryLocation.latitude}
            anchor="bottom"
            onClose={() => setAddEntryLocation(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div style={{ padding: "10px" }}>
              <LogEntryForm
                onCLose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </Map>
  );
};

export default App;
