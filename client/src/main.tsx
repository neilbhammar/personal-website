// This is the entry point of our web application
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import custom fonts that look like handwriting
// These fonts are used to make certain text look more personal and handwritten
import "@fontsource/shadows-into-light";
import "@fontsource/permanent-marker";
import "@fontsource/rock-salt";
import "@fontsource/caveat";
import "@fontsource/indie-flower";

// Find the element with id "root" in our HTML and render our app inside it
createRoot(document.getElementById("root")!).render(<App />);
