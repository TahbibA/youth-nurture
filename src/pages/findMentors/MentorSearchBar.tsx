import { FormLabel, Input, Select, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MentorConnections } from "../../misc/interfaces";
import { getMentorsBySearch } from "../../utils/firebase";
import { Department, UserType } from "../../misc/enum";
import { useAuth } from "../../contexts/AuthContext";
import { Unsubscribe } from "firebase/firestore";

interface Props {
  connections: MentorConnections[];
  setConnections: (data: MentorConnections[]) => void;
  loading: boolean;
  setLoading: (data: boolean) => void;
}

const MentorSearchBar = ({ setConnections, setLoading }: Props) => {
  // import the useToast hook and use it to display toast messages
  const toast = useToast();
  // create a state variable to store the user's query
  const [query, setQuery] = useState("");
  // create a state variable to store the user's department
  const [department, setDepartment] = useState("");
  // use the useAuth hook to get the user's data
  const userData = useAuth()?.userData;

  // effect to set the department when the user's data is available
  useEffect(() => {
    userData && setDepartment(userData?.department);
  }, [userData]);

  // effect to get and display the list of mentors based on the user's query
  useEffect(() => {
    // if the user's data is not available, return
    if (!userData?.uid) return;
    // create a variable to store the unsubscribe function
    let unsubscribe: Unsubscribe | undefined;
    // set the loading state to true
    setLoading(true);
    // call the getMentorsBySearch function with the user's query, type, department, and user ID
    const getUnsubscribe = async () => {
      unsubscribe = await getMentorsBySearch(
        query,
        UserType.Mentor,
        department,
        userData.uid,
        async (data: MentorConnections[]) => {
          // set the connections state to the returned data
          setConnections(data);
          // if the data length is 0, display a warning toast message
          if (data.length === 0)
            toast({
              title: "No Mentors Found",
              description: "Try searching something else",
              status: "warning",
              duration: 1000,
            });
          // set the loading state to false
          setLoading(false);
        }
      );
    };
    // call the getUnsubscribe function
    getUnsubscribe();
    // return a cleanup function to unsubscribe from the effect
    return () => unsubscribe && unsubscribe();
  }, [userData, setLoading, department, query, toast, setConnections]);

  return (
    <VStack w="100%" alignItems={"start"} gap={0}>
      <FormLabel>Find by name and department</FormLabel>
      <div className="w-full flex gap-2">
        <Input
          name="query"
          type="text"
          mb={5}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="john..."
          // required
          value={query}
        />
        <Select
          placeholder="- Select department -"
          onChange={(e) => setDepartment(() => e.target.value)}
          value={department}
        >
          {Object.values(Department).map((dept, i) => (
            <option value={dept} key={i}>
              {dept}
            </option>
          ))}
        </Select>
        {/* <Button type="submit" disabled={loading} minW="auto">
          Find <Icon as={BiSearch} mt={0.5} ml={1} />
        </Button> */}
      </div>
    </VStack>
  );
};

export default MentorSearchBar;
