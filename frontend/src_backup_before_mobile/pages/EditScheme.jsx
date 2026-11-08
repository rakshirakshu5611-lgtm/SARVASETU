import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditScheme() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    schemeName: "",
    category: "",
    department: "",
    description: "",
    benefits: "",
    eligibility: "",
    documents: "",
    state: "All",
    occupation: "All",
    gender: "All",
    minIncome: 0,
    maxIncome: 1000000,
    applyLink: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/schemes/${id}`
        );

        const scheme = res.data.scheme;

        setForm({
          schemeName: scheme.schemeName || "",
          category: scheme.category || "",
          department: scheme.department || "",
          description: scheme.description || "",
          benefits: scheme.benefits || "",
          eligibility: scheme.eligibility || "",
          documents: scheme.documents || "",
          state: scheme.state || "All",
          occupation: scheme.occupation || "All",
          gender: scheme.gender || "All",
          minIncome: scheme.minIncome || 0,
          maxIncome: scheme.maxIncome || 1000000,
          applyLink: scheme.applyLink || "",
        });
      } catch (error) {
        console.log("FETCH SCHEME ERROR:", error);
        alert("Failed to load scheme");
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateScheme = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/schemes/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Scheme updated successfully!");

      navigate("/admin");
    } catch (error) {
      console.log("UPDATE SCHEME ERROR:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Failed to update scheme"
        );
      } else {
        alert("Cannot connect to backend");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #C8C1AA",
    borderRadius: "10px",
    background: "#F7F1E3",
    color: "#3E4435",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#596B5A",
    letterSpacing: "0.2px",
  };

  const sectionStyle = {
    background: "#F2EEE1",
    border: "1px solid #C8C1AA",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            textAlign: "center",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "14px",
            padding: "30px",
          }}
        >
          <div
            style={{
              height: "4px",
              width: "100%",
              background: "#C8C1AA",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "45%",
                background: "#596B5A",
                borderRadius: "4px",
                animation: "loadingBar 1.2s infinite ease-in-out",
              }}
            />
          </div>

          <p
            style={{
              margin: 0,
              color: "#596B5A",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Loading scheme details
          </p>
        </div>

        <style>
          {`
            @keyframes loadingBar {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(250%);
              }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        padding: "32px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#596B5A",
            borderRadius: "16px",
            padding: "28px 30px",
            marginBottom: "24px",
            color: "#F7F1E3",
            boxShadow: "0 8px 24px rgba(62, 68, 53, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  opacity: 0.75,
                }}
              >
                Scheme Administration
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                }}
              >
                Edit Government Scheme
              </h1>

              <p
                style={{
                  margin: "9px 0 0",
                  fontSize: "14px",
                  opacity: 0.82,
                  lineHeight: 1.6,
                }}
              >
                Update scheme information, eligibility criteria and
                application details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              style={{
                background: "#EBE1C6",
                color: "#596B5A",
                border: "none",
                borderRadius: "9px",
                padding: "11px 18px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Back to Admin
            </button>
          </div>
        </div>

        <form onSubmit={updateScheme}>
          {/* Scheme Information */}
          <section style={sectionStyle}>
            <div
              style={{
                marginBottom: "22px",
                paddingBottom: "14px",
                borderBottom: "1px solid #C8C1AA",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Scheme Information
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#81785A",
                  fontSize: "13px",
                }}
              >
                Basic information about the government scheme.
              </p>
            </div>

            <div style={{ display: "grid", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Scheme Name</label>

                <input
                  type="text"
                  name="schemeName"
                  value={form.schemeName}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>Category</label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Education">Education</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Women">Women</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Department</label>

                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter department"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Benefits</label>

                <textarea
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  rows="4"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                  placeholder="Describe the benefits provided by this scheme"
                />
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section style={sectionStyle}>
            <div
              style={{
                marginBottom: "22px",
                paddingBottom: "14px",
                borderBottom: "1px solid #C8C1AA",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Eligibility Criteria
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#81785A",
                  fontSize: "13px",
                }}
              >
                Define who can access this government scheme.
              </p>
            </div>

            <div style={{ display: "grid", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Eligibility Description</label>

                <textarea
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  rows="4"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>State</label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Occupation</label>

                  <input
                    type="text"
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Gender</label>

                  <input
                    type="text"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Minimum Income
                  </label>

                  <input
                    type="number"
                    name="minIncome"
                    value={form.minIncome}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Maximum Income
                  </label>

                  <input
                    type="number"
                    name="maxIncome"
                    value={form.maxIncome}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section style={sectionStyle}>
            <div
              style={{
                marginBottom: "22px",
                paddingBottom: "14px",
                borderBottom: "1px solid #C8C1AA",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Required Documents
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#81785A",
                  fontSize: "13px",
                }}
              >
                List the documents citizens need to apply.
              </p>
            </div>

            <input
              type="text"
              name="documents"
              value={form.documents}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Example: Aadhaar Card, Income Certificate, Marks Card"
            />

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "12px",
                color: "#81785A",
              }}
            >
              Separate multiple documents using commas.
            </p>
          </section>

          {/* Application */}
          <section style={sectionStyle}>
            <div
              style={{
                marginBottom: "22px",
                paddingBottom: "14px",
                borderBottom: "1px solid #C8C1AA",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Application Access
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#81785A",
                  fontSize: "13px",
                }}
              >
                Provide the official government application link.
              </p>
            </div>

            <div>
              <label style={labelStyle}>
                Official Apply Link
              </label>

              <input
                type="url"
                name="applyLink"
                value={form.applyLink}
                onChange={handleChange}
                style={inputStyle}
                placeholder="https://official-government-website.gov.in"
              />
            </div>
          </section>

          {/* Actions */}
          <div
            style={{
              background: "#596B5A",
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              boxShadow: "0 8px 20px rgba(62, 68, 53, 0.10)",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#F7F1E3",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Review the information before saving changes.
              </p>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#EBE1C6",
                  fontSize: "12px",
                }}
              >
                Updated information will be available to citizens.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/admin")}
                style={{
                  background: "#EBE1C6",
                  color: "#596B5A",
                  border: "none",
                  borderRadius: "9px",
                  padding: "12px 22px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  background: saving ? "#AFA39A" : "#C496A1",
                  color: "#3E4435",
                  border: "none",
                  borderRadius: "9px",
                  padding: "12px 24px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer",
                  minWidth: "140px",
                }}
              >
                {saving ? "Updating..." : "Update Scheme"}
              </button>
            </div>
          </div>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#81785A",
            fontSize: "11px",
            letterSpacing: "0.3px",
          }}
        >
          SARVASETU · Secure Scheme Administration
        </div>
      </div>
    </div>
  );
}

export default EditScheme;