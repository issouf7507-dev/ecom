import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/contexts/CartContext";
import { LenisProvider } from "@/providers/LenisProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LenisProvider>
        <CartProvider>
          <Header />
          <div className="bg-[#ffffff] text-black">{children}</div>

          <Footer />
        </CartProvider>
      </LenisProvider>
    </>
  );
}
