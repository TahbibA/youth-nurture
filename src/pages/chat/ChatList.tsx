import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { fireStore } from "../../misc/firebase";
import { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserData } from "../../misc/interfaces";
import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import NotFound from "../notFound/page";
import { Link } from "react-router-dom";
import { routes } from "../../misc/constants";
import { FcCollaboration } from "react-icons/fc";
import { IoSearchOutline } from "react-icons/io5";

interface UserChatMap {
  [key: string]: { chatId: string; user?: UserData };
}

const ChatList = ({ setOpen }: { setOpen: (data: boolean) => void }) => {
  const userData = useAuth()?.userData;
  const [search, setSearch] = useState("");
  // Create a reference to the Chats collection
  const chatRef = collection(fireStore, "Chats");
  // Create a query to get the chats a user has been sent
  const chatQuery = query(
    chatRef,
    where("users", "array-contains", userData?.uid)
  );
  // Get the data from the query
  const [value, loading, error] = useCollectionData(chatQuery);
  // Create a state to store the list of chats
  const [chatList, setChatList] = useState<UserChatMap>({});

  // Fetch the chat list when the user data is available
  useEffect(() => {
    const fetchChatUser = async () => {
      if (value?.length === 0) return;
      // Create an empty object to store the chat list
      const userChatMap: UserChatMap = {};
      // Loop through the list of chats
      value?.forEach((data) => {
        // Get the user ID of the other user
        const userId =
          data.users[0] === userData?.uid ? data.users[1] : data.users[0];
        // Add the chat ID and the other user's data to the map
        userChatMap[userId] = { chatId: data.uid };
      });
      // If the map is empty, return
      if (Object.keys(userChatMap).length === 0) return;
      // Get the list of users from the Firestore
      const users = await getDocs(
        query(
          collection(fireStore, "Users"),
          where("uid", "in", Object.keys(userChatMap))
        )
      );
      // Loop through the list of users
      users.forEach((doc) => {
        // If the user exists, add their data to the map
        if (doc.exists()) {
          const data = doc.data() as UserData;
          userChatMap[data.uid] = { ...userChatMap[data.uid], user: data };
        }
      });
      // Set the chat list to the map
      setChatList(userChatMap);
    };
    // Call the async function
    fetchChatUser();
  }, [value, userData]);

  // If there is an error, return the NotFound component
  if (error) return <NotFound />;
  if (loading) {
    return (
      <VStack width="100%" height="100%" p={2}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div className="flex items-center w-full gap-2" key={i}>
              <SkeletonCircle boxSize={10} />
              <SkeletonText noOfLines={1} skeletonHeight="3" w="70%" />
            </div>
          ))}
      </VStack>
    );
  }
  return (
    <VStack width="100%" h="100%">
      <InputGroup>
        <Input
          type="text"
          placeholder="Search chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement>
          <IoSearchOutline size={20} cursor="pointer" />
        </InputRightElement>
      </InputGroup>
      <div className="overflow-y-auto w-full">
        {Object.keys(chatList).map((key) => {
          const data = chatList[key];
          if (
            search &&
            !data.user?.displayName.toLowerCase().includes(search.toLowerCase())
          )
            return null;
          return (
            <Button
              colorScheme="gray"
              key={data.chatId}
              gap={2}
              justifyContent="flex-start"
              p={3}
              height={14}
              w="100%"
              as={Link}
              to={routes.general.chat + "/" + data.chatId}
              onClick={() => setOpen(false)}
            >
              <Avatar
                name={data.user?.displayName}
                src={data.user?.photoURL}
                boxSize={10}
              />
              <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                {data.user?.displayName}
              </h2>
            </Button>
          );
        })}
      </div>
      {Object.keys(chatList).length === 0 && (
        <div className="h-full w-full flex flex-col justify-center items-center gap-4 opacity-45">
          <FcCollaboration size={50} />
          <Text fontWeight={600}>No chats found</Text>
        </div>
      )}
    </VStack>
  );
};

export default ChatList;
