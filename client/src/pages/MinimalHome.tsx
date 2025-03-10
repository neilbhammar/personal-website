import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import WordInteraction from "@/components/WordInteraction";
import FlashlightEffect from "@/components/FlashlightEffect";
import TilesEffect from "@/components/TilesEffect";
import SubtleHeader from "@/components/SubtleHeader";

const MinimalHome = () => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [tilesActive, setTilesActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Subtle fade-in animation on page load
  useEffect(() => {
    if (!contentRef.current) return;

    // Create a timeline for staggered element appearance
    const timeline = gsap.timeline();

    // Get all major sections
    const sections = contentRef.current.querySelectorAll("section");

    // Fade in elements with subtle stagger
    timeline.fromTo(
      sections,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <FlashlightEffect isActive={flashlightActive}>
      <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-center">
        {/* Subtle header */}
        <SubtleHeader>
          <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
            <div className="text-gray-800 font-normal">Neil Bhammar</div>
            <div className="flex space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </a>
              <a
                href="#work"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Work
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </SubtleHeader>

        {/* Main content with subtle styling */}
        <div className="flex-1 flex flex-col items-center justify-center mx-auto" ref={contentRef}>
          {/* Tiles effect that appears when triggered */}
          <TilesEffect
            text="bananagrams"
            isActive={tilesActive}
            onComplete={() => setTimeout(() => setTilesActive(false), 5000)}
          />

          {/* Simple, elegant hero section */}
          <section className="mb-20 py-16 max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-normal mb-6 tracking-tight">
              Hi, I'm Neil.
            </h1>

            <p className="text-xl md:text-2xl font-light text-gray-600 leading-relaxed max-w-2xl mb-8">
              I'm a startup enthusiast,{" "}
              <span
                className="relative cursor-pointer text-[#30b4bc] underline"
                onClick={() => setTilesActive(true)}
              >
                bananagrams
              </span>{" "}
              champ (at least in my house), and amateur pickleball aficionado.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
              This site is still a work in progress. I have no clue what it's
              going to be yet.
            </p>

            <div className="flex space-x-4 mt-8">
              <a
                href="#about"
                className="px-6 py-2 border border-gray-300 hover:border-gray-500 rounded-full transition-colors"
              >
                Read More
              </a>

              <a
                href="mailto:bhammar.neil@gmail.com"
                className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </section>

          {/* About section with subtle interactive elements */}
          <section id="about" className="py-16 mb-20">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-normal mb-8 tracking-tight">
                About Me
              </h2>

              <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                <p>
                  I spent the last 5.5 years building and scaling a company (
                  <a
                    href="https://busright.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    BusRight
                  </a>
                  ) that was creating the software that powers our nation's
                  largest mass transit system: school buses.
                </p>

                <p>
                  I joined as employee #1 before we had any customers or much of
                  a product and recently wrapped up that chapter as our Head of
                  Operations & Customer Experience following our Series B. I had
                  a ton of fun.
                </p>

                <p>
                  Before that, I invested in and supported founders at{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    DormRoomFund
                  </a>{" "}
                  and Northeastern University.
                </p>

                <p>
                  I'm not sure what's next for me - I'm honestly a little{" "}
                  <span
                    className="relative cursor-pointer text-[#30b4bc] underline"
                    onClick={() => setFlashlightActive(!flashlightActive)}
                  >
                    lost
                  </span>
                  , but that's part of the process. I'm a tinkerer by nature, so
                  I might find myself posting fun projects here.
                </p>
              </div>
            </div>
          </section>

          {/* Work experience section */}
          <section id="work" className="py-16 mb-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-normal mb-8 tracking-tight">
                Work Experience
              </h2>

              <div className="space-y-12">
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex flex-wrap justify-between items-baseline mb-2">
                    <h3 className="text-xl font-medium">
                      Head of Operations & Customer Experience
                    </h3>
                    <span className="text-gray-500 text-sm">2019 - 2024</span>
                  </div>
                  <h4 className="text-gray-600 mb-4">BusRight</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Led operations and customer experience for a growing SaaS
                    company in the education transportation space. Helped scale
                    the company from 0 to 3M+ daily users across hundreds of
                    school districts nationwide.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-8">
                  <div className="flex flex-wrap justify-between items-baseline mb-2">
                    <h3 className="text-xl font-medium">Investor</h3>
                    <span className="text-gray-500 text-sm">2018 - 2019</span>
                  </div>
                  <h4 className="text-gray-600 mb-4">DormRoomFund</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Invested in and supported student-founded startups across
                    the Boston ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact section with subtle animation */}
          <section id="contact" className="py-16 mb-12">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-normal mb-6 tracking-tight">
                Let's Connect
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                You can connect with me on socials (I'm more of a lurker) or
                shoot me an email.
              </p>

              <div className="flex justify-center space-x-6 my-8">
                <a
                  href="mailto:bhammar.neil@gmail.com"
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-500 transition-all hover:-translate-y-1 duration-300"
                  aria-label="Email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-500 transition-all hover:-translate-y-1 duration-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-500 transition-all hover:-translate-y-1 duration-300"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Neil Bhammar. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </FlashlightEffect>
  );
};

export default MinimalHome;
