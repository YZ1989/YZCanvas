# YZCanvas Security Policy

## Supported versions

YZCanvas is under active development. Security fixes target the `main` branch and the latest tagged release. Older versions are supported on a best-effort basis.

## Reporting a vulnerability

Do not publish exploit details, credentials, private API keys, proof-of-concept code, sensitive screenshots, or real user data in a public issue.

Use one of these channels:

1. GitHub private vulnerability reporting or a GitHub Security Advisory for this repository, when available.
2. Another private maintainer channel configured for the repository.
3. If no private channel is available, open a public issue requesting private contact and omit all technical exploit details.

Include the affected version or commit, reproduction steps, impact, relevant redacted evidence, and whether the issue affects local use, hosted deployment, browser storage, WebDAV sync, provider configuration, or proxy behavior.

## Scope

YZCanvas Windows preview removes the remote node-plugin execution chain. Optional upstream module sources remain in the repository but are not included in the desktop build. Provider credentials are stored locally using the inherited configuration mechanism.

In-scope reports include:

- Cross-site scripting or unintended credential exposure in project code.
- Unexpected execution of remote plugin code in the lightweight desktop build.
- Unsafe file handling, import/export behavior, WebDAV proxy behavior, or access control.
- An exploitable supply-chain issue in code or default configuration shipped by this repository.

Usually out of scope:

- Vulnerabilities in third-party providers, hosting platforms, or browser extensions.
- Compromise of a user's credentials outside YZCanvas.
- Reports without a practical security impact.

## Disclosure

YZCanvas maintainers coordinate fixes before public disclosure on a best-effort basis. Please allow time for investigation and remediation before publishing details.
