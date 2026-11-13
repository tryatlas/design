import { type BrandMarkProps } from "../../lib/brand-mark-svg.tsx";
/**
 * Provider marks: the BYOK providers an app lists for API keys, and the model
 * families (Qwen, Kimi, Meta's Llama, Zhipu's GLM) a model picker groups by.
 * These are provider trademarks copied from Lobe Icons 5.16.0 (MIT, see
 * THIRD_PARTY_NOTICES.md): every path is byte-for-byte the shipped one, so a
 * mark here looks exactly like the one desktop drew from the Lobe Icons npm
 * package, without depending on it (its peers are a UI kit and antd).
 *
 * The colours are the owners', fixed by their brand, not theme values: a
 * recoloured logo is the wrong logo. That is why the ratchet exempts this file
 * by name. The Mono marks (Anthropic, Grok, AI21, Groq, Replicate, OpenRouter,
 * Jina, ElevenLabs) are authorised in one colour and take `currentColor`, so
 * they follow the ink they sit in. Cerebras is both: its ring is its orange
 * and its letter takes `currentColor`. A few Color marks are very dark (Voyage,
 * Hugging Face's outline, Cohere's green) and read poorly on a dark surface;
 * they are kept as shipped.
 *
 * OpenAI and Google are not here: they are `OpenAIMark` and `GoogleMark` in
 * `brand-marks.tsx`, and a provider list uses those. Claude and Gemini as
 * model families are `ClaudeMark` and `GeminiMark` there too.
 *
 * Each mark names itself: `title` defaults to the brand name as Lobe Icons
 * gives it ("Grok" for xAI, "together.ai"), the svg gets `role="img"` and a
 * `<title>`. Beside the provider's name as text, pass `title=""`: no
 * `<title>`, `aria-hidden="true"`.
 *
 * Choosing a mark from a provider id is the app's job; nothing here maps one.
 * The gradients take ids from `useId()`, so two of the same mark on a page
 * never share a gradient.
 */
declare function AnthropicMark(props: BrandMarkProps): import("react").JSX.Element;
declare function MistralMark(props: BrandMarkProps): import("react").JSX.Element;
declare function CohereMark(props: BrandMarkProps): import("react").JSX.Element;
declare function XAIMark(props: BrandMarkProps): import("react").JSX.Element;
declare function DeepSeekMark(props: BrandMarkProps): import("react").JSX.Element;
declare function AI21Mark(props: BrandMarkProps): import("react").JSX.Element;
declare function GroqMark(props: BrandMarkProps): import("react").JSX.Element;
declare function TogetherMark(props: BrandMarkProps): import("react").JSX.Element;
declare function FireworksMark(props: BrandMarkProps): import("react").JSX.Element;
declare function DeepInfraMark(props: BrandMarkProps): import("react").JSX.Element;
declare function CerebrasMark(props: BrandMarkProps): import("react").JSX.Element;
declare function ReplicateMark(props: BrandMarkProps): import("react").JSX.Element;
declare function PerplexityMark(props: BrandMarkProps): import("react").JSX.Element;
declare function OpenRouterMark(props: BrandMarkProps): import("react").JSX.Element;
declare function AzureMark(props: BrandMarkProps): import("react").JSX.Element;
declare function VoyageMark(props: BrandMarkProps): import("react").JSX.Element;
declare function HuggingFaceMark(props: BrandMarkProps): import("react").JSX.Element;
declare function JinaMark(props: BrandMarkProps): import("react").JSX.Element;
declare function ElevenLabsMark(props: BrandMarkProps): import("react").JSX.Element;
declare function QwenMark(props: BrandMarkProps): import("react").JSX.Element;
declare function KimiMark(props: BrandMarkProps): import("react").JSX.Element;
declare function MetaMark(props: BrandMarkProps): import("react").JSX.Element;
declare function ZhipuMark(props: BrandMarkProps): import("react").JSX.Element;
export { AI21Mark, AnthropicMark, AzureMark, CerebrasMark, CohereMark, DeepInfraMark, DeepSeekMark, ElevenLabsMark, FireworksMark, GroqMark, HuggingFaceMark, JinaMark, KimiMark, MetaMark, MistralMark, OpenRouterMark, PerplexityMark, QwenMark, ReplicateMark, TogetherMark, VoyageMark, XAIMark, ZhipuMark, };
//# sourceMappingURL=provider-marks.d.ts.map