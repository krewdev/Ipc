# xAI Intelligent Power Core (IPC)
## Engineering Drawing Package — Master Index

> [!IMPORTANT]
> **CONTROLLED DOCUMENT.** All drawings subject to xAI Engineering Change Control. Do not reproduce without authorization. Verify latest revision before use in fabrication.

---

## Drawing Register

| DWG No. | Rev | Title | Type | Drawn By | Sheet |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DWG-001** | A | Smart Breaker Module — Internal Assembly Exploded View | Mechanical Assembly | J. Young | 1 of 1 |
| **SCH-002** | B | Solid-State Breaker Gate Driver & Zero-Crossing Circuit | Electrical Schematic | J. Young | 1 of 1 |
| **SYS-003** | A | Planetary Intelligence Grid — Network Topology | System Block Diagram | J. Young | 1 of 1 |
| **OL-004** | A | Multi-Environment Power Distribution One-Line Diagram | Power One-Line | J. Young | 1 of 1 |
| **DSP-005** | A | NILM Engine & Edge TPU Inference Pipeline — Signal Flow | DSP/Signal Flow | J. Young | 1 of 1 |
| **SCH-006** | A | Datacenter Dual-Rail 380V DC Static Transfer Switch (STS) | Power Electronics Schematic | J. Young | 1 of 1 |

---

## DWG-001 — Smart Breaker Module: Internal Assembly Exploded View

**Standard:** UL 1699 / IEC 60947-2  
**Type:** Mechanical Assembly / Exploded Isometric  
**Scale:** NTS (Not to Scale)

![Smart Breaker Exploded View](/Volumes/jaydrive/XAI IPC/public/schematics_and_diagrams/smart_breaker_exploded_view.png)

### Parts List Summary

| Item | Description | Specification |
| :--- | :--- | :--- |
| 1 | Aluminum Heat-Sink Cover | Extruded 6063-T5, 18 fins, passive convection |
| 2 | ARM Cortex-M7 + Edge TPU PCB | 4-layer HDI, 600MHz MCU + 4 TOPS TPU |
| 3 | Dual Optocoupler Isolation Layer | SFH615A (gate drive) + MOC3021 (solenoid) |
| 4 | SCR/Thyristor Parallel Matrix | 4× BT152-600R dual anti-parallel, 600V/12A |
| 5 | Zero-Crossing Detector Circuit | H11AA1 opto, 10kΩ bias resistors |
| 6 | 24-bit ADC Sampling Board | ADC121S021, 50kHz sampling, SPI output |
| 7 | Hall-Effect Current Sensor Clamp | ACS758, ±200A range, 50kHz BW |
| 8 | Contact Thermistor Array | NTC 10kΩ @ 25°C, β=3977K |
| 9 | LOTO Mechanical Shutter | Padlock eyelet, physically severs +5V gate logic |
| 10 | Bimetallic Shunt Resistor Assembly | 1mΩ Kelvin 4-wire, INA226 differential amp |
| 11 | Bottom Terminal Bus Bar (Cu) | 250 kcmil, **torque: 250 in-lbs / 28.2 N·m** |

---

## SCH-002 — Gate Driver & Zero-Crossing Circuit Schematic

**Standard:** IEC 60617 schematic symbols  
**Type:** Electrical Schematic  
**Voltage Class:** Up to 480V AC line side / 5V/12V logic side

![Gate Driver & Zero-Crossing Schematic](/Volumes/jaydrive/XAI IPC/public/schematics_and_diagrams/gate_driver_zero_crossing_schematic.png)

### Key Net Descriptions

