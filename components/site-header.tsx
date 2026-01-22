"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

const projectBuckets = [
  {
    name: "Built Public Interventions",
    projects: [
      { title: "Liminal Breath", id: "Liminal Breath" },
      { title: "Infinite Space", id: "Infinite Space" },
      { title: "Eixir", id: "Eixir" },
      { title: "Catenary Pavilion", id: "Catenary Pavilion" },
    ],
  },
  {
    name: "Professional Work",
    projects: [
      { title: "Market Street Power Plant", id: "Market Street Power Plant" },
      { title: "Forum", id: "Forum" },
      { title: "Retina", id: "Retina" },
    ],
  },
  {
    name: "Conceptual Studies",
    projects: [
      { title: "Horizon", id: "Horizon" },
      { title: "Thesis: Senses Through Time", id: "Thesis: Senses Through Time" },
    ],
  },
]

export function SiteHeader() {
  const [workOpen, setWorkOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [expandedBuckets, setExpandedBuckets] = useState<Set<string>>(new Set())
  const workRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (workRef.current && !workRef.current.contains(event.target as Node)) {
        setWorkOpen(false)
        setExpandedBuckets(new Set())
      }
      if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
        setContactOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const scrollToProject = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setWorkOpen(false)
    setExpandedBuckets(new Set())
  }

  const toggleBucket = (bucketName: string) => {
    setExpandedBuckets(prev => {
      const next = new Set(prev)
      if (next.has(bucketName)) {
        next.delete(bucketName)
      } else {
        next.add(bucketName)
      }
      return next
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between bg-background/80 backdrop-blur-sm">
      <Link
        href="/"
        className="font-medium text-foreground hover:opacity-70 transition-opacity text-base"
      >
        Raquel Quintana
      </Link>

      <nav className="flex items-center gap-6">
        {/* Work Dropdown */}
        <div ref={workRef} className="relative">
          <button
            onClick={() => {
              setWorkOpen(!workOpen)
              setContactOpen(false)
              if (workOpen) setExpandedBuckets(new Set())
            }}
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity rounded-sm"
          >
            Work
          </button>
          {workOpen && (
            <div className="absolute top-full right-0 mt-3 min-w-[220px] rounded-xl overflow-hidden border border-foreground/10 bg-background shadow-lg z-50 py-1">
              {projectBuckets.map((bucket) => (
                <div key={bucket.name}>
                  <div className="flex items-center">
                    <button
                      onClick={() => scrollToProject(bucket.projects[0].id)}
                      className="flex-1 text-left px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
                    >
                      {bucket.name}
                    </button>
                    <button
                      onClick={() => toggleBucket(bucket.name)}
                      className="px-3 py-2 text-foreground/50 hover:text-foreground transition-colors"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform ${expandedBuckets.has(bucket.name) ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  {expandedBuckets.has(bucket.name) && (
                    <div className="border-l border-foreground/10 ml-3">
                      {bucket.projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => scrollToProject(project.id)}
                          className="block w-full text-left pl-4 pr-3 py-1.5 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                        >
                          {project.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Dropdown */}
        <div ref={contactRef} className="relative">
          <button
            onClick={() => {
              setContactOpen(!contactOpen)
              setWorkOpen(false)
            }}
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            Contact
          </button>
          {contactOpen && (
            <div className="absolute top-full right-0 mt-3 min-w-[220px] rounded-xl overflow-hidden border border-foreground/10 bg-background shadow-lg z-50 py-1">
              <a
                href="mailto:raquelquintana009@gmail.com"
                className="block px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors"
              >
                raquelquintana009@gmail.com
              </a>
              <a
                href="https://linkedin.com/in/raquelquintana009"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
