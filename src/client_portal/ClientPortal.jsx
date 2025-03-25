import React, { useState } from 'react';
import { FaChartLine, FaMoneyBill, FaUser, FaTicketAlt } from 'react-icons/fa';

const ClientPortal = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

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
              className={`mb-4 p-2 rounded hover:bg-blue-700 cursor-pointer ${activeSection === 'tickets' ? 'bg-blue-700' : ''}`}
              onClick={() => setActiveSection('tickets')}
            >
              <FaTicketAlt className='inline mr-2' /> Tickets
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

export default ClientPortal;