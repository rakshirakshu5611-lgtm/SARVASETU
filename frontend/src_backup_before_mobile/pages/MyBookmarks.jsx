import { useEffect, useState } from "react";
import axios from "axios";

function MyBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH USER BOOKMARKS
  // ==========================================

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/bookmarks/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookmarks(res.data.bookmarks || []);
    } catch (error) {
      console.error(
        "FETCH BOOKMARKS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load bookmarks"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REMOVE BOOKMARK
  // ==========================================

  const removeBookmark = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/bookmarks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bookmark Removed");

      fetchBookmarks();
    } catch (error) {
      console.error(
        "REMOVE BOOKMARK ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove bookmark"
      );
    }
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
            borderRadius: "20px",
            padding: "40px 30px",
            textAlign: "center",
            boxShadow:
              "0 12px 30px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "5px",
              background: "#C8C1AA",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "26px",
            }}
          >
            <div
              style={{
                width: "45%",
                height: "100%",
                background: "#596B5A",
                borderRadius: "10px",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "23px",
              fontWeight: 750,
            }}
          >
            Loading your saved schemes
          </h2>

          <p
            style={{
              marginTop: "9px",
              marginBottom: 0,
              color: "#81785A",
              fontSize: "14px",
            }}
          >
            Please wait
          </p>
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
        padding: "35px 20px 60px",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >
        {/* PAGE HEADER */}

        <div
          style={{
            background: "#596B5A",
            borderRadius: "22px",
            padding: "34px 32px",
            marginBottom: "28px",
            color: "#FFFFFF",
            boxShadow:
              "0 12px 28px rgba(62, 68, 53, 0.12)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#EBE1C6",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Personal Collection
          </p>

          <div
            style={{
              width: "55px",
              height: "4px",
              background: "#C496A1",
              borderRadius: "10px",
              marginTop: "14px",
            }}
          />

          <h1
            style={{
              margin: "20px 0 8px",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 750,
              lineHeight: 1.2,
            }}
          >
            My Saved Schemes
          </h1>

          <p
            style={{
              margin: 0,
              color: "#EBE1C6",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Government schemes you have saved for
            future reference.
          </p>
        </div>

        {/* EMPTY STATE */}

        {bookmarks.length === 0 ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "20px",
              padding: "55px 30px",
              textAlign: "center",
              boxShadow:
                "0 10px 25px rgba(62, 68, 53, 0.06)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "4px",
                background: "#8E88A3",
                borderRadius: "10px",
                margin: "0 auto 24px",
              }}
            />

            <h2
              style={{
                margin: 0,
                color: "#3E4435",
                fontSize: "25px",
                fontWeight: 750,
              }}
            >
              No Saved Schemes
            </h2>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "#81785A",
                fontSize: "15px",
              }}
            >
              Schemes you save will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* RESULT COUNT */}

            <div
              style={{
                marginBottom: "18px",
                color: "#81785A",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {bookmarks.length}{" "}
              {bookmarks.length === 1
                ? "Saved Scheme"
                : "Saved Schemes"}
            </div>

            {/* BOOKMARK LIST */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {bookmarks.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: "#F2EEE1",
                    border:
                      "1px solid #C8C1AA",
                    borderRadius: "18px",
                    padding: "25px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow:
                      "0 8px 22px rgba(62, 68, 53, 0.06)",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* CATEGORY */}

                  <div
                    style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      background: "#E1E5DB",
                      color: "#596B5A",
                      padding: "6px 11px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.4px",
                      marginBottom: "15px",
                    }}
                  >
                    {item.scheme?.category ||
                      "General"}
                  </div>

                  {/* SCHEME NAME */}

                  <h2
                    style={{
                      margin: 0,
                      color: "#3E4435",
                      fontSize: "22px",
                      lineHeight: 1.35,
                      fontWeight: 750,
                    }}
                  >
                    {item.scheme?.schemeName ||
                      "Scheme Name Unavailable"}
                  </h2>

                  {/* DEPARTMENT */}

                  <div
                    style={{
                      marginTop: "17px",
                      paddingTop: "15px",
                      borderTop:
                        "1px solid #C8C1AA",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#81785A",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                    >
                      Department
                    </p>

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                        color: "#596B5A",
                        fontSize: "14px",
                        fontWeight: 650,
                      }}
                    >
                      {item.scheme?.department ||
                        "Not specified"}
                    </p>
                  </div>

                  {/* DESCRIPTION */}

                  <p
                    style={{
                      margin:
                        "17px 0 0",
                      color: "#596B5A",
                      fontSize: "14px",
                      lineHeight: 1.75,
                      flexGrow: 1,
                    }}
                  >
                    {item.scheme?.description ||
                      "No description available."}
                  </p>

                  {/* REMOVE */}

                  <button
                    onClick={() =>
                      removeBookmark(item._id)
                    }
                    style={{
                      marginTop: "22px",
                      width: "100%",
                      padding: "12px 16px",
                      background: "#C496A1",
                      color: "#3E4435",
                      border:
                        "1px solid #C496A1",
                      borderRadius: "9px",
                      fontSize: "14px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Remove Bookmark
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyBookmarks;