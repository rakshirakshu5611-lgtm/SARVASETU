const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Document = require("../models/Document");
const protect = require("../middleware/authMiddleware");

// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ==========================================
// FILE VALIDATION
// ==========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, JPG and PNG files are allowed."
        )
      );
    }
  },
});

// ==========================================
// GET MY DOCUMENTS
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const documents = await Document.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      total: documents.length,
      documents,
    });
  } catch (error) {
    console.error(
      "❌ GET DOCUMENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load documents",
    });
  }
});

// ==========================================
// UPLOAD DOCUMENT
// ==========================================

router.post(
  "/",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {

      // --------------------------------------
      // CHECK FILE
      // --------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a file.",
        });
      }

      const {
        documentName,
        documentType,
      } = req.body;

      // --------------------------------------
      // CHECK INFORMATION
      // --------------------------------------

      if (
        !documentName ||
        !documentType
      ) {
        const filePath = path.join(
          uploadDir,
          req.file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(400).json({
          success: false,
          message:
            "Document name and document type are required.",
        });
      }

      // --------------------------------------
      // SAVE DOCUMENT
      // --------------------------------------

      const document =
        await Document.create({
          user: req.user.id,

          documentName:
            documentName.trim(),

          documentType,

          fileName:
            req.file.originalname,

          fileUrl:
            `/uploads/${req.file.filename}`,

          fileType:
            req.file.mimetype,

          fileSize:
            req.file.size,
        });

        
      res.status(201).json({
        success: true,
        message:
          "Document uploaded successfully",

        document,
      });

    } catch (error) {
      console.error(
        "❌ ADD DOCUMENT ERROR:",
        error
      );

      if (req.file) {
        const filePath = path.join(
          uploadDir,
          req.file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// PROTECTED VIEW DOCUMENT
// ==========================================

router.get(
  "/:id/view",
  protect,
  async (req, res) => {
    try {
      console.log(
        "👁️ VIEW DOCUMENT:",
        req.params.id
      );

      // --------------------------------------
      // FIND DOCUMENT BELONGING TO USER
      // --------------------------------------

      const document =
        await Document.findOne({
          _id: req.params.id,
          user: req.user.id,
        });

      // --------------------------------------
      // DOCUMENT NOT FOUND
      // --------------------------------------

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found or access denied.",
        });
      }

      // --------------------------------------
      // GET FILE NAME
      // --------------------------------------

      const fileName =
        path.basename(
          document.fileUrl
        );

      const filePath = path.join(
        uploadDir,
        fileName
      );

      // --------------------------------------
      // CHECK FILE EXISTS
      // --------------------------------------

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message:
            "Document file not found.",
        });
      }

      // --------------------------------------
      // SET CONTENT TYPE
      // --------------------------------------

      res.setHeader(
        "Content-Type",
        document.fileType
      );

      // Allow browser to display PDF/images
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${document.fileName}"`
      );

      // --------------------------------------
      // SEND FILE
      // --------------------------------------

      res.sendFile(
        filePath
      );

    } catch (error) {
      console.error(
        "❌ VIEW DOCUMENT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to open document",
      });
    }
  }
);

// ==========================================
// DELETE DOCUMENT
// ==========================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const document =
        await Document.findOne({
          _id: req.params.id,
          user: req.user.id,
        });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      // --------------------------------------
      // DELETE PHYSICAL FILE
      // --------------------------------------

      if (document.fileUrl) {
        const fileName =
          path.basename(
            document.fileUrl
          );

        const filePath = path.join(
          uploadDir,
          fileName
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);

          console.log(
            "🗑️ FILE DELETED:",
            fileName
          );
        }
      }

      // --------------------------------------
      // DELETE DATABASE RECORD
      // --------------------------------------

      await Document.findByIdAndDelete(
        document._id
      );

      res.json({
        success: true,
        message:
          "Document deleted successfully",
      });

    } catch (error) {
      console.error(
        "❌ DELETE DOCUMENT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete document",
      });
    }
  }
);

// ==========================================
// MULTER ERROR HANDLER
// ==========================================

router.use(
  (error, req, res, next) => {
    console.error(
      "❌ DOCUMENT UPLOAD ERROR:",
      error
    );

    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "File size must be less than 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  }
);

module.exports = router;