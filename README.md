# TymexAI Admin Console

A comprehensive admin dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Authentication**: Mock Microsoft OAuth 2.0 integration with fallback email/password login
- **Dashboard Layout**: Responsive two-column layout with collapsible sidebar
- **Tree Navigation**: Hierarchical sidebar menu with expandable sections
- **Permission Management**: Editable tables for Slack and Web permissions
- **User Management**: User listing with role and status management
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: ARIA labels and keyboard navigation support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with auth routing
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth-provider.tsx   # Authentication context
│   ├── login-page.tsx      # Login interface
│   ├── dashboard-layout.tsx # Main dashboard layout
│   ├── app-sidebar.tsx     # Navigation sidebar
│   ├── dashboard-content.tsx # Content area router
│   ├── slack-permissions-table.tsx # Slack permissions management
│   ├── web-permissions-table.tsx   # Web permissions management
│   └── user-management.tsx # User management interface
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd tymexai-admin-console
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mock Authentication

The application includes mock authentication for development:

- **Microsoft OAuth**: Click "Sign in with Microsoft" (simulated)
- **Email/Password**: Use any email and password combination

## Features Overview

### Authentication
- Mock Microsoft OAuth 2.0 flow
- Persistent login state using localStorage
- User profile management
- Secure logout functionality

### Navigation
- Collapsible sidebar with tree structure
- Slack Permission Access submenu (Slack, Web)
- User Management section
- Active state indicators

### Permission Management
- **Slack Permissions**: Manage Slack channel access and permissions
- **Web Permissions**: Control web application access
- **Inline Editing**: Click edit icon to modify scope values
- **Real-time Updates**: Changes are immediately reflected

### User Management
- User listing with avatars and details
- Role-based access control (Admin, Editor, Viewer)
- Status management (Active, Inactive, Pending)
- Action dropdown for user operations

## Customization

### Adding New Navigation Items

1. Update the \`NavigationItem\` type in \`dashboard-layout.tsx\`
2. Add the new item to the sidebar in \`app-sidebar.tsx\`
3. Create a corresponding component and add it to \`dashboard-content.tsx\`

### Styling

The application uses Tailwind CSS with shadcn/ui components. Customize:

- **Colors**: Modify CSS variables in \`globals.css\`
- **Components**: Override shadcn/ui component styles
- **Layout**: Adjust spacing and sizing with Tailwind classes

### Real Authentication

To implement real Microsoft OAuth:

1. Set up Microsoft Azure App Registration
2. Install NextAuth.js: \`npm install next-auth\`
3. Configure Microsoft provider in NextAuth
4. Replace mock authentication in \`auth-provider.tsx\`

## Accessibility

The application follows accessibility best practices:

- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Development

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

### Code Organization

- **Components**: Reusable UI components in \`components/\`
- **Pages**: Route components in \`app/\`
- **Types**: TypeScript interfaces defined inline
- **Styles**: Tailwind classes and CSS variables

## Future Enhancements

- Real Microsoft OAuth integration
- API integration for data management
- Advanced filtering and search
- Bulk operations for user management
- Audit logging and activity tracking
- Role-based UI restrictions
- Data export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`
