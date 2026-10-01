# Amaterasu.vision

Real-time interactive hand-tracking experience that brings iconic anime powers to life. By tracking your hand gestures through your webcam, it dynamically renders 3D Rasengan and Chidori effects directly onto your hands, accompanied by live sound effects and a futuristic Shinobi HUD.

---

## Hand Signs & Controls

| Gesture | Action | Power Generated |
| :--- | :--- | :--- |
| **Left Hand Open** 🖐️ | Open your left palm towards the camera | **🌀 3D Rasengan** (Swirling Chakra Sphere + Audio) |
| **Right Hand Open** ✋ | Open your right palm towards the camera | **⚡ 3D Chidori** (Electric Lightning Sparks + Audio) |
| **Both Hands Close** 💥 | Bring both active hands together | **💥 Jutsu Clash** (Collision Shockwave + Screen Flash) |

---

## Setup & Running on Any Computer

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A working webcam

### Option 1: 1-Click Launch (Windows)
Simply double-click the **`start.bat`** file in the project folder. It will install dependencies if needed, start the local server, and open your browser automatically.

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
