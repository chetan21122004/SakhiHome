"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles as SparklesIcon,
  User,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

const blobBg = "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdqpevg";
const WHATSAPP =
  "https://wa.me/919172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";

const SERVICES = [
  "House Cleaning",
  "Cooking Services",
  "Babysitting",
  "Elder Care",
  "Full-Time Maid",
  "Part-Time Maid",
  "Not sure yet",
];

const AREAS = [
  "Hinjewadi Phase 1",
  "Hinjewadi Phase 2",
  "Hinjewadi Phase 3",
  "Megapolis",
  "Wakad",
  "Bhumkar Chowk",
  "Baner",
  "Marunji",
  "Other",
];

const initialState = {
  name: "",
  phone: "",
  area: "",
  service: "",
  budget: "",
  startTime: "",
  endTime: "",
  message: "",
};

const EnquirySection = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof initialState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) return "Please enter a valid phone number.";
    if (!form.service) return "Please choose the service you need.";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          area: form.area,
          service: form.service,
          budget: form.budget,
          start_time: form.startTime,
          end_time: form.endTime,
          maid_daily_window:
            form.startTime || form.endTime
              ? [form.startTime || "?", form.endTime || "?"].join(" – ")
              : "",
          message: form.message,
          _subject: `New SakhiHome enquiry from ${form.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Formspree responded with ${response.status}`);
      }

      setSubmitted(true);
      setForm(initialState);
      toast.success("Enquiry sent! We'll reach out shortly.");
    } catch (err) {
      console.error("Formspree submission failed", err);
      toast.error("Couldn't send enquiry. Please try WhatsApp or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="relative py-10 md:py-20 bg-gradient-soft overflow-hidden">
      {/* Blob background texture */}
      <img
        src={blobBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.04] md:opacity-[0.05] pointer-events-none select-none mix-blend-multiply"
      />

      {/* Soft brand orbs */}
      <div
        className="absolute top-4 md:top-10 -left-28 md:-left-24 h-56 w-56 md:h-72 md:w-72 rounded-full bg-accent/15 blur-[90px] md:blur-[110px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-4 md:bottom-10 -right-28 md:-right-24 h-60 w-60 md:h-80 md:w-80 rounded-full bg-primary/15 blur-[95px] md:blur-[120px] pointer-events-none"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-1.5 md:gap-2 rounded-full bg-gradient-brand-soft border border-primary/20 px-3.5 md:px-4 py-1.5 text-[10px] md:text-xs font-bold text-primary-deep uppercase tracking-[0.18em] md:tracking-wider">
            <Wand2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Send us an enquiry
          </span>
          <h2 className="mt-4 md:mt-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-deep text-balance leading-tight md:leading-[1.05]">
            Tell us what your <span className="text-gradient-brand">home needs</span>
          </h2>
          <p className="mt-3 md:mt-5 text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed">
            Share a few details and our team will match you with the right maid -usually within hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5 md:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left -trust panel */}
          <aside className="order-2 lg:order-1 relative overflow-hidden rounded-3xl md:rounded-[2rem] bg-gradient-dark-radial p-5 sm:p-6 md:p-10 text-dark-foreground shadow-elevated">
            <div className="absolute inset-0 bg-grid-light opacity-20" aria-hidden />
            <div
              className="absolute -top-24 -right-24 h-52 w-52 md:h-64 md:w-64 rounded-full bg-accent/30 blur-[75px] md:blur-[90px] animate-glow-pulse pointer-events-none"
              aria-hidden
            />

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 md:px-4 py-1.5 text-[10px] md:text-[11px] font-bold text-accent uppercase tracking-[0.16em] md:tracking-wider">
                <ShieldCheck className="h-3 w-3 md:h-3.5 md:w-3.5" />
                Verified & local
              </div>

              <h3 className="mt-4 md:mt-5 font-display text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight">
                Your details are safe with <span className="text-gradient-brand">SakhiHome</span>
              </h3>
              <p className="mt-2.5 md:mt-3 text-sm md:text-base text-dark-muted leading-relaxed">
                We only use your info to find the right maid for your home. No spam, ever.
              </p>

              <ul className="mt-5 md:mt-7 space-y-3.5 md:space-y-4">
                {[
                  "Real human matching, not an automated app",
                  "Background-verified maids near your locality",
                  "Replacement maid arranged within 24–48 hours",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-dark-foreground/90">
                    <span className="mt-0.5 grid h-5 w-5 md:h-6 md:w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    </span>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 md:mt-9 grid grid-cols-2 gap-2.5 md:gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 rounded-xl md:rounded-2xl glass border border-white/10 px-3 md:px-4 py-3 transition-smooth hover:border-accent/40"
                >
                  <span className="flex items-center gap-1.5 md:gap-2 text-[10px] font-bold uppercase tracking-[0.16em] md:tracking-wider text-accent">
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">Chat instantly</span>
                </a>
                <a
                  href="tel:+919172475977"
                  className="flex flex-col gap-1 rounded-xl md:rounded-2xl glass border border-white/10 px-3 md:px-4 py-3 transition-smooth hover:border-accent/40"
                >
                  <span className="flex items-center gap-1.5 md:gap-2 text-[10px] font-bold uppercase tracking-[0.16em] md:tracking-wider text-accent">
                    <Phone className="h-3.5 w-3.5" />
                    Call us
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">+91 91724 75977</span>
                </a>
              </div>

              <p className="mt-5 md:mt-6 text-[11px] text-dark-muted">
                Mon–Sun · 8 AM – 9 PM · Replies within minutes
              </p>
            </div>
          </aside>

          {/* Right -form card */}
          <div className="order-1 lg:order-2 relative rounded-3xl md:rounded-[2rem] bg-card border border-border shadow-card p-4 sm:p-5 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8 md:py-10">
                <div className="grid h-14 w-14 md:h-16 md:w-16 place-items-center rounded-full bg-gradient-brand text-white shadow-glow">
                  <CheckCircle2 className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="mt-5 md:mt-6 font-display text-2xl md:text-3xl font-extrabold text-primary-deep">
                  Enquiry received!
                </h3>
                <p className="mt-2.5 md:mt-3 max-w-md text-sm md:text-base text-foreground/70 leading-relaxed">
                  Thank you for reaching out to SakhiHome. Our team will get in touch with you shortly to
                  understand your needs and share matching maids.
                </p>
                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                  <Button variant="hero" size="lg" asChild>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSubmitted(false)}
                    type="button"
                  >
                    Send another enquiry
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4 md:space-y-5">
                <div className="grid sm:grid-cols-2 gap-3.5 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enq-name" className="text-primary-deep">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="enq-name"
                        name="name"
                        autoComplete="name"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={form.name}
                        onChange={handleChange("name")}
                        className="h-11 md:h-12 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enq-phone" className="text-primary-deep">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="enq-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        className="h-11 md:h-12 pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enq-area" className="text-primary-deep">
                      Your Area
                    </Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        id="enq-area"
                        name="area"
                        value={form.area}
                        onChange={handleChange("area")}
                        className="flex h-11 md:h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm appearance-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select area</option>
                        {AREAS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enq-service" className="text-primary-deep">
                      Service Needed <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <SparklesIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        id="enq-service"
                        name="service"
                        required
                        value={form.service}
                        onChange={handleChange("service")}
                        className="flex h-11 md:h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm appearance-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select service</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enq-budget" className="text-primary-deep">
                    Budget
                  </Label>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="enq-budget"
                      name="budget"
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. ₹8,000/month, per visit, flexible"
                      value={form.budget}
                      onChange={handleChange("budget")}
                      className="h-11 md:h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-primary-deep">When do you need the maid?</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Daily window you need help at home -approximate times are fine.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="enq-time-start" className="text-primary-deep">
                        From (maid start)
                      </Label>
                      <Input
                        id="enq-time-start"
                        name="startTime"
                        type="time"
                        value={form.startTime}
                        onChange={handleChange("startTime")}
                        className="h-11 md:h-12"
                        aria-label="Time you need the maid from"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enq-time-end" className="text-primary-deep">
                        To (maid end)
                      </Label>
                      <Input
                        id="enq-time-end"
                        name="endTime"
                        type="time"
                        value={form.endTime}
                        onChange={handleChange("endTime")}
                        className="h-11 md:h-12"
                        aria-label="Time you need the maid until"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave blank if timings are flexible or you will discuss later.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enq-message" className="text-primary-deep">
                    Anything else we should know?
                  </Label>
                  <Textarea
                    id="enq-message"
                    name="message"
                    placeholder="Family size, specific tasks, language preference, etc."
                    value={form.message}
                    onChange={handleChange("message")}
                    className="min-h-[100px] md:min-h-[110px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 md:pt-2">
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Enquiry
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    By sending, you agree to be contacted by SakhiHome about your enquiry.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;
