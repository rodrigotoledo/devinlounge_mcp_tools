type ToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
export declare function searchDocumentation(args: {
    query: string;
    maxResults?: number;
}): Promise<ToolResponse>;
export {};
//# sourceMappingURL=search.d.ts.map