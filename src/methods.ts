/**
 * MCPL method parameter and result types.
 * Port of mcpl-core/src/methods.rs
 *
 * Property names use camelCase matching the JSON wire format.
 */

import type { ContentBlock } from './types.js';

// ── Feature Sets (Section 6) ──

export interface FeatureSetDeclaration {
  name: string;
  description?: string;
  uses: string[];
  rollback: boolean;
  hostState: boolean;
}

/** featureSets/update (Host → Server, Notification) */
export interface FeatureSetsUpdateParams {
  enabled?: string[];
  disabled?: string[];
  scopes?: Record<string, ScopeConfig>;
}

export interface ScopeConfig {
  whitelist?: string[];
  blacklist?: string[];
}

/** featureSets/changed (Server → Host, Notification) */
export interface FeatureSetsChangedParams {
  added?: Record<string, FeatureSetDeclaration>;
  removed?: string[];
}

// ── Scoped Access (Section 7) ──

/** scope/elevate (Server → Host, Request) */
export interface ScopeElevateParams {
  featureSet: string;
  scope: ScopeElevateScope;
}

export interface ScopeElevateScope {
  label: string;
  payload?: unknown;
}

export interface ScopeElevateResult {
  approved: boolean;
  payload?: unknown;
  reason?: string;
}

// ── State Management (Section 8) ──

/** state/rollback (Host → Server, Request) */
export interface StateRollbackParams {
  featureSet: string;
  checkpoint: string;
}

export interface StateRollbackResult {
  checkpoint: string;
  success: boolean;
  reason?: string;
}

// ── Push Events (Section 9) ──

/** push/event (Server → Host, Request) */
export interface PushEventParams {
  featureSet: string;
  eventId: string;
  timestamp: string;
  origin?: unknown;
  payload: PushEventPayload;
}

export interface PushEventPayload {
  content: ContentBlock[];
}

export interface PushEventResult {
  accepted: boolean;
  inferenceId?: string;
  reason?: string;
}

// ── Context Hooks (Section 10) ──

export interface ModelInfo {
  id: string;
  vendor: string;
  contextWindow: number;
  capabilities: string[];
}

/** context/beforeInference (Host → Server, Request) */
export interface ContextBeforeInferenceParams {
  inferenceId: string;
  conversationId: string;
  turnIndex: number;
  userMessage?: string;
  model: ModelInfo;
}

export interface ContextInjection {
  namespace: string;
  position: ContextInjectionPosition;
  content: string | ContentBlock[];
  metadata?: unknown;
}

export type ContextInjectionPosition = 'system' | 'beforeUser' | 'afterUser';

export interface ContextBeforeInferenceResult {
  featureSet: string;
  contextInjections: ContextInjection[];
}

/** context/afterInference (Host → Server, Request or Notification) */
export interface ContextAfterInferenceParams {
  inferenceId: string;
  conversationId: string;
  turnIndex: number;
  userMessage: string;
  assistantMessage: string;
  model: ModelInfo;
  usage: InferenceUsage;
  channels?: unknown;
}

export interface ContextAfterInferenceResult {
  featureSet: string;
  modifiedResponse?: string;
  metadata?: unknown;
}

// ── Server-Initiated Inference (Section 11) ──

export interface InferenceUsage {
  inputTokens: number;
  outputTokens: number;
}

/** inference/request (Server → Host, Request) */
export interface InferenceRequestParams {
  featureSet: string;
  conversationId?: string;
  stream?: boolean;
  messages: InferenceMessage[];
  preferences?: InferencePreferences;
}

export interface InferenceMessage {
  role: string;
  content: string;
}

export interface InferencePreferences {
  maxTokens?: number;
  temperature?: number;
}

export interface InferenceRequestResult {
  content: string;
  model: string;
  finishReason: string;
  usage: InferenceUsage;
}

/** inference/chunk (Host → Server, Notification) */
export interface InferenceChunkParams {
  requestId: number;
  index: number;
  delta: string;
}

