type ToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
export declare function getFrameworkGuide(args: {
    framework: string;
}): Promise<ToolResponse>;
export {};
//# sourceMappingURL=framework.d.ts.map