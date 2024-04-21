import CallToAction from "./CallToAction";
import Features from "./Features";
import Hero from "./Hero";
import MentorBenifits from "./MentorBenifits";

const HomePage = () => {
  return (
    <div className="max-w-[1400px] mx-auto py-5 px-10 md:px-5 sm:px-3">
      <Hero />
      <Features />
      <CallToAction />
      <MentorBenifits />
    </div>
  );
};

export default HomePage;
