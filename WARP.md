# VoltEdge App

A Next.js application with Microsoft Office 365 design aesthetic and Firebase authentication.

---

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication (Email/Password)
- **Icons**: Lucide React

---

## Design Aesthetic: Microsoft Office 365

### Core Principles
1. **Clean & Minimal** - No unnecessary elements, focus on content
2. **Flat Design** - Minimal depth, subtle shadows only
3. **Professional** - Enterprise-ready appearance
4. **Consistent** - Uniform spacing, typography, and interactions
5. **Accessible** - High contrast, clear hierarchy, keyboard-friendly

---

## Color Palette

### Primary Colors
```css
--ms-blue: #0078d4          /* Primary brand color - navigation, buttons, accents */
--ms-blue-hover: #106ebe    /* Hover state for interactive elements */
--ms-gray: #f3f2f1          /* Background color for surfaces */
```

### Neutral Colors
```css
--white: #ffffff            /* Cards, inputs, elevated surfaces */
--gray-50: #fafafa          /* Subtle backgrounds */
--gray-100: #f5f5f5         /* Disabled backgrounds */
--gray-200: #e5e5e5         /* Borders, dividers */
--gray-400: #a3a3a3         /* Secondary text, placeholders */
--gray-600: #525252         /* Section headers, labels */
--gray-900: #171717         /* Primary text */
```

### Usage Guidelines
- **Navigation bars**: `--ms-blue` background, white text
- **Buttons**: `--ms-blue` background, white text, `--ms-blue-hover` on hover
- **Cards**: White background, `gray-200` border
- **Text**: `gray-900` for primary, `gray-600` for secondary, `gray-400` for tertiary
- **Backgrounds**: `--ms-gray` for page backgrounds

---

## Typography

### Font Stack
```css
font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Rationale**: Segoe UI for Windows/Microsoft aesthetic, with graceful fallbacks for macOS, Linux, and web.

### Type Scale
```css
/* Headers */
h1: 24px / 1.5rem / font-semibold     /* Page titles */
h2: 20px / 1.25rem / font-semibold    /* Section headers */
h3: 16px / 1rem / font-semibold       /* Card titles */

