/**
 * Model type descriptions for tooltips
 */
export const MODEL_TYPE_DESCRIPTIONS: Record<string, string> = {
  "Large Language Model": "Text-based AI models optimised for natural language understanding, generation, and conversation. These models excel at tasks like writing, analysis, and general knowledge questions.",
  
  "Large Multimodal Model": "Advanced AI models that can process and generate multiple types of content including text, images, audio, and sometimes video. They can understand and create across different media formats.",
  
  "Large Reasoning Model": "Specialised AI models designed for complex problem-solving, mathematical reasoning, and step-by-step logical thinking. They often use reasoning tokens to show their thought process.",
  
  "Large Hybrid Model": "AI models that combine large language model capabilities with large reasoning model functionality. They can switch between standard language processing and deep reasoning modes depending on the task complexity."
};

/**
 * Get description for a model type
 * @param modelType The model type to get description for
 * @returns Description string or generic fallback
 */
export function getModelTypeDescription(modelType: string): string {
  return MODEL_TYPE_DESCRIPTIONS[modelType] || "AI model with specialised capabilities and features.";
}