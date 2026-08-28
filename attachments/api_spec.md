# xAI IPC Local REST & WebSockets API Specification

This document details the secure REST API endpoints, WebSocket event models, and BMS register mapping protocols supported by the **xAI IPC** platform gateway.

---

## 1. Local REST API Endpoints

The API Gateway runs locally on port `8080` by default.

### `GET /api/state`
Returns a complete hierarchical JSON snapshot of all panel subsystems, sensor readings, breaker states, VPP price events, and mesh network connections.
*   **Response Status**: `200 OK`
*   **Response Body**:
```json
{
  "timestamp": 1781222405000,
  "grid": {
    "frequencyHz": 59.982,
    "wholesalePricePerKwh": 0.224
  },
  "residential": {
    "batterySoC": 64.9,
    "solarGenerationWatts": 3200.0,
    "evChargePowerWatts": 9600.0,
    "optimusSoC": 85.0,
    "optimusDocked": true,
    "optimusChargePowerWatts": 3600.0,
    "logs": [
      "2026-06-11T20:10:00.000Z - [Optimizer] Throttled EV charger to 8A."
    ]
  },
  "commercial": {
    "averagePowerKw": 35.40,
    "peakDemandLimitKw": 45.0,
    "demandLimitBreached": false,
    "phaseAssignments": {
      "Commercial_HVAC_Group": "L3",
      "Commercial_Warehouse_Lighting": "L1"
    },
    "balancerLogs": [
      "2026-06-11T20:10:00.000Z - [PhaseBalancer] Imbalance detected: 16.2%. Running dynamic Phase Swapper..."
    ],
    "modbusRegisters": {
      "40001": 4800,
      "40002": 240,
      "40003": 140,
      "40004": 450,
      "40005": 1200,
      "40006": 354
    },
    "bacnetObjects": [
      {
        "id": "AI_VOLTAGE",
        "type": "AnalogInput",
        "name": "Grid RMS Voltage",
        "value": 480.0,
        "description": "RMS grid voltage measurement"
      }
    ]
  },
  "datacenter": {
    "railAVoltage": 380.0,
    "railBVoltage": 380.0,
    "activeSource": "RAIL_A",
    "lastTransferTimeMs": 0.315,
    "maintenanceWarnings": [],
    "logs": [
      "2026-06-11T20:10:00.000Z - [DatacenterIPC] Diagnostics warning dispatched: ..."
    ]
  },
  "mesh": {
    "carrierFreqGhz": 28.012,
    "packetLossRatePercent": 0.04,
    "nodes": [
      {
        "id": "Substation_Node_Alpha",
        "status": "CONNECTED",
        "signalStrengthDbm": -55,
        "frequencyGhz": 28.012,
        "ipAddress": "10.254.10.1"
      }
    ],
    "logs": [
      "2026-06-11T20:10:00.000Z - [mTLS] Cryptographic session established."
    ]
  },
  "breakers": [
    {
      "id": "Residential_EV_Charger",
      "status": "CLOSED",
      "tripReason": null,
      "current": 40.0,
      "voltage": 240.0,
      "contactTemperature": 32.4,
      "bimetallicTemperature": 35.8,
      "operationalCycleCount": 142,
      "contactResistance": 0.0015,
      "config": {
        "maxCurrent": 50,
        "tripCurveMultiplier": 1,
        "lotoStatus": false
      },
      "signature": {
        "thd": 0.015,
        "phaseShift": 0.098,
        "harmonics": [40.0, 0.42, 0.30, 0.15, 0.08, 0.04, 0.02, 0.01]
      },
      "classifications": {
        "EV Charger (Level 2)": 0.15,
        "Generic Household Appliance": 0.60
      }
    },
    {
      "id": "Residential_Optimus_Charge_Center",
      "status": "CLOSED",
      "tripReason": null,
      "current": 15.0,
      "voltage": 240.0,
      "contactTemperature": 28.5,
      "bimetallicTemperature": 30.1,
      "operationalCycleCount": 85,
      "contactResistance": 0.0015,
      "config": {
        "maxCurrent": 50,
        "tripCurveMultiplier": 1,
        "lotoStatus": false
      },
      "signature": {
        "thd": 0.008,
        "phaseShift": 0.021,
        "harmonics": [15.0, 0.12, 0.08, 0.04, 0.02, 0.01, 0.00, 0.00]
      },
      "classifications": {
        "Generic Household Appliance": 0.85
      }
    }
  ]
}
```

### `POST /api/control/toggle`
Manually commands the motorized breaker actuator to open or close contacts.
*   **Request Body**:
```json
{
  "id": "Residential_EV_Charger",
  "target": "OPEN"
}
```
*   **Response Status**: `200 OK`
*   **Response Body**: `{ "success": true }`

### `POST /api/control/reset`
Resets a tripped breaker latch back to `OPEN` (ready to be closed again).
*   **Request Body**: `{ "id": "Residential_EV_Charger" }`
*   **Response Body**: `{ "success": true }`

