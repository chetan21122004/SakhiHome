import { Quote, Star } from "lucide-react";
const laundryDoodle = "/assets/doodles/Laundry and dry cleaning-bro.svg";
const blobBg = "/assets/blobs/254596558522.jpg";



const items = [
  {
    name: "Priya S.",
    location: "Megapolis, Hinjewadi Phase 3",
    text: "Found a wonderful cooking maid through SakhiHome within 2 days. She's been with us for months now -reliable and warm.",
  },
  {
    name: "Rahul M.",
    location: "Blue Ridge, Phase 1",
    text: "When our previous maid left suddenly, SakhiHome arranged a replacement in under 48 hours. Lifesaver for a working couple.",
  },
  {
    name: "Anjali K.",
    location: "Hinjewadi Phase 2",
    text: "Loved the personal touch. They actually listen to what we need and don't just send anyone. Truly local and trustworthy.",
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-10 md:py-12 bg-background overflow-hidden">
      {/* Blob background texture */}
      <img
        src={blobBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.03] md:opacity-[0.035] pointer-events-none select-none mix-blend-multiply"
      />


      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-5 md:gap-8 items-center mb-10 md:mb-14 max-w-5xl mx-auto text-center md:text-left">
          <div className="hidden md:flex justify-start">
            <img src={laundryDoodle} alt="Happy Customers" className="w-56 lg:w-72 object-contain drop-shadow-xl animate-float" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-gradient-brand-soft px-3.5 md:px-4 py-1 text-[10px] md:text-xs font-bold text-primary-deep uppercase tracking-[0.18em] md:tracking-wider">
              Real Stories
            </span>
            <h2 className="mt-3 md:mt-4 font-display text-[1.9rem] leading-tight sm:text-4xl md:text-5xl md:leading-tight font-extrabold text-primary-deep text-balance">
              What <span className="text-gradient-brand">Hinjewadi families</span> say
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground md:hidden">
              Trusted experiences from families across Phase 1, Phase 2, and nearby communities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl md:rounded-3xl bg-card/95 border border-border p-5 sm:p-6 md:p-7 shadow-soft hover:shadow-card transition-smooth md:hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 h-28 w-28 md:h-32 md:w-32 rounded-full bg-gradient-brand opacity-10 md:opacity-0 md:group-hover:opacity-10 blur-2xl transition-smooth" aria-hidden />
              <Quote className="absolute top-4 right-4 md:top-6 md:right-6 h-7 w-7 md:h-9 md:w-9 text-accent/35 md:text-accent/40" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 md:h-4 md:w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-3.5 md:mt-4 text-sm md:text-base text-foreground/80 md:text-foreground/75 leading-relaxed">
                {`\u201C${t.text}\u201D`}
              </p>
              <div className="mt-5 md:mt-6 pt-4 md:pt-5 border-t border-border flex items-center gap-3">
                <div className="grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-full bg-gradient-brand text-white text-sm md:text-base font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm md:text-base text-primary-deep">{t.name}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
