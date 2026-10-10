import { NextRequest, NextResponse } from 'next/server';

const CURRENCY_MAP: Record<string, { currency: string; symbol: string; name: string }> = {
  CO: { currency: 'COP', symbol: '$', name: 'Peso colombiano' },
  MX: { currency: 'MXN', symbol: '$', name: 'Peso mexicano' },
  BR: { currency: 'BRL', symbol: 'R$', name: 'Real brasileño' },
  CL: { currency: 'CLP', symbol: '$', name: 'Peso chileno' },
  PE: { currency: 'PEN', symbol: 'S/', name: 'Sol peruano' },
  UY: { currency: 'UYU', symbol: '$', name: 'Peso uruguayo' },
  BO: { currency: 'BOB', symbol: 'Bs', name: 'Boliviano' },
  PY: { currency: 'PYG', symbol: 'Gs', name: 'Guaraní' },
  DO: { currency: 'DOP', symbol: 'RD$', name: 'Peso dominicano' },
  CR: { currency: 'CRC', symbol: '₡', name: 'Colón costarricense' },
  GT: { currency: 'GTQ', symbol: 'Q', name: 'Quetzal' },
  HN: { currency: 'HNL', symbol: 'L', name: 'Lempira' },
  NI: { currency: 'NIO', symbol: 'C$', name: 'Córdoba' },
};

const USD_DEFAULT = { currency: 'USD', symbol: '$', name: 'US Dollar' };

export async function GET(request: NextRequest) {
  const testCountry = request.nextUrl.searchParams.get('country');
  const country = (testCountry ?? request.headers.get('x-vercel-ip-country') ?? 'US').toUpperCase();
  const currencyInfo = CURRENCY_MAP[country] ?? USD_DEFAULT;

  let rate = 1;
  if (currencyInfo.currency !== 'USD') {
    try {
      const res = await fetch(
        'https://open.er-api.com/v6/latest/USD',
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      rate = data.rates?.[currencyInfo.currency] ?? 1;
    } catch {
      rate = 1;
    }
  }

  return NextResponse.json({ country, ...currencyInfo, rate });
}
