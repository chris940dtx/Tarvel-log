import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { listLogEntries } from "./API";
import LogEntryForm from "./LogEntryForm";
import { deleteLogEntry } from "./API";
import Register from "./register";
import Login from "./login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./App.css";

function PrivateRoute({ user, loading, children }) {
  console.log("PrivateRoute - user:", user, "loading:", loading);
  if (loading) return <div>Loading...</div>;
  // If user exists, render the children (protected content)
  // If not, redirect to /login
  if (!user) {
    console.log("PrivateRoute - redirecting to login"); // Add this debug line
    return <Navigate to="/login" />;
  }
  console.log("PrivateRoute - showing protected content"); // Add this debug line
  return children;
}

const getMarkerSize = (zoom) => {
  return Math.max(16, 24 + zoom * 2);
};

const App = () => {
  const [user, setUser] = useState(null); // set up useState when soemthing changes were able to update using setUser i.e diff user
  const [loading, setLoading] = useState(true);
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 3,
  });

  // Guest user is still a "user" but it has the properties hard coded essantially
  // so that when we reach the protected routes it still allows the guest user since
  // its an object with "user" properties.
  const createGuestUser = () => {
    const guestUser = {
      isGuest: true,
      uid: `guest-${Date.now()}`,
      email: `guest-${Date.now()}@example.com`,
      displayName: "Guest User",
    };
    //to have guestUser survive refresh, set to localStorage.
    setUser(guestUser);
    localStorage.setItem("isGuest", "true");
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
  };

  const clearGuestMode = () => {
    setUser(null);
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guestUser");
    localStorage.removeItem("guestEntries");
  };

  useEffect(() => {
    //checking if user was in guest mode before
    const isGuest = localStorage.getItem("isGuest");
    const guestUser = localStorage.getItem("guestUser");

    if (isGuest && guestUser) {
      // if it was in guest mode then:
      setUser(JSON.parse(guestUser));
      setLoading(false);
      return;
    }

    //when the user logs in or out or sessiosn chnages it updates with new usr obj
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // clean up function
  }, []);

  console.log("Current user state:", user);
  console.log("Loading state:", loading);
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting entry with id:", id);
      console.log("API URL:", process.env.REACT_APP_API_URL);
      await deleteLogEntry(id);
      console.log("Delete successful, refreshing entries...");
      await getEntries();
      console.log("Entries refreshed");
    } catch (error) {
      console.error("Delete failed:", error);
    }
    setShowPopup({});
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
    <div>
      {user && (
        <>
          <button
            onClick={() => {
              auth
                .signOut()
                .then(() => {
                  console.log("User signed out successfully");
                  // Clear any stored data
                  localStorage.removeItem("firebaseToken");
                  localStorage.removeItem("user");
                  // Redirect to login
                  window.location.href = "/login";
                })
                .catch((error) => {
                  console.error("Error signing out:", error);
                });
            }}
            className="logout-button"
          >
            Logout
          </button>

          {user &&
            user.isGuest && ( // will only show if user is guest
              <div className="guest-mode-indicator">
                Guest Mode - Entries saved locally only
              </div>
            )}
        </>
      )}
      <Routes>
        <Route
          path="/login"
          element={<Login onCreateGuest={createGuestUser} />}
        />
        <Route
          path="/register"
          element={<Register onCreateGuest={createGuestUser} />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute user={user} loading={loading}>
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
                        button
                      >
                        <div style={{ padding: "10px" }}>
                          <h3>{entry.title}</h3>
                          <p>{entry.description}</p>
                          <small>
                            Visited on:{" "}
                            {new Date(entry.visitDate).toLocaleDateString()}
                          </small>
                          <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                            {entry.image ? (
                              <img src={entry.image} alt={entry.title} />
                            ) : null}
                          </div>{" "}
                          <button
                            onClick={() => handleDelete(entry._id)}
                            style={{
                              marginTop: "10px",
                              background: "red",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
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
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
