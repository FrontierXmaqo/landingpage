import { signOut } from "./login/actions";

/** Server-action sign-out: the session cookie is HttpOnly, so only the server can clear it. */
export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="w-full rounded-lg border border-base-line px-3 py-2 text-left text-sm font-medium text-base-slate transition-colors duration-150 hover:border-status-critical hover:text-status-critical"
      >
        Sign out
      </button>
    </form>
  );
}
