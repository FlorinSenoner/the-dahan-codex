interface UpdateBannerProps {
  onReload: () => void;
}

/**
 * Non-dismissible update banner shown when a new service worker is waiting.
 * User must click "Reload" to activate the new version.
 */
export function UpdateBanner({ onReload }: UpdateBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-primary p-3 text-primary-foreground">
      <span className="text-sm">A new version is ready</span>
      <button
        type="button"
        onClick={onReload}
        className="rounded bg-background px-4 py-1 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
      >
        Reload
      </button>
    </div>
  );
}
