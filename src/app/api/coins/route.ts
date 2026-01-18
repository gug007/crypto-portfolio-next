import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vsCurrency = searchParams.get('vs_currency') || 'usd';
  const perPage = 250;
  const totalPages = 4;

  try {
    const fetchPromises = Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;
      
      return fetch(url, {
        next: { revalidate: 60 }, // Cache for 1 minute
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch page ${page}: ${res.status}`);
        }
        return res.json();
      });
    });

    const results = await Promise.all(fetchPromises);
    const mergedData = results.flat();

    return NextResponse.json(mergedData);
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coin data' },
      { status: 500 }
    );
  }
}
