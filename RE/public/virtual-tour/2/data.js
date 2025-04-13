var APP_DATA = {
  "scenes": [
    {
      "id": "0-kitchendinning",
      "name": "Kitchen+Dinning",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        }
      ],
      "faceSize": 320,
      "initialViewParameters": {
        "yaw": -1.6596725427015677,
        "pitch": -0.008969885862313731,
        "fov": 1.325599857056214
      },
      "linkHotspots": [
        {
          "yaw": 0,
          "pitch": 0,
          "rotation": 10.995574287564278,
          "target": "2-bathroom"
        },
        {
          "yaw": 0.8259795504703167,
          "pitch": 0.32585547235177614,
          "rotation": 7.0685834705770345,
          "target": "1-room"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-room",
      "name": "Room",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        }
      ],
      "faceSize": 320,
      "initialViewParameters": {
        "yaw": -0.006264725348774647,
        "pitch": 0.09597522543816872,
        "fov": 1.325599857056214
      },
      "linkHotspots": [
        {
          "yaw": -1.8540562170589077,
          "pitch": 0.2443305121021453,
          "rotation": 7.0685834705770345,
          "target": "0-kitchendinning"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-bathroom",
      "name": "Bathroom",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        }
      ],
      "faceSize": 320,
      "initialViewParameters": {
        "yaw": -3.061306517751916,
        "pitch": 0.3495437756904334,
        "fov": 1.325599857056214
      },
      "linkHotspots": [
        {
          "yaw": -1.5953869621851844,
          "pitch": 0.14281104898550723,
          "rotation": 0,
          "target": "0-kitchendinning"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "2",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
