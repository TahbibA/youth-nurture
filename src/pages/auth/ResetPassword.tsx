import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "../../misc/firebase";
import { FirebaseError } from "firebase/app";

const ResetPassword = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [email, setEmail] = useState("");
  const toast = useToast();
  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email))
      return toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        status: "error",
        isClosable: true,
      });
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email sent successfully",
        description:
          "Please check your inbox and visit the reset link to reset your password.",
        status: "success",
      });
      onClose();
    } catch (err: unknown) {
      console.log("🚀 ~ sendEmail ~ err:", err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-email")
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address",
            status: "error",
            isClosable: true,
          });
      }
    }
  };
  return (
    <>
      <Text onClick={onOpen} cursor="pointer">
        Reset Password
      </Text>
      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay className="backdrop-blur-[2px]" />
        <DrawerContent width={500} borderRadius="10px 10px 0 0" margin="0 auto">
          <DrawerHeader borderBottomWidth="1px">Reset Password</DrawerHeader>
          <DrawerBody padding={10}>
            <form onSubmit={sendEmail}>
              <FormLabel>Email*</FormLabel>
              <Input
                name="email"
                type="email"
                mb={5}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Button type="submit" w="100%">
                Send Reset Link
              </Button>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ResetPassword;
