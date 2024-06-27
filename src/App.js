import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import LoginForm from './Components/LoginForm/LoginForm';
import Dashboard from './Components/Dashboard/Dashboard';
import ReservationForm from './Components/Reservation/ReservationForm';
import RoomList from './Components/List/RoomList';
import RoomListing from './Components/List/RoomListing';
import ReportForm from './Components/Mailing/Mailing';
//import AvailableRoom from './Components/Filtering/AvailableRoom';
//import RoomStatus from './Components/Filtering/RoomStatus';
//import RoomAvailability from './Components/Filtering/RoomAvailability';
const history = createBrowserHistory();

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router  history={history}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/reservation-form" element={isLoggedIn ? <ReservationForm /> : <Navigate to="/login" />} />
        <Route path="/rooms" element={isLoggedIn ? <RoomList /> : <Navigate to="/login" />} />
        <Route path="/room-listing" element={isLoggedIn ? <RoomListing /> : <Navigate to="/login" />} />
        <Route path="/report-form" element={isLoggedIn ? <ReportForm /> : <Navigate to="/login" />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};


//<Route path="/available-rooms" element={isLoggedIn ? <AvailableRoom /> : <Navigate to="/login" />} />
//<Route path="/room-status" element={isLoggedIn ? <RoomStatus /> : <Navigate to="/login" />} />
//<Route path="/room-availability" element={isLoggedIn ? <RoomAvailability /> : <Navigate to="/login" />} />
export default App;
