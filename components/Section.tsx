export default function Section({
  title,
  children,
  right,
}: {
  title?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="px-5 py-3">
      {(title || right) && (
        <div className="flex items-center justify-between mb-2">
          {title && <h2 className="text-sm font-semibold text-stone-700">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