| Net | Description | Connected Nodes |
| :--- | :--- | :--- |
| `ZC_INT` | Zero-crossing interrupt pulse | H11AA1 output → MCU PIN 4 (EXTI) |
| `GATE_DRV` | SCR gate trigger | MCU PIN 12 (PB5/TIM3_CH2) → SFH615A → SCR gate |
| `LATCH_DRV` | Solenoid latch actuator | MCU PIN 13 → MOC3021 → TRIAC → 12V solenoid |
| `I_SENSE_OUT` | Analog current waveform | ACS758 → differential amp → ADS1256 |
| `SHUNT_I2C` | Bimetallic shunt measurement | INA226 → I2C SDA/SCL → MCU |
| `THERM_ADC` | Contact temperature | 10kΩ NTC divider → ADC channel |

### Isolation Barrier Summary
- **Logic ↔ Line isolation:** 4kV RMS (SFH615A, MOC3021)
- **Measurement isolation:** 4kV RMS (ACS758 hall-effect core)
- **Power supply decoupling:** 100nF X7R on every power pin

---

## SYS-003 — Planetary Intelligence Grid: Network Topology

**Standard:** IEEE 802.1Q / 3GPP NR mmWave / Starlink API  
**Type:** System Block Diagram  
**Scope:** End-to-end from Memphis Colossus to residential edge node

![Planetary Grid Topology](/Volumes/jaydrive/XAI IPC/public/schematics_and_diagrams/planetary_grid_topology_diagram.png)

### Interface Summary

| Interface | Protocol | Data Rate | Latency |
| :--- | :--- | :--- | :--- |
| Colossus ↔ Starlink | OC-192 fiber | 100 Gbps | <1ms |
| Starlink ↔ Commercial Hub | Ku-band satellite | 12.5 Gbps | 20–40ms |
| Commercial ↔ Residential | 5G mmWave 27.5–29.5 GHz | 1–10 Gbps | <5ms |
| Residential IPC ↔ Optimus | V2H CAN-FD + 380V DC | 5 Mbps CAN-FD | <1ms |
| All Nodes ↔ Blockchain | EVM RPC / JSON-RPC | ~100 tx/s per node | 12s finality |

### Security Stack (All Interfaces)
- **Authentication:** mTLS — `TLS_AES_256_GCM_SHA384`
- **Hardware Root of Trust:** ATECC608A secure element (per node)
- **OTA Signing:** ECDSA P-256 with A/B partition rollback safety

---

## OL-004 — Multi-Environment Power Distribution One-Line Diagram

**Standard:** ANSI/IEEE C37, NFPA 70 NEC  
**Type:** Electrical Power One-Line Diagram  
**Utility Feed:** 480V 3-Phase 4-Wire Wye/Delta, 800A Service Entrance

![Power Distribution One-Line Diagram](/Volumes/jaydrive/XAI IPC/public/schematics_and_diagrams/power_oneline_diagram.png)

### Branch Summary

| Branch | Environment | Max Breaker | Bus Voltage | Key Loads |
| :--- | :--- | :--- | :--- | :--- |
| Left | Residential (R1+) | 200A | 120/240V Split-Phase | EV 50A, Battery 40A, PV 40A, V2H 50A, WH 30A |
| Center | Commercial (C1) | 600A | 480V 3Φ Wye | HVAC 40A 3Φ, Lighting 20A, Server UPS 100A 3Φ |
| Right | Datacenter (D2) | 1200A | 380V DC Dual-Rail | Rack PDU-A 150A, Rack PDU-B 150A |

### Short-Circuit Ratings (Icu)
- Residential: **100 kA @ 240V**
- Commercial: **250 kA @ 480V**
- Datacenter DC: **500 kA @ 380V DC**

---

## DSP-005 — NILM Engine & Edge TPU Inference Pipeline

**Standard:** IEEE 1459 (Power Quantities), IEC 62053 (Metering accuracy)  
**Type:** Signal Processing Flow Diagram  
**Sample Rate:** 50 kHz (Nyquist-limited to 25 kHz signal bandwidth)

![NILM Edge TPU Signal Flow](/Volumes/jaydrive/XAI IPC/public/schematics_and_diagrams/nilm_edge_tpu_signal_flow.png)

