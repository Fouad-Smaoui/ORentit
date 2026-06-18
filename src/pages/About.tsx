import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">About ORentit</h1>
        <p className="text-xl text-gray-500">Your Trusted Platform for Equipment Rental</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At ORentit, we're revolutionizing the way people access equipment. Our mission is to create a sustainable,
            community-driven platform that makes equipment rental accessible, affordable, and convenient for everyone.
          </p>
          <p className="text-gray-700">
            We believe in the power of sharing economy and sustainable consumption. By enabling people to rent rather
            than buy, we're helping reduce waste and promote more efficient use of resources.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 mb-4">
            We envision a world where access to equipment is as simple as a few clicks, where communities can share
            resources efficiently, and where sustainability is at the core of consumption.
          </p>
          <p className="text-gray-700">
            Through our platform, we're building a community of responsible renters and owners who understand the
            value of shared resources and sustainable practices.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose ORentit?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust & Safety</h3>
            <p className="text-gray-700">
              Our platform implements robust verification systems and secure payment processing to ensure
              safe transactions for all users.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
            <p className="text-gray-700">
              We maintain high standards for listed equipment and provide comprehensive insurance options
              for peace of mind.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Focus</h3>
            <p className="text-gray-700">
              We foster a community of responsible users who value quality service and sustainable practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
