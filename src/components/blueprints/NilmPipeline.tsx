import { AFCI_THRESH, NILM_CLASSES, NILM_LATENCY } from "@/lib/ipc/blueprints";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";

/** DSP-005 — dense signal-flow with bit widths, rates, model arch */
export function NilmPipeline() {
  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">DSP-005 · Rev A · Sheet 1/1</div>
        <h3 className="text-sm font-semibold text-fg">NILM Engine & Edge TPU Inference Pipeline</h3>
        <p className="text-xs text-fg-muted">
          IEEE 1459 · IEC 62053 · 50 kHz sample · 1024 Hann · 512-pt FFT · INT8 TPU · E2E {"<"}25 ms
        </p>
      </div>

      <SheetFrame dwg="DSP-005" rev="A" title="NILM / AFCI SIGNAL FLOW — DATA PATH" standard="IEEE 1459">
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1100 620"
            className="h-auto w-full min-w-[900px]"
            role="img"
            aria-label="Detailed DSP-005 signal flow"
          >
            <defs>
              <pattern id="dspgrid" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(94,184,168,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1100" height="620" fill="url(#dspgrid)" />

            {/* Analog front */}
            <text x="40" y="28" fill="#d4544a" fontSize="11" fontFamily="monospace" fontWeight="700">
              ANALOG DOMAIN
            </text>
            <Stage x={40} y={50} w={150} h={80} color="#d4544a" title="CT/PT + AAF" lines={["0.2% revenue class", "nanocrystalline CT", "anti-alias LPF"]} />
            <Arrow x1={190} y1={90} x2={220} y2={90} />
            <Stage x={220} y={50} w={150} h={80} color="#d4544a" title="ADS1256" lines={["24-bit ΔΣ", "50 kSPS", "simultaneous V/I"]} />

            {/* Digital MCU */}
            <text x="420" y="28" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              MCU DOMAIN (STM32H7)
            </text>
            <Arrow x1={370} y1={90} x2={400} y2={90} />
            <Stage x={400} y={50} w={150} h={80} color="#5eb8a8" title="DMA Ping-Pong" lines={["1024 samples", "Hann window", "~20.48 ms/block"]} />
            <Arrow x1={550} y1={90} x2={580} y2={90} />
            <Stage x={580} y={50} w={150} h={80} color="#5eb8a8" title="Feature Extract" lines={["ΔP / ΔQ", "V–I trajectory", "inrush peak"]} />
            <Arrow x1={730} y1={90} x2={760} y2={90} />
            <Stage x={760} y={50} w={150} h={80} color="#5eb8a8" title="FFT 512-pt" lines={["radix-2 C-T", "k=2…49", "~0.8 ms M7"]} />

            {/* Spectral detail */}
            <rect x={40} y={160} width={870} height={70} rx="4" fill="rgba(14,16,20,0.9)" stroke="#5b8def" strokeWidth="1" />
            <text x="56" y="182" fill="#5b8def" fontSize="10" fontFamily="monospace" fontWeight="700">
              SPECTRAL BINS
            </text>
            <text x="56" y="200" fill="#8b929e" fontSize="9" fontFamily="monospace">
              Odd harmonics k = 3,5,7,…,49 · Even harmonics k = 2,4,6,…,20 · Fundamental 60 Hz · THD metric for AFCI
            </text>
            <text x="56" y="216" fill="#5c6370" fontSize="8" fontFamily="monospace">
              Nyquist 25 kHz @ 50 kSPS · Window 1024 → bin spacing ≈ 48.8 Hz · Phase + magnitude to embedding
            </text>

            {/* TPU path */}
            <text x="40" y="270" fill="#8b7cf0" fontSize="11" fontFamily="monospace" fontWeight="700">
              EDGE TPU DOMAIN (CORAL · 4 TOPS INT8)
            </text>
            <Arrow x1={835} y1={130} x2={835} y2={290} />
            <path d="M835 290 H200" stroke="#8b7cf0" strokeWidth="1.25" fill="none" markerEnd="url(#arr)" />

            <Stage x={40} y={300} w={160} h={90} color="#8b7cf0" title="1D CNN" lines={["32 filters · k=5", "stride 1 · same pad", "ReLU · MaxPool 2"]} />
            <Arrow x1={200} y1={345} x2={230} y2={345} />
            <Stage x={230} y={300} w={160} h={90} color="#8b7cf0" title="Bi-LSTM Enc" lines={["seq state", "temporal ctx", "local features"]} />
            <Arrow x1={390} y1={345} x2={420} y2={345} />
            <Stage x={420} y={300} w={160} h={90} color="#8b7cf0" title="Seq2Seq Dec" lines={["7 class heads", "power (W)", "confidence"]} />
            <Arrow x1={580} y1={345} x2={610} y2={345} />
            <Stage x={610} y={300} w={160} h={90} color="#8b7cf0" title="INT8 Infer" lines={["quantized TFLite", "latency <2.5 ms", "4 TOPS @ 2 W"]} />

            {/* Safety preempt */}
            <rect x={800} y={300} width={250} height={90} rx="4" fill="rgba(212,84,74,0.1)" stroke="#d4544a" strokeWidth="1.5" />
            <text x="925" y="328" textAnchor="middle" fill="#d4544a" fontSize="11" fontFamily="monospace" fontWeight="700">
              SAFETY PREEMPT
            </text>
            <text x="925" y="348" textAnchor="middle" fill="#8b929e" fontSize="9" fontFamily="monospace">
              {`THD > ${AFCI_THRESH.thd}% AND conf > ${AFCI_THRESH.confidence}%`}
            </text>
            <text x="925" y="366" textAnchor="middle" fill="#8b929e" fontSize="9" fontFamily="monospace">
              {`→ gate drop < ${AFCI_THRESH.tripUs} μs`}
            </text>
            <text x="925" y="382" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              preempts NILM & altruistic
            </text>

            {/* Output classes */}
            <text x="40" y="430" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              CLASSIFIER OUTPUTS (7)
            </text>
            {NILM_CLASSES.map((c, i) => (
              <rect
                key={c}
                x={40 + (i % 4) * 200}
                y={450 + Math.floor(i / 4) * 36}
                width={180}
                height={28}
                rx="3"
                fill="rgba(14,16,20,0.95)"
                stroke="#5eb8a8"
                strokeWidth="1"
              />
            ))}
            {NILM_CLASSES.map((c, i) => (
              <text
                key={`${c}-t`}
                x={50 + (i % 4) * 200}
                y={468 + Math.floor(i / 4) * 36}
                fill="#e8eaed"
                fontSize="10"
                fontFamily="monospace"
              >
                {c}
              </text>
            ))}

            {/* Latency strip */}
            <text x="40" y="540" fill="#c9a227" fontSize="11" fontFamily="monospace" fontWeight="700">
              LATENCY BUDGET (SUM {"<"} 25 ms)
            </text>
            {NILM_LATENCY.map((row, i) => (
              <text key={row.stage} x="40" y={558 + i * 7} fill="#5c6370" fontSize="7" fontFamily="monospace">
                {`${row.stage.padEnd(22)} ${row.component.padEnd(28)} ${row.latency}`}
              </text>
            ))}
          </svg>
        </div>
      </SheetFrame>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-3 py-2">Stage</th>
              <th className="px-3 py-2">Component</th>
              <th className="px-3 py-2">Latency budget</th>
            </tr>
          </thead>
          <tbody>
            {NILM_LATENCY.map((row) => (
              <tr
                key={row.stage}
                className={
                  row.stage.startsWith("Total")
                    ? "border-t border-primary/40 bg-primary-soft/20"
                    : "border-t border-border"
                }
              >
                <td className="px-3 py-2 text-fg">{row.stage}</td>
                <td className="px-3 py-2 text-fg-muted">{row.component}</td>
                <td className="px-3 py-2 font-mono text-accent">{row.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Priority
          title="SAFETY (PREEMPT)"
          tone="danger"
          body={`AFCI: THD > ${AFCI_THRESH.thd}% AND conf > ${AFCI_THRESH.confidence}% → SiC gate drop in <${AFCI_THRESH.tripUs} μs. Accuracy ${AFCI_THRESH.accuracy}.`}
        />
        <Priority
          title="NILM"
          tone="primary"
          body="Disaggregate S(t)=P+jQ into appliance sᵢ(t). CNN+BiLSTM+Seq2Seq on 16–50 kHz streams."
        />
        <Priority
          title="ALTRUISTIC"
          tone="ok"
          body="Idle TPU on surplus solar → public-good jobs. Always yields to safety loop."
        />
      </div>

      <TitleBlock dwg="DSP-005" rev="A" title="NILM Engine & Edge TPU Inference Pipeline" />
    </div>
  );
}

function Stage({
  x,
  y,
  w,
  h,
  color,
  title,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  title: string;
  lines: string[];
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="rgba(14,16,20,0.95)" stroke={color} strokeWidth="1.25" />
      <text x={x + 10} y={y + 20} fill={color} fontSize="11" fontFamily="monospace" fontWeight="700">
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + 10} y={y + 40 + i * 14} fill="#8b929e" fontSize="9" fontFamily="monospace">
          {l}
        </text>
      ))}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5eb8a8" strokeWidth="1.25" />
      <polygon
        points={`${x2},${y2} ${x2 - 6},${y2 - 3} ${x2 - 6},${y2 + 3}`}
        fill="#5eb8a8"
      />
    </g>
  );
}

function Priority({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "danger" | "primary" | "ok";
}) {
  const border =
    tone === "danger" ? "border-danger/40" : tone === "ok" ? "border-ok/40" : "border-primary/40";
  const text = tone === "danger" ? "text-danger" : tone === "ok" ? "text-ok" : "text-accent";
  return (
    <div className={`rounded-md border ${border} bg-bg/50 p-3`}>
      <div className={`font-mono text-[10px] font-semibold tracking-wider ${text}`}>{title}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">{body}</p>
    </div>
  );
}
