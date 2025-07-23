'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users", err));
  }, []);

  return (
    <div className="p-6 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <h1 className="text-2xl font-bold mb-6">Registered Students</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map(user => (
          <div
            key={user._id}
            className="p-5 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {user.email}</p>
              <p className="text-sm text-gray-600"><strong>College:</strong> {user.college}</p>
              <p className="text-sm text-gray-600"><strong>Phone:</strong> {user.phone}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Enrolled Events:</p>
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
