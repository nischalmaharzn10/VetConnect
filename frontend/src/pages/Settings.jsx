import React from 'react';
import Sidebar from '../components/Sidebar';

const Settings = () => {
return (
  <div className="min-h-screen bg-gray-100 flex">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
              placeholder="********"
            />
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default Settings;
