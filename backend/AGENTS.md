# Backend AGENTS.md — Mandatory Architectural Rules

When modifying or adding any feature in `backend/`:
1. **FormRequest**: Always create a Request in `app/Http/Requests/` extending `BaseFormRequest`.
2. **Controller**: Keep controllers skinny. Inject Service in constructor. No direct DB queries.
3. **Service**: Place all Eloquent queries and business logic in `app/Services/`.
4. **API Resource**: Format all JSON outputs via `app/Http/Resources/`.
5. **Contract Safety**: Never break the JSON shape consumed by `frontend/src/lib/api.ts` and `frontend/src/lib/types.ts`.

See full specification: [`BACKEND_CODING_GUIDELINES.md`](./BACKEND_CODING_GUIDELINES.md)
