import ReactMarkdown from 'react-markdown';
import styles from './markdown.module.css';

interface MarkdownProps {
  className?: string;
  children?: React.ReactNode
  style?: React.CSSProperties 
  content: string;
}

export default function Markdown({children, className = '', content=''} : MarkdownProps) {
	return (
		<div className={`${styles.markdown} ${className}`}> 
			<ReactMarkdown>{content}</ReactMarkdown>
			{
				children
			}
		</div>
		)
}