### Pipeline Latency Budget

| Stage | Component | Latency |
| :--- | :--- | :--- |
| Analog acquisition | AAF + sensor propagation | ~10 μs |
| ADC conversion | ADS1256 @ 50kSPS | 20 μs/sample |
| DMA block fill | 1024-sample ping-pong | ~20 ms (1 AC cycle) |
| FFT computation | 512-pt on Cortex-M7 | ~0.8 ms |
| Harmonic extraction | 8 harmonic bins | ~0.1 ms |
| Edge TPU inference | NILM CNN INT8 | **<2.5 ms** |
| Gate driver decision | Zero-crossing gate | <100 μs |
| **Total end-to-end** | — | **<25 ms** |

### Classifier Output Classes (7)
`EV_Charger` · `HVAC_Compressor` · `Water_Heater` · `Lighting` · `Arc_Fault_AFCI` · `PV_Inverter` · `Unknown_Load`

**AFCI Trip Threshold:** THD > 35% AND inference confidence > 80%  
**Accuracy:** >99.9% arc fault classification (internal validation dataset)

---

## SCH-006 — Datacenter Dual-Rail 380V DC Static Transfer Switch (STS)

**Standard:** IEC 62040-3 (UPS), IEEE 446 (Emergency Power)  
**Type:** Power Electronics Schematic  
**Topology:** Dual-IGBT bidirectional bridge, DSP-controlled

![Datacenter STS Dual-Rail Schematic](/Volumes/jaydrive/XAI IPC/public/schematics_and_diagrams/datacenter_sts_dual_rail_schematic.png)

### Key Component BOM

| Reference | Part Number | Description | Rating |
| :--- | :--- | :--- | :--- |
| Q1–Q4 | Infineon FZ1200R45KL4 | High-power IGBT module | 1200A / 4500V |
| Q5–Q8 | Infineon FZ1200R45KL4 | High-power IGBT module (backup rail) | 1200A / 4500V |
| U1, U2 | 2SP0115T | Isolated IGBT gate driver | 4kV isolation, 100ns t_on/off |
| F1, F2 | Class J DC Fuse | Input rail current-limiting fuse | 1500A DC |
| F3, F4 | Class J DC Fuse | Output PDU fuse | 150A DC |
| CT1, CT2 | Rogowski Coil | AC/DC current transducer | 200kHz BW, 0.1% accuracy |
| U3 | LEM DVL 500 | Differential voltage isolator | 500V, ±0.5% |
| DSP | TMS320F28379D | Real-time DSP controller | 200MHz, 200ns dead-time |
| C1, C2 | Electrolytic Cap Bank | DC bus ride-through capacitance | 10,000μF / 450V per rail |

### Transfer Timing Specification
| Event | Time |
| :--- | :--- |
| RAIL_A undervoltage detection (<320V DC) | 0 ms (reference) |
| DSP transfer decision + IGBT gate inhibit RAIL_A | +0.15 ms |
| RAIL_B IGBT gate enable (make) | +0.15 ms |
| Full RAIL_B conduction confirmed | +0.40 ms |
| **Total blackout window** | **≤0.40 ms** |

**Server PSU ride-through specification:** 20ms (typical)  
**Safety margin:** 50× ride-through headroom ✓

---

## Notes & Revision Control

> [!WARNING]
> All field modifications must be approved via xAI Engineering Change Order (ECO). Unauthorized modifications void UL certification and warranty.

> [!NOTE]
> Drawings are generated at **Not to Scale (NTS)**. For fabrication-critical dimensions, refer to the companion Mechanical CAD package (SolidWorks `.SLDPRT` files available under separate cover).

| Rev | Date | Drawn By | Author | Description |
| :--- | :--- | :--- | :--- | :--- |
| A | 2026-06-22 | J. Young | xAI Engineering | Initial release — 6 drawings |

