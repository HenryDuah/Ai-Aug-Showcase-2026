# AI Lab Guided Tour - Design Guidelines

## Design Approach
**Reference-Based: Modern Healthcare Innovation Platform**
Drawing inspiration from Apple's medical device presentations, modern hospital websites, and sleek SaaS product showcases. Prioritizing trust, clarity, and innovation through clean interfaces with strategic visual impact.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 210 100% 45% (Medical Blue - trust, professionalism)
- Background: 0 0% 100% (Pure white - clinical cleanliness)
- Surface: 210 20% 98% (Soft blue-tinted white for cards)
- Text Primary: 215 25% 15% (Deep blue-gray)
- Text Secondary: 215 15% 45%
- Border: 210 20% 90%

**Dark Mode:**
- Primary: 210 90% 60% (Brighter medical blue)
- Background: 220 15% 10% (Deep blue-black)
- Surface: 220 15% 15% (Elevated cards)
- Text Primary: 210 20% 95%
- Text Secondary: 210 15% 70%
- Border: 220 15% 25%

**Accent:** 190 70% 50% (Medical teal - sparingly for CTAs and highlights)

### B. Typography

**Fonts (via Google Fonts CDN):**
- Primary: 'Inter' - headings, UI elements (modern, professional)
- Secondary: 'Source Sans Pro' - body text (excellent readability)

**Hierarchy:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- Section Headers: text-3xl md:text-4xl, font-semibold
- Card Titles: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, font-normal
- Captions: text-sm, text-secondary

### C. Layout System

**Spacing Units:** Tailwind units 4, 6, 8, 12, 16, 20, 24 (consistent rhythm)

**Container Strategy:**
- Page wrapper: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Content sections: py-16 md:py-20 lg:py-24
- Card padding: p-6 md:p-8

**Grid Patterns:**
- Mobile (base): Single column (grid-cols-1)
- Tablet (md): 2 columns (md:grid-cols-2)
- Desktop (lg): 3 columns (lg:grid-cols-3)
- Gap: gap-6 md:gap-8

### D. Component Library

**Navigation Header:**
Sticky top navigation (sticky top-0 z-50) with backdrop blur (backdrop-blur-lg bg-white/90 dark:bg-gray-950/90), logo left, navigation center, CTA button right. Mobile: hamburger menu with slide-in drawer.

**Hero Section:**
Full-width hero (min-h-[85vh]) with large background image overlay. Content positioned center-left with max-w-3xl. Includes headline, description (max-w-2xl), dual CTA buttons (primary solid + secondary outline with backdrop-blur-md bg-white/20). Subtle gradient overlay from transparent to background color for text legibility.

**Product Cards:**
Elevated cards (bg-surface) with rounded-2xl, border, and subtle shadow (shadow-sm hover:shadow-lg transition). Card structure: Image container with aspect-ratio-square, gradient tag overlay (top-right absolute badge), title/description below image, icon-based feature list (grid-cols-2 gap-2), bottom-aligned CTA button. Hover: subtle lift transform and shadow enhancement.

**Section Layouts:**
- Innovation Showcase: 3-column grid (responsive) with category filters (pill buttons, horizontal scroll on mobile)
- Featured Technologies: 2-column alternating image-text blocks (bento box style)
- Research Timeline: Vertical timeline with milestone cards (staggered on desktop)
- Lab Information: Split layout - 60/40 content/stats panel

**Interactive Elements:**
- Filter Pills: rounded-full px-6 py-2, toggle states with primary color fill
- Category Badges: Small pills on cards, color-coded by category
- Load More Button: Centered, outline style, icon indicating expansion
- Quick Stats: Animated number counters in grid (3-4 columns)

**Footer:**
Multi-column (4 cols desktop, 2 tablet, 1 mobile) with lab info, navigation links, contact details, newsletter signup inline form. Dark surface background with lighter text.

### E. Images

**Hero Image:** Large, high-quality medical innovation lab photo - modern equipment, bright lighting, showcasing technology. Position: background cover with gradient overlay (from transparent top to 60% opacity at text area). Suggested: Wide-angle lab shot with researchers or cutting-edge equipment.

**Product Card Images:** Square format (1:1 aspect ratio). Each card needs: clean product shot on white/neutral background OR in-use scenario photo. Examples: Medical devices, research equipment, AI visualization screens, lab instrumentation. Consistent styling with soft shadows.

**Section Background Images:** Abstract medical imagery (DNA strands, neural networks, microscopy) used sparingly as subtle backgrounds (opacity-10) for visual interest without distraction.

**Trust Indicators:** Partner logos (grayscale, uniform sizing), certification badges, research publication thumbnails in dedicated sections.

**Image Treatment:** All images use rounded-xl borders, subtle shadow-sm, and slight scale on hover (hover:scale-105 transition-transform).

## Accessibility & Performance

- All images include descriptive alt text
- Focus states: 2px outline offset with primary color
- Keyboard navigation fully supported
- Icons from Heroicons (outline style for consistency)
- Lazy loading for card images below fold
- Dark mode toggle prominent in header
- Form inputs with clear labels and validation states

## Key Design Principles

1. **Trust First:** Medical context demands clarity - no decorative elements that distract
2. **Mobile Excellence:** Cards stack beautifully, touch targets 44px minimum
3. **Visual Hierarchy:** Clear content progression through sections with breathing room
4. **Professional Polish:** Consistent 8px spacing grid, aligned elements, balanced whitespace