import { Box, Text } from "@chakra-ui/react";
import { UserType } from "../../misc/enum";
import { FcBusinessman, FcManager } from "react-icons/fc";
import { useSetupWizard } from "../../contexts/SetupWizardContext";

const UserTypeForm = () => {
  // use the `useSetupWizard` hook to get the data and setData functions
  const data = useSetupWizard()?.data;
  const setData = useSetupWizard()?.setData;
  // if the data and setData functions are not available, return
  if (!data || !setData) return;
  return (
    <>
      <Text fontWeight="700">What will be your role?</Text>
      <div className="flex sm:flex-col justify-center items-center gap-3">
        <Box
          onClick={() => {
            setData({ ...data, type: UserType.Student });
          }}
          className={`flex flex-col justify-center items-center p-10 gap-2 border border-solid rounded-md
             ${
               data?.type === UserType.Student
                 ? "border-accent"
                 : "border-gray-200"
             } cursor-pointer`}
        >
          <FcManager size={50} />
          <Text>I am a student</Text>
        </Box>
        <Box
          onClick={() => {
            setData({ ...data, type: UserType.Mentor });
          }}
          className={`flex flex-col justify-center items-center p-10 gap-2 border border-solid rounded-md
             ${
               data?.type === UserType.Mentor
                 ? "border-accent"
                 : "border-gray-200"
             } cursor-pointer`}
        >
          <FcBusinessman size={50} />
          <Text>I am a Mentor</Text>
        </Box>
      </div>
    </>
  );
};

export default UserTypeForm;
