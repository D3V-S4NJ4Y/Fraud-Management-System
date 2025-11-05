# Quick Fix for Database Connection

## 🚨 **Current Issue:**
Prisma client still looking for MongoDB instead of PostgreSQL.

## 🔧 **Immediate Solutions:**

### **Option 1: Fix Supabase Connection**
1. **Get correct DATABASE_URL from Supabase:**
   - Go to Supabase Dashboard → Settings → Database
   - Copy "Connection string" 
   - Replace `[YOUR-PASSWORD]` with actual password

2. **Update .env:**
   ```env
   DATABASE_URL="postgresql://postgres:ACTUAL_PASSWORD@db.xqjkkccrqvgstjrorwkr.supabase.co:5432/postgres"
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

### **Option 2: Use Direct Supabase Client**
Create a simple API without Prisma:

```typescript
// src/app/api/direct-complaints/route.ts
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Complaint')
      .select('*')
      .limit(10)
    
    if (error) throw error
    
    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message })
  }
}
```

### **Option 3: Manual Data Setup**
1. **Supabase Dashboard → SQL Editor**
2. **Run:** `create-supabase-tables.sql`
3. **Verify:** Table Editor में tables check करें

## 🎯 **Quick Test:**
Visit: `http://localhost:3000/api/test-connection`

## 🔑 **Expected Result:**
```json
{
  "success": true,
  "connection": "Connected to Supabase",
  "data": {
    "userCount": 3,
    "complaintCount": 2
  }
}
```

Choose Option 1 for fastest fix!