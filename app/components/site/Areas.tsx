import { MapPin } from "lucide-react";
import Sparkles from "./Sparkles";

const blobBg = "/assets/blobs/063602423687.jpg";

const areas = [
  { name: "Phase 1", desc: "Rajiv Gandhi Infotech Park core & adjoining societies" },
  { name: "Phase 2", desc: "Infosys, Wipro & nearby gated societies" },
  { name: "Phase 3", desc: "Blue Ridge, Life Republic & surroundings" },
  { name: "Megapolis", desc: "Megapolis Splendour, Sparklet & nearby" },
  { name: "Wakad", desc: "Highway belt & residential hubs with quick IT Park access" },
  { name: "Bhumkar Chowk", desc: "Junction area & societies linking Wakad to Hinjewadi" },
  { name: "Baner", desc: "Residential neighbourhoods a short drive from the IT Park" },
  { name: "Marunji", desc: "Growing locality near Sus & Hinjewadi corridors" },
];

const Areas = () => {
  return (
    <section id="areas" className="relative overflow-hidden py-12 bg-gradient-dark-radial">

      {/* Massive Rotating "Planet" Blob Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] opacity-30 mix-blend-screen pointer-events-none animate-[spin_120s_linear_infinite]">
        <img
          src={blobBg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover rounded-full blur-[100px] scale-150"
        />
      </div>

      <div className="absolute inset-0 bg-grid-light opacity-20" aria-hidden />
      <Sparkles count={25} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-5 py-2 text-xs font-bold text-accent uppercase tracking-widest shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]">
            Service Areas
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-6xl font-black text-white text-balance tracking-tight">
            Serving <span className="text-gradient-brand">Hinjewadi</span> & nearby areas
          </h2>
          <p className="mt-5 text-lg md:text-xl text-white/60">
            Hinjewadi IT Park plus Wakad, Baner, Marunji & Bhumkar Chowk — local coverage keeps service fast & reliable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((a, i) => (
            <div
              key={a.name}
              className="group relative rounded-[2rem] bg-white/[0.03] border border-white/[0.08] p-7 md:p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:bg-white/[0.06] hover:border-accent/40 hover:shadow-[0_20px_80px_-20px_rgba(var(--accent-rgb),0.5)] overflow-hidden"
            >
              {/* Internal ambient sweep */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-2xl" aria-hidden />

              {/* Giant watermark icon */}
              <MapPin className="absolute -bottom-8 -right-8 h-48 w-48 text-white/[0.02] group-hover:text-white/[0.08] group-hover:scale-125 transition-all duration-700 -rotate-12 pointer-events-none" aria-hidden />

              <div className="relative z-10 flex flex-col h-full text-left">
                <div className="flex justify-between items-start mb-6">
                  {/* Glowing icon box */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-white transition-all duration-500 group-hover:bg-gradient-brand group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.6)] group-hover:-rotate-6">
                    <MapPin className="h-6 w-6" />
                  </div>

                  <span className="font-display text-5xl font-black text-white/5 group-hover:text-white/20 transition-colors duration-500">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">{a.name}</h3>
                <p className="mt-3 text-sm text-white/60 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">{a.desc}</p>

                {/* Animated bottom line */}
                <div className="mt-8 h-1 w-0 bg-gradient-brand rounded-full group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-white/50">
          Not sure if we cover your society?{" "}
          <a href="#cta" className="text-accent font-semibold underline underline-offset-4 hover:text-white transition-colors duration-300">
            Ask us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
};

export default Areas;

