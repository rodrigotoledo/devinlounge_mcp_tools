# Token Optimization Guide for Claude & AI Assistants

Strategies to minimize token usage when working with Claude, Cursor, and other AI assistants on this project.

---

## 📊 Context Window Management

### Know Your Limits

- **Claude Haiku:** 200K tokens (fast, efficient)
- **Claude Sonnet:** 200K tokens (balanced)
- **Claude Opus:** 200K tokens (most capable, but slower)

**Strategy:** Use smaller models (Haiku) for routine tasks; reserve Opus for complex reasoning.

---

## ✂️ Be Explicit & Concise

### Bad (Wastes Tokens)

```
Can you help me with this code? I'm working on the authentication system
and it's not working right. Let me paste some code and explain what's
happening. I think the problem is in the JWT validation logic but I'm
not sure. Can you take a look and tell me what the issue is?

Here's the code:
[Large code block with lots of context]
```

### Good (Saves Tokens)

```
**File:** backend-nestjs/src/auth/jwt.strategy.ts (lines 45-60)
**Issue:** JWT validation failing on valid tokens
**Error:** "Token expired" despite fresh tokens
**Question:** Why is `jwtFromRequest` not extracting the bearer token correctly?
```

---

## 🎯 Specific References

### Don't Do This

```
I need to modify something in the auth file. Can you help?
```

### Do This

```
Update backend-rails/app/models/user.rb:45-50 — add password validation
```

**Impact:** -50% tokens by being specific about location and scope.

---

## 📝 Use Diffs, Not Full Files

### Inefficient

```
Read the entire backend-nestjs/src/users/users.service.ts and refactor it
```

### Efficient

```
In backend-nestjs/src/users/users.service.ts:
- Line 23: Change `map()` to `filter()` 
- Line 45: Extract `getUserData()` logic to separate method
- Show me the diff before applying
```

**Impact:** -70% tokens by showing code snippets instead of full files.

---

## 🔍 Leverage Existing Documentation

### Wrong

```
How do I set up Rails testing? What gems should I use? How do I configure RSpec?
```

### Right

```
I've read RAILS_SETUP_GUIDE.md. Need help configuring SimpleCov for 80% minimum coverage.
```

**Impact:** -60% tokens by reading docs first, then asking specific questions.

---

## 🗂️ Use Project Context Effectively

### Inefficient

```
I'm working on the NestJS backend. Can you explain how dependency injection works?
```

### Efficient

```
Implementing UserModule. Per CLAUDE.md architectural patterns, how should I structure
the controller → service → repository flow?
```

**Impact:** -40% tokens by referencing project-specific context.

---

## 🤝 Structured Prompting

### Pattern: Ask Once, Get Everything

**Good Structure:**

```
**Goal:** Add email validation to user sign-up

**Context:**
- Service: backend-nestjs
- File: src/auth/auth.service.ts
- Current: No email validation on registration

**Acceptance Criteria:**
1. Verify email format using class-validator
2. Check for existing email in database
3. Return 400 with validation error if invalid

**Before implementing:**
1. Show me the updated DTO structure
2. Show me the class-validator decorators needed
3. Only then apply changes

**Test requirement:** Provide unit test example
```

**Impact:** Structured prompts get better results with fewer follow-ups (-50% tokens).

---

## 💾 Cache Prompt Instructions

### Use `.cursor/rules.md` & `.copilot/instructions.md`

Don't repeat:
```
Remember, we use RSpec, not Minitest. Don't assert error message text.
Only use Docker for backend services. Use Tailwind, not inline styles.
```

Instead:

```
Per .cursor/rules.md, implement test in RSpec.
Per CLAUDE.md backend rules, run via docker compose exec.
```

**Impact:** These files are loaded once, saving tokens on every request (-30%).

---

## 🧪 Minimize Test Examples

### Bad

```
Show me a complete RSpec test file with setup, fixtures, all test cases,
and helper methods for the new user model.
```

### Good

```
Show me the RSpec pattern for: validating email presence + uniqueness
(reference: RAILS_SETUP_GUIDE.md line 120)
```

**Impact:** -80% tokens by asking for pattern, not full example.

---

## 🔗 Link to Docs, Don't Repeat Them

### Instead of

```
Can you explain Docker Compose? How do I run services? What's the
difference between `docker compose exec` and `docker compose run`?
```

### Use

```
I read QUICK_START.md but don't understand when to use
`docker compose exec` vs `docker compose run --rm`.
Specifically for [your scenario], which one?
```

**Impact:** -70% tokens by assuming you've read docs.

---

## 📌 Bookmark These Prompts

**For Cursor / Claude Code:**

```
@claude refer to CLAUDE.md for project rules before responding
```

**For Copilot:**

```
See .copilot/instructions.md section [X] before implementing
```

**For Routine Tasks:**

```
[Task]. Use provided templates in DOCUMENTATION_STRUCTURE.md.
```

---

## ⚡ Fast Responses

### Model Selection

- **Haiku (default):** Simple questions, reading code, running tests
- **Sonnet:** Medium complexity, architecture decisions
- **Opus:** Complex debugging, multi-service refactoring

### Speed Settings

