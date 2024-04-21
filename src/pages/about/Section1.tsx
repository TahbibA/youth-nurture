import { Button } from "@chakra-ui/react";
import TeamWorkingImage from "../../assets/about/team-working.webp";
import FemaleMentorImage from "../../assets/home/female-tutor.webp";
import { FiArrowUpRight } from "react-icons/fi";

const Section1 = () => {
  return (
    <div className="flex md:flex-col-reverse gap-4 items-end">
      <div className="w-1/3 md:w-full">
        <Button variant="outline" p={7} mb={5} fontSize={20}>
          Talk to us
          <FiArrowUpRight size={25} className="ml-2" />
        </Button>
        <img
          src={FemaleMentorImage}
          className="rounded-lg max-h-[400px] md:hidden w-full object-cover"
        />
      </div>
      <div className="w-2/3 md:w-full">
        <p className="w-full lg:w-full ml-auto p-2 mt-2">
          About Us At Youth Nurture, we are committed to fostering a supportive
          learning environment where students and mentors can connect,
          collaborate, and grow together. Our platform is driven by a passion
          for education and a belief in the power of mentorship to transform
          lives. With a focus on empowering individuals to reach their full
          potential, we strive to provide resources, guidance, and opportunities
          for personal and professional development. Join us on this journey to
          inspire, educate, and make a positive impact in the lives of others.
        </p>
        <img
          src={TeamWorkingImage}
          className="rounded-lg w-full object-cover  md:max-h-[400px]"
        />
      </div>
    </div>
  );
};

export default Section1;
