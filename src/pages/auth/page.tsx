import { Text, VStack } from "@chakra-ui/react";
import Logo from "../../components/Logo";
import { useState } from "react";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";
import Title from "../../components/Title";

const AuthPage = () => {
  // Declare a variable to store the state of whether the user is registering or logging in
  const [isRegister, setIsRegister] = useState(false);

  // Return the JSX for the AuthPage component
  return (
    <VStack justifyContent="center" alignItems="center" minH="90vh" gap={10}>
      // Display the title depending on the state of the isRegister variable
      <Title title={isRegister ? "Register" : "Login"} />
      // Display the logo
      <Logo />
      // Display the LoginForm component, passing the isRegister state as a prop
      <LoginForm isRegister={isRegister} />
      // Display the ResetPassword component
      <VStack>
        // Display a text button to toggle the state of isRegister
        <Text onClick={() => setIsRegister((state) => !state)} cursor="pointer">
          {isRegister ? "Already a user? Login" : "New user? Register Now"}
        </Text>
        <ResetPassword />
      </VStack>
    </VStack>
  );
};

export default AuthPage;
