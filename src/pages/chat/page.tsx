import { Text, useColorMode } from "@chakra-ui/react";
import ChatList from "./ChatList";
import ChatBox, { DefaultChatScreen } from "./ChatBox";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Title from "../../components/Title";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
import { ImDrawer } from "react-icons/im";

const ChatPage = () => {
  // Hide the scrollbar for the body of the document
  document.body.style.overflowY = "hidden";
  // Get the color mode from the useColorMode hook
  const { colorMode } = useColorMode();
  // Get the chatId from the useParams hook
  const { chatId } = useParams();
  // Get the userData from the useAuth hook
  const userData = useAuth()?.userData;
  // Create a state variable to store the state of the modal
  const [open, setOpen] = useState(false);

  if (!userData) return <Loading />;

  return (
    <div className="flex gap-2 my-[20px] md:my-0 md:gap-0 h-[83vh] max-w-[1200px] mx-auto relative">
      <Title title="Messages" />
      <div
        className={`p-2 w-[30%] h-full border ${
          colorMode === "dark"
            ? "border-x-gray-500 bg-gray-800"
            : "border-gray-200 bg-gray-100"
        } rounded-md z-10 sm:absolute sm:top-0 ${
          open ? "sm:left-0" : "sm:-left-full"
        } sm:w-[90%] transition-all `}
      >
        <div className="p-2 hidden sm:flex justify-between">
          <Text>All Chats</Text>
          <FaXmark size={20} onClick={() => setOpen(false)} />
        </div>
        <ChatList setOpen={setOpen} />
      </div>
      <div
        className={`w-[70%] sm:w-full h-full border ${
          colorMode === "dark" ? "border-x-gray-500" : "border-gray-200"
        } rounded-md relative`}
      >
        {chatId ? (
          <ChatBox chatId={chatId} userData={userData} setOpen={setOpen} />
        ) : (
          <>
            <div className="p-2 hidden sm:flex justify-between">
              <Text>All Chats</Text>
              <ImDrawer size={20} onClick={() => setOpen(true)} />
            </div>
            <DefaultChatScreen />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
