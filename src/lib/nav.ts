/** Сайттың беттері (хидер мен футер осы тізімді қолданады) */
export interface NavItem {
  href: string;
  label: string;
  hint: string;
}

export const NAV: NavItem[] = [
  { href: "/", label: "Басты бет", hint: "Хиро, топтар, танымал аспаптар" },
  { href: "/aspaptar", label: "Аспаптар", hint: "14 аспап каталогы" },
  { href: "/anyzdar", label: "Аңыздар", hint: "6 халық аңызы" },
  { href: "/tarih", label: "Тарих", hint: "8 тарихи кезең" },
  { href: "/oiyn", label: "Ойындар", hint: "Викторина, «Жұп тап», флеш-карталар" },
  { href: "/sozdik", label: "Сөздік", hint: "32 түсінік" },
  { href: "/about", label: "Жоба туралы", hint: "Мақсаты мен нұсқаулығы" },
];

/** Беттің белсенді екенін тексеру */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
