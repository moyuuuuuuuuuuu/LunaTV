import { fetch as undiciFetch, ProxyAgent } from 'undici';

let proxyAgent: ProxyAgent | null = null;
let proxyAgentUrl = '';

export function outboundFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const proxyUrl = process.env.OUTBOUND_PROXY_URL?.trim();
  if (!proxyUrl) {
    return fetch(input, init);
  }

  if (!proxyAgent || proxyAgentUrl !== proxyUrl) {
    proxyAgent = new ProxyAgent(proxyUrl);
    proxyAgentUrl = proxyUrl;
  }

  return undiciFetch(input as Parameters<typeof undiciFetch>[0], {
    ...init,
    dispatcher: proxyAgent,
  } as Parameters<typeof undiciFetch>[1]) as unknown as Promise<Response>;
}
