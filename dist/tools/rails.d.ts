type ToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
type RailsBootstrapArgs = {
    projectName?: string;
    authentication?: 'bcrypt' | 'oauth';
    authorization?: 'cancancan' | 'pundit';
    styling?: 'tailwindcss-rails' | 'simplecss';
};
export declare function getRailsBootstrap(args?: RailsBootstrapArgs): Promise<ToolResponse>;
export {};
//# sourceMappingURL=rails.d.ts.map