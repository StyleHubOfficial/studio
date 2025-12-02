# **App Name**: AI News Access

## Core Features:

- Login: Users can log in using email/password, phone number, Google, or Apple accounts.
- Sign-up: New users can create accounts and select their role (regular user or school club member).
- Role-based access: Different UI based on the user's role (admin, regular user, Sunrise Club member).
- Sunrise Club signup: Support for Sunrise Club members to sign up using assigned IDs, validated against Firebase.
- User profile: User profiles are stored in Firestore with preferences and role information.
- Admin account setup: Functionality to set custom claims to define admin privileges.
- Initial personalized content: Generative AI suggests news and topics that the user might like, based on provided profile data, while Auth state resolves or network calls proceed.

## Style Guidelines:

- Primary color: Deep navy (#0B1220) for a professional background.
- Accent color: Electric cyan/teal (#00E5A8) for highlights and interactive elements.
- Secondary accent: Muted gold for pins and important badges.
- Headline font: 'Space Grotesk', a proportional sans-serif with a computerized, techy, scientific feel, is for headlines.
- Body font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- Full viewport split layout on desktop: left panel for branding, right panel for the authentication card; single-column layout on mobile.
- Framer Motion for fade+slide card entrance, subtle scale on focus for input, and micro-interactions.