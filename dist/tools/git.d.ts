type ToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
export declare function getGitFlow(args: {
    section: string;
}): Promise<ToolResponse>;
export {};
//# sourceMappingURL=git.d.ts.map