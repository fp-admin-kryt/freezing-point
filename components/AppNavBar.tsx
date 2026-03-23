"use client"

import { Home, BookOpen, Radio, Info } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Research", url: "/research", icon: BookOpen },
  { name: "Radar", url: "/radar", icon: Radio },
  { name: "About", url: "/about", icon: Info },
]

export function AppNavBar() {
  return <NavBar items={navItems} />
}
