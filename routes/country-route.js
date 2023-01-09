import express from "express";
import fetchPhoneCode from "../controllers/country-controller.js";

const router = express.Router();

router.route("/").get(fetchPhoneCode);

export default router