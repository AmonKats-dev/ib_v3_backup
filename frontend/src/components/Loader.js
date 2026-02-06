import React, { useEffect } from "react";
import "./Loader.css"; // Import the CSS for styling

const Loader = ({ fullScreen = false }) => {
  useEffect(() => {
    // When the loader is active, prevent body scrolling
    if (fullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // Revert to default when loader is not active
    }

    // Cleanup function to reset the overflow property when the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullScreen]);

  return (
    <div
      className={`loader-container ${
        fullScreen
          ? "fixed inset-0 bg-white/70 flex items-center justify-center z-40"
          : ""
      }`}
    >
      <div className="loader">
        <div className="justify-content-center jimu-primary-loading"></div>
      </div>
    </div>
  );
};

export default Loader;
