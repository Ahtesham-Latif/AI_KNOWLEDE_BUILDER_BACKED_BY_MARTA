/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MARTA — Azure Foundry Agent implementation
 */

import { KnowledgeResponse } from "../types";

// Simple persistent cache in memory for the session
const cache = new Map<string, KnowledgeResponse>();

export async function generateKnowledge(topic: string, audience: string): Promise<KnowledgeResponse> {
  const normalizedKey = `${topic.toLowerCase().trim()}_${audience.toLowerCase()}`;
  
  if (cache.has(normalizedKey)) {
    return cache.get(normalizedKey)!;
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, audience }),
  });

  if (!response.ok) {
    let errorMessage = "Knowledge generation failed";
    try {
      const errJson = await response.json();
      if (errJson && errJson.error) {
        errorMessage = errJson.error;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const result = await response.json() as KnowledgeResponse;
  cache.set(normalizedKey, result);
  
  return result;
}