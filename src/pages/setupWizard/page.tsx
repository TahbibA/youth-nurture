import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Progress,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import UserTypeForm from "./UserTypeForm";
import { useSetupWizard } from "../../contexts/SetupWizardContext";
import PersonalDataForm from "./PersonalDataForm";
import OtherDataForm from "./OtherDataForm";
import { setUserData } from "../../utils/firebase";
import { UserData } from "../../misc/interfaces";

const SetupWizardPage = () => {
  // Hooks to manage the state of the setup wizard
  const toast = useToast();
  // Current step of the setup wizard
  const [step, setStep] = useState(1);
  // Percentage completed of the setup wizard
  const [progress, setProgress] = useState(33.33);
  // The data collected in the setup wizard
  const data = useSetupWizard()?.data;
  // The function to set the data collected in the setup wizard
  const setData = useSetupWizard()?.setData;
  // Exit condition
  if (!data || !setData) return;

  // Function to save the user data to the server
  const saveUserData = async () => {
    // Check if all the required fields are filled
    if (
      !data.email ||
      !data.displayName ||
      !data.description ||
      !data.dob ||
      !data.gender ||
      !data.department ||
      !data.latestEducation
    )
      toast({
        title: "Missing required fields.",
        description:
          "Please fill all the required field. Required Fields are marked using (*).",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    else {
      // Save the data
      const res = await setUserData({ ...data } as UserData);
      // If the data is saved successfully, show a success message
      if (res === true) {
        toast({
          title: "Profile Updated Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <VStack h="90vh" alignItems="center" justifyContent="center">
      <Progress
        hasStripe
        value={progress}
        mb="5%"
        mx="5%"
        isAnimated
        w="80%"
      ></Progress>
      <Heading mb={5}>Setup your profile</Heading>
      {step === 1 ? (
        <UserTypeForm />
      ) : step === 2 ? (
        <PersonalDataForm />
      ) : (
        <OtherDataForm />
      )}
      <ButtonGroup mt="5%" w="80%">
        <Flex w="100%" justifyContent="space-between">
          <Button
            onClick={() => {
              setStep(step - 1);
              setProgress(progress - 33.33);
            }}
            isDisabled={step === 1}
            w="7rem"
            mr="5%"
          >
            Back
          </Button>
          {step < 3 && (
            <Button
              w="7rem"
              isDisabled={step === 3}
              onClick={() => {
                setStep(step + 1);
                if (step === 3) {
                  setProgress(100);
                } else {
                  setProgress(progress + 33.33);
                }
              }}
            >
              Next
            </Button>
          )}
          {step === 3 && (
            <Button w="7rem" onClick={saveUserData}>
              Submit
            </Button>
          )}
        </Flex>
      </ButtonGroup>
    </VStack>
  );
};

export default SetupWizardPage;
