export function SiteFooter() {
  return (
    <footer className="px-6 md:px-12 py-12 mt-20 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <a
          href="mailto:raquelquintana009@gmail.com"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          raquelquintana009@gmail.com
        </a>

        <a
          href="https://linkedin.com/in/raquelquintana009"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          LinkedIn.com/in/raquelquintana009
        </a>
      </div>
    </footer>
  )
}
