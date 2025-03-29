# Perfect Year: Design System

## Brand Identity

### Colors

#### Primary Palette
- **Primary**: `#4263EB` - Royal Blue
- **Primary Light**: `#5C7CFA` - Soft Blue
- **Primary Dark**: `#3B5BDB` - Deep Blue

#### Secondary Palette
- **Secondary**: `#12B886` - Emerald
- **Secondary Light**: `#20C997` - Mint
- **Secondary Dark**: `#0CA678` - Forest

#### Neutral Palette
- **White**: `#FFFFFF`
- **Gray 100**: `#F8F9FA`
- **Gray 200**: `#E9ECEF`
- **Gray 300**: `#DEE2E6`
- **Gray 400**: `#CED4DA`
- **Gray 500**: `#ADB5BD`
- **Gray 600**: `#6C757D`
- **Gray 700**: `#495057`
- **Gray 800**: `#343A40`
- **Gray 900**: `#212529`
- **Black**: `#000000`

#### Feedback Colors
- **Success**: `#40C057` - Green
- **Info**: `#228BE6` - Blue
- **Warning**: `#FD7E14` - Orange
- **Danger**: `#FA5252` - Red

### Typography

#### Font Families
- **Heading**: Inter, sans-serif
- **Body**: Inter, sans-serif
- **Code**: Fira Code, monospace

#### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

#### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700

#### Line Heights
- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75

## Component Design

### Spacing System
- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

### Border Radius
- **None**: 0
- **Small**: 0.125rem (2px)
- **Default**: 0.25rem (4px)
- **Medium**: 0.375rem (6px)
- **Large**: 0.5rem (8px)
- **XL**: 0.75rem (12px)
- **2XL**: 1rem (16px)
- **Full**: 9999px

### Shadows
- **None**: none
- **Small**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **Default**: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- **Medium**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- **Large**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **XL**: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- **2XL**: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

## UI Components

### Buttons

#### Primary Button
- Background: Primary
- Text: White
- Hover: Primary Dark
- Active: Primary Dark + opacity
- Disabled: Gray 400
- Border Radius: Default
- Padding: 0.5rem 1rem
- Font Weight: Medium

#### Secondary Button
- Background: White
- Text: Primary
- Border: Primary
- Hover: Gray 100
- Active: Gray 200
- Disabled: Gray 200
- Border Radius: Default
- Padding: 0.5rem 1rem
- Font Weight: Medium

#### Tertiary Button
- Background: Transparent
- Text: Gray 700
- Hover: Gray 100
- Active: Gray 200
- Disabled: Gray 400
- Border Radius: Default
- Padding: 0.5rem 1rem
- Font Weight: Medium

#### Button Sizes
- **Small**: Padding 0.25rem 0.5rem, Text sm
- **Default**: Padding 0.5rem 1rem, Text base
- **Large**: Padding 0.75rem 1.5rem, Text lg

### Form Controls

#### Text Input
- Background: White
- Border: Gray 300
- Text: Gray 900
- Placeholder: Gray 500
- Focus: Border Primary, Shadow outline Primary with 20% opacity
- Invalid: Border Danger, Shadow outline Danger with 20% opacity
- Disabled: Background Gray 100, Text Gray 500
- Border Radius: Default
- Padding: 0.5rem 0.75rem

#### Checkbox and Radio
- Unchecked: Border Gray 300, Background White
- Checked: Border Primary, Background Primary
- Focus: Shadow outline Primary with 20% opacity
- Disabled: Background Gray 200, Border Gray 400

#### Select
- Similar to Text Input styles
- Dropdown indicator: Gray 600
- Selected item: Gray 900
- Options hover: Gray 100

#### Textarea
- Similar to Text Input styles
- Min-height: 100px

### Cards

#### Default Card
- Background: White
- Border: Gray 200
- Border Radius: Large
- Padding: 1.5rem
- Shadow: Small

#### Interactive Card
- Default Card +
- Hover: Shadow Medium, Border Gray 300
- Active: Shadow Default, Border Gray 400

#### Feature Card
- Default Card +
- Border-top: 4px solid Primary

