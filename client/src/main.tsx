import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import better handwriting fonts
import "@fontsource/shadows-into-light";
import "@fontsource/permanent-marker";
import "@fontsource/rock-salt";

createRoot(document.getElementById("root")!).render(<App />);
