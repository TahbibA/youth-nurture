import { Button, Flex, useBreakpoint } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { UserType } from "../misc/enum";
import { routes } from "../misc/constants";
import { Link } from "react-router-dom";

const MenuLinks = () => {
  // Get the user data from the authentication hook
  const userData = useAuth()?.userData;
  // Get the authenticated user data from the authentication hook
  const authUserData = useAuth()?.authUserData;
  // Get the break point from the breakpoint hook
  const breakPoint = useBreakpoint();

  // Conditional rendering of links according to user roles
  return (
    <Flex
      gap={5}
      className={`justify-center items-center ${
        breakPoint == "base" && "flex-col [&_a]:text-lg"
      }`}
    >
      {/* For all users */}
      {userData?.uid && (
        <>
          <Link to={routes.general.chat}>Messages</Link>
          <Link to={routes.general.events}>Events</Link>
        </>
      )}
      {/* For Students Only */}
      {userData?.type === UserType.Student && (
        <>
          <Link to={routes.student.findMentors}>Find Mentors</Link>
          <Link to={routes.student.connections}>Connections</Link>
        </>
      )}
      {/* For Mentors Only */}
      {userData?.type === UserType.Mentor && (
        <>
          <Link to={routes.mentor.mentees}>Mentees</Link>
          <Link to={routes.mentor.requests}>Requests</Link>
        </>
      )}
      {/* For Guests Users*/}
      {!authUserData && (
        <>
          <Link to={"/"}>Home</Link>
          <Link to={routes.general.about}>About</Link>
          <Button>
            <Link to={routes.auth.auth}>Login</Link>
          </Button>
        </>
      )}
    </Flex>
  );
};

export default MenuLinks;
