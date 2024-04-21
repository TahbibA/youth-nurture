import { useColorModeValue } from "@chakra-ui/react";
import { appName, routes } from "../misc/constants";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  // Using Chakra UI's color mode value hook to use different values on dark and light mode
  const classes = useColorModeValue("bg-gray-200", "bg-[#202020]");
  return (
    <div className={classes}>
      <div className="p-5 max-w-[1350px] mx-auto flex justify-between md:flex-col md:items-center gap-3">
        <Logo />
        <p className="text-center">
          {appName} &copy;2024 - All Rights Reserved{" "}
        </p>
        <Link to={routes.general.about}>About Us</Link>
      </div>
    </div>
  );
};

export default Footer;
