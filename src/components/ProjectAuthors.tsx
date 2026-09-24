import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  PROJECT_AUTHORS,
  authorGenitive,
  authorInitials,
  authorShortName,
  type ProjectAuthor,
} from "@/data/authors";
import { cn } from "@/lib/utils";

/**
 * ProjectAuthors — жобаның екі авторын көрсететін карточка:
 * ғылыми жетекші (мұғалім) және жоба авторы (оқушы).
 *
 * Фотосурет қойылмаған жағдайда аты-жөнінің бас әріптері жазылған әдемі
 * дөңгелек аватар шығады. Фотосуретті қою үшін `public/img/teacher.jpg`
 * және `public/img/student.jpg` файлдарын салсаңыз жеткілікті.
 */
function photoExists(src: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
  } catch {
    /* Файл жүйесіне қол жетпесе — қауіпсіз түрде плейсхолдерге қайтамыз */
    return false;
  }
}

/** Қазақы өрнек: екі сызық пен үш ромбтан тұратын бөлгіш */
function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 18"
      className={cn("h-4 w-40 text-gold", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9h78" />
      <path d="M140 9h78" />
      <path d="M110 2.5l6.5 6.5-6.5 6.5-6.5-6.5z" />
      <path d="M92 4l5 5-5 5-5-5z" opacity="0.7" />
      <path d="M128 4l5 5-5 5-5-5z" opacity="0.7" />
    </svg>
  );
}

/** Аватар: фотосурет болса — фото, болмаса — бас әріптер */
function Avatar({ author, hasPhoto }: { author: ProjectAuthor; hasPhoto: boolean }) {
  return (
    <span className="relative grid h-28 w-28 shrink-0 place-items-center sm:h-32 sm:w-32">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-dashed border-line-strong"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[7px] rounded-full bg-[linear-gradient(150deg,var(--accent-soft),var(--gold-soft)_58%,var(--teal-soft))] ring-1 ring-gold/50"
      />
      {hasPhoto ? (
        <span className="absolute inset-[7px] overflow-hidden rounded-full shadow-[var(--shadow-md)]">
          <Image
            src={author.photo}
            alt={author.photoAlt}
            fill
            sizes="128px"
            className="object-cover object-[50%_25%]"
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="relative font-head text-[1.65rem] font-bold tracking-[0.08em] text-accent-dark sm:text-[1.9rem]"
        >
          {authorInitials(author)}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-1 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-[1rem] leading-none shadow-[var(--shadow-sm)]"
      >
        {author.badge}
      </span>
    </span>
  );
}

/** Бір адамның карточкасы: аватар, қызметі және аты-жөні */
function AuthorCard({ author, hasPhoto }: { author: ProjectAuthor; hasPhoto: boolean }) {
  return (
    <figure className="m-0 flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-5 text-center shadow-[var(--shadow-sm)]">
      <Avatar author={author} hasPhoto={hasPhoto} />
      <figcaption className="flex flex-col items-center gap-1">
        <span className={cn("tag", author.tagClass)}>{author.role}</span>
        <span className="mt-1 block font-head text-[1.02rem] leading-snug font-bold text-ink">
          {authorShortName(author)}
        </span>
        <span className="block text-[0.86rem] leading-tight text-muted">{author.patronymic}</span>
      </figcaption>
    </figure>
  );
}

export function ProjectAuthors({
  className,
  title = "Жобаны кім жасады?",
  eyebrow = "🎓 Ғылыми жоба",
}: {
  className?: string;
  /** `null` берілсе, ішкі тақырып шықпайды (бет өзінің тақырыбын қояды) */
  title?: string | null;
  eyebrow?: string;
}) {
  const photos = PROJECT_AUTHORS.map((author) => photoExists(author.photo));

  return (
    <aside
      aria-labelledby={title ? "project-authors-title" : undefined}
      aria-label={title ? undefined : "Жоба авторлары"}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent via-gold to-teal"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--gold-soft),transparent_68%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_68%)]"
      />

      <div className="relative p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow mb-0">{eyebrow}</span>
          <OrnamentDivider className="hidden sm:block" />
        </div>

        {title ? (
          <h2 id="project-authors-title" className="mt-3 font-head text-[clamp(1.2rem,2vw,1.45rem)]">
            {title}
          </h2>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PROJECT_AUTHORS.map((author, index) => (
            <AuthorCard key={author.id} author={author} hasPhoto={photos[index]} />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center">
          <OrnamentDivider className="w-full max-w-xs opacity-80" />
        </div>

        <p className="mt-3 mb-0 rounded-2xl border border-line bg-bg-alt px-4 py-3 text-center text-[0.97rem] leading-relaxed text-ink-soft">
          Осы ғылыми жоба{" "}
          <strong className="font-semibold text-ink">{authorGenitive(PROJECT_AUTHORS[0])}</strong>{" "}
          ғылыми жетекшілігімен,{" "}
          <strong className="font-semibold text-ink">{authorGenitive(PROJECT_AUTHORS[1])}</strong>{" "}
          орындауымен жасалып шықты.
        </p>
      </div>
    </aside>
  );
}
