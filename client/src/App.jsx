import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ShowDetails from './pages/ShowDetails/ShowDetails';
import BookSeats from './pages/BookSeats/BookSeats';
import Checkout from './pages/Checkout/Checkout';
import Receipts from './pages/Receipts/Receipts';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/book/:id" element={<ProtectedRoute><BookSeats /></ProtectedRoute>} />
        <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
