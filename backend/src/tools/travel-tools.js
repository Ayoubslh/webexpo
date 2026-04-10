import { DynamicTool } from "@langchain/core/tools";

export const buildTravelTools = () => {
  const destinationIdeaTool = new DynamicTool({
    name: "destination_idea",
    description:
      "Suggests destination ideas for e-tourism based on a short traveler preference input.",
    func: async (input) => {
      return `Top destination themes for '${input}': eco-tourism escapes, cultural city circuits, and local food experiences.`;
    }
  });

  return [destinationIdeaTool];
};
