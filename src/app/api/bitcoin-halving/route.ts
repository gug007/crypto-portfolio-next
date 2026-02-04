import { NextResponse } from "next/server";

const TARGET_HALVING_HEIGHT = 1_050_000;
const AVERAGE_BLOCK_TIME_SECONDS = 10 * 60;
const HEIGHT_ENDPOINT = "https://blockstream.info/api/blocks/tip/height";

export async function GET() {
  const updatedAt = new Date();

  try {
    const res = await fetch(HEIGHT_ENDPOINT, { next: { revalidate: 30 } });
    if (!res.ok) {
      throw new Error(`Height request failed (${res.status})`);
    }

    const heightText = (await res.text()).trim();
    const currentHeight = Number.parseInt(heightText, 10);
    if (!Number.isFinite(currentHeight)) {
      throw new Error("Invalid height response");
    }

    const blocksRemainingRaw = TARGET_HALVING_HEIGHT - currentHeight;
    const blocksRemaining = Math.max(0, blocksRemainingRaw);
    const estimatedSecondsRemaining =
      blocksRemaining * AVERAGE_BLOCK_TIME_SECONDS;
    const estimatedHalvingTime = new Date(
      updatedAt.getTime() + estimatedSecondsRemaining * 1000,
    );

    return NextResponse.json({
      targetHeight: TARGET_HALVING_HEIGHT,
      currentHeight,
      blocksRemaining,
      averageBlockTimeSeconds: AVERAGE_BLOCK_TIME_SECONDS,
      estimatedSecondsRemaining,
      estimatedHalvingTimeISO: estimatedHalvingTime.toISOString(),
      updatedAtISO: updatedAt.toISOString(),
      source: HEIGHT_ENDPOINT,
    });
  } catch (error) {
    console.error("Error fetching Bitcoin tip height:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch current block height",
        targetHeight: TARGET_HALVING_HEIGHT,
        updatedAtISO: updatedAt.toISOString(),
      },
      { status: 500 },
    );
  }
}

