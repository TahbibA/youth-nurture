import { FormLabel, Input, Select, Text, useToast } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler } from "react";
import { useSetupWizard } from "../../contexts/SetupWizardContext";
import { Department } from "../../misc/enum";

const OtherDataForm = () => {
  // Hook to access the toast instance
  const toast = useToast();

  // Hook to access the data from the setup wizard
  const data = useSetupWizard()?.data;
  const setData = useSetupWizard()?.setData;
  // If the data or setData is not available, return
  if (!data || !setData) return;

  // No-op function to handle form submission
  const handleSubmit = () => {};
  // Handles changes to input fields
  const handleChange: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // Get the value and name of the changed input
    const value = event.target.value;
    const name = event.target.name;
    // If the value is empty, show a warning toast and don't update the data
    if (!value)
      toast({
        title: "This field is required",
        status: "warning",
        duration: 2000,
      });
    // Update the data with the new value
    setData({ ...data, [name]: value });
  };
  return (
    <form onSubmit={handleSubmit} className="w-[50%]">
      <Text fontWeight="700" textAlign="center" mb={5}>
        What about your education?
      </Text>
      <FormLabel>Department of education</FormLabel>
      <Select
        name="department"
        mb={4}
        onChange={handleChange}
        value={data.department}
        required
      >
        {Object.values(Department).map((dept) => (
          <option value={dept} key={dept}>
            {dept}
          </option>
        ))}
      </Select>
      <FormLabel>Latest education</FormLabel>
      <Input
        name="latestEducation"
        type="text"
        mb={4}
        onChange={handleChange}
        value={data.latestEducation}
        required
      />
    </form>
  );
};

export default OtherDataForm;
