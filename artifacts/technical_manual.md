# xAI Intelligent Power Core (IPC) 
## Technical Reference & Installation Manual (v1.0.0)

> [!WARNING]  
> **DANGER: HIGH VOLTAGE.** The xAI IPC panel handles lethal voltages (up to 480V AC / 380V DC). Installation, commissioning, and maintenance must only be performed by licensed and xAI-certified electrical technicians. Failure to follow safety protocols can result in severe injury, death, or catastrophic equipment damage.
>
> **ARC FLASH HAZARD.** Appropriate Personal Protective Equipment (PPE) per NFPA 70E category 2 or higher is required when the enclosure door is open while energized.

---

## 1. Scope & Regulatory Compliance

This manual covers the installation, operation, architecture, and maintenance of the xAI Intelligent Power Core (IPC) across all hardware profiles: Residential (R1+), Commercial (C1), and Datacenter (D2).

### 1.1 Certifications & Standards
The xAI IPC is engineered to meet or exceed the following international standards:
*   **UL 489 / CSA C22.2 No. 5:** Molded-Case Circuit Breakers, Molded-Case Switches, and Circuit-Breaker Enclosures (via Solid-State equivalents).
*   **UL 1699:** Standard for Arc-Fault Circuit Interrupters.
*   **UL 1998:** Software in Programmable Components (SIL 3 compliance for trip loops).
*   **IEC 60947-2:** Low-voltage switchgear and controlgear - Part 2: Circuit-breakers.
*   **IEEE 1547:** Interconnection and Interoperability of Distributed Energy Resources (VPP / Islanding).
*   **FCC Part 15 / ETSI EN 302 567:** 5G mmWave RF limits.

---

## 2. Product Specifications & Absolute Ratings

### 2.1 Environmental & Physical Ratings
| Parameter | Specification | Tolerance |
| :--- | :--- | :--- |
| **Operating Temperature** | -40°C to +85°C (-40°F to 185°F) | ±2°C |
| **Storage Temperature** | -50°C to +105°C | N/A |
| **Humidity Rating** | 5% to 95% Non-condensing | N/A |
| **Enclosure Protection** | NEMA 4X / IP66 | Washdown rated |
| **Vibration Resistance** | IEC 60068-2-6 (5g @ 10-500Hz) | Continuous |
| **Cooling Mechanism** | Passive convection via extruded aluminum | Zero active fans |

### 2.2 Electrical Ratings
| Parameter | Residential (R1+) | Commercial (C1) | Datacenter (D2) |
| :--- | :--- | :--- | :--- |
| **Input Voltage (Nominal)** | 120/240V Split-Phase AC | 480V 3-Phase AC Wye/Delta | 380V DC Dual Rail |
| **Input Voltage Range** | 90V - 264V AC | 380V - 528V AC | 260V - 420V DC |
| **Frequency** | 50/60 Hz Auto-Sensing | 50/60 Hz Auto-Sensing | N/A (DC) |
| **Max Main Bus Rating**| 200A Continuous | 600A Continuous | 1200A Continuous |
| **Short-Circuit Rating (Icu)**| 100 kA @ 240V | 250 kA @ 480V | 500 kA @ 380V DC |
| **Impulse Withstand (Uimp)**| 6 kV | 8 kV | 12 kV |
| **Dielectric Strength**| 2500 Vrms for 1 minute | 3000 Vrms for 1 minute | 4000 Vdc for 1 minute |

---

## 3. Solid-State Hardware Architecture Deep Dive

At the heart of the IPC are modular solid-state smart breakers. These modules execute microsecond-level fault interruption without relying on mechanical bimetallic thermal strips or magnetic coils.

![Smart Breaker Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/smart_breaker_blueprint.png)

### 3.1 The Silicon-Controlled Rectifier (SCR) Matrix
Power flow is modulated through parallel, high-current Silicon-Controlled Rectifiers (Thyristors). 
*   **Zero-Crossing Interlocking:** The onboard microcontroller monitors the AC voltage waveform and triggers the SCR gates *only* when the voltage crosses zero volts. This eliminates arc flash, contact pitting, and Electromagnetic Interference (EMI).
*   **Instantaneous Cut-off (di/dt response):** During a massive short-circuit event ($I > 8 \times I_{\text{nominal}}$), the gate drivers shut off current. While SCRs inherently wait for the next zero-crossing to fully turn off AC, the built-in IGCT (Integrated Gate-Commutated Thyristor) snubbers can force-commutate the channel in **$< 10\,\mu\text{s}$**, heavily mitigating magnetic stress on downstream wiring.
*   **dv/dt Immunity:** The R-C snubber circuit in parallel with the SCRs ensures a dv/dt immunity of $2000\,\text{V}/\mu\text{s}$, preventing false turn-ons from grid transients.

