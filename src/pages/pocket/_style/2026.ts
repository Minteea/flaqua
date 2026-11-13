export default {
  "2026night": {
    dynamicBackground: {
      name: "Parallelogram",
      props: {
        minWidth: 40,
        maxWidth: 600,
        minSpeed: 20,
        maxSpeed: 60,
        skewAngle: 25,
        minSpawnInterval: 4000,
        maxSpawnInterval: 8000,
        minOpacity: 0.2,
        maxOpacity: 0.5,
      },
    },
  },
  "2026minty": {
    dynamicBackground: {
      name: "BubbleFlow",
      props: {
        minRadius: 100,
        maxRadius: 400,
        minSpeed: 30,
        maxSpeed: 100,
        minSpawnInterval: 2000,
        maxSpawnInterval: 4000,
        minOpacity: 0.5,
        maxOpacity: 1,
      },
    },
  },
  "2026evening": {
    dynamicBackground: {
      name: "DotGrid",
      props: {
        xSpeed: 18,
        ySpeed: 0,
        spacing: 180,
        dotDiameter: 18,
        dotDiameter2: 12,
        startXOffset: 40,
        startYOffset: 10,
      },
    }, mainBackground: {
      name: "DotGrid",
      props: {
        xSpeed: 0,
        ySpeed: 0,
        spacing: 180,
        dotDiameter: 18,
        dotDiameter2: 12,
        startXOffset: 40,
        startYOffset: 10,
      },
    },
  },
  "2026lemonade": {
    dynamicBackground: {
      name: "SquareGrid",
      props: {
        xSpeed: 20,
        ySpeed: 0,
        gridSize: 48,
        startYOffset: 12,
        startXOffset: 12,
      },
    },
    mainBackground: {
      name: "SquareGrid",
      props: {
        xSpeed: 0,
        ySpeed: 0,
        gridSize: 48,
        startYOffset: 12,
        startXOffset: 12,
      },
    },
  },
};
