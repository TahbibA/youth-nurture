import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { ChangeEvent, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import { FirebaseError } from "firebase/app";
import { auth } from "../../misc/firebase";

const ChangePassword = () => {
  // Get the user data from the authentication context
  const userData = useAuth()?.userData;
  // Get the authentication user data from the authentication context
  const authUserData = useAuth()?.authUserData;
  // Get the toast context
  const toast = useToast();

  // Get the disclosure context
  const { onClose, onOpen, isOpen } = useDisclosure();
  // Set the visibility state
  const [visibility, setVisibility] = useState(false);
  // Set the loading state
  const [loading, setLoading] = useState(false);

  // Set the passwords state
  const [passwords, setPasswords] = useState<{
    oldPassword: string;
    newPassword: string;
  }>({ oldPassword: "", newPassword: "" });

  // This function handles a password change event
  const handlePassChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get the name and value of the password field
    const name = e.target.name;
    const value = e.target.value;
    // Update the passwords object with the new value
    setPasswords({ ...passwords, [name]: value });
  };

  // This function checks if the user is using a password
  const isPasswordUser = () => {
    // Loop through the authUserData providerData array
    for (let i = 0; i < (authUserData?.providerData?.length as number); i++) {
      // Return true if the user is using a password
      if (authUserData?.providerData[i].providerId === "password") return true;
    }
    // Return false if the user is not using a password
    return false;
  };

  const update = async () => {
    // Check if the loading state is true, and if so, return
    if (loading) return;
    // Set the loading state to true
    setLoading(true);
    // Check if the new password or old password is not entered
    if (!passwords.newPassword || !passwords.oldPassword)
      // Display an error message
      toast({
        title: "Enter both old and new password",
        status: "error",
        isClosable: true,
        duration: 1000,
      });
    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(
        auth,
        userData?.email as string,
        passwords.oldPassword
      );
      // Check if the current user is not available
      if (!auth.currentUser) return;
      // Update the password
      await updatePassword(auth.currentUser, passwords.newPassword);
      // Display a success message
      toast({
        title: "Password updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      // Close the modal
      onClose();
      // Set the passwords to empty strings
      setPasswords({ oldPassword: "", newPassword: "" });
      // Set the visibility state to false
      setVisibility(false);
    } catch (err) {
      // Check if the error is an instance of FirebaseError
      if (err instanceof FirebaseError) {
        // Display an error message
        toast({
          title: err.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
    // Set the loading state to false
    setLoading(false);
  };
  // Check if the user is not entering the password
  if (!isPasswordUser()) return null;
  return (
    <div>
      <Button disabled={isOpen} onClick={onOpen}>
        Change Password <HiPencilSquare size={20} className="ml-2" />
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} placement="bottom">
        <DrawerOverlay className="backdrop-blur-[2px]" />
        <DrawerContent width={500} borderRadius="10px 10px 0 0" margin="0 auto">
          <DrawerHeader borderBottomWidth="1px">Change Password</DrawerHeader>
          <DrawerBody>
            <FormLabel>Old Password</FormLabel>
            <InputGroup>
              <Input
                name="oldPassword"
                type={visibility ? "text" : "password"}
                placeholder="Old Password"
                mb={5}
                onChange={handlePassChange}
                required
                value={passwords.oldPassword}
              />
              <InputRightAddon
                cursor="pointer"
                onClick={() => setVisibility((state) => !state)}
              >
                {visibility ? <IoMdEyeOff /> : <IoMdEye />}
              </InputRightAddon>
            </InputGroup>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                name="newPassword"
                type={visibility ? "text" : "password"}
                placeholder="New Password"
                mb={5}
                onChange={handlePassChange}
                required
                value={passwords.newPassword}
              />
            </InputGroup>
            <Button onClick={update} w="100%">
              {loading ? <Spinner /> : "Chnage Password"}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChangePassword;
