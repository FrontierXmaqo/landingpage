import { signOut } from "./login/actions";
import { IconLogOut } from "./navIcons";

/** Server-action sign-out: the session cookie is HttpOnly, so only the server can clear it. */
export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        aria-label="Sign out"
        title="Sign out"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-bg-raised hover:text-status-critical"
      >
        <IconLogOut className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
}
