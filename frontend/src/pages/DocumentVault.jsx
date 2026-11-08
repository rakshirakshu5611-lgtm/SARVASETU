
import { useEffect, useRef, useState } from "react";
import API from "../api";
import { useLanguage } from "../i18n/LanguageContext";

function DocumentVault() {
  const { t } = useLanguage();

  const [documents, setDocuments] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Aadhaar");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ==========================================
  // LOAD DOCUMENTS
  // ==========================================

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        setLoading(false);
        return;
      }

      const res = await API.get("/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("DOCUMENTS RESPONSE:", res.data);

      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("FETCH DOCUMENTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          t("failedToLoadDocuments")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILE VALIDATION
  // ==========================================

  const handleFileChange = (e) => {
    setMessage("");
    setError("");

    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError(t("fileSizeLessThan5MB"));

      e.target.value = "";
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(t("onlyPdfJpgPngAllowed"));

      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // UPLOAD DOCUMENT
  // ==========================================

  const handleUpload = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!documentName.trim()) {
      setError(t("pleaseEnterDocumentName"));
      return;
    }

    if (!file) {
      setError(t("pleaseSelectFile"));
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        return;
      }

      const formData = new FormData();

      formData.append(
        "documentName",
        documentName.trim()
      );

      formData.append(
        "documentType",
        documentType
      );

      formData.append("file", file);

      console.log("UPLOADING DOCUMENT:", {
        documentName: documentName.trim(),
        documentType,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const res = await API.post(
        "/documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ADD DOCUMENT RESPONSE:",
        res.data
      );

      setMessage(
        t("documentUploadedSuccessfully")
      );

      setDocumentName("");
      setDocumentType("Aadhaar");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchDocuments();
    } catch (err) {
      console.error(
        "ADD DOCUMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("failedToUploadDocument")
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // VIEW DOCUMENT
  // ==========================================

  const handleView = async (id) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        return;
      }

      const res = await API.get(
        `/documents/${id}/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const contentType =
        res.headers["content-type"] ||
        "application/octet-stream";

      const blob = new Blob([res.data], {
        type: contentType,
      });

      const fileUrl =
        window.URL.createObjectURL(blob);

      window.open(fileUrl, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (err) {
      console.error(
        "VIEW DOCUMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("unableToOpenDocument")
      );
    }
  };

  // ==========================================
  // DOWNLOAD DOCUMENT
  // ==========================================

  const handleDownload = async (doc) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        return;
      }

      const res = await API.get(
        `/documents/${doc._id}/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const contentType =
        res.headers["content-type"] ||
        doc.fileType ||
        "application/octet-stream";

      const blob = new Blob([res.data], {
        type: contentType,
      });

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        doc.fileName || "document";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      setMessage(
        t("documentDownloadedSuccessfully")
      );
    } catch (err) {
      console.error(
        "DOWNLOAD DOCUMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("unableToDownloadDocument")
      );
    }
  };

  // ==========================================
  // DELETE DOCUMENT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("confirmDeleteDocument")
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("pleaseLoginFirst"));
        return;
      }

      await API.delete(
        `/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        t("documentDeletedSuccessfully")
      );

      await fetchDocuments();
    } catch (err) {
      console.error(
        "DELETE DOCUMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("failedToDeleteDocument")
      );
    }
  };

  // ==========================================
  // FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return t("zeroKB");
    }

    if (bytes < 1024) {
      return `${bytes} Bytes`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  // ==========================================
  // DOCUMENT TYPE LABEL
  // ==========================================

  const getDocumentTypeLabel = (type) => {
    const typeMap = {
      Aadhaar: t("aadhaar"),
      "PAN Card": t("panCard"),
      "Income Certificate":
        t("incomeCertificate"),
      "Caste Certificate":
        t("casteCertificate"),
      "Domicile Certificate":
        t("domicileCertificate"),
      "Marks Card": t("marksCard"),
      "College ID": t("collegeId"),
      Other: t("other"),
    };

    return typeMap[type] || type;
  };

  // ==========================================
  // FILE TYPE LABEL
  // ==========================================

  const getFileTypeLabel = (fileType) => {
    if (fileType === "application/pdf") {
      return "PDF";
    }

    if (fileType === "image/jpeg") {
      return "JPG";
    }

    if (fileType === "image/png") {
      return "PNG";
    }

    return "FILE";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#F2EEE1",
            border:
              "1px solid #C8C1AA",
            borderRadius: "24px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
              "0 12px 30px rgba(62,68,53,0.08)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "#DED8C8",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                width: "45%",
                height: "100%",
                background: "#C496A1",
                borderRadius: "10px",
                animation:
                  "vaultLoading 1.2s ease-in-out infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "22px",
            }}
          >
            {t("openingYourVault")}
          </h2>

          <p
            style={{
              color: "#6D7467",
              marginTop: "10px",
              marginBottom: 0,
              lineHeight: "1.6",
            }}
          >
            {t("securingYourDocuments")}
          </p>

          <style>
            {`
              @keyframes vaultLoading {
                0% {
                  transform: translateX(-120%);
                }
                100% {
                  transform: translateX(250%);
                }
              }
            `}
          </style>
        </div>
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
        padding: "35px 20px 70px",
        fontFamily:
          "Inter, Arial, sans-serif",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <section
          style={{
            background: "#596B5A",
            color: "#F7F1E3",
            padding:
              "36px 38px",
            borderRadius: "24px",
            marginBottom: "25px",
            border:
              "1px solid #4F604F",
            boxShadow:
              "0 12px 30px rgba(62,68,53,0.12)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#EBE1C6",
              color: "#596B5A",
              padding: "7px 13px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            {t("privateAndSecure")}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(30px, 5vw, 40px)",
              lineHeight: "1.15",
              letterSpacing: "-0.8px",
            }}
          >
            {t("documentVault")}
          </h1>

          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              color: "#E4E7DE",
              fontSize: "15px",
              maxWidth: "700px",
              lineHeight: "1.7",
            }}
          >
            {t("documentVaultDescription")}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                border:
                  "1px solid rgba(235,225,198,0.35)",
                color: "#F3EEDB",
                padding: "8px 13px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              {t("accountProtected")}
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(235,225,198,0.35)",
                color: "#F3EEDB",
                padding: "8px 13px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              {documents.length}{" "}
              {t("stored")}
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(235,225,198,0.35)",
                color: "#F3EEDB",
                padding: "8px 13px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              {t("maxFileSize5MB")}
            </div>
          </div>
        </section>

        {/* MESSAGES */}

        {message && (
          <div
            style={{
              background: "#E7EFE6",
              border:
                "1px solid #B9CBB8",
              color: "#4F684F",
              padding:
                "14px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#F3E6E6",
              border:
                "1px solid #D7B6B6",
              color: "#7B4B4B",
              padding:
                "14px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {/* ADD DOCUMENT */}

        <section
          style={{
            background: "#F2EEE1",
            padding: "30px",
            borderRadius: "22px",
            marginBottom: "26px",
            border:
              "1px solid #C8C1AA",
            boxShadow:
              "0 8px 24px rgba(62,68,53,0.06)",
          }}
        >
          <div
            style={{
              borderBottom:
                "1px solid #D7D0BD",
              paddingBottom: "18px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "23px",
                color: "#3E4435",
              }}
            >
              {t("addDocument")}
            </h2>

            <p
              style={{
                margin:
                  "7px 0 0",
                color: "#6D7467",
                fontSize: "14px",
              }}
            >
              {t("uploadPdfJpgPng")}
            </p>
          </div>

          <form onSubmit={handleUpload}>
            {/* DOCUMENT NAME */}

            <label
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#3E4435",
              }}
            >
              {t("documentName")}
            </label>

            <input
              type="text"
              placeholder={t(
                "documentNameExample"
              )}
              value={documentName}
              onChange={(e) =>
                setDocumentName(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding:
                  "13px 14px",
                borderRadius: "10px",
                border:
                  "1px solid #C8C1AA",
                background: "#F9F6EC",
                color: "#3E4435",
                fontSize: "15px",
                boxSizing: "border-box",
                marginBottom: "20px",
                outline: "none",
              }}
            />

            {/* DOCUMENT TYPE */}

            <label
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#3E4435",
              }}
            >
              {t("documentType")}
            </label>

            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding:
                  "13px 14px",
                borderRadius: "10px",
                border:
                  "1px solid #C8C1AA",
                fontSize: "15px",
                background: "#F9F6EC",
                color: "#3E4435",
                marginBottom: "20px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Aadhaar">
                {t("aadhaar")}
              </option>

              <option value="PAN Card">
                {t("panCard")}
              </option>

              <option value="Income Certificate">
                {t("incomeCertificate")}
              </option>

              <option value="Caste Certificate">
                {t("casteCertificate")}
              </option>

              <option value="Domicile Certificate">
                {t("domicileCertificate")}
              </option>

              <option value="Marks Card">
                {t("marksCard")}
              </option>

              <option value="College ID">
                {t("collegeId")}
              </option>

              <option value="Other">
                {t("other")}
              </option>
            </select>

            {/* FILE */}

            <label
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#3E4435",
              }}
            >
              {t("selectFile")}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={
                handleFileChange
              }
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "10px",
                border:
                  "1px dashed #A9A18D",
                background: "#F9F6EC",
                marginBottom: "18px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            />

            {/* SELECTED FILE */}

            {file && (
              <div
                style={{
                  background: "#EBE1C6",
                  border:
                    "1px solid #C8B98D",
                  padding:
                    "14px 16px",
                  borderRadius: "11px",
                  marginBottom: "20px",
                }}
              >
                <strong
                  style={{
                    color: "#59604E",
                    wordBreak:
                      "break-word",
                  }}
                >
                  {file.name}
                </strong>

                <div
                  style={{
                    color: "#81785A",
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  {formatFileSize(
                    file.size
                  )}
                </div>
              </div>
            )}

            {/* UPLOAD BUTTON */}

            <button
              type="submit"
              disabled={uploading}
              style={{
                background: uploading
                  ? "#AAAFA4"
                  : "#C496A1",
                color: "#FFFFFF",
                border: "none",
                padding:
                  "12px 22px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "800",
                cursor: uploading
                  ? "not-allowed"
                  : "pointer",
                transition:
                  "background 0.2s ease",
              }}
            >
              {uploading
                ? t("uploading")
                : t("addDocument")}
            </button>
          </form>
        </section>

        {/* DOCUMENT LIST */}

        <section
          style={{
            background: "#F2EEE1",
            padding: "30px",
            borderRadius: "22px",
            border:
              "1px solid #C8C1AA",
            boxShadow:
              "0 8px 24px rgba(62,68,53,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "#3E4435",
                }}
              >
                {t("myDocuments")}
              </h2>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  color: "#6D7467",
                  fontSize: "14px",
                }}
              >
                {t("yourUploadedDocuments")}
              </p>
            </div>

            <span
              style={{
                background: "#919D85",
                color: "#FFFFFF",
                padding:
                  "8px 13px",
                borderRadius: "8px",
                fontWeight: "800",
                fontSize: "13px",
              }}
            >
              {documents.length}{" "}
              {t("documents")}
            </span>
          </div>

          {/* EMPTY */}

          {documents.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding:
                  "55px 20px",
                border:
                  "1px dashed #BDB6A3",
                borderRadius: "16px",
                background: "#F9F6EC",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color: "#3E4435",
                }}
              >
                {t("vaultIsEmpty")}
              </h3>

              <p
                style={{
                  color: "#6D7467",
                  marginTop: "8px",
                }}
              >
                {t("addFirstDocument")}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(285px, 1fr))",
                gap: "18px",
              }}
            >
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  style={{
                    border:
                      "1px solid #C8C1AA",
                    borderRadius: "17px",
                    padding: "20px",
                    background: "#F9F6EC",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* DOCUMENT TOP */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: "10px",
                      marginBottom:
                        "17px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius:
                          "10px",
                        background:
                          "#EBE1C6",
                        border:
                          "1px solid #D2C5A3",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        color:
                          "#81785A",
                        fontWeight: "900",
                        fontSize: "12px",
                        letterSpacing:
                          "0.5px",
                      }}
                    >
                      {getFileTypeLabel(
                        doc.fileType
                      )}
                    </div>

                    <span
                      style={{
                        background:
                          "#E1E5DB",
                        color:
                          "#596B5A",
                        padding:
                          "6px 9px",
                        borderRadius:
                          "7px",
                        fontSize: "11px",
                        fontWeight:
                          "800",
                        textAlign:
                          "right",
                      }}
                    >
                      {getDocumentTypeLabel(
                        doc.documentType
                      )}
                    </span>
                  </div>

                  {/* DOCUMENT NAME */}

                  <h3
                    style={{
                      margin:
                        "0 0 9px",
                      fontSize: "18px",
                      color: "#3E4435",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {doc.documentName}
                  </h3>

                  {/* FILE DETAILS */}

                  <div
                    style={{
                      borderTop:
                        "1px solid #DDD6C5",
                      borderBottom:
                        "1px solid #DDD6C5",
                      padding:
                        "10px 0",
                      marginBottom:
                        "11px",
                    }}
                  >
                    <p
                      style={{
                        color:
                          "#6D7467",
                        fontSize:
                          "13px",
                        wordBreak:
                          "break-word",
                        margin:
                          "4px 0",
                      }}
                    >
                      {doc.fileName}
                    </p>

                    <p
                      style={{
                        color:
                          "#6D7467",
                        fontSize:
                          "13px",
                        margin:
                          "4px 0",
                      }}
                    >
                      {formatFileSize(
                        doc.fileSize
                      )}
                    </p>
                  </div>

                  <p
                    style={{
                      color:
                        "#81785A",
                      fontSize:
                        "12px",
                      margin:
                        "8px 0 0",
                    }}
                  >
                    {t("added")}{" "}
                    {doc.createdAt
                      ? new Date(
                          doc.createdAt
                        ).toLocaleDateString()
                      : t("unknown")}
                  </p>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "8px",
                      marginTop:
                        "17px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleView(
                          doc._id
                        )
                      }
                      style={{
                        background:
                          "#596B5A",
                        color:
                          "#FFFFFF",
                        border: "none",
                        padding:
                          "10px",
                        borderRadius:
                          "9px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "700",
                        fontSize:
                          "13px",
                      }}
                    >
                      {t("view")}
                    </button>

                    <button
                      onClick={() =>
                        handleDownload(
                          doc
                        )
                      }
                      style={{
                        background:
                          "#C496A1",
                        color:
                          "#FFFFFF",
                        border: "none",
                        padding:
                          "10px",
                        borderRadius:
                          "9px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "800",
                        fontSize:
                          "13px",
                      }}
                    >
                      {t("download")}
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          doc._id
                        )
                      }
                      style={{
                        gridColumn:
                          "1 / -1",
                        background:
                          "#EBE1C6",
                        color:
                          "#7B4B4B",
                        border:
                          "1px solid #D5C5A4",
                        padding:
                          "9px",
                        borderRadius:
                          "9px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "700",
                        fontSize:
                          "13px",
                      }}
                    >
                      {t(
                        "deleteDocument"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DocumentVault;