// ── Model Information (Section 12) ──

export type ModelInfoResult = ModelInfo;

// ── Channels (Section 14) ──

export interface ChannelDescriptor {
  id: string;
  type: string;
  label: string;
  direction: ChannelDirection;
  address?: unknown;
  metadata?: unknown;
}

export type ChannelDirection = 'outbound' | 'inbound' | 'bidirectional';

/** channels/register (Server → Host, Request) */
export interface ChannelsRegisterParams {
  channels: ChannelDescriptor[];
}

/** channels/changed (Server → Host, Notification) */
export interface ChannelsChangedParams {
  added?: ChannelDescriptor[];
  removed?: string[];
  updated?: ChannelDescriptor[];
}

/** channels/list (Either direction, Request) */
export interface ChannelsListResult {
  channels: ChannelDescriptor[];
}

/** channels/open (Host → Server, Request) */
export interface ChannelsOpenParams {
  type: string;
  address: unknown;
  metadata?: unknown;
}

export interface ChannelsOpenResult {
  channel: ChannelDescriptor;
}

/** channels/close (Host → Server, Request) */
export interface ChannelsCloseParams {
  channelId: string;
}

export interface ChannelsCloseResult {
  closed: boolean;
}

/** channels/outgoing/chunk (Host → Server, Notification) */
export interface ChannelsOutgoingChunkParams {
  inferenceId: string;
  conversationId: string;
  channelId: string;
  index: number;
  delta: string;
}

/** channels/outgoing/complete (Host → Server, Notification) */
export interface ChannelsOutgoingCompleteParams {
  inferenceId: string;
  conversationId: string;
  channelId: string;
  content: ContentBlock[];
}

/** channels/publish (Host → Server, Notification or Request) */
export interface ChannelsPublishParams {
  conversationId: string;
  channelId: string;
  stream?: boolean;
  content: ContentBlock[];
}

export interface ChannelsPublishResult {
  delivered: boolean;
  messageId?: string;
}

/** channels/incoming (Server → Host, Request) */
export interface ChannelsIncomingParams {
  messages: IncomingChannelMessage[];
}

export interface IncomingChannelMessage {
  channelId: string;
  messageId: string;
  threadId?: string;
  author: MessageAuthor;
  timestamp: string;
  content: ContentBlock[];
  metadata?: unknown;
}

export interface MessageAuthor {
  id: string;
  name: string;
}

export interface ChannelsIncomingResult {
  results: IncomingMessageResult[];
}

export interface IncomingMessageResult {
  messageId: string;
  accepted: boolean;
  conversationId?: string;
}

// ── Method Name Constants ──

export const method = {
  FEATURE_SETS_UPDATE: 'featureSets/update',
  FEATURE_SETS_CHANGED: 'featureSets/changed',
  SCOPE_ELEVATE: 'scope/elevate',
  STATE_ROLLBACK: 'state/rollback',
  PUSH_EVENT: 'push/event',
  CONTEXT_BEFORE_INFERENCE: 'context/beforeInference',
  CONTEXT_AFTER_INFERENCE: 'context/afterInference',
  INFERENCE_REQUEST: 'inference/request',
  INFERENCE_CHUNK: 'inference/chunk',
  MODEL_INFO: 'model/info',
  CHANNELS_REGISTER: 'channels/register',
  CHANNELS_CHANGED: 'channels/changed',
  CHANNELS_LIST: 'channels/list',
  CHANNELS_OPEN: 'channels/open',
  CHANNELS_CLOSE: 'channels/close',
  CHANNELS_OUTGOING_CHUNK: 'channels/outgoing/chunk',
  CHANNELS_OUTGOING_COMPLETE: 'channels/outgoing/complete',
  CHANNELS_PUBLISH: 'channels/publish',
  CHANNELS_INCOMING: 'channels/incoming',
} as const;
