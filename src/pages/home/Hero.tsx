import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { appName, routes } from "../../misc/constants";
import youtSupportImage from "../../assets/home/youth-support.svg";

const Hero = () => {
  return (
    <div className="flex md:flex-col min-h-[400px] items-center">
      <div className="w-1/2 md:w-full md:text-center">
        <h1 className="text-6xl md:text-5xl font-bold">
          Welcome to <br />
          <span className="text-accent">{appName}</span>
        </h1>
        <p className="mt-5">
          Youth Nurture is a platform fostering connections between students and
          mentors, empowering growth and learning. Our mission is to provide a
          supportive environment where students access mentorship and guidance.
          Whether seeking support or eager to share knowledge, Youth Nurture is
          here to help.
        </p>
        <div className="flex gap-2 mt-5 md:justify-center">
          <Button as={Link} to={routes.auth.auth}>
            Get Started
          </Button>
          <Button as={Link} to={routes.auth.auth} variant="outline">
            Get Started
          </Button>
        </div>
      </div>
      <div className="w-1/2 md:w-full">
        <img
          src={youtSupportImage}
          className="ml-auto w-[80%] md:w-2/3 sm:!w-full md:mx-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
