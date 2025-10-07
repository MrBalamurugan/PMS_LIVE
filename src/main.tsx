import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/index.tsx";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReduxProvider>
);
