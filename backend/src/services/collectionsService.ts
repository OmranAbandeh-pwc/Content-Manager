import { ResultSetHeader } from "mysql2";
import { queryDatabase } from "../db/dbConfig";
import { AppError } from "../utils/AppError";

interface CreateCollectionData {
  project_id: number;
  collection_name: string;
  description?: string;
  collection_type: "API" | "WEB";
  status?: "ACTIVE" | "ARCHIVED" | "INACTIVE";
  last_run_date?: Date;
}

interface CollectionResponse {
  id: number;
}

export class CollectionsService {
  /**
   * Create a new collections
   */

  async createCollection(
    collectionData: CreateCollectionData
  ): Promise<CreateCollectionData> {
    const {
      project_id,
      collection_name,
      description,
      collection_type,
      status = "ACTIVE",
      last_run_date,
    } = collectionData;

    // Validate required fields
    if (!collection_name || !project_id || !collection_type) {
      throw new AppError("COLLECTION_MISSING_REQUIRED_FIELDS", 401);
    }

    // Validate collection_type
    if (!["API", "WEB"].includes(collection_type)) {
      throw new AppError("INVALID_COLLECTION_TYPE", 401);
    }

    // Validate status
    if (!["ACTIVE", "ARCHIVED", "INACTIVE"].includes(status)) {
      throw new AppError("INVALID_STATUS", 401);
    }

    const result = await queryDatabase(
      `INSERT INTO collections (project_id, collection_name, description, collection_type, status, last_run_date) 
           VALUES (?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        collection_name,
        description || null,
        collection_type,
        status,
        last_run_date || null,
      ]
    );

    const insertResult = result as ResultSetHeader;
    const collectionId = insertResult.insertId;

    return collectionData;
  }
}

export const collectionService = new CollectionsService();
