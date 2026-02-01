"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Calendar,
  Users,
  Package,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock products pour la sélection
const availableProducts = [
  {
    id: 1,
    name: "Nike Air Max 2025",
    price: 129.99,
    image: "/images/IB8958-001.avif",
  },
  {
    id: 2,
    name: "Adidas Ultraboost Pro",
    price: 199.99,
    image: "/images/IB8958-001.avif",
  },
  {
    id: 3,
    name: "iPhone 16 Pro Max",
    price: 1299.99,
    image: "/images/IB8958-001.avif",
  },
  {
    id: 4,
    name: "Samsung Galaxy S25",
    price: 1199.99,
    image: "/images/IB8958-001.avif",
  },
  {
    id: 5,
    name: "realme Buds Wireless 5",
    price: 139.99,
    image: "/images/IB8958-001.avif",
  },
];

export default function CreateCampaignPage() {
  const [campaignType, setCampaignType] = useState<
    "email" | "sms" | "whatsapp"
  >("email");
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
    scheduledDate: "",
    scheduledTime: "",
    sendImmediately: true,
    selectedProducts: [] as number[],
    targetAudience: "all",
    includeDiscount: false,
    discountCode: "",
    discountPercentage: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedProducts.includes(productId);
      return {
        ...prev,
        selectedProducts: isSelected
          ? prev.selectedProducts.filter((id) => id !== productId)
          : [...prev.selectedProducts, productId],
      };
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Campaign submitted:", { campaignType, formData });
    // TODO: Implement campaign submission
  };

  const getTypeIcon = () => {
    switch (campaignType) {
      case "email":
        return Mail;
      case "sms":
        return MessageSquare;
      case "whatsapp":
        return Phone;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/campagnes">
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Send className="size-6 text-purple-500" />
              <h1 className="text-2xl font-bold tracking-tight orbitron">
                Créer une campagne
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary">
              Annuler
            </Button>
            <Button type="button" variant="outline">
              Enregistrer comme brouillon
            </Button>
            <Button type="submit" variant="default">
              <Send className="size-4 mr-2" />
              Envoyer la campagne
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* Left Column - Main Content */}
          <div className="space-y-4 lg:col-span-4">
            {/* Campaign Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Type de campagne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={campaignType === "email" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => setCampaignType("email")}
                  >
                    <Mail className="size-4" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={campaignType === "sms" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => setCampaignType("sms")}
                  >
                    <MessageSquare className="size-4" />
                    SMS
                  </Button>
                  <Button
                    type="button"
                    variant={
                      campaignType === "whatsapp" ? "default" : "outline"
                    }
                    className="flex items-center gap-2"
                    onClick={() => setCampaignType("whatsapp")}
                  >
                    <Phone className="size-4" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TypeIcon className="size-5 text-purple-600" />
                  <CardTitle>Détails de la campagne</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom de la campagne</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Promotion Hiver 2025"
                    />
                  </div>
                  {campaignType === "email" && (
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Objet de l'email</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Ex: Découvrez nos nouveautés !"
                      />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="message">
                      Message{" "}
                      {campaignType === "email" ? "(HTML supporté)" : ""}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={
                        campaignType === "email"
                          ? "Rédigez votre message email..."
                          : campaignType === "sms"
                          ? "Message SMS (max 160 caractères)"
                          : "Message WhatsApp..."
                      }
                      rows={campaignType === "email" ? 8 : 4}
                      maxLength={campaignType === "sms" ? 160 : undefined}
                    />
                    {campaignType === "sms" && (
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length}/160 caractères
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="size-5" />
                  <CardTitle>Produits à promouvoir</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={formData.selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductToggle(product.id)}
                      />
                      <Label
                        htmlFor={`product-${product.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-md border bg-muted">
                            {/* Image placeholder */}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              £{product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-full">
                    <Package className="size-4 mr-2" />
                    Sélectionner tous les produits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 lg:col-span-2">
            {/* Scheduling */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  <CardTitle>Planification</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendImmediately"
                      checked={formData.sendImmediately}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          sendImmediately: checked === true,
                        }))
                      }
                    />
                    <Label
                      htmlFor="sendImmediately"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Envoyer immédiatement
                    </Label>
                  </div>
                  {!formData.sendImmediately && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="scheduledDate">Date d'envoi</Label>
                        <Input
                          id="scheduledDate"
                          name="scheduledDate"
                          type="date"
                          value={formData.scheduledDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="scheduledTime">Heure d'envoi</Label>
                        <Input
                          id="scheduledTime"
                          name="scheduledTime"
                          type="time"
                          value={formData.scheduledTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <CardTitle>Audience cible</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) =>
                        handleSelectChange("targetAudience", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les clients</SelectItem>
                        <SelectItem value="new">Nouveaux clients</SelectItem>
                        <SelectItem value="vip">Clients VIP</SelectItem>
                        <SelectItem value="inactive">
                          Clients inactifs
                        </SelectItem>
                        <SelectItem value="custom">
                          Audience personnalisée
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <p className="text-sm font-medium mb-1">
                      Destinataires estimés
                    </p>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Basé sur votre sélection
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discount */}
            <Card>
              <CardHeader>
                <CardTitle>Code de réduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeDiscount"
                      checked={formData.includeDiscount}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeDiscount: checked === true,
                        }))
                      }
                    />
                    <Label
                      htmlFor="includeDiscount"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Inclure un code de réduction
                    </Label>
                  </div>
                  {formData.includeDiscount && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="discountCode">Code</Label>
                        <Input
                          id="discountCode"
                          name="discountCode"
                          value={formData.discountCode}
                          onChange={handleInputChange}
                          placeholder="WINTER2025"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="discountPercentage">Pourcentage</Label>
                        <Input
                          id="discountPercentage"
                          name="discountPercentage"
                          type="number"
                          value={formData.discountPercentage}
                          onChange={handleInputChange}
                          placeholder="20"
                          max={100}
                          min={0}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="size-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      {campaignType === "email"
                        ? "Email"
                        : campaignType === "sms"
                        ? "SMS"
                        : "WhatsApp"}
                    </span>
                  </div>
                  {campaignType === "email" && formData.subject && (
                    <p className="text-sm font-semibold">{formData.subject}</p>
                  )}
                  {formData.message && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.message.substring(0, 100)}
                      {formData.message.length > 100 ? "..." : ""}
                    </p>
                  )}
                  {formData.selectedProducts.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        {formData.selectedProducts.length} produit(s)
                        sélectionné(s)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
