-- Documento 5: Setup de Base de Datos (Supabase)
-- Vision: AIRLOCAL™ Predictive System

-- ==========================================
-- 1. TABLA: properties
-- ==========================================
-- Almacena las propiedades de los usuarios (hosts) y de los competidores.
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID, -- Referencia al usuario de Supabase Auth
    name VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) DEFAULT 'user_property' CHECK (property_type IN ('user_property', 'competitor')),
    platform VARCHAR(50) CHECK (platform IN ('Airbnb', 'Zonaprop', 'Finca Raiz', 'Booking', 'Direct')),
    country VARCHAR(50) CHECK (country IN ('Colombia', 'Argentina')),
    city VARCHAR(100) NOT NULL,
    address TEXT,
    capacity INT DEFAULT 1,
    bedrooms INT DEFAULT 1,
    bathrooms NUMERIC(3,1) DEFAULT 1.0,
    base_price NUMERIC(10,2), -- Precio base real/listado
    currency VARCHAR(10) DEFAULT 'USD',
    url TEXT, -- Link scrapeado o del usuario
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- 2. TABLA: market_analysis
-- ==========================================
-- Almacena el Diagnóstico 360, "Revenue Illusion" y capas de competencia.
CREATE TABLE IF NOT EXISTS public.market_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Pilar 1: Auditoría de Fugas (Revenue Illusion)
    gross_revenue NUMERIC(10,2) DEFAULT 0.00,
    cleaning_expenses NUMERIC(10,2) DEFAULT 0.00,
    maintenance_expenses NUMERIC(10,2) DEFAULT 0.00,
    platform_commissions NUMERIC(10,2) DEFAULT 0.00,
    fixed_operation_costs NUMERIC(10,2) DEFAULT 0.00,
    net_profit NUMERIC(10,2) GENERATED ALWAYS AS (
        gross_revenue - (cleaning_expenses + maintenance_expenses + platform_commissions + fixed_operation_costs)
    ) STORED,
    
    -- Capa de Competencia (Factor X / Anfitriones Débiles de Rakidzich)
    weak_host_flags JSONB DEFAULT '{}'::jsonb, -- Ej: {"bad_photos": true, "flat_pricing": true, "rigid_min_stay": true}
    
    -- Pilar 3: Benchmarks Locales / Comparables
    competitor_adr NUMERIC(10,2), -- ADR de propiedades idénticas a < 50% de gastos
    market_occupancy_rate NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- 3. TABLA: events
-- ==========================================
-- Capa de Eventos (conciertos, ferias) para predecir alzas de precio.
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(50) CHECK (country IN ('Colombia', 'Argentina')),
    city VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    demand_multiplier NUMERIC(4,2) DEFAULT 1.00, -- Ej: 1.50 para 50% extra de SmartPrice
    impact_level VARCHAR(20) CHECK (impact_level IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- SEGURIDAD (Row Level Security - RLS)
-- ==========================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura básicas (ajustar con Auth final o Service Role - n8n)
CREATE POLICY "Users view own or tracking properties" ON public.properties
    FOR SELECT USING (auth.uid() = owner_id OR property_type = 'competitor');

-- ==========================================
-- TABLA: Triggers automáticos
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_modtime
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
