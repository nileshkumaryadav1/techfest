export default function DashboardPage() {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg text-center p-6">
        <h2 className="md:text-2xl font-semibold md:mb-4 p-2">
          Welcome to Your Dashboard
        </h2>
        {/* {user ? (
          <>
            <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-red-500">Error loading user details.</p>
        )} */}
        <>
          <p className="text-gray-700">
            <strong>Name:</strong>
            {/* {user.name} */}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong>
            {/* {user.email} */}
          </p>
          <button
            // onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      </div>
    </div>
  );
}
