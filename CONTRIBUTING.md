# Contributing to @chemmangat/msal-next

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/chemmangat/msal-next.git
cd msal-next
```

2. Install dependencies:
```bash
npm install
```

3. Build the library:
```bash
npm run build
```

4. Run the example app:
```bash
# Create .env file with your Azure AD credentials
cp .env.example .env

# Start the development server
npm run dev
```

## Project Structure

```
msal-next/
├── lib/                    # Library source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── types.ts           # TypeScript types
│   └── index.ts           # Main exports
├── example/               # Example Next.js app
│   └── app/
├── dist/                  # Built library (generated)
├── tsup.config.ts        # Build configuration
└── package.json
```

## Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes in the `lib/` directory

3. Build the library:
```bash
npm run build
```

4. Test your changes in the example app:
```bash
npm run dev
```

5. Commit your changes:
```bash
git add .
git commit -m "feat: add your feature description"
```

## Commit Message Guidelines

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the version number in package.json following [SemVer](https://semver.org/)
3. Create a pull request with a clear description of changes
4. Wait for review and address any feedback

## Testing

Before submitting a PR, ensure:
- The library builds without errors: `npm run build`
- The example app runs correctly: `npm run dev`
- TypeScript types are correct
- No console errors in the browser

## Code Style

- Use TypeScript for all code
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable names

## Questions?

Feel free to open an issue for any questions or concerns.
