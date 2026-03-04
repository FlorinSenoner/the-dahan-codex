interface GameSummaryProps {
  spiritDisplay: string
  moreSpirits?: string
  adversaryDisplay?: string | null
}

export function GameSummary({ spiritDisplay, moreSpirits, adversaryDisplay }: GameSummaryProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="truncate font-medium">
        {spiritDisplay}
        {moreSpirits && <span className="text-muted-foreground font-normal">{moreSpirits}</span>}
      </div>
      {adversaryDisplay && (
        <div className="text-sm text-muted-foreground truncate">vs {adversaryDisplay}</div>
      )}
    </div>
  )
}
