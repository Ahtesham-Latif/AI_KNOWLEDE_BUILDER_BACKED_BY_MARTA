/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, beforeAll, afterAll } from '@jest/globals';
import App from './src/App';
import * as knowledgeService from './src/services/knowledgeService';

const mockGenerateKnowledge = jest.fn() as any;

// Mock heavy client-side libraries that cause ESM/JSDOM issues
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    addImage: jest.fn(),
    setFillColor: jest.fn(),
    rect: jest.fn(),
    internal: { pageSize: { getWidth: () => 595, getHeight: () => 842 } },
    getImageProperties: () => ({ width: 100, height: 100 })
  }))
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: (jest.fn() as any).mockImplementation(() => Promise.resolve(document.createElement('canvas')))
}));

// Mock YouTubePlayer to prevent script loading and async leaks during tests
jest.mock('./src/components/YouTubePlayer', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-youtube" />
}));

// Fix for matchMedia not being implemented in JSDOM
beforeAll(() => {
  jest.spyOn(knowledgeService, 'generateKnowledge').mockImplementation(mockGenerateKnowledge);

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock URL methods for PDF blob handling in JSDOM
  window.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-url') as any;
  window.URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const mockResponse = {
  title: "React Hooks",
  layman: "A way to use features without classes.",
  definition: "Functions that let you 'hook into' React state.",
  when_to_use: "When building functional components.",
  how_to_make: ["Step 1", "Step 2"],
  types: ["useState", "useEffect"],
  points_to_ponder: ["Rule of hooks"],
  conclusion: "Hooks are the future.",
  sources: ["https://react.dev"],
  youtube_id: "dQw4w9WgXcQ",
  youtube_fallback: "React Hooks tutorial"
};

describe('UI Component Integration', () => {
  beforeEach(() => {
    mockGenerateKnowledge.mockClear();
  });

  it('should render the Bento Grid correctly after successful generation', async () => {
    mockGenerateKnowledge.mockResolvedValue(mockResponse);
    render(<App />);

    const input = screen.getByPlaceholderText(/e.g., JWT Authentication/i);
    const submitBtn = screen.getByRole('button', { name: /generate/i });

    fireEvent.change(input, { target: { value: 'React Hooks' } });
    fireEvent.click(submitBtn);

    // 1. Check for loading state (Skeleton)
    expect(screen.getByText(/PROCESSING_KNOWLEDGE_PIPELINE/i)).toBeDefined();

    // 2. Check for Bento Grid rendering
    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeDefined();
      expect(screen.getByText(/Layman Term/i)).toBeDefined();
      expect(screen.getByText(mockResponse.definition)).toBeDefined();
    });
  });

  it('should handle "Donkey" persona mode correctly', async () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText(/e.g., JWT Authentication/i);
    const select = screen.getByRole('combobox');
    const submitBtn = screen.getByRole('button', { name: /generate/i });

    fireEvent.change(input, { target: { value: 'Quantum Physics' } });
    fireEvent.change(select, { target: { value: 'Donkey' } });
    fireEvent.click(submitBtn);

    // Assert conditional UI for Donkey mode
    await waitFor(() => {
      expect(screen.getByText(/Look Who is asking/i)).toBeDefined();
      expect(screen.getByText(/A Donkey tbh/i)).toBeDefined();
    });
  });

  it('should display error banner when MARTA fails', async () => {
    const errorMessage = "MARTA response missing required fields";
    mockGenerateKnowledge.mockRejectedValue(new Error(errorMessage));
    
    render(<App />);
    const input = screen.getByPlaceholderText(/e.g., JWT Authentication/i);
    fireEvent.change(input, { target: { value: 'Invalid Topic' } });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByText(/System Note/i)).toBeDefined();
      expect(screen.getByText(errorMessage)).toBeDefined();
    });
  });

  it('should trigger the complex topic modal', () => {
    render(<App />);
    const expandBtn = screen.getByTitle('Expand Input');
    
    fireEvent.click(expandBtn);
    
    expect(screen.getByText(/Complex Topic Entry/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Describe your complex topic in detail/i)).toBeDefined();
  });

  it('should show "Synthesizing..." feedback on PDF export', async () => {
    mockGenerateKnowledge.mockResolvedValue(mockResponse);
    render(<App />);

    // Pre-populate so grid is visible
    fireEvent.change(screen.getByPlaceholderText(/e.g., JWT Authentication/i), { target: { value: 'React' } });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => screen.getByText(/Export High-Fidelity PDF/i));

    const exportBtn = screen.getByText(/Export High-Fidelity PDF/i);
    
    // Mock fetch for the PDF endpoint
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        headers: new Map([['content-type', 'application/pdf']]),
        blob: () => Promise.resolve(new Blob())
      }), 100))
    ) as any;

    fireEvent.click(exportBtn);

    // Verify immediate feedback
    expect(screen.getByText(/SYNTHESIZING_PDF\.\.\./i)).toBeDefined();

    // Ensure all async state updates are captured before environment teardown
    await waitFor(() => {
      expect(screen.queryByText(/SYNTHESIZING_PDF\.\.\./i)).toBeNull();
    }, { timeout: 5000 });
  });
});