### 3.2 Processing Core (MCU & Edge TPU)
*   **Primary MCU:** ARM Cortex-M7 core running at 600MHz. It utilizes dual-channel DMA (Direct Memory Access) pipelines to ingest raw ADC data without CPU starvation.
*   **ADC Sampling Pipeline:** 24-bit ADCs sample voltage and current waveforms continuously at a $50\,\text{kHz}$ target rate.
*   **Edge TPU Coprocessor:** Executes the Non-Intrusive Load Monitoring (NILM) neural network. The model is quantized to INT8, achieving inference latencies of $< 2.5\,\text{ms}$. It extracts FFT harmonics (1st, 3rd, 5th, 7th, 9th, 11th, 13th, 15th) to classify appliance signatures and detect Arc Faults (AFCI) with >99.9% accuracy.

---

## 4. Physical Installation & Commissioning

> [!IMPORTANT]  
> All wiring must comply with the National Electrical Code (NEC) NFPA 70 or local equivalent. The IPC acts as Service Equipment (SE).

### 4.1 Mounting & Clearances
*   **Wall Studs:** The backplate features 16-inch on-center and 24-inch on-center keyhole slots for mounting directly to standard framing studs.
*   **Clearances:** Ensure 36 inches of front clearance and a minimum of 6 inches above/below the panel for convective heat sink airflow.
*   **Conduit Entry:** Entry zones are designated on the top, bottom, and bottom-rear knockouts. *Do not drill conduit holes into the side heat-sink fins.*

### 4.2 Terminal Torque & Wiring Specifications
Proper torque is critical to prevent micro-arcing and thermal runaway at the main lugs. Use an uninsulated torque wrench and apply conductive anti-oxidant compound to aluminum conductors.

| Terminal Type | Wire Gauge (AWG/kcmil) | Torque (in-lbs) | Torque (N·m) |
| :--- | :--- | :--- | :--- |
| **Main Feed Lugs (Al/Cu)** | 4/0 - 250 kcmil | 250 in-lbs | 28.2 N·m |
| **Neutral Bar** | 4 AWG - 1/0 | 50 in-lbs | 5.6 N·m |
| **Ground Bar** | 14 AWG - 4 AWG | 35 in-lbs | 4.0 N·m |
| **Smart Module Output**| 14 AWG - 8 AWG | 40 in-lbs | 4.5 N·m |

### 4.3 Boot-Up and POST (Power-On Self-Test)
Upon initial energization of the main breaker:
1.  The MCU boots from the secure ROM.
2.  POST checks memory integrity, Edge TPU communication, and verifying all LOTO switches are in the UP (active) position.
3.  The system will NOT energize downstream modules until the commissioning handshake is completed via the xAI Installer Mobile App over local Bluetooth LE.

---

## 5. Subsystem Integrations & Advanced Topologies

The IPC is environment-aware and features specialized hardware sub-routines depending on the active firmware profile.

### 5.1 Datacenter Redundancy: Static Transfer Switch (STS)
For 380V DC server grids, the IPC utilizes an ultra-fast STS sub-module to ensure 99.9999% uptime.
![Datacenter STS Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/datacenter_sts_blueprint.png)
*   **Failover Logic:** The core loop monitors redundant DC buses (RAIL_A and RAIL_B). If the primary rail sags below 320V DC, the system triggers a solid-state transfer.
*   **Transfer Speed:** The total sensing, logic, and actuation time is **0.15ms - 0.40ms**. This is well within the capacitive ride-through time of standard IT server power supplies (typically 20ms).
*   **Make-Before-Break Option:** The STS supports synchronized parallel bridging for 2ms during planned source transfers to eliminate all voltage drop.

