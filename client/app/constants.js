/**
 * Available AI models shown in the sidebar model selector.
 * Browse more at: https://openrouter.ai/models
 */
export const MODELS = [
  { value: "google/gemma-3-12b-it:free", label: "Gemma 3 12B" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3" },
  { value: "meta-llama/llama-4-maverick:free", label: "Llama 4 Maverick" },
  { value: "qwen/qwen3-235b-a22b:free", label: "Qwen 3 235B" },
  { value: "mistralai/devstral-small:free", label: "Devstral Small" },
];

/**
 * Returns the display label for a model value string.
 */
export function getModelLabel(value) {
  const model = MODELS.find((m) => m.value === value);
  return model ? model.label : value;
}
