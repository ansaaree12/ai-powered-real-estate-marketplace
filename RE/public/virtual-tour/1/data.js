var APP_DATA = {
  "scenes": [
    {
      "id": "0-shot-panoramic-composition-kitchen",
      "name": "shot-panoramic-composition-kitchen",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1397.5,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.5818538847331034,
          "pitch": 0.10613901214785493,
          "rotation": 0,
          "target": "1-shot-panoramic-composition-bedroom-3"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-shot-panoramic-composition-bedroom-3",
      "name": "shot-panoramic-composition-bedroom (3)",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1536,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -2.539464064001944,
          "pitch": 0.20793683588925482,
          "rotation": 5.497787143782138,
          "target": "0-shot-panoramic-composition-kitchen"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
