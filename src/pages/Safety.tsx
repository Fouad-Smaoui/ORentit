import React from 'react';
import { ShieldCheck, BadgeCheck, Flag, Headset } from 'lucide-react';

const Safety: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Safety Guidelines</h1>
        <p className="text-xl text-gray-500">Your safety is our top priority</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <div className="flex items-center mb-4">
            <ShieldCheck className="w-10 h-10 text-[#a100ff] mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">For Renters</h2>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Before Renting</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Verify the equipment's condition through photos and descriptions</li>
            <li>Read reviews of the equipment owner</li>
            <li>Check the equipment's maintenance history</li>
            <li>Review the rental terms and conditions</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">During Rental</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Inspect the equipment upon receipt</li>
            <li>Document any existing damage</li>
            <li>Use the equipment as intended</li>
            <li>Follow safety guidelines</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <div className="flex items-center mb-4">
            <BadgeCheck className="w-10 h-10 text-[#a100ff] mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">For Owners</h2>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Before Listing</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Ensure equipment is in good working condition</li>
            <li>Provide clear, accurate descriptions</li>
            <li>Take detailed photos</li>
            <li>Set clear rental terms</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">During Rental</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Document equipment condition before handover</li>
            <li>Provide usage instructions</li>
            <li>Maintain communication with renter</li>
            <li>Keep records of all transactions</li>
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-8">
        <div className="flex items-center mb-4">
          <Flag className="w-10 h-10 text-[#a100ff] mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Reporting Issues</h2>
        </div>
        <p className="text-gray-700 mb-2">If you encounter any safety concerns or issues:</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Report immediately through our platform</li>
          <li>Document the issue with photos if possible</li>
          <li>Contact our support team</li>
          <li>Follow emergency procedures if necessary</li>
        </ul>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-8">
        <div className="flex items-center mb-6">
          <Headset className="w-10 h-10 text-[#a100ff] mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Our Safety Measures</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification</h3>
            <p className="text-gray-700">
              We verify user identities and maintain secure payment processing to protect all parties.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance</h3>
            <p className="text-gray-700">
              We offer insurance options to protect against damage, theft, and liability.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-gray-700">
              Our support team is available 24/7 to assist with any safety concerns or issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Safety;
