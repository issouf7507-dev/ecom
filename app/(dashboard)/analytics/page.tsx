"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChartBar,
  IconCurrencyDollar,
  IconEye,
  IconClick,
  IconDownload,
  IconRefresh,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Données pour les graphiques
const salesData = [
  { month: "Jan", sales: 45000, orders: 320, revenue: 52000 },
  { month: "Fév", sales: 52000, orders: 380, revenue: 61000 },
  { month: "Mar", sales: 48000, orders: 350, revenue: 56000 },
  { month: "Avr", sales: 61000, orders: 420, revenue: 72000 },
  { month: "Mai", sales: 55000, orders: 390, revenue: 65000 },
  { month: "Juin", sales: 67000, orders: 450, revenue: 78000 },
];

const revenueData = [
  { month: "Jan", revenue: 52000, cost: 35000, profit: 17000 },
  { month: "Fév", revenue: 61000, cost: 41000, profit: 20000 },
  { month: "Mar", revenue: 56000, cost: 38000, profit: 18000 },
  { month: "Avr", revenue: 72000, cost: 48000, profit: 24000 },
  { month: "Mai", revenue: 65000, cost: 43000, profit: 22000 },
  { month: "Juin", revenue: 78000, cost: 52000, profit: 26000 },
];

const topProducts = [
  { name: "Nike Air Max", sales: 1250, revenue: 162500 },
  { name: "Adidas Ultraboost", sales: 980, revenue: 195020 },
  { name: "iPhone 16 Pro", sales: 450, revenue: 584550 },
  { name: "Samsung Galaxy", sales: 320, revenue: 383680 },
  { name: "realme Buds", sales: 890, revenue: 124510 },
];

const categoryData = [
  { name: "Chaussures", value: 35, color: "#3B82F6" },
  { name: "Électronique", value: 28, color: "#10B981" },
  { name: "Vêtements", value: 20, color: "#F59E0B" },
  { name: "Accessoires", value: 12, color: "#EF4444" },
  { name: "Autres", value: 5, color: "#8B5CF6" },
];

const campaignPerformance = [
  { name: "Email", sent: 12500, opened: 8560, clicked: 2340, conversions: 450 },
  { name: "SMS", sent: 8500, opened: 0, clicked: 0, conversions: 670 },
  { name: "WhatsApp", sent: 3200, opened: 0, clicked: 0, conversions: 280 },
];

const customerGrowth = [
  { month: "Jan", new: 450, returning: 1200 },
  { month: "Fév", new: 520, returning: 1350 },
  { month: "Mar", new: 480, returning: 1280 },
  { month: "Avr", new: 610, returning: 1520 },
  { month: "Mai", new: 550, returning: 1400 },
  { month: "Juin", new: 670, returning: 1650 },
];

