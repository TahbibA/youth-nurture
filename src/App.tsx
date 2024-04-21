import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import AuthPage from "./pages/auth/page";
import HomePage from "./pages/home/page";
import { routes } from "./misc/constants";
import { useAuth } from "./contexts/AuthContext";
import NotFound from "./pages/notFound/page";
import AboutPage from "./pages/about/page";
import FindMentorspage from "./pages/findMentors/page";
import ConnectionsPage from "./pages/connections/page";
import ProfilePage from "./pages/profile/page";
import { UserType } from "./misc/enum";
import ChatPage from "./pages/chat/page";
import SetupWizardPage from "./pages/setupWizard/page";
import { SetupWizardProvider } from "./contexts/SetupWizardContext";
import Footer from "./components/Footer";
import EventsPage from "./pages/events/page";

function App() {
  // Use the 'useAuth' hook to get the authentication data
  const authUserData = useAuth()?.authUserData;
  const userData = useAuth()?.userData;
  return (
    <main>
      <Header />
      <Routes>
        {/* All Role Routes */}
        <Route
          path="/"
          element={
            authUserData && userData === null ? (
              <Navigate to={routes.general.setupProfile} />
            ) : (
              <HomePage />
            )
          }
        />
        <Route path={routes.general.about} element={<AboutPage />} />
        <Route
          path={routes.auth.auth}
          element={
            authUserData ? (
              <Navigate
                to={userData === null ? routes.general.setupProfile : "/"}
                replace={true}
              />
            ) : (
              <AuthPage />
            )
          }
        ></Route>
        /* Newly Regiseted Users */
        <Route
          path={routes.general.setupProfile}
          element={
            authUserData && userData === null ? (
              <SetupWizardProvider>
                <SetupWizardPage />
              </SetupWizardProvider>
            ) : (
              <Navigate to="/" replace={true} />
            )
          }
        />
        {
          /* For Both Student and Mentor Routes */
          userData?.uid && (
            <>
              <Route
                path={routes.general.profile + "/:uid"}
                element={<ProfilePage />}
              />
              <Route path={routes.general.chat} element={<ChatPage />} />
              <Route
                path={routes.general.chat + "/:chatId"}
                element={<ChatPage />}
              />
              <Route path={routes.general.events} element={<EventsPage />} />
            </>
          )
        }
        {
          /* For Student Only Routes */
          userData?.type === UserType.Student && (
            <>
              <Route
                path={routes.student.findMentors}
                element={<FindMentorspage />}
              />
              <Route
                path={routes.student.connections}
                element={<ConnectionsPage title="Connections" />}
              />
            </>
          )
        }
        {
          /* For Mentors Only Routes */
          userData?.type === UserType.Mentor && (
            <>
              <Route
                path={routes.mentor.mentees}
                element={<ConnectionsPage title="Mentees" />}
              />
              <Route
                path={routes.mentor.requests}
                element={<ConnectionsPage title="Connection Requests" />}
              />
            </>
          )
        }
        {/* Not Found Route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
