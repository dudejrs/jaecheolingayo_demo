'use client'

interface ButtonProps {
	className?: string
	value?: string
	style?: React.CSSProperties 
	onClick: () => void
}

export default function Button({
	className= '',
	value = '클릭하세요',
	onClick
} : ButtonProps) {

return (
	<input className={`cursor-pointer font-bold rounded-lg bg-[var(--color-background-alt)] hover:bg-blue-500 hover:text-[var(--color-text-inversed)] ${className}`} type="button" value="색상 변경하기" onClick={onClick} />
  )
}