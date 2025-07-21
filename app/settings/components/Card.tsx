export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-xl shadow-card p-6 mb-4 flex flex-col gap-4 ${className}`}>
      {children}
    </section>
  );
} 