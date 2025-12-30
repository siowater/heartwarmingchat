import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // パステルカラーパレット（Gravityを参考）
        pastel: {
          pink: {
            50: '#FFF0F5',
            100: '#FFE4EC',
            200: '#FFD1E0',
            300: '#FFB8D1',
            400: '#FF9FC2',
            500: '#FF85B3',
          },
          purple: {
            50: '#F5F0FF',
            100: '#E9E0FF',
            200: '#D9CCFF',
            300: '#C4B3FF',
            400: '#AB94FF',
            500: '#8E75FF',
          },
          blue: {
            50: '#F0F5FF',
            100: '#E0EBFF',
            200: '#CCDDFF',
            300: '#B3CAFF',
            400: '#94B3FF',
            500: '#7098FF',
          },
          green: {
            50: '#F0FFF4',
            100: '#E0FFE9',
            200: '#CCFFD9',
            300: '#B3FFC4',
            400: '#94FFAB',
            500: '#70FF8E',
          },
          yellow: {
            50: '#FFFEF0',
            100: '#FFFDE0',
            200: '#FFFBCC',
            300: '#FFF9B3',
            400: '#FFF694',
            500: '#FFF270',
          },
        },
        // 低彩度のグレー
        warm: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      borderRadius: {
        // 丸みのあるパーツ
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        // 柔らかい影
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        // スムーズなアニメーション
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

