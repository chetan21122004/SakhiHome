import { MessageSquare, UserSearch, CheckCircle2, Headphones } from "lucide-react";
import Sparkles from "./Sparkles";
import cleaningDoodle from "@/assets/doodles/cleaning service-amico.svg";


const steps = [
  { icon: MessageSquare, title: "Share Requirement", desc: "Tell us what you need via WhatsApp or call." },
  { icon: UserSearch, title: "Get Matched", desc: "We shortlist available maids near your location." },
  { icon: CheckCircle2, title: "Choose & Confirm", desc: "Pick the right fit and start service quickly." },
  { icon: Headphones, title: "Ongoing Support", desc: "We're here for replacements & assistance anytime." },
];

const Process = () => {
  return (
    <section id="process" className="relative overflow-hidden py-12 bg-gradient-dark-radial">
      <div className="absolute inset-0 bg-grid-light opacity-30" aria-hidden />
      <Sparkles count={14} />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center mb-14 max-w-5xl mx-auto text-center md:text-left">
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
            <img src={cleaningDoodle} alt="Fast Cleaning Services" className="w-64 lg:w-80 object-contain drop-shadow-xl animate-float" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
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
      </div>
    </section>
  );
};

export default Process;
