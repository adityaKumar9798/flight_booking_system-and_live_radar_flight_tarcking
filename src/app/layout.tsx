import type { Metadata } from "next";
import "./globals.css";
import { BookingProvider } from "@/lib/booking-context";

export const metadata: Metadata = {
  title: "Aerosky | Book your flight now",
  description: "Travel with Aerosky to over 200 destinations worldwide.",
};

import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BookingProvider>{children}</BookingProvider>
        <ChatbotWidget />
      </body>
    </html>
  );
}
