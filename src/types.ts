/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KnowledgeResponse {
  title: string;
  layman: string;
  definition: string;
  when_to_use: string;
  how_to_make: string[];
  types: string[];
  points_to_ponder: string[];
  conclusion: string;
  sources?: string[];
  youtube_id?: string;
  youtube_fallback?: string;
}

export interface GenerateRequest {
  topic: string;
}
