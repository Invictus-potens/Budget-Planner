export function Card({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`bg-white rounded-xl shadow-card p-6 mb-4 flex flex-col gap-4 ${className}`}>
      {children}
    </section>
  );
} 