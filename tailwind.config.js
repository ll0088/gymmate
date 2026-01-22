/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-teal': '#2C5F5D',
                'primary-teal-dark': '#1e4241',
                'bg-cream': '#FAF7F2',
                'text-dark': '#1A1C1E',
                'text-muted': '#6C727A',
                'tag-bg': '#EFEDE8',
                'red-accent': '#E53935',
                'gold': '#FFB300',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
