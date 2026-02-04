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
import { useOrders, useUpdateOrderStatus, useUpdateOrderPaymentStatus } from "@/hooks/useOrders";
import type { OrderStatus, PaymentStatus } from "@/lib/api/orders";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    refunded: {
      className:
        "border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900/70 dark:text-white/80",
      label: "Remboursée",
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

  const { data, isLoading, error } = useOrders({
    status: statusFilter,
    paymentStatus: paymentFilter,
    search: searchQuery || undefined,
  });
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentStatusMutation = useUpdateOrderPaymentStatus();

  const orders = data?.orders ?? [];
  const stats = data?.stats;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
      toast.success("Statut mis à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    try {
      await updatePaymentStatusMutation.mutateAsync({ id: orderId, paymentStatus: newPaymentStatus });
      toast.success("Statut de paiement mis à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour du paiement");
    }
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "PENDING", label: "En attente" },
    { value: "PROCESSING", label: "En traitement" },
    { value: "SHIPPED", label: "Expédiée" },
    { value: "DELIVERED", label: "Livrée" },
    { value: "CANCELLED", label: "Annulée" },
    { value: "REFUNDED", label: "Remboursée" },
  ];

  const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
    { value: "PENDING", label: "En attente" },
    { value: "PAID", label: "Payée" },
    { value: "FAILED", label: "Échouée" },
    { value: "REFUNDED", label: "Remboursée" },
    { value: "PARTIALLY_REFUNDED", label: "Partiellement remboursée" },
  ];

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

  const filteredOrders = orders;
  const formatFCFA = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
        <Card>
          <CardHeader>
            <CardDescription>Commandes Total</CardDescription>
            <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
              {stats ? stats.total.toLocaleString("fr-FR") : "-"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>En Attente</CardDescription>
            <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
              {stats ? stats.pending : "-"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Revenus Total</CardDescription>
            <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
              {stats
                ? `${formatFCFA(stats.totalRevenue)} FCFA`
                : "-"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Livrées</CardDescription>
            <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
              {stats ? stats.delivered : "-"}
            </CardTitle>
          </CardHeader>
        </Card>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="py-24 text-center text-muted-foreground">
                Erreur lors du chargement des commandes.
              </div>
            ) : (
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
                            {order.orderNumber}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-xs">{order.customer.split(" ")[1]}</div>

                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {order.products.map((product, idx) => (
                              <div key={idx} className="text-xs">
                                {product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name} x{product.quantity}
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
                          <span className="font-semibold text-xs">
                            {formatFCFA(order.total)} FCFA
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value as OrderStatus)
                              }
                              disabled={
                                updateStatusMutation.isPending &&
                                updateStatusMutation.variables?.id === order.id
                              }
                            >
                              <SelectTrigger className="w-[140px] h-8 border-0 shadow-none bg-transparent hover:bg-muted/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {updateStatusMutation.isPending &&
                              updateStatusMutation.variables?.id === order.id && (
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={order.paymentStatus}
                              onValueChange={(value) =>
                                handlePaymentStatusChange(order.id, value as PaymentStatus)
                              }
                              disabled={
                                updatePaymentStatusMutation.isPending &&
                                updatePaymentStatusMutation.variables?.id === order.id
                              }
                            >
                              <SelectTrigger className="w-[160px] h-8 border-0 shadow-none bg-transparent hover:bg-muted/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {paymentStatusOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {updatePaymentStatusMutation.isPending &&
                              updatePaymentStatusMutation.variables?.id === order.id && (
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                              )}
                          </div>
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
                              {order.status.toLowerCase() !== "shipped" &&
                                order.status.toLowerCase() !== "delivered" && (
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 size-4" />
                                    Marquer comme expédiée
                                  </DropdownMenuItem>
                                )}
                              {order.status.toLowerCase() === "shipped" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 size-4" />
                                  Marquer comme livrée
                                </DropdownMenuItem>
                              )}
                              {order.status.toLowerCase() !== "cancelled" && (
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
            )}
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
