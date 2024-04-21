import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Image,
  Input,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { EventData } from "../../misc/interfaces";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { BiCalendarEvent } from "react-icons/bi";
import { fireStorage, fireStore } from "../../misc/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FirebaseError } from "firebase/app";

const CreateEventForm = ({ eventData }: { eventData?: EventData | null }) => {
  // Get user data from authentication provider
  const userData = useAuth()?.userData;
  // Get toast component from hook
  const toast = useToast();

  // Get disclosure components from hook
  const { onClose, onOpen, isOpen } = useDisclosure();
  // Set loading state
  const [loading, setLoading] = useState(false);

  // Create a ref for the image input element
  const imgRef = useRef<HTMLInputElement>(null);

  // Create a state for the form data
  const [data, setData] = useState<EventData>(
    // If eventData is provided and not null, use it as the initial state
    eventData && eventData !== null
      ? { ...(eventData as EventData) }
      : // Otherwise, use the default state
        {
          uid: "",
          mentorId: userData?.uid as string,
          title: "",
          date: Timestamp.now(),
          description: "",
          photoURL: "",
          link: "",
          createdAt: Timestamp.now(),
        }
  );

  // This function handles a change event on an input element
  const handleChange: ChangeEventHandler = (
    // The event is passed in as a parameter
    e: ChangeEvent<HTMLInputElement>
  ) => {
    // Get the name of the input element
    const name = e.target.name;
    // Get the value of the input element
    let value: unknown | Date | Timestamp = e.target.value;
    // If the input element is the date type
    if (name === "date") {
      // Convert the value to a Timestamp
      value = Timestamp.fromDate(new Date(value as Date));
    }
    // Set the data to the new value
    setData({ ...data, [name]: value });
  };

  const createEvent = async () => {
    setLoading(true);
    // Check if all fields are filled in
    if (!data.title || !data.description || !data.link) {
      // Show a warning toast if not all fields are filled in
      toast({
        title: "All fields are required.",
        status: "warning",
        position: "top",
        duration: 1500,
      });
      setLoading(false);
      return;
    }
    // Set the createdAt property to the current timestamp
    setData({ ...data, createdAt: Timestamp.now() });
    try {
      let docRef;
      let uid = "";
      // If an eventUID is present, update the event instead of creating a new one
      if (eventData?.uid) {
        docRef = doc(fireStore, "Events/" + eventData.uid);
        // Update the event with the new data
        await updateDoc(docRef, { ...data });
        // Set the uid to the eventUID
        uid = eventData.uid;
      } else {
        // Otherwise, create a new event
        docRef = await addDoc(collection(fireStore, "Events"), data);
        // Set the uid to the id of the newly created event
        uid = docRef.id;
      }
      // If an image is present, upload it to FireStorage
      if (imgRef.current?.files && imgRef.current?.files?.length > 0) {
        // If an existing photoURL is present, delete it
        if (eventData?.photoURL) {
          const previousPhotoRef = ref(fireStorage, eventData.photoURL);
          await deleteObject(previousPhotoRef);
        }
        // Create a new photoURL to the uploaded image
        const photoRef = ref(fireStorage, `event_photos/${uid}`);
        // Upload the image to FireStorage
        await uploadBytes(photoRef, imgRef.current?.files?.[0] as File);
        // Get the downloadURL of the uploaded image
        const photoURL = await getDownloadURL(photoRef);
        // Update the event with the new photoURL
        await updateDoc(docRef, {
          uid,
          photoURL,
        });
      }
      // Close the modal
      onClose();
      // If the event was created, set the uid and mentorId to the current user's
      if (!eventData?.uid) {
        setData({
          uid: "",
          mentorId: userData?.uid as string,
          title: "",
          date: Timestamp.now(),
          description: "",
          photoURL: "",
          link: "",
          createdAt: Timestamp.now(),
        });
      }
      // Show a success toast
      toast({
        title: eventData?.uid ? "Event Updated." : "Event Created",
        status: "success",
        position: "top",
        duration: 1500,
      });
    } catch (err) {
      console.log(err);
      if (err instanceof FirebaseError) {
        // Show an error toast if an FirebaseError is thrown
        toast({
          title: err.message,
          status: "error",
          duration: 1500,
          position: "top",
        });
      } else {
        // Show a generic error toast if another error is thrown
        toast({
          title: "Something went wrong.",
          status: "error",
          duration: 1500,
          position: "top",
        });
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <Button disabled={isOpen} onClick={onOpen}>
        {eventData ? "Edit Event" : "Create Event"}{" "}
        <BiCalendarEvent size={20} className="ml-2" />
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} placement="bottom">
        <DrawerOverlay className="backdrop-blur-[2px]" />
        <DrawerContent width={500} borderRadius="10px 10px 0 0" margin="0 auto">
          <DrawerHeader borderBottomWidth="1px">
            {eventData ? "Edit Event" : "Create Event"}
          </DrawerHeader>

          <DrawerBody>
            {eventData?.photoURL ? (
              <Image
                src={eventData?.photoURL}
                rounded={10}
                h="200px"
                w="100%"
                objectFit="cover"
              />
            ) : null}
            {/* Title */}
            <FormLabel>Event Title</FormLabel>
            <Input
              name="title"
              type="text"
              placeholder="Event title"
              mb={5}
              onChange={handleChange}
              required
              value={data.title}
            />
            {/* Date */}
            <FormLabel>Date</FormLabel>
            <Input
              name="date"
              type="datetime-local"
              mb={5}
              onChange={handleChange}
              required
              value={data.date.toDate().toISOString().slice(0, 16)}
            />
            {/* Description */}
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              mb={5}
              onChange={handleChange}
              required
              value={data.description}
            />
            {/* Title */}
            <FormLabel>Link</FormLabel>
            <Input
              name="link"
              type="url"
              placeholder="Link"
              mb={5}
              onChange={handleChange}
              required
              value={data.link}
            />
            {/* Image */}
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              name="description"
              mb={5}
              pt={"4px"}
              ref={imgRef}
              required
            />
            <Button onClick={createEvent} w="100%">
              {loading ? (
                <Spinner />
              ) : eventData ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateEventForm;
