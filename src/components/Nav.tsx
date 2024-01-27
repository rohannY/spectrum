import { useRef, useEffect, useState } from "react";
import { Link  } from "react-router-dom";

import logo from "../assets/icon.svg";
import left from "../assets/left.svg";
import right from "../assets/right.svg";

export default function Nav() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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

  return (
    <div className="z-50 top-0 inset-x-0">
      <header className="flex py-8 max-w-[1600px] place-content-evenly flex-wrap mx-auto">
        <div className="x-auto w-full px-2.5 sm:px-20 md:px-20 flex justify-between space-x-8">
          <div className="justify-start flex w-10">
            <img src={logo} alt="logo" />
          </div>
          <div className="justify flex min-w-0 relative z-0" id="slider">
            {showLeftArrow && (
              <div className="w-12 h-full absolute justify-start left-0 z-10 bg-gradient-to-r from-[#121212] via-[#121212] to-transparent flex items-center cursor-pointer">
                <button onClick={slideLeft}>
                  <img className="w-4 h-4 " src={left} />
                </button>
              </div>
            )}

            {showRightArrow && (
              <div className="w-12 h-full absolute justify-end right-0 z-10 bg-gradient-to-l from-[#121212] via-[#121212] to-transparent flex items-center cursor-pointer">
                <button onClick={slideRight}>
                  <img className="w-4 h-4" src={right} />
                </button>
              </div>
            )}

            <div
              className="hidden md:flex space-x-5 items-center overflow-scroll no-scrollbar scroll-smooth"
              ref={sliderRef}
              style={{ overflowX: "scroll", whiteSpace: "nowrap" }}
            >
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
              <button className="h-10 px-3 border border-gray-500  rounded-xl">
                Gray
              </button>
            </div>
          </div>
          <div className="justify-end flex relative">
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseOut={() => setIsHovered(false)}
              className="px-3 py-2 md:px-6 m:py-3 border rounded-xl cursor-pointer border-gray-500 hover:bg-zinc-100 hover:text-gray-800"
              
            >
              <Link to="/custom">Custom</Link>
            </button>

            {isHovered && (
              <div className="z-10 absolute top-14 text-sm text-center w-[20em] px-5 py-2 bg-[#f2f2f214] opacity-100 backdrop-blur-sm text-[#f5f5f5df] rounded-lg border border-[#e6e6e627]">
                <div className="">Generate Color Palette from Images</div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
