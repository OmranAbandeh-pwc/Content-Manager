import { NextFunction, Request, Response } from "express";
import { collectionService } from "../../services/collectionsService";
import { CreateCollection } from "../../schemas/collectionSchema";

// Create new collection
export const createCollectionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const collectionData: CreateCollection = req.body;

    if (!collectionData.collectionName) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required",
      });
    }

    if (!collectionData.collectionType) {
      return res.status(400).json({
        success: false,
        message: "Collection type is required (API, WEB, or BOTH)",
      });
    }

    // Validate collection
    if (!["API", "WEB", "BOTH"].includes(collectionData.collectionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection type. Must be API, WEB, or BOTH",
      });
    }

    // Validate status if provided
    if (
      collectionData.status &&
      !["ACTIVE", "ARCHIVED"].includes(collectionData.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be ACTIVE, ARCHIVED, or INACTIVE",
      });
    }

    // Create collection
    const collection = await collectionService.createCollection({
      project_id: collectionData.projectId!,
      collection_name: collectionData.collectionName,
      description: collectionData.description,
      collection_type: collectionData.collectionType,
      status: collectionData.status,
      last_run_date: collectionData.lastRunDate
        ? new Date(collectionData.lastRunDate)
        : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};
