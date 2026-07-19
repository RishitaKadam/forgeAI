import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, MessageSquare, Search, FileText, LayoutDashboard,
  Sigma, Network, GitCompare, FileOutput, Mic, Github, Zap, ShieldCheck,
  Layers, CheckCircle2,
} from "lucide-react";

const FEATURES = [
  { icon: LayoutDashboard, title: "Engineering Dashboard", desc: "Instant stats: page count, reading time, top terms and detected specs pulled straight from your document." },
  { icon: Search, title: "Smart Search", desc: "Semantic search with exact page navigation - jump straight to where an answer lives." },
  { icon: FileText, title: "AI Executive Summary", desc: "A structured, board-ready summary generated in seconds, no more skimming 40-page PDFs." },
  { icon: Sigma, title: "Formula Extractor", desc: "Automatically finds every equation in the document and explains each variable." },
  { icon: Network, title: "Knowledge Graph", desc: "Visualizes how concepts, components and processes in your document relate to each other." },
  { icon: GitCompare, title: "Compare Two PDFs", desc: "Drop in two documents and get a clean side-by-side breakdown of similarities and differences." },
  { icon: FileOutput, title: "AI Report Generator", desc: "Turns raw documents into a formal report - overview, findings, specs, risks, recommendations." },
  { icon: Mic, title: "Voice In, Voice Out", desc: "Ask questions by speaking and have ForgeAI read the answers back to you, hands-free." },
];

const STEPS = [
  { title: "Upload your PDF", desc: "Manuals, datasheets, research papers or reports - drag, drop, done." },
  { title: "ForgeAI reads & indexes it", desc: "Your document is chunked, embedded and made instantly searchable." },
  { title: "Ask, search, or generate", desc: "Chat by voice or text, or jump into any of the 7 intelligence tools." },
];

const TECH = ["React 19", "FastAPI", "Gemini AI", "ChromaDB", "Vector Search", "Tailwind CSS"];

function Nav() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-600/30">
            F
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ForgeAI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#tech" className="hover:text-white transition">Tech stack</a>
        </div>

        <Link
          to="/workspace"
          className="flex items-center gap-1.5 bg-white text-slate-950 hover:bg-slate-200 transition text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          Launch App <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <Nav />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 text-center">
        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5" /> AI Engineering Intelligence Platform
        </span>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl mx-auto">
          Talk to your PDFs.
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            Get engineering answers.
          </span>
        </h1>

        <p className="mt-7 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-8">
          ForgeAI reads manuals, datasheets and research papers so you don't have to.
          Chat by voice or text, extract formulas, map knowledge graphs, compare documents
          and generate reports - all in one dark, focused workspace.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/workspace"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/25"
          >
            Launch ForgeAI <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 border border-white/10 hover:border-white/25 text-slate-200 transition px-8 py-4 rounded-2xl"
          >
            Explore features
          </a>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          {["No sign-up required", "Free & open backend", "Runs on your own API key"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
            </span>
          ))}
        </div>

        {/* Product preview mock */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-slate-900/80">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="grid grid-cols-4 gap-4 p-6 text-left">
              <div className="col-span-1 space-y-2">
                {["AI Chat", "Smart Search", "Dashboard", "Formulas", "Knowledge Graph"].map((label, i) => (
                  <div key={label} className={`px-3 py-2 rounded-lg text-xs font-medium ${i === 0 ? "bg-blue-600/20 text-blue-300 border border-blue-600/30" : "text-slate-500"}`}>
                    {label}
                  </div>
                ))}
              </div>
              <div className="col-span-3 bg-slate-950/60 rounded-xl border border-white/5 p-5">
                <div className="flex justify-end mb-3">
                  <div className="bg-blue-600 text-white text-xs rounded-2xl rounded-br-md px-4 py-2 max-w-[70%]">
                    Explain the torque spec on page 12
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-slate-800 text-slate-300 text-xs rounded-2xl rounded-bl-md px-4 py-2 max-w-[75%] leading-5">
                    The maximum torque of <b className="text-white">45 N·m</b> applies to the M8 fasteners
                    described in Section 4.2, page 12...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Everything in one workspace</span>
          <h2 className="text-4xl font-bold mt-3">Not just a chatbot.</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Eight focused tools built specifically for reading and reasoning about technical documents.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-slate-900/50 border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-5 group-hover:bg-blue-600/20 transition">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Simple by design</span>
          <h2 className="text-4xl font-bold mt-3">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="text-5xl font-extrabold text-white/10 mb-3">0{i + 1}</div>
              <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-6">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlight strip */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Zap, title: "Fast, structured answers", desc: "Markdown-formatted responses with headings, tables and citations - never a wall of text." },
            { icon: Mic, title: "Hands-free by voice", desc: "Speak your question, listen to the answer. Built on native browser speech APIs." },
            { icon: ShieldCheck, title: "Your documents, your key", desc: "Runs on your own Gemini API key against your own backend - nothing shared." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
              <Icon className="w-5 h-5 text-blue-400 mb-4" />
              <h4 className="font-semibold text-white mb-1.5">{title}</h4>
              <p className="text-sm text-slate-400 leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section id="tech" className="max-w-5xl mx-auto px-6 lg:px-10 py-24 text-center">
        <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Under the hood</span>
        <h2 className="text-3xl font-bold mt-3 mb-10">Built on a real production stack</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH.map((t) => (
            <span key={t} className="flex items-center gap-2 bg-slate-900/60 border border-white/10 text-slate-300 text-sm px-4 py-2 rounded-full">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 pb-28">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-slate-900 to-indigo-600/10 p-14 text-center overflow-hidden">
          <MessageSquare className="w-10 h-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stop reading. Start asking.</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Upload your first document and see ForgeAI turn it into an interactive, voice-ready engineering assistant.
          </p>
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-200 transition font-semibold px-8 py-4 rounded-2xl"
          >
            Launch ForgeAI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} ForgeAI. Built with React &amp; FastAPI.</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition">
            <Github className="w-4 h-4" /> View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
