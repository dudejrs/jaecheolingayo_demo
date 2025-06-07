'use client'

interface ButtonProps {
	disabled? : boolean
	className?: string
	value?: string
	style?: React.CSSProperties 
	onClick: () => void
}

export default function Button({
	disabled= false,
	className= '',
	value = '클릭하세요',
	onClick
} : ButtonProps) {

return (
	<input disabled={disabled} className={`${disabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : `cursor-pointer bg-[var(--color-background-alt)] hover:bg-blue-500 hover:text-[var(--color-text-inversed)]`} 
	font-bold rounded-lg ${className}`} type="button" value="색상 변경하기" onClick={onClick} />
  )
}