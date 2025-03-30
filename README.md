# 🌦️ Weather Dashboard

![Weather Dashboard Banner](https://via.placeholder.com/1200x400.png?text=Weather+Dashboard)  
_Real-time weather insights at your fingertips!_

Welcome to **Weather Dashboard**, a stunning and interactive weather application built with modern web technologies. Whether you're checking the forecast for your current location or exploring weather conditions worldwide, this app delivers a seamless experience with a dynamic, weather-responsive design.

---

## ✨ Features

- **Real-Time Weather Data**: Get current weather conditions powered by the OpenWeather API.
- **5-Day & Hourly Forecasts**: Plan ahead with detailed 5-day and 24-hour weather forecasts.
- **Geolocation Support**: Automatically detect your location with a sleek permission prompt on startup.
- **Dynamic Themes**: The app’s design adapts to the weather—sunny days bring warm tones, rainy days shift to cool hues.
- **Responsive Layout**: Beautifully crafted with Tailwind CSS for desktops, tablets, and mobiles.
- **Type-Safe Code**: Built with TypeScript for robust and maintainable development.

---

## 🚀 Demo

Check out the live demo [here](#) (replace with your deployed URL if available).  
Here’s a sneak peek:

---

## 🛠️ Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: Strongly-typed JavaScript for better developer experience.
- **Tailwind CSS**: Utility-first CSS framework for a stunning, responsive UI.
- **OpenWeather API**: Reliable weather data source.
- **React Icons**: Weather-themed icons for an enhanced visual experience.

---

## 📦 Installation

Follow these steps to get the Weather Dashboard running locally:

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- An OpenWeather API key (get one [here](https://openweathermap.org/api))

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**<br/>
   Create a .env.local file in the root directory and add your API key:
   ```bash
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. **Update API Key in Code**<br/>
   Open app/page.tsx and replace the API_KEY constant with your key (or use the environment variable):

   ```bash
   const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "your_default_key";
   ```

5. **Run the Development Server**<br/>
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open http://localhost:3000 in your browser.

## 🎨 Usage

- **Initial Prompt**: React framework for server-side rendering and static site generation.
- **TypeScript**: Strongly-typed JavaScript for better developer experience.
- **Tailwind CSS**: Utility-first CSS framework for a stunning, responsive UI.
- **OpenWeather API**: Reliable weather data source.
- **React Icons**: Weather-themed icons for an enhanced visual experience.
