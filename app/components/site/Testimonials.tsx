import { Quote, Star } from "lucide-react";
import laundryDoodle from "@/assets/doodles/Laundry and dry cleaning-bro.svg";
import blobBg from "@/assets/blobs/254596558522.jpg";



const items = [
  {
    name: "Priya S.",
    location: "Megapolis, Hinjewadi Phase 3",
    text: "Found a wonderful cooking maid through SakhiHome within 2 days. She's been with us for months now — reliable and warm.",
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
    <section className="relative py-12 bg-background overflow-hidden">
      {/* Blob background texture */}
      <img
        src={blobBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.035] pointer-events-none select-none mix-blend-multiply"
      />


      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center mb-14 max-w-5xl mx-auto text-center md:text-left">
          <div className="hidden md:flex justify-start">
            <img src={laundryDoodle} alt="Happy Customers" className="w-56 lg:w-72 object-contain drop-shadow-xl animate-float" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-gradient-brand-soft px-4 py-1 text-xs font-bold text-primary-deep uppercase tracking-wider">
              Real Stories
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold text-primary-deep text-balance">
              What <span className="text-gradient-brand">Hinjewadi families</span> say
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-3xl bg-card border border-border p-7 shadow-soft hover:shadow-card transition-smooth hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-10 blur-2xl transition-smooth" aria-hidden />
              <Quote className="absolute top-6 right-6 h-9 w-9 text-accent/40" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 text-foreground/75 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-brand text-white font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-primary-deep">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
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
