import React from 'react';
import { Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Create an Account',
    description: 'Sign up for free and set up your profile to start renting or listing items in minutes.',
  },
  {
    title: 'Search Naturally',
    description:
      'Skip the keyword guessing. Describe what you need — "something for a beach weekend" or "gear for a snowy hike" — and our semantic AI search understands the meaning behind your words to find the best matches.',
  },
  {
    title: 'Book & Pay',
    description: 'Select your dates, review the details, and complete the secure checkout.',
  },
  {
    title: 'Enjoy & Return',
    description: 'Use the item, then return it as agreed to wrap up the rental.',
  },
];

const tips = [
  {
    title: 'Read Reviews',
    description: 'Check ratings and reviews from other users to ensure quality and reliability.',
  },
  {
    title: 'Check Availability',
    description: 'Book early to secure your preferred dates and items.',
  },
  {
    title: 'Search Like You Would Ask a Friend',
    description: 'The more naturally you describe what you need, the better our AI can match you — try a full sentence instead of a single keyword.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">How It Works</h1>
        <p className="text-xl text-gray-500">From a simple description to your next rental</p>
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

      <div className="bg-white shadow-md rounded-lg p-8 mt-8 border border-primary-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles size={22} className="text-[#a100ff]" />
          Search That Understands You
        </h2>
        <p className="text-gray-700 mb-4">
          Most rental sites make you guess the right keyword. ORentit's search is powered by AI: it reads
          the meaning behind what you type, not just the words you used. Describe a mood, an activity, or
          a place — "something fun for a kid's birthday party" or "gear for camping in the rain" — and
          results are ranked by how well they actually fit your request.
        </p>
        <p className="text-gray-700">
          Behind the scenes, we blend AI meaning-matching with traditional keyword search, so you get the
          best of both: results that understand intent, and nothing relevant slips through just because it
          was phrased differently.
        </p>
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
