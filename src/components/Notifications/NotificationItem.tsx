import { Notification } from "../../misc/interfaces";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { timeAgo } from "../../utils/date";
import { HiOutlineEnvelopeOpen, HiXMark } from "react-icons/hi2";
import { markNotifactionAsRead } from "../../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { fireStore } from "../../misc/firebase";

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const markAsRead = async () => {
    markNotifactionAsRead(notification.uid);
  };
  const deleteNotification = () => {
    try {
      deleteDoc(doc(fireStore, "Notifications/" + notification.uid));
    } catch (err) {
      console.log("🚀 ~ deleteNotification ~ err:", err);
    }
  };

  return (
    <Flex className={`justify-between w-full gap-3`}>
      <div>
        <Heading fontSize={12} mb={1} fontWeight={650}>
          {notification.title}
        </Heading>
        <Text fontSize={12} mb={1}>
          {notification.message.substring(0, 50)}
          {notification.message.length > 50 && "..."}
        </Text>
        <Text fontSize={11} colorScheme="gray">
          {timeAgo(notification.time.toDate())}
        </Text>
      </div>
      <div className="flex flex-col justify-between">
        <HiXMark size={20} onClick={deleteNotification} />
        {!notification.read && (
          <HiOutlineEnvelopeOpen size={20} onClick={markAsRead} />
        )}
      </div>
    </Flex>
  );
};

export default NotificationItem;
