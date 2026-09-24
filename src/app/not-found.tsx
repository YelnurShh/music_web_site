import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-20">
      <div className="mx-auto w-[min(100%-2rem,720px)] text-center">
        <p className="font-head text-6xl">🎻</p>
        <h1 className="mt-4 font-head text-3xl">Бет табылмады</h1>
        <p className="mt-2 text-ink-soft">
          Мұндай бет жоқ немесе ол басқа мекенжайға көшірілген. Төмендегі сілтемелер арқылы жалғастыра
          беріңіз.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn no-underline">
            🏠 Басты бетке қайту
          </Link>
          <Link href="/aspaptar" className="btn btn-ghost no-underline">
            🎼 Аспаптар каталогы
          </Link>
        </div>
      </div>
    </section>
  );
}
