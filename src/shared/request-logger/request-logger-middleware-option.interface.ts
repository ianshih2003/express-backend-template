export interface RequestLoggerMessagesOptions {
  beforeMessage?: string;
  afterMessage?: string;
}

export interface HttpRequestLoggerOptions {
  excludeRequestUri?: string[];
  includeRequestUri?: string[];
  messages?: RequestLoggerMessagesOptions;
}
