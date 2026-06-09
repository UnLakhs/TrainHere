import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from './auth/Register.tsx';
import Login from './auth/Login.tsx';
import Profile from './auth/Profile.tsx';
import Layout from './components/Layout.tsx';
import LocationDetails from './locations/LocationDetails.tsx';


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {path: "/", element: <App />},
      {path: "/locations/:id", element: <LocationDetails /> },
      {path: "/register", element: <Register /> },
      {path: "/login", element: <Login /> },
      {path: "/profile", element: <Profile /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
