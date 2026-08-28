# xAI IPC Electrical Schematics & One-Line Diagrams

This document contains standard electrical one-line diagrams, solid-state breaker circuit block diagrams, and wiring schematics for the **xAI Intelligent Power Core (IPC)**.

---

## 1. System Electrical One-Line Diagram

The one-line diagram represents the power distribution topology across the three supported environments (Residential, Commercial, Datacenter) fed from the main utility grid.

```mermaid
graph TD
    %% Source grid
    subgraph Utility Grid
        UtilityFeed[Main Grid Feed 480V 3-Phase AC]
    end

    %% Main distribution panel
    subgraph Central IPC Panel
        MDB[Main Distribution Breaker]
    end
    UtilityFeed --> MDB

    %% Sub-buses
    subgraph Residential Subsystem R1+
        ResMain[Residential Main Breaker 100A]
        ResBus[120/240V Split-Phase Bus]
        PV[PV Solar Inverter]
        Bat[Home Battery Storage 40A]
        EV[EV Charger 50A]
        WH[Matter Water Heater 30A]
        Optimus[Optimus Charge Center 50A]

        ResMain --> ResBus
        PV -->|Solar Gen| ResBus
        Bat <-->|Bidirectional SoC| ResBus
        Optimus <-->|Bidirectional SoC| ResBus
        ResBus --> EV
        ResBus --> WH
    end
    MDB -->|Step Down XFMR 480V/240V| ResMain

    subgraph Commercial Subsystem C1
        CommMain[Commercial Main Breaker 300A]
        PSR[Phase Selection Relay Matrix]
        L1[Line 1 Bus]
        L2[Line 2 Bus]
        L3[Line 3 Bus]
        HVAC[HVAC Compressor Group 40A]
        Light[Warehouse Lighting 20A]
        UPS[Commercial Server UPS 100A]

        CommMain --> PSR
        PSR -->|Dynamic Balancing| L1
        PSR -->|Dynamic Balancing| L2
        PSR -->|Dynamic Balancing| L3
        L1 & L2 & L3 --> HVAC
        L1 & L2 --> Light
        L1 & L2 & L3 --> UPS
    end
    MDB --> CommMain

    subgraph Datacenter DC Grid D2
        DcMain[Datacenter Main Breaker 400A]
        Rect[380V DC Rectifier Bank]
        STS[Static Transfer Switch]
        RailA[Main DC Rail A]
        RailB[Backup DC Rail B / UPS]
        RackA_STS[Datacenter Rack A STS 150A]
        RackB_STS[Datacenter Rack B STS 150A]

        DcMain --> Rect
        Rect --> RailA
        UPS[UPS Battery Array] --> RailB
        RailA -->|Main Input| STS
        RailB -->|Standby Input| STS
        STS -->|Sub-ms Handoff| RackA_STS
        STS -->|Sub-ms Handoff| RackB_STS
    end
    MDB --> DcMain
```

![PSR Balancer Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/psr_balancer_blueprint.png)
![Datacenter STS Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/datacenter_sts_blueprint.png)

---

## 2. Solid-State Breaker Circuit Block Diagram

![Smart Breaker Blueprint](/Users/krewdev/Library/Mobile Documents/com~apple~CloudDocs/XAI IPC/public/smart_breaker_blueprint.png)

This schematic shows the internal components of a single **xAI Intelligent Solid-State Breaker**. It details the separation of control logic, digital sensors, zero-crossing gate triggers, and mechanical overrides.

```mermaid
graph LR
    subgraph Line Interface
        LineIn[Line AC Input]
        LineOut[Load AC Output]
    end

    subgraph Power Stage
        SSR[Solid-State Relay / Thyristor Parallel Matrix]
        Latch[Motorized Mechanical Solenoid Latch]
        Shunt[Bimetallic Shunt Element]
    end

    subgraph Sensing & Telemetry
        V_Sens[Voltage Transducer]
        I_Sens[Hall-Effect Current Sensor]
        T_Sens[Contact Temp Thermistor]
    end

    subgraph Logic Board
        MCU[Local Microcontroller]
        TPU[Quantized Edge TPU Processor]
        GateDrv[Zero-Crossing Gate Driver]
        LotoSw[LOTO Safe Lock State]
    end

    LineIn --> SSR
    SSR --> Latch
    Latch --> Shunt
    Shunt --> LineOut

    %% Telemetry flows
    Shunt -.->|Temperature| T_Sens
    LineIn -.->|Voltage Waveform| V_Sens
    LineOut -.->|Current Waveform| I_Sens

    V_Sens & I_Sens & T_Sens -->|ADCSample 24-bit| MCU
    MCU -->|Raw Waveform Features| TPU
    TPU -->|Load Signatures / Arc Conf| MCU

    %% Control loops
    MCU -->|Trigger/Trip Commands| GateDrv
    GateDrv -->|Zero-Crossing Pulses| SSR
    MCU -->|Actuator Latency Drive| Latch
    LotoSw -->|Hardware Lockout| MCU
```

---

## 3. Solid-State Breaker Wiring Schematic

The schematic below traces the wiring pathways connecting the microcontroller pins, isolating optocouplers, thyristor gates, and the zero-crossing detector.

```text
                                        ZERO-CROSSING SOLID-STATE BREAKER GATE DRIVER
                                       
              +5V -----------------------+-----------------------------+
                                         |                             |
                                        [R1]                          [R2]
                                         |                             |
  (MCU pin 12)  -----> [Optocoupler] ----+                             |
  GATE DRIVE            SFH615A          |                             |
  SIGNAL                                 v LED (Active Low)            |
                                         |                             v
                                         |                        +---------+
                                         |                        |  Zero-  |
                                         +----------------------->| Crossing|----> (MCU pin 4)
                                         |                        | Detector|      ZERO-X INTERRUPT
                                         v                        |  H11AA1 |
  (MCU pin 13)  -----> [Optocoupler] ----+                        +---------+
  RESET SOLENOID        MOC3021          |                             |
                                         +----+                        |
                                              |                        |
                                              v Gate Trigger           v
                                        +----------------------------------+
                                        |      Thyristor Matrix (SSR)      |
                     AC Line In ------->|  Dual SCR antiparallel contacts  |-------> Load Out
                                        +----------------------------------+
                                                         |
                                                 [Bimetallic Shunt]
                                                         |
                                                (Thermal Measurement)
                                                         v
                                                [ADC ADC121S021] ------> SPI Bus to MCU
```

### Wiring Legend:
*   **Gate Drive Signal**: Digital output from the MCU (buffered via SFH615A optocoupler) that triggers the gate of the SCRs.
*   **Zero-Crossing Detector**: The H11AA1 phototransistor outputs a low-pulse interrupt to the MCU exactly when the AC voltage waveform crosses the neutral zero line.
*   **Optocoupler Isolation**: Separates the $5\,\text{V}$ logic side from the $120\,\text{V}/240\,\text{V}$ line power to protect the processing hardware.
*   **Bimetallic Shunt**: Shunt resistor placed in series with the load out, monitored by a 12-bit SPI ADC to read contact temperature and current flow.
