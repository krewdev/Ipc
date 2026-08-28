# xAI Intelligent Power Core (IPC)
## Technical White Paper & Systems Engineering Specifications

---

## 1. Executive Summary

The **xAI Intelligent Power Core (IPC)** is an active, software-defined energy distribution and safety management platform. Moving beyond passive thermal-magnetic safety switches, the IPC integrates high-frequency electrical sensing, edge-native AI accelerators (Coral Edge TPU), and dual-channel solid-state/motorized actuation. It transforms a facility's electrical distribution panel into a dynamic node capable of real-time load disaggregation, predictive demand management, and sub-millisecond local safety loops. The platform scales across split-phase Residential (R1/R1+), three-phase Commercial (C1/C2), and high-voltage DC Data Center (D1/D2) environments.

---

## 2. Hardware Architecture (The Physical Layer)

The physical architecture of the IPC merges standard electrical busbar configurations with advanced measurement, processing, and switching topologies.

```
       +-------------------------------------------------------------+
       |                        xAI IPC PANEL                        |
       |                                                             |
 Mains |   +------------------+                   +---------------+  |
======>|==>| Mains Sensing    |==================>| Mains Actuator|  |
 Power |   | (Revenue CT/PT)  |                   | (MCCB / Cont.)|  |
       |   +------------------+                   +---------------+  |
       |            |                                     ^          |
       |            v Analog Signals                      | Actuate  |
       |   +------------------+   Control Bus     +---------------+  |
       |   |  Analog Front    |==================>| Edge MCU      |  |
       |   |  End (ADS131M08) |                   | (STM32H7)     |  |
       |   +------------------+                   +---------------+  |
       |            |                                  |  ^          |
       |            v kHz SPI Data stream              v  | SPI/DMA  |
       |   +------------------+                   +---------------+  |
       |   |  Branch CT/PT    |                   | Edge AI       |  |
       |   |  Sensor Matrix   |                   | (Coral TPU)   |  |
       |   +------------------+                   +---------------+  |
       |            |                                                |
       |            +=========================================\      |
       |                                                      v      |
       |   +---------------------+                  +-------------+  |
       |   | SSR / Motor Breaker |=================>| Branch Load |  |
       |   +---------------------+                  +-------------+  |
       +-------------------------------------------------------------+
```

### 2.1 Continuous Sensing Topology
To achieve precise load profiling and safety detection, every branch circuit must be metered continuously.
*   **Sensor Selection**: Revenue-grade ($0.2\%$ accuracy class) current transformers (CTs) with nanocrystalline cores are matched with high-impedance potential transformers (PTs) on each branch circuit.
*   **Sensing Speed**: Analog-to-Digital Converters (ADCs) operate at a sampling rate of **$16\text{ kHz}$ to $50\text{ kHz}$** per channel. This allows the capture of high-order odd and even harmonics (up to the 100th harmonic) and rapid voltage/current transients during load step changes.
*   **ADC Front End**: Utilizes multi-channel, simultaneous-sampling Delta-Sigma ADCs (e.g., Texas Instruments ADS131M08 series) with $24\text{-bit}$ resolution to prevent phase delays between current and voltage vectors.

### 2.2 Actuation & Interruption Mechanisms
Safety-critical protection must remain physical and fail-safe while allowing software-defined remote actuation.
*   **Dual-Stage Switching**: Each circuit is equipped with a hybrid actuation mechanism:
    1.  **Solid-State Relay (SSR)**: High-speed silicon-controlled rectifiers (SCRs) or MOSFET matrices operate parallel to the mechanical contacts. They handle zero-voltage crossing switching to eliminate arcing and wear during operational cycling.
    2.  **Motorized Circuit Breaker (MCB)**: A bi-stable solenoid or miniature motor charges a spring-loaded latch mechanism. This allows digital open/close operations ($<80\text{ ms}$ reset time) and physical isolation.
