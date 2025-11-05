# Test Users for MongoDB

## 🔑 Login Credentials

### Admin User
- **Email**: `admin@odisha.gov.in`
- **Password**: `admin123`
- **Role**: ADMIN
- **Access**: Full system access, analytics, user management

### Police Officer
- **Email**: `police@odisha.gov.in`
- **Password**: `police123`
- **Role**: POLICE_OFFICER
- **Access**: Complaint management, bank actions, case updates

### Victim User
- **Email**: `victim@example.com`
- **Password**: `password123`
- **Role**: VICTIM
- **Access**: File complaints, track status, view updates

## 📊 Sample Data Included

### Complaints
1. **CF2024001** - Phishing case (₹50,000) - Status: FUNDS_FROZEN
2. **CF2024002** - Online shopping fraud (₹25,000) - Status: REFUND_PROCESSING

## 🚀 How to Add Test Data

1. **Start the server**: `npm run dev`
2. **Call seed API**: `POST http://localhost:3000/api/seed`
3. **Check data**: `GET http://localhost:3000/api/test-db`

## 📱 Usage Instructions

1. **Visit**: `http://localhost:3000/login`
2. **Login with any of the above credentials**
3. **Admin/Police**: Access `/admin` dashboard
4. **Victim**: Access main dashboard at `/`

## 🔍 Verify MongoDB Data

After seeding, you can verify in MongoDB Atlas:
- Database: `VictimSupportDB`
- Collections: `User`, `Complaint`, etc.
- Check user count and complaint records