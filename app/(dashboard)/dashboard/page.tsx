"use client";

import React from "react";
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

const stats = [
  {
    title: "Ventes totales",
    value: "£45,231",
    change: "+20.1%",
    trend: "up",
    icon: IconShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Produits",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: IconPackage,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Clients",
    value: "8,452",
    change: "+8.2%",
    trend: "up",
    icon: IconUsers,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Revenus",
    value: "£12,345",
    change: "-2.3%",
    trend: "down",
    icon: IconTrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    product: "Nike Air Max",
    amount: "£129.99",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    product: "Adidas Ultraboost",
    amount: "£149.99",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "#ORD-003",
    customer: "Bob Johnson",
    product: "Puma RS-X",
    amount: "£89.99",
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "#ORD-004",
    customer: "Alice Brown",
    product: "New Balance 550",
    amount: "£109.99",
    status: "completed",
    date: "2024-01-13",
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
};

export default function DashboardPage() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

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
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold orbitron">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === "up" ? (
                      <IconArrowUpRight className="size-4 text-green-600" />
                    ) : (
                      <IconArrowDownRight className="size-4 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-500">vs mois dernier</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="size-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold orbitron mb-2">
              Commandes récentes
            </h2>
            <p className="text-sm text-gray-600">
              Dernières commandes de votre boutique
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                    ID Commande
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm orbitron">
                    Produit
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
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-sm">{order.customer}</td>
                    <td className="py-3 px-4 text-sm">{order.product}</td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      {order.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[
                            order.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <IconPackage className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold orbitron">Ajouter un produit</h3>
              <p className="text-sm text-gray-600">Créer un nouveau produit</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <IconUsers className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold orbitron">Gérer les clients</h3>
              <p className="text-sm text-gray-600">Voir tous les clients</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <IconTrendingUp className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold orbitron">Voir les analytics</h3>
              <p className="text-sm text-gray-600">Analyser les performances</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
