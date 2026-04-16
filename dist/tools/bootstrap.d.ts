type ToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
type BootstrapArgs = {
    framework: 'rails' | 'nextjs' | 'nestjs' | 'fastapi' | 'react' | 'expo' | 'phoenix';
    projectName?: string;
    authentication?: 'bcrypt' | 'oauth';
    authorization?: 'cancancan' | 'pundit';
    styling?: 'tailwindcss-rails' | 'simplecss';
    backgroundJobs?: 'solid_queue' | 'sidekiq' | 'none';
    pagination?: 'pagy' | 'kaminari' | 'none';
    appShape?: 'html-first' | 'api-heavy';
    search?: 'ransack' | 'pg_search' | 'none';
    uploads?: 'active-storage' | 'active-storage-image-processing' | 'shrine' | 'none';
    admin?: 'activeadmin' | 'avo' | 'none';
    auditing?: 'paper_trail' | 'audited' | 'none';
    multiTenancy?: 'acts_as_tenant' | 'none';
};
export declare function getProjectBootstrap(args: BootstrapArgs): Promise<ToolResponse>;
export {};
//# sourceMappingURL=bootstrap.d.ts.map