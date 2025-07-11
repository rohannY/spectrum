import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../assets/icon.svg";
import left from "../assets/left.svg";
import right from "../assets/right.svg";

export default function Nav() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isCustom = location.pathname === "/custom";

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 200;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 200;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const slider = sliderRef.current as HTMLDivElement;
      if (slider) {
        const { scrollLeft, scrollWidth, clientWidth } = slider;
        const isScrolledToLeft = scrollLeft === 0;
        const isScrolledToRight = scrollLeft >= scrollWidth - clientWidth;

        setShowLeftArrow(!isScrolledToLeft);
        setShowRightArrow(!isScrolledToRight);
      }
    };

    sliderRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      sliderRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="z-50 top-0 inset-x-0 sticky"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header 
        className="flex py-6 max-w-[1600px] mx-auto"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center space-x-4">
          {/* Logo */}
          <motion.div 
            className="flex justify-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              <motion.img 
                src={logo} 
                alt="logo" 
                className="w-10 h-10"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          </motion.div>

          {/* Color Palette Slider */}
          <div className="flex-1 flex justify-center min-w-0 relative z-0" id="slider">
            <AnimatePresence>
              {showLeftArrow && (
                <motion.div 
                  className="w-12 h-full absolute left-0 z-10 bg-gradient-to-r from-black/50 via-black/30 to-transparent flex items-center cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button 
                    onClick={slideLeft}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <img className="w-4 h-4" src={left} alt="Left" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showRightArrow && (
                <motion.div 
                  className="w-12 h-full absolute right-0 z-10 bg-gradient-to-l from-black/50 via-black/30 to-transparent flex items-center cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button 
                    onClick={slideRight}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <img className="w-4 h-4" src={right} alt="Right" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isCustom && (
              <motion.div
                className="hidden md:flex space-x-3 items-center overflow-scroll no-scrollbar scroll-smooth max-w-md"
                ref={sliderRef}
                style={{ overflowX: "scroll", whiteSpace: "nowrap" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <motion.button
                    key={index}
                    className="h-10 px-4 border border-white/20 rounded-xl glass hover:border-white/40 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-sm font-medium">Gray</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Custom Button */}
          <div className="flex justify-end relative">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/custom"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="px-4 py-2 md:px-6 md:py-3 border rounded-xl cursor-pointer border-white/20 glass hover:border-white/40 hover:bg-white/10 transition-all duration-300 font-medium"
              >
                Custom
              </Link>
            </motion.div>

            <AnimatePresence>
              {isHovered && (
                <motion.div 
                  className="absolute top-14 right-0 z-10 text-sm text-center w-64 px-4 py-3 glass rounded-lg border border-white/20"
                  variants={tooltipVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="text-white/90">
                    Generate Color Palette from Images
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </motion.div>
  );
}
