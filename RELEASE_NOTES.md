# gene.iobio v4.12.0.0 Release Notes

Changes since v4.11.6 (`d5412b6c`).

---

## gnomAD population frequencies

- **Ancestry group popup** — Renamed and restyled to align with the gnomAD browser: "Ancestry group frequencies," human-readable population names (e.g. "European (non-Finnish)"), source caption (e.g. "gnomAD genomes v4"), and clearer row layout.
- **Per-ancestry parsing** — Restored parsing of population AC/AN tags for gnomAD v2.1.1 (GRCh37) and v4 (GRCh38). When direct `AF_*` tags are missing, ancestry AF is derived from AC/AN.
- **Display precision** — Genome, exome, population-max, and per-population allele frequencies now use **4 significant digits** (`.4g`), matching the gnomAD website.
- **Exome frequencies** — gnomAD exome AF is shown only when the backend actually provides exome annotations (`gnomADExomesIncluded`). Avoids showing misleading `0.0` on backends without exome data.
- **Mitochondrial variants** — In-app gnomAD AF is not shown for mitochondrial variants; users get an external "View on gnomAD" link and an explanatory info popup (full and basic inspect views).

---

## Demo, education tour, and sample data

- **Demo/edu dataset config** — Refactored demo and education-tour sample URLs into a structured `dataSetMap` keyed by mode, build (GRCh37/GRCh38), and exome/genome.
- **Build switching** — Files dialog reloads the correct demo VCF/CRAM set when switching between GRCh37 and GRCh38.
- **GRCh37 demo fix (#1160)** — Fixed loading the GRCh37 platinum demo trio (build/species applied before init; demo model info resolved per build).
- **Sample file hosting** — Demo sample URLs moved from `iobio.s3.amazonaws.com` to `files.iobio.io`.

---

## Variant visualization

- **Trio first-load alignment** — Fixed variants appearing at the wrong x-position on initial trio load. Variant track redraws when width and gene region become valid, and gene region is re-synced after coding regions are marked.

---

## Gene lookup and coordinates

- **GeneModel robustness** — Safer gene entry lookup and coordinate application from geneinfo; handles missing entries and build-specific coords more reliably.
- **Build mismatch handling** — When geneinfo returns incorrect build bounds, falls back to transcript spans for coordinate assignment.

---

## Mitochondrial and reference contigs

- **M/MT alias resolution** — Improved mapping between gene coordinates and VCF contigs for `M`, `MT`, `chrM`, and `chrMT`.
- **GenomeBuildHelper** — Better reference/FASTA lookup for mitochondrial contigs.
- **Backend queries** — `chrM`/`chrMT` included in human reference name lists sent to the backend.

---

## VCF reference caching

- **Header contigs** — Merges tabix chromosome list with `##contig` lines from the VCF header so contigs present only in the header are available for lookups.
- **Cache behavior** — Parses header contigs before fetching reference lengths; avoids clearing unrelated reference cache on local VCF open.

---

## ClinVar and backend

- **ClinVar track** — Tries `getClinvarVariantsV3` first and falls back to `getClinvarVariantsV2` if the backend does not support V3 yet; locks the working API version for the session. Automatically uses V3 once gru 2.0 is deployed.

---

## Internal / developer notes

- Documented that Vue's `globalApp` mixin creates per-component instances; shared state (e.g. `gnomADExomesIncluded`) must use `cohortModel.globalApp`.
- Version bumped to **4.12.0** in `package.json` and `GlobalApp`.

---

## Bug fixes

- Fixed duplicated `</span>` in variant inspect panel HTML.
- Minor template/layout fixes in gnomAD inspect column.

---

## Known limitation

Genome-level **AC / AN counts** (e.g. "564 alt of N total") require aggregate `gg4_0_0_AC` / `gg4_0_0_AN` tags from the gru annotation backend. Some gru v2.0 deployments merge sex-stratified fields instead; count display depends on a backend fix to restore aggregate AC/AN in the merged VCF INFO.
