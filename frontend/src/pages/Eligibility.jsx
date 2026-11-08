import { useState } from "react";
import API from "../api";

function Eligibility() {
  const [formData, setFormData] = useState({
    // 1. Personal Details
    age: "",
    gender: "All",
    state: "Karnataka",
    district: "",

    // 2. Social Category
    socialCategory: "General",

    // 3. Economic Details
    income: "",
    bplStatus: "No",

    // 4. Education
    student: "No",
    educationLevel: "",
    currentCourse: "",

    // 5. Employment
    occupation: "Other",
    employmentStatus: "",

    // 6. Special Status
    disability: "No",
    minority: "No",
    seniorCitizen: "No",
    transgender: "No",
    widow: "No",
    singleWoman: "No",
    constructionWorker: "No",
    sanitationWorker: "No",
    artisanWeaver: "No",
    fisherman: "No",

    // 7. Agriculture
    farmer: "No",
    landOwnership: "No",
  });

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSchemes([]);

    try {
      const token = localStorage.getItem("token");

      // Eligibility information sent to the backend
      const eligibilityData = {
        age: Number(formData.age),
        gender: formData.gender,

        occupation:
          formData.student === "Yes"
            ? "Student"
            : formData.farmer === "Yes"
            ? "Farmer"
            : formData.occupation,

        state: formData.state,
        income: Number(formData.income || 0),
        landOwnership: formData.landOwnership === "Yes",

        // Social and economic information
        district: formData.district,
        socialCategory: formData.socialCategory,
        bplStatus: formData.bplStatus === "Yes",

        // Education
        student: formData.student === "Yes",
        educationLevel: formData.educationLevel,
        currentCourse: formData.currentCourse,

        // Employment
        employmentStatus: formData.employmentStatus,

        // Special status
        disability: formData.disability === "Yes",
        minority: formData.minority === "Yes",
        seniorCitizen: formData.seniorCitizen === "Yes",
        transgender: formData.transgender === "Yes",
        widow: formData.widow === "Yes",
        singleWoman: formData.singleWoman === "Yes",
        constructionWorker: formData.constructionWorker === "Yes",
        sanitationWorker: formData.sanitationWorker === "Yes",
        artisanWeaver: formData.artisanWeaver === "Yes",
        fisherman: formData.fisherman === "Yes",

        // Agriculture
        farmer: formData.farmer === "Yes",
      };

      // Centralized API connection
      const response = await API.post(
        "/schemes/eligibility",
        eligibilityData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ELIGIBILITY RESPONSE:", response.data);

      const result =
        response.data.schemes ||
        response.data.eligibleSchemes ||
        response.data.data ||
        [];

      setSchemes(result);
    } catch (err) {
      console.error("ELIGIBILITY ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to check eligibility. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F1E3",
        padding: "40px 20px 70px",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "35px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#81785A",
              marginBottom: "8px",
            }}
          >
            SARVASETU
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: "700",
              color: "#596B5A",
            }}
          >
            Find Schemes You May Be Eligible For
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6D705F",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Provide your basic details so SARVASETU can identify relevant
            government schemes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* 1. Personal Details */}
          <Section title="1. Personal Details">
            <Grid>
              <Field label="Age" required>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  required
                  placeholder="Enter your age"
                />
              </Field>

              <Field label="Gender">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="All">Prefer not to specify</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="State" required>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="All">Other / All India</option>
                </select>
              </Field>

              <Field label="District">
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                />
              </Field>
            </Grid>
          </Section>

          {/* 2. Social Category */}
          <Section title="2. Social Category">
            <Grid>
              <Field label="Social Category">
                <select
                  name="socialCategory"
                  value={formData.socialCategory}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="EBC">
                    Economically Backward Class (EBC)
                  </option>
                  <option value="DNT">
                    De-notified / Nomadic / Semi-Nomadic Tribe (DNT)
                  </option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="BPL Status">
                <select
                  name="bplStatus"
                  value={formData.bplStatus}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </Field>
            </Grid>
          </Section>

          {/* 3. Economic Details */}
          <Section title="3. Economic Details">
            <Grid>
              <Field label="Annual Family Income" required>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Example: 250000"
                />
              </Field>
            </Grid>
          </Section>

          {/* 4. Education */}
          <Section title="4. Education">
            <Grid>
              <Field label="Are you currently a student?">
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </Field>

              {formData.student === "Yes" && (
                <>
                  <Field label="Education Level">
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="School">School</option>
                      <option value="PUC">PUC / Higher Secondary</option>
                      <option value="Diploma">Diploma</option>
                      <option value="UG">Undergraduate</option>
                      <option value="PG">Postgraduate</option>
                      <option value="PhD">Ph.D.</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Current Course / Class">
                    <input
                      type="text"
                      name="currentCourse"
                      value={formData.currentCourse}
                      onChange={handleChange}
                      placeholder="Example: BCA"
                    />
                  </Field>
                </>
              )}
            </Grid>
          </Section>

          {/* 5. Employment */}
          <Section title="5. Employment">
            <Grid>
              <Field label="Occupation">
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                >
                  <option value="Student">Student</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employee">Employee</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Worker">Worker</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Fisherman">Fisherman</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Employment Status">
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </Grid>
          </Section>

          {/* 6. Special Status */}
          <Section title="6. Special Status">
            <Grid>
              <YesNoField
                label="Person with Disability"
                name="disability"
                value={formData.disability}
                onChange={handleChange}
              />

              <YesNoField
                label="Minority Community"
                name="minority"
                value={formData.minority}
                onChange={handleChange}
              />

              <YesNoField
                label="Senior Citizen"
                name="seniorCitizen"
                value={formData.seniorCitizen}
                onChange={handleChange}
              />

              <YesNoField
                label="Transgender"
                name="transgender"
                value={formData.transgender}
                onChange={handleChange}
              />

              <YesNoField
                label="Widow"
                name="widow"
                value={formData.widow}
                onChange={handleChange}
              />

              <YesNoField
                label="Single Woman"
                name="singleWoman"
                value={formData.singleWoman}
                onChange={handleChange}
              />

              <YesNoField
                label="Construction Worker"
                name="constructionWorker"
                value={formData.constructionWorker}
                onChange={handleChange}
              />

              <YesNoField
                label="Sanitation Worker"
                name="sanitationWorker"
                value={formData.sanitationWorker}
                onChange={handleChange}
              />

              <YesNoField
                label="Artisan / Weaver"
                name="artisanWeaver"
                value={formData.artisanWeaver}
                onChange={handleChange}
              />

              <YesNoField
                label="Fisherman"
                name="fisherman"
                value={formData.fisherman}
                onChange={handleChange}
              />
            </Grid>
          </Section>

          {/* 7. Agriculture */}
          <Section title="7. Agriculture">
            <Grid>
              <YesNoField
                label="Are you a farmer?"
                name="farmer"
                value={formData.farmer}
                onChange={handleChange}
              />

              {formData.farmer === "Yes" && (
                <YesNoField
                  label="Do you own agricultural land?"
                  name="landOwnership"
                  value={formData.landOwnership}
                  onChange={handleChange}
                />
              )}
            </Grid>
          </Section>

          {/* 8. Women & Child */}
          <Section title="8. Women & Child">
            <Grid>
              <Field label="Women / Child related status">
                <select
                  name="singleWoman"
                  value={formData.singleWoman}
                  onChange={handleChange}
                >
                  <option value="No">Not applicable</option>
                  <option value="Yes">Woman-specific status applies</option>
                </select>
              </Field>
            </Grid>
          </Section>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: "20px",
                padding: "14px 16px",
                borderRadius: "10px",
                backgroundColor: "#F3DADB",
                border: "1px solid #C496A1",
                color: "#6B3F46",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "30px",
              padding: "16px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#596B5A",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Checking Eligibility..." : "Find Eligible Schemes"}
          </button>
        </form>

        {/* Results */}
        {schemes.length > 0 && (
          <div style={{ marginTop: "45px" }}>
            <h2
              style={{
                color: "#596B5A",
                marginBottom: "20px",
              }}
            >
              Eligible Schemes
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >
              {schemes.map((scheme) => (
                <div
                  key={scheme._id || scheme.id || scheme.schemeName}
                  style={{
                    backgroundColor: "#F2EEE1",
                    border: "1px solid #C8C1AA",
                    borderRadius: "14px",
                    padding: "22px",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      color: "#596B5A",
                    }}
                  >
                    {scheme.schemeName}
                  </h3>

                  {scheme.description && (
                    <p
                      style={{
                        color: "#626657",
                        lineHeight: "1.6",
                      }}
                    >
                      {scheme.description}
                    </p>
                  )}

                  {scheme.benefits && (
                    <p
                      style={{
                        color: "#626657",
                        lineHeight: "1.6",
                      }}
                    >
                      <strong>Benefits:</strong> {scheme.benefits}
                    </p>
                  )}

                  {(scheme.applyLink || scheme.sourceUrl) && (
                    <a
                      href={scheme.applyLink || scheme.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "10px",
                        color: "#8E88A3",
                        fontWeight: "700",
                        textDecoration: "none",
                      }}
                    >
                      Official Information
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && schemes.length === 0 && !error && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              color: "#777A6D",
            }}
          >
            Enter your details and find schemes relevant to you.
          </div>
        )}
      </div>
    </div>
  );
}

