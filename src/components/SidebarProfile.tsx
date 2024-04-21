import { Avatar, Badge, Button } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../misc/constants";

// Component for showing current user profile in right sidebar on desktop
const SidebarProfile = () => {
  const auth = useAuth();
  const userData = auth?.userData;
  const authUserData = auth?.authUserData;

  if (!userData || !authUserData) return;
  return (
    <aside className="flex flex-col gap-3 items-center px-3 pt-6 pb-3 w-[25%] h-screen md:hidden border-l ml-3">
      <Avatar
        name={userData.displayName}
        src={userData.photoURL}
        boxSize="100"
        outline="2px solid gray"
        p={1}
        mb={3}
      />
      <Link
        to={routes.general.profile + "/" + userData.uid}
        className="text-xl font-bold"
      >
        {userData.displayName}
      </Link>
      <Badge colorScheme="green" w="fit-content" mx="auto">
        {userData.department}
      </Badge>
      <p className="text-center">
        {userData.description?.substring(0, 150)}...
      </p>
      <Button as={Link} to={routes.general.profile + "/" + userData.uid}>
        Edit Profile
      </Button>
    </aside>
  );
};

export default SidebarProfile;
