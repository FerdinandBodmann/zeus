export interface ApiKey {
  id: string;
  name: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyCreate {
  name: string;
  providerId: string;
  key: string;
}

export interface ApiKeyUpdate {
  name?: string;
  key?: string;
}

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyId?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderCreate {
  name: string;
  baseUrl: string;
}

export interface ProviderUpdate {
  name?: string;
  baseUrl?: string;
  enabled?: boolean;
}

export interface Model {
  id: string;
  providerId: string;
  name: string;
  displayName: string;
  enabled: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationCreate {
  title: string;
  modelId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface McpServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  enabled: boolean;
}

export interface McpServerCreate {
  name: string;
  command: string;
  args: string[];
}

export interface McpServerUpdate {
  name?: string;
  command?: string;
  args?: string[];
  enabled?: boolean;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface Settings {
  [key: string]: any;
}
