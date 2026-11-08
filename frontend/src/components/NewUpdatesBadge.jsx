import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function NewUpdatesBadge() {
  const [count, setCount] = useState(0);

  const checkUnseenUpdates = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCount(0);
        return;
      }

      const res = await axios.get(
        "http://172.20.40.101:5000/api/user-updates/unseen",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UNSEEN UPDATES:", res.data);

      setCount(res.data.count || 0);
    } catch (error) {
      console.log("UNSEEN UPDATE BADGE ERROR:", error);

      setCount(0);
    }
  };

  useEffect(() => {
    // Initial check
    checkUnseenUpdates();

    // Check whenever the user returns to this page/window
    const handleFocus = () => {
      checkUnseenUpdates();
    };

    window.addEventListener("focus", handleFocus);

    // Backup refresh every 60 seconds
    const interval = setInterval(() => {
      checkUnseenUpdates();
    }, 60000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (count === 0) {
    return null;
  }

  return (
    <Link
      to="/government-updates"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        backgroundColor: "#EBE1C6",
        color: "#596B5A",
        border: "1px solid #C8C1AA",
        borderRadius: "999px",
        fontSize: "14px",
        fontWeight: "700",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#E1D5B8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#EBE1C6";
      }}
    >
      <span>Government Updates</span>

      <span
        style={{
          minWidth: "24px",
          height: "24px",
          padding: "0 7px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#C496A1",
          color: "#FFFFFF",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "800",
          lineHeight: "1",
        }}
      >
        {count}
      </span>

      <span
        style={{
          position: "absolute",
          top: "-3px",
          right: "-3px",
          width: "9px",
          height: "9px",
          backgroundColor: "#C496A1",
          border: "2px solid #F7F1E3",
          borderRadius: "50%",
          animation: "sarvasetuPulse 1.8s ease-in-out infinite",
        }}
      />

      <style>
        {`
          @keyframes sarvasetuPulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(1.35);
              opacity: 0.55;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Link>
  );
}

export default NewUpdatesBadge;