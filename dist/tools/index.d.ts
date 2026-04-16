import type { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare function listTools(): Promise<{
    tools: Tool[];
}>;
export declare function callTool(request: any): Promise<{
    content: any;
    isError?: boolean;
}>;
//# sourceMappingURL=index.d.ts.map