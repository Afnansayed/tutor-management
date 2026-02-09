var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express7 from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String        @id\n  name          String\n  email         String\n  emailVerified Boolean       @default(false)\n  image         String?\n  status        Status        @default(ACTIVE)\n  role          Role          @default(STUDENT)\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  tutorProfile  TutorProfile?\n  bookings      Bookings[]    @relation("studentBookings")\n  reviews       Reviews[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum Status {\n  ACTIVE\n  INACTIVE\n  BANNED\n}\n\nmodel Bookings {\n  id             String        @id @default(uuid())\n  tutor_id       String\n  tutor          TutorProfile  @relation("tutorBookings", fields: [tutor_id], references: [user_id])\n  student_id     String\n  student        User          @relation("studentBookings", fields: [student_id], references: [id])\n  schedule_id    String\n  tutor_schedule TutorSchedule @relation(fields: [schedule_id], references: [id])\n  booking_date   DateTime\n  status         BookingStatus @default(CONFIRMED)\n  total_price    Float         @default(0.0)\n  session_link   String?\n  trakking_code  String        @default(uuid())\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n  review         Reviews?\n}\n\nenum BookingStatus {\n  CONFIRMED\n  CANCELLED\n  COMPLETED\n}\n\nmodel Categories {\n  id             String          @id @default(uuid())\n  name           String          @unique\n  sub_code       String          @unique\n  thumbnail      String?\n  tutor_profiles TutorCategory[]\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n}\n\nmodel TutorCategory {\n  tutor_id    String\n  category_id String\n  tutor       TutorProfile @relation(fields: [tutor_id], references: [id])\n  category    Categories   @relation(fields: [category_id], references: [id])\n\n  @@id([tutor_id, category_id])\n  @@index([category_id])\n  @@index([tutor_id])\n}\n\nmodel Reviews {\n  id         String       @id @default(uuid())\n  booking_id String       @unique\n  booking    Bookings     @relation(fields: [booking_id], references: [id])\n  tutor_id   String\n  tutor      TutorProfile @relation(fields: [tutor_id], references: [user_id])\n  student_id String\n  student    User         @relation(fields: [student_id], references: [id])\n  rating     Float        @default(0.0)\n  comment    String       @db.Text\n  isApproved Boolean      @default(true)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id              String          @id @default(uuid())\n  user_id         String          @unique\n  user            User            @relation(fields: [user_id], references: [id])\n  bio             String          @db.Text\n  profile_picture String?\n  hourly_rate     Float           @default(0.0)\n  categories      TutorCategory[]\n  total_reviews   Int             @default(0)\n  average_rating  Float           @default(0.0)\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n  tutor_schedules TutorSchedule[]\n  bookings        Bookings[]      @relation("tutorBookings")\n  reviews         Reviews[]\n\n  @@index([user_id])\n  @@index([average_rating])\n}\n\nmodel TutorSchedule {\n  id          String       @id @default(uuid())\n  tutor_id    String\n  tutor       TutorProfile @relation(fields: [tutor_id], references: [user_id])\n  day_of_week DaysOfWeek\n  start_time  String\n  end_time    String\n  isAvailable Boolean      @default(true)\n  isActive    Boolean      @default(true)\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  bookings    Bookings[]\n}\n\nenum DaysOfWeek {\n  SUNDAY\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"Status"},{"name":"role","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"studentBookings"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Bookings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"tutorBookings"},{"name":"student_id","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"studentBookings"},{"name":"schedule_id","kind":"scalar","type":"String"},{"name":"tutor_schedule","kind":"object","type":"TutorSchedule","relationName":"BookingsToTutorSchedule"},{"name":"booking_date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"total_price","kind":"scalar","type":"Float"},{"name":"session_link","kind":"scalar","type":"String"},{"name":"trakking_code","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"review","kind":"object","type":"Reviews","relationName":"BookingsToReviews"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"sub_code","kind":"scalar","type":"String"},{"name":"thumbnail","kind":"scalar","type":"String"},{"name":"tutor_profiles","kind":"object","type":"TutorCategory","relationName":"CategoriesToTutorCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"category_id","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToTutorCategory"}],"dbName":null},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"booking_id","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Bookings","relationName":"BookingsToReviews"},{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewsToTutorProfile"},{"name":"student_id","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewsToUser"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"profile_picture","kind":"scalar","type":"String"},{"name":"hourly_rate","kind":"scalar","type":"Float"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"total_reviews","kind":"scalar","type":"Int"},{"name":"average_rating","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutor_schedules","kind":"object","type":"TutorSchedule","relationName":"TutorProfileToTutorSchedule"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"tutorBookings"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToTutorProfile"}],"dbName":null},"TutorSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorProfileToTutorSchedule"},{"name":"day_of_week","kind":"enum","type":"DaysOfWeek"},{"name":"start_time","kind":"scalar","type":"String"},{"name":"end_time","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToTutorSchedule"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookingsScalarFieldEnum: () => BookingsScalarFieldEnum,
  CategoriesScalarFieldEnum: () => CategoriesScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  TutorScheduleScalarFieldEnum: () => TutorScheduleScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Bookings: "Bookings",
  Categories: "Categories",
  TutorCategory: "TutorCategory",
  Reviews: "Reviews",
  TutorProfile: "TutorProfile",
  TutorSchedule: "TutorSchedule"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  status: "status",
  role: "role",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingsScalarFieldEnum = {
  id: "id",
  tutor_id: "tutor_id",
  student_id: "student_id",
  schedule_id: "schedule_id",
  booking_date: "booking_date",
  status: "status",
  total_price: "total_price",
  session_link: "session_link",
  trakking_code: "trakking_code",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoriesScalarFieldEnum = {
  id: "id",
  name: "name",
  sub_code: "sub_code",
  thumbnail: "thumbnail",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorCategoryScalarFieldEnum = {
  tutor_id: "tutor_id",
  category_id: "category_id"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  booking_id: "booking_id",
  tutor_id: "tutor_id",
  student_id: "student_id",
  rating: "rating",
  comment: "comment",
  isApproved: "isApproved",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  user_id: "user_id",
  bio: "bio",
  profile_picture: "profile_picture",
  hourly_rate: "hourly_rate",
  total_reviews: "total_reviews",
  average_rating: "average_rating",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorScheduleScalarFieldEnum = {
  id: "id",
  tutor_id: "tutor_id",
  day_of_week: "day_of_week",
  start_time: "start_time",
  end_time: "end_time",
  isAvailable: "isAvailable",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      try {
        const info = await transporter.sendMail({
          from: '"Afnan Sayed Razin" <afnansyed1973@gamil.com>',
          to: `${user.email}`,
          subject: "Please verify your email .",
          text: "Hello world?",
          // Plain-text version of the message
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .verify-button {
      background: #4f46e5;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888888;
      background: #fafafa;
    }
    .link {
      word-break: break-all;
      color: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>

    <div class="content">
      <p>Hello ${user.name},</p>

      <p>
        Thank you for signing up! Please confirm your email address by clicking
        the button below.
      </p>

      <div class="button-wrapper">
        <a href="{{VERIFY_URL}}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn\u2019t work, copy and paste this link into your browser:
      </p>

      <p class="link">{{VERIFY_URL}}</p>

      <p>
        If you didn\u2019t create an account, you can safely ignore this email.
      </p>

      <p>Thanks,<br/>The Team</p>
    </div>

    <div class="footer">
      <p>&copy; 2025 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`.replace(/{{VERIFY_URL}}/g, verificationUrl)
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  }
});

// src/app.ts
import cors from "cors";

// src/middleware/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = err.message || "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = err.message.split("\n").pop()?.trim() ?? "Validation failed due to incorrect field types or missing required fields.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errorMessage = `Unique constraint failed on the ${err?.meta?.target}`;
        break;
      case "P2003":
        statusCode = 400;
        errorMessage = `Foreign key constraint failed on the field: ${err?.meta?.field_name}`;
        break;
      case "P2025":
        statusCode = 404;
        errorMessage = `Record not found. It may have been deleted or the ID is invalid.`;
        break;
      default:
        statusCode = 400;
        errorMessage = err.message;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "An unexpected database error occurred. Please try again later.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "An internal server error occurred. Please try again later.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 503;
    switch (err.errorCode) {
      case "P1000":
        errorMessage = "Unable to authenticate with the database. Please try again later.";
        break;
      case "P1001":
        errorMessage = "Database service is currently unavailable. Please try again later.";
        break;
      default:
        errorMessage = "Failed to initialize database connection. Please try again later.";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/Tutor/tutor.router.ts
import express from "express";

// src/modules/Tutor/tutor.service.ts
var createTutorProfile = async (data, res) => {
  const { categoryIds, ...profileData } = data;
  if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    return res.status(400).json({
      message: "At least one category must be provided as an array categoryIds[]"
    });
  }
  const result = await prisma.tutorProfile.create({
    data: {
      ...profileData,
      categories: {
        create: categoryIds.map((id) => ({
          category: {
            connect: { id }
          }
        }))
      }
    },
    include: {
      categories: true
    }
  });
  return result;
};
var getTutorProfiles = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        {
          categories: {
            some: {
              category: { name: { contains: search, mode: "insensitive" } }
            }
          }
        }
      ]
    });
  }
  const result = await prisma.tutorProfile.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip,
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
              sub_code: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const totalCount = await prisma.tutorProfile.count();
  return {
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    },
    data: result.map((profile) => ({
      ...profile,
      categories: profile.categories.map((cat) => cat.category)
    }))
  };
};
var getMyProfile = async (user_id) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      user_id
    },
    include: {
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
              sub_code: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result ? {
    ...result,
    categories: result.categories.map((cat) => cat.category)
  } : null;
};
var getProfileById = async (profile_id) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      id: profile_id
    },
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
              sub_code: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  return result ? {
    ...result,
    categories: result.categories.map((cat) => cat.category)
  } : null;
};
var updateTutorProfile = async (profileId, data) => {
  const { categoryIds, name, email, user_id, ...rest } = data;
  const result = await prisma.tutorProfile.update({
    where: {
      id: profileId
    },
    data: {
      ...rest,
      user: {
        update: {
          ...name && { name },
          ...email && { email }
        }
      },
      ...categoryIds && {
        categories: {
          deleteMany: {},
          create: categoryIds.map((id) => ({
            category: {
              connect: { id }
            }
          }))
        }
      }
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              name: true,
              sub_code: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var tutorService = {
  createTutorProfile,
  getTutorProfiles,
  getMyProfile,
  getProfileById,
  updateTutorProfile
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelpers = (option) => {
  const page = Number(option.page) || 1;
  const limit = Number(option.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = option.sortBy || "createdAt";
  const sortOrder = option.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelpers;

// src/modules/Tutor/tutor.controller.ts
var createTutorProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.body.user_id = userId;
    const result = await tutorService.createTutorProfile(req.body, res);
    res.status(201).json({
      message: "Tutor profile create successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getAllTutorProfiles = async (req, res, next) => {
  const search = req.query.search;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(
    req.query
  );
  try {
    const result = await tutorService.getTutorProfiles({
      search,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(201).json({
      message: "Tutor profiles retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await tutorService.getMyProfile(userId);
    res.status(201).json({
      message: "My profile retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getProfileById2 = async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }
    const result = await tutorService.getProfileById(profileId);
    res.status(201).json({
      message: "Profile retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorProfile2 = async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }
    const result = await tutorService.updateTutorProfile(
      profileId,
      req.body
    );
    res.status(201).json({
      message: "Profile updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var tutorController = {
  createTutorProfile: createTutorProfile2,
  getAllTutorProfiles,
  getMyProfile: getMyProfile2,
  getProfileById: getProfileById2,
  updateTutorProfile: updateTutorProfile2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email to access this resource"
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      role: session.user.role
    };
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource"
      });
    }
    next();
  };
};
var auth_default = auth2;

// src/modules/Tutor/tutor.router.ts
var router = express.Router();
router.post(
  "/tutor-profile",
  auth_default("TUTOR" /* TUTOR */),
  tutorController.createTutorProfile
);
router.get("/tutor-profile", tutorController.getAllTutorProfiles);
router.get(
  "/tutor-profile/me",
  auth_default("TUTOR" /* TUTOR */),
  tutorController.getMyProfile
);
router.get("/tutor-profile/:profileId", tutorController.getProfileById);
router.patch(
  "/tutor-profile/:profileId",
  auth_default("TUTOR" /* TUTOR */),
  tutorController.updateTutorProfile
);
var tutorProfileRouter = router;

// src/modules/category/category.router.ts
import express2 from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  const result = await prisma.categories.create({
    data
  });
  return result;
};
var getCategory = async () => {
  const result = await prisma.categories.findMany();
  return result;
};
var getCategoryById = async (category_id) => {
  const result = await prisma.categories.findUnique({
    where: {
      id: category_id
    }
  });
  return result;
};
var updateCategory = async (category_id, data) => {
  const result = await prisma.categories.update({
    where: {
      id: category_id
    },
    data
  });
  return result;
};
var categoryService = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
      message: "Category create successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.getCategory();
    res.status(200).json({
      message: "Category retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getCategoryById2 = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    if (!category_id) {
      throw new Error("Category ID is required");
    }
    const result = await categoryService.getCategoryById(category_id);
    res.status(200).json({
      message: "Category retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  const { category_id } = req.params;
  if (!category_id) {
    throw new Error("Category ID is required");
  }
  try {
    const result = await categoryService.updateCategory(
      category_id,
      req.body
    );
    res.status(200).json({
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getCategory: getCategory2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2
};

// src/modules/category/category.router.ts
var router2 = express2.Router();
router2.post(
  "/category",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.createCategory
);
router2.get(
  "/category",
  auth_default("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */),
  categoryController.getCategory
);
router2.get(
  "/category/:category_id",
  auth_default("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */),
  categoryController.getCategoryById
);
router2.patch(
  "/category/:category_id",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
var categoryRouter = router2;

// src/modules/tutorSchedule/tutorSchedule.router.ts
import express3 from "express";

// src/modules/tutorSchedule/tutorSchedule.service.ts
var createTutorSchedule = (data) => {
  const result = prisma.tutorSchedule.create({
    data
  });
  return result;
};
var getMySchedule = async (user_id) => {
  const result = await prisma.tutorSchedule.findMany({
    where: {
      tutor_id: user_id
    }
  });
  return result;
};
var getTutorScheduleById = async (scheduleId) => {
  return await prisma.tutorSchedule.findUnique({
    where: { id: scheduleId }
  });
};
var updateTutorSchedule = async (scheduleId, data) => {
  return await prisma.tutorSchedule.update({
    where: { id: scheduleId },
    data
  });
};
var updateTutorScheduleAvailability = async (scheduleId, isAvailable) => {
  return await prisma.tutorSchedule.update({
    where: { id: scheduleId },
    data: { isAvailable }
  });
};
var deleteTutorSchedule = async (scheduleId) => {
  return await prisma.tutorSchedule.delete({
    where: { id: scheduleId }
  });
};
var tutorScheduleService = {
  createTutorSchedule,
  getMySchedule,
  getTutorScheduleById,
  updateTutorSchedule,
  deleteTutorSchedule,
  updateTutorScheduleAvailability
};

// src/modules/tutorSchedule/tutorSchedule.controller.ts
var createTutorSchedule2 = async (req, res, next) => {
  try {
    const tutorId = req.user?.id;
    if (!tutorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.body.tutor_id = tutorId;
    const result = await tutorScheduleService.createTutorSchedule(req.body);
    res.status(201).json({
      message: "Tutor schedule created successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getMySchedule2 = async (req, res, next) => {
  try {
    const tutorId = req.user?.id;
    if (!tutorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await tutorScheduleService.getMySchedule(tutorId);
    res.status(201).json({
      message: "Tutor schedule retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getTutorScheduleById2 = async (req, res, next) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }
    const result = await tutorScheduleService.getTutorScheduleById(
      scheduleId
    );
    res.status(201).json({
      message: "Tutor schedule retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorSchedule2 = async (req, res, next) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }
    const result = await tutorScheduleService.updateTutorSchedule(
      scheduleId,
      req.body
    );
    res.status(201).json({
      message: "Tutor schedule updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorScheduleAvailability2 = async (req, res, next) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }
    const result = await tutorScheduleService.updateTutorScheduleAvailability(
      scheduleId,
      req.body.isAvailable
    );
    res.status(200).json({
      message: "Tutor schedule availability updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteTutorSchedule2 = async (req, res, next) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }
    const result = await tutorScheduleService.deleteTutorSchedule(
      scheduleId
    );
    res.status(200).json({
      message: "Tutor schedule deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var tutorScheduleController = {
  createTutorSchedule: createTutorSchedule2,
  getMySchedule: getMySchedule2,
  getTutorScheduleById: getTutorScheduleById2,
  updateTutorSchedule: updateTutorSchedule2,
  deleteTutorSchedule: deleteTutorSchedule2,
  updateTutorScheduleAvailability: updateTutorScheduleAvailability2
};

// src/modules/tutorSchedule/tutorSchedule.router.ts
var router3 = express3.Router();
router3.post(
  "/tutor-schedule",
  auth_default("TUTOR" /* TUTOR */),
  tutorScheduleController.createTutorSchedule
);
router3.get(
  "/tutor-schedule/me",
  auth_default("TUTOR" /* TUTOR */),
  tutorScheduleController.getMySchedule
);
router3.get(
  "/tutor-schedule/:scheduleId",
  auth_default("TUTOR" /* TUTOR */),
  tutorScheduleController.getTutorScheduleById
);
router3.patch(
  "/tutor-schedule/:scheduleId",
  auth_default("TUTOR" /* TUTOR */),
  tutorScheduleController.updateTutorSchedule
);
router3.patch(
  "/tutor-schedule/:scheduleId/availability",
  auth_default("TUTOR" /* TUTOR */),
  tutorScheduleController.updateTutorScheduleAvailability
);
router3.delete(
  "/tutor-schedule/:scheduleId",
  auth_default("TUTOR" /* TUTOR */, "ADMIN" /* ADMIN */),
  tutorScheduleController.deleteTutorSchedule
);
var tutorScheduleRouter = router3;

// src/modules/booking/booking.router.ts
import express4 from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (data) => {
  const { tutor_id, schedule_id, booking_date } = data;
  const scheduleExists = await prisma.tutorSchedule.findUnique({
    where: { id: schedule_id },
    include: { tutor: true }
  });
  if (!scheduleExists || scheduleExists.tutor_id !== tutor_id) {
    throw new Error(
      "The provided schedule does not exist for the specified tutor."
    );
  }
  if (!scheduleExists.isAvailable || !scheduleExists.isActive) {
    throw new Error("The provided schedule is not available for booking.");
  }
  if (booking_date < /* @__PURE__ */ new Date()) {
    throw new Error("The booking date cannot be in the past.");
  }
  const startTime = new Date(scheduleExists.start_time).getTime();
  const endTime = new Date(scheduleExists.end_time).getTime();
  const totalHours = (endTime - startTime) / (1e3 * 60 * 60);
  if (totalHours <= 0) {
    throw new Error(
      "Invalid schedule times: end time must be after start time."
    );
  }
  const calculatedTotalPrice = (scheduleExists.tutor.hourly_rate || 0) * totalHours;
  const result = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.bookings.create({
      data: {
        ...data,
        total_price: Number(calculatedTotalPrice.toFixed(2)),
        session_link: `https://meet.google.com/dqb-rxmh-xgw`
      }
    });
    await tx.tutorSchedule.update({
      where: { id: schedule_id },
      data: { isAvailable: false }
    });
    return newBooking;
  });
  return result;
};
var getAllBookings = async () => {
  const result = await prisma.bookings.findMany({
    include: { student: true, tutor_schedule: true, tutor: {
      select: {
        profile_picture: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    } },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getTutorBookings = async (tutor_id) => {
  const result = await prisma.bookings.findMany({
    where: { tutor_id },
    include: { student: true, tutor_schedule: true },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getStudentBookings = async (student_id) => {
  const result = await prisma.bookings.findMany({
    where: { student_id },
    include: {
      tutor: {
        select: {
          profile_picture: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      },
      tutor_schedule: true
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getBookingById = async (booking_id) => {
  const result = await prisma.bookings.findUnique({
    where: { id: booking_id },
    include: { student: true, tutor: {
      select: {
        profile_picture: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }, tutor_schedule: true, review: {
      select: {
        id: true,
        rating: true,
        comment: true,
        isApproved: true
      }
    } }
  });
  return result;
};
var updateBookingStatus = async (bookingId, status) => {
  if (status === "CANCELLED" || status === "COMPLETED") {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.bookings.update({
        where: { id: bookingId },
        data: { status }
      });
      await tx.tutorSchedule.update({
        where: { id: booking.schedule_id },
        data: { isAvailable: true }
      });
      return booking;
    });
  }
  return await prisma.bookings.update({
    where: { id: bookingId },
    data: { status }
  });
};
var bookingService = {
  createBooking,
  getAllBookings,
  getTutorBookings,
  getStudentBookings,
  updateBookingStatus,
  getBookingById
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.body.student_id = user_id;
    const result = await bookingService.createBooking(req.body);
    res.status(201).json({
      message: "Booking created successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getAllBookings2 = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBookings();
    res.status(200).json({
      message: "Bookings retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getBookingById2 = async (req, res, next) => {
  try {
    const booking_id = req.params?.bookingId;
    if (!booking_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await bookingService.getBookingById(booking_id);
    res.status(200).json({
      message: "Bookings retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getTutorBookings2 = async (req, res, next) => {
  try {
    const tutor_id = req.user?.id;
    if (!tutor_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await bookingService.getTutorBookings(tutor_id);
    res.status(200).json({
      message: "Tutor bookings retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getStudentBookings2 = async (req, res, next) => {
  try {
    const tutor_id = req.user?.id;
    if (!tutor_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await bookingService.getStudentBookings(tutor_id);
    res.status(200).json({
      message: "Student bookings retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var updateBookingStatus2 = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { status } = req.body;
    const result = await bookingService.updateBookingStatus(
      bookingId,
      status
    );
    res.status(200).json({
      message: "Booking status updated successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var bookingController = {
  createBooking: createBooking2,
  getAllBookings: getAllBookings2,
  getTutorBookings: getTutorBookings2,
  getStudentBookings: getStudentBookings2,
  updateBookingStatus: updateBookingStatus2,
  getBookingById: getBookingById2
};

// src/modules/booking/booking.router.ts
var router4 = express4.Router();
router4.post(
  "/booking",
  auth_default("STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */),
  bookingController.createBooking
);
router4.get("/booking", auth_default("ADMIN" /* ADMIN */), bookingController.getAllBookings);
router4.get(
  "/booking/tutor",
  auth_default("TUTOR" /* TUTOR */),
  bookingController.getTutorBookings
);
router4.get(
  "/booking/student",
  auth_default("STUDENT" /* STUDENT */),
  bookingController.getStudentBookings
);
router4.get("/booking/:bookingId", auth_default("ADMIN" /* ADMIN */, "STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), bookingController.getBookingById);
router4.patch(
  "/booking/:bookingId/status",
  auth_default("TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */),
  bookingController.updateBookingStatus
);
var bookingRouter = router4;

// src/modules/review/review.router.ts
import express5 from "express";

// src/modules/review/review.service.ts
var createReview = async (data) => {
  const { rating, ...rest } = data;
  if (Number(rating) < 1 || Number(rating) > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const existingBooking = await prisma.bookings.findUnique({
    where: {
      id: data.booking_id
    },
    include: {
      review: true
    }
  });
  if (!existingBooking) {
    throw new Error("Booking not found");
  }
  if (existingBooking.review) {
    throw new Error("Review already exists for this booking");
  }
  if (existingBooking.status !== "COMPLETED") {
    throw new Error(
      "You can only review a booking after it has been completed."
    );
  }
  const result = await prisma.reviews.create({
    data: {
      ...rest,
      rating: Number(rating),
      student_id: existingBooking.student_id,
      tutor_id: existingBooking.tutor_id
    }
  });
  return result;
};
var getAllReviews = async () => {
  const result = await prisma.reviews.findMany({
    include: {
      student: {
        select: {
          name: true,
          image: true
        }
      },
      tutor: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getTutorReviews = async (tutor_id) => {
  const result = await prisma.reviews.findMany({
    where: {
      tutor_id,
      isApproved: true
    },
    include: {
      student: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var updateReview = async (review_id, student_id, data) => {
  if (data.rating !== void 0) {
    if (Number(data.rating) < 1 || Number(data.rating) > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
  }
  const isOwner = await prisma.reviews.findUnique({
    where: { id: review_id, student_id }
  });
  if (!isOwner) {
    throw new Error("You are not authorized to edit this review.");
  }
  return await prisma.reviews.update({
    where: { id: review_id },
    data
  });
};
var updateReviewStatus = async (review_id, isApproved) => {
  return await prisma.reviews.update({
    where: { id: review_id },
    data: { isApproved }
  });
};
var deleteReview = async (review_id) => {
  return await prisma.reviews.delete({
    where: { id: review_id }
  });
};
var reviewService = {
  createReview,
  getAllReviews,
  getTutorReviews,
  updateReview,
  updateReviewStatus,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.body);
    res.status(201).json({
      message: "Review created successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getAllReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      message: "Reviews retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getTutorReviews2 = async (req, res, next) => {
  try {
    const tutor_id = req?.user?.id;
    if (!tutor_id) {
      throw new Error("Tutor ID is required");
    }
    const result = await reviewService.getTutorReviews(tutor_id);
    res.status(200).json({
      message: "Tutor reviews retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var updateReviewStatus2 = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;
    if (!review_id) {
      throw new Error("Review ID is required");
    }
    const result = await reviewService.updateReviewStatus(
      review_id,
      req.body.isApproved
    );
    res.status(200).json({
      message: "Review status updated successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var updateReview2 = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;
    const student_id = req.user?.id;
    if (!review_id) {
      throw new Error("Review ID is required");
    }
    if (!student_id) {
      throw new Error("Unauthorized");
    }
    const result = await reviewService.updateReview(
      review_id,
      student_id,
      req.body
    );
    res.status(200).json({
      message: "Review updated successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;
    if (!review_id) {
      throw new Error("Review ID is required");
    }
    const result = await reviewService.deleteReview(review_id);
    res.status(200).json({
      message: "Review deleted successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  getTutorReviews: getTutorReviews2,
  updateReviewStatus: updateReviewStatus2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/modules/review/review.router.ts
var router5 = express5.Router();
router5.post("/review", auth_default("STUDENT" /* STUDENT */), reviewController.createReview);
router5.get("/review", reviewController.getAllReviews);
router5.get("/review/tutor", auth_default("TUTOR" /* TUTOR */), reviewController.getTutorReviews);
router5.patch(
  "/review/:review_id/status",
  auth_default("ADMIN" /* ADMIN */),
  reviewController.updateReviewStatus
);
router5.patch(
  "/review/:review_id",
  auth_default("STUDENT" /* STUDENT */),
  reviewController.updateReview
);
router5.delete(
  "/review/:review_id",
  auth_default("STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */),
  reviewController.deleteReview
);
var reviewRouter = router5;

// src/middleware/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/modules/Auth/auth.router.ts
import express6 from "express";

// src/modules/Auth/auth.service.ts
var getAllUser = async (role) => {
  return await prisma.user.findMany({
    where: {
      ...role ? { role } : {}
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      status: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (userId, status) => {
  const existUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!existUser) {
    throw new Error("User not found");
  }
  return await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      status: true
    }
  });
};
var authService = {
  getAllUser,
  updateUserStatus
};

// src/modules/Auth/auth.controller.ts
var getAllUser2 = async (req, res, next) => {
  try {
    const { role } = req.query;
    const result = await authService.getAllUser(role);
    res.status(200).json({
      message: "Users retrieved successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const result = await authService.updateUserStatus(userId, status);
    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully`,
      data: result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var authController = {
  getAllUser: getAllUser2,
  updateUserStatus: updateUserStatus2
};

// src/modules/Auth/auth.router.ts
var router6 = express6.Router();
router6.get("/users", auth_default("ADMIN" /* ADMIN */), authController.getAllUser);
router6.patch(
  "/users/:userId",
  auth_default("ADMIN" /* ADMIN */),
  authController.updateUserStatus
);
var authRouter = router6;

// src/app.ts
var app = express7();
app.use(express7.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
  })
);
app.get("/", (req, res) => {
  res.send("Welcome to the Prisma tutor management App!");
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", authRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", tutorProfileRouter);
app.use("/api/v1", tutorScheduleRouter);
app.use("/api/v1", bookingRouter);
app.use("/api/v1", reviewRouter);
app.use(globalErrorHandler_default);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
