'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface BreadcrumbProps {
  basePath?: string; 
  labels?: {
    [string] : string
  },
  className? : string
}

function getRelativePath(path: string, basePath: string = "") {
  if (! basePath) {
    return basePath
  }
  return path.startsWith(basePath)
    ? path.slice(basePath.length)
    : path;
}

function caclulateLabel(segment: string, labels?: string[]) {
  return labels && Object.keys(labels).includes(segment) ? labels[segment] : segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Breadcrumb({ className= '', basePath = '', labels = [] }: BreadcrumbProps){

  const path = usePathname();
  const relativePath = getRelativePath(path, basePath)

  const pathSegments = relativePath.split('/').filter((segment) => segment );

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = basePath + '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const label = caclulateLabel(segment, labels)

    return (
      <li key={href} className="inline-flex items-center">
        {!isLast ? (
          <>
            <Link href={href} className="text-blue-600 hover:underline">
              {label}
            </Link>
            <span className="mx-2 text-gray-500"> > </span>
          </>
        ) : (
          <span className="text-gray-500">{label}</span>
        )}
      </li>
    );
  });

  return (
    <nav aria-label="breadcrumb" className={`mb-4 ${className}`}>
      <ol className="flex items-center space-x-1">
        <li className="inline-flex items-center">
          <Link href={basePath} className="text-blue-600 hover:underline">
            {caclulateLabel(basePath, labels)}
          </Link>
          {pathSegments.length > 0 && <span className="mx-2 text-gray-500"> &gt </span>}
        </li>
        {breadcrumbs}
      </ol>
    </nav>
  );
};
