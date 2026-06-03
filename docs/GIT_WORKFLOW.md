# Git Workflow

## Branch Strategy

This project uses a simplified Git Flow model:

```
main (production-ready)
├── develop (integration branch)
│   ├── feature/journal-entries
│   ├── feature/weekly-checkin
│   ├── feature/charts-trends
│   ├── feature/notifications
│   └── bugfix/fix-sleep-calc
├── release/v1.0.0
└── hotfix/critical-fix
```

### Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/gad7-questionnaire` |
| Bugfix | `bugfix/description` | `bugfix/sleep-overnight-calc` |
| Hotfix | `hotfix/description` | `hotfix/data-loss-fix` |
| Release | `release/vX.Y.Z` | `release/v1.0.0` |

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Meaning |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons) |
| `refactor` | Code refactoring without behavior change |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `ci` | CI/CD configuration |

### Scopes

Common scopes for this project:
- `journal` - Journal entry models and store
- `todo` - To-do list feature
- `checkin` - GAD-7/PHQ-9 weekly check-in
- `trends` - Charts and trends screen
- `settings` - Settings and notifications
- `theme` - Theme and styling
- `nav` - Navigation
- `electron` - Desktop wrapper
- `deps` - Dependencies

### Examples

```bash
feat(journal): add emotion picker with category grouping
fix(todo): correct rollover behavior for past-due items
docs(architecture): add data model documentation
test(checkin): add PHQ-9 scoring unit tests
chore(deps): update zustand to v5.0.14
refactor(theme): consolidate color tokens into semantic palette
```

## Workflow

### Starting a New Feature

```bash
# Switch to develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-feature

# ... Make changes, test locally ...

# Stage and commit in logical units
git add src/models/NewFeature.ts
git commit -m "feat(feature): add data model for new feature"

git add src/state/newFeatureStore.ts
git commit -m "feat(feature): add Zustand store with persistence"

git add src/screens/NewFeatureScreen.tsx
git commit -m "feat(feature): add screen component with navigation"
```

### Keeping Your Branch Up-to-Date

```bash
# Rebase on develop to get latest changes
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# Resolve any conflicts, then continue
git add <resolved-files>
git rebase --continue
```

### Merging a Feature

```bash
# Switch to develop and merge
git checkout develop
git pull origin develop
git merge --no-ff feature/my-feature

# Or use a pull request on GitHub for code review
# Push feature branch to GitHub
git push origin feature/my-feature
# Then create a PR: feature/my-feature → develop
```

### Creating a Release

```bash
# Create release branch from develop
git checkout develop
git checkout -b release/v1.0.0

# Bump version in package.json, app.config.ts
# Update CHANGELOG.md
# Run full test suite
npm test
npm run lint
npm run typecheck

# Commit version bump
git add package.json app.config.ts
git commit -m "chore(release): bump version to 1.0.0"

# Merge into main and develop
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"

git checkout develop
git merge --no-ff release/v1.0.0

# Push everything
git push origin main --tags
git push origin develop
```

### Hotfix Process

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-fix

# ... Fix the issue ...

git commit -m "fix(journal): prevent data loss on app crash"

# Merge back to both main and develop
git checkout main
git merge --no-ff hotfix/critical-fix
git tag -a v1.0.1 -m "Hotfix v1.0.1"

git checkout develop
git merge --no-ff hotfix/critical-fix

git push origin main --tags
git push origin develop
```

## Commit History for This Project

The initial codebase was built in the following logical commit units:

1. **Project Setup** - `chore(init): scaffold Expo + TypeScript project`
2. **Configuration** - `chore(config): add ESLint, Prettier, Jest, tsconfig`
3. **Data Models** - `feat(journal): add daily journal entry and emotion models`
4. **Todo Model** - `feat(todo): add to-do item model with status helpers`
5. **State Stores** - `feat(state): add Zustand stores with AsyncStorage persistence`
6. **Theme System** - `feat(theme): add color palette, spacing, and typography`
7. **Navigation** - `feat(nav): add tab and stack navigation setup`
8. **Home Screen** - `feat(journal): add home screen with mood and date selectors`
9. **Card Components** - `feat(journal): add summary, sleep, emotions, activities cards`
10. **Meals Card** - `feat(journal): add meals card for meals, drinks, and snacks`
11. **Todo Card** - `feat(todo): add to-do list card with status tracking`
12. **Trends Screen** - `feat(trends): add charts screen with trend visualization`
13. **Weekly Check-in** - `feat(checkin): add GAD-7 and PHQ-9 questionnaire screens`
14. **Settings** - `feat(settings): add settings screen with notification config`
15. **Notifications** - `feat(notifications): add notification scheduling service`
16. **Electron** - `feat(electron): add Electron wrapper for Windows desktop`
17. **Tests** - `test: add unit and component tests`
18. **Documentation** - `docs: add architecture, deployment, and workflow docs`

## Rules

1. **Never force-push** to `main` or `develop` branches
2. **Always use `--no-ff`** for merges to preserve branch history
3. **Never commit** `.env` files, API keys, or personal data
4. **Run tests** before pushing: `npm test && npm run lint && npm run typecheck`
5. **Keep commits atomic**: one logical change per commit
6. **Write descriptive commit messages**: follow conventional commits format
7. **PR reviews** required for merging into `develop` and `main`
8. **Semantic versioning** for all releases: MAJOR.MINOR.PATCH
