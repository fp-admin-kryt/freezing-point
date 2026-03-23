"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()

  const getActiveFromPath = (path: string) => {
    const match = items.find((i) => {
      if (i.url === "/") return path === "/"
      return path.startsWith(i.url)
    })
    return match?.name || items[0].name
  }

  const [activeTab, setActiveTab] = useState(getActiveFromPath(pathname))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setActiveTab(getActiveFromPath(pathname))
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-1 bg-black/40 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center pl-2 pr-3 opacity-70 hover:opacity-100 transition-opacity">
          <Image
            src="/assets/logos/fp-logo.png"
            alt="Freezing Point"
            width={22}
            height={22}
            className="object-contain"
          />
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mr-1" />

        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer px-5 py-2 rounded-full transition-colors duration-200",
                "text-white/40 hover:text-white/80",
                isActive && "text-white",
              )}
            >
              <span className="hidden md:inline font-sans font-light text-xs tracking-[0.15em]">
                {item.name}
              </span>
              <span className="md:hidden">
                <Icon size={17} strokeWidth={1.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/8 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-cobalt-light rounded-t-full">
                    <div className="absolute w-12 h-6 bg-cobalt-light/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-cobalt-light/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-cobalt-light/30 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
