"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Star,
  Calendar,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data pour les clients
const customers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+44 20 1234 5678",
    totalOrders: 12,
    totalSpent: 2450.99,
    lastOrder: "2025-01-15",
    status: "active",
    joinDate: "2024-06-01",
    rating: 4.8,
    address: "123 Main St, London, UK",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+44 20 2345 6789",
    totalOrders: 8,
    totalSpent: 1890.5,
    lastOrder: "2025-01-14",
    status: "active",
    joinDate: "2024-08-15",
    rating: 4.9,
    address: "456 Oak Ave, Manchester, UK",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+44 20 3456 7890",
    totalOrders: 5,
    totalSpent: 890.25,
    lastOrder: "2025-01-10",
    status: "inactive",
    joinDate: "2024-09-20",
    rating: 4.5,
    address: "789 Pine Rd, Birmingham, UK",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "+44 20 4567 8901",
    totalOrders: 15,
    totalSpent: 3450.75,
    lastOrder: "2025-01-18",
    status: "vip",
    joinDate: "2024-03-10",
    rating: 5.0,
    address: "321 Elm St, Liverpool, UK",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    phone: "+44 20 5678 9012",
    totalOrders: 3,
    totalSpent: 450.0,
    lastOrder: "2024-12-20",
    status: "inactive",
    joinDate: "2024-11-05",
    rating: 4.2,
    address: "654 Maple Dr, Leeds, UK",
  },
];

const stats = [
  {
    title: "Clients Total",
    value: "8,452",
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Clients Actifs",
    value: "6,234",
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Clients VIP",
    value: "234",
    change: "+5",
    trend: "up",
  },
  {
    title: "Valeur Client Moyenne",
    value: "£245.50",
    change: "+3.2%",
    trend: "up",
  },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { className: string; label: string }> = {
    active: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "Actif",
    },
    inactive: {
      className:
        "border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900/70 dark:text-white/80",
      label: "Inactif",
    },
    vip: {
      className:
        "border-purple-400 bg-purple-50 text-purple-800 dark:bg-purple-900/70 dark:text-white/80",
      label: "VIP",
    },
  };

  const statusConfig = statusMap[status] || statusMap.active;
  return (
    <Badge className={`capitalize ${statusConfig.className}`}>
      {statusConfig.label}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ClientsPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(customers.map((c) => c.id));
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

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
            <Mail className="size-5 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight orbitron">
            Clients
          </h1>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Ajouter un client
        </Button>
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
                placeholder="Rechercher par nom, email, téléphone..."
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
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
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
                        selectedRows.length === customers.length &&
                        customers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Client
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Contact
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Commandes
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Total dépensé
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Note</TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Statut
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Dernière commande
                  </TableHead>
                  <TableHead className="text-muted-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Aucun client trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(customer.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(customer.id, checked === true)
                          }
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`/avatars/${customer.id}.jpg`} />
                            <AvatarFallback>
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Membre depuis {formatDate(customer.joinDate)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-3 text-muted-foreground" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="size-4 text-muted-foreground" />
                          <span className="font-medium">
                            {customer.totalOrders}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          £{customer.totalSpent.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{customer.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(customer.lastOrder)}
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
                                href={`/clients/${customer.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 size-4" />
                                Voir le profil
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/clients/${customer.id}/orders`}
                                className="flex items-center"
                              >
                                <ShoppingBag className="mr-2 size-4" />
                                Voir les commandes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 size-4" />
                              Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 size-4" />
                              Modifier
                            </DropdownMenuItem>
                            {customer.status !== "vip" && (
                              <DropdownMenuItem>
                                <Star className="mr-2 size-4" />
                                Passer en VIP
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="mr-2 size-4" />
                              Supprimer
                            </DropdownMenuItem>
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
              {selectedRows.length} sur {customers.length} ligne(s)
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