### 5.2 Commercial Phase Selection Relay (PSR) Balancer
![PSR Balancer Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/psr_balancer_blueprint.png)
*   **Balancing Logic:** Monitors phase imbalance using the NEMA metric (`Max Deviation from Avg / Avg * 100`). If imbalance exceeds 15%, solid-state relays dynamically swap single-phase loads between lines to equalize current draw on the utility transformer.
*   **Break-Before-Make Safety:** During a phase swap, the active SCR is turned off at a current zero-crossing. The MCU enforces a strict **20ms de-ionization wait period** to prevent phase-to-phase short circuits before the target phase SCR is engaged at its respective voltage zero-crossing.

### 5.3 Residential: Bidirectional Optimus V2H
![Optimus V2H Connector Patent](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/optimus_v2h_connector_patent.png)
*   When a Tesla Optimus robot docks at the charging center, the IPC authenticates the proprietary connector. 
*   In a grid failure or peak-pricing event, the IPC enters grid-forming mode, isolates the utility feed, and commands the Optimus internal DC/DC converter to backfeed the home's 120/240V bus via the V2H pins.

---

## 6. Communications, Networking & Cybersecurity

To operate as a Virtual Power Plant (VPP), panels must connect to the local xAI P2P Mesh Network.

![Mesh Node Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/mesh_node_blueprint.png)

### 6.1 Mesh PHY Layer
*   **RF Configuration:** The external node operates on 5G mmWave frequencies, dynamically hopping between **27.5 GHz and 29.5 GHz**.
*   **EIRP:** Max effective isotropic radiated power is 43 dBm for penetrating building materials over short neighborhood hops (up to 500 meters line-of-sight).
*   **Antenna Placement:** Mount the external RF node vertically, clear of metallic siding.

### 6.2 Cybersecurity & Cryptography
*   **Authentication:** Network handshakes utilize Mutual TLS (mTLS) over `TLS_AES_256_GCM_SHA384`.
*   **Hardware Root of Trust:** Private keys are stored in a tamper-proof ATECC608A secure element.
*   **OTA Updates:** Firmware payloads are signed with ECDSA (P-256). The MCU utilizes A/B partition banks to ensure a fail-safe rollback if an update corrupts the primary boot sector.

---

## 7. Safety Interlocks: LOTO

While the IPC is software-defined, maintenance requires absolute physical safety guarantees.

![LOTO Patent Drawing](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/loto_patent_drawing.png)

> [!CAUTION]  
> Never rely solely on software toggles when servicing live downstream circuits. 

Slide the physical LOTO shutter down over the specific breaker module. This physically severs the $+5\text{V}$ logic supply to the gate driver optocouplers, rendering it hardware-impossible for the SCR matrix to close the circuit, bypassing all MCU states, remote APIs, and software hacks. A physical padlock can be routed through the LOTO eyelet.

---

## 8. Diagnostic Fault Codes & Troubleshooting

If the panel touchscreen displays an error, reference the codes below. Advanced telemetry can be pulled via the local RJ45 Maintenance Port (10.0.0.1) using the xAI Technician Dashboard.

| Code | Sub-Code | Fault Type | Technical Condition | Corrective Action |
| :--- | :--- | :--- | :--- | :--- |
| **E011** | 01 | Thermal Overload | Firmware bimetallic model $T > 85^\circ\text{C}$ | Allow bimetallic model to cool ($<45^\circ\text{C}$) before resetting. Verify load calculations. |
| **E011** | 02 | Contact Temp High | Hardware thermistor $T > 95^\circ\text{C}$ | Loose terminal lug. Re-torque to specification. |
| **E022** | 01 | AFCI Arc Fault | THD $> 35\%$, Inference Conf $> 80\%$ | Inspect downstream wiring for arcing. Replace damaged appliance cords. |
| **E033** | 01 | Instant Short | $I > 8 \times I_{\text{nominal}}$ in $10\mu\text{s}$ | Isolate dead short immediately. Megger wire insulation. Do not force reset. |
| **E044** | 01 | RF Node Disconnect | Signal loss $> 60\text{s}$ | Inspect exterior RF node alignment, clean antenna dome, verify PoE cable. |
| **E055** | 01 | Phase Swap Failed | Voltage detected during 20ms dead-time | PSR hardware fault. Contact xAI support for mainboard replacement. |
| **E066** | 01 | mTLS Cert Expired | Secure Enclave time drift | Connect panel to internet gateway for NTP sync and cert renewal. |
| **E099** | 01 | Kernel Panic | Watchdog timer reset | Internal MCU crash. Check for latest OTA firmware update. |
