export type Choice = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  imageSrc: string;
};

export type Stage = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  choices: Choice[];
};

function img(id: string): string {
  return `/images/choices/${id}.png`;
}

export const STAGES: Stage[] = [
  {
    id: "structure",
    name: "Structure",
    subtitle: "The frame that holds it all",
    description:
      "Choose the woody backbone of your nest, the rigid pieces that give it shape.",
    choices: [
      {
        id: "oak-twigs",
        name: "Oak twigs",
        description: "Stout, slightly gnarled, weather tough.",
        prompt:
          "a sturdy framework of short oak twigs, dark grey-brown bark, slightly crooked, lichen-flecked",
        imageSrc: img("oak-twigs"),
      },
      {
        id: "willow-stems",
        name: "Willow stems",
        description: "Long, flexible, easy to bend into a bowl.",
        prompt:
          "long pliant willow stems, pale honey-brown, bent into a deep circular bowl",
        imageSrc: img("willow-stems"),
      },
      {
        id: "reed-stalks",
        name: "Reed stalks",
        description: "Hollow, lightweight, golden in tone.",
        prompt:
          "hollow golden reed stalks, dry and papery, layered in radial spokes",
        imageSrc: img("reed-stalks"),
      },
      {
        id: "birch-splints",
        name: "Birch splints",
        description: "Pale, papery, with peeling bark.",
        prompt:
          "thin birch splints with peeling white bark, brittle and pale, woven loosely",
        imageSrc: img("birch-splints"),
      },
    ],
  },
  {
    id: "weave",
    name: "Weave & Bind",
    subtitle: "What ties the structure together",
    description:
      "Pick the threading fibres that knot the frame into a cohesive shell.",
    choices: [
      {
        id: "dried-grass",
        name: "Dried grass",
        description: "Coarse, straw coloured, fragrant.",
        prompt:
          "fragrant dried meadow grass woven between the twigs, straw-yellow strands",
        imageSrc: img("dried-grass"),
      },
      {
        id: "coconut-coir",
        name: "Coconut coir",
        description: "Rough, reddish, very durable.",
        prompt:
          "coarse reddish coconut coir fibres binding the structure tightly, fibrous and rust-coloured",
        imageSrc: img("coconut-coir"),
      },
      {
        id: "horsehair",
        name: "Horsehair",
        description: "Dark, wiry, springy, very strong.",
        prompt:
          "fine dark horsehair strands looped through the structure, springy and wiry, glossy black and chestnut tones",
        imageSrc: img("horsehair"),
      },
      {
        id: "spider-silk",
        name: "Spider silk",
        description: "Fine, translucent, faintly iridescent.",
        prompt:
          "delicate translucent spider silk threads tying joints, faintly iridescent in the light",
        imageSrc: img("spider-silk"),
      },
    ],
  },
  {
    id: "rim",
    name: "Rim & Anchor",
    subtitle: "Reinforcing the edge and securing the perch",
    description:
      "Strengthen the lip of the bowl and tie the nest to its setting.",
    choices: [
      {
        id: "curved-willow",
        name: "Curved willow",
        description: "Bent rim hoops, supple and strong.",
        prompt:
          "a smooth curved willow hoop reinforcing the rim, trailing vines anchoring it to a branch",
        imageSrc: img("curved-willow"),
      },
      {
        id: "twisted-reeds",
        name: "Twisted reeds",
        description: "Plaited golden cords for a clean edge.",
        prompt:
          "twisted golden reed cords plaited around the rim, fine trailing reed roots dangling below",
        imageSrc: img("twisted-reeds"),
      },
      {
        id: "rootlets",
        name: "Fine rootlets",
        description: "Dark, hairlike, knotted at the edge.",
        prompt:
          "fine dark rootlets knotting the rim, long trailing root-threads gripping the support",
        imageSrc: img("rootlets"),
      },
      {
        id: "bark-strips",
        name: "Bark strips",
        description: "Wide, papery, layered like shingles.",
        prompt:
          "wide papery bark strips overlapping the rim like shingles, long strips wrapping a branch beneath",
        imageSrc: img("bark-strips"),
      },
    ],
  },
  {
    id: "lining",
    name: "Lining & Insulation",
    subtitle: "The soft interior",
    description:
      "The inner cradle, what touches eggs and chicks. Soft, warm, fine.",
    choices: [
      {
        id: "down-feathers",
        name: "Down feathers",
        description: "Pale, fluffy, almost weightless.",
        prompt:
          "a soft cradle of pale down feathers, fluffy and weightless, cream and white tones",
        imageSrc: img("down-feathers"),
      },
      {
        id: "sheeps-wool",
        name: "Sheep's wool",
        description: "Creamy, lanolin scented, springy.",
        prompt:
          "tufts of creamy sheep's wool packing the bowl, springy and slightly oily-looking",
        imageSrc: img("sheeps-wool"),
      },
      {
        id: "moss",
        name: "Moss",
        description: "Emerald green, cushiony, damp.",
        prompt:
          "lush emerald moss carpeting the interior, cushiony and cool, holding tiny dew drops",
        imageSrc: img("moss"),
      },
      {
        id: "dandelion-fluff",
        name: "Dandelion fluff",
        description: "Silver white, parachute like, airy.",
        prompt:
          "silvery dandelion seed fluff lining the interior, airy parachute fibres catching light",
        imageSrc: img("dandelion-fluff"),
      },
    ],
  },
  {
    id: "camo",
    name: "Camouflage & Debris",
    subtitle: "Hiding the nest in plain sight",
    description:
      "The outer dressing, what makes the nest disappear into its surroundings.",
    choices: [
      {
        id: "lichen-patches",
        name: "Lichen patches",
        description: "Grey green crusts stuck to the outside.",
        prompt:
          "pale grey-green lichen patches glued to the outer walls, mottled and crusty",
        imageSrc: img("lichen-patches"),
      },
      {
        id: "dry-leaves",
        name: "Dry leaves",
        description: "Russet, curled, rustling.",
        prompt:
          "russet curled dry leaves layered on the exterior, rustling and brittle",
        imageSrc: img("dry-leaves"),
      },
      {
        id: "seed-husks",
        name: "Seed husks",
        description: "Papery, pale, scattered like confetti.",
        prompt:
          "pale papery seed husks scattered across the surface like confetti",
        imageSrc: img("seed-husks"),
      },
      {
        id: "bark-flakes",
        name: "Pine bark flakes",
        description: "Reddish, jigsaw like scales.",
        prompt:
          "reddish jigsaw-like pine bark flakes pressed onto the outside, irregular and warm-toned",
        imageSrc: img("bark-flakes"),
      },
    ],
  },
];
