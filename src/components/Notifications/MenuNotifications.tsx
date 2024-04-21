import {
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useNotification } from "../../contexts/NotificationContext";
import { GoBell } from "react-icons/go";
import NotificationItem from "./NotificationItem";
import { useAuth } from "../../contexts/AuthContext";

const MenuNotifications = () => {
  const notifications = useNotification()?.notifications;
  const unread = useNotification()?.unread;
  const userData = useAuth()?.userData;
  if (userData === null) return;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton position="relative" mt={1}>
        <GoBell size={25} />
        {unread && unread > 0 ? (
          <span className="absolute -right-2 top-0 bg-red-500 rounded-full h-5 w-5 text-white text-xs leading-5">
            {unread}
          </span>
        ) : null}
      </MenuButton>
      <MenuList
        className="max-w-[90vw]"
        p={2}
        borderRadius={10}
        overflow="hidden"
        maxH={"400px"}
        overflowY={"auto"}
      >
        <Heading fontSize={16} p={2}>
          Notifications
        </Heading>
        {notifications?.map((notification, index) => (
          <MenuItem
            p={2}
            key={index}
            borderRadius={10}
            borderBottom={"1px solid #eee"}
          >
            <NotificationItem notification={notification} />
          </MenuItem>
        ))}
        {notifications?.length === 0 && (
          <Text px={2} fontSize={14}>
            All set, no new notification.
          </Text>
        )}
      </MenuList>
    </Menu>
  );
};

export default MenuNotifications;
