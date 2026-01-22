import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HorizontalGallery } from "@/components/horizontal-gallery"

const projects = [
  {
    id: "Liminal Breath",
    title: "Liminal Breath",
    year: "Inflatable threshold installation | 2025",
    description:
      "An installation in an abandoned building set to be demolished. Viewing the building as a living organism, the work seeks to breathe life into the space moments before its death. As the wind moves through the building in an entropic dance, the material can inflate quickly, collapse slowly, transition from interior to exterior, and find a natural hypnotic rhythm. The forms begin to resemble ghostly lungs, growing and shrinking in a fragile fight for vitality. In the liminal state between life and death, life fills the building for one last time.",
    images: [
      "/images/1_Breath.jpg",
      "/images/2_Breath.jpg",
      "/images/3_Breath.jpg",
      "/images/4_Breath.jpg",
      "/images/5_Breath.jpg",
      "/images/6_Breath.JPG",
      "/images/7_Breath.JPG",
    ],
    videoEmbed:
      "https://www.youtube.com/embed/z5wdWnmcaOI?rel=0&modestbranding=1&controls=0&fs=0&iv_load_policy=3&playsinline=1",
  },
  {
    id: "Infinite Space",
    title: "Infinite Space",
    year: "Modular micro pavilion | 2025",
    description:
      "Attempts to break apart the conventional box. Shifting the stand’s legs allowed us to replace the standard volume with a crossroad, giving a level of choice to the users, while allowing for four sided interactions during markets. It provides new ways of encouraging social engagement, calling attention, and using shade to overcome boundaries. All components break down to fit into the four boxes shown, easily transporting locations by car.",
    images: [
      "/images/21_Infinite.JPG",
      "https://fi8lzzvr3fkqsil2.public.blob.vercel-storage.com/22_Infinite%20Space%20copy%20%281%29.mp4",
      "/images/24_Infinite.JPG",
      "/images/25_Infinite.JPG",
      "/images/26_Infinite.JPG",
    ],
  },
  {
    id: "Eixir",
    title: "Eixir",
    year: "Llum festival light installation | 2025",
    description:
      "Utilized a previously politically charged space to 'bring light' to the silenced neighbors' voices. Awarded a special mention for community involvement and was published in EL POBLENOU magazine.",
    images: [
      "/images/31_Eixir.jpg",
      "/images/32_Eixir.jpg",
      "/images/33_Eixir.jpg",
      "/images/34_Eixir.jpg",
      "/images/35_Eixir.jpg",
    ],
  },
  {
    id: "Catenary Pavilion",
    title: "Catenary Pavilion",
    year: "Suspended chain canopy | 2024",
    description:
      "Designed and Built with TAKK Architects exploring catenary curves using chains supported by wooden posts. The structure shifted the space from that of intimate gathering to a lively sensory playground as visitors could see the chains shine in the sun and hear them dance in the wind.",
    images: [
      "/images/41_Chain.jpg",
      "/images/44_Chain.jpg",
      "/images/43_Chain.jpg",
      "/images/45_Chain.jpg",
      "/images/46_Chain.jpg",
    ],
  },
  {
    id: "Market Street Power Plant",
    title: "Market Street Power Plant",
    year: "Adaptive reuse entertainment hub | 2022-2024",
    description:
      "The abandoned New Orleans Power Plant reimagined into a mixed use entertainment hub that pays respect and preserves its memory. It was important for us to not only keep the existing elements such as generators, turbines, and pipes, but to incorporate the new design around them. A radial staircase fully immerses visitors inside the pipe archway, and a turbine on level one became the centerpiece to the lobby. Visitors can now also enjoy the rooftop terrace equipped with a greenhouse-like event space that follows the language of the previous structure, while allowing for unobstructed views to the city.",
    images: [
      "/images/51_MSPP.jpg",
      "/images/52_MSPP.jpg",
      "/images/53_MSPP.jpg",
      "/images/54_MSPP.jpg",
      "/images/56_MSPP.png",
      "/images/57_MSPP.png",
    ],
  },
  {
    id: "Forum",
    title: "Forum",
    year: "Masterplan restaurant concept | 2022-2024",
    description:
      "Addition consisting of three buildings and landscape to a high end shopping center in Carlsbad, California. Asking the question of how to keep visitors on a site longer. Keep them entertained, comfortable, and excited to return.",
    images: [
      "/images/61_Forum.jpg",
      "/images/62_Forum.jpg",
      "/images/65_Forum.jpg",
      "/images/66_Forum.jpg",
      "/images/64_Forum.jpg",
    ],
  },
  {
    id: "Retina",
    title: "Retina",
    year: "Biophilic healthcare interior | 2024",
    description:
      "An eye clinic that cares about the other senses. Patients come with visual sensitivities, with their other senses heightened. The space welcomes their sensitivities and invites them in different ways. Color coding the floors helps to gently guide them into a welcoming environment, while felt ceilings and natural materials utilize their natural instincts, allowing them to feel safe during their wait times. It aims to satisfy patients’ needs in a way they don’t have to see.",
    images: ["/images/71_Retina.jpg", "/images/72_Retina.jpg", "/images/73_Retina.jpg", "/images/74_Retina.jpg"],
  },
  {
    id: "Horizon",
    title: "Horizon",
    year: "Environmental response study | 2021",
    description:
      "Where the earth meets the sky. A design that responds to the extreme weather in Galveston, Texas. Market stalls on the first floor retain water during a flood without damage to the building, and a large cloud-like canopy plays with the wind flowing in from the port keeping visitors cool during hot summer days.",
    images: [
      "/images/101_Horizon.jpg",
      "/images/105_Horizon.jpg",
      "/images/106_Horizon.jpg",
      "/images/102_Horizon.jpg",
      "/images/103_Horizon.JPG",
      "/images/104_Horizon.jpg",
    ],
  },
  {
    id: "Thesis: Senses Through Time",
    title: "Thesis: Senses Through Time",
    year: "Perception driven interventions | 2022",
    description: "bla bla bla",
    images: [
      "/images/114_Thesis.jpg",
      "/images/115_Thesis.jpg",
      "/images/116_Thesis.jpg",
      "/images/117_Thesis.jpg",
      "/images/118_Thesis.jpg",
      "/images/119_Thesis.jpg",
      "/images/120_Thesis.jpg",
      "/images/121_Thesis.jpg",
      "/images/122_Thesis.jpg",
      "/images/123_Thesis.jpg",
      "/images/124_Thesis.jpg",
    ],
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="pt-28 md:pt-[100px]">
        {/* ===== HERO / BIO ===== */}
        <section className="px-6 md:px-12 pb-0">
          <div className="max-w-3xl">
              <p className="text-base tracking-wide text-muted-foreground">
                Urban Designer • Public Realm • Experiential Interventions
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Combining corporate scale project delivery with hands on public realm, placemaking, and ephemeral
                architecture. Background spans urban interventions, adaptive reuse, and experiential public work. Strong at
                translating strategy into spatial concepts, leading multidisciplinary teams, and delivering design work that
                shapes how people experience cities.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Narratives, diagrams, frameworks",
                  "Human behavior + Movement",
                  "Time Based Change",
                  "Rhino / Revit / SketchUp / Adobe",
                ].map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
        </section>

        {/* ===== PROJECTS ===== */}
        <section className="pt-6">
          {projects.map((project) => (
            <HorizontalGallery
              key={project.id}
              id={project.id}
              title={project.title}
              year={project.year}
              description={project.description}
              images={project.images}
              videoEmbed={project.videoEmbed}
            />
          ))}
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="px-6 md:px-12 py-16">
          <div className="max-w-3xl rounded-2xl border p-6 md:p-10">
            <h2 className="text-2xl font-semibold">Contact</h2>

            <div className="mt-6 flex gap-2">
              <div className="flex-1 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Email</p>
                <a className="mt-1 block font-medium underline underline-offset-4 text-sm" href="mailto:raquelquintana009@gmail.com">
                  raquelquintana009@gmail.com
                </a>
              </div>

              <div className="flex-1 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">LinkedIn</p>
                <a
                  className="mt-1 block font-medium underline underline-offset-4 text-sm"
                  href="https://www.linkedin.com/in/raquelquintana009/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/raquelquintana009/
                </a>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href="/raquel_quintana_resume.pdf"
                download
                className="flex-1 inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Download Resume (PDF)
              </a>
              <a
                href="https://fi8lzzvr3fkqsil2.public.blob.vercel-storage.com/raquel_quintana_portfolio.pdf"
                download
                className="flex-1 inline-flex items-center justify-center rounded-md border border-foreground bg-background px-4 py-2 text-sm font-medium text-foreground hover:opacity-70"
              >
                Download Portfolio (PDF)
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
