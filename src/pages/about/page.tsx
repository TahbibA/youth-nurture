import MeetFounder from "./MeetFounder";
import Numbers from "./Numbers";
import Section1 from "./Section1";

const AboutPage = () => {
  return (
    <div className="max-w-[1400px] mx-auto py-5 px-10 md:px-5 sm:px-3">
      <h1 className="text-8xl font-bold -mb-5 lg:mb-0 md:text-6xl">About Us</h1>
      <Section1 />
      <h1 className="text-center font-bold mt-10 lg:mb-0 text-6xl">
        Our Stats
      </h1>
      <Numbers />
      <MeetFounder />
    </div>
  );
};

export default AboutPage;
