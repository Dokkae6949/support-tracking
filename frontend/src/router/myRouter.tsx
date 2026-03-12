import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudentList from "../components/StudentList";
import StudentDetail from "../components/StudentDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentList />,
  },
  {
    path: "/students/:id",
    element: <StudentDetail />,
  },
]);

export default function MyRouter() {
  return <RouterProvider router={router} />;
}
