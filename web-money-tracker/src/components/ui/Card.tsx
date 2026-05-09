interface CardProps {
    header: React.ReactNode,
    content: React.ReactNode,
    footer: React.ReactNode,
}

export default function Card({header, content, footer}: CardProps){
    return (
      //Card
      <div className="flex flex-col bg-[var(--color-bg-secondary)] items-center justify-center p-6 border border-[var(--color-border-default)] rounded-2xl w-125 shadow-[var(--shadow-sm)]">
        {/**Header */}
        <header className="flex flex-col w-full">
          {header}
        </header>

        {/**Content */}
        <div className="flex flex-col w-full">
          {content}
        </div>

        {/**Footer */}
        <footer className="flex flex-col w-full">
          {footer}
        </footer>
      </div>
    );
}