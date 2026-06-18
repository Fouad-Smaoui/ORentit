import React from 'react';

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information that you provide directly to us, including:',
    list: [
      'Account information (name, email, phone number)',
      'Payment information',
      'Equipment listings and rental history',
      'Communications with other users',
      'Profile information and preferences',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the collected information to:',
    list: [
      'Provide and maintain our services',
      'Process transactions and manage your account',
      'Communicate with you about our services',
      'Improve and personalize your experience',
      'Ensure platform security and prevent fraud',
    ],
  },
  {
    title: '3. Information Sharing',
    body: 'We may share your information with:',
    list: [
      'Other users (as necessary for the rental process)',
      'Service providers and business partners',
      'Legal authorities when required by law',
    ],
  },
  {
    title: '4. Data Security',
    body: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to:',
    list: [
      'Access your personal information',
      'Correct inaccurate data',
      'Request deletion of your data',
      'Opt-out of marketing communications',
      'Export your data',
    ],
  },
  {
    title: '6. Cookies and Tracking',
    body: 'We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.',
  },
  {
    title: "7. Children's Privacy",
    body: 'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
  },
  {
    title: '8. International Data Transfers',
    body: 'Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.',
  },
  {
    title: '9. Changes to Privacy Policy',
    body: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.',
  },
  {
    title: '10. Contact Us',
    body: 'If you have questions about this Privacy Policy, please contact us at privacy@orentit.com',
  },
];

const Privacy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
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

export default Privacy;
