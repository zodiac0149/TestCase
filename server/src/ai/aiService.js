import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient } from './bedrockClient.js';
import { env } from '../config/env.js';

// ── Fallback (called when Bedrock is unreachable or credentials absent) ──────

const fallbackGeneration = (prompt) =>
  `## Strategy
Create layered coverage across pure functions, API contracts, integrations, validation paths, and failure modes. The generated plan below is a local fallback — AWS Bedrock was unreachable or credentials were not found.

## Unit Tests
- Test core functions with valid input, empty input, null values, and malformed payloads.
- Mock external dependencies and verify call arguments.
- Assert deterministic outputs and side effects.

## Integration Tests
- Exercise service-to-model workflows with realistic fixtures.
- Verify authentication and authorization boundaries.
- Confirm database writes, reads, and rollback behavior.

## API Tests
- Cover 200, 201, 400, 401, 403, 404, and 500-style paths.
- Validate request payload schema and response contract.
- Test pagination, filtering, duplicate submissions, and missing fields.

## Edge Cases
- Empty repositories, large files, unsupported frameworks, duplicate routes, expired tokens, and partial AI failures.

## Validation Tests
- Reject unsafe repository URLs, invalid ObjectIds, weak passwords, and non-ZIP uploads.

## Negative Tests
- Prompt injection in user instructions.
- Unauthorized access to another user's project.
- Regeneration for missing generation records.

## Mock Data
\`\`\`json
{
  "user": { "email": "qa@example.com", "password": "StrongPass123" },
  "project": { "projectName": "Checkout API", "repositoryUrl": "https://github.com/acme/checkout" }
}
\`\`\`

## Expected Outputs
- Stable assertions with clear failure messages.
- Tests grouped by behavior and risk.

## Coverage Gaps
- Add repository-specific assertions after scan results are available.

<!-- Prompt preview: ${prompt.slice(0, 500).replace(/--/g, '')} -->`;

// ── Claude (Anthropic) Messages API payload ───────────────────────────────────

const buildClaudePayload = (prompt, { systemMessage, maxTokens = 8192, temperature = 0.25 } = {}) => ({
  anthropic_version: 'bedrock-2023-05-31',
  max_tokens: maxTokens,
  temperature,
  ...(systemMessage ? { system: systemMessage } : {}),
  messages: [{ role: 'user', content: prompt }],
});

// ── Amazon Nova Messages API payload ─────────────────────────────────────────
// Nova uses 'maxTokens' (not max_new_tokens). Nova Pro max output = 5120.

const buildNovaPayload = (prompt, { systemMessage, maxTokens = 4096, temperature = 0.25 } = {}) => ({
  messages: [{ role: 'user', content: [{ text: prompt }] }],
  ...(systemMessage ? { system: [{ text: systemMessage }] } : {}),
  inferenceConfig: { maxTokens: Math.min(maxTokens, 5120), temperature },
});

// ── Core invocation ───────────────────────────────────────────────────────────

const invoke = async (modelId, prompt, options = {}) => {
  const isClaudeModel = modelId.startsWith('anthropic.claude') || modelId.startsWith('us.anthropic.');
  const isNovaModel   = modelId.startsWith('amazon.nova');

  let body;
  if (isClaudeModel) {
    body = buildClaudePayload(prompt, options);
  } else if (isNovaModel) {
    body = buildNovaPayload(prompt, options);
  } else {
    body = { inputText: prompt, textGenerationConfig: { maxTokenCount: 4096, temperature: 0.25 } };
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body),
  });

  const response = await bedrockClient.send(command);
  const parsed = JSON.parse(Buffer.from(response.body).toString('utf8'));

  if (isClaudeModel) return parsed.content?.[0]?.text ?? '';
  if (isNovaModel)   return parsed.output?.message?.content?.[0]?.text ?? '';
  return parsed.results?.[0]?.outputText ?? '';
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate test cases using the primary model (Claude Sonnet).
 * Credentials are resolved automatically via the AWS SDK default chain:
 * ~/.aws/credentials → env vars → IAM role → etc.
 */
export const completeText = async (prompt) => {

  try {
    return await invoke(env.bedrockModelId, prompt, {
      systemMessage:
        'You are a senior QA automation architect. Generate production-ready test cases in Markdown. For each test case, write actual, executable test code (using the requested or most appropriate framework) and include concrete suggested inputs, mock payloads, and assertion checks.',
      maxTokens: 8192,
      temperature: 0.25,
    });
  } catch (error) {
    console.error('[Bedrock] completeText error:', error.message);
    return fallbackGeneration(prompt);
  }
};

/**
 * Generate an architecture / repository analysis summary using the cheaper
 * analysis model (Claude Haiku) — fast and cost-optimised.
 */
export const completeAnalysis = async (prompt) => {

  try {
    return await invoke(env.bedrockAnalysisModelId, prompt, {
      systemMessage:
        'You are a senior software architect. Analyse repository structure and produce a concise, accurate technical summary.',
      maxTokens: 1024,
      temperature: 0.1,
    });
  } catch (error) {
    console.error('[Bedrock] completeAnalysis error:', error.message);
    return null;
  }
};
