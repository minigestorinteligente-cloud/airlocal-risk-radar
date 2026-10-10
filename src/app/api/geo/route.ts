import { NextRequest, NextResponse } from 'next/server';

const CURRENCY_MAP: Record<string, { currency: string; symbol: string; name: string; countryName: string; exampleCity: string }> = {
  CO: { currency: 'COP', symbol: '$', name: 'Peso colombiano',    countryName: 'Colombia',            exampleCity: 'Bogotá' },
  MX: { currency: 'MXN', symbol: '$', name: 'Peso mexicano',      countryName: 'México',              exampleCity: 'Ciudad de México' },
  BR: { currency: 'BRL', symbol: 'R$', name: 'Real brasileño',    countryName: 'Brasil',              exampleCity: 'São Paulo' },
  CL: { currency: 'CLP', symbol: '$', name: 'Peso chileno',       countryName: 'Chile',               exampleCity: 'Santiago' },
  PE: { currency: 'PEN', symbol: 'S/', name: 'Sol peruano',       countryName: 'Perú',                exampleCity: 'Lima' },
  UY: { currency: 'UYU', symbol: '$', name: 'Peso uruguayo',      countryName: 'Uruguay',             exampleCity: 'Montevideo' },
  BO: { currency: 'BOB', symbol: 'Bs', name: 'Boliviano',         countryName: 'Bolivia',             exampleCity: 'Santa Cruz' },
  PY: { currency: 'PYG', symbol: 'Gs', name: 'Guaraní',           countryName: 'Paraguay',            exampleCity: 'Asunción' },
  DO: { currency: 'DOP', symbol: 'RD$', name: 'Peso dominicano',  countryName: 'República Dominicana', exampleCity: 'Santo Domingo' },
  CR: { currency: 'CRC', symbol: '₡', name: 'Colón costarricense', countryName: 'Costa Rica',         exampleCity: 'San José' },
  GT: { currency: 'GTQ', symbol: 'Q', name: 'Quetzal',            countryName: 'Guatemala',           exampleCity: 'Ciudad de Guatemala' },
  HN: { currency: 'HNL', symbol: 'L', name: 'Lempira',            countryName: 'Honduras',            exampleCity: 'Tegucigalpa' },
  NI: { currency: 'NIO', symbol: 'C$', name: 'Córdoba',           countryName: 'Nicaragua',           exampleCity: 'Managua' },
};

const USD_DEFAULT = { currency: 'USD', symbol: '$', name: 'US Dollar', countryName: '', exampleCity: 'Miami' };

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
