import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Connection, UserData } from "../../misc/interfaces";
import { IoMdPersonAdd } from "react-icons/io";
import { ConnectionStatus, UserType } from "../../misc/enum";
import { LiaHourglassEndSolid } from "react-icons/lia";
import { MdCheck, MdOutlineDoNotDisturbOff } from "react-icons/md";
import {
  createConnection,
  getChatId,
  updateConnection,
} from "../../utils/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { TfiUnlink } from "react-icons/tfi";
import { deleteDoc, doc } from "firebase/firestore";
import { fireStore } from "../../misc/firebase";
import { FaXmark } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../misc/constants";
import { BsChatLeftText } from "react-icons/bs";
import { useState } from "react";

interface Props {
  connection: {
    user: UserData;
    connection: Connection;
  };
}

const MentorCard = ({ connection }: Props) => {
  // import the necessary functions and components
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useAuth()?.userData;
  // create a state variable to store the loading status of the chat
  const [chatLoading, setChatLoading] = useState(false);
  // if the user has not logged in or is not connected to a mentor, return
  if (!connection.user?.uid || !userData?.uid) return;

  // Function to connect two users
  const connect = async () => {
    // Create a Connection object with the user's UID, student ID, mentor ID, and status
    const data: Connection = {
      uid: "",
      studentId: userData?.uid,
      mentorId: connection.user.uid,
      status: ConnectionStatus.Pending,
    };
    // Send the Connection object to the createConnection function
    const res = await createConnection(data, userData.displayName);
    // If the request is sent successfully, show a success toast
    if (res)
      toast({
        title: "Success",
        description: "Connected request sent successfully",
        status: "success",
        duration: 2000,
      });
  };
  // Function to disconnect from a user
  const disconnect = async () => {
    try {
      // Delete the document related to the current connection from the firestore
      await deleteDoc(
        doc(fireStore, "Connections", connection.connection?.uid as string)
      );
      // Display a success toast
      toast({
        title: "Success",
        description: `Successfully diconnected from ${connection.user.displayName}`,
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      // Log any errors
      console.log("🚀 ~ disconnect ~ err:", err);
    }
  };

  // Function to update the connection status
  const update = async (status: ConnectionStatus) => {
    // Update the connection status in the firestore
    const res = await updateConnection(
      connection.connection.uid,
      status,
      connection.user.uid,
      userData.displayName
    );
    // If the update is successful, display a success toast
    if (res)
      toast({
        title: "Success",
        description: `Request from ${connection.user.displayName} accepted.`,
        status: "success",
        duration: 2000,
      });
  };

  const chat = async () => {
    // Check if the chat is loading
    if (chatLoading) return;
    // Set the chat loading state to true
    setChatLoading(true);
    try {
      // Get the chat ID between the current user and the connected user
      const chatId = await getChatId(userData.uid, connection.user.uid);
      console.log(chatId);
      // Navigate to the chat route with the chat ID
      navigate(routes.general.chat + "/" + chatId);
    } catch (err) {
      // Log the error
      console.log(err);
      // Display an error toast
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 2000,
      });
      // Set the chat loading state to false
      setChatLoading(false);
    }
  };

  return (
    <Card>
      <CardBody
        textAlign="center"
        display={"flex"}
        flexDir={"column"}
        justifyContent={"space-between"}
      >
        <div>
          <Avatar
            name={connection.user.displayName}
            src={connection.user?.photoURL}
            color="#fff"
            boxSize={100}
          />
          <Link to={routes.general.profile + "/" + connection.user.uid}>
            <Stack mt="6" spacing="3">
              <Heading size="md">{connection.user.displayName}</Heading>
              <Badge colorScheme="green" w="fit-content" mx="auto">
                {connection.user.department}
              </Badge>
              <Text>{connection.user.description?.substring(0, 70)}...</Text>
            </Stack>
          </Link>
        </div>
        {!connection?.connection && (
          <Button
            mt={2}
            w="100%"
            fontWeight={400}
            colorScheme="green"
            onClick={connect}
          >
            Connect
            <Icon as={IoMdPersonAdd} ml={2} />
          </Button>
        )}
        {connection?.connection?.status == ConnectionStatus.Approved && (
          <Flex gap={3}>
            <Button
              mt={2}
              w="100%"
              fontWeight={400}
              colorScheme="orange"
              onClick={disconnect}
            >
              Disconnect
              <Icon as={TfiUnlink} ml={2} />
            </Button>
            <Button
              mt={2}
              w="100%"
              fontWeight={400}
              as={Link}
              onClick={chat}
              disabled={chatLoading}
            >
              {!chatLoading && "Message"}
              {chatLoading ? <Spinner /> : <Icon as={BsChatLeftText} ml={2} />}
            </Button>
          </Flex>
        )}
        {userData.type === UserType.Student ? (
          <>
            {connection?.connection?.status == ConnectionStatus.Pending && (
              <Button
                mt={2}
                w="100%"
                fontWeight={400}
                colorScheme="gray"
                onClick={disconnect}
              >
                Cencel Request
                <Icon as={LiaHourglassEndSolid} ml={2} />
              </Button>
            )}
            {connection?.connection?.status == ConnectionStatus.Rejected && (
              <Button mt={2} w="100%" fontWeight={400} colorScheme="red">
                Rejected
                <Icon as={MdOutlineDoNotDisturbOff} ml={2} />
              </Button>
            )}
          </>
        ) : (
          <>
            {connection?.connection?.status == ConnectionStatus.Pending && (
              <Flex gap={3}>
                <Button
                  mt={2}
                  w="100%"
                  fontWeight={400}
                  colorScheme="gray"
                  onClick={() => update(ConnectionStatus.Approved)}
                >
                  Accept
                  <Icon as={MdCheck} ml={2} />
                </Button>
                <Button
                  mt={2}
                  w="100%"
                  fontWeight={400}
                  colorScheme="orange"
                  onClick={() => update(ConnectionStatus.Rejected)}
                >
                  Reject
                  <Icon as={FaXmark} ml={2} />
                </Button>
              </Flex>
            )}
            {connection.connection.status === ConnectionStatus.Rejected && (
              <Button
                mt={2}
                w="100%"
                fontWeight={400}
                colorScheme="red"
                onClick={disconnect}
              >
                Delete Request
                <Icon as={BiTrash} ml={2} />
              </Button>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MentorCard;
