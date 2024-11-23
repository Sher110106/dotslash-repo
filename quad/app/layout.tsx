export default function Layout({ children }: { children: React.ReactNode }) {
  // Assuming you use a theme logic to switch between dark and light mode
  const themeClass = "dark"; // Set theme class for SSR

  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}