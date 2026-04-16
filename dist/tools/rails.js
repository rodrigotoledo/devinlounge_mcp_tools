export async function getRailsBootstrap(args = {}) {
    const projectName = args.projectName ?? 'my_app';
    const authentication = args.authentication;
    const authorization = args.authorization;
    const styling = args.styling;
    const missingDecisions = [];
    if (!authentication) {
        missingDecisions.push('- authentication: `bcrypt` or `oauth`');
    }
    if (!authorization) {
        missingDecisions.push('- authorization: `cancancan` or `pundit`');
    }
    if (!styling) {
        missingDecisions.push('- styling: `tailwindcss-rails` or `simplecss`');
    }
    const selectedAuth = authentication ?? 'bcrypt';
    const selectedAuthorization = authorization ?? 'cancancan';
    const selectedStyling = styling ?? 'tailwindcss-rails';
    const stylingStep = selectedStyling === 'tailwindcss-rails'
        ? 'docker compose exec fullstack bundle add tailwindcss-rails\n# then run the installer for your Rails version if needed'
        : '# simplecss: include the stylesheet link in the application layout (no gem required)';
    const authorizationStep = selectedAuthorization === 'cancancan'
        ? 'docker compose exec fullstack bundle add cancancan'
        : 'docker compose exec fullstack bundle add pundit';
    const responseParts = [
        '# Rails bootstrap — required workflow',
        '',
        'Do not use plain `rails new` for this template. Use the sequence below.',
        '',
        '## Required decisions',
        authentication || authorization || styling
            ? `- authentication: ${selectedAuth}\n- authorization: ${selectedAuthorization}\n- styling: ${selectedStyling}`
            : 'The agent must ask these before scaffolding:\n' + missingDecisions.join('\n'),
        '',
        '## Scaffold commands',
        '```bash',
        `docker compose exec fullstack bin/rails new ${projectName} --skip-test`,
        `cd ${projectName}`,
        'docker compose exec fullstack bundle install',
        'docker compose exec fullstack bundle add rspec-rails --group "development,test"',
        'docker compose exec fullstack bundle add shoulda-matchers --group "test"',
        'docker compose exec fullstack bundle add simplecov --group "test"',
        'docker compose exec fullstack bundle add guard-rspec --group "development,test"',
        'docker compose exec fullstack bin/rails generate rspec:install',
        'docker compose exec fullstack bundle exec guard init rspec',
        'docker compose exec fullstack rm -rf test/',
        'docker compose exec fullstack bundle add bcrypt',
        authorizationStep,
        stylingStep,
        '```',
        '',
        '## Non-negotiable rules',
        '- RSpec only; do not keep Minitest active.',
        '- Prefer request specs over controller specs.',
        '- Use Rails path helpers in specs, not hardcoded route strings.',
        '- Do not assume `devise` unless explicitly requested.',
    ];
    return {
        content: [
            {
                type: 'text',
                text: responseParts.join('\n'),
            },
        ],
    };
}
//# sourceMappingURL=rails.js.map