```
/fast              # 2x faster (Haiku with reduced output)
/think             # Careful reasoning (slower, use sparingly)
```

**Cost:** 1 Haiku request = ~1 token per word. 1 Opus = ~3-4x tokens.

---

## 🎯 Effective Questions Template

```
**What:** [2 sentence problem statement]
**Where:** [file path:line numbers]
**Why:** [context: why this matters]
**Constraint:** [what we're NOT doing]
**Show first:** [draft → show diff before applying]
```

**Example:**

```
**What:** User authentication not recognizing valid tokens
**Where:** backend-nestjs/src/auth/jwt.strategy.ts:45-60
**Why:** Login works but subsequent requests fail (blocking feature)
**Constraint:** Don't change existing error response format
**Show first:** Show updated validation logic in diff format before applying

Current behavior:
- Login returns valid JWT
- Subsequent requests with JWT in header fail with 401
```

---

## 🚫 Common Token Wasters

| ❌ Avoid | ✅ Instead | Savings |
|----------|-----------|---------|
| "Can you help me?" | Specific question with location | 60% |
| Full file content | Code snippet + line numbers | 70% |
| "How do I do X?" | Reference docs + specific question | 60% |
| Long explanations | "Per [doc], how do I..." | 40% |
| Multiple questions | One structured question | 50% |
| Asking for examples | "Show me the pattern for..." | 80% |
| "Fix this code" | "Update X to Y, here's why..." | 50% |
| Full error logs | Key error + relevant code lines | 70% |

---

## 📈 Scaling Token Efficiency

### For Small Tasks (< 50 tokens)

```
backend-nestjs: add @IsEmail() validator to registration DTO
```

### For Medium Tasks (100-200 tokens)

```
**Goal:** Implement user roles
**Location:** backend-nestjs/src/users/
**Files:** 
  - UserEntity (add role field)
  - UserDTO (add role property)
  - UsersService (expose role in responses)
**Pattern:** Per CLAUDE.md, inject RoleService via DI
**Test:** Show updated UserService spec before applying
```

### For Large Tasks (500+ tokens)

Use Cursor to plan first:

```
/plan Add pagination to product listing API
```

Then implement piece by piece with specific questions.

---

## 🔐 Sensitive Information

### Don't Share

- Real API keys or secrets
- Production database credentials
- Personal user data
- Actual business logic (if proprietary)

### Reference Instead

```
For database authentication, we use credentials from .env
(see .env.example for format)
```

---

## 🎓 Training Your Team

### When Onboarding

Share this document + examples:

```
When asking Claude for help:
1. Read CLAUDE.md (5 min) — project rules
2. Reference docs in your question (saves tokens)
3. Be specific: file path, line numbers, what you tried
4. Ask one focused question, not multiple
5. Use diffs for code changes, not full rewrites
```

### Expected Token Reduction

- **New developer:** 500+ tokens per question → 150-200 after training
- **Experienced:** Consistent 50-100 tokens per question
- **Routine tasks:** 10-30 tokens with good prompts

---

## 📊 Measuring Token Usage

### In Claude Web

- Token count shown in bottom right
- Aim for <200 tokens per complete interaction

### In Cursor

```
Use /tokens command to estimate
Set model to Haiku for routine work
Use /fast for speed
```

### Track Over Time

```
Week 1: Avg 300 tokens/question (new)
Week 4: Avg 80 tokens/question (trained)
```

---

## 🎯 Golden Rules

1. **Be specific** — "Add validation to registration" not "Fix auth"
2. **Use locations** — "line 45" not "somewhere in the file"
3. **Reference docs** — "Per CLAUDE.md section X" saves context
4. **Show first** — Diffs before applying saves back-and-forth
5. **Ask once** — Structured prompts get complete answers
6. **Use project context** — Avoid explaining patterns we documented
7. **Choose right model** — Haiku for routine, Opus for complex
8. **Read existing docs** — 5 min reading = 300 tokens saved

---

## 📚 Quick Reference

**These are cached (one-time token cost):**
- CLAUDE.md
- GIT_FLOW.md
- .cursor/rules.md
- .copilot/instructions.md

**Reference these in questions to save tokens:**
- RAILS_SETUP_GUIDE.md
- REACT_NATIVE_SETUP.md
- PHOENIX_ELIXIR_SETUP.md
- DOCUMENTATION_STRUCTURE.md

**For routine setup:**
- QUICK_START.md
- DOCKER_COMPOSE_TEMPLATE.md

---

## ✅ Checklist Before Asking Claude

- [ ] Read relevant docs (CLAUDE.md, service guide)
- [ ] Know file path and approximate line numbers
- [ ] Ask one specific question, not multiple
- [ ] Provide: current behavior, expected behavior
- [ ] Reference project docs in question ("Per CLAUDE.md...")
- [ ] Use correct model: Haiku (default), Sonnet (medium), Opus (hard)
- [ ] If code, show relevant snippet (10-20 lines), not full file
- [ ] Ask Claude to "show diff" before applying

---

**Goal:** Reduce average tokens/question from 300 to 50-100  
**Target:** Make AI assistance fast, cheap, and effective  
**Timeline:** 1-2 weeks for new developers to reach 100 tokens/question
