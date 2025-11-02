'use client'

import { type CardStatus } from '@/lib/types'
import { STATUS_CONFIG } from '@/lib/constants'

interface StatusDotProps {
  status: CardStatus
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function StatusDot({ status, size = 'sm', showLabel = true }: StatusDotProps) {
  const config = STATUS_CONFIG[status]
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
  
  // Don't show todo status (default state)
  if (status === 'todo') {
    return null
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`${dotSize} rounded-full ${config.color}`} />
      {showLabel && (
        <span className={`text-xs ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}

