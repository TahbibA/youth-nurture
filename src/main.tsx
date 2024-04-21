import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import theme from "./misc/theme.ts";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ConnectionsProvider } from "./contexts/ConnectionsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ConnectionsProvider>
            <App />
          </ConnectionsProvider>
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
