"use client";

import { useState } from "react";
import { testImageModeration } from "@/app/_actions/rekognition";

interface ModerationLabel {
  Name?: string;
  Confidence?: number;
  ParentName?: string;
}

interface ModerationResult {
  isInappropriate: boolean;
  labels: ModerationLabel[];
  confidence: number;
}

export default function TestingPage() {
  const [result, setResult] = useState<ModerationResult | null | undefined>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null | undefined>(null);

  // Extract just the key from the full URL
  const keyName = "gettyimages-1252450501-612x612.jpg";

  const handleButtonClick = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await testImageModeration(keyName);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to moderate image");
      console.error("Moderation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Moderation Test</h1>

      <div className="mb-4 bg-gray-50 p-3 rounded">
        <p>
          <strong>Testing Key:</strong> {keyName}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          This will test the image moderation on your S3 bucket
        </p>
      </div>

      <button
        onClick={handleButtonClick}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-6"
      >
        {loading ? "Analyzing..." : "Test Image Moderation"}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Moderation Results</h2>

          <div className="mb-4">
            <div
              className={`inline-block px-3 py-1 rounded text-white font-semibold ${
                result.isInappropriate ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {result.isInappropriate ? "INAPPROPRIATE" : "APPROPRIATE"}
            </div>
          </div>

          {result.confidence > 0 && (
            <div className="mb-4">
              <strong>Highest Confidence:</strong>{" "}
              {result.confidence.toFixed(2)}%
            </div>
          )}

          {result.labels && result.labels.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-2">Detected Issues:</h3>
              <div className="space-y-2">
                {result.labels.map((label, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-red-600">
                          {label.Name || "Unknown"}
                        </div>
                        {label.ParentName && (
                          <div className="text-sm text-gray-600">
                            Category: {label.ParentName}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {(label.Confidence || 0).toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-500">confidence</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-green-600 font-medium">
              ✅ No inappropriate content detected
            </div>
          )}

          {/* Raw JSON for debugging */}
          <details className="mt-4">
            <summary className="cursor-pointer font-medium text-gray-700">
              Raw Response (for debugging)
            </summary>
            <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
