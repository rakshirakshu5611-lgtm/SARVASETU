
import { useState } from "react";
import API from "../api";
import { useLanguage } from "../i18n/LanguageContext";

function AddScheme() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
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
    minimumAge: 0,
    maximumAge: 100,

    // Official Source
    sourceName: "",
    sourceUrl: "",

    // Application
    applyLink: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,

        documents: formData.documents
          .split(",")
          .map((doc) => doc.trim())
          .filter(Boolean),
      };

      const token = localStorage.getItem("token");

      if (!token) {
        alert(t("adminLoginRequired"));
        return;
      }

      await API.post(
        "/schemes/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(t("schemeAddedSuccessfully"));

      setFormData({
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
        minimumAge: 0,
        maximumAge: 100,

        sourceName: "",
        sourceUrl: "",

        applyLink: "",
      });
    } catch (error) {
      console.log(
        "ADD SCHEME ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          t("failedToAddScheme")
      );
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    borderRadius: "11px",
    border: "1px solid #C8C1AA",
    background: "#F7F1E3",
    color: "#3E4435",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#596B5A",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  };

  const sectionStyle = {
    background: "#EBE1C6",
    border: "1px solid #C8C1AA",
    borderRadius: "16px",
    padding: "22px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        padding: "32px 20px 60px",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "#596B5A",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "24px",
            boxShadow:
              "0 12px 30px rgba(89, 107, 90, 0.16)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#DDE3D7",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            SARVASETU ADMIN
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              color: "#F7F1E3",
              fontSize: "34px",
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            {t("addGovernmentScheme")}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#E1E5DB",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            {t("createVerifiedPublicBenefitScheme")}
          </p>
        </div>

        {/* FORM */}

        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "22px",
            padding: "30px",
            boxShadow:
              "0 10px 28px rgba(89, 107, 90, 0.08)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* BASIC INFORMATION */}

            <div style={sectionStyle}>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("schemeInformation")}
              </p>

              <h2
                style={{
                  margin: "5px 0 20px",
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {t("basicInformation")}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    {t("schemeName")}
                  </label>

                  <input
                    type="text"
                    name="schemeName"
                    placeholder={t("enterSchemeName")}
                    value={formData.schemeName}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      {t("category")}
                    </label>

                    <input
                      type="text"
                      name="category"
                      placeholder={t("exampleEducation")}
                      value={formData.category}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      {t("department")}
                    </label>

                    <input
                      type="text"
                      name="department"
                      placeholder={t("exampleMinistryEducation")}
                      value={formData.department}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("description")}
                  </label>

                  <textarea
                    name="description"
                    placeholder={t("describeSchemePurpose")}
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("benefits")}
                  </label>

                  <textarea
                    name="benefits"
                    placeholder={t("explainSchemeBenefits")}
                    value={formData.benefits}
                    onChange={handleChange}
                    rows="3"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("eligibility")}
                  </label>

                  <textarea
                    name="eligibility"
                    placeholder={t("describeEligibilityRequirements")}
                    value={formData.eligibility}
                    onChange={handleChange}
                    rows="3"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* DOCUMENTS */}

            <div style={sectionStyle}>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("requiredDocuments")}
              </p>

              <h2
                style={{
                  margin: "5px 0 18px",
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {t("documentRequirements")}
              </h2>

              <label style={labelStyle}>
                {t("documents")}
              </label>

              <input
                type="text"
                name="documents"
                placeholder={t("documentsExample")}
                value={formData.documents}
                onChange={handleChange}
                style={inputStyle}
              />

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#81785A",
                  fontSize: "12px",
                }}
              >
                {t("documentsCommaInstruction")}
              </p>
            </div>

            {/* ELIGIBILITY CRITERIA */}

            <div style={sectionStyle}>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("eligibilityCriteria")}
              </p>

              <h2
                style={{
                  margin: "5px 0 20px",
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {t("applicantRequirements")}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    {t("state")}
                  </label>

                  <input
                    type="text"
                    name="state"
                    placeholder={t("exampleKarnatakaAll")}
                    value={formData.state}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("occupation")}
                  </label>

                  <input
                    type="text"
                    name="occupation"
                    placeholder={t("exampleStudentFarmerAll")}
                    value={formData.occupation}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("gender")}
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                  >
                    <option value="All">
                      {t("all")}
                    </option>

                    <option value="Male">
                      {t("male")}
                    </option>

                    <option value="Female">
                      {t("female")}
                    </option>
                  </select>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      {t("minimumAge")}
                    </label>

                    <input
                      type="number"
                      name="minimumAge"
                      placeholder={t("minimumAge")}
                      value={formData.minimumAge}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      {t("maximumAge")}
                    </label>

                    <input
                      type="number"
                      name="maximumAge"
                      placeholder={t("maximumAge")}
                      value={formData.maximumAge}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* OFFICIAL SOURCE */}

            <div style={sectionStyle}>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("verifiedSource")}
              </p>

              <h2
                style={{
                  margin: "5px 0 20px",
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {t("officialGovernmentSource")}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    {t("sourceName")}
                  </label>

                  <input
                    type="text"
                    name="sourceName"
                    placeholder={t("exampleMinistryAgriculture")}
                    value={formData.sourceName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("sourceUrl")}
                  </label>

                  <input
                    type="url"
                    name="sourceUrl"
                    placeholder="https://official-government-website.gov.in"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#81785A",
                      fontSize: "12px",
                    }}
                  >
                    {t("useOfficialGovernmentWebsite")}
                  </p>
                </div>
              </div>
            </div>

            {/* APPLICATION */}

            <div
              style={{
                background: "#E1E5DB",
                border: "1px solid #C3CCBA",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#596B5A",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("access")}
              </p>

              <h2
                style={{
                  margin: "5px 0 18px",
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {t("applicationLink")}
              </h2>

              <label style={labelStyle}>
                {t("officialApplicationLink")}
              </label>

              <input
                type="url"
                name="applyLink"
                placeholder={t("officialApplicationWebsiteUrl")}
                value={formData.applyLink}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  background: "#F7F1E3",
                }}
                required
              />

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#596B5A",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                {t("citizensUseApplicationLink")}
              </p>
            </div>

            {/* SUBMIT */}

            <div
              style={{
                borderTop: "1px solid #C8C1AA",
                paddingTop: "24px",
              }}
            >
              <button
                type="submit"
                style={{
                  width: "100%",
                  border: "1px solid #A87D86",
                  background: "#C496A1",
                  color: "#F7F1E3",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.2px",
                }}
              >
                {t("addGovernmentScheme")}
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER NOTE */}

        <div
          style={{
            marginTop: "18px",
            padding: "16px 20px",
            background: "#EBE1C6",
            border: "1px solid #C8C1AA",
            borderRadius: "14px",
            color: "#81785A",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          {t("schemeAccuracyNotice")}
        </div>
      </div>
    </div>
  );
}

export default AddScheme;
