export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
      {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
    </header>
  );
}
