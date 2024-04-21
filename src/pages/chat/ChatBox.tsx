import {
  Avatar,
  Input,
  InputGroup,
  Spinner,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useToast,
  InputRightAddon,
} from "@chakra-ui/react";
import { FcVoicePresentation } from "react-icons/fc";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { fireStore } from "../../misc/firebase";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { Message, UserData } from "../../misc/interfaces";
import NotFound from "../notFound/page";
import { BiSend } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import { RxDotsVertical } from "react-icons/rx";
import { Link } from "react-router-dom";
import { routes } from "../../misc/constants";
import { deleteChat } from "../../utils/firebase";
import { FaArrowLeft } from "react-icons/fa";

const ChatBox = ({
  chatId,
  userData,
  setOpen,
}: {
  chatId: string;
  userData: UserData;
  setOpen: (data: boolean) => void;
}) => {
  // Create a reference to the messages collection in the FireStore database
  const messagesRef = collection(fireStore, "Messages");
  // Create a toast component to display messages
  const toast = useToast();
  // Create a state variable to store the user's message input
  const [message, setMessage] = useState("");
  // Create a state variable to store the user's profile data
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  // Create a query to fetch messages from the FireStore database
  const messagesQuery = query(
    messagesRef,
    where("chatId", "==", chatId || ""),
    orderBy("time", "asc")
  );
  // Fetch the chat data from the FireStore database
  const [chat] = useDocumentData(doc(fireStore, "Chats/" + chatId));
  // Fetch the messages data from the FireStore database
  const [messages, loading, error] = useCollectionData(messagesQuery);

  // When the component mounts, fetch the user's profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (chat?.users) {
        const userId =
          chat?.users[0] === userData?.uid ? chat?.users[1] : chat?.users[0];
        const userRef = doc(fireStore, "Users/" + userId);
        const user = await getDoc(userRef);
        setUserProfile(user.data() as UserData);
      }
    };
    fetchUserProfile();
  }, [chat, userData]);

  const handleSend = async () => {
    // Check if message is empty
    if (!message) return;
    // Clear message input
    setMessage("");
    // Try to add a new document with the message and other data
    try {
      const docRef = await addDoc(messagesRef, {
        message,
        chatId,
        sender: userData.uid,
        time: Timestamp.now(),
        seen: false,
      } as Message);
      // Assign the document reference to the document id
      await updateDoc(docRef, { uid: docRef.id });
    } catch (error) {
      // Log the error
      console.log("🚀 ~ handleSend ~ error:", error);
      // Return false if there's an error
      return false;
    }
  };

  const handleDelete = async () => {
    // Prompt the user to confirm the chat deletion
    const consent = confirm(
      `Do you realy want to delete chat with ${userProfile?.displayName}`
    );
    console.log(consent);
    // If the user cancels the deletion, return
    if (!consent) return;
    // Attempt to delete the chat
    const res = await deleteChat(chatId);
    // If the chat is deleted successfully, show a success toast
    if (res)
      toast({
        title: "Chat deleted successfully",
        status: "success",
        duration: 2000,
      });
  };

  // If the chat is loading or the user profile is not available, return a loading indicator
  if (loading || !userProfile)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );

  // If the user is not a part of the chat, show the not found message
  if (error || !chat?.users.includes(userData.uid)) return <NotFound />;
  return (
    <VStack h="100%" gap={0}>
      {userProfile && (
        <Title title={userProfile?.displayName + " - Messages"} />
      )}
      {/* Head */}
      <Flex
        gap={2}
        justifyContent="flex-start"
        alignItems="center"
        p={3}
        height={70}
        w="100%"
        roundedBottom={0}
        className="bg-accent"
        roundedTop={5}
      >
        <FaArrowLeft
          size={20}
          onClick={() => setOpen(true)}
          cursor="pointer"
          color="#dfff"
          className="hidden sm:block"
        />
        <Avatar
          name={userProfile?.displayName}
          src={userProfile?.photoURL}
          boxSize={10}
        />
        <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden mr-auto text-white">
          {userProfile?.displayName}
        </h2>
        <div className="relative">
          <Menu closeOnSelect={false}>
            <MenuButton position="relative">
              <RxDotsVertical color="#fff" />
            </MenuButton>
            <MenuList className="[&_*]:font-normal [&_*]:text-[16px]">
              <MenuItem
                as={Link}
                to={routes.general.profile + "/" + userProfile.uid}
              >
                View Profile
              </MenuItem>
              <MenuItem onClick={handleDelete}>Delete Chat</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>
      {/* Messages */}
      <VStack
        w="100%"
        flexGrow={1}
        p={4}
        pt={2}
        overflowY="auto"
        className="scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {messages?.map((msg, i: number) => {
          return (
            <div
              key={i}
              className={`max-w-[90%] p-1 rounded-md ${
                msg.sender === userData.uid
                  ? "float-right bg-green-200 ml-auto"
                  : "float-left bg-gray-300 mr-auto"
              } text-black`}
            >
              <p className="text-sm bg-[#ffffff50] p-2 rounded-md">
                {msg.message}
              </p>
              <span className="px-1 text-xs text-right opacity-45">
                {msg.time.toDate().toString().slice(0, 21)}
              </span>
            </div>
          );
        })}
        <ScrollToBottom />
      </VStack>
      <InputGroup px={2} pb={2}>
        <Input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <InputRightAddon
          children={<BiSend size={20} />}
          onClick={handleSend}
          cursor="pointer"
        />
      </InputGroup>
    </VStack>
  );
};

export default ChatBox;

export const DefaultChatScreen = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-3">
      <FcVoicePresentation size={80} />
      <h1>Select a chat</h1>
    </div>
  );
};

const ScrollToBottom = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, []);
  return <div ref={scrollRef} />;
};
