import { Button, useColorMode } from "@chakra-ui/react";
import { BsCloudMoonFill, BsCloudSunFill } from "react-icons/bs";

// Component to Switch Color Mode
const ColorModeSwitch = () => {
  // Using Chakra UI's useColorMode hook
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "light" ? <BsCloudSunFill /> : <BsCloudMoonFill />}
    </Button>
  );
};

export default ColorModeSwitch;
