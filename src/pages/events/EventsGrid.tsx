import { collection, query, where } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { EventData, UserData } from "../../misc/interfaces";
import { fireStore } from "../../misc/firebase";
import { UserType } from "../../misc/enum";
import { useConnections } from "../../contexts/ConnectionsContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Grid, useBreakpointValue, useToast } from "@chakra-ui/react";
import EventCard from "./EventCard";
import EventsCardSkeleton from "./EventsCardSkeleton";

const EventsGrid = () => {
  // Get the current logged in user's data
  const userData = useAuth()?.userData as UserData;
  // Get all the connections for the current user
  const connections = useConnections()?.connections;
  // Create a toast object to display messages to the user
  const toast = useToast();
  // Create a reference to the Firestore collection "Events"
  const collectionRef = collection(fireStore, "Events");
  // Create a query to get the events for the current user
  const queryWhere = where(
    "mentorId",
    userData.type === UserType.Student ? "in" : "==",
    userData.type === UserType.Student
      ? connections?.map((conn) => conn.connection.mentorId)
      : userData.uid
  );
  // Run the query to get the events for the current user
  const collectionQuery = query(collectionRef, queryWhere);
  // Use the `useCollectionData` hook to get the events and any loading or error states
  const [events, loading, error] = useCollectionData(collectionQuery);

  // Use the `useBreakpointValue` hook to get the number of columns based on the current breakpoint
  const cols = useBreakpointValue({
    base: "1",
    md: "2",
    lg: "3",
  });

  // If there are no events and it's not loading, show a toast message
  if (!loading && (!events || events?.length === 0)) {
    toast({
      title: "No events found.",
      description:
        "Events will be available here as long as a mentors of your created one",
      status: "warning",
      duration: 1500,
    });
    return null;
  }
  // If there was an error, show a toast message
  if (error) {
    toast({
      title: "Something went wrong, please try again.",
      status: "error",
      duration: 1500,
    });
    return null;
  }

  return (
    <Grid gridTemplateColumns={`repeat(${cols}, 1fr)`} gap={7} w="100%">
      {loading
        ? Array(10)
            .fill(0)
            .map((_, i) => <EventsCardSkeleton key={i} />)
        : (events as EventData[]).map((event, i) => (
            <EventCard key={i} eventData={event as unknown as EventData} />
          ))}
    </Grid>
  );
};

export default EventsGrid;
