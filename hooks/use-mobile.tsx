"use client"

import { useEffect, useState } from "react"

// Define the hook once
function useIsMobileHook() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

// Export with both names to support all components
export const useMobile = useIsMobileHook
export const useIsMobile = useIsMobileHook
