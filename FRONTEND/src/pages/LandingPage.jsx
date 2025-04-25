import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-[#2196f3] shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl text-white font-medium">HealthChain</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-white hover:text-blue-100 transition">Features</a>
            <a href="#how-it-works" className="text-white hover:text-blue-100 transition">How it Works</a>
            <a href="#security" className="text-white hover:text-blue-100 transition">Security</a>
          </nav>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-[#2196f3] px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                Secure Healthcare <span className="text-[#2196f3]">Reimagined</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                Access your medical records securely with blockchain technology and Aadhaar authentication. 
                Take control of your health data with unparalleled security and transparency.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/home')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#2196f3] text-white font-medium rounded-md shadow-lg hover:bg-[#1976d2] transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 font-medium rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 transition transform hover:-translate-y-1 hover:shadow-xl">
                  Learn More
                </button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Healthcare Blockchain" 
                    className="w-full h-full object-cover mix-blend-overlay opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="backdrop-blur-sm bg-white/30 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-white text-center">Blockchain-Secured Medical Records</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 opacity-10">
          <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-400" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-400" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Revolutionary Healthcare Features
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our blockchain technology brings cutting-edge security and accessibility to your medical records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2196f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Military-Grade Security",
                description: "Your health records are encrypted and protected by blockchain technology, ensuring they cannot be altered or accessed without authorization."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2196f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Aadhaar Authentication",
                description: "Secure login using Aadhaar ensures only you can access your records, with two-factor authentication for additional security."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2196f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Immutable Records",
                description: "Medical history that cannot be altered, ensuring a trustworthy record of your health information at all times."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2196f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Instant Access",
                description: "Get your medical records anytime, anywhere. Critical in emergencies when every second counts."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2196f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                ),
                title: "Controlled Sharing",
                description: "Share your records with healthcare providers temporarily with detailed permission controls."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2196f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                ),
                title: "Healthcare Provider Network",
                description: "Connect with a nationwide network of healthcare providers that support blockchain record sharing."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-8 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How HealthChain Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Secure, transparent, and easy to use. See how we're changing healthcare records management.
            </p>
          </div>

          <div className="relative">
            {/* Steps */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            <div className="space-y-16">
              {[
                {
                  number: "1",
                  title: "Authenticate with Aadhaar",
                  description: "Verify your identity securely using your Aadhaar number and OTP sent to your registered mobile number."
                },
                {
                  number: "2",
                  title: "Create Your Profile",
                  description: "Set up your health profile with basic information and preferences for record sharing."
                },
                {
                  number: "3",
                  title: "Upload Health Records",
                  description: "Add your existing health records, prescriptions, and medical history to your secure blockchain vault."
                },
                {
                  number: "4",
                  title: "Access Anywhere",
                  description: "View your records anytime from any device with secure authentication."
                }
              ].map((step, index) => (
                <div key={index} className="relative flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 h-14 w-14 rounded-full bg-[#2196f3] text-white text-xl font-bold shadow-lg z-10">
                    {step.number}
                  </div>
                  
                  <div className={`mt-4 md:mt-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Security That Matters
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              When it comes to your health data, security isn't just a feature—it's a necessity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
            {[
              {
                title: "Blockchain Technology",
                description: "Every record is cryptographically secured and distributed across multiple nodes, making it virtually impossible to compromise your data."
              },
              {
                title: "End-to-End Encryption",
                description: "Your data is encrypted from the moment it's created until you access it, ensuring privacy at every step."
              },
              {
                title: "Access Control",
                description: "Detailed logs of who accessed your records and when, with your explicit permission required for any sharing."
              },
              {
                title: "Regular Security Audits",
                description: "Our systems undergo regular third-party security audits to identify and address potential vulnerabilities."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl hover:bg-white/20 transition">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2196f3] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to secure your health records?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-blue-100">
                  Join thousands of users who have already taken control of their medical data with HealthChain.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="sm:flex">
                  <button 
                    onClick={() => navigate('/home')}
                    className="w-full px-6 py-3 bg-white text-[#2196f3] font-medium rounded-md shadow-md hover:bg-blue-50 sm:flex-shrink-0 sm:w-auto"
                  >
                    Get Started Now
                  </button>
                </div>
                <p className="mt-3 text-sm text-blue-100">
                  Secure, private, and always accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HealthChain</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Team</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Facebook</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Partners</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Hospitals</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Healthcare Providers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Insurance Companies</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Research Institutions</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2023 HealthChain. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {['facebook', 'twitter', 'instagram', 'github', 'youtube'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">{social}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 