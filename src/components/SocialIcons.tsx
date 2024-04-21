import { Flex } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SocialIcons = () => {
  // This array contains the social media icons and their corresponding links
  const icons = [
    { icon: <FaFacebook />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaX />, link: "#" },
    { icon: <FaYoutube />, link: "#" },
  ];
  return (
    <Flex className="justify-center items-center gap-4 p-2">
      {icons.map((icon, index) => (
        <Link to={icon.link} key={index}>
          {icon.icon}
        </Link>
      ))}
    </Flex>
  );
};

export default SocialIcons;
