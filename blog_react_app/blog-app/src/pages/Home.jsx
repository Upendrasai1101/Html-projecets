import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreateIcon from "@mui/icons-material/Create";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupIcon from "@mui/icons-material/Group";

// ── Home Page ─────────────────────────────────────────────────
// Uses: React Router Link, Context API (useAuth),
//       conditional rendering, Material UI Icons
const Home = () => {
  const { user } = useAuth(); // Context API — get logged in user

  const features = [
    { icon: <CreateIcon />,      title: "Write Stories",  desc: "Share your thoughts and ideas with the world." },
    { icon: <AutoStoriesIcon />, title: "Read & Explore", desc: "Discover posts from writers around the world." },
    { icon: <GroupIcon />,       title: "Join Community", desc: "Connect with readers and writers alike." },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            {/* Conditional rendering — personalized greeting */}
            {user ? `Welcome back, ${user.name}! ✍️` : "Share Your Story With The World"}
          </h1>
          <p className="hero__subtitle">
            A place to read, write, and deepen your understanding of the world.
          </p>
          <div className="hero__cta">
            <Link to="/blog" className="btn btn--primary">
              Read Posts <ArrowForwardIcon fontSize="small" />
            </Link>
            {/* Conditional rendering — show Write or Login button */}
            {user ? (
              <Link to="/create" className="btn btn--ghost">Start Writing</Link>
            ) : (
              <Link to="/login" className="btn btn--ghost">Get Started</Link>
            )}
          </div>
        </div>
        <div className="hero__illustration">
          <div className="hero__blob">✍️</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features__title">Why Blog-React?</h2>
        {/* ES6 Map — render feature cards */}
        <div className="features__grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-card__icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
