import { Users, TrendingUp, Repeat, Heart, ShieldCheck } from "lucide-react";
import dementiaDoodle from "@/assets/doodles/Dementia-amico.svg";
import blobBg from "@/assets/blobs/063602423687.jpg";


const items = [
  { icon: Users, num: "500+", title: "Maid Network", desc: "A strong, growing network exclusively built for Hinjewadi IT Park families." },
  { icon: TrendingUp, num: "Weekly", title: "Growing Supply", desc: "New verified maids added every week, so you're never left waiting." },
  { icon: Repeat, num: "24-48h", title: "Quick Replacement", desc: "Backup maid arranged within 24–48 hours if your maid is unavailable." },
  { icon: Heart, num: "100%", title: "Local Matching", desc: "Maids who live nearby for better reliability and punctuality." },
];

const TrustSection = () => {
  return (
    <section className="relative py-12 bg-gradient-dark-radial overflow-hidden">
      {/* Blob background texture */}
      <img
        src={blobBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none select-none mix-blend-screen"
      />


      {/* Ambient glow orbs */}
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-accent/20 blur-[120px] animate-glow-pulse pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-primary-glow/20 blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} aria-hidden />
      <div className="absolute inset-0 bg-grid-light opacity-[0.06] pointer-events-none" aria-hidden />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center mb-16 max-w-5xl mx-auto text-center md:text-left">
          <div className="hidden md:flex justify-start">
            <img src={dementiaDoodle} alt="Trust and Care" className="w-64 lg:w-80 object-contain drop-shadow-xl animate-float" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/15 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Why SakhiHome
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-6xl font-extrabold text-white text-balance leading-[1.05]">
              Built on <span className="text-gradient-brand">trust</span>,
              <br className="hidden sm:block" /> run with care
            </h2>
            <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto md:mx-0">
              We're not a faceless app. We're your local maid partner in Hinjewadi.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, num, title, desc }, i) => (
            <div
              key={title}
              className="group relative rounded-3xl glass border border-white/10 p-7 transition-all duration-500 hover:border-accent/40 hover:-translate-y-2 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-30 blur-3xl transition-all duration-700" aria-hidden />
              {/* Number watermark */}
              <div className="absolute -bottom-4 -right-2 font-display text-7xl font-extrabold text-white/[0.04] select-none pointer-events-none">
                0{i + 1}
              </div>

              <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <Icon className="h-6 w-6" />
              </div>
              <p className="relative mt-5 font-display text-2xl font-extrabold text-gradient-brand">{num}</p>
              <h3 className="relative mt-1 font-display text-lg font-bold text-white">{title}</h3>
              <p className="relative mt-2 text-sm text-white/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
