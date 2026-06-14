import { TextEncoder, TextDecoder } from 'node:util';

// Polyfill Web APIs not available in JSDOM/Node.js by default
// Required for jsPDF and related encoding libraries
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;