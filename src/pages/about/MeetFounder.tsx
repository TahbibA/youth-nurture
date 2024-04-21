import { FcDebt } from "react-icons/fc";
import FounderImage from "../../assets/about/founder.webp";
const MeetFounder = () => {
  return (
    <div className="flex md:flex-col-reverse gap-10 mt-20 items-center">
      <img
        src={FounderImage}
        className="w-2/5 md:w-full rounded-lg h-[350px] object-cover"
      />
      <div>
        <FcDebt className="mb-5 text-[100px] lg:text-[50px]" />
        <h1 className="text-3xl font-bold mb-3">Meet the founder</h1>
        <p>
          At Youth Nurture, our journey began with a vision: to bridge the gap
          between students and mentors, creating a supportive ecosystem for
          learning and growth. As the founder of this platform, I am passionate
          about empowering individuals to achieve their goals. Join us on this
          journey to make a difference in the lives of students and mentors.
        </p>
      </div>
    </div>
  );
};

export default MeetFounder;
