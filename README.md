# Aerosky ✈️ - Flight Booking & Live Radar Tracking System

A modern, premium flight booking and live flight tracking web application built with Next.js, React, and Firebase. Aerosky provides a seamless user experience for booking flights, alongside an advanced real-time flight radar.

## ✨ Key Features

- **🛫 Flight Booking Engine**: Search, filter, and book flights with a beautiful, intuitive user interface.
- **📡 Live Flight Radar**: Track active flights on an interactive world map powered by Leaflet. Watch airplanes smoothly glide along their designated routes in real-time.
- **📊 Advanced Telemetry Panel**: Click on any flight to reveal a glassmorphic sliding panel displaying live telemetry data, including altitude, ground speed, exact coordinates, and heading.
- **🛠️ Admin Dashboard**: Manage custom flights and monitor system status through a dedicated administrative interface.
- **🔄 Hybrid Data Sources**: Seamlessly pulls data from a custom Firebase database or falls back to live real-world tracking data via the Aviationstack API.
- **📱 Fully Responsive**: A premium design that adapts perfectly to desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Vanilla CSS Modules (Glassmorphism, modern gradients, premium typography)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/)
- **External API**: [Aviationstack](https://aviationstack.com/) (Flight Tracking)

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adityaKumar9798/flight_booking_system-and_live_radar_flight_tarcking.git
   cd aerosky
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase configuration and Aviationstack API key:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   AVIATIONSTACK_API_KEY=your_aviationstack_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📸 Screenshots

*(Add screenshots of the beautiful booking flow and live radar map here!)*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
