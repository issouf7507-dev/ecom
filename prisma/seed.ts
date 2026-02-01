import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

async function main() {
  console.log("🌱 Starting seed...");

  // Vérifier que les tables existent
  try {
    // Tester la connexion et vérifier si la table users existe
    await prisma.user.findFirst({ take: 1 });
    console.log("✅ Database connection successful");
  } catch (error: any) {
    if (error.code === "P2021" || error.message?.includes("does not exist")) {
      console.error("❌ The database tables do not exist yet!");
      console.error("\n📋 Please run these commands first:");
      console.error("   1. pnpm db:generate  (Generate Prisma client)");
      console.error("   2. pnpm db:push      (Create tables in database)");
      console.error("\n   Or if using migrations:");
      console.error("   2. pnpm db:migrate   (Create migration and apply)");
      console.error("\n⚠️  Make sure:");
      console.error("   - Your database exists");
      console.error("   - Your .env file has correct DATABASE_* variables");
      console.error("   - DATABASE_NAME matches your database name");
    } else {
      console.error("❌ Database connection failed:", error.message);
      console.error("\n⚠️  Please check your database configuration in .env");
    }
    process.exit(1);
  }

  // Obtenir le contexte Better Auth pour utiliser les méthodes internes
  const ctx = await auth.$context;

  // Créer un utilisateur admin
  const adminEmail = "admin@example2.com";
  const adminPassword = "admin1232";

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists:", adminEmail);
  } else {
    // Utiliser Better Auth pour hasher le mot de passe (scrypt)
    // C'est la méthode officielle de Better Auth pour hasher les mots de passe
    const hashedPassword = await ctx.password.hash(adminPassword);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
    console.log("   📧 Email:", adminEmail);
    console.log("   🔑 Password:", adminPassword);
  }

  // Créer un utilisateur client de test
  const customerEmail = "customer@example.com";
  const customerPassword = "customer123";

  const existingCustomer = await prisma.user.findUnique({
    where: { email: customerEmail },
  });

  if (existingCustomer) {
    console.log("✅ Customer user already exists:", customerEmail);
  } else {
    // Utiliser Better Auth pour hasher le mot de passe (scrypt)
    // C'est la méthode officielle de Better Auth pour hasher les mots de passe
    const hashedPassword = await ctx.password.hash(customerPassword);

    const customer = await prisma.user.create({
      data: {
        email: customerEmail,
        name: "John Doe",
        password: hashedPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
        phone: "+44 20 1234 5678",
      },
    });

    console.log("✅ Customer user created:", {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: customer.role,
    });
    console.log("   📧 Email:", customerEmail);
    console.log("   🔑 Password:", customerPassword);
  }

  console.log("\n✨ Seed completed!");
  console.log("\n📝 Credentials:");
  console.log("   Admin:   ", adminEmail, "/", adminPassword);
  console.log("   Customer:", customerEmail, "/", customerPassword);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
