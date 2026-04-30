import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
const cleaningDoodle = "/assets/doodles/cleaning service-amico.svg";
const blobBg = "/assets/blobs/254596558522.jpg";

const WHATSAPP = "https://wa.me/919172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";

const stats = [
  { icon: Users, num: "500+", label: "Maids in network" },
  { icon: MapPin, num: "8", label: "Areas covered" },
  { icon: Heart, num: "24-48h", label: "Replacement time" },
  { icon: CheckCircle2, num: "100%", label: "Local matching" },
];

const promises = [
  "Background-verified, locally-known helpers",
  "One real human you can call -no chatbots",
  "We stay involved long after day one",
];

const About = () => {
  return (
    <section id="about" className="relative py-12 bg-background overflow-hidden">
      
      {/* Subtle brand orbs */}
      <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 -right-32 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[150px] pointer-events-none" aria-hidden />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          
          {/* Left -content */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-primary/20 shadow-soft px-4 py-1.5 text-xs font-bold text-primary-deep uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              About SakhiHome
            </span>
            <h2 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-black text-primary-deep text-balance leading-[1.05] tracking-tight">
              Your local maid partner in <span className="text-gradient-brand">Hinjewadi</span>
            </h2>
            <p className="mt-6 text-lg text-foreground/75 leading-relaxed max-w-xl">
              Built on a strong local network, SakhiHome connects families in Hinjewadi with trusted,
              experienced domestic help -managed with a personal touch, focused on{" "}
              <span className="font-bold text-primary-deep">reliability, quick response, and long-term trust</span>.
            </p>

            {/* Promise list */}
            <ul className="mt-8 space-y-4">
              {promises.map((p) => (
                <li key={p} className="flex items-start gap-4 group">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-glow">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground/80 font-medium group-hover:text-primary-deep transition-colors duration-300">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group" asChild>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Sparkles className="h-4 w-4" /> Talk to Us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right -Mobile (clean stack) */}
          <div className="mt-10 md:hidden">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-soft p-6 shadow-card">
              <img
                src={blobBg}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.1]"
              />
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent/20 blur-[80px]" aria-hidden />
              <img
                src={cleaningDoodle}
                alt="Illustration of a home cleaning professional for Hinjewadi and Pune households"
                className="relative mx-auto w-full max-w-[240px] object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <p className="font-display text-lg font-extrabold text-primary-deep leading-none">{s.num}</p>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right -Desktop visual (unchanged) */}
          <div className="relative mt-12 hidden min-h-[600px] items-center justify-center md:flex lg:mt-0">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative h-[450px] w-[450px] rounded-[80px] overflow-hidden shadow-2xl animate-float" style={{ animationDuration: "6s" }}>
                <div className="absolute inset-0 bg-gradient-brand opacity-40 mix-blend-color z-10" />
                <div className="absolute inset-0 bg-white/20 z-10 backdrop-blur-[2px]" />
                <img
                  src={blobBg}
                  alt=""
                  className="w-full h-full object-cover scale-150"
                />
              </div>
            </div>

            <img
              src={cleaningDoodle}
              alt="Illustration of a home cleaning professional for Hinjewadi and Pune households"
              className="relative z-20 w-[450px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-float pointer-events-none"
              style={{ animationDuration: "5s", animationDelay: "0.5s" }}
            />

            <div className="absolute inset-0 pointer-events-none z-30">
              {stats.map((s, i) => {
                const positions = [
                  "md:top-8 md:-left-8",
                  "md:bottom-12 md:-left-4",
                  "md:top-4 md:-right-8",
                  "md:bottom-20 md:-right-4",
                ];
                const delays = ["0s", "1s", "0.5s", "1.5s"];

                return (
                  <div
                    key={s.label}
                    className={`absolute ${positions[i]} pointer-events-auto group rounded-[1.5rem] bg-white/90 backdrop-blur-xl border border-white p-5 shadow-[0_15px_40px_-10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_20px_50px_-10px_rgba(var(--accent-rgb),0.2)] transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden animate-float`}
                    style={{ animationDelay: delays[i] }}
                  >
                    <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700" aria-hidden />

                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/5 text-primary shadow-sm group-hover:bg-gradient-brand group-hover:text-white transition-all duration-500 group-hover:shadow-glow">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="pr-2">
                        <p className="font-display text-3xl font-extrabold text-primary-deep leading-none group-hover:text-primary transition-colors duration-300">{s.num}</p>
                        <p className="mt-1 text-xs font-bold text-foreground/50 uppercase tracking-widest">{s.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

