// Simple script to seed MongoDB data
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const db = new PrismaClient()

async function seedData() {
  try {
    console.log('🌱 Seeding MongoDB data...')
    
    // Clear existing data
    await db.user.deleteMany({})
    await db.complaint.deleteMany({})
    
    // Create users
    const users = [
      {
        email: 'admin@odisha.gov.in',
        password: await bcrypt.hash('admin123', 12),
        name: 'System Administrator',
        phone: '+91 9876543210',
        role: 'ADMIN',
        isActive: true
      },
      {
        email: 'police@odisha.gov.in',
        password: await bcrypt.hash('police123', 12),
        name: 'Inspector S. Patnaik',
        phone: '+91 9876543211',
        role: 'POLICE_OFFICER',
        isActive: true
      },
      {
        email: 'victim@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Rajesh Kumar',
        phone: '+91 9876543212',
        role: 'VICTIM',
        isActive: true
      }
    ]
    
    for (const userData of users) {
      const user = await db.user.create({ data: userData })
      console.log(`✅ Created user: ${user.email}`)
    }
    
    console.log('🎉 Data seeded successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('Admin: admin@odisha.gov.in / admin123')
    console.log('Police: police@odisha.gov.in / police123')
    console.log('Victim: victim@example.com / password123')
    
  } catch (error) {
    console.error('❌ Seed error:', error)
  } finally {
    await db.$disconnect()
  }
}

seedData()