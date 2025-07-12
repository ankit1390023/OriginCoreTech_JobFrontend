# UI Components

This folder contains reusable UI components that consolidate common styling patterns used throughout the application.

## Components

### Input
A reusable input component with consistent styling and error handling.

```jsx
import { Input } from '@/components/ui';

// Basic usage
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email" 
/>

// With error
<Input 
  label="Email" 
  type="email" 
  error="Invalid email address" 
  variant="error"
/>

// Different sizes
<Input size="small" label="Small Input" />
<Input size="default" label="Default Input" />
<Input size="large" label="Large Input" />

// Disabled state
<Input 
  label="Disabled Input" 
  variant="disabled" 
  disabled 
/>
```

### Label
A reusable label component for form fields.

```jsx
import { Label } from '@/components/ui';

<Label htmlFor="email" required>Email Address</Label>
<Label size="large">Large Label</Label>
```

### Button
A reusable button component with multiple variants and loading states.

```jsx
import { Button } from '@/components/ui';

// Primary button (default)
<Button>Submit</Button>

// Secondary button
<Button variant="secondary">Save</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Loading state
<Button loading>Loading...</Button>

// Different sizes
<Button size="small">Small</Button>
<Button size="default">Default</Button>
<Button size="large">Large</Button>
```

### Link
A reusable link component with consistent styling and variants.

```jsx
import { Link } from '@/components/ui';

// Default link
<Link to="/about">About Us</Link>

// Primary link (red theme)
<Link to="/signup" variant="primary">Sign Up</Link>

// Secondary link (blue theme)
<Link to="/help" variant="secondary">Help</Link>

// External link
<Link to="https://example.com" external>External Site</Link>

// With custom styling
<Link to="/profile" className="text-sm font-bold">Profile</Link>
```

### SuccessMessage
A reusable success message component with consistent styling and icons.

```jsx
import { SuccessMessage } from '@/components/ui';

// Basic usage
<SuccessMessage>Operation completed successfully!</SuccessMessage>

// Different sizes
<SuccessMessage size="small">Small success message</SuccessMessage>
<SuccessMessage size="default">Default success message</SuccessMessage>
<SuccessMessage size="large">Large success message</SuccessMessage>

// Without icon
<SuccessMessage showIcon={false}>Success without icon</SuccessMessage>

// With custom styling
<SuccessMessage className="mt-4">Custom styled success</SuccessMessage>
```

### ErrorMessage
A reusable error message component with consistent styling and icons.

```jsx
import { ErrorMessage } from '@/components/ui';

// Basic usage
<ErrorMessage>Something went wrong!</ErrorMessage>

// Different sizes
<ErrorMessage size="small">Small error message</ErrorMessage>
<ErrorMessage size="default">Default error message</ErrorMessage>
<ErrorMessage size="large">Large error message</ErrorMessage>

// Without icon
<ErrorMessage showIcon={false}>Error without icon</ErrorMessage>

// With custom styling
<ErrorMessage className="mt-4">Custom styled error</ErrorMessage>
```

### Textarea
A reusable textarea component for multi-line text inputs.

```jsx
import { Textarea } from '@/components/ui';

<Textarea 
  label="Description" 
  placeholder="Enter description" 
  rows={4}
/>

<Textarea 
  label="Bio" 
  error="Bio is required" 
  variant="error"
/>
```

### Select
A reusable select component for dropdown selections.

```jsx
import { Select } from '@/components/ui';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
];

<Select 
  label="Choose an option" 
  options={options} 
  placeholder="Select an option"
/>
```

## Styling Patterns

All components follow these consistent styling patterns:

- **Responsive**: Uses Tailwind's responsive prefixes (sm:, md:, lg:)
- **Focus states**: Consistent focus rings and border colors
- **Error states**: Red borders and backgrounds for error states
- **Disabled states**: Gray styling for disabled components
- **Transitions**: Smooth transitions for hover and focus states
- **Spacing**: Consistent margin and padding using Tailwind's spacing scale

## Usage Guidelines

1. **Import components**: Use the index file for clean imports
2. **Consistent sizing**: Use the size prop for different component sizes
3. **Error handling**: Use the error prop and variant="error" for error states
4. **Accessibility**: All components support proper accessibility attributes
5. **Customization**: Use the className prop for additional custom styling

## Migration

To migrate existing components to use these UI components:

1. Replace inline input styling with the `Input` component
2. Replace button styling with the `Button` component
3. Use the `Label` component for consistent label styling
4. Replace textarea elements with the `Textarea` component
5. Replace select elements with the `Select` component
6. Replace React Router Link with the `Link` component for consistent styling
7. Replace success/error message divs with `SuccessMessage` and `ErrorMessage` components 