### Modals and Dialogs

#### Modal
- Background: White
- Border Radius: Large
- Shadow: XL
- Backdrop: Black with 50% opacity
- Header: Bottom border Gray 200, Padding 1rem 1.5rem
- Body: Padding 1.5rem
- Footer: Top border Gray 200, Padding 1rem 1.5rem

### Navigation

#### Sidebar
- Background: White / Gray 900 (Dark mode)
- Active item: Background Gray 100 / Gray 800 (Dark mode)
- Active indicator: 3px Primary left border
- Item padding: 0.75rem 1rem
- Item spacing: 0.25rem
- Divider: Gray 200 / Gray 700 (Dark mode)

#### Tab Navigation
- Inactive: Text Gray 600, Border-bottom Gray 200
- Active: Text Primary, Border-bottom Primary (2px)
- Hover: Text Gray 800
- Padding: 0.75rem 1rem

#### Breadcrumbs
- Text: Gray 600
- Separator: Gray 400
- Current: Gray 900
- Hover: Gray 800

## Micro-interactions and Animations

### Transition Timing
- **Fast**: 100ms
- **Default**: 200ms
- **Slow**: 300ms
- **Veryslow**: 500ms

### Easing Functions
- **Default**: cubic-bezier(0.4, 0, 0.2, 1)
- **In**: cubic-bezier(0.4, 0, 1, 1)
- **Out**: cubic-bezier(0, 0, 0.2, 1)
- **In-Out**: cubic-bezier(0.4, 0, 0.2, 1)

### Button Interactions
- Hover: Scale 1.02, Background color change
- Active: Scale 0.98, Background color change
- Focus: Outline glow animation
- Loading: Spinner animation

### Form Interactions
- Input Focus: Border highlight animation
- Checkbox/Radio: Check mark animation
- Error Validation: Gentle shake animation
- Success Validation: Check mark animation

### Page Transitions
- Entry: Fade in + slight upward movement
- Exit: Fade out
- Between routes: Content crossfade

### List Animations
- Item Entry: Fade in + slight upward movement, staggered
- Item Exit: Fade out + slight downward movement
- Reordering: Smooth position change

### Notification/Toast Animations
- Entry: Slide in + fade
- Exit: Slide out + fade
- Action: Subtle pulse effect

## Accessibility

### Color Contrast
- Text on backgrounds must meet WCAG 2.1 AA standard (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have sufficient contrast to be distinguishable

### Focus States
- All interactive elements must have visible focus states
- Focus indicators should be high contrast and visible in both light and dark modes

### Keyboard Navigation
- All interactive elements must be accessible via keyboard
- Logical tab order maintained throughout the application
- Keyboard shortcuts for common actions

### Screen Readers
- Semantic HTML elements used appropriately
- ARIA labels for complex components
- Dynamic content changes announced appropriately

## Dark Mode Design

### Dark Mode Colors
- **Background Base**: `#121212`
- **Surface 1**: `#1E1E1E`
- **Surface 2**: `#2C2C2C`
- **Surface 3**: `#383838`
- **Primary**: `#5C7CFA` (brightened from light mode)
- **Secondary**: `#20C997` (brightened from light mode)
- **Text Primary**: `#E9ECEF`
- **Text Secondary**: `#ADB5BD`
- **Border**: `#383838`

### Dark Mode Adjustments
- Reduced shadow intensity
- Increased component contrast
- Slightly larger focus indicators
- Adjusted icon and illustration colors

## Responsive Design

### Breakpoints
- **xs**: 0px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Grid System
- 12-column grid
- Gutters: 1rem (default)
- Container max widths:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Responsive Typography
- Fluid typography scaling between breakpoints
- Reduced heading sizes on mobile
- Increased line height on small screens

### Touch Targets
- Minimum 44x44px for all interactive elements on touch devices
- Increased spacing between interactive elements on mobile

## Loading and Empty States

### Loading States
- Skeleton screens for content loading
- Pulsing animation for component loading
- Spinner for action loading (buttons, etc.)

### Empty States
- Illustration-based empty states
- Helpful message explaining the empty state
- Clear call to action when appropriate 