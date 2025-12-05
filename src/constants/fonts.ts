import { Manrope, STIX_Two_Text } from "next/font/google";

export const base = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-base",
    display: "swap",
});

export const heading = STIX_Two_Text({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-heading",
    display: "swap",
});

// Subheading keeps the serif accent but falls back to heading font for consistency
export const subheading = heading;