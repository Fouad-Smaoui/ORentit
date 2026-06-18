import React from 'react';
import { Sparkles } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">About ORentit</h1>
        <p className="text-xl text-gray-500">Renting, reimagined with AI</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Most of what we own sits unused most of the time — a drone, a kayak, a power tool, a bike.
            ORentit's mission is to make renting those things from someone nearby easier than buying your
            own, by removing the two biggest sources of friction: finding the right item, and trusting the
            person on the other end.
          </p>
          <p className="text-gray-700">
            Instead of digging through filters and categories, you describe what you need in your own
            words and our AI finds it. We pair that with verified profiles and secure payments, so renting
            feels as simple — and as safe — as it should.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 mb-4">
            We're building toward a future where renting is the default first move, not the backup plan —
            where finding "something for a weekend at the beach" or "gear for a snowy hike" is as natural
            as describing it to a friend, and AI handles the matching.
          </p>
          <p className="text-gray-700">
            Every item rented instead of bought is one less thing manufactured, shipped, and eventually
            thrown away. We want ORentit to be the place people turn to first — for their community, and
            for a more sustainable way to get access to the things they need.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose ORentit?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-[#a100ff]" />
              AI-Powered Discovery
            </h3>
            <p className="text-gray-700">
              Describe what you need in plain language and our semantic search understands the meaning
              behind it — not just the keywords — to surface the items that actually fit.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust & Safety</h3>
            <p className="text-gray-700">
              Verified profiles and secure payment processing keep every booking safe for both renters
              and owners.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Focus</h3>
            <p className="text-gray-700">
              Every listing comes from someone in your community — real vehicles and gear, shared
              instead of sitting idle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
