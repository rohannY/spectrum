import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { HashRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Main from "./components/Main";
import Custom from "./components/Custom";

// Page transition component
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Main />
            </PageTransition>
          } 
        />
        <Route 
          path="/custom" 
          element={
            <PageTransition>
              <Custom />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <motion.div 
        className="min-h-screen font-inter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-40"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-25"
            animate={{
              x: [0, 120, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <Nav />
          <AnimatedRoutes />
      </div>
      </motion.div>
    </Router>
  );
}

export default App;