const stats = [
  {
    title: "Revenus Total",
    value: "£384,000",
    change: "+18.5%",
    trend: "up",
    icon: IconCurrencyDollar,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Commandes",
    value: "2,310",
    change: "+12.3%",
    trend: "up",
    icon: IconShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clients Actifs",
    value: "8,452",
    change: "+8.2%",
    trend: "up",
    icon: IconUsers,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Panier Moyen",
    value: "£166.23",
    change: "+5.1%",
    trend: "up",
    icon: IconTrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const salesChartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Commandes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: "Revenus",
    color: "hsl(var(--chart-1))",
  },
  cost: {
    label: "Coûts",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("6months");

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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold orbitron">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Analysez les performances de votre boutique
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="default">
            <IconRefresh className="size-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="default">
            <IconDownload className="size-4 mr-2" />
            Exporter
          </Button>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="3months">3 derniers mois</SelectItem>
              <SelectItem value="6months">6 derniers mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
                      {stat.value}
                    </CardTitle>
                  </div>
                  <div
                    className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}
                  >
                    <stat.icon className="size-6" />
                  </div>
                </div>
                <CardAction>
                  <div className="flex items-center gap-1 text-sm mt-2">
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
                    <span className="text-gray-500">vs période précédente</span>
                  </div>
                </CardAction>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales & Orders Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ventes & Commandes</CardTitle>
                  <CardDescription>Évolution sur 6 mois</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesChartConfig}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-sales)"
                    fill="var(--color-sales)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-orders)"
                    fill="var(--color-orders)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Revenus, Coûts & Profit</CardTitle>
                <CardDescription>Analyse financière</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Bar dataKey="cost" fill="var(--color-cost)" />
                  <Bar dataKey="profit" fill="var(--color-profit)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Produits</CardTitle>
              <CardDescription>Meilleurs produits par ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        £{product.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${
                            (product.sales / topProducts[0].sales) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{product.sales} ventes</span>
                      <span>£{product.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Catégorie</CardTitle>
              <CardDescription>Distribution des ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  category: {
                    label: "Catégorie",
                  },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryData.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                    <span className="ml-auto font-medium">
                      {category.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Customer Growth */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Croissance des Clients</CardTitle>
              <CardDescription>Nouveaux vs Clients récurrents</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  new: {
                    label: "Nouveaux",
                    color: "hsl(var(--chart-1))",
                  },
                  returning: {
                    label: "Récurrents",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="var(--color-new)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="returning"
                    stroke="var(--color-returning)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Performance */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Performance des Campagnes</CardTitle>
              <CardDescription>Statistiques par canal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign) => {
                  const isEmail = campaign.name === "Email";
                  const openRate = isEmail
                    ? ((campaign.opened / campaign.sent) * 100).toFixed(1)
                    : null;
                  const clickRate = isEmail
                    ? ((campaign.clicked / campaign.sent) * 100).toFixed(1)
                    : null;
                  const conversionRate = (
                    (campaign.conversions / campaign.sent) *
                    100
                  ).toFixed(1);

                  return (
                    <div key={campaign.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{campaign.name}</span>
                        <Badge variant="outline">
                          {conversionRate}% conversion
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Envoyés</p>
                          <p className="font-semibold">
                            {campaign.sent.toLocaleString()}
                          </p>
                        </div>
                        {openRate && (
                          <div>
                            <p className="text-muted-foreground">Ouverts</p>
                            <p className="font-semibold">{openRate}%</p>
                          </div>
                        )}
                        {clickRate && (
                          <div>
                            <p className="text-muted-foreground">Clics</p>
                            <p className="font-semibold">{clickRate}%</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Conversions</p>
                          <p className="font-semibold text-green-600">
                            {campaign.conversions}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Détails des Produits</CardTitle>
            <CardDescription>Performance détaillée par produit</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rang</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Ventes</TableHead>
                  <TableHead>Revenus</TableHead>
                  <TableHead>Taux de conversion</TableHead>
                  <TableHead>Note moyenne</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sales.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">
                      £{product.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600">12.5%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">4.8</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights & Recommendations */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommandations</CardTitle>
            <CardDescription>
              Analyses automatiques et suggestions d'amélioration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <IconTrendingUp className="size-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      Performance Excellente
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Vos ventes ont augmenté de 18.5% ce mois-ci. Les produits
                      "Nike Air Max" et "Adidas Ultraboost" sont vos meilleurs
                      vendeurs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <IconChartBar className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      Opportunité d'Amélioration
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Les campagnes Email ont un taux d'ouverture de 68.5%.
                      Essayez d'optimiser vos sujets pour atteindre 75%+.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-orange-100 p-2">
                    <IconUsers className="size-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      Croissance des Clients
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Vous avez gagné 670 nouveaux clients ce mois. Créez une
                      campagne de bienvenue pour améliorer leur rétention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-2">
                    <IconShoppingCart className="size-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Panier Moyen</h4>
                    <p className="text-sm text-muted-foreground">
                      Votre panier moyen est de £166.23. Proposez des produits
                      complémentaires pour l'augmenter à £180+.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
