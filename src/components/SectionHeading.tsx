import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', className = '' }: Props) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h-section mt-4">{title}</h2>
      {intro && <p className="lead mt-5">{intro}</p>}
    </div>
  )
}
