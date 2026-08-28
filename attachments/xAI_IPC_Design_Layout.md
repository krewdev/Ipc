# xAI Intelligent Power Core (IPC) Software Design Layout

This document details the software design layout, module organization, class structures, and APIs for the xAI Intelligent Power Core (IPC) codebase.

---

## 1. Directory Structure

```text
xAI-IPC/
├── package.json               # Project dependencies and script configurations
├── tsconfig.json              # TypeScript compilation rules
├── docs/                      # Architectural designs, white papers, and schemas
└── src/
    ├── index.ts               # Application entry point
    ├── core/                  # Core power & sensing systems
    │   ├── index.ts           # Core controller and real-time loop orchestrator
    │   ├── nilm.ts            # Non-Intrusive Load Monitoring ML/DSP pipeline
    │   └── breaker.ts         # Motorized Breaker and SSR actuator interface
    ├── models/                # Hardware specializations
    │   ├── residential/
    │   │   ├── index.ts       # Residential model orchestrator (R1 & R1+)
    │   │   ├── matter_controller.ts  # Matter protocol bridge stubs
    │   │   └── home_assistant_bridge.ts # WebSockets telemetry to Home Assistant
    │   ├── commercial/
    │   │   ├── index.ts       # Commercial model orchestrator (C1 & C2)
    │   │   ├── phase_balancer.ts # 3-Phase load balancing algorithm
    │   │   └── bms_gateway.ts # BACnet/IP and Modbus gateway interfaces
    │   └── datacenter/
    │       ├── index.ts       # Data Center model orchestrator (D1 & D2)
    │       └── redundancy_manager.ts # Ultra-fast (<1ms) static transfer switch controller
    ├── mesh_network/
    │   └── index.ts           # mTLS handshakes, mmWave, and private 5G mesh
    └── api/
        └── index.ts           # API gateway, local WebSockets, VPP Simulator & OpenADR VEN
```

---

## 2. Module Interfaces & Class Specifications

### 2.1 Core Modules (`src/core/`)

#### `breaker.ts`
Manages the hardware actuation boundary. Defines the states, trip parameters, and overrides for branch-level switches.
*   **Interfaces**:
    *   `BreakerState`: Represents `OPEN`, `CLOSED`, `TRIPPED` status, telemetry (contact temperature, operational cycle count, contact resistance).
    *   `BreakerConfig`: Safety limits (max current, trip curves, LOTO status).
*   **Classes**:
    *   `MotorizedBreaker`: Direct interface for latching solenoids and SSR gate drivers.
        *   `toggle(state: 'OPEN' | 'CLOSED'): Promise<boolean>`
        *   `trip(reason: string): void` (Direct hardware solenoid trip pulse)
        *   `getTelemetry(): BreakerState`

#### `nilm.ts`
Non-Intrusive Load Monitoring engine. Processes incoming raw ADC samples to isolate and disaggregate electrical signatures.
*   **Interfaces**:
    *   `ADCSample`: Multi-channel current/voltage array with $24\text{-bit}$ values.
    *   `DeviceSignature`: Mathematical fingerprint (harmonics vector, inrush transient, V-I curve shape).
*   **Classes**:
    *   `NILMEngine`: Coordinates DSP and Edge TPU model inference.
        *   `processSamples(samples: ADCSample[]): void` (Harmonics extraction via FFT)
        *   `runInference(features: number[]): Promise<Map<string, number>>` (Invokes quantized Edge TPU model for disaggregated loads)

#### `index.ts` (Core Controller)
The primary real-time loop orchestrating safety, sensing, and actuation.
*   **Classes**:
    *   `CoreController`: Coordinates data pipeline.
        *   `startRealtimeLoop(): void` (Reads ADC, triggers safety checks, feeds NILM engine)
        *   `handleOvercurrent(channelId: string, current: number): void` (Executes Class 10/20 software trip)

---

### 2.2 Model Specializations (`src/models/`)

#### Residential (`src/models/residential/`)
Optimizes energy management for standard split-phase properties.
*   `ResidentialIPC` (`index.ts`): Orchestrates EV charger PWM rates, solar inverter exports, and home battery charging.
*   `HomeAssistantBridge` (`home_assistant_bridge.ts`): Publishes real-time circuit power to a local Home Assistant instance via WebSockets.
*   `MatterController` (`matter_controller.ts`): Triggers Matter load shedding events for smart appliances (e.g. telling water heater to shed load during peak pricing).

#### Commercial (`src/models/commercial/`)
Designed for 3-phase commercial grids with BMS and financial peak-demand shaving.
*   `CommercialIPC` (`index.ts`): Monitiors 15-minute average power windows to prevent peak demand charges.
*   `PhaseBalancer` (`phase_balancer.ts`): Calculates active and reactive power balance across phases (L1, L2, L3). Triggers dynamic circuit switching to balance loading.
*   `BmsGateway` (`bms_gateway.ts`): Map metrics to BACnet/IP objects and Modbus registers.

#### Data Center (`src/models/datacenter/`)
Enforces redundancy and low latency failovers in high-density installations.
*   `DataCenterIPC` (`index.ts`): Coordinates redundancy routines and predictive failure checks.
*   `RedundancyManager` (`redundancy_manager.ts`): Performs rapid static transfer switch failover loops between utility mains, UPS, and local generator feeds.

---

### 2.3 Networking & Communications (`src/mesh_network/`)
*   `MeshNetworkManager` (`index.ts`): Establishes mTLS tunnels, routes data through private local 5G meshes, and executes mmWave local high-throughput diagnostics transfers.

---

### 2.4 API, Simulator, & OpenADR VEN (`src/api/`)
*   `ApiGateway` (`index.ts`): Serves local dashboard WebSockets. Contains:
    *   `OpenAdrVEN`: Virtual End Node communicating with the utility provider.
    *   `VppSimulator`: Droop-frequency response calculations and wholesale price bidding optimizer.
