import "./globals.css";

export const metadata = {
    title: "TinyLink - URL Shortener",
    description: "Shorten URLs, track clicks, manage links",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
