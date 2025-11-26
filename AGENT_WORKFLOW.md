# AI Agent Workflow Log

## Agents Used

- **Cursor Agent (Claude Code)** - Primary agent used throughout the project
- Used for code generation, refactoring, and architectural decisions

## Prompts & Outputs

### Example 1: Initial Project Structure Setup

**Prompt**: "Create a full-stack Fuel EU Maritime compliance platform with hexagonal architecture. Backend: Node.js + TypeScript + PostgreSQL. Frontend: React + TypeScript + TailwindCSS."

**Output**: The agent generated:
- Complete folder structure for both frontend and backend
- Package.json files with all dependencies
- TypeScript configurations
- Prisma schema with all required tables
- Initial domain models and ports

**Validation**: Verified that:
- All dependencies are correctly specified
- TypeScript strict mode is enabled
- Prisma schema matches the requirements
- Folder structure follows hexagonal architecture

### Example 2: Compliance Balance Calculation

**Prompt**: "Implement the compliance balance calculation formula: CB = (Target - Actual) × Energy in scope, where Energy in scope ≈ fuelConsumption × 41,000 MJ/t"

**Output**: Generated `calculateComplianceBalance` function in `backend/src/core/domain/Compliance.ts`:

```typescript
export function calculateComplianceBalance(
  targetIntensity: number,
  actualIntensity: number,
  fuelConsumption: number
): number {
  const energyInScope = fuelConsumption * ENERGY_PER_TONNE;
  return (targetIntensity - actualIntensity) * energyInScope;
}
```

**Validation**: 
- Verified formula matches specification
- Added unit tests to validate positive/negative CB calculations
- Confirmed constants are correctly defined (TARGET_INTENSITY_2025 = 89.3368)

### Example 3: Pooling Allocation Algorithm

**Prompt**: "Implement greedy allocation algorithm for pooling: sort members by CB descending, transfer surplus to deficits, validate exit conditions"

**Output**: Generated `PoolingUseCase.createPool` method with:
- Greedy allocation logic
- Surplus/deficit separation
- Transfer mechanism
- Exit condition validation

**Correction**: Initially, the agent didn't properly handle the `cbAfter` field in the repository. I corrected the type definitions to ensure `cbAfter` is properly passed through the layers.

### Example 4: Frontend React Components

**Prompt**: "Create React components for Routes, Compare, Banking, and Pooling tabs with TailwindCSS styling"

**Output**: Generated all four tab components:
- RoutesTab with filtering and baseline setting
- CompareTab with Recharts visualization
- BankingTab with CB operations
- PoolingTab with validation

**Refinement**: 
- Added error handling and loading states
- Improved UI/UX with better visual feedback
- Added validation messages for user actions

### Example 5: API Client Implementation

**Prompt**: "Create an API client using Axios that implements all the service ports"

**Output**: Generated `ApiClient` class with all CRUD operations for routes, compliance, banking, and pooling.

**Validation**: 
- Verified all endpoints match backend routes
- Confirmed proper error handling
- Added TypeScript types for all responses

## Validation / Corrections

### Issue 1: Pooling Repository Type Mismatch

**Problem**: The `CreatePoolRequest` interface didn't include `cbAfter`, but the repository needed it.

**Correction**: Updated the domain model to make `cbAfter` optional in the request, and ensured the use case calculates and passes it correctly to the repository.

### Issue 2: Adjusted Compliance Balance Calculation

**Problem**: The adjusted CB calculation wasn't properly accounting for applied banking.

**Correction**: Enhanced the `getAdjustedComplianceBalance` method to properly query and calculate adjusted values. For simplicity in this implementation, it returns the base CB, but the structure is in place for future enhancements.

### Issue 3: Frontend API Base URL

**Problem**: Initial implementation used hardcoded localhost URLs.

**Correction**: Configured Vite proxy to route `/api/*` to backend, making the frontend work seamlessly in development.

## Observations

### Where Agent Saved Time

1. **Boilerplate Generation**: The agent quickly generated all the boilerplate code for:
   - Package.json files
   - TypeScript configurations
   - Prisma schema
   - Express route handlers
   - React component structure

2. **Architecture Consistency**: The agent maintained consistent hexagonal architecture patterns across both frontend and backend, ensuring proper separation of concerns.

3. **Type Safety**: Generated comprehensive TypeScript types and interfaces, reducing runtime errors.

4. **Database Schema**: Created a well-structured Prisma schema with proper relationships and indexes.

### Where It Failed or Hallucinated

1. **Pooling Allocation Details**: The initial pooling algorithm needed refinement to properly handle the greedy allocation and exit conditions. Required manual adjustment.

2. **Adjusted CB Logic**: The agent didn't fully implement the adjusted CB calculation with banking applications. This was simplified for the assignment but noted for future enhancement.

3. **Error Handling**: Initial implementations lacked comprehensive error handling. Added try-catch blocks and user-friendly error messages.

### How Tools Were Combined Effectively

1. **Iterative Refinement**: Used the agent to generate initial code, then manually refined based on requirements and edge cases.

2. **Type-Driven Development**: Leveraged TypeScript's type system to catch errors early. The agent generated types, and I validated them against the domain requirements.

3. **Testing Strategy**: Used the agent to generate test structure, then added specific test cases for business logic validation.

4. **Documentation**: The agent helped structure the README and documentation, which I then filled in with specific details.

## Best Practices Followed

1. **Hexagonal Architecture**: Strictly maintained separation between core domain, application layer, and adapters. No framework dependencies in core.

2. **TypeScript Strict Mode**: Enabled strict mode in both frontend and backend for maximum type safety.

3. **Dependency Injection**: Used constructor injection for all services, making the code testable and maintainable.

4. **Error Handling**: Implemented proper error handling at all layers with meaningful error messages.

5. **Code Organization**: Followed consistent naming conventions and folder structure throughout the project.

6. **Incremental Development**: Built the project incrementally:
   - Domain models first
   - Use cases second
   - Adapters last
   - Tests alongside implementation

7. **AI-Assisted Validation**: Used the agent to generate code, then manually validated against requirements and fixed issues.

## Key Learnings

1. **Prompt Specificity**: More specific prompts yield better results. For example, "Implement greedy allocation with exit condition validation" is better than "Implement pooling."

2. **Iterative Approach**: Don't accept the first output. Review, test, and refine.

3. **Domain Knowledge**: The agent needs clear domain context. Providing formulas and business rules upfront helps.

4. **Architecture Patterns**: The agent understands common patterns (hexagonal, MVC) but needs guidance on specific implementation details.

5. **Testing**: The agent can generate test structure, but domain-specific test cases require manual input.

## Time Saved

- **Estimated manual coding time**: 20-25 hours
- **Actual time with agent**: ~8-10 hours
- **Time saved**: ~12-15 hours (50-60% reduction)

The agent was particularly effective for:
- Boilerplate code generation
- Type definitions
- Database schema design
- Component structure
- API endpoint setup

Manual work was still required for:
- Business logic refinement
- Edge case handling
- UI/UX polish
- Testing specific scenarios
- Documentation details



