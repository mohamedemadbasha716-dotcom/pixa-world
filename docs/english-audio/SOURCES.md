# Pixa English audio — license and source documentation

Prepared 2026-11-23. All facts below were observed live from the cited URLs during
production. This file is the provenance record for batch2 (Kokoro) and batch3
(Piper) audio deliveries.

## 1. Kokoro-82M (batch2, 103 clips)

- Model: Kokoro-82M, hexgrad
  - Source: https://huggingface.co/hexgrad/Kokoro-82M
  - License observed in model card YAML: `license: apache-2.0`
  - License text: https://www.apache.org/licenses/LICENSE-2.0
  - Voice weights (incl. bf_emma) ship inside the same repositories; no separate
    per-voice restrictive license is documented in VOICES.md
    (https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md).
  - The model card states the architecture "already computes in less than 1/10th
    realtime on M1 Pro" and welcomes deployment; no field restricts commercial use.
- ONNX distribution actually used for synthesis:
  - https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
  - License observed in model card YAML: `license: apache-2.0`
- Training-data note from the model card (attribution lives there):
  training audio includes Koniwa (CC BY 3.0) and SIWIS (CC BY 4.0) datasets.
  The card itself carries the dataset credits; no separate in-app attribution
  is mandated by Apache-2.0 for synthesized output, but keeping the model card's
  credit text alongside the asset store is recommended and cheap.

Required notices when shipping Kokoro weights or a derivative:
1. Include a copy of the Apache-2.0 license
   (https://www.apache.org/licenses/LICENSE-2.0.txt).
2. Preserve existing copyright/attribution notices from the distributed files.
3. State changes if the model files are modified (not modified here; used as-is).
Synthesized audio output: Apache-2.0 grants a perpetual, worldwide, royalty-free
copyright license to reproduce and distribute derivative works; no field of the
license or model card restricts use of generated audio, including commercial use.

Runtime used: kokoro-js (Node) running the ONNX model locally, offline. No
accounts, API keys, billing, or subscriptions were created or used.

## 2. Piper en_GB-cori-high (batch3, 7 clips)

- Voice model: en_GB-cori-high
  - Files used:
    https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_GB/cori/high/en_GB-cori-high.onnx
    (+ .onnx.json config)
  - MODEL_CARD observed at
    https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/cori/high/MODEL_CARD
    states: Language en_GB; Dataset URL https://librivox.org; License: public domain;
    trained from scratch by Bryce Beattie (training notes
    https://brycebeattie.com/files/tts/), UK English female, single speaker.
  - Independent corroboration: OHF-Voice commercial-use review lists
    `en_GB-cori-high` under "Voices trained from scratch" with dataset license
    "Public domain" (https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/COMMERCIAL_USE.md).
- Required notices: none. Public domain (and CC0-class) training data requires no
  attribution per the OHF-Voice licensing table. Shipping the voice's MODEL_CARD
  text alongside the assets is the recommended record-keeping practice.
- Engine: piper-tts (Python), MIT license
  (https://github.com/rhasspy/piper, LICENSE: MIT). Engine used offline only to
  render audio; the engine is not shipped with game assets.
  Caveat recorded from the piper maintainer: piper uses espeak-ng (GPL) as its
  phonemizer at synthesis time; the maintainer does not believe this affects
  rendered WAV files, but this is noted for completeness
  (https://github.com/rhasspy/piper/discussions/271).
- Voices deliberately NOT used: en_GB-semaine (CC BY-NC-SA 4.0, non-commercial),
  en_GB-alba/aru/vctk/northern_english_male and other Lessac-derived voices
  (non-commercial base per https://loudness.ai/research/piper-tts-voices-ranked/
  exclusion table).

## 3. Final audio manifest

See final-manifest.json for the actual clip-by-clip voice, spoken phrase and carrier targets.
Earlier generation batches contained rejected clips. Only the final bundled manifest is authoritative.
Kokoro and Piper model weights and synthesis engines are not included in the game.
The generated recordings are original outputs. Some are full untrimmed example phrases.
The UI discloses those phrases separately from the learning targets.

Kokoro training-data credits retained from its model card: Koniwa tnc (CC BY 3.0),
SIWIS (CC BY 4.0), model architecture StyleTTS 2 by Li et al and ISTFTNet by Kaneko et al.
Apache-2.0 license copy is included alongside this record.
