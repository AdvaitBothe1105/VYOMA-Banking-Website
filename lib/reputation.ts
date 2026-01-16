import { prisma } from "@/lib/prisma";

/**
 * Centralized reputation adjustment helper
 * All reputation changes must go through this function for auditability
 */
export async function adjustReputation(
  crn: string,
  delta: number,
  reason: string
) {
  try {
    await prisma.reputation.upsert({
      where: { crn },
      update: {
        score: {
          increment: delta,
        },
      },
      create: {
        crn,
        score: delta,
      },
    });

    console.log(
      `[REPUTATION] ${crn} ${delta > 0 ? "+" : ""}${delta} — ${reason}`
    );
  } catch (err) {
    console.error(`[REPUTATION ERROR] Failed to adjust reputation for ${crn}:`, err);
    throw err;
  }
}
