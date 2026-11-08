import { useEffect, useState } from "react";
import axios from "axios";

function OpportunityHub() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/opportunities/all"
      );

      setOpportunities(res.data.opportunities || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };
  const saveOpportunity = async (opportunityId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to save an opportunity");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/opportunity-bookmarks/save",
      {
        opportunityId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("❤️ Opportunity Saved Successfully");

  } catch (error) {
    console.log(error);

    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Failed to save opportunity");
    }
  }
};

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesCategory =
      category === "All" || item.category === category;

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.organization.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">
          Loading Opportunities...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">

      {/* Header */}
      <div className="text-center mb-10 px-6">

        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          🌐 Opportunity Hub
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Discover scholarships, internships, jobs, skills,
          loans and other opportunities in one place.
        </p>

      </div>

      {/* Search + Filter */}
      <div className="max-w-6xl mx-auto px-6 mb-10">

        <div className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="🔍 Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-3 rounded-lg"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="All">All Categories</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Internship">Internship</option>
            <option value="Skill">Skill</option>
            <option value="Job">Job</option>
            <option value="Loan">Loan</option>
            <option value="Pension">Pension</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Women">Women</option>
            <option value="Startup">Startup</option>
            <option value="Other">Other</option>
          </select>

        </div>

      </div>

      {/* Count */}
      <h2 className="text-center text-blue-600 font-semibold mb-8">
        {filteredOpportunities.length} Opportunities Found
      </h2>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

        {filteredOpportunities.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
          >

            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {item.category}
            </span>

            <h2 className="text-2xl font-bold mt-4">
              {item.title}
            </h2>

            <p className="text-gray-600 mt-2">
              🏢 {item.organization}
            </p>

            <p className="text-gray-700 mt-4">
              {item.description}
            </p>

            <div className="mt-5 space-y-2 text-sm">

              <p>
                <strong>📍 State:</strong> {item.state}
              </p>

              <p>
                <strong>🎯 Eligibility:</strong>{" "}
                {item.eligibility}
              </p>

              <p>
                <strong>🎁 Benefits:</strong>{" "}
                {item.benefits || "Not specified"}
              </p>

              {item.deadline && (
                <p>
                  <strong>📅 Deadline:</strong>{" "}
                  {item.deadline}
                </p>
              )}

            </div>

            <a
              href={item.applyLink}
              target="_blank"
              rel="noreferrer"
            >
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                Apply / Learn More →
              </button>
            </a>
<button
  onClick={() => saveOpportunity(item._id)}
  className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
>
  ❤️ Save Opportunity
</button>
          </div>

        ))}

      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="text-center mt-16">

          <h2 className="text-2xl font-bold text-gray-600">
            No opportunities found 😔
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search or category.
          </p>

        </div>
      )}

    </div>
  );
}

export default OpportunityHub;