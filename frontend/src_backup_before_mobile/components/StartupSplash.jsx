import "./StartupSplash.css";
import { useEffect, useState } from "react";
import "./StartupSplash.css";

export default function StartupSplash({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1900);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2450);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {children}

      {showSplash && (
        <div
          className={`sarvasetu-splash ${
            isExiting ? "splash-exiting" : ""
          }`}
          role="status"
          aria-label="SARVASETU is starting"
        >
          <div className="splash-background" />
          <div className="splash-grain" />
        </div>
      )}
    </>
  );
}
