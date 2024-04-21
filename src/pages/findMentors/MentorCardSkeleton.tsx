import { Card, CardBody, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const MentorCardSkeleton = () => {
  return (
    <Card maxW="sm">
      <CardBody className="[&_div]:mx-auto">
        <SkeletonCircle boxSize={100} mb={5} />
        <SkeletonText
          mt="4"
          noOfLines={1}
          spacing="1"
          skeletonHeight="5"
          w="80%"
          mb={5}
        />
        <SkeletonText
          mt="4"
          noOfLines={1}
          spacing="1"
          skeletonHeight="4"
          w="70%"
          mb={5}
        />
        <SkeletonText
          mt="4"
          noOfLines={3}
          spacing="2"
          skeletonHeight="2"
          mb={5}
        />
        <SkeletonText mt="4" noOfLines={1} spacing="1" skeletonHeight="9" />
      </CardBody>
    </Card>
  );
};

export default MentorCardSkeleton;
