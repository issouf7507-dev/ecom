// import "dotenv/config";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "../generated/prisma/client";

// // Support both DATABASE_URL and separate variables
// const getDatabaseConfig = () => {
//   if (process.env.DATABASE_URL) {
//     // Parse DATABASE_URL: mysql://user:password@host:port/database
//     const url = new URL(process.env.DATABASE_URL);
//     return {
//       host: url.hostname,
//       port: parseInt(url.port || "3306"),
//       user: url.username,
//       password: url.password,
//       database: url.pathname.slice(1), // Remove leading /
//     };
//   }

//   // Fallback to separate variables
//   return {
//     host: process.env.DATABASE_HOST || "localhost",
//     port: parseInt(process.env.DATABASE_PORT || "3306"),
//     user: process.env.DATABASE_USER || "root",
//     password: process.env.DATABASE_PASSWORD || "",
//     database: process.env.DATABASE_NAME || "ecomm",
//   };
// };

// const dbConfig = getDatabaseConfig();

// const adapter = new PrismaMariaDb({
//   host: dbConfig.host,
//   port: dbConfig.port,
//   user: dbConfig.user,
//   password: dbConfig.password,
//   database: dbConfig.database,
//   connectionLimit: 5,
// });

// const prismaClient = new PrismaClient({ adapter });

// // Wrap Prisma client to fix emailVerified type mismatch (Better Auth sends boolean, Prisma expects DateTime?)
// // Better Auth tries to pass emailVerified: false, but Prisma expects DateTime? or null
// const prisma = new Proxy(prismaClient, {
//   get(target, prop) {
//     const original = target[prop as keyof typeof target];

//     if (prop === "user" && typeof original === "object" && original !== null) {
//       return new Proxy(original as any, {
//         get(userTarget, userProp) {
//           const userOriginal = userTarget[userProp as keyof typeof userTarget];

//           if (userProp === "create" && typeof userOriginal === "function") {
//             return async (args: any) => {
//               if (args?.data?.emailVerified === false) {
//                 delete args.data.emailVerified;
//               }
//               return userOriginal.call(userTarget, args);
//             };
//           }

//           if (userProp === "update" && typeof userOriginal === "function") {
//             return async (args: any) => {
//               if (args?.data?.emailVerified === false) {
//                 delete args.data.emailVerified;
//               }
//               return userOriginal.call(userTarget, args);
//             };
//           }

//           return userOriginal;
//         },
//       });
//     }

//     return original;
//   },
// });

// export { prisma };

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

// Support both DATABASE_URL and separate variables.
// Prefer explicit DATABASE_* vars when set (avoids URL parsing issues with special chars in password).
const getDatabaseConfig = () => {
  const hasExplicit =
    process.env.DATABASE_HOST != null || process.env.DATABASE_USER != null;
  if (hasExplicit) {
    return {
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD ?? "",
      database: process.env.DATABASE_NAME || "ecomm",
    };
  }
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port || "3306"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1).replace(/^\/+/, "") || "ecomm",
    };
  }
  return {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USER || "issouf",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME || "willyecom",
  };
};

const dbConfig = getDatabaseConfig();

const adapter = new PrismaMariaDb({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: 10,
});

const prismaClient = new PrismaClient({ adapter });

// Wrap Prisma client to fix emailVerified type mismatch (Better Auth sends boolean, Prisma expects DateTime?)
// Better Auth tries to pass emailVerified: false, but Prisma expects DateTime? or null
const prisma = new Proxy(prismaClient, {
  get(target, prop) {
    const original = target[prop as keyof typeof target];

    if (prop === "user" && typeof original === "object" && original !== null) {
      return new Proxy(original as any, {
        get(userTarget, userProp) {
          const userOriginal = userTarget[userProp as keyof typeof userTarget];

          if (userProp === "create" && typeof userOriginal === "function") {
            return async (args: any) => {
              if (args?.data?.emailVerified === false) {
                delete args.data.emailVerified;
              }
              return userOriginal.call(userTarget, args);
            };
          }

          if (userProp === "update" && typeof userOriginal === "function") {
            return async (args: any) => {
              if (args?.data?.emailVerified === false) {
                delete args.data.emailVerified;
              }
              return userOriginal.call(userTarget, args);
            };
          }

          return userOriginal;
        },
      });
    }

    return original;
  },
});

export { prisma };
