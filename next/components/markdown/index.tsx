import ReactMarkdown from 'react-markdown';
import styles from './markdown.module.css';

interface MarkdownProps {
  className?: string;
  content: string;
}

export default function Markdown({className = '', content=''} : MarkdownProps) {
	return (
		<div className={`${styles.markdown} ${className}`}> 
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
		)
}