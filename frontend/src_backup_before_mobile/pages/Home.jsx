
import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import AISection from "../components/AISection";
import Categories from "../components/Categories";
import FeaturedSchemes from "../components/FeaturedSchemes";
import LatestUpdates from "../components/LatestUpdates";
import Navbar from "../components/Navbar";
import LatestNotifications from "../components/LatestNotifications";

function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#F7F1E3",
          color: "#3E4435",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 3,
            background: "#C496A1",
            marginBottom: 24,
          }}
        />

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 54px)",
            fontWeight: 500,
            letterSpacing: "5px",
            margin: 0,
          }}
        >
          SARVASETU
        </h1>

        <p
          style={{
            marginTop: 14,
            color: "#596B5A",
            letterSpacing: "1px",
            fontSize: 13,
          }}
        >
          Discover. Understand. Access.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
      }}
    >
      <Navbar />
      <Hero />
      <AISection />
      <Categories />
      <FeaturedSchemes />
      <LatestUpdates />
      <LatestNotifications />
    </main>
  );
}

export default Home;