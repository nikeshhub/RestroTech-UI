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
import ResponsiveDrawer from "./Components/ResponsiveDrawer";
import Menu from "./Pages/Menu";
import Orders from "./Pages/Orders";
import Table from "./Pages/Table";

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
          <ResponsiveDrawer>
            <Outlet />
          </ResponsiveDrawer>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/menu",
          element: <Menu />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/tables",
          element: <Table />,
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
