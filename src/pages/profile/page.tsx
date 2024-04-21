import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { UserData } from "../../misc/interfaces";
import {
  getUserData,
  setUserData,
  updateProfilePhoto,
} from "../../utils/firebase";
import { HiPencilSquare } from "react-icons/hi2";
import { Department, Gender, UserType } from "../../misc/enum";
import { Timestamp } from "firebase/firestore";
import NotFound from "../notFound/page";
import Loading from "../../components/Loading";
import Title from "../../components/Title";
import ChangePassword from "./ChangePassword";

const ProfilePage = () => {
  // States and Hooks for required data;
  const toast = useToast();
  const { uid } = useParams();
  const userData = useAuth()?.userData;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Set state based on if profile is current users' or someone else
    if (!uid || !userData) return;
    const loadUserData = async () => {
      if (uid === userData?.uid) {
        setUser(userData);
        setNewUser(userData);
        setLoading(false);
        setEditing(true);
      } else {
        const data = await getUserData(uid);
        setUser(data);
        setNewUser(data);
      }
      setLoading(false);
    };
    loadUserData();
  }, [uid, userData]);

  // If still loading, show loading indicator
  if (loading) return <Loading />;
  // If no uid or no user data, show 404 page
  if (!uid || !user || !userData) return <NotFound />;

  // Handle changing user data
  const handleChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!newUser) return;
    let value: unknown = e.target.value;
    let name = e.target.name;
    if (e.target.name === "dob") {
      value = Timestamp.fromDate(new Date(value as Date));
    }
    if (name === "experience") {
      name = "mentorData";
      value = { experience: value };
    }
    if (name === "currentSchool") {
      name = "studentData";
      value = { currentSchool: value };
    }
    setNewUser({ ...newUser, [name]: value });
  };

  // Function to update user data
  const updateUser = async () => {
    if (!newUser) return;
    setLoading(true);
    const res = await setUserData(newUser);
    if (res)
      toast({
        title: "Updated Successfully",
        status: "success",
        isClosable: true,
        duration: 1000,
      });
    else
      toast({
        title: "Something went wrong",
        status: "error",
        isClosable: true,
        duration: 1000,
      });
    setLoading(false);
  };

  // Function to update profile photo
  const updatePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const oldURL = userData.photoURL;
    const res = await updateProfilePhoto(userData?.uid, file, oldURL);
    if (!res)
      toast({
        title: "Something went wrong",
        status: "error",
        isClosable: true,
        duration: 1000,
      });
    setLoading(false);
  };

  return (
    <form className="p-3">
      <Title title={userData.displayName || "Profile"} />
      <VStack
        maxW="600px"
        mx="auto"
        my={10}
        textAlign={"center"}
        alignItems="stretch"
        gap={5}
      >
        <div className="rounded-full relative self-center cursor-pointer">
          <Avatar
            name={user.displayName}
            src={user.photoURL}
            boxSize={"100px"}
          />
          <label className="absolute w-full h-full top-0 left-0 hover:bg-[#00000060] transition-all rounded-full [&_svg]:hover:block">
            <HiPencilSquare
              size={20}
              color="#fff"
              className="m-auto mt-9 hidden"
            />
            <input type="file" onChange={updatePhoto} className="hidden" />
          </label>
        </div>
        <div>
          {editing ? (
            <>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="displayName"
                value={newUser?.displayName || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <h1 className="font-bold">{user.displayName}</h1>
          )}
        </div>
        <div>
          {editing ? (
            <>
              <FormLabel>Department</FormLabel>
              <Select
                name="department"
                onChange={handleChange}
                value={newUser?.department}
                required
              >
                {Object.values(Department).map((gender) => (
                  <option value={gender} key={gender}>
                    {gender}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <Badge colorScheme="green" w="fit-content" mx="auto">
              {newUser?.department}
            </Badge>
          )}
        </div>
        <div>
          {editing ? (
            <>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={newUser?.description || ""}
                onChange={handleChange}
                rows={5}
              />
            </>
          ) : (
            <p>{newUser?.description}</p>
          )}
        </div>
        <div>
          {editing && (
            <>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={newUser?.email || ""} disabled />
            </>
          )}
        </div>
        <div>
          {editing ? (
            <>
              <FormLabel>Gender*</FormLabel>
              <Select
                name="gender"
                onChange={handleChange}
                value={newUser?.gender}
                required
              >
                {Object.values(Gender).map((gender) => (
                  <option value={gender} key={gender}>
                    {gender}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <h1>Gender: {newUser?.gender}</h1>
          )}
        </div>
        <div>
          {editing ? (
            <>
              <FormLabel>Latest Education</FormLabel>
              <Input
                name="latestEducation"
                value={newUser?.latestEducation || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <p>Latest Education: {newUser?.latestEducation}</p>
          )}
        </div>
        {user.type === UserType.Student && (
          <div>
            {editing ? (
              <>
                <FormLabel>Current School</FormLabel>
                <Input
                  name="currentSchool"
                  value={newUser?.studentData?.currentSchool || ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <p>
                Current School: {newUser?.studentData?.currentSchool || "N/A"}
              </p>
            )}
          </div>
        )}
        {user.type === UserType.Mentor && (
          <div>
            {editing ? (
              <>
                <FormLabel>Mentoring Experience</FormLabel>
                <Input
                  name="experience"
                  value={newUser?.mentorData?.experience || ""}
                  placeholder="Number of year"
                  onChange={handleChange}
                />
              </>
            ) : (
              <p>
                Mentoring Experience: {newUser?.mentorData?.experience || "N/A"}
              </p>
            )}
          </div>
        )}
        <div>
          {editing ? (
            <>
              <FormLabel>Date of birth</FormLabel>
              <Input
                name="dob"
                type="date"
                value={newUser?.dob.toDate().toISOString().slice(0, 10)}
                onChange={handleChange}
              />
            </>
          ) : (
            <p>Date of birth: {newUser?.dob.toDate().toDateString()}</p>
          )}
        </div>
        {uid === userData.uid && (
          <div className="flex sm:flex-col gap-1">
            <Button onClick={updateUser} disabled={loading}>
              Save Changes
            </Button>
            <ChangePassword />
          </div>
        )}
      </VStack>
    </form>
  );
};

export default ProfilePage;