*   **Fail-Safe Trip Mechanism**: The mechanical trip latch relies on an analog bimetallic strip or electromagnetic solenoid connected directly to the current line, independent of any digital processor or power supply. If the MCU loses power, the breaker functions as a standard thermal-magnetic protection device.

### 2.3 The Edge Compute Module
The control board resides within the low-voltage isolation bay of the panel:
*   **Microcontroller Unit (MCU)**: Dual-core ARM Cortex-M7/M4 running at $480\text{ MHz}$ (e.g., STM32H7 series) handles real-time ADC data streaming, safety-loop execution (arc fault detection, ground fault tracking), and motorized breaker signaling.
*   **Edge AI Accelerator**: Dedicated Google Coral Edge TPU ($4\text{ TOPS}$ at $2\text{ W}$) or an integrated NPU executes quantized TensorFlow Lite/Grok-lite models locally. The NPU processes the continuous high-frequency stream of current/voltage envelopes to perform disaggregation and anomaly detection.
*   **Communications**: Hardware-isolated interfaces:
    *   Dual Gigabit Ethernet (supporting IEEE 1588 Time Precision Protocol).
    *   Wi-Fi 6E (WPA3 Enterprise).
    *   Private LTE/5G Cellular module with SIM/eSIM backup.
    *   RS-485 / Modbus RTU / BACnet physical ports.

---

## 3. AI & Software Layer (The Smart Components)

The software architecture operates as a localized distributed operating system on the MCU/TPU stack.

### 3.1 Non-Intrusive Load Monitoring (NILM)
The core ML capability disaggregates composite electrical signals into distinct device usage profiles without sub-metering plugs.
*   **Signal Processing**: The raw current and voltage values are normalized. The system calculates the active power ($P$), reactive power ($Q$), and the Voltage-Current ($V\text{-}I$) trajectory during event-based changes.
*   **Feature Extraction**: Fast Fourier Transform (FFT) analysis extracts the harmonic distortion signature. Transient features, such as inrush peak amplitude and decay rate, are passed to the inference engine.
*   **Inference Model**: A localized 1D Convolutional Neural Network (CNN) combined with a Sequence-to-Sequence (Seq2Seq) neural network maps the active aggregate signal back to individual device models (e.g., HVAC compressor, EV inverter, heat pump).

### 3.2 Predictive Load Management
A localized user-behavior and thermodynamic predictor operates to optimize energy bills and system stress.
*   **Algorithms**: Online gradient boosted regression trees (GBRT) run on the NPU to predict hourly building load profiles $L(t)$ and temperature changes $T(t)$.
*   **Pre-cooling / Pre-heating**: By synchronizing with weather forecasts and Time-of-Use (ToU) utility rates, the system pre-cools thermal structures prior to peak pricing hours.
*   **Smart Throttling**: Non-critical loads, such as domestic hot water heaters or EV chargers, are modulated via PWM control or direct API commands (Matter/Home Assistant) to maintain total building draw below targeted threshold limits.

### 3.3 Dynamic Battery & Generator Extension
During a grid blackout event, the IPC dynamically updates breaker configurations:
*   **Blackout Transition**: Transition is handled within **$4\text{ ms}$ to $10\text{ ms}$** via solid-state switching.
*   **Virtual Subpanels**: Instead of rewiring a home to separate "essential" circuits, the software allows the user to partition the panel dynamically. If battery state-of-charge drops below $30\%$, the IPC drops high-draw loads (dryers, pool pumps, auxiliary heat) by sending toggle commands to the motorized branch breakers.
*   **Overload Prevention**: During generator start-up, the panel steps the loads in sequentially to prevent inrush-induced generator stall.

---

## 4. Product Line Distinctions

