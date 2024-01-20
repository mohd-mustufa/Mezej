import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatsPage from "./pages/ChatsPage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/chats",
      element: <ChatsPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
