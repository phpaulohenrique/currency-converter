import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

export const metadata = {
    title: 'BR Currency Converter',
}
const inter = Inter({ subsets: ['latin'], display: 'swap' })

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
            <body>{children}</body>
        </html>
    )
}
