# duncanlord.com

Personal site served by GitHub Pages from `main`. See README.md for layout,
local preview, and common tasks (`npm run sync`, `npm run image`).

## Branches and pull requests

- Never commit or push directly to `main`. Every change reaches `main` through
  a pull request that the owner merges.
- Before starting new work, check open PRs (`gh pr list`). If the request
  belongs with an open PR (same feature, a fix or follow-up to its changes, or
  feedback on it), commit to that PR's branch. Otherwise, update `main`
  (`git switch main && git pull --ff-only`) and create a new branch from it.
- When it's unclear whether an edit belongs in an open PR, ask.
- Branch names: `<type>/<short-description>`, e.g. `feat/dark-mode`,
  `fix/gallery-caption`, `content/about-intro`.
- PRs are squash-merged, and the squash commit takes the PR title, so the PR
  title must be a conventional commit header (checked by
  `.github/workflows/pr-title.yml`). Keep it accurate if the PR's scope changes.

## Commit messages

Use Conventional Commits: `<type>(<optional scope>): <description>`, imperative
mood, lowercase description, no trailing period. Add a body when the why isn't
obvious. A `!` after the type marks a breaking change.

| Type           | Use for                                                      |
| -------------- | ------------------------------------------------------------ |
| `feat`         | New pages, sections, components, or site features            |
| `fix`          | Bugs, broken links, layout problems, accessibility defects   |
| `content`      | Copy edits, new or updated text, images, and documents       |
| `style`        | Visual design changes in CSS that aren't fixes               |
| `refactor`     | Restructuring markup, CSS, or scripts without visible change |
| `docs`         | README, CLAUDE.md, and other documentation                   |
| `build` / `ci` | Tooling, package.json, scripts, GitHub Actions               |
| `chore`        | Maintenance that fits nothing else                           |
| `revert`       | Reverting an earlier commit                                  |

Useful scopes: a page or area, e.g. `about`, `work`, `home`, `research`,
`project`, `nav`, `footer`, `css`, `images`.

The local `commit-msg` hook in `.githooks/` enforces the format; `npm install`
enables it (`git config core.hooksPath .githooks`).
