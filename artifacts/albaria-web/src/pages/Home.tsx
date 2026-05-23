import React, { useEffect, useState, useRef, FormEvent } from "react";
import { Menu, X, ArrowRight, Check, Zap, Target, Lock, TrendingUp, CheckCircle, Eye } from "lucide-react";
import { Link } from "wouter";
import albariLogoPath from "../assets/albaria-logo-orig.png";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return { ref, isVisible };
}

function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const AlbariaLogo = ({ className = "h-8" }: { className?: string }) => (
  <img
    src={albariLogoPath}
    alt="Albaria Solutions"
    className={`${className} w-auto object-contain`}
    style={{ mixBlendMode: "screen" }}
  />
);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visits, setVisits] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: "", empresa: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/analytics/visit", { method: "POST" })
      .then(r => r.json())
      .then((data: { visits: number }) => setVisits(data.visits))
      .catch(() => {});
  }, []);

  function trackDemoClick(demo: string) {
    fetch("/api/analytics/demo-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demo }),
    }).catch(() => {});
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta de ${formData.nombre} — ${formData.empresa}`);
    const body = encodeURIComponent(
      `Hola Jaime,\n\nMe llamo ${formData.nombre} y trabajo en ${formData.empresa}.\n\n${formData.mensaje}\n\nQuedo a tu disposición para concretar una reunión.\n\nSaludos,\n${formData.nombre}`
    );
    window.location.href = `mailto:jaime@albariasolutions.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-md bg-[#0A0A0F]/80 border-b border-[#1e1e2e]" : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <AlbariaLogo className="h-9" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#herramientas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Herramientas</a>
            <a href="#demos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Demos</a>
            <a href="#reservar" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
            <a
              href="#reservar"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md transition-all hover:brightness-110"
              data-testid="button-nav-contacto"
            >
              Contáctanos
            </a>
          </div>

          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0A0A0F] border-b border-[#1e1e2e] p-6 flex flex-col gap-6 shadow-2xl">
            <a href="#herramientas" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Herramientas</a>
            <a href="#demos" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Demos</a>
            <a href="#reservar" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
            <a
              href="#reservar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-lg font-medium bg-primary text-white px-4 py-3 rounded-md transition-all hover:brightness-110"
            >
              Contáctanos
            </a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <FadeSection className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium mb-8">
            <span className="text-yellow-400">⚡</span>
            <span className="text-primary-foreground">Agentes de IA para empresas B2B</span>
          </div>
          <h1 className="text-4xl md:text-[56px] font-semibold leading-[1.15] tracking-tight mb-6">
            Tu equipo de <span className="text-primary">IA</span>.<br />
            Ya funcionando.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-[560px] mx-auto mb-10 leading-relaxed">
            Agentes de inteligencia artificial para empresas industriales. Detecta clientes, genera ofertas y automatiza soporte técnico sin contratar ni un empleado más.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#herramientas"
              className="w-full sm:w-auto px-6 py-3.5 bg-primary text-white rounded-[6px] font-medium transition-all hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              data-testid="button-hero-demos"
            >
              Ver demos en vivo <ArrowRight size={18} />
            </a>
            <a
              href="#reservar"
              className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-[#1e1e2e] text-muted-foreground rounded-[6px] font-medium transition-all hover:border-primary hover:text-white flex items-center justify-center"
              data-testid="button-hero-contacto"
            >
              Contáctanos
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <p className="text-[13px] text-muted-foreground font-medium tracking-wide">
              3 herramientas en producción · Empresas industriales B2B · Valencia, España
            </p>
            {visits !== null && visits > 1 && (
              <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground/70">
                <Eye size={13} className="text-primary/60" />
                <span><span className="text-primary/80 font-medium">{visits}</span> visitas</span>
              </div>
            )}
          </div>
        </FadeSection>
      </section>

      {/* TOOLS SECTION */}
      <section id="herramientas" className="py-24 px-6 border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <h2 className="text-[13px] uppercase tracking-[2px] text-primary font-bold mb-12">Herramientas disponibles ahora</h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Lead Generator Engine",
                desc: "Detecta empresas que encajan con tu perfil de cliente ideal — incluyendo las que ninguna herramienta estándar ve. Informes con fichas completas y estrategia de contacto.",
                badge: "Ventas",
                url: "https://lead-generation-engine-jaimearnaiz249.replit.app/",
                key: "lead",
                delay: 100,
              },
              {
                icon: "🤖",
                title: "Secure Doc AI",
                desc: "Chatbot privado entrenado con tus manuales y documentación. Responde al instante en cualquier idioma, 24/7. Solo ve lo que tú le das — 100% privado y seguro.",
                badge: "Soporte Técnico",
                url: "https://secure-doc-ai.replit.app/",
                key: "doc",
                delay: 200,
              },
              {
                icon: "📋",
                title: "Offer Configurator",
                desc: "Configura tu producto de forma modular y genera automáticamente la oferta técnica y económica completa en PDF. Sin errores, sin llamar a ingeniería.",
                badge: "Comercial",
                url: "https://offer-configurator.replit.app/",
                key: "offer",
                delay: 300,
              },
            ].map((tool) => (
              <FadeSection key={tool.key} delay={tool.delay}>
                <div
                  className="group bg-card border border-[#1e1e2e] rounded-xl p-8 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col"
                  data-testid={`card-tool-${tool.key}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1a1a2a] flex items-center justify-center mb-6 text-xl">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{tool.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{tool.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1e1e2e]/50">
                    <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-muted-foreground border border-[#1e1e2e] border-primary/20">
                      {tool.badge}
                    </span>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackDemoClick(tool.key)}
                      className="text-primary font-medium text-sm flex items-center gap-1 hover:brightness-125 transition-all"
                      data-testid={`link-demo-${tool.key}`}
                    >
                      Probar demo <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="demos" className="py-24 px-6 bg-[#0d0d14] border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <h2 className="text-3xl md:text-[36px] font-semibold mb-4 tracking-tight">Así de simple</h2>
            <p className="text-lg text-muted-foreground mb-16">Sin tecnicismos. Sin meses de implementación.</p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[1px] bg-[#1e1e2e] z-0" />
            {[
              { num: "01", title: "Briefing", desc: "Nos reunimos. Entendemos tu proceso y lo que necesitas. Sin PowerPoints de 40 slides." },
              { num: "02", title: "Configuración", desc: "Albaria construye y personaliza el agente para tu empresa. Tú revisas y ajustamos." },
              { num: "03", title: "En producción", desc: "Tu equipo lo usa desde el primer día. Albaria lo mantiene y mejora cada mes." },
            ].map((step, i) => (
              <FadeSection key={step.num} delay={i * 150} className="relative z-10 bg-[#0d0d14]">
                <div className="text-5xl font-bold text-primary/30 mb-6 bg-[#0d0d14] inline-block pr-4">{step.num}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ALBARIA */}
      <section className="py-24 px-6 border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <h2 className="text-3xl md:text-[36px] font-semibold mb-4 tracking-tight">No vendemos promesas</h2>
            <p className="text-lg text-muted-foreground mb-16">Llegamos con herramientas que ya funcionan.</p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <FadeSection delay={100} className="flex gap-4">
              <div className="shrink-0 mt-1"><Zap className="text-primary" size={24} /></div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ya funcionando</h3>
                <p className="text-muted-foreground">Todas las herramientas están en producción. Las puedes probar ahora mismo antes de decidir nada.</p>
              </div>
            </FadeSection>
            <FadeSection delay={200} className="flex gap-4">
              <div className="shrink-0 mt-1"><Target className="text-primary" size={24} /></div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Especialistas B2B industrial</h3>
                <p className="text-muted-foreground">Maquinaria, impresión industrial, packaging, distribución. Entendemos tu sector.</p>
              </div>
            </FadeSection>
            <FadeSection delay={300} className="flex gap-4">
              <div className="shrink-0 mt-1"><Lock className="text-primary" size={24} /></div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tus datos son tuyos</h3>
                <p className="text-muted-foreground">Los agentes se entrenan con tu documentación. Nadie más tiene acceso.</p>
              </div>
            </FadeSection>
            <FadeSection delay={400} className="flex gap-4">
              <div className="shrink-0 mt-1"><TrendingUp className="text-primary" size={24} /></div>
              <div>
                <h3 className="text-xl font-semibold mb-2">ROI desde el primer mes</h3>
                <p className="text-muted-foreground">La mayoría de clientes recuperan la inversión en las primeras semanas de uso.</p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="reservar" className="py-32 px-6 border-t border-[#1e1e2e] bg-gradient-to-b from-[#0A0A0F] to-[#0f0f1a]">
        <FadeSection className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-[42px] font-semibold mb-6 tracking-tight">¿Tu empresa necesita esto?</h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Reserva 20 minutos. Sin compromiso. Si no veo cómo ayudarte, te lo digo en la primera reunión.
          </p>
        </FadeSection>

        <FadeSection delay={150} className="max-w-lg mx-auto">
          {formSent ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <CheckCircle size={48} className="text-[#10B981]" />
              <h3 className="text-2xl font-semibold">¡Mensaje enviado!</h3>
              <p className="text-muted-foreground">
                Tu cliente de correo se ha abierto con el mensaje listo. Jaime te responderá en menos de 24h.
              </p>
              <button
                onClick={() => { setFormSent(false); setFormData({ nombre: "", empresa: "", mensaje: "" }); }}
                className="text-sm text-primary hover:brightness-125 transition-all mt-2"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              data-testid="form-contacto"
              className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-8 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-muted-foreground">Tu nombre</label>
                  <input
                    id="nombre"
                    data-testid="input-nombre"
                    type="text"
                    required
                    placeholder="Nombre Apellido"
                    value={formData.nombre}
                    onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    className="bg-[#0A0A0F] border border-[#1e1e2e] rounded-[6px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="empresa" className="text-sm font-medium text-muted-foreground">Tu empresa</label>
                  <input
                    id="empresa"
                    data-testid="input-empresa"
                    type="text"
                    required
                    placeholder="Empresa S.L."
                    value={formData.empresa}
                    onChange={e => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                    className="bg-[#0A0A0F] border border-[#1e1e2e] rounded-[6px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="mensaje" className="text-sm font-medium text-muted-foreground">
                  ¿Qué necesitas automatizar? <span className="text-muted-foreground/50 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="mensaje"
                  data-testid="textarea-mensaje"
                  rows={4}
                  placeholder="Cuéntame brevemente tu proceso o el problema que quieres resolver..."
                  value={formData.mensaje}
                  onChange={e => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                  className="bg-[#0A0A0F] border border-[#1e1e2e] rounded-[6px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                data-testid="button-submit-contacto"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-[6px] font-medium text-[16px] transition-all hover:brightness-110 shadow-lg shadow-primary/20 mt-2"
              >
                Reservar reunión gratuita <ArrowRight size={18} />
              </button>
              <p className="text-center text-xs text-muted-foreground/60">
                Al enviar se abrirá tu cliente de correo con el mensaje listo para Jaime.
              </p>
            </form>
          )}

          <div className="text-center mt-8">
            <a href="mailto:jaime@albariasolutions.com" className="text-sm text-muted-foreground hover:text-white transition-colors">
              jaime@albariasolutions.com
            </a>
          </div>
        </FadeSection>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-[#1e1e2e] bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <AlbariaLogo className="h-7" />
          <div className="text-sm text-muted-foreground">© 2025 Albaria Solutions · Valencia, España</div>
          <a href="mailto:jaime@albariasolutions.com" className="text-sm text-muted-foreground hover:text-white transition-colors">
            jaime@albariasolutions.com
          </a>
        </div>
      </footer>
    </div>
  );
}
