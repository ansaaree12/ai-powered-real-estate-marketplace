import './App.css';
import '@mantine/core/styles.css';
import "react-datepicker/dist/react-datepicker.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { MantineProvider } from '@mantine/core';

import Website from './pages/Website';
import Layout from './components/Layout/Layout';
import Properties from './pages/Properties/Properties';
import Property from './pages/Property/Property';
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import OurAgents from './pages/agents/OurAgents';
import AgentDetails from './pages/agents/AgentDetails';
import AboutUs from './pages/AboutUs';

import UserDetailContext from './context/UserDetailContext';
import ComparePage from "./pages/ComparePage";

function App() {
  const queryClient = new QueryClient();
  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    token: null
  });

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Website />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:propertyId" element={<Property />} />
                  <Route path="/agents" element={<OurAgents />} />
                  <Route path="/agents/:id" element={<AgentDetails />} />
                  <Route path="/compare-page" element={<ComparePage />} /> 
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/favourites" element={<Favourites />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>

          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </MantineProvider>
  );
}

export default App;
