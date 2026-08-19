# Smart Energy Hub

Build a modern, responsive React web application named Smart Energy Digital Twin.

The application is an AI-powered IoT Energy Monitoring & Optimization Dashboard that receives real-time electrical data from an ESP32 connected to a PZEM-004T V3 energy sensor through a Spring Boot backend.

The UI should look like a modern SaaS dashboard (similar to Grafana, Vercel Dashboard, or Azure Portal) with a clean, minimal design.

Use:

 React

 Tailwind CSS

 Recharts

 React Router

 Axios

 Lucide Icons

 Responsive Design

Theme:

 Light & Dark Mode

 Primary Color: Emerald Green

 Secondary: Blue

 White cards with subtle shadows

 Rounded corners

 Smooth animations

 Professional enterprise appearance

Pages

1. Login Page

Simple authentication UI

Fields

 Email

 Password

Buttons

 Login

 Forgot Password

After login redirect to Dashboard.

2. Dashboard

This is the main page.

Top Navbar

Display

 Project Logo

 Smart Energy Digital Twin

 Current Time

 Connected Device Status

 User Profile

KPI Cards

Display large cards showing

 Live Voltage (V)

 Live Current (A)

 Live Power (W)

 Total Energy (kWh)

 Frequency (Hz)

 Power Factor

Each card should contain

 Icon

 Current Value

 Small trend indicator

Live Charts

Using Recharts

Charts

 Voltage vs Time

 Current vs Time

 Power vs Time

 Energy Consumption vs Time

Update automatically every few seconds.

Digital Twin Panel

Create a dedicated card named

Digital Twin

Show

Device

Current Status

Running / Idle / Off

Current Runtime

Today's Energy

Today's Cost

Health Status

Synchronization Status

Last Updated Time

Animated energy flow indicator.

Energy Prediction Card

Show

Next Hour Prediction

Today's Prediction

Prediction Confidence

Small prediction graph

Electricity Bill Estimator

Display

Current Cost

Today's Cost

Estimated Monthly Bill

Progress bar showing

Current bill vs Budget

Peak Usage Analysis

Show

Peak Hour

Highest Power

Heatmap or Bar Chart

Daily Load Profile

Energy Waste Detection

Card showing

Waste Status

Normal

Warning

Critical

Reason

High Runtime

Unexpected Consumption

Standby Consumption

AI Recommendations

Display recommendation cards

Examples

Reduce runtime by 20%

Turn appliance OFF after use

Avoid usage during peak hours

Reduce monthly bill by ₹350

Use icon-based recommendation cards.

Smart Alerts

Alert Center

Show notifications

High Voltage

Low Voltage

Current Spike

Power Surge

High Daily Usage

Critical alerts should appear in red.

What-if Energy Simulation

Interactive simulator

Input

Current Runtime

Additional Runtime

Electricity Tariff

Button

Run Simulation

Output

Estimated Energy

Estimated Cost

Expected Savings

Comparison Chart

Before vs After

Historical Analytics Page

Charts

Hourly Usage

Daily Usage

Weekly Usage

Monthly Usage

Power Trend

Energy Trend

Bill Trend

Allow filtering by

Today

Week

Month

Custom Date Range

Device Page

Display

ESP32 Status

PZEM Status

Firmware Version

Wi-Fi Status

Signal Strength

Last Communication Time

Device Uptime

Settings Page

Allow users to configure

Electricity Tariff

Alert Thresholds

Voltage Limits

Current Limits

Theme

Profile

Components

Reusable components

Navbar

Sidebar

KPI Card

Chart Card

Alert Card

Recommendation Card

Simulation Card

Device Status Card

Prediction Card

Footer

Sidebar Menu

Dashboard

Analytics

Digital Twin

Simulation

Device

Alerts

Settings

Backend Integration

Prepare the frontend to consume REST APIs.

Create Axios services for:

GET /api/live

GET /api/history

GET /api/prediction

GET /api/bill

GET /api/alerts

GET /api/recommendations

POST /api/simulation

GET /api/device

Use mock JSON data initially so every feature is fully functional before backend integration.

Mock Data

Generate realistic live values such as

Voltage:
228–232 V

Current:
0–10 A

Power:
0–2000 W

Energy:
Increasing continuously

Frequency:
49.8–50.2 Hz

Power Factor:
0.85–1.00

Generate historical data for charts.

Animations

Use smooth transitions.

Animate

Cards

Charts

Numbers counting upward

Alerts

Energy Flow

Hover effects

Loading Skeletons

Responsive

Support

Desktop

Tablet

Mobile

Sidebar should collapse automatically on mobile.

UI Goal

The application should look like a production-ready AI Energy Management Platform rather than a student project, with a clean, modern, and intuitive user experience. It should include mock data, reusable components, and be structured for seamless integration with a Spring Boot backend in the future.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dc1ec581-4212-49d7-ad8f-12f955185b84).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
