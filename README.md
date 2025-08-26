# expo-nextjs-monorepo - A Monorepo Skeleton

A modern monorepo skeleton for building with web and mobile applications. Built with the latest technologies and best practices.

## 🚀 Features

- **🔐 Authentication**: Powered by [Better Auth](https://www.better-auth.com/) for secure, cross-platform sign-in/sign-up
- **📱 Cross-Platform**: Web (Next.js 15) + Mobile (Expo 53)
- **🎨 Modern UI**: shadcn/ui components + Tailwind CSS v4 (web) + NativeWind v4 (mobile)
- **⚡ Fast Development**: Turborepo for blazing-fast builds and caching
- **🔧 Type Safety**: Full TypeScript support across all packages
- **📦 Package Manager**: pnpm with efficient workspace management
- **🎯 Production Ready**: Optimized for scale and performance

## 🛠️ Tech Stack

### Core
- **[Turborepo](https://turborepo.com/)** - High-performance build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Web (Next.js)
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI
- **[React 19](https://react.dev/)** - Latest React with concurrent features

### Mobile (Expo)
- **[Expo 53](https://expo.dev/)** - React Native development platform
- **[NativeWind v4](https://www.nativewind.dev/)** - Tailwind CSS for React Native
- **[Expo Router](https://docs.expo.dev/router/)** - File-based routing for React Native
- **[Gluestack UI](https://ui.gluestack.io/)** - Universal UI component library

## 📁 Project Structure

```
expo-nextjs-monorepo/
├── apps/
│   ├── web/                 # Next.js 15 web application
│   │   ├── app/            # App Router pages
│   │   ├── api/            # API routes (including Better Auth backend)
│   │   ├── components/     # Web-specific components
│   │   └── package.json
│   └── mobile/             # Expo 53 React Native app
│       ├── app/            # File-based routing
│       │   └── api/        # API routes (including Better Auth backend for web)
│       ├── lib/            # Auth client config (Better Auth for mobile)
│       ├── components/     # Mobile-specific components
│       └── package.json
├── packages/
│   └── ui/                 # Shared UI component library
│       ├── src/
│       │   ├── components/ # Reusable components
│       │   └── lib/        # Utilities and styles
│       └── package.json
├── tooling/
│   ├── eslint/             # Shared ESLint configurations
│   ├── tailwind/           # Shared Tailwind configurations
│   └── typescript/         # Shared TypeScript configurations
├── package.json            # Root package.json
├── turbo.json              # Turborepo configuration
└── pnpm-workspace.yaml     # pnpm workspace configuration
```

> **Note:** Better Auth authentication logic and configuration can be found in:
> - `apps/web/app/api/auth/` (Next.js API routes for auth backend)
> - `apps/mobile/app/api/auth/` (Expo API routes for web auth)
> - `apps/mobile/lib/auth/auth-client.ts` (Better Auth client config for mobile)

## 🚀 Quick Start

> **Note:** Authentication is powered by [Better Auth](https://www.better-auth.com/) and works across both web and mobile (see details below).

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.0.0
- **Git**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd expo-nextjs-monorepo

# Install dependencies
pnpm install

# Set up environment variables (if needed)
cp .env.example .env
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start specific applications
pnpm dev --filter=web      # Web app only
pnpm dev --filter=mobile   # Mobile app only
```

### Building

```bash
# Build all applications and packages
pnpm build

# Build specific applications
pnpm build --filter=web
pnpm build --filter=mobile
```

## 📱 Applications

### Web App (Next.js 15)

**Features:**
- App Router with file-based routing
- Tailwind CSS v4 with JIT compilation
- shadcn/ui components
- TypeScript support
- Hot reload with Turbopack

**Development:**
```bash
cd apps/web
pnpm dev
```

**Build:**
```bash
pnpm build --filter=web
```

### Mobile App (Expo 53)

**Features:**
- Expo Router with file-based routing
- NativeWind v4 for styling
- Gluestack UI components
- Cross-platform (iOS, Android, Web)
- Hot reload and live reload

**Development:**
```bash
cd apps/mobile
pnpm dev
```

**Platform-specific:**
```bash
pnpm dev --filter=mobile -- --ios
pnpm dev --filter=mobile -- --android
pnpm dev --filter=mobile -- --web
```

## 🔐 Authentication (Better Auth)

This monorepo uses [Better Auth](https://www.better-auth.com/) for secure, production-ready authentication across both web (Next.js) and mobile (Expo).

### Overview

- **Web (Next.js):**  
  Better Auth is fully integrated via API routes. Sign in and sign up are supported out of the box.

- **Mobile (Expo):**  
  - For native mobile, the auth client is configured to point to your deployed or local Next.js API backend (using your computer’s LAN IP for local development).
  - Make sure your device and computer are on the same Wi-Fi network for local testing.
  - Expo API routes are available for web, but native mobile must use a real backend server.

- **Production Ready:**
  - The authentication flow is stable and ready for production use on both platforms.
  - Supports secure session management, social login, and more (see Better Auth docs).

### References

- [Better Auth Expo Integration Guide](https://www.better-auth.com/docs/integrations/expo)
- [Expo API Routes Limitations](https://docs.expo.dev/router/reference/api-routes/)

---

## 🎨 UI Components

### Shared UI Package

The `packages/ui` package contains reusable components that work across web and mobile:

```bash
# Add new components
cd packages/ui
pnpm ui:add button
pnpm ui:add card
pnpm ui:add input
```

**Usage:**
```tsx
import { Button } from '@acme/ui/components/button'
import { Card } from '@acme/ui/components/card'

// Use in both web and mobile apps
```

### Adding shadcn/ui Components

```bash
# In the ui package
cd packages/ui
pnpm ui:add <component-name>

# Example
pnpm ui:add button
pnpm ui:add card
pnpm ui:add input
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all applications in development mode |
| `pnpm build` | Build all applications and packages |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm clean` | Clean all build outputs and node_modules |

## 📦 Package Management

### Adding Dependencies

```bash
# Add to specific app/package
pnpm add <package> --filter=web
pnpm add <package> --filter=mobile
pnpm add <package> --filter=@acme/ui

# Add dev dependency
pnpm add -D <package> --filter=web
```

### Workspace Dependencies

Use `workspace:*` for internal package dependencies:

```json
{
  "dependencies": {
    "@acme/ui": "workspace:*"
  }
}
```

## 🎯 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature

# Develop across platforms
pnpm dev

# Test on both web and mobile
```

### 2. Adding New Components

```bash
# Add to shared UI package
cd packages/ui
pnpm ui:add <component-name>

# Use in apps
import { Component } from '@acme/ui/components/component'
```

### 3. Environment Variables

Each app can have its own environment variables:

- `apps/web/.env.local` - Web app environment variables
- `apps/mobile/.env` - Mobile app environment variables

## 🚀 Deployment

### Web App (Next.js)

**Vercel (Recommended):**
```bash
# Deploy to Vercel
vercel --prod
```

**Manual:**
```bash
pnpm build --filter=web
pnpm start --filter=web
```

### Mobile App (Expo)

**EAS Build (Recommended):**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for production
eas build --platform all
```

**Expo Publish:**
```bash
expo publish
```

## 🔍 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Change ports in package.json scripts
"dev": "next dev --port 3001"
```

**Metro bundler issues:**
```bash
# Clear Metro cache
pnpm dev --filter=mobile -- --clear
```

**Turborepo cache issues:**
```bash
# Clear Turborepo cache
pnpm turbo clean
```

## 📚 Documentation

- [Web App Documentation](./apps/web/README.md)
- [Mobile App Documentation](./apps/mobile/README.md)
- [UI Package Documentation](./packages/ui/README.md)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Turborepo](https://turborepo.com/) for the amazing build system
- [Expo](https://expo.dev/) for the React Native platform
- [Vercel](https://vercel.com/) for Next.js and deployment
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

## 🆘 Support

- 📖 [Documentation](./docs)
- 💬 [Discussions](https://github.com/your-username/expo-nextjs-monorepo/discussions)
- 🐛 [Issues](https://github.com/your-username/expo-nextjs-monorepo/issues)

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ using modern web technologies