import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(true);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
  
      if (loggedIn) {
        setShowHeroSection(false);
      }

}, [loggedIn, token]);

  return (
    <>
    {showHeroSection ? (
        <>
        <HeroSection />
        </>
    ) : (
        <>
        </>
    )};
    </>
  );
};

export default Home;