export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">RoomEase</h1>
          <p className="text-gray-600 mt-2">
            Smart Room Recommendation System (Capstone MVP)
          </p>
        </div>

        {/* Event Form */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Event Details</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Event Type (Lecture, Workshop...)"
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Expected Attendance"
              className="border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="Preferred Building"
              className="border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="Time Window (Tue 2–4pm)"
              className="border rounded-lg p-2"
            />
          </div>

          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Recommend Rooms
          </button>
        </div>

        {/* Results Stub */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Recommended Rooms</h2>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between">
              <span className="font-medium">MC 2065</span>
              <span className="text-gray-500">Score: 92</span>
            </div>
            <p className="text-gray-600 text-sm">
              Capacity 150 • Projector • Accessible
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between">
              <span className="font-medium">DC 1350</span>
              <span className="text-gray-500">Score: 88</span>
            </div>
            <p className="text-gray-600 text-sm">
              Capacity 120 • Flexible layout
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}