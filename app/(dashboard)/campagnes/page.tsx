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
  MessageSquare,
  Phone,
  Send,
  Play,
  Pause,
  BarChart3,
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

// Mock data pour les campagnes
const campaigns = [
  {
    id: 1,
    name: "Promotion Nouveautés Hiver",
    type: "email",
    status: "active",
    products: ["Nike Air Max", "Adidas Ultraboost"],
    recipients: 1250,
    sent: 1250,
    opened: 856,
    clicked: 234,
    conversions: 45,
    scheduledDate: "2025-01-20T10:00:00",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Flash Sale - 50% OFF",
    type: "sms",
    status: "active",
    products: ["iPhone 15", "Samsung Galaxy"],
    recipients: 850,
    sent: 850,
    opened: 0,
    clicked: 0,
    conversions: 67,
    scheduledDate: "2025-01-18T14:00:00",
    createdAt: "2025-01-17",
  },
  {
    id: 3,
    name: "Nouvelle Collection Printemps",
    type: "whatsapp",
    status: "draft",
    products: ["Collection Printemps 2025"],
    recipients: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    conversions: 0,
    scheduledDate: "2025-02-01T09:00:00",
    createdAt: "2025-01-19",
  },
  {
    id: 4,
    name: "Offre Spéciale Week-end",
    type: "email",
    status: "completed",
    products: ["Tous les produits"],
    recipients: 2100,
    sent: 2100,
    opened: 1456,
    clicked: 389,
    conversions: 123,
    scheduledDate: "2025-01-10T08:00:00",
    createdAt: "2025-01-08",
  },
  {
    id: 5,
    name: "Rappel Panier Abandonné",
    type: "whatsapp",
    status: "active",
    products: ["Produits du panier"],
    recipients: 320,
    sent: 320,
    opened: 0,
    clicked: 0,
    conversions: 28,
    scheduledDate: "2025-01-19T16:00:00",
    createdAt: "2025-01-19",
  },
];

const stats = [
  {
    title: "Campagnes Actives",
    value: "3",
    change: "+1",
    trend: "up",
  },
  {
    title: "Taux d'ouverture",
    value: "68.5%",
    change: "+5.2%",
    trend: "up",
  },
  {
    title: "Taux de clic",
    value: "18.3%",
    change: "+2.1%",
    trend: "up",
  },
  {
    title: "Conversions",
    value: "263",
    change: "+45",
    trend: "up",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "email":
      return Mail;
    case "sms":
      return MessageSquare;
    case "whatsapp":
      return Phone;
    default:
      return Send;
  }
};

const getTypeBadge = (type: string) => {
  const typeMap: Record<string, { className: string; label: string }> = {
    email: {
      className:
        "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
      label: "Email",
    },
    sms: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "SMS",
    },
    whatsapp: {
      className:
        "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/70 dark:text-white/80",
      label: "WhatsApp",
    },
  };

  const typeConfig = typeMap[type] || typeMap.email;
  return (
    <Badge className={`capitalize ${typeConfig.className}`}>
      {typeConfig.label}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { className: string; label: string }> = {
    active: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "Active",
    },
    draft: {
      className:
        "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
      label: "Brouillon",
    },
    completed: {
      className:
        "border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900/70 dark:text-white/80",
      label: "Terminée",
    },
    paused: {
      className:
        "border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/70 dark:text-white/80",
      label: "En pause",
    },
  };

  const statusConfig = statusMap[status] || statusMap.draft;
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
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CampaignsPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(campaigns.map((c) => c.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const calculateOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return ((opened / sent) * 100).toFixed(1);
  };

  const calculateClickRate = (clicked: number, sent: number) => {
    if (sent === 0) return 0;
    return ((clicked / sent) * 100).toFixed(1);
  };

  const calculateConversionRate = (conversions: number, sent: number) => {
    if (sent === 0) return 0;
    return ((conversions / sent) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <Send className="size-6 text-purple-500" />
          <h1 className="text-2xl font-bold tracking-tight orbitron">
            Campagnes Marketing
          </h1>
        </div>
        <Button asChild>
          <Link href="/campagnes/create">
            <Plus className="size-4" />
            Créer une campagne
          </Link>
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
                placeholder="Rechercher des campagnes..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="paused">En pause</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
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
                        selectedRows.length === campaigns.length &&
                        campaigns.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Nom de la campagne
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Type
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Produits
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Destinataires
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Taux d'ouverture
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Taux de clic
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Conversions
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Statut
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Aucune campagne trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCampaigns.map((campaign) => {
                    const TypeIcon = getTypeIcon(campaign.type);
                    const openRate = calculateOpenRate(
                      campaign.opened,
                      campaign.sent
                    );
                    const clickRate = calculateClickRate(
                      campaign.clicked,
                      campaign.sent
                    );
                    const conversionRate = calculateConversionRate(
                      campaign.conversions,
                      campaign.sent
                    );

                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(campaign.id)}
                            onCheckedChange={(checked) =>
                              handleSelectRow(campaign.id, checked === true)
                            }
                            aria-label="Select row"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
                              <TypeIcon className="size-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(campaign.createdAt)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm truncate">
                              {campaign.products.join(", ")}
                            </p>
                            {campaign.products.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                +{campaign.products.length - 1} autres
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {campaign.recipients.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {campaign.type === "email" ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{openRate}%</span>
                              <span className="text-xs text-muted-foreground">
                                {campaign.opened}/{campaign.sent}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {campaign.type === "email" ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{clickRate}%</span>
                              <span className="text-xs text-muted-foreground">
                                {campaign.clicked} clics
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-green-600">
                              {campaign.conversions}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conversionRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
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
                                  href={`/campagnes/${campaign.id}`}
                                  className="flex items-center"
                                >
                                  <BarChart3 className="mr-2 size-4" />
                                  Statistiques
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/campagnes/${campaign.id}/edit`}
                                  className="flex items-center"
                                >
                                  <Edit className="mr-2 size-4" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 size-4" />
                                Dupliquer
                              </DropdownMenuItem>
                              {campaign.status === "active" && (
                                <DropdownMenuItem>
                                  <Pause className="mr-2 size-4" />
                                  Mettre en pause
                                </DropdownMenuItem>
                              )}
                              {campaign.status === "paused" && (
                                <DropdownMenuItem>
                                  <Play className="mr-2 size-4" />
                                  Reprendre
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedRows.length} sur {campaigns.length} ligne(s)
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
