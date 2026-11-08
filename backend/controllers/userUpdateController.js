const UserUpdateSeen = require("../models/UserUpdateSeen");
const GovUpdate = require("../models/GovUpdate");

// Get unseen updates for logged-in user
const getUnseenUpdates = async (req, res) => {
  try {
    const userId = req.user.id;

    const seenUpdates = await UserUpdateSeen.find({
      user: userId,
    }).select("update");

    const seenIds = seenUpdates.map(
      (item) => item.update.toString()
    );

    const updates = await GovUpdate.find({
      isActive: true,
      _id: {
        $nin: seenIds,
      },
    })
      .sort({
        publishedDate: -1,
      })
      .limit(20);

    res.json({
      success: true,
      count: updates.length,
      updates,
    });

  } catch (error) {
    console.log("UNSEEN UPDATES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Mark update as seen
const markUpdateSeen = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateId = req.params.id;

    const update = await GovUpdate.findById(updateId);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Government update not found",
      });
    }

    await UserUpdateSeen.findOneAndUpdate(
      {
        user: userId,
        update: updateId,
      },
      {
        user: userId,
        update: updateId,
        seenAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Update marked as seen",
    });

  } catch (error) {
    console.log("MARK UPDATE SEEN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getUnseenUpdates,
  markUpdateSeen,
};