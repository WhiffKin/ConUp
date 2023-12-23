import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import * as sessionActions from './store/session';
import GroupsPage from './components/GroupsPage/GroupsPage';
import SingleGroup from './components/SingleGroup';
import EventsPage from './components/EventsPage';
import SingleEvent from './components/SingleEvent';
import CreateEvent from './components/CreateEvent';
import CreateGroup from './components/CreateGroup';
import UpdateEvent from './components/UpdateEvent';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/groups/:groupId/events/new',
        element: <CreateEvent />
      },
      {
        path: '/groups/:groupId',
        element: <SingleGroup />
      },
      {
        path: '/groups/new',
        element: <CreateGroup />
      },
      {
        path: '/groups',
        element: <GroupsPage />
      },
      {
        path: '/events/:eventId/edit',
        element: <UpdateEvent />
      },
      {
        path: '/events/:eventId',
        element: <SingleEvent />
      },
      {
        path: '/events',
        element: <EventsPage />
      },
      {
        path: '*',
        element: (
        <>
          <h3>404 Page not found: needs more cookies...</h3>
        </>
        )
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;