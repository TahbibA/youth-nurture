import { HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { MentorConnections } from "../../misc/interfaces";
import MentorSearchBar from "./MentorSearchBar";
import SidebarProfile from "../../components/SidebarProfile";
import PageTitle from "../../components/PageTitle";
import MentorsGrid from "./MentorsGrid";
import { FcSearch } from "react-icons/fc";
import Title from "../../components/Title";

const FindMentorspage = () => {
  // an array of connections between the currently logged in user and all their mentors
  const [connections, setConnections] = useState<MentorConnections[]>([]);
  // a boolean to indicate if the loading of connections is still in progress
  const [loading, setLoading] = useState(false);
  return (
    <HStack alignItems="flex-start">
      <Title title="Find Mentors" />
      <VStack p={5} alignItems="start" flex={1}>
        <PageTitle title="Find Mentors" />
        <MentorSearchBar
          setConnections={setConnections}
          loading={loading}
          setLoading={setLoading}
          connections={connections}
        />
        {connections.length > 0 ? (
          <MentorsGrid connections={connections} loading={loading} />
        ) : (
          <div className="flex flex-col justify-center items-center w-full mt-40 opacity-35">
            <FcSearch size={100} />
            <Text>Start searching mentors</Text>
          </div>
        )}
      </VStack>
      <SidebarProfile />
    </HStack>
  );
};

export default FindMentorspage;
