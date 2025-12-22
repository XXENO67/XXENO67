import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import { Briefcase, Shield, Users, DollarSign, ChevronRight } from 'lucide-react'
import siteConfig from '../../config/site.config.json'
import './Jobs.css'

const categoryIcons: Record<string, React.ReactNode> = {
  emergency: <Shield className="w-5 h-5" />,
  civilian: <Users className="w-5 h-5" />,
  criminal: <Briefcase className="w-5 h-5" />,
  business: <DollarSign className="w-5 h-5" />
}

export const Jobs = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredJob, setHoveredJob] = useState<string | null>(null)
  const containerRef = useRef<HTMLElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const filteredJobs = selectedCategory === 'all' 
    ? siteConfig.jobs.list 
    : siteConfig.jobs.list.filter(job => job.category === selectedCategory)

  // Initial animations for title and sidebar (only once)
  useGSAP(() => {
    // Title animation
    gsap.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
    
    // Sidebar animation
    gsap.from(sidebarRef.current, {
      x: -50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      scrollTrigger: {
        trigger: sidebarRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && containerRef.current?.contains(trigger.trigger as Element)) {
          trigger.kill()
        }
      })
    }
  }, { scope: containerRef }) // No dependencies - runs only once

  // Separate effect for animating job cards on category change
  useEffect(() => {
    // Animate job cards when category changes
    const cards = gsap.utils.toArray('.job-card') as Element[]
    
    // Set initial state
    gsap.set(cards, { opacity: 0, y: 30, rotateX: -15, scale: 0.9 })
    
    // Animate in with stagger and 3D effects
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    })

    // Add floating animation to cards
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: Math.sin(index * 0.5) * 5,
        duration: 2 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1
      })
    })
  }, [selectedCategory])

  return (
    <section ref={containerRef} id="jobs" className="relative py-20 bg-gta-black overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-gta-gold rounded-full animate-ping" style={{animationDelay: '0s'}} />
        <div className="absolute top-20 right-20 w-1 h-1 bg-gta-green rounded-full animate-ping" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-gta-gold rounded-full animate-ping" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-gta-green rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-gta-gold rounded-full animate-ping" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gta-green rounded-full animate-ping" style={{animationDelay: '2.5s'}} />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>
      <div className="container-gta">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Left Sidebar - GTA Menu Style */}
          <div ref={sidebarRef} className="lg:col-span-3">
            <div ref={titleRef} className="mb-8">
              <h2 className="text-5xl md:text-7xl font-bebas text-white mb-2">
                Verfügbare Jobs
              </h2>
              <p className="text-gta-light">
                Wähle deinen Karriereweg
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full menu-item-gta text-left ${
                  selectedCategory === 'all' ? 'menu-item-active' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4" />
                  Alle Jobs
                </span>
              </button>
              {siteConfig.jobs.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full menu-item-gta text-left ${
                    selectedCategory === category.id ? 'menu-item-active' : ''
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {categoryIcons[category.id]}
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Jobs Grid */}
          <div ref={contentRef} className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card group relative transform transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                  style={{ perspective: '1000px' }}
                >
                  <div className="card-gta h-full flex flex-col relative overflow-hidden transform-gpu transition-all duration-500 group-hover:rotateY-5 group-hover:rotateX-2">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gta-gold/10 via-gta-green/5 to-gta-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gta-gold/30 via-gta-green/30 to-gta-gold/30 blur-sm animate-pulse" />
                    </div>

                    {/* Animated scan line */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className="absolute -top-full left-0 w-full h-1 bg-gradient-to-r from-transparent via-gta-gold to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan-down" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Job Header with Category */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bebas text-white mb-1 group-hover:text-gta-gold transition-all duration-500 transform group-hover:scale-105 group-hover:drop-shadow-glow">
                          {job.name}
                        </h3>
                        <p className="text-sm text-gta-gold uppercase tracking-wider">
                          {siteConfig.jobs.categories.find(c => c.id === job.category)?.name}
                        </p>
                      </div>
                      <div className="text-gta-green group-hover:text-gta-gold transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
                        {categoryIcons[job.category]}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gta-light flex-1 mb-4 group-hover:text-white transition-all duration-500 transform group-hover:translate-x-1">
                      {job.description}
                    </p>

                    {/* Requirements */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      hoveredJob === job.id ? 'max-h-40' : 'max-h-0'
                    }`}>
                      <div className="border-t border-gta-medium pt-4">
                        <p className="text-xs text-gta-gold uppercase tracking-wider mb-2 animate-pulse">Anforderungen</p>
                        <ul className="space-y-1 mb-4">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-sm text-gta-light flex items-start gap-2 transform transition-all duration-300 hover:text-white hover:translate-x-1">
                              <span className="text-gta-green mt-1 animate-pulse">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Discord Link Button */}
                        {(job as any).discordLink && (
                          <a
                            href={(job as any).discordLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm rounded-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-[#5865F2]/50 hover:-translate-y-1 relative overflow-hidden"
                          >
                            <svg className="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                            Discord beitreten
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gta-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gta-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gta-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gta-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}