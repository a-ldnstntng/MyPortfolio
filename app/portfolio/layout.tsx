import LayoutWrapper from "@/components/LayoutWrapper";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}