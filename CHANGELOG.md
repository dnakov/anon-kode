# Changelog

## [v0.0.19]
- Added support for LLM servers that don't include `usage` or token counts in their responses (e.g. LM Studio)
  - Modified query handling to work with servers that don't return token usage metrics
  - Improved compatibility with third-party LLM servers
- Updated issue templates for better bug reporting
- Updated README.md with improved documentation

## [v0.0.18]
- Implemented `/bug` command for submitting feedback directly from the CLI
  - Created Bug component to handle feedback submission workflow
  - Integrated with GitHub issue reporting
- Updated issue templates for more structured bug reporting

## [v0.0.17]
- Fixed model selection and configuration bugs
  - Resolved issues with model detection and selection
  - Fixed configuration persistence issues

## [v0.0.16]
- Added support for OpenAI's `reasoning_effort` parameter
  - Updated models.ts to include `supports_reasoning_effort` flag for compatible models
  - Added configuration screen for max tokens and reasoning effort
  - Modified the claude.ts service to respect these new parameters
- Updated model config handling in API calls
- Fixed various bugs related to model configuration and token usage

## [v0.0.15]
- Updated README documentation with clearer usage instructions

## [v0.0.14]
- Added single release workflow that handles version bump, build, and publish
  - Streamlined the release process with automated versioning
  - Improved CI/CD pipeline
- Updated README with new single release workflow information

## [v0.0.13]
- Fixed version-bump workflow to properly trigger build and publish processes

## [v0.0.12]
- Fixed build process and dependency issues
- Improved build script reliability

## [v0.0.11]
- Fixed npm-publish workflow to install Bun for proper builds
- Improved deployment pipeline configuration

## [v0.0.10]
- Fixed npm-publish.yml workflow file for more reliable deployments

## [v0.0.9]
- Initial tagged release
- Basic CLI functionality established
