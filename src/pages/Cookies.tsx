import React from 'react';

const sections = [
  {
    title: '1. What Are Cookies',
    body: 'Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us make your experience better by remembering your preferences and providing essential functionality.',
  },
  {
    title: '2. Types of Cookies We Use',
    body: 'We use different types of cookies for various purposes:',
    list: [
      'Essential Cookies: Required for basic website functionality and security',
      'Functional Cookies: Remember your preferences and settings',
      'Analytics Cookies: Help us understand how visitors use our website',
      'Marketing Cookies: Used to deliver relevant advertisements',
    ],
  },
  {
    title: '3. How We Use Cookies',
    body: 'We use cookies to:',
    list: [
      'Keep you signed in',
      'Remember your preferences',
      'Understand how you use our website',
      'Improve our services',
      'Provide personalized content',
      'Ensure security and prevent fraud',
    ],
  },
  {
    title: '4. Third-Party Cookies',
    body: 'Some cookies are placed by third-party services that appear on our pages. These include:',
    list: [
      'Analytics providers (e.g., Google Analytics)',
      'Payment processors',
      'Social media platforms',
      'Advertising networks',
    ],
  },
  {
    title: '5. Managing Cookies',
    body: 'You can control and manage cookies in various ways:',
    list: [
      'Browser settings: Most browsers allow you to view and delete cookies',
      'Cookie consent: We provide options to accept or decline non-essential cookies',
      'Third-party opt-outs: Many third-party services provide opt-out mechanisms',
    ],
  },
  {
    title: '6. Cookie Duration',
    body: 'Cookies can remain on your device for different periods:',
    list: [
      'Session cookies: Deleted when you close your browser',
      'Persistent cookies: Remain until they expire or are deleted',
    ],
  },
  {
    title: '7. Updates to This Policy',
    body: 'We may update this cookies policy from time to time. Any changes will be posted on this page with an updated revision date.',
  },
  {
    title: '8. Contact Us',
    body: 'If you have questions about our use of cookies, please contact us at privacy@orentit.com',
  },
];

const Cookies: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookies Policy</h1>
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

export default Cookies;
