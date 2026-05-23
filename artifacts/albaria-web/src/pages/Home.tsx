import React, { useEffect, useState, useRef, FormEvent, useCallback } from "react";
import {
  Menu, X, ArrowRight, Zap, Target, Lock, TrendingUp, CheckCircle,
  Clock, ExternalLink, AlertTriangle, Search, Shield, FileCheck, ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import albariLogoPath from "../assets/albaria-logo-clean.png";

const DEMO_DURATION = 2 * 60 * 1000;
const STORAGE_KEY = "albaria_demo_session";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.08, rootMargin: "60px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return { ref, isVisible };
}

function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useFadeIn();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(24px)", transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const AlbariaLogo = ({ className = "h-9" }: { className?: string }) => (
  <img src={albariLogoPath} alt="Albaria Solutions" className={`${className} w-auto object-contain`} />
);

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

interface DemoSession { url: string; title: string; key: string; }

function DemoModal({ demo, timeLeft, totalDuration, onClose, onExpired, onContactClick }: {
  demo: DemoSession; timeLeft: number; totalDuration: number;
  onClose: () => void; onExpired: () => void; onContactClick: () => void;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const expired = timeLeft <= 0;
  const radius = 16;
  const circ = 2 * Math.PI * radius;
  const urgent = timeLeft < 30000 && timeLeft > 0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => { if (expired) onExpired(); }, [expired, onExpired]);

  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleIframeLoad = () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    setIframeLoaded(true);
  };
  useEffect(() => {
    loadTimerRef.current = setTimeout(() => { if (!iframeLoaded) setIframeBlocked(true); }, 8000);
    return () => { if (loadTimerRef.current) clearTimeout(loadTimerRef.current); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0F]">
      <div className="flex items-center justify-between px-5 h-14 border-b border-[#1e1e2e] shrink-0 bg-[#0A0A0F]">
        <div className="flex items-center gap-3">
          <AlbariaLogo className="h-7" />
          <span className="text-muted-foreground text-sm hidden sm:block">·</span>
          <span className="text-sm font-medium text-foreground hidden sm:block">{demo.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-colors ${
            expired ? "border-red-500/40 bg-red-500/10" :
            urgent ? "border-orange-500/40 bg-orange-500/10 animate-pulse" :
            "border-[#1e1e2e] bg-[#111118]"
          }`}>
            <svg viewBox="0 0 36 36" width="28" height="28" className="-rotate-90">
              <circle cx="18" cy="18" r={radius} fill="none" stroke="#1e1e2e" strokeWidth="2.5" />
              <circle cx="18" cy="18" r={radius} fill="none"
                stroke={expired ? "#ef4444" : urgent ? "#f97316" : "#6366F1"}
                strokeWidth="2.5" strokeDasharray={circ}
                strokeDashoffset={circ * (1 - timeLeft / totalDuration)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.3s ease" }}
              />
            </svg>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Acceso gratuito</p>
              <p className={`text-sm font-mono font-bold leading-none ${
                expired ? "text-red-400" : urgent ? "text-orange-400" : "text-white"
              }`}>{expired ? "0:00" : formatTime(timeLeft)}</p>
            </div>
          </div>
          <a href={demo.url} target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
            <ExternalLink size={13} /> Abrir en pestaña
          </a>
          <button onClick={onClose} data-testid="button-demo-close"
            className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="relative flex-1 bg-[#0d0d14] overflow-hidden">
        {!iframeLoaded && !iframeBlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Cargando la demo…</p>
          </div>
        )}
        {iframeBlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">La demo no puede abrirse aquí</h3>
              <p className="text-muted-foreground max-w-sm">Esta aplicación no permite mostrarse dentro de otra web. Ábrela en una nueva pestaña para probarla.</p>
            </div>
            <a href={demo.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-[6px] font-medium hover:brightness-110 transition-all">
              Abrir la demo <ExternalLink size={16} />
            </a>
          </div>
        )}
        {!iframeBlocked && (
          <iframe src={demo.url} title={demo.title}
            className={`w-full h-full border-0 transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={handleIframeLoad}
            allow="camera; microphone; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
          />
        )}
        {expired && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0A0A0F]/90 backdrop-blur-sm">
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-10 max-w-md w-full text-center mx-4 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                <Clock size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Tu prueba ha terminado</h3>
              <p className="text-muted-foreground mb-8">¿Ves el potencial? Esto es solo una muestra. Con acceso completo, lo configuramos para los datos y procesos de tu empresa.</p>
              <button onClick={onContactClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-[6px] font-medium hover:brightness-110 transition-all mb-3">
                Reservar reunión gratuita <ArrowRight size={16} />
              </button>
              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-white transition-colors">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", empresa: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);
  const [activeDemo, setActiveDemo] = useState<DemoSession | null>(null);
  const [demoSessionStart, setDemoSessionStart] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const start = parseInt(stored, 10);
      const elapsed = Date.now() - start;
      if (elapsed < DEMO_DURATION) { setDemoSessionStart(start); setTimeLeft(DEMO_DURATION - elapsed); }
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (demoSessionStart === null) return;
    const interval = setInterval(() => {
      const remaining = DEMO_DURATION - (Date.now() - demoSessionStart);
      if (remaining <= 0) { setTimeLeft(0); clearInterval(interval); }
      else setTimeLeft(remaining);
    }, 500);
    return () => clearInterval(interval);
  }, [demoSessionStart]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { fetch("/api/analytics/visit", { method: "POST" }).catch(() => {}); }, []);

  const openDemo = useCallback((demo: DemoSession) => {
    fetch("/api/analytics/demo-click", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demo: demo.key }),
    }).catch(() => {});
    if (!demoSessionStart) {
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY, String(now));
      setDemoSessionStart(now);
      setTimeLeft(DEMO_DURATION);
    }
    setActiveDemo(demo);
  }, [demoSessionStart]);

  const closeDemo = useCallback(() => setActiveDemo(null), []);

  const handleDemoExpired = useCallback(() => {
    setDemoSessionStart(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleContactFromDemo = useCallback(() => {
    setActiveDemo(null);
    setTimeout(() => document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta de ${formData.nombre} — ${formData.empresa}`);
    const body = encodeURIComponent(`Hola Jaime,\n\nMe llamo ${formData.nombre} y trabajo en ${formData.empresa}.\n\n${formData.mensaje}\n\nQuedo a tu disposición para concretar una reunión.\n\nSaludos,\n${formData.nombre}`);
    window.location.href = `mailto:jaime@albariasolutions.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  }

  const tools = [
    {
      icon: <Search size={20} className="text-primary" />,
      title: "Lead Generator Engine",
      desc: "Identifica oportunidades de negocio de forma autónoma. Análisis profundo de mercado con estrategia de contacto integrada.",
      badge: "Ventas",
      url: "https://lead-generation-engine-jaimearnaiz249.replit.app/",
      key: "lead",
      delay: 100,
    },
    {
      icon: <Shield size={20} className="text-primary" />,
      title: "Secure Doc AI",
      desc: "Asistente entrenado con tu documentación interna. Respuestas precisas, en cualquier idioma, disponible en todo momento.",
      badge: "Soporte",
      url: "https://secure-doc-ai.replit.app/",
      key: "doc",
      delay: 200,
    },
    {
      icon: <FileCheck size={20} className="text-primary" />,
      title: "Offer Configurator",
      desc: "Genera propuestas técnicas y económicas completas de forma automática. Precisas, profesionales y listas para enviar.",
      badge: "Comercial",
      url: "https://offer-configurator.replit.app/",
      key: "offer",
      delay: 300,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-[#0A0A0F]/80 border-b border-[#1e1e2e]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <AlbariaLogo className="h-9" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#herramientas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Herramientas</a>
            <a href="#proceso" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Proceso</a>
            <a href="#reservar" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
            <a href="#reservar" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md transition-all hover:brightness-110" data-testid="button-nav-contacto">
              Contáctanos
            </a>
          </div>
          <button className="md:hidden text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-testid="button-mobile-menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0A0A0F] border-b border-[#1e1e2e] p-6 flex flex-col gap-6 shadow-2xl">
            <a href="#herramientas" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Herramientas</a>
            <a href="#proceso" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Proceso</a>
            <a href="#reservar" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
            <a href="#reservar" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-lg font-medium bg-primary text-white px-4 py-3 rounded-md">Contáctanos</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-24 md:pt-40 md:pb-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.12),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">

          {/* Large hero logo */}
          <FadeSection>
            <div className="flex justify-center mb-16">
              <AlbariaLogo className="h-20 md:h-28" />
            </div>
          </FadeSection>

          <FadeSection delay={100}>
            <h1 className="text-5xl md:text-[64px] font-semibold leading-[1.1] tracking-tight mb-7 text-white">
              Inteligencia artificial<br />
              que trabaja por ti
            </h1>
          </FadeSection>

          <FadeSection delay={180}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[540px] mx-auto mb-12 leading-relaxed">
              Automatiza los procesos que frenan a tu empresa. Más velocidad, menos fricción, resultados desde el primer día.
            </p>
          </FadeSection>

          <FadeSection delay={260}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#herramientas"
                className="w-full sm:w-auto px-7 py-3.5 bg-primary text-white rounded-[6px] font-medium transition-all hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                data-testid="button-hero-demos">
                Ver las herramientas <ArrowRight size={17} />
              </a>
              <a href="#reservar"
                className="w-full sm:w-auto px-7 py-3.5 border border-[#2a2a3a] text-muted-foreground rounded-[6px] font-medium transition-all hover:border-primary/50 hover:text-white flex items-center justify-center"
                data-testid="button-hero-contacto">
                Hablar con Jaime
              </a>
            </div>
          </FadeSection>

        </div>
      </section>

      {/* DIVIDER LINE */}
      <div className="border-t border-[#1e1e2e]" />

      {/* TOOLS */}
      <section id="herramientas" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <div className="mb-16">
              <p className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-5">Herramientas disponibles</p>
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight mb-5">Pruébalas antes de decidir</h2>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Cada aplicación es funcional y está en producción. Dispones de <span className="text-foreground font-medium">2 minutos de acceso gratuito</span> para verla trabajar con datos reales.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1e1e2e] rounded-xl overflow-hidden border border-[#1e1e2e]">
            {tools.map((tool) => (
              <FadeSection key={tool.key} delay={tool.delay}>
                <div className="bg-[#0A0A0F] p-8 h-full flex flex-col hover:bg-[#0f0f17] transition-colors duration-200 group" data-testid={`card-tool-${tool.key}`}>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-7">
                    {tool.icon}
                  </div>
                  <div className="mb-2">
                    <span className="text-[11px] uppercase tracking-[2px] text-muted-foreground font-medium">{tool.badge}</span>
                  </div>
                  <h3 className="text-[18px] font-semibold mb-3 text-white leading-snug">{tool.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed flex-grow">{tool.desc}</p>
                  <button
                    onClick={() => openDemo({ url: tool.url, title: tool.title, key: tool.key })}
                    className="mt-8 self-start flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-200 group-hover:brightness-125"
                    data-testid={`button-demo-${tool.key}`}
                  >
                    {demoSessionStart && timeLeft > 0 ? (
                      <span className="text-orange-400 font-mono text-xs tabular-nums">{formatTime(timeLeft)}</span>
                    ) : null}
                    Acceder a la demo <ChevronRight size={15} />
                  </button>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="proceso" className="py-24 px-6 border-t border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <p className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-5">Metodología</p>
            <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight mb-4">Así de directo</h2>
            <p className="text-lg text-muted-foreground mb-16 max-w-md">Sin fases de consultoría interminables. Sin meses de espera.</p>
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-5 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-[#1e1e2e] via-primary/30 to-[#1e1e2e]" />
            {[
              { num: "01", title: "Briefing", desc: "Una reunión de una hora. Escuchamos, entendemos tu operativa y definimos qué automatizar primero." },
              { num: "02", title: "Configuración", desc: "En una o dos semanas tu agente está listo, entrenado con tus datos y adaptado a tus procesos." },
              { num: "03", title: "En producción", desc: "Tu equipo trabaja con él desde el primer día. Nosotros lo mantenemos y mejoramos mes a mes." },
            ].map((step, i) => (
              <FadeSection key={step.num} delay={i * 120} className="relative z-10">
                <div className="text-[11px] uppercase tracking-[3px] text-primary font-semibold mb-5">{step.num}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ALBARIA */}
      <section className="py-24 px-6 border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <p className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-5">Por qué Albaria</p>
            <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight mb-16">Resultados, no promesas</h2>
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { icon: <Zap size={18} className="text-primary" />, title: "Funcionando desde el primer día", desc: "Todas las herramientas están en producción. Puedes probarlas ahora antes de tomar ninguna decisión." },
              { icon: <Target size={18} className="text-primary" />, title: "Especialistas en B2B industrial", desc: "Maquinaria, impresión, packaging, distribución. Conocemos los procesos de tu sector." },
              { icon: <Lock size={18} className="text-primary" />, title: "Tus datos son tuyos", desc: "Los agentes se entrenan con tu documentación. Ningún tercero tiene acceso a tu información." },
              { icon: <TrendingUp size={18} className="text-primary" />, title: "Retorno desde el primer mes", desc: "La mayoría de clientes recuperan la inversión en las primeras semanas de uso real." },
            ].map((item, i) => (
              <FadeSection key={item.title} delay={(i + 1) * 80} className="flex gap-5">
                <div className="shrink-0 mt-0.5 w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1.5 text-white">{item.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* CASO DE ÉXITO: KENTO */}
      <section className="py-24 px-6 border-t border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <p className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-5">Caso de éxito</p>
          </FadeSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeSection delay={80}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-[#1e1e2e]">
                  <span className="text-xs font-semibold text-white tracking-wide">Kento Digital Printing</span>
                  <span className="text-xs text-muted-foreground">· Impresión digital industrial</span>
                </div>
                <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                  Cómo Kento recuperó<br />horas de trabajo al día
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kento Digital Printing produce logos, vinilos, señalética y materiales de impresión de gran formato para clientes de todo tipo. Con un volumen alto de presupuestos, consultas técnicas y búsqueda continua de nuevos clientes, los tres agentes de Albaria transformaron la forma en que trabaja su equipo.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  El resultado fue inmediato: menos horas perdidas buscando información, reducción directa en costes de personal y una operativa comercial más rápida de principio a fin.
                </p>
              </div>
            </FadeSection>
            <FadeSection delay={160}>
              <div className="space-y-4">
                {[
                  {
                    label: "Lead Generator Engine",
                    result: "Identifica clientes potenciales en el sector de forma autónoma. El equipo comercial dedica su tiempo a cerrar, no a buscar.",
                  },
                  {
                    label: "Secure Doc AI",
                    result: "Responde al instante consultas sobre materiales, acabados y especificaciones técnicas. Sin esperas, sin depender de nadie.",
                  },
                  {
                    label: "Offer Configurator",
                    result: "Genera presupuestos detallados en minutos. Lo que antes llevaba horas y podía tener errores, ahora sale en un clic.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-[#0A0A0F] border border-[#1e1e2e] rounded-xl hover:border-primary/30 transition-colors">
                    <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1.5">{item.label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.result}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-5 border-t border-[#1e1e2e]">
                  <p className="text-[15px] text-muted-foreground italic leading-relaxed">
                    "Probamos los tres agentes desde el primer día. El ahorro en tiempo y en costes de personal fue visible desde la primera semana."
                  </p>
                  <p className="text-sm font-semibold text-white mt-3">Equipo Kento Digital Printing</p>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="reservar" className="py-32 px-6 border-t border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <FadeSection>
            <p className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-5">Contacto</p>
            <h2 className="text-4xl md:text-[48px] font-semibold tracking-tight mb-6 leading-tight">
              ¿Tu empresa<br />necesita esto?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Reserva 20 minutos. Sin compromiso. Si no veo cómo ayudarte, te lo digo en la primera reunión.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <span>Respuesta en menos de 24 horas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <span>Sin presentaciones de 40 diapositivas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <span>jaime@albariasolutions.com</span>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={120}>
            {formSent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <CheckCircle size={48} className="text-[#10B981]" />
                <h3 className="text-2xl font-semibold">Mensaje enviado</h3>
                <p className="text-muted-foreground">Tu cliente de correo se ha abierto con el mensaje listo. Jaime responderá en menos de 24h.</p>
                <button onClick={() => { setFormSent(false); setFormData({ nombre: "", empresa: "", mensaje: "" }); }}
                  className="text-sm text-primary hover:brightness-125 transition-all mt-2">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} data-testid="form-contacto" className="bg-[#0A0A0F] border border-[#1e1e2e] rounded-xl p-8 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nombre" className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <input id="nombre" data-testid="input-nombre" type="text" required placeholder="Tu nombre"
                      value={formData.nombre} onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      className="bg-[#111118] border border-[#1e1e2e] rounded-[6px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="empresa" className="text-sm font-medium text-muted-foreground">Empresa</label>
                    <input id="empresa" data-testid="input-empresa" type="text" required placeholder="Tu empresa"
                      value={formData.empresa} onChange={e => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                      className="bg-[#111118] border border-[#1e1e2e] rounded-[6px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="mensaje" className="text-sm font-medium text-muted-foreground">
                    Cuéntanos qué necesitas <span className="text-muted-foreground/40 font-normal">(opcional)</span>
                  </label>
                  <textarea id="mensaje" data-testid="textarea-mensaje" rows={4}
                    placeholder="¿Qué proceso quieres automatizar? ¿Cuál es el mayor cuello de botella en tu equipo?"
                    value={formData.mensaje} onChange={e => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                    className="bg-[#111118] border border-[#1e1e2e] rounded-[6px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                </div>
                <button type="submit" data-testid="button-submit-contacto"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-[6px] font-medium text-[15px] transition-all hover:brightness-110 shadow-lg shadow-primary/20">
                  Enviar mensaje <ArrowRight size={17} />
                </button>
              </form>
            )}
          </FadeSection>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-[#1e1e2e] bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <AlbariaLogo className="h-7" />
          <p className="text-sm text-muted-foreground">© 2025 Albaria Solutions</p>
          <a href="mailto:jaime@albariasolutions.com" className="text-sm text-muted-foreground hover:text-white transition-colors">jaime@albariasolutions.com</a>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {activeDemo && (
        <DemoModal
          demo={activeDemo}
          timeLeft={timeLeft}
          totalDuration={DEMO_DURATION}
          onClose={closeDemo}
          onExpired={handleDemoExpired}
          onContactClick={handleContactFromDemo}
        />
      )}
    </div>
  );
}
