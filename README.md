# Cyber Scroll 👾

Cyber Scroll is a neon-soaked, infinite vertical platformer built for the Scrolly x Superteam UK Game Jam.

Jump, shoot, and survive the ascent. Collect crypto power-ups, defeat bosses, and upgrade your character!

## 🎮 About The Game

Cyber Scroll takes the addictive nature of vertical scrolling feeds and turns it into a high-octane arcade survival game.

### ✨ Features:

- **Infinite Verticality**: The higher you go, the harder it gets.
- **Boss Battles**: Every 5 levels, the game shifts to "Boss Mode"—gravity turns off, auto-fire turns on, and you must dodge lasers to defeat the enemy ship.
- **Character Selection**: Choose from distinct characters with unique attributes to fit your playstyle.
- **Crypto Power-ups**: Collect BITs, BYTES, CORES, and the legendary SOL orb to boost your score. Use special power-ups like **Shield** and **Magnet** to survive longer. 
- **Dynamic Environments**: Visuals shift as you progress, from Neon City to the Asteroid Belt and Galactic War zones, featuring beautiful parallax scrolling and atmospheric backgrounds.
- **Meta-Progression (Bit Shop)**: Spend your collected BITs in the Bit Shop for permanent upgrades between runs!
- **Immersive Audio**: Continuous background music with tight jumping and shooting sound effects. Includes a seamless Pause system that keeps the tunes flowing.
- **Mainnet Integrated Funding**: Connect your Solana wallet. Features a built-in funding flow with QR code and wallet address modal for on-chain interactions.
- **Mobile First & GPU Optimized**: Designed to look and feel great on mobile devices (touch/drag controls) with GPU-offloaded rendering for buttery-smooth performance. Also supports desktop play (arrow keys).

## 🚀 Tech Stack

- **Next.js & React**: For fast UI, routing, and state management.
- **TypeScript**: For type-safe game logic.
- **Solana Web3**: `@solana/web3.js` and Wallet Adapter for mainnet wallet integration.
- **Tailwind CSS & DaisyUI**: For rapid, responsive, and neon-themed styling.
- **Canvas API**: For high-performance rendering of game entities (particles, stars, player, enemies) and dynamic platforms (Crumbling, Slippery).
- **Zustand**: For global state management.

## 🛠️ Installation & Setup

Follow these steps to run the game locally on your machine.

### Prerequisites

- Node.js (Version 16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamuelOluwayomi/Cyber-Scroll.git
   cd cyber-scroll
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or yarn dev
   ```

4. **Play!**
   Open your browser to [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

## 📂 Project Structure

- `src/views/home/index.tsx`: Contains the core Game logic, Character Selection, Shop Overlay, and UI views.
- `package.json`: Core Next.js & Solana dependencies.
- `tailwind.config.js`: Styling configuration with DaisyUI setup.

## ☁️ Deployment (Vercel)

This project is optimized for deployment on Vercel utilizing Next.js.

1. Push your code to a GitHub Repository.
2. Log in to Vercel.
3. Click "Add New Project" and select your `cyber-scroll` repo.
4. Vercel will detect the framework (Next.js) automatically.
5. Click **Deploy**.

## 🏆 Hackathon Details

This game was created for the **Scrolly x Superteam UK No-Code Game Jam**.

- **Theme**: Scrolly Feed / Hypercasual
- **Goal**: Create an engaging mini-game using AI assistance.