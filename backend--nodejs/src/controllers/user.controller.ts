import UserService from "../services/user.service";
import express from "express";
const router = express.Router();

router.post("/user", UserService.create);
router.get("/:id", UserService.getById);
router.get("/", UserService.getAll);
router.patch("/:id", UserService.update);
router.delete("/:id", UserService.delete);

export default router;
