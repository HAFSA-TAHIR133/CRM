
/** @type {import('tailwindcss').Config} */
export default{
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // 👈 Make sure this points to your components folder
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // 👈 Include this if you are using a /src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}