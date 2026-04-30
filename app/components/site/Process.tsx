import { MessageSquare, UserSearch, CheckCircle2, Headphones } from "lucide-react";
import Sparkles from "./Sparkles";
const cookingDoodle = "/assets/doodles/Cooking-bro.svg";


const steps = [
  { icon: MessageSquare, title: "Share Requirement", desc: "Tell us what you need via WhatsApp or call." },
  { icon: UserSearch, title: "Get Matched", desc: "We shortlist available maids near your location." },
  { icon: CheckCircle2, title: "Choose & Confirm", desc: "Pick the right fit and start service quickly." },
  { icon: Headphones, title: "Ongoing Support", desc: "We're here for replacements & assistance anytime." },
];

const MobileProcess = () => (
  <div className="md:hidden">
    <div className="mx-auto max-w-[26rem] text-left">
      <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
        How it works
      </span>
      <p className="mt-4 font-display text-[1.9rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-dark-foreground">
        Simple, <span className="text-gradient-brand">refined</span> process
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-dark-muted">
        From enquiry to confirmed maid, each step is clear and professionally managed.
      </p>
    </div>

    <ol className="mx-auto mt-6 max-w-[26rem] space-y-3">
      {steps.map(({ icon: Icon, title, desc }, i) => (
        <li key={title} className="relative rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-md">
          {i < steps.length - 1 && (
            <span className="pointer-events-none absolute left-8 top-[3.2rem] h-8 w-px bg-gradient-to-b from-accent/60 to-transparent" aria-hidden />
          )}
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-pop">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[15px] font-bold leading-tight text-dark-foreground">{title}</p>
                <span className="text-[11px] font-bold tabular-nums text-accent/90">0{i + 1}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-dark-muted">{desc}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

const Process = () => {
  return (
    <section id="process" className="relative overflow-hidden py-12 bg-gradient-dark-radial">
      <div className="absolute inset-0 bg-grid-light opacity-30" aria-hidden />
      <Sparkles count={14} />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="hidden md:grid md:grid-cols-[1fr_auto] gap-8 items-center mb-14 max-w-5xl mx-auto text-center md:text-left">
          <div>
            <span className="inline-block rounded-full glass px-4 py-1 text-xs font-bold text-accent uppercase tracking-wider">
              How it works
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold text-dark-foreground text-balance">
              Simple & <span className="text-gradient-brand">quick</span> process
            </h2>
            <p className="mt-4 text-lg text-dark-muted max-w-xl mx-auto md:mx-0">From enquiry to confirmed maid — usually within a day.</p>
          </div>
          <div className="hidden md:flex justify-end">
            <img src={cookingDoodle} alt="Illustration of at-home cooking support for Pune families" className="w-64 lg:w-80 object-contain drop-shadow-xl animate-float" />
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative group">
              <div className="rounded-3xl glass p-7 hover:shadow-glow-teal transition-smooth h-full hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-pop">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-5xl font-extrabold text-gradient-brand opacity-50 leading-none">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-dark-foreground">{title}</h3>
                <p className="mt-2 text-sm text-dark-muted leading-relaxed">{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <div className="h-px w-6 bg-accent/60" />
                </div>
              )}
            </div>
          ))}
        </div>

        <MobileProcess />
      </div>
    </section>
  );
};

export default Process;