```
+------------------------------------------------------------------------------------+
|                         xAI IPC PRODUCT ARCHITECTURE                               |
+------------------------------------+-----------------------------------------------+
|             RESIDENTIAL            |                   COMMERCIAL                  |
+------------------------------------+-----------------------------------------------+
| - Split-Phase 120/240V             | - Three-Phase 208V / 480V                     |
| - 200A - 400A Service              | - 800A - 2000A Service                        |
| - Solar/BMS Integration (R1+)      | - BMS (BACnet/Modbus) Gateway                 |
| - Matter & Home Assistant API      | - 15-Minute Peak Demand Shaving               |
+------------------------------------+-----------------------------------------------+
```

### 4.1 Residential Models (R1 / R1+)
*   **IPC-R1 (Standard)**: 120/240V split-phase, up to 40 branch circuits. Rated for $200\text{A}$ or $400\text{A}$ mains. High-density design fits in standard stud bays.
*   **IPC-R1+ (Solar/Storage Plus)**: Integrated DC-coupled multiport busbar, permitting direct connection of solar PV arrays and 48V/high-voltage battery storage packs directly to the panel bus without requiring external inverters. Exposes a local WebSocket API for Home Assistant integration and supports the Matter smart home protocol.

### 4.2 Commercial Models (C1 / C2)
*   **IPC-C1 (Low Voltage)**: 120/208V three-phase, up to 60 branch circuits, $400\text{A}$ or $800\text{A}$ mains.
*   **IPC-C2 (High Capacity)**: 277/480V three-phase, up to $2000\text{A}$ mains. Exposes native BACnet/IP, BACnet MS/TP, and Modbus TCP protocols for connection to building automation systems.
*   **Peak Demand Shaving**: Commercial utilities charge based on the highest 15-minute demand window ($P_{\text{peak}}$). The commercial controller tracks cumulative energy in real-time, forecasting the current window's average power. If the forecast exceeds the set threshold, the panel autonomously sheds shed-capable circuits (HVAC stages, warehouse lighting, battery charging) to cap the demand charge.

### 4.3 Data Center Models (D1 / D2)
*   **IPC-D1 (AC Distribution)**: High-density AC power distribution unit (PDU) replacement, providing branch-level monitoring for up to 84 poles.
*   **IPC-D2 (HVDC Core)**: Direct high-voltage DC (380V DC) power distribution. Features high-voltage DC solid-state arc suppression circuits and rapid N+1 redundancy logic.
*   **Redundancy Manager**: Continuous synchronization between mains supply, central UPS units, and local battery storage. Failover switching occurs in **$<1\text{ ms}$** through static transfer switches (STS) managed by the local core.

---

## 5. Technical Deep Dives

### Deep Dive A: NILM Machine Learning Models & Feature Engineering

Non-Intrusive Load Monitoring (NILM) disaggregates the composite power signal $S(t) = P(t) + jQ(t)$ into individual appliance active profiles $s_i(t)$.

#### Feature Extraction
The raw $v(t)$ and $i(t)$ samples are windowed and analyzed using the following metrics:
1.  **V-I Trajectory**: The shape of the voltage-current relationship plotted in 2D space. The shape represents phase offsets, non-linear harmonic distortion, and reactive properties.
2.  **Harmonic Coefficients**: Fast Fourier Transform is applied to the current signal:
    $$I_k = \sum_{n=0}^{N-1} i[n] e^{-j 2\pi k n / N}$$
    The system extracts the magnitude and phase of the odd harmonics ($k = 3, 5, 7, \dots, 49$) and even harmonics ($k = 2, 4, 6, \dots, 20$). Non-linear loads like switched-mode power supplies (SMPS) exhibit distinct high-order harmonic ratios.
3.  **Active/Reactive Shifts**: Calculating the instantaneous real power $p(t)$ and apparent power $s(t)$ changes:
    $$\Delta P = \frac{1}{T}\int_{0}^T v(t)i(t)dt$$
    $$\Delta Q = \sqrt{S^2 - P^2}$$

