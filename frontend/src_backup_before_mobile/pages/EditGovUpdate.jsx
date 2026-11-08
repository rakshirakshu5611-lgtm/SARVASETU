import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditGovUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Scheme",
    sourceName: "",
    sourceUrl: "",
    publishedDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH GOVERNMENT UPDATE
  // ==========================================

  useEffect(() => {
    fetchUpdate();
  }, [id]);

  const fetchUpdate = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/updates/${id}`
      );

      const update = res.data.update;

      console.log("EDIT UPDATE DATA:", update);

      setForm({
        title: update.title || "",
        description: update.description || "",
        category: update.category || "Scheme",
        sourceName: update.sourceName || "",
        sourceUrl: update.sourceUrl || "",
        publishedDate: update.publishedDate
          ? new Date(update.publishedDate)
              .toISOString()
              .split("T")[0]
          : "",
        isActive:
          update.isActive !== undefined
            ? update.isActive
            : true,
      });
    } catch (error) {
      console.log("FETCH UPDATE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load government update"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE ACTIVE STATUS
  // ==========================================

  const handleStatusChange = (e) => {
    setForm((previousForm) => ({
      ...previousForm,
      isActive: e.target.value === "true",
    }));
  };

  // ==========================================
  // SUBMIT UPDATE
  // ==========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin login required.");
        return;
      }

      const updateData = {
        title: form.title,
        description: form.description,
        category: form.category,
        sourceName: form.sourceName,
        sourceUrl: form.sourceUrl,
        publishedDate: form.publishedDate,
        isActive: form.isActive,
      };

      console.log(
        "UPDATING GOVERNMENT UPDATE:",
        updateData
      );

      const res = await axios.put(
        `http://localhost:5000/api/updates/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UPDATE RESPONSE:", res.data);

      alert(
        "Government update updated successfully!"
      );

      navigate("/admin/manage-updates");
    } catch (error) {
      console.log(
        "UPDATE GOVERNMENT UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update government update"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "18px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
              "0 8px 25px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              height: "4px",
              width: "100%",
              background: "#C8C1AA",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                background: "#919D85",
                animation:
                  "sarvasetuEditLoading 1.2s infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              color: "#596B5A",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            Loading Government Update
          </h2>

          <p
            style={{
              marginTop: "10px",
              color: "#81785A",
              fontSize: "14px",
            }}
          >
            Please wait while the update is loaded.
          </p>
        </div>

        <style>
          {`
            @keyframes sarvasetuEditLoading {
              0% {
                transform: translateX(-120%);
              }
              50% {
                transform: translateX(120%);
              }
              100% {
                transform: translateX(260%);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        padding: "24px",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={() =>
            navigate("/admin/manage-updates")
          }
          style={{
            border: "none",
            background: "transparent",
            color: "#596B5A",
            padding: "0",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Back to Government Updates
        </button>

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div
          style={{
            background: "#596B5A",
            color: "#F7F1E3",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "22px",
            boxShadow:
              "0 8px 25px rgba(62, 68, 53, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#EBE1C6",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                }}
              >
                SARVASETU ADMINISTRATION
              </p>

              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(28px, 4vw, 38px)",
                  fontWeight: "700",
                  lineHeight: "1.2",
                }}
              >
                Edit Government Update
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#E1E5DB",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  maxWidth: "600px",
                }}
              >
                Modify the announcement information and
                publication settings.
              </p>
            </div>

            <div
              style={{
                background: form.isActive
                  ? "#E1E5DB"
                  : "#E8E8E2",
                color: form.isActive
                  ? "#596B5A"
                  : "#6D7067",
                padding: "8px 13px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              {form.isActive
                ? "Active"
                : "Inactive"}
            </div>
          </div>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={submitHandler}
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow:
              "0 6px 20px rgba(62, 68, 53, 0.07)",
          }}
        >
          {/* ==========================================
              UPDATE INFORMATION
          ========================================== */}

          <div
            style={{
              padding: "28px",
              borderBottom: "1px solid #C8C1AA",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#596B5A",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Update Information
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              Update the information displayed to citizens.
            </p>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* TITLE */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Update Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter government update title"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter complete update details"
                  rows="7"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="Scheme">Scheme</option>
                  <option value="Scholarship">
                    Scholarship
                  </option>
                  <option value="Internship">
                    Internship
                  </option>
                  <option value="Job">Job</option>
                  <option value="Skill">Skill</option>
                  <option value="Loan">Loan</option>
                  <option value="Pension">Pension</option>
                  <option value="Agriculture">
                    Agriculture
                  </option>
                  <option value="Healthcare">
                    Healthcare
                  </option>
                  <option value="Women">Women</option>
                  <option value="Startup">Startup</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* ==========================================
              OFFICIAL SOURCE
          ========================================== */}

          <div
            style={{
              padding: "28px",
              borderBottom: "1px solid #C8C1AA",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#596B5A",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Official Source
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              Maintain the official government reference.
            </p>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* SOURCE NAME */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Source Name
                </label>

                <input
                  type="text"
                  name="sourceName"
                  value={form.sourceName}
                  onChange={handleChange}
                  placeholder="Example: Ministry of Education"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* SOURCE URL */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Official Government Website
                </label>

                <input
                  type="url"
                  name="sourceUrl"
                  value={form.sourceUrl}
                  onChange={handleChange}
                  placeholder="https://example.gov.in"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==========================================
              PUBLICATION SETTINGS
          ========================================== */}

          <div
            style={{
              padding: "28px",
              borderBottom: "1px solid #C8C1AA",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#596B5A",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Publication Settings
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              Control when and whether this update is visible
              to users.
            </p>

            <div
              style={{
                marginTop: "24px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {/* DATE */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Published Date
                </label>

                <input
                  type="date"
                  name="publishedDate"
                  value={form.publishedDate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* STATUS */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#3E4435",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Publication Status
                </label>

                <select
                  value={
                    form.isActive ? "true" : "false"
                  }
                  onChange={handleStatusChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #C8C1AA",
                    background: "#F7F1E3",
                    color: "#3E4435",
                    padding: "13px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="true">
                    Active — Visible to Users
                  </option>

                  <option value="false">
                    Inactive — Hidden from Users
                  </option>
                </select>
              </div>
            </div>

            {/* STATUS INFORMATION */}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "11px",
                border: "1px solid #C8C1AA",
                background: form.isActive
                  ? "#E1E5DB"
                  : "#E8E8E2",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: form.isActive
                    ? "#596B5A"
                    : "#6D7067",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {form.isActive
                  ? "Active update"
                  : "Inactive update"}
              </p>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#5F6456",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {form.isActive
                  ? "This government update can appear in the user-facing Government Updates section."
                  : "This government update will not appear in the latest active updates list."}
              </p>
            </div>
          </div>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div
            style={{
              background: "#EBE1C6",
              padding: "22px 28px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate("/admin/manage-updates")
              }
              disabled={saving}
              style={{
                background: "#F2EEE1",
                color: "#596B5A",
                border: "1px solid #C8C1AA",
                padding: "11px 20px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving
                  ? "#B8B8B0"
                  : "#C496A1",
                color: "#3E4435",
                border: "none",
                padding: "11px 22px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGovUpdate;