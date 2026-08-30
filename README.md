# IPC — Intelligent Power Core

Independent concept study by **Jay Young** (working electrician).  
**Not** a product of xAI, Tesla, SpaceX, or UL.

Hybrid solid-state service-entrance equipment: semiconductor interruption, a padlockable galvanic LOTO shutter, NILM plus a Nyquist-honest AFCI front end, optional 2.4 kW V2H from a docked Optimus-class 2.3 kWh / 52 V torso pack.

Package version **1.1.0** (science reconciliation, 2026-08-30).

## Read this first

| File | What it is |
|---|---|
| `artifacts/SUBMISSION_COVER.md` | The note to xAI |
| `artifacts/SPEC_BASELINE.md` | Controlling numbers. Wins every conflict. |
| `artifacts/master_whitepaper.md` | The argument |
| `artifacts/IPC_Concept_Study_v1.1.0.pdf` | Printable packet of the three above |

Companion manuals live under `artifacts/`. This repository also hosts a **simulator dashboard** (TanStack Start) so a reviewer can press trip predicates without a panel.

## What v1.1.0 fixed

- Hybrid SKU table: thyristor matrix on ≤30 A prototype poles, 1200 V SiC on 50 A / 200 A, IGBT STS on D2
- 200 A is paralleled dies, not one 12 mΩ part
- AFCI analog 10–100 kHz path; 50 kSPS is NILM/THD only
- Field trip = THD > 35% **and** confidence ≥ 80% **and** ≥ 3 half-cycles
- On-panel TPU = 4 TOPS INT8. 40 TOPS / mesh-Grok / tokens are future work
- Optimus endurance with 92% conversion (~9.2 h at 230 W). 4680 torso claim withdrawn
- Dashboard sample-rate chrome prints **50 kHz**, not 16 kHz

## Run the dashboard

```bash
npm install
npm run dev
```

Views: Overview, Circuits, NILM, Load, VPP, Technician, Prototypes, Blueprints, Architecture.

## Marks and warranty

xAI, Grok, Tesla, Optimus, Powerwall, Starlink, and Colossus are other people’s marks, used only to name proposed integration points. The study is provided as-is. Drawings are not issued for fabrication. No UL file exists.

## Still dirty in this tree

`.grok/` and `.vercel/output/` were committed from a workspace dump. They are now gitignored. Purge them locally with:

```bash
git rm -r --cached .grok .vercel/output artifacts/.grok
git commit -m "chore: drop workspace dump folders"
```
