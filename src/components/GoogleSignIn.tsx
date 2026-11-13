/** Brutalist "Sign in with Google" button. */
export function GoogleSignIn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="brut-sm brut-tap flex w-full items-center justify-center gap-3 rounded-xl bg-paper py-3 font-bold text-ink"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v7.8h12.6c-.3 2.1-1.6 5.2-4.7 7.3l7.2 5.6c4.3-4 6.9-9.9 6.9-16.6z" />
        <path fill="#FBBC05" d="M10.4 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.8-6.1C1 15.8 0 19.8 0 23.5s1 7.7 2.6 10.9l7.8-6.1z" />
        <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.6l-7.2-5.6c-2 1.4-4.7 2.3-8.1 2.3-6.3 0-11.7-3.7-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
      </svg>
      Sign in with Google
    </button>
  );
}
