import React from 'react';

const steps = [
  {
    title: 'Create an Account',
    description: 'Sign up for free and complete your profile to start renting or listing equipment.',
  },
  {
    title: 'Browse Equipment',
    description: 'Search through our extensive catalog of equipment or list your own items for rent.',
  },
  {
    title: 'Book & Pay',
    description: 'Select your desired dates, review the terms, and complete the secure payment process.',
  },
  {
    title: 'Enjoy & Return',
    description: 'Use the equipment and return it in the same condition to complete your rental.',
  },
];

const tips = [
  {
    title: 'Read Reviews',
    description: 'Check ratings and reviews from other users to ensure quality and reliability.',
  },
  {
    title: 'Check Availability',
    description: 'Book early to secure your preferred dates and equipment.',
  },
  {
    title: 'Insurance Options',
    description: 'Consider our insurance options for added peace of mind during your rental.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">How It Works</h1>
        <p className="text-xl text-gray-500">Simple steps to start renting equipment</p>
      </div>

      <div className="flex items-center justify-between mb-12 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center flex-1 min-w-[120px]">
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-[#a100ff] text-white flex items-center justify-center font-semibold mb-2">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-gray-700">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2 hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <div key={step.title} className="bg-white shadow-md rounded-lg p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for a Great Experience</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div key={tip.title}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-gray-700">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
