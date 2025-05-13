import React, { useEffect, useRef, useState } from "react";

const AboutPage = () => {
  // Refs for animation elements
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const featureRefs = useRef([]);
  const statsRefs = useRef([]);
  const beforeAfterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set loaded state after component mounts
    setTimeout(() => setIsVisible(true), 100);

    // Set up intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all refs
    if (titleRef.current) observer.observe(titleRef.current);
    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);
    if (beforeAfterRef.current) observer.observe(beforeAfterRef.current);

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    statsRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen bg-white">
      {/* New background design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top background pattern */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gray-50"></div>

        {/* Diagonal line */}
        <div className="absolute top-0 right-0 w-full h-96 bg-red-50 transform -skew-y-6 -translate-y-24"></div>

        {/* Bottom background pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gray-50"></div>

        {/* Subtle patterns */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="20" cy="20" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative py-16 px-4 sm:px-6 lg:px-8 z-10">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto mb-24">
          <div
            ref={titleRef}
            className={`relative text-center opacity-0 -translate-y-8 transform transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : ""
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 inline-block relative">
              ABOUT US
              <div
                className={`absolute -bottom-2 left-0 w-full h-1 bg-red-600 transform transition-transform duration-1000 delay-500 origin-left ${
                  isVisible ? "scale-x-100" : "scale-x-0"
                }`}
              ></div>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Bridging the gap between academic learning and professional
              experience
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto">
          {/* Vision Section - Card Design */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
            <div className="flex flex-col lg:flex-row">
              {/* Left Text Column */}
              <div
                ref={textRef}
                className={`lg:w-1/2 p-8 lg:p-12 opacity-0 -translate-x-12 transform transition-all duration-1000 ease-out delay-300 ${
                  isVisible ? "opacity-100 translate-x-0" : ""
                }`}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full mr-4 text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Our Vision
                </h2>
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    <span className="font-semibold text-red-600">
                      HU-Tech Train platform
                    </span>{" "}
                    is an innovative platform designed to connect university
                    students with external companies to provide practical
                    training opportunities.
                  </p>

                  <p className="text-lg leading-relaxed">
                    Through the website, students can register and select
                    suitable training programs offered by companies, with each
                    department supervised by its head to ensure the quality of
                    the training process.
                  </p>

                  <p className="text-lg leading-relaxed">
                    Students can send their resumes to the companies, which then
                    evaluate the applications and provide reports on the
                    trainees' performance at the end of the training period.
                  </p>

                  <p className="text-lg leading-relaxed">
                    This project contributes to enhancing students' skills and
                    helps companies find new talents, creating a fruitful
                    environment for all parties involved.
                  </p>
                </div>
              </div>

              {/* Right Image Column */}
              <div
                ref={imageRef}
                className={`lg:w-1/2 bg-red-50 relative opacity-0 translate-x-12 transform transition-all duration-1000 ease-out delay-500 ${
                  isVisible ? "opacity-100 translate-x-0" : ""
                }`}
              >
                <div className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent"></div>

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      Our Mission
                    </h3>
                    <p className="text-white/90">
                      Empowering students with real-world experience and
                      connecting companies with fresh talent
                    </p>
                  </div>

                  {/* Decorative elements */}
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              <span className="relative inline-block pb-4">
                Key Features
                <div
                  className="absolute bottom-0 left-0 right-0 mx-auto h-1 bg-red-600"
                  style={{ width: "120px", marginTop: "10px" }}
                ></div>
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ),
                  title: "Student-Centered",
                  description:
                    "Tailored experiences that prioritize student learning and development",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Industry Partnerships",
                  description:
                    "Strong connections with leading companies across various industries",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  title: "Quality Supervision",
                  description:
                    "Department heads ensure high standards and meaningful experiences",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  ),
                  title: "Performance Tracking",
                  description:
                    "Comprehensive reporting and feedback system for continuous improvement",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => (featureRefs.current[index] = el)}
                  className="bg-white rounded-xl shadow-md p-6 opacity-0 transform translate-y-8 transition-all duration-700 hover:shadow-lg hover:-translate-y-1"
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section with Premium Design */}

          {/* Before & After Section with Premium Design */}
          <div
            ref={beforeAfterRef}
            className="mb-20 opacity-0 translate-y-12 transform transition-all duration-1000 delay-1000"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              <span className="relative inline-block pb-4">
                Transformation Journey
                <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-red-600"></div>
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-red-600`}
                ></div>

                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <span className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <h3 className="text-2xl font-bold text-red-800">BEFORE</h3>
                  </div>

                  <ul className="space-y-4">
                    {[
                      "Manual processes for coordinating internship applications",
                      "Slow communication between students, companies, and department heads",
                      "Difficulty tracking applications and approvals",
                      "Lack of transparency about internship opportunities",
                      "Supervision required significant manual effort",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 mr-3 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-green-600`}
                ></div>

                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <span className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <h3 className="text-2xl font-bold text-green-800">NOW</h3>
                  </div>

                  <ul className="space-y-4">
                    {[
                      "Digitization of all processes, reducing paperwork and manual tasks",
                      "Direct communication channel between all parties enhancing speed and quality",
                      "Centralized database simplifying tracking and reporting",
                      "Clear visibility into internship opportunities and application procedures",
                      "Digital dashboards enabling efficient supervision with continuous updates",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-3 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) scale(1) !important;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
