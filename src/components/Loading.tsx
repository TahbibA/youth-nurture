import { Flex } from "@chakra-ui/react";
import LogoImage from "../assets/logoipsum-262.svg";

// Full screen Loading Indicator
const Loading = ({ opacity = 1 }: { opacity?: number }) => {
  return (
    <Flex
      className="h-screen w-screen flex flex-col gap-5 justify-center items-center bg-[#fff] fixed top-0 left-0"
      opacity={opacity}
    >
      <img src={LogoImage} className="h-[35px] animate-bounce duration-75" />
    </Flex>
  );
};

export default Loading;
