"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  CirclePlus,
  Funnel,
  ArrowUpDown,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Edit,
  Trash2,
  Copy,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data pour les commandes
const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    products: [
      { name: "Nike Air Max", quantity: 1, price: 129.99 },
      { name: "Adidas Socks", quantity: 2, price: 9.99 },
    ],
    total: 149.97,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "123 Main St, London, UK",
    createdAt: "2025-01-15",
    shippedAt: "2025-01-16",
    deliveredAt: "2025-01-18",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    products: [{ name: "iPhone 16 Pro", quantity: 1, price: 1299.99 }],
    total: 1299.99,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "456 Oak Ave, Manchester, UK",
    createdAt: "2025-01-14",
    shippedAt: "2025-01-15",
    deliveredAt: null,
  },
  {
    id: "#ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    products: [{ name: "Samsung Galaxy S25", quantity: 1, price: 1199.99 }],
    total: 1199.99,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "789 Pine Rd, Birmingham, UK",
    createdAt: "2025-01-14",
    shippedAt: null,
    deliveredAt: null,
  },
  {
    id: "#ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    products: [{ name: "realme Buds Wireless 5", quantity: 1, price: 139.99 }],
    total: 139.99,
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: "321 Elm St, Liverpool, UK",
    createdAt: "2025-01-13",
    shippedAt: null,
    deliveredAt: null,
  },
  {
    id: "#ORD-005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    products: [
      { name: "Nike Air Max", quantity: 2, price: 129.99 },
      { name: "Running Shorts", quantity: 1, price: 29.99 },
    ],
    total: 289.97,
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: "654 Maple Dr, Leeds, UK",
    createdAt: "2025-01-12",
    shippedAt: null,
    deliveredAt: null,
  },
];

const stats = [
  {
    title: "Commandes Total",
    value: "1,234",
    change: "+15.2%",
    trend: "up",
  },
  {
    title: "En Attente",
    value: "23",
    change: "-5",
    trend: "down",
  },
  {
    title: "Revenus Total",
    value: "£45,678",
    change: "+18.5%",
    trend: "up",
  },
  {
    title: "Taux de Conversion",
    value: "3.2%",
    change: "+0.5%",
    trend: "up",
  },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { className: string; label: string }> = {
    pending: {
      className:
        "border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/70 dark:text-white/80",
      label: "En attente",
    },
    processing: {
      className:
        "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
      label: "En traitement",
    },
    shipped: {
      className:
        "border-purple-400 bg-purple-50 text-purple-800 dark:bg-purple-900/70 dark:text-white/80",
      label: "Expédiée",
    },
    delivered: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "Livrée",
    },
    cancelled: {
      className:
        "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
      label: "Annulée",
    },
  };

  const statusConfig = statusMap[status] || statusMap.pending;
  return (
    <Badge className={`capitalize ${statusConfig.className}`}>
      {statusConfig.label}
    </Badge>
  );
};

const getPaymentStatusBadge = (status: string) => {
  const statusMap: Record<string, { className: string; label: string }> = {
    paid: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "Payée",
    },
    pending: {
      className:
        "border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/70 dark:text-white/80",
      label: "En attente",
    },
    refunded: {
      className:
        "border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900/70 dark:text-white/80",
      label: "Remboursée",
    },
    failed: {
      className:
        "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
      label: "Échouée",
    },
  };

  const statusConfig = statusMap[status] || statusMap.pending;
  return (
    <Badge className={`capitalize ${statusConfig.className}`}>
      {statusConfig.label}
    </Badge>
  );
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function OrdersPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(orders.map((o) => o.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <Package className="size-6 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight orbitron">
            Commandes
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
                    {stat.value}
                  </CardTitle>
                </div>
                <CardAction>
                  <Badge
                    variant="outline"
                    className={
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stat.change}
                  </Badge>
                </CardAction>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="pt-4">
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Rechercher par ID, client, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <div className="hidden gap-2 md:flex">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les paiements</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="refunded">Remboursée</SelectItem>
                    <SelectItem value="failed">Échouée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="inline md:hidden">
                <Button variant="outline" size="icon">
                  <Funnel className="size-4" />
                </Button>
              </div>
            </div>
            <div className="ms-auto flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default">
                    <span className="hidden lg:inline">Colonnes</span>
                    <Columns2 className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Toutes les colonnes</DropdownMenuItem>
                  <DropdownMenuItem>Colonnes personnalisées</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">
                    <Checkbox
                      checked={
                        selectedRows.length === orders.length &&
                        orders.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      ID Commande
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Client
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Produits
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Montant
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Statut
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Paiement
                  </TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Aucune commande trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(order.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(order.id, checked === true)
                          }
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-medium">
                          {order.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="text-sm">
                              {product.name} x{product.quantity}
                            </div>
                          ))}
                          {order.products.length > 1 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              +{order.products.length - 1} autre(s)
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          £{order.total.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <span className="sr-only">Ouvrir le menu</span>
                              <Ellipsis className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/commandes/${order.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 size-4" />
                                Voir les détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/commandes/${order.id}/edit`}
                                className="flex items-center"
                              >
                                <Edit className="mr-2 size-4" />
                                Modifier le statut
                              </Link>
                            </DropdownMenuItem>
                            {order.status !== "shipped" &&
                              order.status !== "delivered" && (
                                <DropdownMenuItem>
                                  <Truck className="mr-2 size-4" />
                                  Marquer comme expédiée
                                </DropdownMenuItem>
                              )}
                            {order.status === "shipped" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 size-4" />
                                Marquer comme livrée
                              </DropdownMenuItem>
                            )}
                            {order.status !== "cancelled" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                  <XCircle className="mr-2 size-4" />
                                  Annuler la commande
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedRows.length} sur {orders.length} ligne(s)
              sélectionnée(s).
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="size-4" />
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
