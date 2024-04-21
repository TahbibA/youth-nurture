import { FcIdea } from "react-icons/fc";
import FemaleMentorImage from "../../assets/home/female-tutor.webp";
import { Button, List, ListIcon, ListItem } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { Link } from "react-router-dom";
import { routes } from "../../misc/constants";
const MentorBenifits = () => {
  return (
    <div className="flex md:flex-col-reverse gap-10 mt-20 items-center">
      <img
        src={FemaleMentorImage}
        className="w-2/5 md:w-full rounded-lg md:h-[350px] object-cover"
      />
      <div>
        <FcIdea className="mb-5 text-[100px] lg:text-[50px]" />
        <h1 className="text-3xl font-bold mb-3">Mentor Benifits</h1>
        <p>
          Become a mentor with Youth Nurture and make a difference in students'
          lives while enhancing your own skills and knowledge. Join a vibrant
          community of educators and professionals dedicated to guiding and
          inspiring the next generation.
        </p>
        <List mt={5}>
          {[
            "Share expertise.",
            "Expand network.",
            "Enhance skills.",
            "Stay updated.",
            "Make impact.",
          ].map((benifit, i) => (
            <ListItem mb={1} key={i}>
              <ListIcon as={MdCheckCircle} color="green.500" />
              {benifit}
            </ListItem>
          ))}
        </List>
        <Button as={Link} to={routes.auth.auth} mt={5}>
          Become a mentor
        </Button>
      </div>
    </div>
  );
};

export default MentorBenifits;
