import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Shared markdown renderer so every AI response (chat, summary, report,
// formulas, compare) looks consistent - proper headings, spaced lists,
// styled tables and code blocks instead of one grey wall of text.
export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h1 className="text-2xl font-bold text-white mt-6 mb-3 first:mt-0" {...p} />,
          h2: (p) => <h2 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-slate-800 first:mt-0" {...p} />,
          h3: (p) => <h3 className="text-lg font-semibold text-blue-300 mt-5 mb-2" {...p} />,
          p: (p) => <p className="text-slate-200 leading-7 mb-4" {...p} />,
          ul: (p) => <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4 text-slate-200" {...p} />,
          ol: (p) => <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-4 text-slate-200" {...p} />,
          li: (p) => <li className="leading-6 pl-1" {...p} />,
          strong: (p) => <strong className="text-white font-semibold" {...p} />,
          a: (p) => <a className="text-blue-400 underline decoration-blue-700 hover:text-blue-300" target="_blank" rel="noreferrer" {...p} />,
          blockquote: (p) => (
            <blockquote className="border-l-4 border-blue-600 bg-slate-800/50 pl-4 py-2 my-4 text-slate-300 italic rounded-r-lg" {...p} />
          ),
          code: ({ inline, className: cls, children, ...rest }) =>
            inline ? (
              <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...rest}>
                {children}
              </code>
            ) : (
              <code className={`font-mono text-sm ${cls || ""}`} {...rest}>
                {children}
              </code>
            ),
          pre: (p) => (
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto mb-4 text-sm" {...p} />
          ),
          table: (p) => (
            <div className="overflow-x-auto mb-4 rounded-xl border border-slate-800">
              <table className="w-full text-sm" {...p} />
            </div>
          ),
          thead: (p) => <thead className="bg-slate-800/70" {...p} />,
          th: (p) => <th className="text-left font-semibold text-slate-200 px-4 py-2.5 border-b border-slate-700" {...p} />,
          td: (p) => <td className="px-4 py-2.5 border-b border-slate-800/70 text-slate-300 align-top" {...p} />,
          hr: () => <hr className="border-slate-800 my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
