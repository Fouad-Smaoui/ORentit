import React from 'react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: "By accessing and using ORentit's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
  },
  {
    title: '2. User Accounts',
    body: 'To use certain features of our service, you must register for an account. You agree to provide accurate and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
  },
  {
    title: '3. Equipment Rental',
    body: 'Our platform facilitates the rental of equipment between users. As a renter, you agree to:',
    list: [
      'Use the equipment responsibly and in accordance with its intended purpose',
      'Return the equipment in the same condition as received',
      'Pay all applicable fees and charges',
      'Report any damage or issues immediately',
    ],
  },
  {
    title: '4. Equipment Listing',
    body: 'As an equipment owner, you agree to:',
    list: [
      'Provide accurate descriptions of your equipment',
      'Maintain equipment in good working condition',
      'Honor all confirmed bookings',
      'Comply with all applicable laws and regulations',
    ],
  },
  {
    title: '5. Payments and Fees',
    body: 'We charge service fees for facilitating rentals through our platform. All fees are clearly displayed before booking. Payment processing is handled securely through our payment partners. Refunds are subject to our refund policy and the terms of the specific rental agreement.',
  },
  {
    title: '6. Insurance and Liability',
    body: 'While we provide insurance options, users are encouraged to obtain appropriate insurance coverage. ORentit is not liable for any damages, injuries, or losses arising from the use of rented equipment. Users are responsible for their own safety and compliance with all applicable laws.',
  },
  {
    title: '7. Prohibited Activities',
    body: 'Users are prohibited from:',
    list: [
      'Violating any applicable laws or regulations',
      'Engaging in fraudulent activities',
      'Misrepresenting equipment or rental terms',
      'Interfering with the proper functioning of the platform',
    ],
  },
  {
    title: '8. Termination',
    body: 'We reserve the right to terminate or suspend access to our services for violations of these terms or for any other reason at our sole discretion. Users may terminate their account at any time by following the account deletion process.',
  },
  {
    title: '9. Changes to Terms',
    body: 'We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of the modified terms.',
  },
  {
    title: '10. Contact Information',
    body: 'For questions about these Terms of Service, please contact us at legal@orentit.com',
  },
];

const Terms: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-xl text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        {sections.map((section, index) => (
          <div key={section.title} className={index > 0 ? 'mt-8' : ''}>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-700 mb-2">{section.body}</p>
            {section.list && (
              <ul className="list-disc pl-8 text-gray-700 space-y-1">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
