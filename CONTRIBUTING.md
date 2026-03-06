# Contributing to webext-permissions

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## How to File Issues

- Search existing issues before opening a new one to avoid duplicates.
- Use the provided issue templates (Bug Report or Feature Request) when applicable.
- Include as much relevant information as possible to help us understand and reproduce the issue.

## Development Workflow

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/webext-permissions.git
   cd webext-permissions
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch** for your change:
   ```bash
   git checkout -b my-feature
   ```
5. **Make your changes** and ensure all tests pass:
   ```bash
   npm test
   ```
6. **Commit** your changes with a clear, descriptive commit message.
7. **Push** your branch to your fork:
   ```bash
   git push origin my-feature
   ```
8. **Open a Pull Request** against the `main` branch of this repository.

## Code Style

- Write clean, readable TypeScript.
- Follow the existing code conventions found in the project.
- Keep changes focused — one logical change per pull request.

## Running Tests

```bash
npm test
```

All pull requests must pass the existing test suite before they can be merged. If you add new functionality, please include corresponding tests.

## Code of Conduct

Be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive experience for everyone.
