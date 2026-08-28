import { Router } from "express";

import {
  Person,
  Organization,
  Location,
  Vehicle,
  Phone,
  Account,
  Case,
  Event,
  Transaction,
  Relationship,
} from "../models/models";

const router = Router();

/*
==================================================
GET NETWORK
==================================================
*/

router.get("/", async (_req, res) => {
  try {
    /*
    ==============================================
    GET ALL ENTITIES
    ==============================================
    */

    const [
      persons,
      organizations,
      locations,
      vehicles,
      phones,
      accounts,
      cases,
      events,
      transactions,
    ] = await Promise.all([
      Person.find().lean(),
      Organization.find().lean(),
      Location.find().lean(),
      Vehicle.find().lean(),
      Phone.find().lean(),
      Account.find().lean(),
      Case.find().lean(),
      Event.find().lean(),
      Transaction.find().lean(),
    ]);

    /*
    ==============================================
    CREATE NODES
    ==============================================
    */

    const nodes: Array<{
      id: string;
      label: string;
      type: string;
    }> = [];

    /*
    ==============================================
    PERSON
    ==============================================
    */

    persons.forEach((person) => {
      nodes.push({
        id: person.entityId,
        label: person.name,
        type: "Person",
      });
    });

    /*
    ==============================================
    ORGANIZATION
    ==============================================
    */

    organizations.forEach((organization) => {
      nodes.push({
        id: organization.entityId,
        label: organization.name,
        type: "Organization",
      });
    });

    /*
    ==============================================
    LOCATION
    ==============================================
    */

    locations.forEach((location) => {
      nodes.push({
        id: location.entityId,
        label: location.name,
        type: "Location",
      });
    });

    /*
    ==============================================
    VEHICLE
    ==============================================
    */

    vehicles.forEach((vehicle) => {
      nodes.push({
        id: vehicle.entityId,
        label: vehicle.registrationNumber,
        type: "Vehicle",
      });
    });

    /*
    ==============================================
    PHONE
    ==============================================
    */

    phones.forEach((phone) => {
      nodes.push({
        id: phone.entityId,
        label: phone.number,
        type: "Phone",
      });
    });

    /*
    ==============================================
    BANK ACCOUNT
    ==============================================
    */

    accounts.forEach((account) => {
      nodes.push({
        id: account.entityId,
        label: account.accountNumber,
        type: "Bank Account",
      });
    });

    /*
    ==============================================
    CASE
    ==============================================
    */

    cases.forEach((crimeCase) => {
      nodes.push({
        id: crimeCase.caseId,
        label: crimeCase.title,
        type: "Case",
      });
    });

    /*
    ==============================================
    EVENT
    ==============================================
    */

    events.forEach((event) => {
      nodes.push({
        id: event.eventId,
        label: event.eventType,
        type: "Event",
      });
    });

    /*
    ==============================================
    TRANSACTION
    ==============================================
    */

    transactions.forEach((transaction) => {
      nodes.push({
        id: transaction.transactionId,
        label: transaction.transactionId,
        type: "Transaction",
      });
    });

    /*
    ==============================================
    GET RELATIONSHIPS
    ==============================================
    */

    const relationships = await Relationship.find().lean();

    /*
    ==============================================
    CREATE EDGES
    ==============================================
    */

    const edges = relationships.map((relationship) => {
      return {
        id: relationship.relationshipId,

        source: relationship.sourceId,

        target: relationship.targetId,

        type: relationship.relationshipType,

        strength: relationship.strength,
      };
    });

    /*
    ==============================================
    SEND RESPONSE
    ==============================================
    */

    res.status(200).json({
      nodes,
      edges,
    });
  } catch (error) {
    console.error("Network API error:", error);

    res.status(500).json({
      message: "Failed to build network",
    });
  }
});

export default router;
