/**
 * MCPL capability negotiation types.
 * Port of mcpl-core/src/capabilities.rs
 *
 * MCPL extensions ride on MCP's `initialize` handshake under
 * `capabilities.experimental.mcpl`.
 */

import type { FeatureSetDeclaration } from './methods.js';

export interface McplCapabilities {
  version: string;
  pushEvents?: boolean;
  contextHooks?: ContextHooksCap;
  inferenceRequest?: boolean | InferenceRequestCap;
  streamObserver?: boolean;
  rollback?: boolean;
  channels?: boolean;
  modelInfo?: boolean;
  featureSets?: FeatureSetDeclaration[];
  scopedAccess?: boolean;
}

export interface InferenceRequestCap {
  streaming: boolean;
}

export interface ContextHooksCap {
  beforeInference: boolean;
  afterInference?: AfterInferenceCap;
}

export interface AfterInferenceCap {
  blocking: boolean;
}

export interface ExperimentalCapabilities {
  mcpl?: McplCapabilities;
}

export interface InitializeCapabilities {
  experimental?: ExperimentalCapabilities;
  tools?: Record<string, unknown>;
  resources?: Record<string, unknown>;
  prompts?: Record<string, unknown>;
  logging?: Record<string, unknown>;
  roots?: Record<string, unknown>;
  sampling?: Record<string, unknown>;
}

export interface McplInitializeParams {
  protocolVersion: string;
  capabilities: InitializeCapabilities;
  clientInfo: ImplementationInfo;
}

export interface McplInitializeResult {
  protocolVersion: string;
  capabilities: InitializeCapabilities;
  serverInfo: ImplementationInfo;
}

export interface ImplementationInfo {
  name: string;
  version: string;
}

// ── Helper Functions ──

export function hasInferenceRequest(caps: McplCapabilities): boolean {
  return caps.inferenceRequest === true || (typeof caps.inferenceRequest === 'object' && caps.inferenceRequest !== null);
}

export function hasInferenceStreaming(caps: McplCapabilities): boolean {
  return typeof caps.inferenceRequest === 'object' && caps.inferenceRequest !== null && caps.inferenceRequest.streaming === true;
}

/** Extract MCPL capabilities from an initialize result/params, if present. */
export function extractMcpl(caps: InitializeCapabilities): McplCapabilities | undefined {
  return caps.experimental?.mcpl;
}
