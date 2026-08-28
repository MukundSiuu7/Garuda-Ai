import { Router } from "express";

import {
  Person,
  Organization,
  Location,
  Relationship,
  Transaction,
  Case,
} from "../models/models";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [
      persons,
      organizations,
      locations,
      relationships,
      transactions,
      cases,
    ] = await Promise.all([
      Person.countDocuments(),
      Organization.countDocuments(),
      Location.countDocuments(),
      Relationship.countDocuments(),
      Transaction.countDocuments(),
      Case.countDocuments(),
    ]);

    res.json({
      totalCases: cases,
      personsOfInterest: persons,
      organizations: organizations,
      locations: locations,
      connectedNetworks: 3,
      suspiciousTransactions: transactions,
      activeInvestigations: cases,
      alerts: 0,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});

export default router;
