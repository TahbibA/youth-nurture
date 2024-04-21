import { Button, HStack, Text } from "@chakra-ui/react";
import SidebarProfile from "../../components/SidebarProfile";
import PageTitle from "../../components/PageTitle";
import { useConnections } from "../../contexts/ConnectionsContext";
import { useAuth } from "../../contexts/AuthContext";
import { ConnectionStatus, UserType } from "../../misc/enum";
import MentorsGrid from "../findMentors/MentorsGrid";
import Title from "../../components/Title";
import { FcBrokenLink, FcHighPriority, FcOk } from "react-icons/fc";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../misc/constants";

const ConnectionsPage = ({ title }: { title: string }) => {
  // Get the current route location and user data from react hooks
  const location = useLocation();
  const userData = useAuth()?.userData;
  // Check if the current page is the Mentees page
  const menteesPage = title === "Mentees";
  // Get the connections from the useConnections hook
  let connections = useConnections()?.connections;
  // If connections exist and are not empty, filter them based on the current page
  if (connections && connections?.length > 0) {
    // If the current page is the Requests page, filter the connections to show only unapproved connections
    if (location.pathname === routes.mentor.requests)
      connections = connections?.filter(
        (conn) => conn.connection.status !== ConnectionStatus.Approved
      );
    // If the current page is the Mentees page, filter the connections to show only approved connections
    else if (location.pathname === routes.mentor.mentees)
      connections = connections?.filter(
        (conn) => conn.connection.status === ConnectionStatus.Approved
      );
  }
  // Get the loading state from the useConnections hook
  const loading = useConnections()?.loading;
  // If connections do not exist or are empty, return and do not render anything
  if (!connections) return;

  return (
    <HStack justifyContent="flex-start" alignItems="flex-start">
      <Title title={title} />
      <div className="flex-1 p-5">
        <PageTitle title={title} />
        {connections.length > 0 && !loading ? (
          <MentorsGrid connections={connections} loading={loading as boolean} />
        ) : (
          <div className="flex flex-col justify-center items-center w-full mt-40">
            {userData?.type === UserType.Student ? (
              <>
                <FcBrokenLink size={100} className="mb-2" />
                <Text className="text-lg font-bold" mb={2}>
                  No Connections
                </Text>
                <Text mb={5} maxW="500px" textAlign="center">
                  You're not yet connected to any mentor.
                  <br />
                  Start exploring mentors and request for connection
                </Text>
                <Button as={Link} to={routes.student.findMentors}>
                  Find Mentors
                </Button>
              </>
            ) : (
              <>
                {menteesPage ? (
                  <FcHighPriority size={100} className="mb-2" />
                ) : (
                  <FcOk size={100} className="mb-2" />
                )}
                <Text className="text-lg font-bold" mb={2}>
                  {menteesPage ? "No mentees" : "All set"}
                </Text>
                <Text mb={5} maxW="450px" textAlign="center">
                  {menteesPage
                    ? "Students will be availablehere once you accept any request from a student."
                    : "No requests pending. Request will be visible as soon as a mentee requsets for connection"}
                </Text>
                {menteesPage ? (
                  <Button as={Link} to={routes.mentor.requests}>
                    View Requests
                  </Button>
                ) : (
                  <Button as={Link} to={routes.mentor.mentees}>
                    View Mentees
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <SidebarProfile />
    </HStack>
  );
};

export default ConnectionsPage;
