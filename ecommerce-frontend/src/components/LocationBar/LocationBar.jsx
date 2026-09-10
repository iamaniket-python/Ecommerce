import { useState, useEffect } from "react";
import "../../css/LocationBar.css";

function LocationBar() {
  const [location, setLocation] = useState("Detecting location...");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      setError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Unknown";
          const state = data.address?.state || "";
          setLocation(`${city}${state ? ", " + state : ""}`);
        } catch (err) {
          setLocation("Location unavailable");
          setError(true);
        }
      },
      () => {
        setLocation("Enable location access");
        setError(true);
      }
    );
  }, []);

  return (
    <div className={`location-bar ${error ? "location-error" : ""}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span>Deliver to: {location}</span>
    </div>
  );
}

export default LocationBar;