#### Model Architecture
```
           Input Sequence (V, I Waveforms @ 16kHz)
                             |
                   [1D CNN Feature Extractor]
                             |
         +-------------------+-------------------+
         | (Local Features)                      | (Spectral Features)
         v                                       v
[Bi-LSTM Sequence Encoder]                 [FFT Harmonic Embeddings]
         |                                       |
         +-------------------+-------------------+
                             |
                     [Concatenation Layer]
                             |
               [Sequence-to-Sequence Decoder]
                             |
             Predicted Device States & Power (W)
```

1.  **1D CNN Feature Extractor**: Consists of three 1D convolutional layers with kernel sizes of 5, 3, and 3 respectively, extracting temporal local features from raw current/voltage sequences.
2.  **Bidirectional LSTM (Bi-LSTM)**: Captures the time-dependent sequence of load states. Encoder-decoder sequence-to-sequence structure outputs reconstructed power consumption curves for high-priority devices.
3.  **Quantization**: Trained models are compiled via the Edge TPU compiler, quantizing weights from float32 to int8 to enable real-time ($<20\text{ ms}$) local inference on the Coral TPU.

---

### Deep Dive B: Motorized Breaker & SSR Hardware Specifications

```
                     +---------------------------------------+
                     |         HYBRID ACTUATOR STAGE         |
                     |                                       |
                     |            +---------------+          |
             Mains   |      +====>|   Solenoid    |===+      |
            ========>|======|     |  Manual Trip  |   |======|===> Load
             Line    |      |     +---------------+   |      |     Line
                     |   +--+----+                 +--+----+ |
                     |   |  SSR  |                 |  MCB  | |
                     |   | (MOS) |                 | (Mech)| |
                     |   +-------+                 +-------+ |
                     +---------------------------------------+
                                ^                      ^
                                | Gate Control         | Motor Toggle
                                |                      |
                     +---------------------------------------+
                     |           Edge MCU Controller         |
                     +---------------------------------------+
```

To provide zero-arc operations combined with mechanical isolation, a hybrid actuator stage is utilized.

#### Actuation Specifications
*   **Operating Voltage**: $120\text{V}/240\text{V}/277\text{V}$ nominal control voltage.
*   **Actuation Speed**:
    *   **Solid-State Relay (SSR) Turn-On/Off**: **$<1\text{ ms}$** (typically timed to trigger within $50\mu\text{s}$ of the AC voltage zero-crossing).
    *   **Motorized Breaker Mechanical Toggle**: **$50\text{ ms}$ to $80\text{ ms}$** to transition from Open to Closed state.
*   **Physical Durability**: Motorized mechanisms are rated for a minimum of $50,000$ operations under full rated load, compared to standard thermal-magnetic breakers which are rated for $6,000$ to $10,000$ operations.

#### Control System & Trip Curves
*   **Solenoid Actuator**: A bi-stable latching solenoid requires a $12\text{V}$ DC pulse ($2.5\text{A}$ peak for $20\text{ms}$) to toggle state. A capacitor discharge circuit on the control board stores sufficient energy to trip the breaker even during a complete drop in incoming line voltage.
*   **Trip Curve Emulation**: The MCU monitors current in real-time. If it detects an overcurrent condition (e.g., $125\%$ of rated current for $>120$ seconds, or $300\%$ for $>2$ seconds), it triggers the solenoid actuator. It emulates standard **Class 10/20** thermal trip curves electronically.
*   **Mechanical Override**: An external manual toggle lever remains visible on the front of the breaker faceplate. Toggling the lever overrides all software signals, allowing manual disconnect and physical lockout/tagout (LOTO).

---

### Deep Dive C: Virtual Power Plant (VPP) Integration & OpenADR 2.0b

The xAI IPC runs a containerized OpenADR 2.0b client locally on the Linux-based communication module, acting as a **Virtual End Node (VEN)** communicating with utility **Virtual Top Nodes (VTNs)**.

