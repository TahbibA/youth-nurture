// Export an object containing routes for the application
export const routes = {
  // General routes
  general: {
    // Route for the about page
    about: "/about",
    // Route for the chat page
    chat: "/chat",
    // Route for the events page
    events: "/events",
    // Route for the profile page
    profile: "/profile",
    // Route for the setup profile page
    setupProfile: "/setup-profile",
  },
  // Student routes
  student: {
    // Route for the find mentors page
    findMentors: "/find-mentors",
    // Route for the connections page
    connections: "/connections",
  },
  // Mentor routes
  mentor: {
    // Route for the mentees page
    mentees: "/mentees",
    // Route for the requests page
    requests: "/requests",
  },
  // Authentication routes
  auth: {
    // Route for the authentication page
    auth: "/auth",
  },
};

// Export the name of the application
export const appName = "Youth Nurture";
