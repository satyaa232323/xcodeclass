export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg-login.png')" }}>
        {children}
      </div>
    );
}