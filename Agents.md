# AGENTS.md — AI Agent Configuration

## MARTA
**Master Orchestrator Agent for the Structured AI Knowledge Builder**

- **Platform:** Microsoft Azure AI Foundry
- **Model:** GPT-4.1-mini (Global Standard)
- **Version:** 4
- **Tools:** Bing Web Search (grounding)
- **Track:** Creative Apps — Microsoft IQ (Foundry IQ)

### Role
MARTA transforms any topic and target audience into a structured, grounded JSON knowledge artifact. Every response is web-search grounded — zero hallucination by design.

### Safety Guardrails
- Self harm: blocked
- Hate and unfairness: blocked
- Violence: blocked
- Sexual content: blocked
- Indirect attack: blocked
- Code vulnerability: blocked
- Prompt injection: blocked at guardrail level

### Persona System
- Student — academic framing
- Developer — system abstractions
- Engineer — architecture patterns
- Kid — playful metaphors
- Teacher — instructional tone
- Business Person — ROI focused
- Donkey — ultra-simplified gamified 😂
