import Logo from "./Logo";
import { Flex, HStack, useBreakpoint } from "@chakra-ui/react";
import OffCanvasMenu from "./OffCanvasMenu";
import MenuLinks from "./MenuLinks";
import MenuAvatar from "./MenuAvatar";
import { NotificationProvider } from "../contexts/NotificationContext";
import MenuNotifications from "./Notifications/MenuNotifications";
import ColorModeSwitch from "./ColorModeSwitch";

const Header = () => {
  // Usnig Chakra UI's breakpoint hook for responsive design
  const breakPoint = useBreakpoint();
  return (
    <HStack justifyContent={"space-between"} p={3} className="border-b">
      <Logo />
      {breakPoint !== "base" && <MenuLinks />}
      <Flex gap={5}>
        <NotificationProvider>
          <MenuNotifications />
        </NotificationProvider>
        {breakPoint !== "base" && <MenuAvatar />}
        {breakPoint !== "base" && <ColorModeSwitch />}
        {breakPoint === "base" && <OffCanvasMenu />}
      </Flex>
    </HStack>
  );
};

export default Header;
