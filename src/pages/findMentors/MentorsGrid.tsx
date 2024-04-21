import { Grid, useBreakpointValue } from "@chakra-ui/react";
import { MentorConnections } from "../../misc/interfaces";
import MentorCard from "./MentorCard";
import MentorCardSkeleton from "./MentorCardSkeleton";

interface Props {
  connections: MentorConnections[];
  loading: boolean;
}

// export a constant named MentorsGrid which is a React component with a generic type of Props
const MentorsGrid = ({ connections, loading }: Props) => {
  // useBreakpointValue to get the column count based on the screen size
  const cols = useBreakpointValue({
    base: "1",
    md: "2",
    lg: "3",
  });

  // return a Grid component with gridTemplateColumns and gap properties
  return (
    <Grid gridTemplateColumns={`repeat(${cols}, 1fr)`} gap={7} w="100%">
      {loading
        ? Array(10)
            .fill(0)
            .map((_, i) => <MentorCardSkeleton key={i} />)
        : connections.map((conn, i) => (
            <MentorCard key={i} connection={conn} />
          ))}
    </Grid>
  );
};

// export the default value of MentorsGrid
export default MentorsGrid;
