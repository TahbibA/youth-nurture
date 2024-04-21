import { Button, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { routes } from "../../misc/constants";
import HappyStudentImge from "../../assets/home/happy-student.webp";

const CallToAction = () => {
  const { colorMode } = useColorMode();
  return (
    <div
      className={`${
        colorMode === "dark" ? "bg-[#202020]" : "bg-gray-200"
      } p-5 rounded-xl mt-20 flex md:flex-col-reverse items-center gap-5`}
    >
      <div className="md:text-center">
        <h1 className="text-3xl font-bold mb-5"> Supercharge Yourself</h1>
        <p className="text-lg">
          Ready to elevate your academic journey? Youth Nurture provides access
          to a network of mentors, resources, and a supportive community. Sign
          up now for a transformative learning experience!
        </p>
        <Button
          as={Link}
          to={routes.auth.auth}
          colorScheme="#fff"
          p={7}
          mt={4}
          variant={"outline"}
        >
          Become a student
        </Button>
      </div>
      <img src={HappyStudentImge} className="w-[30%] md:w-full rounded-lg" />
    </div>
  );
};

export default CallToAction;
