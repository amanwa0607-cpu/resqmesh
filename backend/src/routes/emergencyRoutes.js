import express from "express";

import {
  getEmergencies,
  getEmergencyById,
  createEmergency,
  updateEmergency,
} from "../controllers/emergencyController.js";


const router =
  express.Router();


router.get(
  "/",
  getEmergencies
);

router.get(
  "/:id",
  getEmergencyById
);

router.post(
  "/",
  createEmergency
);

router.patch(
  "/:id",
  updateEmergency
);


export default router;