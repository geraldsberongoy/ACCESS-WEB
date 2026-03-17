# Contributing Guidelines

Thank you for your interest in contributing to the ACCESS Web Portal! We welcome contributions from the ACCESS community.

## Workflow

We follow a strict Git workflow to ensure code quality and stability.

1.  **Fork & Clone**: Fork the repository to your own GitHub account and clone it locally.
2.  **Create a Branch**: Always create a new branch for your work. Use the format `type/description`:
    - `feat/add-login-page`
    - `fix/navbar-responsiveness`
    - `docs/update-readme`
3.  **Develop**: Write your code. Ensure it follows our [Coding Standards](STANDARDS.md).
4.  **Commit**: Use conventional commits (see below).
5.  **Push**: Push your branch to your fork.
6.  **Pull Request**: Open a Pull Request (PR) targeting the `dev` branch of the main repository.
    - **Do NOT target `main` directly.** Merges to `main` happen only for production releases.

## File Placement

Follow the architecture rules in [ARCHITECTURE.md](ARCHITECTURE.md) when adding or moving files.

- Put route entrypoints and layouts in `src/app/`.
- Put feature-specific components in `src/features/<feature>/`.
- Keep `src/components/ui/` limited to shared primitives.
- Prefer incremental migration over large folder reshuffles with no behavior change.

If your PR introduces a new component in a global folder, be ready to justify why it is reusable across unrelated features.

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

Structure: `<type>(<scope>): <subject>`

Examples:

- `feat(directory): add search functionality for officers`
- `fix(assets): resolve bug in borrowing date picker`
- `docs(setup): update installation instructions`
- `style: format code with prettier`
- `chore: update dependencies`

## Pull Request Process

1.  **Title**: Use the same Conventional Commits format for your PR title.
2.  **Description**: Fill out the PR template. Explain _what_ you changed and _why_.
3.  **Screenshots**: If your change affects the UI, include screenshots or a screen recording.
4.  **Review**: Wait for a code review from a team lead or maintainer. Address any feedback promptly.
5.  **Merge**: Once approved, your PR will be merged into `dev`.

## Reporting Issues

If you find a bug or have a feature request, please open an Issue on GitHub.

- Check for existing issues first.
- clearly describe the problem or idea.
- Provide steps to reproduce for bugs.
