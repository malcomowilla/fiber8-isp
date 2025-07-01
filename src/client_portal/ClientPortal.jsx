import React, { useState, useCallback, useEffect } from 'react';
import { FaChartLine, FaMoneyBill, FaUser, FaTicketAlt } from 'react-icons/fa';
import { SlLogout } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';




const ClientPortal = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();




    const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/customer-logout', {
        method: 'POST',
        credentials: 'include', // Important for cookie-based auth
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        navigate('/client-login');
      } else {
        console.error('Logout failed');

        // You might want to show an error message here
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'payments':
        return <Payments />;
      case 'profile':
        return <Profile />;
      case 'tickets':
        return <Tickets />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>


      {/* Sidebar */}
      <div className='w-64 bg-blue-800 text-white p-4'>
        <h1 className='text-2xl font-bold mb-6'>Customer Portal</h1>
        <nav>
          <ul>
            <li
              className={`mb-4 p-2 rounded hover:bg-blue-700 cursor-pointer ${activeSection === 'dashboard' ? 'bg-blue-700' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <FaChartLine className='inline mr-2' /> Dashboard
            </li>
            <li
              className={`mb-4 p-2 rounded hover:bg-blue-700 cursor-pointer ${activeSection === 'payments' ? 'bg-blue-700' : ''}`}
              onClick={() => setActiveSection('payments')}
            >
              <FaMoneyBill className='inline mr-2' /> Payments
            </li>
            <li
              className={`mb-4 p-2 rounded hover:bg-blue-700 cursor-pointer ${activeSection === 'profile' ? 'bg-blue-700' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <FaUser className='inline mr-2' /> Profile
            </li>
            <li
              className={`mb-4 p-2
                 rounded hover:bg-blue-700 cursor-pointer ${activeSection === 'tickets' ? 'bg-blue-700' : ''}`}
              onClick={() => setActiveSection('tickets')}
            >
              <FaTicketAlt className='inline mr-2' /> Tickets
            </li>


            <li 
              className='mb-4 p-2 rounded hover:bg-blue-700 cursor-pointer'
              onClick={handleLogout}
            >
              {isLoggingOut ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </span>
              ) : (
                <span className="flex items-center">
                  <SlLogout className='w-4 h-4 mr-2' /> Logout
                </span>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <header className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 capitalize'>{activeSection}</h2>
        </header>
        {renderSection()}
      </div>
    </div>
  );
};

// Placeholder Components for Each Section
const Dashboard = () => (
  <div>
    <h3 className='text-xl font-semibold mb-4'>Traffic Statistics</h3>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
      <div className='bg-white p-4 rounded-lg shadow'>
        <p className='text-gray-600'>Total Visits</p>
        <p className='text-2xl font-bold'>12,345</p>
      </div>
      <div className='bg-white p-4 rounded-lg shadow'>
        <p className='text-gray-600'>Unique Visitors</p>
        <p className='text-2xl font-bold'>8,765</p>
      </div>
      <div className='bg-white p-4 rounded-lg shadow'>
        <p className='text-gray-600'>Page Views</p>
        <p className='text-2xl font-bold'>23,456</p>
      </div>
      <div className='bg-white p-4 rounded-lg shadow'>
        <p className='text-gray-600'>Bounce Rate</p>
        <p className='text-2xl font-bold'>32%</p>
      </div>
    </div>
    <div className='bg-white p-4 rounded-lg shadow'>
      <h4 className='text-lg font-semibold mb-4'>Traffic Over Time</h4>
      {/* Placeholder for Chart */}
      <div className='h-64 bg-gray-200 rounded'></div>
    </div>
  </div>
);

const Payments = () => (
  <div>
    <h3 className='text-xl font-semibold mb-4'>Make a Payment</h3>
    <div className='bg-white p-6 rounded-lg shadow'>
      <form>
        <div className='mb-4'>
          <label className='block text-gray-700'>Phone Number</label>
          <input
            type='text'
            className='w-full p-2 border rounded-lg'
            placeholder='Enter M-Pesa phone number'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Amount</label>
          <input
            type='number'
            className='w-full p-2 border rounded-lg'
            placeholder='Enter amount'
          />
        </div>
        <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700'>
          Pay via M-Pesa
        </button>
      </form>
    </div>
  </div>
);

const Profile = () => (
  <div>
    <h3 className='text-xl font-semibold mb-4'>Profile Settings</h3>
    <div className='bg-white p-6 rounded-lg shadow'>
      <form>
        <div className='mb-4'>
          <label className='block text-gray-700'>Name</label>
          <input
            type='text'
            className='w-full p-2 border rounded-lg'
            defaultValue='John Doe'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Email</label>
          <input
            type='email'
            className='w-full p-2 border rounded-lg'
            defaultValue='john.doe@example.com'
          />
        </div>
        <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700'>
          Save Changes
        </button>
      </form>
    </div>
  </div>
);

const Tickets = () => (
  <div>
    <h3 className='text-xl font-semibold mb-4'>Support Tickets</h3>
    <div className='bg-white p-6 rounded-lg shadow'>
      <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4'>
        Create New Ticket
      </button>
      <div className='h-64 bg-gray-200 rounded'></div>

    </div>
  </div>
);


const LogoutButton = () => (

       <SlLogout className='w-5 h-5 inline-block align-middle'/>

);

export default ClientPortal;