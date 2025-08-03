'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users", err));
  }, []);

  return (
    <div className="md:p-6 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <h1 className="md:text-2xl text-xl font-bold md:mb-6 mb-2 text-center">Registered Students ({users.length})</h1>
      <input type='text' onChange={(e) => setSearch(e.target.value)} placeholder='Search by name' className='md:mb-6 mx-auto p-2 border border-[color:var(--border)] rounded-lg w-full m-1' />
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4">
        {users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())).map(user => (
          <div
            key={user._id}
            className="md:p-5 p-3 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900 text-center">{user.name}</h2>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {user.email}</p>
              <p className="text-sm text-gray-600"><strong>College:</strong> {user.college}</p>
              <p className="text-sm text-gray-600"><strong>Phone:</strong> {user.phone}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Enrolled Events: {user.enrolledEvents?.length}</p>
              <ul className="list-disc list-inside text-sm text-green-700 mt-1 space-y-1">
                {user.enrolledEvents?.length > 0 ? (
                  user.enrolledEvents.map((event, idx) => (
                    <li key={idx}>{event}</li>
                  ))
                ) : (
                  <li className="text-gray-500">None</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
