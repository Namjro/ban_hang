# AGENTS.md — AI Coding Rules & Architectural Guidelines

Every AI agent (Antigravity, Cursor, Claude, Copilot, Windsurf, etc.) and developer working on this repository MUST strictly follow both the **Backend 4-Layer Architecture** and the **Frontend 5-Layer Production Architecture**.

---

## 1. Backend Mandatory Architecture (`backend/`): `FormRequest → Controller → Service → API Resource`

1. **`FormRequest` (`backend/app/Http/Requests/`)**:
   - Must extend `App\Http\Requests\BaseFormRequest`.
   - All input validation rules and custom error messages MUST be defined here.
   - NEVER call `Validator::make()` or `$request->validate()` inside Controllers.

2. **`Controller` (`backend/app/Http/Controllers/Api/`)**:
   - Controllers must be strictly **skinny controllers** (orchestrator only).
   - Inject the corresponding Service via Constructor Dependency Injection.
   - NEVER query Eloquent models or write business logic directly inside Controllers.
   - Return API responses using `JsonResource` instances or collections.

3. **`Service` (`backend/app/Services/`)**:
   - All business logic, Eloquent queries, slug generation, image handling, domain checks, and calculations MUST reside here.
   - Do NOT access `request()` directly; pass validated arrays or primitive types as arguments.
   - Throw `DomainException` with friendly Vietnamese messages for business rule violations.

4. **`API Resource` (`backend/app/Http/Resources/`)**:
   - All output data returned to the Frontend Next.js client MUST be transformed via `JsonResource`.
   - Preserve existing JSON response shapes: `{ success: true, data: ..., pagination: ..., meta: ... }`.

- **Detailed Backend Reference**: [`backend/BACKEND_CODING_GUIDELINES.md`](./backend/BACKEND_CODING_GUIDELINES.md)
- **Backend Verification Command**: `Push-Location backend; & .\vendor\bin\phpunit; Pop-Location`

---

## 2. Frontend Mandatory Architecture (`frontend/`): `Page → Feature Component → Hook/Util → Typed Service → Axios Client`

1. **`Typed API Services` (`frontend/src/services/*.service.ts`)**:
   - All HTTP requests (`api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`) MUST be encapsulated inside `src/services/*.service.ts`.
   - NEVER import `api` from `@/lib/api` directly inside `src/app/**` or `src/components/**`.

2. **`Feature & UI Components` (`frontend/src/components/**`)**:
   - Keep pages and components modular (< 350 lines per file). Extract complex modals, filter sidebars, image galleries, and tabs into `src/components/products/` or `src/components/admin/`.
   - Sync modal initial props (such as `initialSku` or `editingProduct`) inside `useEffect([isOpen, ...])`.

3. **`Hooks, Auth Storage & Error Handling` (`frontend/src/hooks/`, `frontend/src/lib/`, `frontend/src/constants/`)**:
   - Debounce all search inputs using `useDebounce(search, 300)` (`@/hooks/useDebounce`).
   - Use `authStorage` (`@/lib/auth-storage`) for all JWT token and admin user storage operations (never call `localStorage` directly in components).
   - Use `getApiErrorMessage(err, fallback)` (`@/lib/error-handler`) with `catch (err: unknown)` instead of `any`.
   - Place shared static arrays and presets in `src/constants/index.ts`.

- **Detailed Frontend Reference**: [`frontend/FRONTEND_CODING_GUIDELINES.md`](./frontend/FRONTEND_CODING_GUIDELINES.md)
- **Frontend Verification Command**: `Push-Location frontend; npx tsc --noEmit; npm run lint; Pop-Location`
