type ToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
export declare function getConfiguration(args: {
    configType: string;
    fileName?: string;
}): Promise<ToolResponse>;
export {};
//# sourceMappingURL=configuration.d.ts.map