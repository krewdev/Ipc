# xAI IPC Safety and Electrical Specifications

This document outlines the safety algorithms, breaker trip curves, zero-crossing solid-state switching parameters, and Lock-Out Tag-Out (LOTO) protocols integrated within the **xAI IPC** firmware.

---

## 1. Thermodynamic Bimetallic Trip Curve Model

Unlike traditional mechanical thermal-magnetic breakers, the solid-state bimetallic trip curve is calculated in software at **100Hz** to achieve precise calibration.

### Mathematical Model
The temperature of the virtual bimetallic strip is modeled as a first-order differential heat equation:

$$T_{new} = T_{old} + \left(0.05 \cdot I^2 \cdot R_{\text{element}} - k \cdot (T_{old} - T_{\text{ambient}})\right) \cdot dt$$

Where:
*   $I$: RMS Current flowing through the circuit (Amperes).
*   $R_{\text{element}}$: Internal resistance of the simulated bimetallic shunt ($0.0035\,\Omega$).
*   $k$: Convection cooling factor ($0.08 \times \text{tripCurveMultiplier}$, where `tripCurveMultiplier` defaults to $1.0$).
*   $T_{\text{ambient}}$: Ambient temperature inside the electrical panel enclosure (Default $25^\circ\text{C}$).
*   $dt$: Time step ($0.01\,\text{s}$ in a 100Hz polling rate).

### Trip Characteristics
*   **Maximum Trip Temperature**: $85^\circ\text{C}$. If the virtual strip temperature reaches this threshold, the motorized breaker triggers an automatic `OVERCURRENT_BIMETALLIC_TRIP` actuator trip command.
*   **Hysteresis Cool-down**: The bimetallic trip registers cannot be reset until the virtual temperature falls below $45^\circ\text{C}$.

---

## 2. Instantaneous Short-Circuit Protection

In addition to thermal curves, motorized solid-state relays monitor current waveforms for extreme transients (e.g. short circuits). 

*   **Trigger Threshold**: $I_{\text{peak}} \ge 8 \times I_{\text{nominal}}$.
*   **Trip Speed**: Bypasses mechanical motor actuators. Relays are commanded off via the solid-state gate driver in **$< 10\,\mu\text{s}$**.

---

## 3. Zero-Crossing SSR Actuation

Arces degrade breaker contacts and cause severe Electromagnetic Interference (EMI). To minimize arc energy, the motorized latch SSR gate driver uses zero-crossing switching.

```text
AC Voltage Waveform
      +170V |       _--_
            |     /      \
            |    /        \
        0V  |---|----------|-----------|--- (Zero-Crossing Point)
            |  /            \         /
            | /              \       /
      -170V |                 `--__--'
            |
            |<---- Turn ON/OFF commanded here ---->
```

*   **Methodology**: The system monitors the instantaneous voltage waveform. When a toggle open or close command is received, the actuator logic delays physical state execution until the AC voltage sinusoid crosses $0\,\text{V}$.
*   **Result**: Arc energy is reduced to near-zero, extending electrical contacts lifespan to over 100,000 operational cycles.

---

## 4. Arc-Fault Circuit Interrupter (AFCI) Safety Logic

Arc faults are high-frequency, chaotic discharges that thermal-magnetic breakers fail to detect, often leading to fires.

### Detection Heuristics
1.  **Waveform Analysis**: Calculates **Total Harmonic Distortion (THD)** using real-time FFT up to the 15th harmonic (harmonics list: `[1st, 3rd, 5th, 7th, 9th, 11th, 13th, 15th]`).
2.  **Inference Classification**: Edge TPU processes a 5-element signal feature vector:
    *   `[RMS Current, THD, PhaseShift, 3rdHarmonic, 5thHarmonic]`
3.  **Action**: If the calculated THD $> 35\%$ ($0.35$) and the inference output reports `Arcing Fault Signature` confidence level $\ge 80\%$ ($0.80$), the breaker triggers an instant software override trip with reason `AFCI_ARC_FAULT_TRIP`.

---

## 5. Lock-Out Tag-Out (LOTO) Protocol

![LOTO Patent Drawing](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/loto_patent_drawing.png)

To guarantee line safety during maintenance, the firmware implements a digital LOTO protocol.

*   **Lock Mode**: When LOTO is set to `true`, the motorized breaker actuator is electrically isolated. All remote API commands, schedules, or automatic VPP controllers are completely blocked from closing the contacts.
*   **Reset Procedure**: LOTO can only be unlocked by an authorized user setting the LOTO status to `false` via the local physical interface or authenticated secure APIs.

---

## 6. Problems Left to Solve & Future Roadmap

Real-world deployment of solid-state safety controllers requires addressing several critical edge cases:

### A. AFCI Nuisance Tripping Mitigation
*   **Problem**: High switching noise and transient harmonics from consumer appliances (e.g. vacuum cleaner brush motors, LED dimmers, switching power supplies) can easily cross the $35\%$ THD threshold and mimic arc-fault signatures.
*   **Roadmap Plan**: Integrate neural network model architectures (running on Edge TPU) trained with multi-class appliance signature databases. Implement classification temporal averaging to confirm arc fault continuity across multiple cycles before tripping, eliminating transient noise false alarms.

### B. Microsecond Short-Circuit Current Stress Coordination
*   **Problem**: While the SSR gate driver disables the contacts in $<10\,\mu\text{s}$, a massive short-circuit current transient ($I \ge 8 \times I_{\text{nominal}}$) creates immense magnetic and thermal stress on parallel thyristors and motorized solenoids.
*   **Roadmap Plan**: Implement transient snubbers and metal-oxide varistors (MOVs) in parallel with thyristors to clamp extreme overvoltages ($V > 600\,\text{V}$) during instant cut-off events, protecting the solid-state gates from puncture breakdown.

### C. Physical-Digital LOTO Interlock Integration
*   **Problem**: A digital flag `lotoStatus` is insecure against firmware exploits or corrupted MCU state registers, violating physical safety isolation standards.
*   **Roadmap Plan**: Develop a physical shunt interlock. A physical slide shutter on the breaker faceplate must physically disconnect logic supply power ($+5\,\text{V}$) to the gate driver optocouplers (SFH615A) and register a mechanical micro-switch state pin directly on a cryptographically protected secure enclave.

### D. Optimus Bidirectional V2H Connector Safety
*   **Problem**: High-amperage V2H charging via the Optimus Charge Center requires secure docking connections to prevent exposed high-voltage DC lines.
*   **Roadmap Plan**: Implement a secure mechanical interlock modeled after the proprietary Optimus V2H connector patent.
![Optimus V2H Connector Patent](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/optimus_v2h_connector_patent.png)
