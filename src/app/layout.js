import './globals.css';
import Footer from '../components/Footer';

export const metadata = {
  title: 'राजकीय सामान्य चिकित्सालय, पोकरण | Smart Hospital OS',
  description: 'Government Hospital Pokaran - Smart Queue & Hospital Management System powered by Webnexa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" translate="no" className="notranslate" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body 
        className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col justify-between" 
        suppressHydrationWarning={true}
      >
        <div className="flex-grow" suppressHydrationWarning={true}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}