# xAI Intelligent Power Core (IPC)
## Homeowner's Guide & Operations Manual

Welcome to the future of smart energy. The xAI Intelligent Power Core (IPC) has replaced your home's outdated, mechanical circuit breaker box with a fully solid-state, AI-driven energy orchestration hub. This manual will guide you through everyday operations, safety features, and optimizing your home's energy footprint.

![xAI IPC Panel](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/xai_ipc_panel.png)

---

## 1. Getting to Know Your Panel

Your physical xAI IPC panel is designed to be sleek and intuitive. Behind the tinted dark glass door, you will find your modular smart breakers and a central touchscreen hub.

![Smart Breaker Module](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/smart_breaker_module.png)

### The LED Status Rings
Each individual breaker module features a glowing circular LED ring, giving you instant visual feedback on the health of your home's circuits:
*   🟢 **Pulsing Green**: The circuit is active, healthy, and drawing power normally.
*   ⚪ **Dim White**: The circuit is active but currently drawing zero power (idle).
*   🔴 **Solid Red**: The circuit has tripped due to a safety fault (overcurrent, short-circuit, or arc fault). The physical LOTO safety slide may be engaged.
*   🟡 **Amber / Yellow**: The circuit is currently being throttled or managed by the Virtual Power Plant (VPP) to save you money during peak grid pricing.

### The Touchscreen Dashboard
The central LCD screen provides an at-a-glance summary of your home's real-time energy flow, showing grid import/export, solar generation, and battery storage levels.

---

## 2. The xAI Smart Dashboard App

While the physical panel is always accessible, the primary way to interact with your IPC is through the xAI mobile app.

![Smart Dashboard UI](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/smart_dashboard_ui.png)

### 2.1 Virtual Power Plant (VPP) Mode
By default, your IPC participates in the xAI Virtual Power Plant. 
*   **How it Works**: The IPC tracks wholesale electricity prices in real-time. When electricity is cheap, it charges your batteries and EV. When prices spike during peak hours, it automatically pauses heavy loads (like water heaters) and discharges your battery to power your home.
*   **Your Control**: You can always override the VPP. If you need your EV charged immediately regardless of price, simply toggle "Override VPP" in the app.

### 2.2 Remote Circuit Toggles
Forgot to turn off the oven or an iron? You can safely turn off specific circuits directly from your phone. Because the IPC uses solid-state switches, flipping a circuit on or off is completely silent and instantaneous.

---

## 3. Safety First: Resetting Tripped Breakers

If a circuit in your home experiences a fault (like plugging in too many space heaters, or a damaged wire causing an arc), the IPC will instantly shut off power to that circuit to prevent a fire.

> [!TIP]
> Because xAI breakers are solid-state and motorized, **you do not need to walk to the panel and physically flip a stiff plastic switch.**

### Steps to Reset a Breaker:
1.  **Check your phone**: You will receive an instant push notification explaining *exactly* why the breaker tripped (e.g., "Arc Fault Detected on Kitchen Outlets").
2.  **Fix the problem**: Unplug the faulty appliance or reduce the load on the circuit.
3.  **Reset via App**: Open the xAI Smart Dashboard app, navigate to the **Alerts** tab, and tap **Reset Circuit**. The panel will electronically re-engage the circuit.

### Physical Safety Lock-Out (LOTO)
If an electrician comes to work on your home, they need an absolute guarantee that a circuit cannot be accidentally turned on from your phone.

![LOTO Patent Drawing](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/loto_patent_drawing.png)

*   **To secure a circuit**: Slide the physical lock-out shutter (LOTO) down over the specific breaker module on the physical panel.
*   **What this does**: This physically disconnects the computer logic from the switch. The circuit is dead, and **cannot be overridden by the app**.

---

## 4. Expanding Your Ecosystem

The xAI IPC is the central brain of your home's energy ecosystem. It natively communicates with advanced hardware to maximize your independence from the grid.

### 4.1 Home Battery & Solar Integration
When paired with an xAI-compatible home battery, the IPC completely automates your energy storage.
![Residential Home Battery](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/residential_home_battery.png)
*   **Solar Excess**: During sunny days, excess solar power is routed directly to the battery instead of being sold back to the grid for pennies.
*   **Storm Watch**: If the IPC detects severe weather via internet forecasts, it will force-charge the battery to 100% to prepare for potential blackouts.

### 4.2 Tesla Optimus Charge Center & V2H
If you own a Tesla Optimus robot, the IPC manages its energy through the specialized docking center.
![Optimus Charge Center](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/optimus_charge_center.png)
*   **Bidirectional Power (V2H)**: When Optimus is docked during a power outage or peak pricing event, the IPC can seamlessly draw power *from* the robot's internal battery to keep your home's essential circuits running.
*   **Safety Interlock**: The physical Optimus V2H connector features proprietary high-voltage safety interlocks, ensuring the robotic connection is perfectly safe around children and pets.

---

> [!IMPORTANT]
> **Need Support?** If you experience persistent electrical faults or require hardware maintenance, do not attempt to open the main panel chassis. Contact xAI Grid Support directly via the Help tab in your mobile app.
