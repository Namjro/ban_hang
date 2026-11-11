# AGENTS.md — Frontend AI Coding Rules (`frontend/`)

When working inside `frontend/`, you MUST follow the 5-layer Production Next.js Architecture defined in [`FRONTEND_CODING_GUIDELINES.md`](./FRONTEND_CODING_GUIDELINES.md):

`Page / Route Container → Feature Component → Custom Hook / Utils → Typed API Service → Axios Client`

## Non-Negotiable Rules
1. **No Direct Axios Calls in Pages/Components**: Never import `api` from `@/lib/api` inside `src/app/**` or `src/components/**`. Always call typed methods in `src/services/*.service.ts`.
2. **Modular Feature Components**: Keep page and component files concise (< 350 lines). Extract modals, filter sidebars, galleries, and tabs into `src/components/products/` or `src/components/admin/`.
3. **Centralized Auth & Error Handling**:
   - Always use `authStorage` (`@/lib/auth-storage`) instead of raw `localStorage`.
   - Always use `getApiErrorMessage(err, fallback)` (`@/lib/error-handler`) with `catch (err: unknown)` instead of `catch (err: any)`.
4. **Search Debouncing & URL Sync**:
   - Always debounce live search inputs with `useDebounce(search, 300)` (`@/hooks/useDebounce`).
   - Keep catalog filters synced with URL query parameters (`useSearchParams` wrapped in `<Suspense>`).
5. **Verification**: Always run `Push-Location frontend; npx tsc --noEmit; npm run lint; Pop-Location` after making changes.
