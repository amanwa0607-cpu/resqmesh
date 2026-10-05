import express from "express";

import {
  getRoads,
  getRoadById,
  createRoad,
  updateRoad,
} from "../controllers/roadController.js";


const router =
  express.Router();


router.get(
  "/",
  getRoads
);

router.get(
  "/:id",
  getRoadById
);

router.post(
  "/",
  createRoad
);

router.patch(
  "/:id",
  updateRoad
);


export default router;