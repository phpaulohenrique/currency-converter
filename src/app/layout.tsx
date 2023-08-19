import { ReactNode } from 'react'
import './globals.css'

export const metadata = {
    title: 'PH Currency Converter',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
