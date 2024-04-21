import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
import PageTitle from "../../components/PageTitle";
import CreateEventForm from "./CreateEventForm";
import Title from "../../components/Title";
import SidebarProfile from "../../components/SidebarProfile";
import EventsGrid from "./EventsGrid";
import { useAuth } from "../../contexts/AuthContext";
import { UserData } from "../../misc/interfaces";
import { UserType } from "../../misc/enum";
import { useConnections } from "../../contexts/ConnectionsContext";
import Loading from "../../components/Loading";
import { FcCalendar } from "react-icons/fc";

const EventsPage = () => {
  // Get the current user's data from the useAuth hook
  const userData = useAuth()?.userData as UserData;
  // Get the current user's connections from the useConnections hook
  const conncetions = useConnections()?.connections;
  // If there are no connections, return a Loading component
  if (!conncetions) return <Loading />;

  return (
    <HStack alignItems="flex-start">
      <Title title="Events" />
      <VStack p={5} alignItems="start" flex={1}>
        <Flex justifyContent={"space-between"} w={"100%"}>
          <PageTitle title="Events" />
          {userData.type === UserType.Mentor ? <CreateEventForm /> : null}
        </Flex>
        {conncetions?.length > 0 ? (
          <EventsGrid />
        ) : (
          <div className="flex items-center justify-center flex-col gap-4 min-h-[80vh] w-full opacity-50">
            <FcCalendar size={100} />
            <Text textAlign={"center"}>
              No events available as you're not connected with any mentor yet.
            </Text>
          </div>
        )}
      </VStack>
      <SidebarProfile />
    </HStack>
  );
};

export default EventsPage;
