import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import App from "./App.tsx";
import { store } from "./store/index.tsx";

const queryClient = new QueryClient();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </ReduxProvider>
);
