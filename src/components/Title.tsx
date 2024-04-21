import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Component to set the tite of page, in the head
const Title = ({ title }: { title: string }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null;
};

export default Title;
