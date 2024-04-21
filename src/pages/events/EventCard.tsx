import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Image,
  SkeletonText,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { EventData, UserData } from "../../misc/interfaces";
import { useAuth } from "../../contexts/AuthContext";
import { TfiLink } from "react-icons/tfi";
import { BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";
import CreateEventForm from "./CreateEventForm";
import { useEffect, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { fireStorage, fireStore } from "../../misc/firebase";
import { deleteObject, ref } from "firebase/storage";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { routes } from "../../misc/constants";

const EventCard = ({ eventData }: { eventData: EventData }) => {
  // Get the current user's data from the authentication provider
  const userData = useAuth()?.userData as UserData;
  // Get the mentor data from the Firestore once for the given event
  const [mentor, loading] = useDocumentDataOnce(
    doc(fireStore, "Users/" + eventData.mentorId)
  );
  // Create a state variable to store the countdown
  const [countDown, setCountDown] = useState("");
  // Create a toast utility variable to display messages to the user
  const toast = useToast();
  // Start an effect to update the countdown every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const timeDifference =
        eventData.date.toDate().getTime() - currentDate.getTime();
      // If the time difference is 0, stop the interval
      if (timeDifference === 0) clearInterval(intervalId);
      // Calculate the total seconds and split them into hours, minutes and seconds
      const totalSeconds = Math.floor(timeDifference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      // Update the countdown state with the formatted time
      setCountDown(`${hours} : ${minutes} : ${seconds}`);
    }, 1000);
    // Return a cleanup function to stop the interval when the component is removed
    return () => clearInterval(intervalId);
  }, [eventData]);

  // Function to delete the event
  const deleteEvent = async () => {
    // Ask the user for consent
    const consent = confirm("Are your sure?");
    // If the user says no, return
    if (!consent) return;
    try {
      // If the event has a photo, delete it from Firestorage
      if (eventData.photoURL) {
        const photoRef = ref(fireStorage, eventData.photoURL);
        await deleteObject(photoRef);
      }
      // Delete the event from Firestore
      await deleteDoc(doc(fireStore, "Events", eventData.uid));
      // Display a success message
      toast({
        title: "Event deleted successfully",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (err) {
      // If something goes wrong, display an error message
      console.log(err);
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
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
          <div className="rounded-lg h-[200px] w-full object-cover overflow-hidden">
            <Image
              src={eventData.photoURL}
              className="hover:scale-[1.1] transition-all"
            />
          </div>
          <Stack mt="6" spacing="3">
            <Heading size="md">{eventData.title}</Heading>
            <Badge
              colorScheme="green"
              w="fit-content"
              mx="auto"
              p={"3px 10px"}
              rounded={5}
              fontSize={20}
            >
              {countDown}
            </Badge>
            <Text>{eventData.description}...</Text>
          </Stack>
        </div>
        <div>
          <Button
            mt={2}
            w="100%"
            fontWeight={400}
            colorScheme="orange"
            as={Link}
            target="_blank"
            to={eventData.link}
          >
            Visit Link
            <Icon as={TfiLink} ml={2} />
          </Button>
          {userData.uid === eventData.mentorId && (
            <Flex gap={3} my={2}>
              <CreateEventForm eventData={eventData} />
              <Button
                w="100%"
                fontWeight={400}
                colorScheme="red"
                onClick={deleteEvent}
              >
                Delete
                <Icon as={BiTrash} ml={2} />
              </Button>
            </Flex>
          )}
          {loading ? (
            <SkeletonText
              mt="4"
              noOfLines={1}
              spacing="1"
              skeletonHeight="5"
              w="100%"
            />
          ) : (
            <Text
              as={Link}
              to={routes.general.profile + "/" + eventData.mentorId}
            >
              Mentor: {mentor?.displayName}
            </Text>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default EventCard;
