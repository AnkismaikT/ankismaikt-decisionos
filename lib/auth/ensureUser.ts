import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "./fakeUser";

export async function ensureUser() {
  const userId = getCurrentUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: userId,
        email: "demo@decisionos.local",
      },
    });
  }

  return userId;
}

