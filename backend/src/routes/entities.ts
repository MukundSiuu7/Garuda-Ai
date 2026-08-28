import { Router } from "express";

import {
  Person,
  Organization,
  Location,
  Vehicle,
  Phone,
  Account,
} from "../models/models";

const router = Router();

/*
GET ALL ENTITIES
GET /api/entities
*/

router.get("/", async (req, res) => {
  try {
    const [persons, organizations, locations, vehicles, phones, accounts] =
      await Promise.all([
        Person.find().lean(),
        Organization.find().lean(),
        Location.find().lean(),
        Vehicle.find().lean(),
        Phone.find().lean(),
        Account.find().lean(),
      ]);

    const entities = [
      ...persons,
      ...organizations,
      ...locations,
      ...vehicles,
      ...phones,
      ...accounts,
    ];

    res.json({
      count: entities.length,
      entities,
    });
  } catch (error) {
    console.error("Entities error:", error);

    res.status(500).json({
      message: "Failed to load entities",
    });
  }
});

/*
GET ONE ENTITY
GET /api/entities/:id
*/

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let entity = null;

    // Search Person
    entity = await Person.findOne({
      entityId: id,
    }).lean();

    // Search Organization
    if (!entity) {
      entity = await Organization.findOne({
        entityId: id,
      }).lean();
    }

    // Search Location
    if (!entity) {
      entity = await Location.findOne({
        entityId: id,
      }).lean();
    }

    // Search Vehicle
    if (!entity) {
      entity = await Vehicle.findOne({
        entityId: id,
      }).lean();
    }

    // Search Phone
    if (!entity) {
      entity = await Phone.findOne({
        entityId: id,
      }).lean();
    }

    // Search Account
    if (!entity) {
      entity = await Account.findOne({
        entityId: id,
      }).lean();
    }

    // Nothing found
    if (!entity) {
      return res.status(404).json({
        message: "Entity not found",
      });
    }

    // Return entity
    res.json(entity);
  } catch (error) {
    console.error("Entity error:", error);

    res.status(500).json({
      message: "Failed to load entity",
    });
  }
});

export default router;
