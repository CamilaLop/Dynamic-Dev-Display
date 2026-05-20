export function Footer() {
  return (
    <footer id="contact" className="bg-[#201d1d] text-[#f4f4f1] py-24 px-8 md:px-16 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-12">
        <h2 className="text-4xl md:text-6xl tracking-tight font-medium" style={{ letterSpacing: '-0.06em' }}>Let's build something exceptional.</h2>
        <a href="mailto:camila@example.com" className="text-xl md:text-2xl border-b border-[#f4f4f1]/30 pb-1 hover:border-[#f4f4f1] transition-colors uppercase tracking-widest text-[#f4f4f1]/80 hover:text-[#f4f4f1]">
          camila@example.com
        </a>
        <div className="flex gap-8 mt-8 text-sm tracking-widest uppercase text-[#f4f4f1]/50">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#f4f4f1] transition-colors">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#f4f4f1] transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
