import { useContext } from "react";
import Home from "./Pages/Home";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthContext } from "./Context/authContext";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },

    {
      path: "/register",
      element: <Register />,
    },

    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
