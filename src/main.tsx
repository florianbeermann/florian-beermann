import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/palettes.css";
import "./styles/shell.css";
import "./styles/world.css";
import "./styles/masthead.css";

createRoot(document.getElementById("root")!).render(<App />);
