export interface PrototypeImage {
  id: string;
  title: string;
  partNo: string;
  category: "Panel" | "Component" | "System";
  segment: string;
  description: string;
  src: string;
  aspect: "portrait" | "landscape";
}

export interface ShareCard {
  id: string;
  title: string;
  spec: string;
  size: string;
  ratio: string;
  src: string;
  usedAs: string;
}

export const PROTOTYPES: PrototypeImage[] = [
  {
    id: "res-panel",
    title: "Residential Power Node",
    partNo: "IPC-R1+",
    category: "Panel",
    segment: "Residential",
    description:
      "Matte white wall-mount chassis with vertical heatsink, glass HMI energy OS, modular solid-state breakers, Edge AI compute halo, and multiport sensor I/O.",
    src: "/prototypes/residential-panel.jpg",
    aspect: "portrait",
  },
  {
    id: "res-interior",
    title: "Residential Interior",
    partNo: "IPC-R1+ / Interior",
    category: "Panel",
    segment: "Residential",
    description:
      "Open bay showing smart breakers with status LEDs, copper bus bars, braided harnessing, and liquid-cooled Edge TPU compute blade.",
    src: "/prototypes/residential-interior.jpg",
    aspect: "portrait",
  },
  {
    id: "exploded",
    title: "Exploded Assembly",
    partNo: "IPC-RES-NODE-R2",
    category: "Panel",
    segment: "Residential",
    description:
      "HMI glass, keyboard tray, breaker array, Edge TPU PCB, copper bus backplane, and heatsink chassis in production-intent spatial order.",
    src: "/prototypes/exploded-assembly.jpg",
    aspect: "portrait",
  },
  {
    id: "commercial",
    title: "Commercial Hub Panel",
    partNo: "IPC-C1 / C2",
    category: "Panel",
    segment: "Commercial",
    description:
      "Brushed stainless industrial enclosure with 3-phase copper bus, motorized breakers, door-mounted HMI, and BACnet/Ethernet service ports.",
    src: "/prototypes/commercial-panel.jpg",
    aspect: "portrait",
  },
  {
    id: "pcb",
    title: "Edge AI Logic Board",
    partNo: "IPC-PCB-001",
    category: "Component",
    segment: "Core",
    description:
      "Matte black HDI PCB with Cortex-M7 MCU, Edge AI NPU, multi-channel ADCs, optocoupler isolation bank, and secure element.",
    src: "/prototypes/edge-tpu-pcb.jpg",
    aspect: "landscape",
  },
  {
    id: "ssr",
    title: "Hybrid SSR Actuator",
    partNo: "IPC-SCR-002",
    category: "Component",
    segment: "Core",
    description:
      "Anodized hybrid solid-state actuator with dual SCR packages, copper bus tabs, gate driver, and thermal interface pad.",
    src: "/prototypes/ssr-actuator.jpg",
    aspect: "landscape",
  },
  {
    id: "bus",
    title: "Copper Bus Assembly",
    partNo: "IPC-BUS-003",
    category: "Component",
    segment: "Core",
    description:
      "200A tin-plated copper bus bars, ceramic bushings, main lugs, neutral and ground bars on powder-coat backplane.",
    src: "/prototypes/bus-bar-assembly.jpg",
    aspect: "landscape",
  },
  {
    id: "microgrid",
    title: "Autonomous Microgrid",
    partNo: "MESH-TOPO-01",
    category: "System",
    segment: "Network",
    description:
      "Isometric neighborhood topology: solar homes, central battery, EVSE, humanoid V2H node, and teal mmWave mesh energy links.",
    src: "/prototypes/microgrid-topology.jpg",
    aspect: "landscape",
  },
];

export const SHARE_CARDS: ShareCard[] = [
  {
    id: "og",
    title: "Open Graph card",
    spec: "og:image",
    size: "1200 × 630",
    ratio: "1.91 : 1",
    src: "/og.jpg",
    usedAs: "Link previews (iMessage, Slack, LinkedIn, X large card)",
  },
  {
    id: "x-banner",
    title: "X feed banner",
    spec: "x:game:image",
    size: "1500 × 330",
    ratio: "50 : 11",
    src: "/x-banner.jpg",
    usedAs: "X / Grok feed card strip",
  },
];