/* Body */
text-base: 14px / 0.875rem            /* Default body text */
text-sm: 12px / 0.75rem               /* Supporting text, labels */
text-xs: 11px / 0.6875rem             /* Captions, metadata */
```

### Font Weights
- **Regular (400)**: Body text
- **Medium (500)**: Emphasized text (not used often)
- **Semibold (600)**: Headers, buttons, important text
- **Bold (700)**: Rarely used, only for critical emphasis

---

## Spacing System

### Base Unit: 4px
All spacing should be multiples of 4px for consistency.

```css
/* Tailwind classes */
p-1: 4px      gap-1: 4px
p-2: 8px      gap-2: 8px
p-3: 12px     gap-3: 12px
p-4: 16px     gap-4: 16px
p-6: 24px     gap-6: 24px
p-8: 32px     gap-8: 32px
```

### Component Spacing
- **Navigation bar height**: 48px (h-12)
- **Status bar height**: 24px (h-6)
- **Sidebar width**: 320px (w-80)
- **Button padding**: 8px 16px (py-2 px-4)
- **Card padding**: 12px (p-3)
- **Section margins**: 16px (m-4)

---

## Shadows & Elevation

### Shadow Levels
```css
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)      /* Subtle cards */
shadow: 0 1px 3px rgba(0, 0, 0, 0.1)          /* Default cards */
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)       /* Elevated elements */
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)     /* Dropdowns, modals */
shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)     /* High elevation */
```

### Usage
- **Navigation/Status bars**: shadow-md
- **Cards**: shadow-sm
- **Hover states**: shadow-lg
- **Dropdowns/Popovers**: shadow-lg
- **Controls (zoom, map type)**: shadow-lg

---

## Border Radius

### Rounding Scale
```css
rounded-none: 0px          /* Sharp corners */
rounded-sm: 2px            /* Subtle rounding */
rounded: 4px               /* Default (cards, buttons) */
rounded-md: 6px            /* Moderate rounding */
rounded-lg: 8px            /* Pronounced rounding */
rounded-full: 9999px       /* Perfect circles (zoom controls) */
```

### Component Usage
- **Buttons**: `rounded` (4px)
- **Cards**: `rounded` (4px)
- **Inputs**: `rounded` (4px)
- **Dropdowns**: `rounded` (4px)
- **Icon buttons**: `rounded-full` (circular)

---

## Interactive States

### Hover Effects
```css
/* Buttons */
hover:bg-[#106ebe]         /* Blue buttons */
hover:bg-[#f3f2f1]         /* Neutral buttons */
hover:shadow-xl            /* Add depth on hover */

/* Cards */
hover:border-[#0078d4]     /* Blue border highlight */
hover:shadow-sm            /* Subtle lift */
```

### Transition Duration
```css
transition-colors          /* 150ms default for color changes */
transition-shadow          /* 150ms for shadow changes */
transition-all             /* Use sparingly for multiple properties */
```

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-[#0078d4]       /* Blue focus ring */
focus:ring-opacity-50
```

---

## UI Layout Philosophy

### Google Maps-Inspired Design
The map view uses a **fullscreen, overlay-based** approach inspired by Google Maps:

1. **Thin Left Sidebar** (64px collapsed, 256px expanded)
   - Always visible on the left edge
   - Collapsible with smooth animation
   - Contains navigation, settings, and user actions
   - Minimal visual weight to maximize map space

2. **Floating Search Overlay** (384px width)
   - Positioned top-left over the map
   - Transparent white background with blur (`bg-white/95 backdrop-blur-sm`)
   - Tabbed interface for different search modes
   - Collapsible to a single icon button

3. **Fullscreen Map Canvas**
   - Takes up entire viewport (`100vh`)
   - No traditional header or footer bars
   - Overlays float above the map content
   - Clean, distraction-free experience

4. **Floating Info Badges**
   - Results counter in top-right
   - Status indicators as needed
   - Semi-transparent with blur effect

---

## Component Patterns

### Left Sidebar (Google Maps Style)
```jsx
<aside className={`fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ${
  isExpanded ? 'w-64' : 'w-16'
}`}>
  {/* Header with logo/menu toggle */}
  <div className="h-16 border-b border-gray-200">
    {isExpanded ? 'VoltEdge' : <MenuIcon />}
  </div>
  
  {/* Navigation items */}
  <nav className="flex-1 py-4">
    {/* Icon-only or icon+label based on expanded state */}
  </nav>
  
  {/* Bottom actions */}
  <div className="border-t border-gray-200 py-4">
    {/* Settings, Profile, Logout */}
  </div>
</aside>
```

### Search Overlay (Tabbed Interface)
```jsx
<div className="fixed top-4 left-20 z-20 w-96">
  <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
    {/* Tabs Header */}
    <div className="flex items-center border-b border-gray-200">
      <button className="flex-1 py-3 px-4 text-sm font-medium">
        <Search /> Search
      </button>
      <button className="flex-1 py-3 px-4 text-sm font-medium">
        <Filter /> Filters
      </button>
      <button className="flex-1 py-3 px-4 text-sm font-medium">
        <MapPin /> Location
      </button>
    </div>
    
    {/* Tab Content */}
    <div className="p-4 max-h-[70vh] overflow-y-auto">
      {/* Dynamic content based on active tab */}
    </div>
    
    {/* Footer Actions */}
    <div className="p-4 border-t border-gray-200 bg-gray-50/50">
      <button className="bg-[#0078d4] text-white px-6 py-2 rounded-lg">
        Search
      </button>
    </div>
  </div>
</div>
```

### Fullscreen Map Container
```jsx
<div className="relative w-full h-screen overflow-hidden">
  {/* Left Sidebar */}
  <LeftSidebar />
  
  {/* Search Overlay */}
  <SearchOverlay />
  
  {/* Results Badge */}
  <div className="fixed top-4 right-4 z-20">
    <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2">
      {count} parcels
    </div>
  </div>
  
  {/* Map */}
  <div className="absolute inset-0">
    <MapView />
  </div>
</div>
```

### Cards
```jsx
<div className="bg-white border border-gray-200 rounded p-3 
                hover:border-[#0078d4] hover:shadow-sm 
                transition-all cursor-pointer">
  {/* Card content */}
</div>
```

### Buttons
```jsx
/* Primary Button */
<button className="bg-[#0078d4] hover:bg-[#106ebe] text-white 
                   py-2 px-4 rounded flex items-center gap-2 
                   transition-colors shadow-sm">

/* Secondary Button */
<button className="bg-white hover:bg-[#f3f2f1] text-gray-900 
                   py-2 px-4 rounded border border-gray-200 
                   transition-colors">

/* Icon Button */
<button className="hover:bg-[#106ebe] p-2 rounded transition-colors">
  <Icon size={20} />
</button>
```

### Status Bar
```jsx
<footer className="h-6 bg-[#0078d4] text-white flex items-center px-4 text-xs z-20">
  {/* Status items separated by | */}
</footer>
```

---

## Authentication

### Firebase Configuration
- **Provider**: Firebase Authentication
- **Method**: Email/Password only
- **Features**: 
  - Login
  - Password Reset
  - No account creation (admin-only)

### Authentication Flow
1. User lands on login page
2. Email/password input with validation
3. "Forgot Password" link for password reset
4. Upon successful login, redirect to main app
5. Protected routes check for authentication status

### Environment Variables
Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Project Structure

```
voltedge-app/
├── app/
│   ├── layout.js              # Root layout with font configuration
│   ├── page.js                # Login page (default)
│   ├── dashboard/
│   │   └── page.js            # Main dashboard (protected)
│   ├── map/
│   │   └── page.js            # Map view with Google Maps-like UI
│   └── globals.css            # Global styles with design tokens
├── components/
│   ├── auth/
│   │   ├── LoginForm.js       # Login form component
│   │   └── PasswordReset.js   # Password reset component
│   ├── layout/
│   │   ├── LeftSidebar.js     # Thin collapsible sidebar
│   │   └── StatusBar.js       # Bottom status bar
│   ├── map/
│   │   ├── MapView.js         # Google Maps integration
│   │   ├── SearchOverlay.js   # Tabbed search overlay
│   │   └── ParcelModal.js     # Parcel info window
│   │   ├── Navigation.js      # Top navigation bar
│   │   ├── Sidebar.js         # Sidebar component
│   │   └── StatusBar.js       # Bottom status bar
│   └── ui/
│       ├── Button.js          # Reusable button component
│       ├── Card.js            # Reusable card component
│       └── Input.js           # Reusable input component
├── lib/
│   ├── firebase.js            # Firebase configuration
│   └── auth.js                # Authentication utilities
├── context/
│   └── AuthContext.js         # Authentication context provider
└── WARP.md                    # This file
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Design Tokens (Tailwind Config)

The `tailwind.config.js` extends the default theme with Microsoft Office 365 colors:

```javascript
theme: {
  extend: {
    colors: {
      'ms-blue': '#0078d4',
      'ms-blue-hover': '#106ebe',
      'ms-gray': '#f3f2f1',
    },
    fontFamily: {
      sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 
             'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  },
}
```

---

## Notes

- Users cannot create accounts through the UI - account creation is admin-only
- All routes except the login page should be protected
- Firebase ID tokens should be managed securely
- Session persistence is handled by Firebase
- Design follows Microsoft Office 365 aesthetic strictly
