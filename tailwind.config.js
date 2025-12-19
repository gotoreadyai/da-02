import konstaConfig from 'konsta/config'

export default konstaConfig({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Fibonacci spacing: 1, 2, 3, 5, 8, 13, 21, 34
      spacing: {
        '13': '3.25rem',  // 52px
        '21': '5.25rem',  // 84px
        '34': '8.5rem',   // 136px
      },
      colors: {
        // Modern purple/magenta palette inspired by mockup
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main purple
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Accent colors
        accent: {
          pink: '#ec4899',
          magenta: '#d946ef',
          violet: '#8b5cf6',
        },
        // Surface colors for cards
        surface: {
          light: '#ffffff',
          muted: '#faf8ff',
          dark: '#1a1625',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 25px -5px rgba(139, 92, 246, 0.15)',
        'card-hover': '0 8px 30px -5px rgba(139, 92, 246, 0.25)',
        'glow': '0 0 40px rgba(168, 85, 247, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 50%, #f3e8ff 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
  konpiered: true,
})
