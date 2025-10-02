import type { Config } from "tailwindcss";


export default {
darkMode: ["class"],
content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
theme: {
extend: {
colors: {
brand: {
primary: "#0042a1",
accent: "#f0558b"
}
},
borderRadius: { xl: "1rem", "2xl": "1.5rem" }
}
},
plugins: []
} satisfies Config;