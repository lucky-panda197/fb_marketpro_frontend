import React from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Home, Login, VpsCenter, GroupCenter } from "pages";
import { Header } from "components";
import { loginUserSuccess } from "features/auth/authSlice";
import ProtectedRoute from "./ProtectedRoute";
import PageNotFound from "./PageNotFound";

function App() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(loginUserSuccess());
    }
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vps"
          element={
            <ProtectedRoute>
              <VpsCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <GroupCenter />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
