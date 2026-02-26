# Next.js Coding Style & Dependency Injection

## 1. Constructor Injection Standard
To ensure testability, encapsulation, and loose coupling, all **Services** and **Repositories** must use **Constructor Injection**.

### Syntax Rule
Use the `private readonly` shorthand inside the class constructor. Do not manually declare properties if the shorthand works.

```typescript
// MANDATORY SERVICE SYNTAX
export class LearningService {
  constructor(
    private readonly subjectRepo: SubjectRepository, 
    private readonly topicRepo: TopicRepository,     
    private readonly db: DatabaseType,               
    private readonly ctx: AuthContext                
  ) {}

  public async getSubject(id: string) {
      return this.subjectRepo.find(id);
  }
}
```

## 2. Module Factory (The Dependency Container)
To prevent "Import Hell" and manual dependency wiring across hundreds of API routes, the project uses a central **Module Factory**.

### What it does:
Located at `lib/domain/Domain.factory.ts`, it instantiates Services *only when they are accessed* using **Lazy Getters**. It injects the `AuthContext` natively.

### Syntax Rule
Do not instantiate `new Repository(...)` inside a `.service.ts` method. Pass them entirely through the `Domain.factory.ts`.

```typescript
// Domain.factory.ts snippet
export class ModuleFactory {
  constructor(private readonly ctx: AuthContext) {}

  get learning() {
    // Repositories injected first
    const subjectRepo = new SubjectRepository(db);
    const topicRepo = new TopicRepository(db);
    
    // Service returns fully wired
    return new LearningService(subjectRepo, topicRepo, db, this.ctx);
  }
}
```

## 3. Controller Guidelines (API Routes)
In the Next.js App Router endpoints (`route.ts`), you **must only interact with the ModuleFactory**.

```typescript
// Example endpoint
export const GET = unifiedApiHandler(async (req: NextRequest, ctx: UnifiedContext) => {
    // 1. ctx.module is the ModuleFactory
    // 2. We extract the exact service we need
    const { learning } = ctx.module;
    
    // 3. Execution (Repositories & DB are completely hidden from the route layer)
    const data = await learning.getSubject(ctx.params.id);
    return okResponse(data);
});
```

## 4. Why these rules are enforced (Guardrails)
* **Encapsulation:** API routes are completely prevented from touching the Repository or Database layer directly.
* **Single Source of Truth:** Upgrading a service constructor only requires a single update in `Domain.factory.ts`.
* **Testability:** During Jest/Vitest runs, the database or contexts can be effortlessly mocked simply by passing dummy objects to the service constructor.
