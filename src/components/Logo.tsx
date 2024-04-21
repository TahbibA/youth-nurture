import { Link } from "react-router-dom";
import LogoImage from "../assets/logoipsum-262.svg";

// App Logo
const Logo = () => {
  return (
    <Link to="/">
      <img src={LogoImage} className="h-[35px]" />
    </Link>
  );
};

export default Logo;
