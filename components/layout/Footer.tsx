// Composant Footer

import { MoveRight } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto ">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl md:text-3xl orbitron font-bold mb-4">
              GET 10% OFF YOUR FIRST ORDER WHEN SIGNING UP TO OUR NEWSLETTER
            </h3>

            <div className="w-full mt-4">
              <div className="flex items-center gap-2 w-full px-4 py-2 border rounded">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full outline-none "
                />
                <MoveRight className="size-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="">
            <h4 className="font-semibold mb-4 orbitron text-lg md:text-xl">
              Information
            </h4>
            <ul className="space-y-2 text-sm md:text-base orbitron">
              <li>
                <Link href="/products">Videos</Link>
              </li>
              <li>
                <Link href="/cart">Reviews</Link>
              </li>
              <li>
                <Link href="/account">Authenticity</Link>
              </li>
              <li>
                <Link href="/account">Discount Codes</Link>
              </li>
              <li>
                <Link href="/account">Gift Cards</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 orbitron text-lg md:text-xl">
              Top Collections
            </h4>
            <ul className="space-y-2 text-sm md:text-base orbitron">
              <li>
                <Link href="/contact">New Arrivals</Link>
              </li>
              <li>
                <Link href="/faq">Best Sellers</Link>
              </li>
              <li>
                <Link href="/shipping">Sneakers</Link>
              </li>
              <li>
                <Link href="/shipping">Apparel</Link>
              </li>
              <li>
                <Link href="/shipping">Accessories</Link>
              </li>
              <li>
                <Link href="/shipping">Black Friday</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 orbitron text-lg md:text-xl">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm md:text-base orbitron">
              <li>
                <Link href="/terms">My Account</Link>
              </li>
              <li>
                <Link href="/privacy">Create a Return</Link>
              </li>
              <li>
                <Link href="/privacy">Track Your Order</Link>
              </li>
              <li>
                <Link href="/privacy">FAQs</Link>
              </li>
              <li>
                <Link href="/privacy">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy">Refund Policy</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/privacy">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy">Shipping Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm md:text-base text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} E-Commerce. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
