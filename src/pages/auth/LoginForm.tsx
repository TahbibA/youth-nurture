import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const LoginForm = ({ isRegister }: { isRegister: boolean }) => {
  const toast = useToast();
  // Hooks to access the auth context
  const login = useAuth()?.login;
  const singup = useAuth()?.singup;
  // State to store the user's credentials
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  // State to store the visibility of the form password field
  const [visibility, setVisibility] = useState(false);
  // Check if the login and singup functions are available
  if (!login || !singup) return;

  // Handle changing the credentials
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };
  // Handle submission of the form
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if the password is at least 8 characters
    if (credentials.password.length < 8) {
      toast({
        title: "Password must be more than 8 characters",
        status: "warning",
        duration: 2000,
      });
      return;
    }
    // Depending on the value of the isRegister variable, either call singup or login
    if (isRegister) singup(credentials.email, credentials.password);
    else login(credentials.email, credentials.password);
  };
  return (
    <form onSubmit={handleSubmit} className="w-[350px]">
      <FormLabel>Email*</FormLabel>
      <Input
        name="email"
        type="email"
        mb={5}
        onChange={handleChange}
        required
      />

      <FormLabel>password*</FormLabel>
      <InputGroup>
        <Input
          name="password"
          type={visibility ? "text" : "password"}
          mb={5}
          onChange={handleChange}
          required
        />
        <InputRightAddon
          cursor="pointer"
          onClick={() => setVisibility((state) => !state)}
        >
          {visibility ? <IoMdEyeOff /> : <IoMdEye />}
        </InputRightAddon>
      </InputGroup>
      <Button width={100} type="submit" w="100%">
        {isRegister ? "Register" : "Log in"}
      </Button>
      <Button colorScheme="gray" w="100%" mt={3} onClick={() => login()}>
        <FcGoogle size={20} />
        <Text ml={3}>Continue with Google</Text>
      </Button>
    </form>
  );
};

export default LoginForm;
