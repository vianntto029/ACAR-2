---
name: Academic Glass
colors:
  surface: '#f8fafb'
  surface-dim: '#d8dadb'
  surface-bright: '#f8fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f5'
  surface-container: '#eceeef'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#41484d'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#eff1f2'
  outline: '#71787d'
  outline-variant: '#c1c7cd'
  surface-tint: '#2f647f'
  primary: '#255b76'
  on-primary: '#ffffff'
  primary-container: '#417490'
  on-primary-container: '#e6f4ff'
  inverse-primary: '#9bcdec'
  secondary: '#466275'
  on-secondary: '#ffffff'
  secondary-container: '#c6e4fa'
  on-secondary-container: '#4a6679'
  tertiary: '#445964'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c717d'
  on-tertiary-container: '#e3f4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#9bcdec'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#104c66'
  secondary-fixed: '#c9e6fd'
  secondary-fixed-dim: '#adcae0'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#2e4a5c'
  tertiary-fixed: '#cfe6f3'
  tertiary-fixed-dim: '#b4cad7'
  on-tertiary-fixed: '#071e28'
  on-tertiary-fixed-variant: '#354a54'
  background: '#f8fafb'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-xl:
    fontFamily: Open Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Open Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Open Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-desktop: 32px
  container-padding-mobile: 16px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style

This design system is built for an academic environment that demands high focus and professional reliability. The brand personality is **scholarly yet futuristic**, combining the structured clarity of Windows 11 with the fluid elegance of Apple’s macOS.

The aesthetic leans heavily into **Glassmorphism**, utilizing translucent layers to create a sense of depth and hierarchy without overwhelming the user. High corner radii soften the interface, making the academic experience feel more approachable and less rigid. The target audience includes educators and students who require an interface that minimizes cognitive load while providing high-touch visual feedback. The result is a clean, modern workspace that feels premium, light, and intellectually stimulating.

## Colors

The palette is derived from cool, slate blues and ethereal grays to maintain a "sober" and focused atmosphere. 

- **Primary & Secondary:** Used for active states, key navigation, and primary CTAs. The blues are desaturated to avoid visual fatigue during long study sessions.
- **Surface Strategy:** The system uses a "Mica" or "Acrylic" logic. The main background is a very soft blue-white (#F8FAFB), while containers use white with high transparency (60-80%) and backdrop blurs.
- **Academic Context:** 
    - **Teacher Dashboard:** Uses more of the darker slate blue (#417490) for high-importance data visualizations and management tools.
    - **Student Registration:** Utilizes the lighter, friendlier gradients (#ACC2CF to white) to reduce anxiety during onboarding.

## Typography

This design system utilizes **Open Sans** (as a high-quality alternative to Google Sans) for its exceptional readability and neutral, professional character.

- **Weight Scaling:** Headlines use Semi-Bold (600) to stand out against soft backgrounds without being aggressive. Body text is kept at Regular (400) for long-form academic reading.
- **Spacing:** Letter spacing is slightly tightened for display headings to mimic premium editorial styles, while body text maintains standard tracking for maximum accessibility.
- **Responsive Logic:** Large display titles scale down by 25% on mobile devices to ensure the academic content remains the focus and doesn't get pushed off-viewport.

## Layout & Spacing

The system follows a **Fixed-Fluid Hybrid Grid**. The content is centered in a maximum width of 1440px on desktop to prevent eye strain during research tasks.

- **Grid:** A 12-column grid is used for dashboards. For the Student Registration flow, a single-column "focused" layout (spanning the center 6 columns) is preferred to minimize distractions.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Teacher Dashboard Logic:** Higher density is permitted in the teacher view to display student progress tables and schedule blocks, using 16px internal padding for cards.
- **Student View Logic:** More whitespace (32px+ internal padding) is used to create a "breathable" environment for learning.

## Elevation & Depth

Depth is conveyed through **refraction and layering** rather than traditional black shadows.

- **Backdrop Blur:** All floating containers must have a `backdrop-filter: blur(20px)` and a background opacity of 70-85%.
- **Subtle Shadows:** Use "Ambient Shadows"—large blur radius (30px+), very low opacity (5-10%), and tinted with the primary blue (#417490) instead of pure black.
- **Glass Borders:** Containers are defined by a 1px solid border at 40% white. This creates a "rim light" effect that makes the card feel like a physical sheet of glass.
- **Layering:** The Sidebar (Navigation) sits on the base layer. Cards sit on Level 1. Modals and Dropdowns sit on Level 2 with increased blur intensity.

## Shapes

The shape language is consistently **Rounded (Level 2)** to align with modern OS aesthetics.

- **Buttons & Inputs:** Use a 0.5rem (8px) radius as the base.
- **Large Containers/Cards:** Use 1.5rem (24px) to create a soft, frame-like appearance for dashboards.
- **Selection Indicators:** Use pill-shaped (full radius) indicators for active menu items in the teacher sidebar to differentiate them from functional cards.

## Components

### Buttons
- **Primary:** Gradient fill (Primary Blue to Secondary Blue), white text, soft shadow.
- **Secondary:** Glass background, 1px white border, Primary Blue text.
- **Interaction:** On hover, the blur intensity increases and the card slightly lifts (Y-axis -2px).

### Input Fields
- Semi-transparent white backgrounds. 
- High-contrast 2px blue border only on `:focus`.
- Labels are always "Label-MD" weight, placed above the field.

### Academic Cards (Teacher Dashboard)
- **Student Progress Card:** Features a mini-sparkline chart and a glassmorphic "Status Chip."
- **Course Modules:** Large cards with a subtle blue gradient header and white body.

### Progress Indicators
- Smooth, rounded bars. Use a light blue background for the track and the Primary Blue for the progress fill, featuring a subtle "glow" effect.

### Selection States
- Checkboxes and Radios use a thick 2px border and a smooth "pop" animation when selected, filled with the Primary Blue.