import { useState } from "react";
import axios from "axios";

function AddNotification() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "Scheme",
    link: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitNotification = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.post(
        "http://localhost:5000/api/notifications/add",
        form
      );

      alert("Notification Added Successfully");

      setForm({
        title: "",
        message: "",
        type: "Scheme",
        link: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to add notification");
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
  };

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
          maxWidth: "820px",
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
            Notification Administration
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Add Notification
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: "14px",
              opacity: 0.82,
              lineHeight: 1.6,
            }}
          >
            Publish important information and updates for citizens.
          </p>
        </div>

        {/* Main Form */}
        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 6px 18px rgba(62, 68, 53, 0.07)",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              paddingBottom: "15px",
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
              Notification Details
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              Enter the information that should be shown to users.
            </p>
          </div>

          <form onSubmit={submitNotification}>
            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Notification Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter notification title"
                value={form.title}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Notification Message
              </label>

              <textarea
                name="message"
                placeholder="Enter the notification message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                required
              />
            </div>

            {/* Type */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Notification Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Scheme">Scheme</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Internship">Internship</option>
                <option value="Skill">Skill</option>
                <option value="Loan">Loan</option>
                <option value="Pension">Pension</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Women">Women</option>
                <option value="Jobs">Jobs</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Link */}
            <div style={{ marginBottom: "26px" }}>
              <label style={labelStyle}>
                Official Link
              </label>

              <input
                type="url"
                name="link"
                placeholder="https://official-government-website.gov.in"
                value={form.link}
                onChange={handleChange}
                style={inputStyle}
              />

              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "12px",
                  color: "#81785A",
                  lineHeight: 1.5,
                }}
              >
                Add the official website or application page if
                citizens need additional information.
              </p>
            </div>

            {/* Action Area */}
            <div
              style={{
                background: "#596B5A",
                borderRadius: "12px",
                padding: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#F7F1E3",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Ready to publish?
                </p>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#EBE1C6",
                    fontSize: "11px",
                  }}
                >
                  The notification will be sent to the platform.
                </p>
              </div>

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
                  minWidth: "170px",
                }}
              >
                {saving
                  ? "Publishing..."
                  : "Publish Notification"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#81785A",
            fontSize: "11px",
            letterSpacing: "0.3px",
          }}
        >
          SARVASETU · Notification Administration
        </div>
      </div>
    </div>
  );
}

export default AddNotification;