```
+------------------+                        +------------------------------------+
|  Utility VTN     |                        |            xAI IPC VEN             |
| (OpenADR Server) |                        | (OpenADR Client / Controller Board) |
+------------------+                        +------------------------------------+
         |                                                     |
         | --- oadrDistributeEvent (Event Metadata / Power Target) -> |
         |                                                     |
         |                                          [Evaluate Local Constraints]
         |                                          [Check Battery SoC, EV State]
         |                                                     |
         | <--- oadrCreatedEvent (Opt-In / Opt-Out Status) --- |
         |                                                     |
         |                                          [Begin Event Interval]
         |                                          [Dynamic Throttling & SSR Open]
         |                                                     |
         | --- oadrPoll (Telemetry Request) -----------------> |
         |                                                     |
         | <--- oadrReportDistribute (Current Active/Reactive Power) - |
```

#### Event Telemetry Flow
1.  **oadrDistributeEvent**: The VTN broadcasts a demand response event containing event start time, duration, and target shedding tiers.
2.  **Local Constraint Checking**: The IPC core analyzes current building occupancy, indoor temperature, battery State-of-Charge (SoC), and critical circuit assignments.
3.  **oadrCreatedEvent**: The VEN sends an opt-in or opt-out response back to the VTN. If opted-in, the VEN commits to a reduction of $N\text{ kW}$ for the event duration.
4.  **Operational Phase**: During the event, the Core Controller modulates the PWM states of solar/storage battery output, limits EV charger currents, and toggles non-essential SSR switches.
5.  **Telemetry Reporting**: Every 10 seconds, the IPC reports real-time active power ($P$) and reactive power ($Q$) metrics via `oadrReportDistribute` payload.

#### Local VPP Simulator
An onboard simulator allows simulation of grid-services revenue:
*   **Frequency Response Simulation**: Simulates response to sub-second frequency drops on the grid. It acts by discharging battery banks in phase-locked frequency-droop mode:
    $$\Delta P = -f_{\text{droop}} \cdot (f - f_{\text{nominal}})$$
*   **Wholesale Price Tracking**: Fetches regional ISO real-time pricing (LMP) via secure REST API and runs optimization loops to verify battery arbitrage returns.

---

## 6. Code Compliance & Certifications

To ensure public safety and code approval, the IPC design enforces physical isolation boundaries and standards-compliant firmware loops.

### 6.1 Regulatory Standards
*   **UL 67 (Standard for Panelboards)**: Regulates the busbar spacings, short-circuit current ratings (up to $22\text{kA}$ or $65\text{kA}$ symmetrical RMS for commercial), thermal limits, and physical enclosure strength. The IPC maintains a separate isolated wiring duct for all low-voltage control lines.
*   **UL 916 (Standard for Energy Management Equipment)**: Governs the digital controller, confirming that automated control algorithms cannot override core thermal/overload safety parameters.
*   **UL 1699 (Standard for Arc-Fault Circuit Interrupters)**: Regulates the firmware arc-fault detection algorithms running on the Cortex-M7 core, requiring fast detection of series and parallel arcs ($<100\text{ ms}$ for $2.5\text{A}$ arcs).

### 6.2 National Electrical Code (NEC) Compliance
*   **NEC Article 705 (Interconnected Electric Power Production Sources)**: Governs grid-tied solar and battery feeding limits. The IPC-R1+ firmware monitors busbar current to prevent violating the $120\%$ rule (busbar rating limit for combined utility and generator/solar feed).
*   **NEC Article 220 (Branch-Circuit, Feeder, and Service Load Calculations)**: Governs maximum load calculations. The IPC integrates an **Automated Load Management System (ALMS)** compliant with NEC Section 220.70. This system dynamically limits charging currents or appliance operation to permit panel sizing below the mathematical sum of connected branch circuits, enabling rapid EV installation without utility supply upgrades.

---
