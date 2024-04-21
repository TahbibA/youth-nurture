import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { CiMenuFries } from "react-icons/ci";
import MenuLinks from "./MenuLinks";
import SocialIcons from "./SocialIcons";
import ColorModeSwitch from "./ColorModeSwitch";
import MenuAvatar from "./MenuAvatar";

const OffCanvasMenu = () => {
  // Chakra UI's hook to handle drawer opening closing.
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Reference to the button that opens the drawer.
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={btnRef} onClick={onOpen} className="hidden sm:block">
        <CiMenuFries />
      </Button>
      <Drawer
        closeOnEsc={true}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        returnFocusOnClose={true}
      >
        <DrawerOverlay className="backdrop-blur-[2px]" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <MenuAvatar />
          </DrawerHeader>

          <DrawerBody pt={10}>
            <div className="flex flex-col items-center gap-5" onClick={onClose}>
              <MenuLinks />
            </div>
          </DrawerBody>

          <DrawerFooter
            justifyContent="space-between"
            borderTop={"1px solid #ddd"}
          >
            <div onClick={onClose}>
              <SocialIcons />
            </div>
            <ColorModeSwitch />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default OffCanvasMenu;
