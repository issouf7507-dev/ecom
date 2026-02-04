"use client";

// Composant Footer

import { MoveRight, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Newsletter */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl orbitron font-bold mb-2 text-black">
            -10% sur votre première commande
          </h3>
          <p className="text-gray-600 orbitron text-sm md:text-base mb-4">
            Inscrivez-vous à notre newsletter pour recevoir les offres et nouveautés.
          </p>
          <form
            className="flex gap-0 border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition-colors"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="flex items-center pl-4 text-gray-400">
              <Mail className="size-5" />
            </span>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 min-w-0 py-3 px-3 outline-none orbitron text-sm bg-white"
              aria-label="Email pour la newsletter"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-3 bg-black text-white orbitron font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              S&apos;inscrire
              <MoveRight className="size-4" />
            </button>
          </form>
        </div>

        {/* Liens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
          <div>
            <h4 className="orbitron font-bold text-black mb-4 text-sm uppercase tracking-wider">
              Boutique
            </h4>
            <ul className="space-y-3 orbitron text-sm text-gray-600">
              <li>
                <Link href="/products" className="hover:text-black transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-black transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link href="/collections/produits-a-venir" className="hover:text-black transition-colors">
                  Produits à venir
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-black transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="orbitron font-bold text-black mb-4 text-sm uppercase tracking-wider">
              Informations
            </h4>
            <ul className="space-y-3 orbitron text-sm text-gray-600">
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="hover:text-black transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/retours" className="hover:text-black transition-colors">
                  Retours & échanges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="orbitron font-bold text-black mb-4 text-sm uppercase tracking-wider">
              Compte
            </h4>
            <ul className="space-y-3 orbitron text-sm text-gray-600">
              <li>
                <Link href="/login" className="hover:text-black transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-black transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-black transition-colors">
                  Mon compte
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-black transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="orbitron font-bold text-black mb-4 text-sm uppercase tracking-wider">
              Légal
            </h4>
            <ul className="space-y-3 orbitron text-sm text-gray-600">
              <li>
                <Link href="/mentions-legales" className="hover:text-black transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-black transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-black transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="orbitron text-sm text-gray-500">
            &copy; {new Date().getFullYear()} — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
