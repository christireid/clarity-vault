# FIRST-RUN EXPERIENCE

> Perspective: First-time user attempting cold onboarding

---

## Simulation: I Found This on Hacker News

### Step 1: Landing Page (10 seconds)
- I see "Prompt Vault" - clear enough, it manages prompts
- "Manage Your AI Prompts with Confidence" - ok, generic but I get it
- 6 feature boxes - looks comprehensive
- "Start Free" and "View on GitHub" buttons

### Step 2: Click "View on GitHub"
- **Lands on github.com homepage.** Not the repo. Link is broken.
- **Trust destroyed immediately.** If they can't get a link right, how reliable is the product?
- **Friction: FATAL**

### Step 3: Go back, click "Start Free"
- Redirected to Clerk sign-up page
- Standard OAuth / email sign-up flow
- **This works** (Clerk handles it)

### Step 4: After Sign-Up - Dashboard
- I'm now at `/prompts`
- I see: Sidebar with 7 navigation items, and an empty state: "No prompts yet"
- There's a "Create Prompt" button and a "New Prompt" button
- Search bar and "Filters" button exist but clearly do nothing

### Step 5: Click "Create Prompt"
- **Nothing happens.** The button has no onClick handler.
- **Friction: FATAL**

### Step 6: Try Sidebar Navigation
- Click "Collections" - **404**
- Click "Playground" - **404**
- Click "Analytics" - **404**
- Click "Evaluations" - **404**
- Click "Memory" - **404**
- Click "Settings" - **404**

**6 out of 7 sidebar links lead to 404s.**

### Step 7: Realization
- I signed up for a product that has nothing in it
- I can't create prompts
- I can't do anything
- **I leave and never come back**

---

## Onboarding Score

| Metric | Score | Notes |
|--------|-------|-------|
| Time to sign-up | OK | Clerk works |
| Time to first value | INFINITE | No value possible |
| Time to "aha moment" | NEVER | No features work |
| Confusion points | 6+ | All sidebar links 404, buttons non-functional |
| Activation rate | 0% | Impossible to activate |

---

## Documentation Friction

- README has generic clone URL (yourusername/prompt-vault)
- No docs site exists (docs.promptvault.dev likely 404)
- Implementation strategy doc is internal planning, not user docs
- No API documentation
- No tutorials or guides
- No in-app help

---

## Activation Failure Analysis

The product has no activation path. The minimum requirements for activation:
1. User can create a prompt (button doesn't work)
2. User can see their prompt listed
3. User can edit their prompt
4. User gets some value (version tracking, variable extraction, etc.)

**None of these are possible.**

---

## What a First-Run Should Look Like

1. Sign up -> Immediate workspace creation (currently requires webhook)
2. Welcome dialog with workspace name
3. "Create your first prompt" guided flow
4. Pre-populated template prompts to explore
5. Variable highlighting working immediately
6. Version history visible after first edit
7. "Invite team" option visible but not blocking
