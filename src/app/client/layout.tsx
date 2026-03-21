export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-md bg-timtour-bg min-h-screen relative overflow-hidden flex flex-col font-sans sm:shadow-2xl sm:border sm:border-gray-100/50">
      <main className="flex-1 pb-[100px] overflow-y-auto no-scrollbar scroll-smooth">
        {children}
      </main>
    </div>
  );
}
