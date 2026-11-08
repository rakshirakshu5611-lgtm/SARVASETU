
import { useState } from "react";
import API from "../api";
import { useLanguage } from "../i18n/LanguageContext";

function AddNotification() {
  const { t } = useLanguage();

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

      await API.post("/notifications/add", form);

      alert(t("notificationAddedSuccessfully"));

      setForm({
        title: "",
        message: "",
        type: "Scheme",
        link: "",
      });
    } catch (error) {
      console.log(error);
      alert(t("failedToAddNotification"));
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
            {t("notificationAdministration")}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            {t("addNotification")}
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: "14px",
              opacity: 0.82,
              lineHeight: 1.6,
            }}
          >
            {t("publishImportantInformationUpdates")}
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
              {t("notificationDetails")}
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              {t("enterInformationShownToUsers")}
            </p>
          </div>

          <form onSubmit={submitNotification}>
            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("notificationTitle")}
              </label>

              <input
                type="text"
                name="title"
                placeholder={t("enterNotificationTitle")}
                value={form.title}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t("notificationMessage")}
              </label>

              <textarea
                name="message"
                placeholder={t("enterNotificationMessage")}
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
                {t("notificationType")}
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Scheme">{t("scheme")}</option>
                <option value="Scholarship">{t("scholarship")}</option>
                <option value="Internship">{t("internship")}</option>
                <option value="Skill">{t("skill")}</option>
                <option value="Loan">{t("loan")}</option>
                <option value="Pension">{t("pension")}</option>
                <option value="Healthcare">{t("healthcare")}</option>
                <option value="Agriculture">{t("agriculture")}</option>
                <option value="Women">{t("women")}</option>
                <option value="Jobs">{t("jobs")}</option>
                <option value="Other">{t("other")}</option>
              </select>
            </div>

            {/* Link */}
            <div style={{ marginBottom: "26px" }}>
              <label style={labelStyle}>
                {t("officialLink")}
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
                {t("officialLinkDescription")}
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
                  {t("readyToPublish")}
                </p>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#EBE1C6",
                    fontSize: "11px",
                  }}
                >
                  {t("notificationWillBeSent")}
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
                  ? t("publishing")
                  : t("publishNotification")}
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
          {t("sarvasetuNotificationAdministration")}
        </div>
      </div>
    </div>
  );
}

export default AddNotification;
