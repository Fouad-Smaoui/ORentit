import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmation('Thank you for your message. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-xl text-gray-500">We're here to help and answer any questions you might have</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

          {confirmation && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {confirmation}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a100ff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a100ff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a100ff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a100ff]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#a100ff] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 h-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-[#a100ff] mr-3" />
              <span className="text-gray-700">support@orentit.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-[#a100ff] mr-3" />
              <span className="text-gray-700">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-[#a100ff] mr-3 mt-1" />
              <span className="text-gray-700">
                123 Rental Street
                <br />
                Equipment City, EC 12345
                <br />
                United States
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
          <p className="text-gray-700">
            Monday - Friday: 9:00 AM - 6:00 PM
            <br />
            Saturday: 10:00 AM - 4:00 PM
            <br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
