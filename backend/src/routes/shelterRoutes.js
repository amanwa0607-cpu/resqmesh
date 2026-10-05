import express from "express";

import {
  getShelters,
  getShelterById,
  createShelter,
  updateShelter,
} from "../controllers/shelterController.js";


const router =
  express.Router();


router.get(
  "/",
  getShelters
);

router.get(
  "/:id",
  getShelterById
);

router.post(
  "/",
  createShelter
);

router.patch(
  "/:id",
  updateShelter
);


export default router;