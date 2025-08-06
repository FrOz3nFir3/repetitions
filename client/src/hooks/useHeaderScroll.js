import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isFocusedSession =
    location.pathname.includes("/review") ||
    location.pathname.includes("/quiz") ||
    location.pathname.includes("/edit");

  useEffect(() => {
    if (!isFocusedSession) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false); // Reset scroll state in focused sessions
    }
  }, [isFocusedSession]);

  return { isScrolled, isFocusedSession };
};

export default useHeaderScroll;
