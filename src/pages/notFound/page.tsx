import { Button } from "@chakra-ui/react";
import { FcBrokenLink } from "react-icons/fc";
import { Link } from "react-router-dom";

// Component to dispaly Not Found Message
const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-4 ">
      <FcBrokenLink size={100} />
      <h1 className="text-xl">Your're Lost</h1>
      <Button as={Link} to={"/"}>
        Go to homepage
      </Button>
    </div>
  );
};

export default NotFound;
