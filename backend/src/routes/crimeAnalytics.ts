import { Router } from "express";

import { Case, Event, Relationship } from "../models/models";

const router = Router();

/*
==================================================
TYPES
==================================================
*/

interface CrimeOverTime {
  date: string;
  count: number;
}

interface CrimeCategory {
  category: string;
  count: number;
}

interface CrimeLocation {
  locationId: string;
  count: number;
}

interface TimeOfDay {
  hour: number;
  count: number;
}

interface NetworkGrowth {
  date: string;
  nodes: number;
  connections: number;
}

interface EmergingPattern {
  type: string;
  value: string;
  count: number;
}

/*
==================================================
GET CRIME ANALYTICS
==================================================
*/

router.get("/", async (_req, res) => {
  try {
    /*
    ==============================================
    GET DATA
    ==============================================
    */

    const [cases, events, relationships] = await Promise.all([
      Case.find().lean(),

      Event.find().lean(),

      Relationship.find().lean(),
    ]);

    /*
    ==============================================
    CRIME OVER TIME
    ==============================================
    */

    const crimeTimeMap = new Map<string, number>();

    cases.forEach((crimeCase) => {
      const date = new Date(crimeCase.createdAt).toISOString().split("T")[0];

      crimeTimeMap.set(
        date,

        (crimeTimeMap.get(date) ?? 0) + 1,
      );
    });

    const crimeOverTime: CrimeOverTime[] = Array.from(crimeTimeMap.entries())
      .map(([date, count]) => ({
        date,

        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    /*
    ==============================================
    CRIME CATEGORIES
    ==============================================
    */

    const categoryMap = new Map<string, number>();

    cases.forEach((crimeCase) => {
      const category = crimeCase.category || "Unknown";

      categoryMap.set(
        category,

        (categoryMap.get(category) ?? 0) + 1,
      );
    });

    const crimeCategories: CrimeCategory[] = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category,

        count,
      }))
      .sort((a, b) => b.count - a.count);

    /*
    ==============================================
    CRIME BY FICTIONAL LOCATION
    ==============================================
    */

    const locationMap = new Map<string, number>();

    cases.forEach((crimeCase) => {
      const locationId = crimeCase.locationId || "Unknown";

      locationMap.set(
        locationId,

        (locationMap.get(locationId) ?? 0) + 1,
      );
    });

    const crimeByLocation: CrimeLocation[] = Array.from(locationMap.entries())
      .map(([locationId, count]) => ({
        locationId,

        count,
      }))
      .sort((a, b) => b.count - a.count);

    /*
    ==============================================
    TIME OF DAY
    ==============================================
    */

    const hourMap = new Map<number, number>();

    /*
    Initialize all 24 hours.

    This makes the chart show
    hours with zero events too.
    */

    for (let hour = 0; hour < 24; hour++) {
      hourMap.set(hour, 0);
    }

    events.forEach((event) => {
      const date = new Date(event.timestamp);

      const hour = date.getHours();

      hourMap.set(
        hour,

        (hourMap.get(hour) ?? 0) + 1,
      );
    });

    const timeOfDay: TimeOfDay[] = Array.from(hourMap.entries()).map(
      ([hour, count]) => ({
        hour,

        count,
      }),
    );

    /*
    ==============================================
    NETWORK GROWTH
    ==============================================
    */

    interface TimelineItem {
      date: string;

      type: "node" | "connection";
    }

    const timeline: TimelineItem[] = [];

    /*
    ----------------------------------------------
    CASES = NODE CREATION
    ----------------------------------------------
    */

    cases.forEach((crimeCase) => {
      timeline.push({
        date: new Date(crimeCase.createdAt).toISOString().split("T")[0],

        type: "node",
      });
    });

    /*
    ----------------------------------------------
    RELATIONSHIPS = CONNECTION CREATION
    ----------------------------------------------
    */

    relationships.forEach((relationship) => {
      timeline.push({
        date: new Date(relationship.date).toISOString().split("T")[0],

        type: "connection",
      });
    });

    timeline.sort((a, b) => a.date.localeCompare(b.date));

    const growthMap = new Map<
      string,
      {
        nodes: number;
        connections: number;
      }
    >();

    timeline.forEach((item) => {
      if (!growthMap.has(item.date)) {
        growthMap.set(
          item.date,

          {
            nodes: 0,
            connections: 0,
          },
        );
      }

      const current = growthMap.get(item.date)!;

      if (item.type === "node") {
        current.nodes++;
      }

      if (item.type === "connection") {
        current.connections++;
      }
    });

    /*
    Convert daily counts
    into cumulative growth.
    */

    let totalNodes = 0;

    let totalConnections = 0;

    const networkGrowth: NetworkGrowth[] = Array.from(growthMap.entries()).map(
      ([date, values]) => {
        totalNodes += values.nodes;

        totalConnections += values.connections;

        return {
          date,

          nodes: totalNodes,

          connections: totalConnections,
        };
      },
    );

    /*
    ==============================================
    EMERGING PATTERNS
    ==============================================
    */

    const emergingPatterns: EmergingPattern[] = [];

    /*
    ----------------------------------------------
    TOP CRIME CATEGORY
    ----------------------------------------------
    */

    if (crimeCategories.length > 0) {
      const topCategory = crimeCategories[0];

      emergingPatterns.push({
        type: "Top Crime Category",

        value: topCategory.category,

        count: topCategory.count,
      });
    }

    /*
    ----------------------------------------------
    TOP LOCATION
    ----------------------------------------------
    */

    if (crimeByLocation.length > 0) {
      const topLocation = crimeByLocation[0];

      emergingPatterns.push({
        type: "Most Active Location",

        value: topLocation.locationId,

        count: topLocation.count,
      });
    }

    /*
    ----------------------------------------------
    PEAK HOUR
    ----------------------------------------------
    */

    const sortedHours = [...timeOfDay].sort((a, b) => b.count - a.count);

    if (sortedHours.length > 0 && sortedHours[0].count > 0) {
      emergingPatterns.push({
        type: "Peak Event Hour",

        value: `${sortedHours[0].hour}:00`,

        count: sortedHours[0].count,
      });
    }

    /*
    ==============================================
    SUMMARY
    ==============================================
    */

    const summary = {
      totalCases: cases.length,

      totalEvents: events.length,

      totalRelationships: relationships.length,

      categories: crimeCategories.length,

      locations: crimeByLocation.length,
    };

    /*
    ==============================================
    RESPONSE
    ==============================================
    */

    res.status(200).json({
      summary,

      crimeOverTime,

      crimeCategories,

      crimeByLocation,

      timeOfDay,

      networkGrowth,

      emergingPatterns,
    });
  } catch (error) {
    console.error("Crime analytics error:", error);

    res.status(500).json({
      message: "Failed to calculate crime analytics",
    });
  }
});

export default router;
