// client/src/main.jsx
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Events from './pages/Events.jsx';
import EventPage from './pages/EventPage.jsx';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'profiles/:profileId', element: <Profile /> },
      { path: 'me', element: <Profile /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:eventId', element: <EventPage /> }
    ],
  },
]);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <RouterProvider router={router} />
);