import { Router } from "express";

import { Case } from "../models/models";

const router = Router();

/*
GET ALL CASES

GET /api/cases
*/

router.get("/", async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 }).lean();

    res.json({
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error("Cases error:", error);

    res.status(500).json({
      message: "Failed to load cases",
    });
  }
});

/*
GET ONE CASE

GET /api/cases/CASE-2026-101
*/

router.get("/:id", async (req, res) => {
  try {
    const caseItem = await Case.findOne({
      caseId: req.params.id,
    }).lean();

    if (!caseItem) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.json(caseItem);
  } catch (error) {
    console.error("Case error:", error);

    res.status(500).json({
      message: "Failed to load case",
    });
  }
});

export default router;
