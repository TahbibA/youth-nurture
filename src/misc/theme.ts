import {
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
} from "@chakra-ui/react";

// New Chakra ui theme configuration;
const config: ThemeConfig = {
  initialColorMode: "light",
};

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: "purple",
    components: [
      "Button",
      "Badge",
      "Alert",
      "Switch",
      "Checkbox",
      "Radio",
      "Input",
      "Textarea",
      "Select",
      "Slider",
      "SliderTrack",
      "SliderFilledTrack",
      "SliderThumb",
      "Spinner",
      "Progress",
      "CircularProgress",
      "CircularProgressLabel",
      "Divider",
      "Icon",
      "IconButton",
      "Image",
      "Link",
      "List",
      "ListItem",
      "Breadcrumb",
      "BreadcrumbItem",
      "Menu",
      "MenuItem",
      "MenuList",
      "MenuButton",
      "Popover",
      "PopoverTrigger",
      "PopoverContent",
      "PopoverArrow",
      "PopoverCloseButton",
      "PopoverHeader",
      "PopoverBody",
      "Tooltip",
      "AlertDialog",
      "AlertDialogBody",
      "AlertDialogFooter",
      "AlertDialogHeader",
      "AlertDialogContent",
      "AlertDialogOverlay",
      "Drawer",
      "DrawerBody",
      "DrawerFooter",
      "DrawerHeader",
      "DrawerOverlay",
      "DrawerContent",
      "DrawerCloseButton",
      "Tabs",
      "TabList",
      "TabPanels",
      "Tab",
      "TabPanel",
      "Accordion",
    ],
  }),
  {
    config,
    colors: {
      gray: {
        50: "#f9f9f9",
        100: "#ededed",
        200: "#d3d3d3",
        300: "#b3b3b3",
        400: "#a0a0a0",
        500: "#898989",
        600: "#6c6c6c",
        700: "#202020",
        800: "#121212",
        900: "#111",
      },
    },
  }
);

// Exporting the theme configutation
export default theme;
