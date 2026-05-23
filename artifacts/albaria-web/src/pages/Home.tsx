import React, { useEffect, useState, useRef, FormEvent } from "react";
import { Menu, X, ArrowRight, Check, Zap, Target, Lock, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "wouter";

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
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const { ref, isVisible } = useFadeIn();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", empresa: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta de ${formData.nombre} — ${formData.empresa}`);
    const body = encodeURIComponent(
      `Hola Jaime,\n\nMe llamo ${formData.nombre} y trabajo en ${formData.empresa}.\n\n${formData.mensaje}\n\nQuedo a tu disposición para concretar una reunión.\n\nSaludos,\n${formData.nombre}`
    );
    window.location.href = `mailto:jaime@albariasolutions.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const LogoSVG = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
      <circle cx="14" cy="14" r="3" fill="#6366F1"/>
      <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
      <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#6366F1" strokeWidth="1.5" fill="none" transform="rotate(60 14 14)"/>
      <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#6366F1" strokeWidth="1.5" fill="none" transform="rotate(120 14 14)"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
      {/* NAVBAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "backdrop-blur-md bg-[#0A0A0F]/80 border-b border-[#1e1e2e]" 
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoSVG />
            <span className="font-bold text-[22px] tracking-tight">ALBARIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#herramientas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Herramientas</a>
            <a href="#demos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Demos</a>
            <a href="#contacto" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
            <a 
              href="mailto:jaime@albariasolutions.com" 
              className="text-sm font-medium bg-transparent border border-[#1e1e2e] hover:border-primary px-4 py-2 rounded-md transition-all hover:brightness-110"
            >
              Hablar con Jaime
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0A0A0F] border-b border-[#1e1e2e] p-6 flex flex-col gap-6 shadow-2xl">
            <a href="#herramientas" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Herramientas</a>
            <a href="#demos" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Demos</a>
            <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
            <a 
              href="mailto:jaime@albariasolutions.com" 
              className="text-center text-lg font-medium border border-[#1e1e2e] hover:border-primary px-4 py-3 rounded-md transition-all"
            >
              Hablar con Jaime
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
            >
              Ver demos en vivo <ArrowRight size={18} />
            </a>
            <a 
              href="mailto:jaime@albariasolutions.com" 
              className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-[#1e1e2e] text-muted-foreground rounded-[6px] font-medium transition-all hover:border-primary hover:text-white flex items-center justify-center"
            >
              Hablar con Jaime
            </a>
          </div>
          <p className="text-[13px] text-muted-foreground font-medium tracking-wide">
            3 herramientas en producción · Empresas industriales B2B · Valencia, España
          </p>
        </FadeSection>
      </section>

      {/* TOOLS SECTION */}
      <section id="herramientas" className="py-24 px-6 border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <h2 className="text-[13px] uppercase tracking-[2px] text-primary font-bold mb-12">Herramientas disponibles ahora</h2>
          </FadeSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeSection delay={100}>
              <div className="group bg-card border border-[#1e1e2e] rounded-xl p-8 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2a] flex items-center justify-center mb-6 text-xl">
                  🎯
                </div>
                <h3 className="text-xl font-semibold mb-3">Lead Generator Engine</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Detecta empresas que encajan con tu perfil de cliente ideal — incluyendo las que ninguna herramienta estándar ve. Informes con fichas completas y estrategia de contacto.
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1e1e2e]/50">
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-muted-foreground">Ventas</span>
                  <a 
                    href="https://lead-generation-engine-jaimearnaiz249.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary font-medium text-sm flex items-center gap-1 hover:brightness-125 transition-all"
                  >
                    Probar demo <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </FadeSection>

            <FadeSection delay={200}>
              <div className="group bg-card border border-[#1e1e2e] rounded-xl p-8 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2a] flex items-center justify-center mb-6 text-xl">
                  🤖
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Doc AI</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Chatbot privado entrenado con tus manuales y documentación. Responde al instante en cualquier idioma, 24/7. Solo ve lo que tú le das — 100% privado y seguro.
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1e1e2e]/50">
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-muted-foreground">Soporte Técnico</span>
                  <a 
                    href="https://secure-doc-ai.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary font-medium text-sm flex items-center gap-1 hover:brightness-125 transition-all"
                  >
                    Probar demo <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </FadeSection>

            <FadeSection delay={300}>
              <div className="group bg-card border border-[#1e1e2e] rounded-xl p-8 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2a] flex items-center justify-center mb-6 text-xl">
                  📋
                </div>
                <h3 className="text-xl font-semibold mb-3">Offer Configurator</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Configura tu producto de forma modular y genera automáticamente la oferta técnica y económica completa en PDF. Sin errores, sin llamar a ingeniería.
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1e1e2e]/50">
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-muted-foreground">Comercial</span>
                  <a 
                    href="https://offer-configurator.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary font-medium text-sm flex items-center gap-1 hover:brightness-125 transition-all"
                  >
                    Probar demo <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </FadeSection>
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
              { num: "03", title: "En producción", desc: "Tu equipo lo usa desde el primer día. Albaria lo mantiene y mejora cada mes." }
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

      {/* PRICING */}
      <section id="contacto" className="py-24 px-6 border-t border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <h2 className="text-3xl md:text-[36px] font-semibold mb-16 text-center tracking-tight">Transparente desde el primer día</h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeSection delay={100}>
              <div className="bg-card border border-[#1e1e2e] rounded-xl p-8 h-full flex flex-col">
                <h3 className="text-xl font-medium mb-2">Starter</h3>
                <div className="mb-6"><span className="text-muted-foreground text-sm">desde</span> <span className="text-3xl font-bold">290€</span><span className="text-muted-foreground">/mes</span></div>
                <div className="text-sm text-muted-foreground mb-8 pb-8 border-b border-[#1e1e2e]">Setup: 190€</div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> 1 agente configurado</li>
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> Soporte por email</li>
                </ul>
                <a href="mailto:jaime@albariasolutions.com" className="w-full block text-center py-2.5 rounded-[6px] border border-[#1e1e2e] hover:border-primary transition-all font-medium text-sm mt-auto">Empezar →</a>
              </div>
            </FadeSection>

            <FadeSection delay={200}>
              <div className="bg-card border-2 border-primary rounded-xl p-8 h-full flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Más elegido
                </div>
                <h3 className="text-xl font-medium mb-2">Professional</h3>
                <div className="mb-6"><span className="text-muted-foreground text-sm">desde</span> <span className="text-3xl font-bold">590€</span><span className="text-muted-foreground">/mes</span></div>
                <div className="text-sm text-muted-foreground mb-8 pb-8 border-b border-[#1e1e2e]">Setup: 390€</div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> Hasta 3 agentes</li>
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> Integraciones CRM/ERP</li>
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> Soporte prioritario</li>
                </ul>
                <a href="mailto:jaime@albariasolutions.com" className="w-full block text-center py-2.5 rounded-[6px] bg-primary text-white hover:brightness-110 transition-all font-medium text-sm mt-auto">Empezar →</a>
              </div>
            </FadeSection>

            <FadeSection delay={300}>
              <div className="bg-card border border-[#1e1e2e] rounded-xl p-8 h-full flex flex-col">
                <h3 className="text-xl font-medium mb-2">Enterprise</h3>
                <div className="mb-6"><span className="text-muted-foreground text-sm">desde</span> <span className="text-3xl font-bold">990€</span><span className="text-muted-foreground">/mes</span></div>
                <div className="text-sm text-muted-foreground mb-8 pb-8 border-b border-[#1e1e2e]">Setup: desde 790€</div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> Agentes ilimitados</li>
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> Onboarding completo</li>
                  <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary shrink-0" /> SLA garantizado</li>
                </ul>
                <a href="mailto:jaime@albariasolutions.com" className="w-full block text-center py-2.5 rounded-[6px] border border-[#1e1e2e] hover:border-primary transition-all font-medium text-sm mt-auto">Hablar con Jaime →</a>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* FINAL CTA + CONTACT FORM */}
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
                  <label htmlFor="nombre" className="text-sm font-medium text-muted-foreground">
                    Tu nombre
                  </label>
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
                  <label htmlFor="empresa" className="text-sm font-medium text-muted-foreground">
                    Tu empresa
                  </label>
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
          <div className="flex items-center gap-2">
            <LogoSVG />
            <span className="font-bold text-sm tracking-tight">ALBARIA</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 Albaria Solutions · Valencia, España
          </div>
          <div className="text-sm text-muted-foreground">
            <a href="mailto:jaime@albariasolutions.com" className="hover:text-white transition-colors">
              jaime@albariasolutions.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}