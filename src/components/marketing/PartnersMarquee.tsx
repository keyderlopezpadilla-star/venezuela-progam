'use client';

const PARTNERS = [
  'ACNUR', 'Cruz Roja', 'UNICEF', 'FAO', 'OPS', 'Médicos Sin Fronteras',
  'Fundación Pueblo Nuevo', 'Caritas', 'UNICEF', 'Banco de Alimentos',
];

export function PartnersMarquee({ locale: _locale }: { locale: string }) {
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="container">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Aliados institucionales
        </p>
        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-muted/30 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-muted/30 to-transparent" />
          <div className="flex animate-marquee gap-12 whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="font-display text-2xl font-semibold tracking-tight text-muted-foreground/60"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}