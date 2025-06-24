export function SiteLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z" />
        <path d="M18.5 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
        <path d="M12 12.5a9 9 0 0 0-9 9" />
        <path d="M14 14.5a2 2 0 1 0-4 0" />
        <path d="M12 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      </svg>
    )
  }
  
