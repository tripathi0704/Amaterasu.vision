# Amaterasu.vision

Real-time interactive hand-tracking experience that brings iconic anime powers to life. By tracking your hand gestures through your webcam, it dynamically renders 3D Rasengan and Chidori effects directly onto your hands, accompanied by live sound effects and a futuristic Shinobi HUD.

---

## Hand Signs & Controls

| Gesture | Action | Power Generated |
| :--- | :--- | :--- |
| **Cross Hand Seal ➕ (Either Hand)** | Form a cross (+) with both index fingers (one vertical, one horizontal) | **👥 影分身 Kage Bunshin no Jutsu** (3-Way Live Stage with 2 Real-Time Clones + Anime Smoke Poofs & Audio!) |
| **Left Hand Open** 🖐️ | Open your left palm towards the camera | **🌀 3D Rasengan** (Swirling Chakra Sphere + Audio) |
| **Right Hand Open** ✋ | Open your right palm towards the camera | **⚡ 3D Chidori** (Electric Lightning Sparks + Audio) |
| **Both Hands Close** 💥 | Bring both active hands together | **💥 Jutsu Clash** (Collision Shockwave + Screen Flash) |
| **HUD Button 👥** | Click `KAGE BUNSHIN` in bottom controls | Manually toggle 3-Clone Stage on or off |

---

## Setup & Running on Any Computer

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A working webcam

---

### Option 1: 1-Click Automated Setup (Windows)

1. Double-click **`setup.bat`** (installs dependencies automatically and asks to launch).
2. Afterwards, you can launch anytime simply by double-clicking **`start.bat`**.

---

### Option 2: Manual Setup (Windows / macOS / Linux)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/tripathi0704/Amaterasu.vision.git
   cd Amaterasu.vision
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open the displayed local URL (typically `http://localhost:5173/`) in your browser.
5. Click **"START JUTSU EXPERIENCE"** and allow camera access to begin.
