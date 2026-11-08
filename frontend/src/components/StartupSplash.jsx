
import { useEffect, useState } from "react";
import "./StartupSplash.css";

export default function StartupSplash({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
   const timer = setTimeout(() => {
  setShowSplash(false);
}, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {children}

      {showSplash && (
        <div
          className="sarvasetu-splash"
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
