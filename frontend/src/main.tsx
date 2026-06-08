import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from './Register.tsx';

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/register", element: <Register />}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
