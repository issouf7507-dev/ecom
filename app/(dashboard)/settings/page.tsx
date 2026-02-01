"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  Globe,
  FileText,
  Mail,
  Shield,
  Image as ImageIcon,
  Palette,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // État pour les formulaires
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Kik Game Store",
    storeEmail: "contact@kikgamestore.com",
    storePhone: "+44 20 1234 5678",
    address: "123 Main Street",
    city: "London",
    postalCode: "SW1A 1AA",
    country: "UK",
    currency: "GBP",
    timezone: "Europe/London",
    language: "fr",
    taxRate: "20",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paypalEnabled: true,
    paypalClientId: "",
    paypalSecret: "",
    bankTransferEnabled: true,
    bankName: "",
    bankAccount: "",
    cashOnDelivery: true,
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "50",
    standardShippingCost: "5.99",
    expressShippingCost: "15.99",
    internationalShippingCost: "25.99",
    defaultWeight: "0.5",
    defaultDimensions: {
      length: "10",
      width: "10",
      height: "10",
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newOrderEmail: true,
    lowStockEmail: true,
    customerRegistrationEmail: true,
    orderStatusEmail: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Kik Game Store - Jeux et Accessoires",
    metaDescription: "Boutique en ligne de jeux vidéo et accessoires gaming",
    metaKeywords: "jeux, gaming, console, accessoires",
    facebookPixel: "",
    googleAnalytics: "",
  });

  const [storeSettings, setStoreSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    allowGuestCheckout: true,
    inventoryTracking: true,
    lowStockThreshold: "10",
    allowReviews: true,
    allowRatings: true,
    requireReviewApproval: true,
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log(`Saving ${section}...`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
            <Settings className="size-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight orbitron">
              Paramètres
            </h1>
            <p className="text-muted-foreground">
              Gérez les paramètres de votre boutique
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general">
            <Store className="size-4 mr-2" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="size-4 mr-2" />
            <span className="hidden sm:inline">Paiement</span>
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="size-4 mr-2" />
            <span className="hidden sm:inline">Livraison</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Globe className="size-4 mr-2" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="store">
            <FileText className="size-4 mr-2" />
            <span className="hidden sm:inline">Boutique</span>
          </TabsTrigger>
        </TabsList>

        {/* Général */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la boutique</CardTitle>
              <CardDescription>
                Configurez les informations de base de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nom de la boutique *</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeName: e.target.value,
                      })
                    }
                    placeholder="Kik Game Store"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email de contact *</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeEmail: e.target.value,
                      })
                    }
                    placeholder="contact@store.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Téléphone</Label>
                  <Input
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storePhone: e.target.value,
                      })
                    }
                    placeholder="+44 20 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        address: e.target.value,
                      })
                    }
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={generalSettings.city}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        city: e.target.value,
                      })
                    }
                    placeholder="London"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={generalSettings.postalCode}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        postalCode: e.target.value,
                      })
                    }
                    placeholder="SW1A 1AA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={generalSettings.country}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        country: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">Royaume-Uni</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="US">États-Unis</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        currency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="CAD">$ CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        timezone: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                      <SelectItem value="Europe/Paris">
                        Europe/Paris (CET)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        language: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={generalSettings.taxRate}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        taxRate: e.target.value,
                      })
                    }
                    placeholder="20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Taux de taxe applicable par défaut
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("general")}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo et Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo de la boutique</Label>
                <div className="flex items-center gap-4">
                  <div className="flex size-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="size-4 mr-2" />
                      Télécharger un logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG jusqu'à 2MB. Taille recommandée: 200x50px
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="size-4 mr-2" />
                      Télécharger un favicon
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      ICO, PNG jusqu'à 1MB. Taille recommandée: 32x32px
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("appearance")}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paiement */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
              <CardDescription>
                Configurez les méthodes de paiement acceptées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Stripe</Label>
                    <p className="text-sm text-muted-foreground">
                      Paiement par carte bancaire via Stripe
                    </p>
                  </div>
                  <Switch
                    checked={paymentSettings.stripeEnabled}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        stripeEnabled: checked,
                      })
                    }
                  />
                </div>
                {paymentSettings.stripeEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pl-6 border-l-2">
                    <div className="space-y-2">
                      <Label htmlFor="stripePublicKey">Clé publique</Label>
                      <Input
                        id="stripePublicKey"
                        type="password"
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            stripePublicKey: e.target.value,
                          })
                        }
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripeSecretKey">Clé secrète</Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            stripeSecretKey: e.target.value,
                          })
                        }
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* PayPal */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>PayPal</Label>
                    <p className="text-sm text-muted-foreground">
                      Paiement via PayPal
                    </p>
                  </div>
                  <Switch
                    checked={paymentSettings.paypalEnabled}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paypalEnabled: checked,
                      })
                    }
                  />
                </div>
                {paymentSettings.paypalEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pl-6 border-l-2">
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">Client ID</Label>
                      <Input
                        id="paypalClientId"
                        value={paymentSettings.paypalClientId}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paypalClientId: e.target.value,
                          })
                        }
                        placeholder="PayPal Client ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypalSecret">Secret</Label>
                      <Input
                        id="paypalSecret"
                        type="password"
                        value={paymentSettings.paypalSecret}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paypalSecret: e.target.value,
                          })
                        }
                        placeholder="PayPal Secret"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Virement bancaire */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Virement bancaire</Label>
                    <p className="text-sm text-muted-foreground">
                      Paiement par virement bancaire
                    </p>
                  </div>
                  <Switch
                    checked={paymentSettings.bankTransferEnabled}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bankTransferEnabled: checked,
                      })
                    }
                  />
                </div>
                {paymentSettings.bankTransferEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pl-6 border-l-2">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Nom de la banque</Label>
                      <Input
                        id="bankName"
                        value={paymentSettings.bankName}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankName: e.target.value,
                          })
                        }
                        placeholder="Nom de la banque"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Numéro de compte</Label>
                      <Input
                        id="bankAccount"
                        value={paymentSettings.bankAccount}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankAccount: e.target.value,
                          })
                        }
                        placeholder="IBAN"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Paiement à la livraison */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Paiement à la livraison</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre le paiement en espèces à la livraison
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.cashOnDelivery}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      cashOnDelivery: checked,
                    })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("payment")}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Livraison */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Options de livraison</CardTitle>
              <CardDescription>
                Configurez les tarifs et options de livraison
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">
                    Seuil de livraison gratuite (£)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        freeShippingThreshold: e.target.value,
                      })
                    }
                    placeholder="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Montant minimum pour la livraison gratuite
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">
                    Coût livraison standard (£)
                  </Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    step="0.01"
                    value={shippingSettings.standardShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        standardShippingCost: e.target.value,
                      })
                    }
                    placeholder="5.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">
                    Coût livraison express (£)
                  </Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    step="0.01"
                    value={shippingSettings.expressShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        expressShippingCost: e.target.value,
                      })
                    }
                    placeholder="15.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internationalShippingCost">
                    Coût livraison internationale (£)
                  </Label>
                  <Input
                    id="internationalShippingCost"
                    type="number"
                    step="0.01"
                    value={shippingSettings.internationalShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        internationalShippingCost: e.target.value,
                      })
                    }
                    placeholder="25.99"
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultWeight">Poids par défaut (kg)</Label>
                  <Input
                    id="defaultWeight"
                    type="number"
                    step="0.01"
                    value={shippingSettings.defaultWeight}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        defaultWeight: e.target.value,
                      })
                    }
                    placeholder="0.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dimensions par défaut (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="L"
                      value={shippingSettings.defaultDimensions.length}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          defaultDimensions: {
                            ...shippingSettings.defaultDimensions,
                            length: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="l"
                      value={shippingSettings.defaultDimensions.width}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          defaultDimensions: {
                            ...shippingSettings.defaultDimensions,
                            width: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="H"
                      value={shippingSettings.defaultDimensions.height}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          defaultDimensions: {
                            ...shippingSettings.defaultDimensions,
                            height: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("shipping")}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications par email</CardTitle>
              <CardDescription>
                Configurez les notifications envoyées par email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Activer les notifications email</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer/désactiver toutes les notifications email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-4 pl-6 border-l-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Nouvelle commande</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email pour chaque nouvelle commande
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newOrderEmail}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newOrderEmail: checked,
                      })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Stock faible</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email lorsque le stock est faible
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockEmail}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        lowStockEmail: checked,
                      })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Nouvelle inscription</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email lorsqu'un nouveau client s'inscrit
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.customerRegistrationEmail}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        customerRegistrationEmail: checked,
                      })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Changement de statut de commande</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifier les clients des changements de statut
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderStatusEmail}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        orderStatusEmail: checked,
                      })
                    }
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les notifications par SMS
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les notifications push navigateur
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("notifications")}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres SEO</CardTitle>
              <CardDescription>
                Optimisez le référencement de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Titre meta (Meta Title)</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      metaTitle: e.target.value,
                    })
                  }
                  placeholder="Titre de votre boutique"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.metaTitle.length}/60 caractères
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">
                  Description meta (Meta Description)
                </Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      metaDescription: e.target.value,
                    })
                  }
                  placeholder="Description de votre boutique"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.metaDescription.length}/160 caractères
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Mots-clés meta</Label>
                <Input
                  id="metaKeywords"
                  value={seoSettings.metaKeywords}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      metaKeywords: e.target.value,
                    })
                  }
                  placeholder="jeux, gaming, console, accessoires"
                />
                <p className="text-xs text-muted-foreground">
                  Séparés par des virgules
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixel"
                  value={seoSettings.facebookPixel}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      facebookPixel: e.target.value,
                    })
                  }
                  placeholder="123456789012345"
                />
                <p className="text-xs text-muted-foreground">
                  ID de votre pixel Facebook pour le tracking
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={seoSettings.googleAnalytics}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      googleAnalytics: e.target.value,
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  ID de mesure Google Analytics (format: G-XXXXXXXXXX)
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("seo")} disabled={isSaving}>
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Boutique */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la boutique</CardTitle>
              <CardDescription>
                Configurez le comportement de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mode maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Mettre la boutique en maintenance (seuls les admins
                      peuvent accéder)
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        maintenanceMode: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autoriser l'inscription</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux visiteurs de créer un compte
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.allowRegistration}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        allowRegistration: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Vérification email requise</Label>
                    <p className="text-sm text-muted-foreground">
                      Les clients doivent vérifier leur email pour se connecter
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        requireEmailVerification: checked,
                      })
                    }
                    disabled={!storeSettings.allowRegistration}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autoriser le checkout invité</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux clients de commander sans compte
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.allowGuestCheckout}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        allowGuestCheckout: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Suivi des stocks</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer le suivi des stocks pour les produits
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.inventoryTracking}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        inventoryTracking: checked,
                      })
                    }
                  />
                </div>
                {storeSettings.inventoryTracking && (
                  <div className="pl-6 border-l-2 space-y-2">
                    <Label htmlFor="lowStockThreshold">
                      Seuil d'alerte stock faible
                    </Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={storeSettings.lowStockThreshold}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          lowStockThreshold: e.target.value,
                        })
                      }
                      placeholder="10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nombre d'unités en dessous duquel une alerte est
                      déclenchée
                    </p>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autoriser les avis</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux clients de laisser des avis produits
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.allowReviews}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        allowReviews: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autoriser les notes</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux clients de noter les produits
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.allowRatings}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        allowRatings: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Approbation des avis requise</Label>
                    <p className="text-sm text-muted-foreground">
                      Les avis doivent être approuvés avant publication
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.requireReviewApproval}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        requireReviewApproval: checked,
                      })
                    }
                    disabled={
                      !storeSettings.allowReviews && !storeSettings.allowRatings
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("store")} disabled={isSaving}>
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
