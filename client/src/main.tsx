import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import better handwriting fonts
import "@fontsource/shadows-into-light";
import "@fontsource/permanent-marker";
import "@fontsource/rock-salt";
import "@fontsource/caveat";
import "@fontsource/indie-flower";

createRoot(document.getElementById("root")!).render(<App />);
