const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/role");

router
  .route("/")
  .get(protect, authorize("admin"), getUsers);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;
