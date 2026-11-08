import { useState } from "react";
import axios from "axios";
import { useLanguage } from "../i18n/LanguageContext";

function AddGovUpdate() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Scheme",
    sourceName: "",
    sourceUrl: "",
    publishedDate: "",
  });

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
        alert(t("adminLoginRequired"));
        return;
      }

      const res = await API.post(
        "/updates/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      alert(t("governmentUpdateAddedSuccessfully"));

      setForm({
        title: "",
        description: "",
        category: "Scheme",
        sourceName: "",
        sourceUrl: "",
        publishedDate: "",
      });
    } catch (error) {
      console.log("ADD UPDATE ERROR:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            t("failedToAddGovernmentUpdate")
        );
      } else {
        alert(t("cannotConnectToBackend"));
      }
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
          maxWidth: "850px",
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
            {t("addGovernmentUpdate")}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#E1E5DB",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            {t("publishVerifiedGovernmentInformation")}
          </p>
        </div>

        {/* FORM CONTAINER */}

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
          <div
            style={{
              borderBottom: "1px solid #C8C1AA",
              paddingBottom: "20px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#81785A",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              {t("updateInformation")}
            </p>

            <h2
              style={{
                margin: "6px 0 0",
                color: "#3E4435",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {t("governmentUpdateDetails")}
            </h2>
          </div>

          <form
            onSubmit={submitHandler}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            {/* TITLE */}

            <div>
              <label style={labelStyle}>
                {t("updateTitle")}
              </label>

              <input
                type="text"
                name="title"
                placeholder={t("enterUpdateTitle")}
                value={form.title}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label style={labelStyle}>
                {t("description")}
              </label>

              <textarea
                name="description"
                placeholder={t("enterDetailedUpdateDescription")}
                value={form.description}
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

            {/* CATEGORY */}

            <div>
              <label style={labelStyle}>
                {t("category")}
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                }}
              >
                <option value="Scheme">
                  {t("scheme")}
                </option>

                <option value="Scholarship">
                  {t("scholarship")}
                </option>

                <option value="Internship">
                  {t("internship")}
                </option>

                <option value="Job">
                  {t("job")}
                </option>

                <option value="Skill">
                  {t("skill")}
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

            {/* SOURCE SECTION */}

            <div
              style={{
                marginTop: "4px",
                padding: "22px",
                background: "#EBE1C6",
                border: "1px solid #C8C1AA",
                borderRadius: "16px",
              }}
            >
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
                {t("officialSource")}
              </p>

              <h3
                style={{
                  margin: "5px 0 18px",
                  color: "#3E4435",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {t("sourceInformation")}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    {t("officialSourceName")}
                  </label>

                  <input
                    type="text"
                    name="sourceName"
                    placeholder={t("exampleMinistryEducation")}
                    value={form.sourceName}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      background: "#F7F1E3",
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    {t("officialSourceUrl")}
                  </label>

                  <input
                    type="url"
                    name="sourceUrl"
                    placeholder="https://official-government-website.gov.in"
                    value={form.sourceUrl}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      background: "#F7F1E3",
                    }}
                    required
                  />

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#81785A",
                      fontSize: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {t("useOfficialGovernmentWebsite")}
                  </p>
                </div>
              </div>
            </div>

            {/* PUBLICATION SETTINGS */}

            <div>
              <label style={labelStyle}>
                {t("publishedDate")}
              </label>

              <input
                type="date"
                name="publishedDate"
                value={form.publishedDate}
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
                {t("selectPublicationDate")}
              </p>
            </div>

            {/* SUBMIT */}

            <div
              style={{
                borderTop: "1px solid #C8C1AA",
                paddingTop: "24px",
                marginTop: "2px",
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
                {t("addGovernmentUpdate")}
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER NOTE */}

        <div
          style={{
            marginTop: "18px",
            padding: "16px 20px",
            background: "#E1E5DB",
            border: "1px solid #C3CCBA",
            borderRadius: "14px",
            color: "#596B5A",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          {t("governmentUpdateAccuracyNotice")}
        </div>
      </div>
    </div>
  );
}

export default AddGovUpdate;
