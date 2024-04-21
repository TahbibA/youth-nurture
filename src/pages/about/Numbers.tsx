import {
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

const Numbers = () => {
  const classes = useColorModeValue("bg-gray-200", "bg-[#202020]");
  return (
    <StatGroup
      display="grid"
      className={`grid gap-5 grid-cols-4 md:grid-cols-2 sm:!grid-cols-1 ${classes} p-10 md:p-5 mt-5 rounded-lg`}
    >
      <Stat textAlign="center">
        <StatLabel>Mentors</StatLabel>
        <StatNumber>150</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat textAlign="center">
        <StatLabel>Students</StatLabel>
        <StatNumber>500</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          39.05%
        </StatHelpText>
      </Stat>

      <Stat textAlign="center">
        <StatLabel>Connections</StatLabel>
        <StatNumber>2300</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          2.36%
        </StatHelpText>
      </Stat>

      <Stat textAlign="center">
        <StatLabel>Investors</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type="decrease" />
          1.05%
        </StatHelpText>
      </Stat>
    </StatGroup>
  );
};

export default Numbers;
