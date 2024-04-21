import { Card, CardBody, CardHeader, Icon } from "@chakra-ui/react";
import {
  FcApproval,
  FcBusinessman,
  FcCollaboration,
  FcManager,
} from "react-icons/fc";

const Features = () => {
  const features = [
    {
      title: "Great Mentors",
      description:
        "Connect with experienced mentors who are passionate about helping students succeed. Our platform carefully selects mentors based on their expertise, ensuring you receive valuable guidance and support tailored to your needs.",
      icon: FcBusinessman,
    },
    {
      title: "Great Students",
      description:
        "Join a community of ambitious students dedicated to learning and growth. Interact with peers who share similar goals and aspirations, fostering collaboration and mutual support in your academic journey.",
      icon: FcManager,
    },
    {
      title: "Real-time Chat",
      description:
        "Communicate with mentors and fellow students in real-time through our integrated chat feature. Seamlessly exchange messages, ask questions, and receive instant feedback to enhance your learning experience.",
      icon: FcCollaboration,
    },
    {
      title: "Free of cost",
      description:
        "Access all the features and benefits of Youth Nurture completely free of cost. We believe in making mentorship and educational support accessible to everyone, regardless of financial barriers.",
      icon: FcApproval,
    },
  ];
  return (
    <div>
      <h1 className="text-6xl font-bold text-center mb-2">Features</h1>
      <div className="w-[150px] h-[2px] bg-gray-600 mx-auto mb-6" />
      <div className="grid grid-cols-4 lg:grid-cols-2 md:!grid-cols-1 gap-5">
        {features.map((feat, i) => (
          <Card key={i}>
            <CardHeader>
              <Icon as={feat.icon} fontSize={60} />
            </CardHeader>
            <CardBody>
              <h1 className="text-2xl font-medium mb-3">{feat.title}</h1>
              <p>{feat.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
