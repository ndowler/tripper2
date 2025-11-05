'use client'

import { useState, useEffect } from 'react'

export function InteractiveGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate percentage position
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-500 ease-out"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgb(59, 130, 246) 0%, rgb(99, 102, 241) 25%, rgb(139, 92, 246) 50%, rgb(147, 51, 234) 100%)`,
      }}
    />
  )
}

