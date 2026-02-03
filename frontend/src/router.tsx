import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { BoardPage } from "./pages/BoardPage";
import { ArchivePage } from "./pages/ArchivePage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <BoardPage /> },
      { path: "/archive", element: <ArchivePage /> },
    ],
  },
]);
