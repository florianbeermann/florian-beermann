export function LinkLabel({ children }: { children: string }) {
  return (
    <span className="link-label" data-label={children}>
      <span>{children}</span>
    </span>
  );
}
