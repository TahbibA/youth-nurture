import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../misc/constants";
import { BiLogOut } from "react-icons/bi";

// Component to Show Avatar with profile options in Nav menu
const MenuAvatar = ({ size = 10 }: { size?: number }) => {
  const userData = useAuth()?.userData;
  const logout = useAuth()?.logout;
  if (!userData) return;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton position="relative">
        <Avatar
          boxSize={size}
          name={userData.displayName}
          src={userData.photoURL}
          color="#fff"
        />
      </MenuButton>
      <MenuList className="[&_*]:font-normal [&_*]:text-[16px]">
        <MenuItem as={Link} to={routes.general.profile + "/" + userData.uid}>
          My Profile
        </MenuItem>
        <MenuItem>
          <Flex
            onClick={logout}
            className=" justify-between items-center gap-2 flex-1"
          >
            Logout
            <BiLogOut></BiLogOut>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MenuAvatar;
