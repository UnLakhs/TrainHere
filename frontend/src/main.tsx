import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "maplibre-gl/dist/maplibre-gl.css";
import App from './App.tsx'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from './auth/Register.tsx';
import Login from './auth/Login.tsx';
import Profile from './auth/Profile.tsx';
import RequireAdmin from './auth/RequireAdmin.tsx';
import RequireAuth from './auth/RequireAuth.tsx';
import Layout from './components/Layout.tsx';
import LocationDetails from './locations/LocationDetails.tsx';
import CreateLocationPage from './locations/CreateLocationPage.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';
import AdminLocationEditPage from './admin/AdminLocationEditPage.tsx';


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {path: "/", element: <App />},
      {path: "/locations/:id", element: <LocationDetails /> },
      {path: "/register", element: <Register /> },
      {path: "/login", element: <Login /> },
      {
        element: <RequireAuth />,
        children: [
          {path: "/locations/new", element: <CreateLocationPage /> },
          {path: "/profile", element: <Profile /> }
        ]
      },
      {
        element: <RequireAdmin />,
        children: [
          {path: "/admin", element: <AdminDashboard />},
          {path: "/adminPanel", element: <AdminDashboard />},
          {path: "/admin/locations/:id/edit", element: <AdminLocationEditPage />}
        ]
      }
    ]

  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
