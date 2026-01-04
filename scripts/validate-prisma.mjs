
import fs from "fs";
import path from "path";

const prismaClientPath = path.resolve(process.cwd(), "src/generated/prisma");

if (!fs.existsSync(prismaClientPath) || fs.readdirSync(prismaClientPath).length === 0) {
  console.error(
    `[ERROR] The Prisma client was not found at '${prismaClientPath}'. Please run 'npx prisma generate' to generate it.`
  );
  process.exit(1);
}

console.log("[INFO] Prisma client validation passed.");
