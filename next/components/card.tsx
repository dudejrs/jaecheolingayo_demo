import Link from 'next/link'

interface LinkProps {
	href: string
}

interface CardProps {
	className?: string,
	children?: React.ReactNode
}

export function CardLink({
	href,
	className = '',
	children
} : LinkProps & CardProps){	
	return (
			<Link href={href} className="w-75 h-50"> 
				<div  className={`w-75 h-50 text-[var(--custom-white)] bg-blue-500 hover:bg-blue-700 font-bold rounded-xl shadow-20 place-content-center text-center cursor-pointer ${className}`}>
				{children} 
				</div>
			</Link>
		);
}