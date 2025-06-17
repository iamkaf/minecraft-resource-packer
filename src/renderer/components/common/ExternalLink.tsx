import React from 'react';
import { useExternalLink } from '../../hooks/useExternalLink';

interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function ExternalLink({
  href,
  children,
  ...rest
}: ExternalLinkProps) {
  const onClick = useExternalLink(href);
  return (
    <a {...rest} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
