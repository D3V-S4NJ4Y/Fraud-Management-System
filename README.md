# Odisha Police Cyber Fraud Victim Support & Tracking System

A comprehensive, citizen-centric digital platform to provide end-to-end tracking of complaints, FIRs, and refund processes for victims of cyber fraud in Odisha.

## 🚀 Features

### 1. Victim Dashboard
- **Unique Complaint ID**: Links 1930 helpline, CFCFRMS, and FIR status
- **Real-time Tracking**: Monitor refund and bank-freeze status
- **Integrated Support**: Direct coordination with police and financial nodal officers
- **Progress Visualization**: Color-coded status indicators (Pending, In Process, Refunded, Closed)

### 2. Bank & Nodal Coordination
- **Automated Alerts**: Instant notifications to concerned banks for fund hold requests
- **RBI Integration**: Seamless integration with RBI frameworks for faster reconciliation
- **NPCI Framework**: Connected with NPCI for efficient payment system coordination
- **Multi-Bank Support**: Works with all major banks operating in India

### 3. Case Progress Visualization
- **Color-Coded Status**: Visual indicators for case progress
- **Analytics Dashboard**: Comprehensive insights into fraud typology and recovery
- **Turnaround Time Tracking**: Monitor resolution times and performance metrics
- **Amount Recovery Analytics**: Track financial recovery across cases

### 4. Awareness & Support
- **SMS/Email Updates**: Automated notifications to victims
- **Cyber Awareness Resources**: Educational content and prevention tips
- **Helpline Integration**: Direct access to 1930 cyber crime helpline
- **Multi-Channel Support**: Support via SMS, email, WhatsApp, and in-app notifications

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Database**: SQLite with Prisma ORM
- **UI Components**: shadcn/ui with Tailwind CSS 4
- **State Management**: Zustand for client state, TanStack Query for server state
- **Real-time Communication**: Socket.IO for live updates
- **AI Integration**: ZAI Web Dev SDK for intelligent features

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── complaints/         # Complaint management
│   │   ├── bank-actions/       # Bank coordination
│   │   ├── refunds/           # Refund processing
│   │   ├── notifications/     # Notification system
│   │   ├── awareness/         # Awareness campaigns
│   │   └── analytics/         # Analytics data
│   ├── admin/                 # Police officer dashboard
│   ├── analytics/             # Analytics dashboard
│   └── page.tsx              # Main victim dashboard
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── db.ts                 # Database client
│   └── utils/                # Utility functions
└── prisma/
    └── schema.prisma         # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odisha-police-cyber-fraud-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The system uses a comprehensive database schema with the following key entities:

- **Users**: Victim and officer accounts
- **Complaints**: Fraud complaint records with full details
- **BankActions**: Bank coordination and freeze requests
- **Refunds**: Refund processing and tracking
- **Notifications**: Multi-channel notification system
- **CaseUpdates**: Case progress tracking
- **Evidence**: Document and evidence management
- **NodalOfficers**: Officer contact information
- **FraudTypology**: Fraud type categorization

## 🔐 Security Features

- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **Access Control**: Role-based access control for different user types
- **Audit Logging**: Complete audit trail of all actions
- **Secure Authentication**: Integration with secure authentication systems
- **Input Validation**: Comprehensive input validation and sanitization

## 📱 Responsive Design

The system is fully responsive and works across:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes and orientations

## 🔄 Real-time Features

- **Live Status Updates**: Real-time complaint status updates
- **Instant Notifications**: Immediate alerts for important events
- **Live Analytics**: Real-time dashboard updates
- **Socket.IO Integration**: WebSocket-based real-time communication

## 🤖 AI Integration

The system leverages AI for:
- **Fraud Pattern Recognition**: Identify common fraud patterns
- **Automated Responses**: AI-powered email and SMS generation
- **Web Search Integration**: Latest fraud trend information
- **Smart Analytics**: Intelligent insights and recommendations

## 📈 Analytics & Reporting

- **Comprehensive Dashboard**: Full analytics dashboard for administrators
- **Custom Reports**: Generate custom reports based on various parameters
- **Performance Metrics**: Track system performance and resolution times
- **Fraud Trends**: Analyze fraud patterns and trends
- **Recovery Analytics**: Track financial recovery metrics

## 🔗 External Integrations

- **1930 Helpline**: Direct integration with cyber crime helpline
- **CFCFRMS**: Cyber Crime Financial Fraud Reporting and Management System
- **RBI Frameworks**: Integration with Reserve Bank of India systems
- **NPCI**: National Payments Corporation of India integration
- **Bank APIs**: Direct integration with major banking systems

## 🎯 Key Benefits

### For Victims
- **Single Point of Contact**: One platform for all fraud-related needs
- **Real-time Tracking**: Live updates on complaint status
- **Faster Resolution**: Streamlined process for quicker resolution
- **Transparency**: Complete visibility into case progress

### For Police Officers
- **Efficient Case Management**: Streamlined workflow for complaint handling
- **Bank Coordination**: Automated bank action requests
- **Analytics**: Data-driven insights for better decision-making
- **Reduced Paperwork**: Digital documentation and tracking

### For Banks
- **Automated Processing**: Automated freeze and hold requests
- **Standardized Format**: Consistent request format across all banks
- **Faster Response**: Reduced turnaround time for bank actions
- **Compliance**: Full compliance with regulatory requirements

## 📞 Support & Contact

- **Cyber Crime Helpline**: 1930
- **Email**: cyber@odishapolice.gov.in
- **Emergency**: 112
- **Women Helpline**: 1091
- **Child Helpline**: 1098

## 🚀 Deployment

The system is designed for easy deployment:
- **Cloud Ready**: Can be deployed on any cloud platform
- **Scalable Architecture**: Scales to handle high volume of complaints
- **Load Balancing**: Supports load balancing for high availability
- **Monitoring**: Built-in monitoring and logging

## 📝 License

This project is proprietary to Odisha Police and is not open source.

## 🤝 Contributing

This is a government project. Please contact the Odisha Police Cyber Cell for any contributions or suggestions.

---

**Built with ❤️ for the citizens of Odisha by Odisha Police Cyber Crime Division**