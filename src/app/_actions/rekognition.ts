"use server";

import { env } from "@/env";
import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  DetectModerationLabelsCommandInput,
  ModerationLabel,
} from "@aws-sdk/client-rekognition";

interface ModerationResult {
  isInappropriate: boolean;
  labels: ModerationLabel[];
  confidence: number;
}

const rekognitionClient = new RekognitionClient({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

/**
 * Moderate image from S3 bucket
 * @param {string} bucketName - S3 bucket name
 * @param {string} keyName - S3 object key
 * @param {number} confidenceThreshold - Minimum confidence level (0-100)
 * @returns {Promise<ModerationResult>} Moderation result
 */

export async function moderateImageFromS3(
  bucketName: string,
  keyName: string,
  confidenceThreshold = 50
): Promise<ModerationResult> {
  try {
    const params: DetectModerationLabelsCommandInput = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: keyName,
        },
      },
      MinConfidence: confidenceThreshold,
    };

    const command = new DetectModerationLabelsCommand(params);
    const response = await rekognitionClient.send(command);
    const moderationLabels = response.ModerationLabels ?? [];

    return {
      isInappropriate: moderationLabels.length > 0,
      labels: moderationLabels,
      confidence:
        moderationLabels.length > 0
          ? Math.max(...moderationLabels.map((label) => label.Confidence ?? 0))
          : 0,
    };
  } catch (error) {
    console.error("Error moderating image:", error);
    throw new Error("Failed to moderate image");
  }
}

export async function testImageModeration(keyName: string) {
  try {
    const result = await moderateImageFromS3(
      env.AWS_S3_BUCKET_NAME,
      keyName,
      50
    );
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Test moderation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
