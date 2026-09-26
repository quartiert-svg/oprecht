export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
        Oprecht
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        Eerlijk daten voor een serieuze relatie
      </h1>
      <p className="text-lg text-stone-600">
        Milestone 0 skeleton. Marketing tour, auth en i18n volgen via de M0-tickets.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-stone-600">
        <li>Flanders-first (NL), FR/EN product-ready</li>
        <li>Values quiz → curated matches</li>
        <li>Freemium via Mollie</li>
      </ul>
    </main>
  );
}
