"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import type { OrderList } from "@/lib/api/orders";

const formatFCFA = (amount: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En traitement",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const stats = useMemo(() => {
    const s = ordersData?.stats;
    const totalRevenue = s?.totalRevenue ?? 0;
    const totalOrders = s?.total ?? 0;
    const delivered = s?.delivered ?? 0;

    return [
      {
        title: "Ventes totales",
        value: `${formatFCFA(totalRevenue)} FCFA`,
        change: null as string | null,
        trend: "up" as const,
        icon: IconShoppingCart,
        color: "text-gray-400",
        bgColor: "bg-gray-50",
      },
      {
        title: "Produits",
        value: products.length.toString(),
        change: null,
        trend: "up" as const,
        icon: IconPackage,
        color: "text-gray-400",
        bgColor: "bg-gray-50",
      },
      {
        title: "Commandes",
        value: totalOrders.toString(),
        change: null,
        trend: "up" as const,
        icon: IconUsers,
        color: "text-gray-400",
        bgColor: "bg-gray-50",
      },
      {
        title: "Livrées",
        value: delivered.toString(),
        change: null,
        trend: "up" as const,
        icon: IconTrendingUp,
        color: "text-gray-400",
        bgColor: "bg-gray-50",
      },
    ];
  }, [ordersData?.stats, products.length]);

  const recentOrders: OrderList[] = useMemo(
    () => (ordersData?.orders ?? []).slice(0, 8),
    [ordersData?.orders]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 10 },
    },
  };

  const isLoading = ordersLoading || productsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold orbitron">Tableau de bord</h1>
        <p className="text-gray-600">
          Bienvenue dans votre espace d'administration
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="visible"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <motion.div key={i} variants={itemVariants} initial="visible" animate="visible">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <Loader2 className="size-6 animate-spin text-gray-400" />
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          stats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants} initial="visible" animate="visible">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-lg font-bold orbitron">{stat.value}</p>
                    {stat.change != null ? (
                      <div className="flex items-center gap-1 text-xs">
                        {stat.trend === "up" ? (
                          <IconArrowUpRight className="size-4 text-gray-400" />
                        ) : (
                          <IconArrowDownRight className="size-4 text-gray-400" />
                        )}
                        <span
                          className={
                            stat.trend === "up"
                              ? "text-gray-400"
                              : "text-gray-400"
                          }
                        >
                          {stat.change}
                        </span>
                        <span className="text-gray-500 text-xs">vs mois dernier</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Données en temps réel</span>
                    )}
                  </div>
                  <div
                    className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}
                  >
                    <stat.icon className="size-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold orbitron mb-2">
                Commandes récentes
              </h2>
              <p className="text-sm text-gray-600">
                Dernières commandes de votre boutique
              </p>
            </div>
            <Link
              href="/commandes"
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-gray-400" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                Aucune commande pour le moment
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                      N° Commande
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                      Produits
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                      Montant
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-sm">{order.customer}</td>
                      <td className="py-3 px-4 text-sm">
                        {order.products.length === 0
                          ? "-"
                          : order.products.length === 1
                            ? order.products[0].name
                            : `${order.products[0].name} +${order.products.length - 1}`}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        {formatFCFA(order.total)} FCFA
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-3"
      >
        <Link href="/ajouter-produits">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 text-gray-400 p-3 rounded-lg">
                <IconPackage className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold orbitron">Ajouter un produit</h3>
                <p className="text-sm text-gray-600">Créer un nouveau produit</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/commandes">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 text-gray-400 p-3 rounded-lg">
                <IconShoppingCart className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold orbitron">Gérer les commandes</h3>
                <p className="text-sm text-gray-600">Voir et traiter les commandes</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/produits-listes">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 text-gray-400 p-3 rounded-lg">
                <IconTrendingUp className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold orbitron">Catalogue produits</h3>
                <p className="text-sm text-gray-600">Gérer le catalogue</p>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
