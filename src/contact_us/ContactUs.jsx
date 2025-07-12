
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { FaRegClock, FaPhoneVolume, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    message: '',
    phone_number: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch('/api/company_leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      const data = await response.json();
      setStatus({ loading: false, success: true, error: '' });
      setFormData({
        name: '',
        email: '',
        company_name: '',
        message: '',
        phone_number: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message || 'Failed to submit form' });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      {/* Go Back Button */}
      <button 
        onClick={handleGoBack}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Go back"
      >
        <IoArrowBack className="mr-1" size={24} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className='flex flex-col items-center justify-center mb-12 text-center'>
        <p className='font-extrabold text-4xl mb-2'>
          Get in Touch
        </p>
        <p className='font-thin text-xl text-gray-600'>
          We'll get back to you ASAP.
        </p>
      </div>

      {/* Status Messages */}
      {status.loading && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center justify-center">
          <ImSpinner8 className="animate-spin text-blue-600 mr-2" size={24} />
          <span className="text-blue-800">Submitting your message...</span>
        </div>
      )}

      {status.success && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center">
          <FaCheckCircle className="text-green-600 mr-2" size={24} />
          <span className="text-green-800">
            Message sent successfully! We'll contact you soon.
          </span>
        </div>
      )}

      {status.error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center">
          <FaTimesCircle className="text-red-600 mr-2" size={24} />
          <span className="text-red-800">
            {status.error}. Please try again.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status.loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status.loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              disabled={status.loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={status.loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status.loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={status.loading}
            className={`px-6 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center min-w-40 ${
              status.loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status.loading ? (
              <>
                <ImSpinner8 className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
        <div className='flex items-start'> 
          <MdOutlineEmail className='text-blue-700 w-10 h-10 mr-2 flex-shrink-0' />
          <div>
            <p className='font-thin text-gray-600'>Contact us</p>
            <a href="mailto:malcomowilla@gmail.com" className="text-blue-600 hover:underline">
              malcomowilla@gmail.com
            </a>
          </div>
        </div>

        <div className='flex items-start'> 
          <FaRegClock className='text-blue-700 w-10 h-10 mr-2 flex-shrink-0' />
          <div>
            <p className='font-thin text-gray-600'>Business Hours</p>
            <p className='font-light'>Mon - Fri: 7:00am - 5:00pm</p>
            <p className='font-light'>Sat - Sun: 8:00am - 4:00pm</p>
          </div>
        </div>

        <div className='flex items-start'> 
          <FaPhoneVolume className='text-blue-700 w-10 h-10 mr-2 flex-shrink-0' />
          <div>
            <p className='font-thin text-gray-600'>Call us</p>
            <a href="tel:+254791568852" className="text-blue-600 hover:underline">
              +254 791 568 852
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;