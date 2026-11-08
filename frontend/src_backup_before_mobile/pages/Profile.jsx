import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../i18n/LanguageContext";
import { useToast } from "../components/ToastContext";

function Profile() {
  const { t } = useLanguage();
    const { showToast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    state: "",
    district: "",
    occupation: "",
    annualIncome: "",
    collegeName: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE RESPONSE:", res.data);

      if (res.data.profile) {
        setProfile({
          name: res.data.profile.name || "",
          age: res.data.profile.age || "",
          gender: res.data.profile.gender || "",
          state: res.data.profile.state || "",
          district: res.data.profile.district || "",
          occupation: res.data.profile.occupation || "",
          annualIncome:
            res.data.profile.annualIncome || "",
          collegeName:
            res.data.profile.collegeName || "",
        });
      }
    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);

      setError(
        err.response?.data?.message ||
          t("unableToLoadProfile")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!profile.name.trim()) {
      setError(t("pleaseEnterName"));
      return;
    }

    if (!profile.age) {
      setError(t("pleaseEnterAge"));
      return;
    }

    if (
      Number(profile.age) < 1 ||
      Number(profile.age) > 120
    ) {
      setError(t("pleaseEnterValidAge"));
      return;
    }

    if (!profile.gender) {
      setError(t("pleaseSelectGender"));
      return;
    }

    if (!profile.state.trim()) {
      setError(t("pleaseEnterState"));
      return;
    }

    if (!profile.occupation) {
      setError(t("pleaseSelectOccupation"));
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        return;
      }

      const res = await axios.put(
        "http://localhost:5000/api/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PROFILE SAVE RESPONSE:",
        res.data
      );

     setMessage(t("profileUpdatedSuccessfully"));
showToast("Your profile has been updated successfully.", "success");
    } catch (err) {
      console.error(
        "PROFILE SAVE ERROR:",
        err
      );

      showToast(
  err.response?.data?.message ||
    t("unableToSaveProfile"),
  "error"
);

      setError(
        err.response?.data?.message ||
          t("unableToSaveProfile")
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          color: "#3E4435",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "3px",
              background: "#C496A1",
              margin: "0 auto 25px",
            }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            {t("loadingYourProfile")}
          </h2>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        padding: "50px 25px 70px",
        fontFamily: "Arial, sans-serif",
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
            marginBottom: "30px",
            paddingBottom: "25px",
            borderBottom: "1px solid #C8C1AA",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: "#81785A",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Personal Information
          </p>

          <h1
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "38px",
              fontWeight: "600",
              letterSpacing: "-0.5px",
            }}
          >
            {t("myProfile")}
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "#6E7066",
              fontSize: "15px",
              lineHeight: "1.7",
              maxWidth: "680px",
            }}
          >
            {t("profileRecommendationDescription")}
          </p>
        </div>

        {/* PROFILE FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          {/* SUCCESS MESSAGE */}

          {message && (
            <div
              style={{
                background: "#E5ECE2",
                border: "1px solid #AAB7A1",
                color: "#4F624F",
                padding: "13px 15px",
                borderRadius: "8px",
                marginBottom: "25px",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}

          {error && (
            <div
              style={{
                background: "#F1E0E2",
                border: "1px solid #C496A1",
                color: "#76545B",
                padding: "13px 15px",
                borderRadius: "8px",
                marginBottom: "25px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* PERSONAL INFORMATION */}

          <div
            style={{
              marginBottom: "28px",
              paddingBottom: "18px",
              borderBottom: "1px solid #D5CEB9",
            }}
          >
            <h2
              style={{
                margin: "0 0 7px",
                color: "#3E4435",
                fontSize: "22px",
                fontWeight: "600",
              }}
            >
              {t("personalInformation")}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#81785A",
                fontSize: "13px",
              }}
            >
              Keep your information accurate to improve
              personalized scheme recommendations.
            </p>
          </div>

          {/* FORM GRID */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "22px",
            }}
          >
            {/* NAME */}

            <div>
              <label style={labelStyle}>
                {t("fullName")} *
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder={t("enterFullName")}
                style={inputStyle}
              />
            </div>

            {/* AGE */}

            <div>
              <label style={labelStyle}>
                {t("age")} *
              </label>

              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                placeholder={t("enterAge")}
                min="1"
                max="120"
                style={inputStyle}
              />
            </div>

            {/* GENDER */}

            <div>
              <label style={labelStyle}>
                {t("gender")} *
              </label>

              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  {t("selectGender")}
                </option>

                <option value="Male">
                  {t("male")}
                </option>

                <option value="Female">
                  {t("female")}
                </option>

                <option value="Other">
                  {t("other")}
                </option>
              </select>
            </div>

            {/* STATE */}

            <div>
              <label style={labelStyle}>
                {t("state")} *
              </label>

              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
                placeholder={t("enterState")}
                style={inputStyle}
              />
            </div>

            {/* DISTRICT */}

            <div>
              <label style={labelStyle}>
                {t("district")}
              </label>

              <input
                type="text"
                name="district"
                value={profile.district}
                onChange={handleChange}
                placeholder={t("enterDistrict")}
                style={inputStyle}
              />
            </div>

            {/* OCCUPATION */}

            <div>
              <label style={labelStyle}>
                {t("occupation")} *
              </label>

              <select
                name="occupation"
                value={profile.occupation}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  {t("selectOccupation")}
                </option>

                <option value="Student">
                  {t("student")}
                </option>

                <option value="Farmer">
                  {t("farmer")}
                </option>

                <option value="Employee">
                  {t("employee")}
                </option>

                <option value="Business">
                  {t("business")}
                </option>

                <option value="Self Employed">
                  {t("selfEmployed")}
                </option>

                <option value="Unemployed">
                  {t("unemployed")}
                </option>

                <option value="Other">
                  {t("other")}
                </option>
              </select>
            </div>

            {/* ANNUAL INCOME */}

            <div>
              <label style={labelStyle}>
                {t("annualIncome")}
              </label>

              <input
                type="number"
                name="annualIncome"
                value={profile.annualIncome}
                onChange={handleChange}
                placeholder={t("enterAnnualIncome")}
                min="0"
                style={inputStyle}
              />
            </div>

            {/* COLLEGE */}

            <div>
              <label style={labelStyle}>
                {t("collegeInstitution")}
              </label>

              <input
                type="text"
                name="collegeName"
                value={profile.collegeName}
                onChange={handleChange}
                placeholder={t("enterCollegeName")}
                style={inputStyle}
              />
            </div>
          </div>

          {/* INFORMATION BOX */}

          <div
            style={{
              marginTop: "30px",
              padding: "18px",
              background: "#E8E8DC",
              border: "1px solid #C8C1AA",
              borderRadius: "10px",
              color: "#596052",
            }}
          >
            <p
              style={{
                margin: "0 0 7px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {t("whyNeedInformation")}
            </p>

            <p
              style={{
                margin: 0,
                lineHeight: "1.7",
                fontSize: "13px",
              }}
            >
              {t("profileInformationHelps")}
            </p>
          </div>

          {/* SAVE BUTTON */}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              marginTop: "30px",
              padding: "13px 18px",
              border: "none",
              borderRadius: "8px",
              background: saving
                ? "#9BA69A"
                : "#596B5A",
              color: "#F7F1E3",
              fontSize: "14px",
              fontWeight: "600",
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {saving
              ? t("saving")
              : t("saveProfile")}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "600",
  color: "#596052",
  fontSize: "13px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 13px",
  background: "#FAF7ED",
  border: "1px solid #C8C1AA",
  borderRadius: "8px",
  color: "#3E4435",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
};

export default Profile;