import dotenv from "dotenv";

import { connectDatabase } from "./config/db.js";

import Emergency from "./models/Emergency.js";
import Shelter from "./models/Shelter.js";
import Road from "./models/Road.js";

dotenv.config();


const emergencies = [
  {
    emergencyId: "HZ-01",
    name: "Chemical Fire",
    type: "chemical",
    description:
      "Active fire detected in industrial sector",
    position: {
      lat: 710,
      lng: 430,
    },
    severity: "critical",
    status: "active",
  },

  {
    emergencyId: "HZ-02",
    name: "Structural Damage",
    type: "structural",
    description:
      "Building collapse risk detected",
    position: {
      lat: 500,
      lng: 720,
    },
    severity: "high",
    status: "active",
  },
];


const shelters = [
  {
    shelterId: "S-01",
    name: "Central Shelter",
    position: {
      lat: 820,
      lng: 980,
    },
    capacity: 500,
    occupied: 180,
    medicalSupport: true,
    status: "available",
  },

  {
    shelterId: "S-02",
    name: "North Shelter",
    position: {
      lat: 250,
      lng: 850,
    },
    capacity: 300,
    occupied: 90,
    medicalSupport: false,
    status: "available",
  },
];


const roads = [
  {
    roadId: "R-01",
    name: "Central Avenue",
    status: "open",
    reason: "",
    points: [
      {
        lat: 100,
        lng: 300,
      },
      {
        lat: 400,
        lng: 420,
      },
      {
        lat: 700,
        lng: 500,
      },
      {
        lat: 1100,
        lng: 580,
      },
      {
        lat: 1450,
        lng: 700,
      },
    ],
  },

  {
    roadId: "R-02",
    name: "North Highway",
    status: "open",
    reason: "",
    points: [
      {
        lat: 200,
        lng: 100,
      },
      {
        lat: 500,
        lng: 250,
      },
      {
        lat: 800,
        lng: 320,
      },
      {
        lat: 1150,
        lng: 360,
      },
      {
        lat: 1450,
        lng: 400,
      },
    ],
  },

  {
    roadId: "R-03",
    name: "East Connector",
    status: "blocked",
    reason:
      "Fire hazard zone",
    points: [
      {
        lat: 900,
        lng: 250,
      },
      {
        lat: 850,
        lng: 500,
      },
      {
        lat: 800,
        lng: 700,
      },
      {
        lat: 820,
        lng: 980,
      },
    ],
  },

  {
    roadId: "R-04",
    name: "South Route",
    status: "open",
    reason: "",
    points: [
      {
        lat: 150,
        lng: 1100,
      },
      {
        lat: 450,
        lng: 1000,
      },
      {
        lat: 700,
        lng: 950,
      },
      {
        lat: 1000,
        lng: 1000,
      },
      {
        lat: 1400,
        lng: 1080,
      },
    ],
  },

  {
    roadId: "R-05",
    name: "West Bypass",
    status: "caution",
    reason:
      "Partial obstruction",
    points: [
      {
        lat: 180,
        lng: 150,
      },
      {
        lat: 250,
        lng: 400,
      },
      {
        lat: 250,
        lng: 650,
      },
      {
        lat: 250,
        lng: 850,
      },
      {
        lat: 200,
        lng: 1100,
      },
    ],
  },
];


async function seedDatabase() {
  try {
    await connectDatabase();

    console.log(
      "Clearing existing ResQMesh data..."
    );

    await Emergency.deleteMany({});
    await Shelter.deleteMany({});
    await Road.deleteMany({});


    console.log(
      "Inserting emergencies..."
    );

    await Emergency.insertMany(
      emergencies
    );


    console.log(
      "Inserting shelters..."
    );

    await Shelter.insertMany(
      shelters
    );


    console.log(
      "Inserting roads..."
    );

    await Road.insertMany(
      roads
    );


    console.log(
      "\nResQMesh database seeded successfully."
    );

    console.log(
      `Emergencies: ${emergencies.length}`
    );

    console.log(
      `Shelters: ${shelters.length}`
    );

    console.log(
      `Roads: ${roads.length}`
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "\nDatabase seed failed:"
    );

    console.error(
      error
    );

    process.exit(1);
  }
}


seedDatabase();