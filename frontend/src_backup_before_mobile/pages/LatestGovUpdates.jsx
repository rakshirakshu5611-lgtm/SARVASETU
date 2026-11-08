import { useEffect, useState } from "react";
import axios from "axios";

function LatestGovUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingSeen, setMarkingSeen] = useState(null);

  // Fetch latest government updates
  const fetchUpdates = async () => {
    try {
      console.log("Fetching latest government updates...");

      const res = await axios.get(
        "http://localhost:5000/api/updates/latest"
      );

      console.log("Government Updates:", res.data);

      setUpdates(res.data.updates || []);
    } catch (error) {
      console.log("FETCH UPDATES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark update as seen
  const markAsSeen = async (updateId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No login token found");
        return;
      }

      setMarkingSeen(updateId);

      const res = await axios.put(
        `http://localhost:5000/api/user-updates/seen/${updateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MARK SEEN RESPONSE:", res.data);

      // Remove this update from the current list
      setUpdates((previousUpdates) =>
        previousUpdates.filter(
          (update) => update._id !== updateId
        )
      );

    } catch (error) {
      console.log("MARK UPDATE SEEN ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);
      }
    } finally {
      setMarkingSeen(null);
    }
  };

  useEffect(() => {
    fetchUpdates();

    const interval = setInterval(() => {
      fetchUpdates();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-blue-700">
            🔔 Latest Government Updates
          </h1>

          <p className="text-gray-600 mt-2">
            Stay updated with the latest government announcements,
            schemes and opportunities.
          </p>

        </div>


        {/* Loading */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow">
            Loading latest updates...
          </div>
        )}


        {/* No updates */}
        {!loading && updates.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow text-center">

            <h2 className="text-xl font-semibold">
              No new government updates
            </h2>

            <p className="text-gray-500 mt-2">
              We will show new updates here when they are available.
            </p>

          </div>
        )}


        {/* Updates */}
        {!loading && updates.length > 0 && (
          <div className="space-y-6">

            {updates.map((update) => (

              <div
                key={update._id}
                className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600"
              >

                {/* Header */}
                <div className="flex justify-between items-start gap-4">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                      {update.title}
                    </h2>

                    {update.category && (
                      <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {update.category}
                      </span>
                    )}

                  </div>

                  <span className="text-sm text-gray-500">

                    {update.publishedDate
                      ? new Date(
                          update.publishedDate
                        ).toLocaleDateString()
                      : ""}

                  </span>

                </div>


                {/* Description */}
                <p className="text-gray-700 mt-4">
                  {update.description}
                </p>


                {/* Source */}
                {update.sourceName && (
                  <p className="text-sm text-gray-500 mt-4">
                    Source: {update.sourceName}
                  </p>
                )}


                {/* Buttons */}
                <div className="flex gap-3 mt-5 flex-wrap">

                  {/* Official Source */}
                  {update.sourceUrl && (
                    <a
                      href={update.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markAsSeen(update._id)}
                      className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View Official Source
                    </a>
                  )}


                  {/* Mark Seen */}
                  <button
                    onClick={() => markAsSeen(update._id)}
                    disabled={markingSeen === update._id}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {markingSeen === update._id
                      ? "Marking..."
                      : "✓ Mark as Read"}
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default LatestGovUpdates;