# Supabase Setup Instructions

## Problem: Invalid API Key Error

Your current Supabase keys are expired or invalid. Follow these steps:

## Step 1: Get New Supabase Keys

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: `xqjkkccrqvgstjrorwkr`
4. Go to **Settings** → **API**
5. Copy the following keys:

### Required Keys:
- **Project URL**: `https://xqjkkccrqvgstjrorwkr.supabase.co`
- **anon public key**: Copy from "Project API keys" section
- **service_role secret key**: Copy from "Project API keys" section

## Step 2: Update Environment Files

Update both `.env` and `.env.local` files:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xqjkkccrqvgstjrorwkr.supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://xqjkkccrqvgstjrorwkr.supabase.co"
SUPABASE_ANON_KEY="YOUR_NEW_ANON_KEY"
NEXT_PUBLIC_SUPABASE_URL="https://xqjkkccrqvgstjrorwkr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_NEW_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_NEW_SERVICE_ROLE_KEY"
```

## Step 3: Create Database Tables

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy and paste this SQL:

```sql
-- Create victims table
CREATE TABLE IF NOT EXISTS victims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'VICTIM',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create police_officers table
CREATE TABLE IF NOT EXISTS police_officers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    district VARCHAR(100),
    police_station VARCHAR(255),
    department VARCHAR(255),
    designation VARCHAR(255),
    experience VARCHAR(100),
    reason TEXT,
    id_card_url TEXT,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bank_officers table
CREATE TABLE IF NOT EXISTS bank_officers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    department VARCHAR(255),
    designation VARCHAR(255),
    experience VARCHAR(100),
    reason TEXT,
    id_card_url TEXT,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nodal_officers table
CREATE TABLE IF NOT EXISTS nodal_officers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    department VARCHAR(255),
    designation VARCHAR(255),
    experience VARCHAR(100),
    reason TEXT,
    id_card_url TEXT,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Click **Run** to create all tables

## Step 4: Restart Development Server

```bash
npm run dev
```

## Step 5: Test Registration

Try registering a victim again. It should work now.

## Alternative: Create New Supabase Project

If keys still don't work:
1. Create a new Supabase project
2. Update all URLs and keys
3. Run the SQL to create tables
4. Update environment files

## Current Error Details:
- **Error**: Invalid API key
- **Cause**: Expired or incorrect Supabase keys
- **Solution**: Follow steps above to get fresh keys