/* -----------------------------
   Reusable Components
------------------------------ */

function Section({ title, children }) {
  return (
    <section
      style={{
        backgroundColor: "#F2EEE1",
        border: "1px solid #C8C1AA",
        borderRadius: "16px",
        padding: "26px",
        marginBottom: "22px",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "22px",
          fontSize: "20px",
          color: "#596B5A",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

function Grid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontSize: "14px",
        fontWeight: "700",
        color: "#4D5545",
      }}
    >
      <span>
        {label}
        {required && <span style={{ color: "#A65C67" }}> *</span>}
      </span>

      {children}

      <style>
        {`
          input,
          select {
            box-sizing: border-box;
            width: 100%;
            padding: 12px 13px;
            border: 1px solid #C8C1AA;
            border-radius: 9px;
            background: #F7F1E3;
            color: #3E4435;
            font-size: 14px;
            outline: none;
          }

          input:focus,
          select:focus {
            border-color: #8E88A3;
            box-shadow: 0 0 0 2px rgba(142, 136, 163, 0.12);
          }
        `}
      </style>
    </label>
  );
}

function YesNoField({ label, name, value, onChange }) {
  return (
    <Field label={label}>
      <select name={name} value={value} onChange={onChange}>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </Field>
  );
}

export default Eligibility;