'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  activeClassName?: string
  className?: string
}

export default function NavLink({
  href,
  children,
  activeClassName = 'text-blue-500 font-bold',
  className = '',
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={clsx(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  )
}
