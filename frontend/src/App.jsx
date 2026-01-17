import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { PizzaProvider } from './context/PizzaContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <PizzaProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-light font-sans text-dark">
              <Navbar />
              <main className="flex-grow">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </PizzaProvider>
    </AuthProvider>
  );
}

export default App;
