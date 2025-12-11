import express from "express";
import { createCollectionController } from "../../controllers/collections/collectionsController";
import { authenticate } from "../../middlewares/authenticate";
import { validateBody } from "../../middlewares/validation";
import { createCollectionSchema } from "../../schemas/collectionSchema";

export const router = express.Router();

router.post(
  "/",
  authenticate,
  validateBody(createCollectionSchema),
  createCollectionController
);
