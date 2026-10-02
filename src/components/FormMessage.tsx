export type FormState = { error?: string; ok?: string } | undefined;

export function FormMessage({ state }: { state: FormState }) {
  if (state?.error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>;
  if (state?.ok) return <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{state.ok}</p>;
  return null;
}
