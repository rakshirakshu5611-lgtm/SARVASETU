
import { useState } from "react";
import API from "../api";
import { useLanguage } from "../i18n/LanguageContext";

function AddOpportunity() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Scholarship",
    organization: "",
    state: "All",
    eligibility: "",
    benefits: "",
    deadline: "",
    applyLink: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert(t("pleaseLoginFirst"));
        return;
      }

      setSaving(true);

      const res = await API.post(
        "/opportunities/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Opportunity Response:", res.data);

      alert(t("opportunityAddedSuccessfully"));

      setForm({
        title: "",
        description: "",
        category: "Scholarship",
        organization: "",
        state: "All",
        eligibility: "",
        benefits: "",
        deadline: "",
        applyLink: "",
      });
    } catch (error) {
      console.log("ADD OPPORTUNITY ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);

        alert(
          error.response.data.message ||
            t("failedToAddOpportunity")
        );
      } else {
        console.log("Network Error:", error.message);

        alert(t("cannotConnectToBackend"));
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
          maxWidth: "900px",
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
            {t("opportunityAdministration")}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            {t("addOpportunity")}
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: "14px",
              opacity: 0.82,
              lineHeight: 1.6,
            }}
          >
            {t("addPublicOpportunities")}
          </p>
        </div>

        {/* Form */}
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
              {t("opportunityInformation")}
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              {t("enterOpportunityDetails")}
            </p>
          </div>

          <form onSubmit={submitHandler}>
            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("opportunityTitle")}
              </label>

              <input
                type="text"
                name="title"
                placeholder={t("enterOpportunityTitle")}
                value={form.title}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("description")}
              </label>

              <textarea
                name="description"
                placeholder={t("describeOpportunity")}
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

            {/* Category + Organization */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  {t("category")}
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Scholarship">
                    {t("scholarship")}
                  </option>

                  <option value="Internship">
                    {t("internship")}
                  </option>

                  <option value="Skill">
                    {t("skill")}
                  </option>

                  <option value="Job">
                    {t("job")}
                  </option>

                  <option value="Loan">
                    {t("loan")}
                  </option>

                  <option value="Pension">
                    {t("pension")}
                  </option>

                  <option value="Agriculture">
                    {t("agriculture")}
                  </option>

                  <option value="Healthcare">
                    {t("healthcare")}
                  </option>

                  <option value="Women">
                    {t("women")}
                  </option>

                  <option value="Startup">
                    {t("startup")}
                  </option>

                  <option value="Other">
                    {t("other")}
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  {t("organization")}
                </label>

                <input
                  type="text"
                  name="organization"
                  placeholder={t("organizationName")}
                  value={form.organization}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* State */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("state")}
              </label>

              <input
                type="text"
                name="state"
                placeholder={t("stateOrAll")}
                value={form.state}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Eligibility */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("eligibility")}
              </label>

              <textarea
                name="eligibility"
                placeholder={t("enterEligibilityRequirements")}
                value={form.eligibility}
                onChange={handleChange}
                rows="3"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Benefits */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("benefits")}
              </label>

              <textarea
                name="benefits"
                placeholder={t("describeBenefits")}
                value={form.benefits}
                onChange={handleChange}
                rows="3"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Deadline */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("deadline")}
              </label>

              <input
                type="text"
                name="deadline"
                placeholder={t("deadlineExample")}
                value={form.deadline}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Apply Link */}
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>
                {t("officialApplyLink")}
              </label>

              <input
                type="url"
                name="applyLink"
                placeholder="https://official-website.gov.in"
                value={form.applyLink}
                onChange={handleChange}
                style={inputStyle}
              />

              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "12px",
                  color: "#81785A",
                }}
              >
                {t("officialApplicationWebsite")}
              </p>
            </div>

            {/* Submit Area */}
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
                  {t("readyToPublish")}
                </p>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#EBE1C6",
                    fontSize: "11px",
                  }}
                >
                  {t("opportunityWillBeAdded")}
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
                  padding: "12px 26px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer",
                  minWidth: "165px",
                }}
              >
                {saving
                  ? t("adding")
                  : t("addOpportunity")}
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
          {t("sarvasetuOpportunityAdministration")}
        </div>
      </div>
    </div>
  );
}

export default AddOpportunity;