### `POST /api/control/loto`
Sets Lock-Out Tag-Out state on a breaker to prevent remote or mechanical closing.
*   **Request Body**:
```json
{
  "id": "Residential_EV_Charger",
  "active": true
}
```
*   **Response Body**: `{ "success": true }`

### `POST /api/anomaly/arc_fault`
Injects high-frequency current envelope noise onto the selected breaker channel to test the AFCI engine.
*   **Request Body**: `{ "id": "Residential_EV_Charger" }`

### `POST /api/anomaly/dc_rail_sag`
Simulates a sudden voltage drop on one of the DC buses to test the Static Transfer Switch.
*   **Request Body**: `{ "rail": "RAIL_A" }`

### `POST /api/anomaly/dc_rail_restore`
Restores DC rail voltages back to nominal 380V.
*   **Request Body**: `{}`

### `POST /api/anomaly/mesh_handshake`
Triggers an asynchronous mutual TLS (mTLS) cryptographic handshake simulation for a specific mesh network node.
*   **Request Body**: `{ "id": "Substation_Node_Alpha" }`
*   **Response Body**: `{ "success": true }`

---

## 2. WebSockets Connection

WS client connections are established at `ws://localhost:8080`.

### Downstream Snapshot (`type: SNAPSHOT`)
Pushed immediately upon client connection. Contains the complete state object structure.
```json
{
  "type": "SNAPSHOT",
  "data": { ... }
}
```

### Downstream Broadcast (`type: TELEMETRY_UPDATE`)
Pushed from server to all clients every **400ms**. Contains the complete state object structure.
```json
{
  "type": "TELEMETRY_UPDATE",
  "data": { ... }
}
```

### Upstream Commands
Clients can dispatch control messages directly over the socket connection. Responses are sent with `type: COMMAND_RESPONSE`.

*   **Toggle Breaker**:
    `{ "command": "toggle_breaker", "args": { "id": "Residential_EV_Charger", "target": "OPEN" } }`
*   **Reset Breaker**:
    `{ "command": "reset_breaker", "args": { "id": "Residential_EV_Charger" } }`
*   **Set LOTO Lock**:
    `{ "command": "set_loto", "args": { "id": "Residential_EV_Charger", "active": true } }`
*   **Inject Arc Fault Anomaly**:
    `{ "command": "inject_arc_fault", "args": { "id": "Residential_EV_Charger" } }`
*   **Inject DC Rail Sag Anomaly**:
    `{ "command": "inject_dc_rail_sag", "args": { "rail": "RAIL_A" } }`
*   **Restore DC Rails Anomaly**:
    `{ "command": "inject_dc_rail_restore", "args": {} }`
*   **Trigger Mesh Handshake**:
    `{ "command": "trigger_mesh_handshake", "args": { "id": "Substation_Node_Alpha" } }`

---

## 3. BMS Registers and Protocols

For integrations with industrial Building Management Systems, the gateway translates internal properties to standard Modbus RTU registers and BACnet Objects.

### Modbus Registers (16-bit Unsigned Holding Registers)

| Register | Parameter | Data Scale | Description |
| :--- | :--- | :--- | :--- |
| **40001** | Line RMS Voltage | Value * 10 | Line-to-line 3-Phase Voltage (e.g. 4800 = 480.0V) |
| **40002** | L1 Phase Current | Value * 10 | Combined current on Line 1 (Amperes) |
| **40003** | L2 Phase Current | Value * 10 | Combined current on Line 2 (Amperes) |
| **40004** | L3 Phase Current | Value * 10 | Combined current on Line 3 (Amperes) |
| **40005** | Line current imbalance | Value * 100 | Percent imbalance deviation (e.g. 1500 = 15.00%) |
| **40006** | 15-Min Peak Demand | Value * 10 | Current peak rolling demand (kW) |

### BACnet Objects (BMS integration points)

| Object ID | Object Type | Object Name | Engineering Units | Description |
| :--- | :--- | :--- | :--- | :--- |
| **AI_VOLTAGE** | Analog Input | Grid RMS Voltage | Volts (V AC) | RMS voltage of grid utility |
| **AI_L1_CURRENT** | Analog Input | L1 Phase Current | Amperes (A) | Current flow on Line 1 |
| **AI_L2_CURRENT** | Analog Input | L2 Phase Current | Amperes (A) | Current flow on Line 2 |
| **AI_L3_CURRENT** | Analog Input | L3 Phase Current | Amperes (A) | Current flow on Line 3 |
| **AI_IMBALANCE** | Analog Input | Current Imbalance | Percent (%) | Calculated NEMA imbalance rating |
| **AI_PEAK_DEMAND**| Analog Input | 15-min Peak Demand | Kilowatts (kW) | Maximum average load window |
| **BI_DEMAND_LIMIT**| Binary Input | Demand Shed Status | Boolean | True if peak threshold exceeded |
