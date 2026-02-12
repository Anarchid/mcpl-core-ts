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
  inferenceRequest?: boolean;
  streamObserver?: boolean;
  rollback?: boolean;
  channels?: boolean;
  featureSets?: FeatureSetDeclaration[];
  scopedAccess?: boolean;
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
  /** Standard MCP capabilities (tools, resources, etc.) */
  [key: string]: unknown;
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

export function newCapabilities(version: string): McplCapabilities {
  return { version };
}

export function hasPushEvents(caps: McplCapabilities): boolean {
  return caps.pushEvents === true;
}

export function hasChannels(caps: McplCapabilities): boolean {
  return caps.channels === true;
}

export function hasRollback(caps: McplCapabilities): boolean {
  return caps.rollback === true;
}

export function hasInferenceRequest(caps: McplCapabilities): boolean {
  return caps.inferenceRequest === true;
}

export function hasStreamObserver(caps: McplCapabilities): boolean {
  return caps.streamObserver === true;
}

export function hasScopedAccess(caps: McplCapabilities): boolean {
  return caps.scopedAccess === true;
}

/** Extract MCPL capabilities from an initialize result/params, if present. */
export function extractMcpl(caps: InitializeCapabilities): McplCapabilities | undefined {
  return caps.experimental?.mcpl;
}
