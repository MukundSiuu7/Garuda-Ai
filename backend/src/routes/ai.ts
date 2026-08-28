import { Router } from "express";

import {
  Case,
  Person,
  Organization,
  Location,
  Vehicle,
  Phone,
  Account,
  Event,
  Transaction,
  Relationship,
} from "../models/models";

import { askAI } from "../services/aiService";

const router = Router();

/*
==================================================
GET /api/ai/test
==================================================
*/

router.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "AI route is working",
  });
});

/*
==================================================
POST /api/ai/ask
==================================================
*/

router.post("/ask", async (req, res) => {
  try {
    /*
    ==============================================
    GET REQUEST DATA
    ==============================================
    */

    const { question, caseId } = req.body;

    /*
    ==============================================
    VALIDATE QUESTION
    ==============================================
    */

    if (typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    /*
    ==============================================
    QUESTION LENGTH
    ==============================================
    */

    if (question.length > 2000) {
      return res.status(400).json({
        message: "Question is too long",
      });
    }

    /*
    ==============================================
    CLEAN CASE ID
    ==============================================
    */

    const cleanCaseId = typeof caseId === "string" ? caseId.trim() : "";

    /*
    ==============================================
    CASE DATA
    ==============================================
    */

    let caseData: any = null;

    if (cleanCaseId) {
      caseData = await Case.findOne({
        caseId: cleanCaseId,
      }).lean();

      if (!caseData) {
        return res.status(404).json({
          message: `Case ${cleanCaseId} was not found`,
        });
      }
    }

    /*
    ==============================================
    INITIAL ARRAYS
    ==============================================
    */

    let entities: any[] = [];

    let relationships: any[] = [];

    /*
    ==============================================
    FIND CASE RELATIONSHIPS
    ==============================================
    */

    if (cleanCaseId) {
      relationships = await Relationship.find({
        $or: [
          {
            sourceId: cleanCaseId,
          },
          {
            targetId: cleanCaseId,
          },
        ],
      }).lean();

      /*
      ============================================
      COLLECT ENTITY IDS
      ============================================
      */

      const entityIds = new Set<string>();

      entityIds.add(cleanCaseId);

      relationships.forEach((relationship: any) => {
        if (relationship.sourceId) {
          entityIds.add(relationship.sourceId);
        }

        if (relationship.targetId) {
          entityIds.add(relationship.targetId);
        }
      });

      const ids = Array.from(entityIds);

      /*
      ============================================
      FETCH ALL ENTITY TYPES
      ============================================
      */

      const [
        people,
        organizations,
        locations,
        vehicles,
        phones,
        accounts,
        events,
        transactions,
      ] = await Promise.all([
        /*
        ------------------------------------------
        PEOPLE
        ------------------------------------------
        */

        Person.find({
          entityId: {
            $in: ids,
          },
        }).lean(),

        /*
        ------------------------------------------
        ORGANIZATIONS
        ------------------------------------------
        */

        Organization.find({
          entityId: {
            $in: ids,
          },
        }).lean(),

        /*
        ------------------------------------------
        LOCATIONS
        ------------------------------------------
        */

        Location.find({
          entityId: {
            $in: ids,
          },
        }).lean(),

        /*
        ------------------------------------------
        VEHICLES
        ------------------------------------------
        */

        Vehicle.find({
          entityId: {
            $in: ids,
          },
        }).lean(),

        /*
        ------------------------------------------
        PHONES
        ------------------------------------------
        */

        Phone.find({
          entityId: {
            $in: ids,
          },
        }).lean(),

        /*
        ------------------------------------------
        ACCOUNTS
        ------------------------------------------
        */

        Account.find({
          entityId: {
            $in: ids,
          },
        }).lean(),

        /*
        ------------------------------------------
        EVENTS
        ------------------------------------------
        */

        Event.find({
          $or: [
            {
              caseId: cleanCaseId,
            },
            {
              entityId: {
                $in: ids,
              },
            },
          ],
        }).lean(),

        /*
        ------------------------------------------
        TRANSACTIONS
        ------------------------------------------
        */

        Transaction.find({
          $or: [
            {
              sender: {
                $in: ids,
              },
            },
            {
              receiver: {
                $in: ids,
              },
            },
          ],
        }).lean(),
      ]);

      /*
      ============================================
      COMBINE ENTITY DATA
      ============================================
      */

      entities = [
        ...people,
        ...organizations,
        ...locations,
        ...vehicles,
        ...phones,
        ...accounts,
      ];
    }

    /*
    ==============================================
    BUILD AI REQUEST
    ==============================================
    */

    const result = await askAI({
      question: question.trim(),
      caseData,
      entities,
      relationships,
    });

    /*
    ==============================================
    SEND RESPONSE
    ==============================================
    */

    return res.status(200).json({
      answer: result.answer,
      source: result.source,

      context: {
        caseId: cleanCaseId || null,
        entityCount: entities.length,
        relationshipCount: relationships.length,
      },
    });
  } catch (error) {
    console.error("AI route error:", error);

    return res.status(500).json({
      message: "Failed to process AI request",
    });
  }
});

export default router;
