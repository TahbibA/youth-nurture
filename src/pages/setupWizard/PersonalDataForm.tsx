import {
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler } from "react";
import { useSetupWizard } from "../../contexts/SetupWizardContext";
import { Gender } from "../../misc/enum";
import { Timestamp } from "firebase/firestore";

const PersonalDataForm = () => {
  // Hook to use the toast component
  const toast = useToast();

  // Hook to get the data from the setupWizard component
  const data = useSetupWizard()?.data;
  // Hook to set the data from the setupWizard component
  const setData = useSetupWizard()?.setData;
  // If the data or setData is not available, return
  if (!data || !setData) return;

  // Empty function to handle the submit event
  const handleSubmit = () => {};
  // Handler for the change event in the form
  const handleChange: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // Get the value from the event target
    let value: unknown = event.target.value;
    // Get the name of the field from the event target
    const name = event.target.name;
    // If the value is empty, show a warning toast and return
    if (!value)
      toast({
        title: "This field is required",
        status: "warning",
        duration: 2000,
      });
    // If the field is the date of birth, convert the value to a timestamp
    if (name === "dob") value = Timestamp.fromDate(new Date(value as Date));
    // Set the data with the new value
    setData({ ...data, [name]: value });
  };
  return (
    <form onSubmit={handleSubmit} className="w-[50%]">
      <Text fontWeight="700" textAlign="center" mb={5}>
        Tell us about yourself.
      </Text>
      <FormLabel>Email*</FormLabel>
      <Input
        name="email"
        type="email"
        mb={4}
        value={data.email}
        disabled={true}
        required
      />
      <FormLabel>Display name*</FormLabel>
      <Input
        name="displayName"
        type="text"
        mb={4}
        onChange={handleChange}
        value={data.displayName}
        required
      />
      <Textarea
        name="description"
        onChange={handleChange}
        value={data.description}
        placeholder="Describe yourself..."
      />
      <FormLabel>Date of bith*</FormLabel>
      <Input
        name="dob"
        type="date"
        mb={4}
        onChange={handleChange}
        value={data?.dob.toDate().toISOString().slice(0, 10)}
        required
      />
      <FormLabel>Gender*</FormLabel>
      <Select
        name="gender"
        mb={4}
        onChange={handleChange}
        value={data.gender}
        required
      >
        {Object.values(Gender).map((gender) => (
          <option value={gender} key={gender}>
            {gender}
          </option>
        ))}
      </Select>
    </form>
  );
};

export default PersonalDataForm;
