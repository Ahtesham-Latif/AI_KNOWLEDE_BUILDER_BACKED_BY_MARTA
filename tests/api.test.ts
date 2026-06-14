import { describe, it, expect, beforeAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { createServer } from '../server';
import puppeteer from 'puppeteer';

// Mocking Azure Identity
jest.mock('@azure/identity', () => ({
  AzureCliCredential: jest.fn().mockImplementation(() => ({
    getToken: (jest.fn() as any).mockResolvedValue({ token: 'mock-token' })
  }))
}));

// Mocking Puppeteer for PDF testing
jest.mock('puppeteer');

describe('Backend API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    jest.setTimeout(15000); // Increase timeout for CI/slow environments
    process.env.FOUNDRY_ENDPOINT = 'https://mock-foundry.azure.com';
    app = await createServer();
  });

  describe('GET /api/health', () => {
    it('should return status ok', async () => {
      // Arrange & Act
      const response = await request(app).get('/api/health');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/generate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 and valid schema on successful AI generation', async () => {
      // Arrange
      const mockKnowledge = {
        title: "Test Topic",
        layman: "Simple explanation",
        definition: "Technical definition",
        when_to_use: "Scenario A",
        conclusion: "Final thoughts",
        youtube_id: "dQw4w9WgXcQ",
        youtube_fallback: "Search query",
        how_to_make: ["Step 1", "Step 2"],
        types: ["Type 1", "Type 2"],
        points_to_ponder: ["Point 1"],
        sources: ["https://example.com"]
      };

      const mockMartaResponse = {
        output: [{
          type: 'message',
          content: [{ text: { value: "```json\n" + JSON.stringify(mockKnowledge) + "\n```" } }]
        }]
      };

      global.fetch = (jest.fn() as any).mockResolvedValue({
        ok: true,
        json: async () => mockMartaResponse
      });

      // Act
      const response = await request(app)
        .post('/api/generate')
        .send({ topic: 'React', audience: 'Student' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test Topic");
      expect(Array.isArray(response.body.how_to_make)).toBe(true);
      expect(response.body.youtube_id).toBe("dQw4w9WgXcQ");
    });

    it('should return 400 when required fields are missing in request body', async () => {
      // Arrange & Act
      const response = await request(app)
        .post('/api/generate')
        .send({ topic: 'React' }); // Missing audience

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should return 500 when MARTA provides an incomplete schema', async () => {
      // Arrange
      const incompleteData = { title: "Only Title" };
      global.fetch = (jest.fn() as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          output: [{ type: 'message', content: [{ text: { value: JSON.stringify(incompleteData) } }] }]
        })
      });

      // Act
      const response = await request(app)
        .post('/api/generate')
        .send({ topic: 'React', audience: 'Student' });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('missing required fields');
    });
  });

  describe('POST /api/export-pdf', () => {
    it('should return a PDF buffer on success', async () => {
      // Arrange
      const mockPdfBuffer = Buffer.alloc(2048, '%PDF-1.4 test content');
      const mockPage = {
        setViewport: jest.fn(),
        setContent: jest.fn(),
        pdf: (jest.fn() as any).mockResolvedValue(mockPdfBuffer),
      };
      const mockBrowser = {
        newPage: (jest.fn() as any).mockResolvedValue(mockPage),
        close: jest.fn(),
      } as any;

      jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

      const payload = {
        data: { title: "My Report", layman: "Test", definition: "Test", when_to_use: "Test", conclusion: "Test" },
        isDark: false
      };

      // Act
      const response = await request(app)
        .post('/api/export-pdf')
        .send(payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('application/pdf');
      expect(response.body).toBeDefined();
      // Check if binary content matches (supertest returns buffer in body for binary)
      expect(response.body.toString()).toBe(mockPdfBuffer.toString());
    });

    it('should return 400 if data is missing for PDF generation', async () => {
      const response = await request(app).post('/api/export-pdf').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required data');
    });
  });
});