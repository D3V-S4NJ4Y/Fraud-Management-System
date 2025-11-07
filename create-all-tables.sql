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