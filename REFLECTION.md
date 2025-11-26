# Reflection: AI Agent Usage in Full-Stack Development

## Introduction

This project represents my first comprehensive use of AI agents (specifically Cursor Agent/Claude Code) for building a full-stack application from scratch. The experience has been both enlightening and educational, revealing both the strengths and limitations of AI-assisted development.

## What I Learned

### 1. AI Agents as Architectural Partners

While working on this project, I realised that AI agents can actually understand and follow architecture patterns really well. When I told the agent to use hexagonal architecture, it kept everything properly organised — domain models in`core/domain`, use cases in `core/application`, and adapters in the right folders. Keeping this structure consistent on both the frontend and backend would have been difficult if I did it alone.

But the agent still needed clear instructions for some parts. For example, it knew what dependency injection means, but I had to guide it on how exactly to connect services the right way. This made me understand that AI agents are great at setting up structure, but they still need human thinking for business logic and detailed decisions.

### 2. The Iterative Refinement Process

One important thing I learned is that AI-generated code is almost never perfect on the first try. The agent was very good at creating the structure and boilerplate, but the actual business logic needed several rounds of refinement. For example, the pooling allocation algorithm went through three steps:

First: The agent created the basic structure
Second: We added the greedy allocation logic
Third: We fixed and validated the exit conditions

Even though it took multiple passes, the process was still faster than writing everything from scratch. The agent took care of the repetitive parts like type definitions, imports, and the overall structure, so I could focus mainly on the complex logic.

### 3. Type Safety as a Collaboration Tool

TypeScript’s type system worked really well when collaborating with the AI agent. Whenever the agent generated interfaces or types, I could quickly check whether they matched the domain requirements. Type errors helped catch integration problems early, which made the whole development process smoother. The agent’s ability to create complete and accurate type definitions also saved a lot of time while still keeping the code quality high.

### 4. Prompt Engineering Matters

I realized that the more specific the prompt is, the better the output becomes. When I used a vague prompt like “implement banking,” the agent generated very generic code that I had to fix heavily. But when I used a clear prompt such as “implement banking with validation: CB must be positive, and the amount cannot be more than the available surplus,” the agent produced results much closer to what I needed.

 The best method I found was:
 
1) Start with high-level architecture instructions
2) Add clear and detailed business rules
3) Review, refine, and correct the code through iterations

### 5. Domain Knowledge Transfer

The agent struggled with domain-specific knowledge. For example, it didn't inherently understand Fuel EU Maritime regulations or compliance balance formulas. However, when I provided clear formulas and business rules, it implemented them correctly. This taught me that AI agents are excellent executors but need human domain expertise to guide them.

## Efficiency Gains vs Manual Coding

### Time Savings

Time Savings

Project Setup: Saved about 2 hours (package.json, configs, folder structure)

Type Definitions: Saved about 3 hours (detailed TypeScript interfaces)

Database Schema: Saved about 1 hour (Prisma schema with relations)

API Endpoints: Saved about 2 hours (Express routes with error handling)

React Components: Saved about 3 hours (component structure and basic styling)

Total Estimated Savings: Around 11–12 hours (about 50% of total development time)

Quality Improvements

Consistency
The agent kept patterns consistent across the codebase, so it was easier to move between files without rethinking everything.

Type Safety
The generated types were quite complete and helped catch many bugs early through TypeScript errors.

Architecture Adherence
The agent helped me stick to hexagonal architecture principles, which would have been harder to maintain manually.

Where Manual Work Was Still Required

Business Logic Refinement – Around 4 hours tuning algorithms and handling edge cases

Error Handling – Around 2 hours adding proper error messages and flows

UI/UX Polish – Around 2 hours improving layout, messages, and usability

Testing – Around 3 hours writing domain-specific test cases

Documentation – Around 2 hours creating clear, detailed docs

Challenges Encountered
1. Context Window Limitations

Sometimes the agent lost track of earlier context, especially with large files or when switching between frontend and backend. I had to repeat important details in prompts or break the work into smaller pieces.

2. Hallucination of Non-Existent APIs

At times, the agent suggested functions or properties that didn’t actually exist in the libraries. For example, it made up Prisma methods. I had to double-check these against the official documentation.

3. Over-Engineering

Sometimes the agent produced solutions that were more complex than needed. For example, it created heavy validation layers where simple checks were enough. I had to simplify these parts myself.

4. Testing Gaps

The agent could generate basic test structures, but it struggled with real, domain-specific scenarios. I had to write tests that actually covered business rules and edge cases.

Improvements for Next Time
1. Start with Tests

Next time, I would start from test cases (or ask the agent to generate them from the requirements) before writing the main code. This would act as a clear spec and help catch problems earlier.

2. Incremental Validation

Instead of asking for large chunks of code, I would move step by step:

- Generate domain models → Check them
- Generate use cases → Test them
- Generate adapters → Integrate and verify

This would reduce refactoring and make debugging easier.

3. Better Prompt Templates

I’d prepare reusable prompt templates for common tasks, for example:

“Generate a use case for [feature] that [does X] with validation [Y]”

“Create a React component for [tab] with [features] using TailwindCSS”

This would make the output more consistent and reduce back-and-forth.

4. Documentation-First Approach

I’d first ask the agent to generate documentation (API specs, component props, etc.) before writing the actual code. That documentation would act like a contract for the implementation.

5. Pair Programming Mentality

I’d treat the agent more like a pair programming partner:

- Explain the reasons behind decisions
- Review its code carefully
- Refactor step by step together

6. Domain Knowledge Documentation

I’d create a “domain knowledge” file that the agent can refer to, containing:

- Business rules
- Formulas
- Validation conditions
- Common edge cases

This would help the agent understand the project domain better and reduce misunderstandings in the generated code.

## Conclusion

Using AI agents for full-stack development turned out to be a very useful experience. The agent was excellent at:

- Generating boilerplate and project structure

- Keeping the architecture consistent

- Creating type-safe interfaces

- Following common design patterns

But human guidance was still important for:

- Refining business logic

- Applying domain knowledge

- Handling edge cases

- Ensuring overall quality

The best way to work with the agent was to treat it like a skilled junior developer. It can produce strong results when given clear instructions, but it still needs review, correction, and domain understanding to reach production-ready quality.

The time savings were noticeable (around 50%), but the bigger advantage was how well the agent helped maintain clean structure and consistent architecture—something that is harder to keep up manually. The main success factor was balancing the agent’s strengths with human decision-making.

In future projects, I would definitely use AI agents again, but with a more organized process: clearer prompts, regular validation, and proper sharing of domain rules. Combining the agent’s speed with human expertise creates a highly effective development workflow.
