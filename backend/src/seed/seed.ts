import { setServers } from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

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

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers?.length) {
  setServers(dnsServers);
}

const persons = [
  {
    entityId: "P-001",
    name: "Aarav Deshmukh",
    type: "Person",
    age: 34,
    occupation: "Logistics Manager",
    priorityScore: 82,
    network: "Network-A",
    lastActivity: "2026-08-20T14:30:00.000Z",
  },
  {
    entityId: "P-002",
    name: "Meera Kulkarni",
    type: "Person",
    age: 29,
    occupation: "Chartered Accountant",
    priorityScore: 64,
    network: "Network-B",
    lastActivity: "2026-08-21T09:15:00.000Z",
  },
  {
    entityId: "P-003",
    name: "Rohan Patil",
    type: "Person",
    age: 41,
    occupation: "Transport Contractor",
    priorityScore: 77,
    network: "Network-A",
    lastActivity: "2026-08-19T18:45:00.000Z",
  },
  {
    entityId: "P-004",
    name: "Ishita Joshi",
    type: "Person",
    age: 31,
    occupation: "Software Consultant",
    priorityScore: 51,
    network: "Network-C",
    lastActivity: "2026-08-22T11:20:00.000Z",
  },
  {
    entityId: "P-005",
    name: "Vikram Shinde",
    type: "Person",
    age: 38,
    occupation: "Warehouse Supervisor",
    priorityScore: 73,
    network: "Network-A",
    lastActivity: "2026-08-20T16:10:00.000Z",
  },
  {
    entityId: "P-006",
    name: "Sneha Pawar",
    type: "Person",
    age: 27,
    occupation: "Banking Executive",
    priorityScore: 46,
    network: "Network-B",
    lastActivity: "2026-08-23T10:05:00.000Z",
  },
  {
    entityId: "P-007",
    name: "Aditya More",
    type: "Person",
    age: 35,
    occupation: "Real Estate Consultant",
    priorityScore: 69,
    network: "Network-B",
    lastActivity: "2026-08-18T13:40:00.000Z",
  },
  {
    entityId: "P-008",
    name: "Kavya Bhosale",
    type: "Person",
    age: 26,
    occupation: "Digital Marketing Specialist",
    priorityScore: 42,
    network: "Network-C",
    lastActivity: "2026-08-24T15:25:00.000Z",
  },
  {
    entityId: "P-009",
    name: "Nikhil Jadhav",
    type: "Person",
    age: 44,
    occupation: "Automobile Dealer",
    priorityScore: 71,
    network: "Network-A",
    lastActivity: "2026-08-17T12:10:00.000Z",
  },
  {
    entityId: "P-010",
    name: "Tanvi Chavan",
    type: "Person",
    age: 33,
    occupation: "Legal Consultant",
    priorityScore: 58,
    network: "Network-C",
    lastActivity: "2026-08-22T17:35:00.000Z",
  },
  {
    entityId: "P-011",
    name: "Siddharth Gaikwad",
    type: "Person",
    age: 37,
    occupation: "Import Coordinator",
    priorityScore: 75,
    network: "Network-A",
    lastActivity: "2026-08-19T20:15:00.000Z",
  },
  {
    entityId: "P-012",
    name: "Priya Salunkhe",
    type: "Person",
    age: 30,
    occupation: "Financial Analyst",
    priorityScore: 62,
    network: "Network-B",
    lastActivity: "2026-08-21T14:50:00.000Z",
  },
  {
    entityId: "P-013",
    name: "Manav Kshirsagar",
    type: "Person",
    age: 39,
    occupation: "Fleet Manager",
    priorityScore: 68,
    network: "Network-A",
    lastActivity: "2026-08-20T08:30:00.000Z",
  },
  {
    entityId: "P-014",
    name: "Riya Wagh",
    type: "Person",
    age: 28,
    occupation: "Graphic Designer",
    priorityScore: 39,
    network: "Network-C",
    lastActivity: "2026-08-24T12:45:00.000Z",
  },
  {
    entityId: "P-015",
    name: "Omkar Sawant",
    type: "Person",
    age: 42,
    occupation: "Construction Contractor",
    priorityScore: 66,
    network: "Network-B",
    lastActivity: "2026-08-18T16:55:00.000Z",
  },
  {
    entityId: "P-016",
    name: "Ananya Mahajan",
    type: "Person",
    age: 32,
    occupation: "Data Analyst",
    priorityScore: 55,
    network: "Network-C",
    lastActivity: "2026-08-23T18:20:00.000Z",
  },
  {
    entityId: "P-017",
    name: "Harsh Vartak",
    type: "Person",
    age: 36,
    occupation: "Retail Business Owner",
    priorityScore: 61,
    network: "Network-B",
    lastActivity: "2026-08-19T10:40:00.000Z",
  },
  {
    entityId: "P-018",
    name: "Neelam Koli",
    type: "Person",
    age: 45,
    occupation: "Property Manager",
    priorityScore: 57,
    network: "Network-B",
    lastActivity: "2026-08-17T15:30:00.000Z",
  },
  {
    entityId: "P-019",
    name: "Yash Thakur",
    type: "Person",
    age: 25,
    occupation: "Delivery Coordinator",
    priorityScore: 44,
    network: "Network-A",
    lastActivity: "2026-08-24T09:05:00.000Z",
  },
  {
    entityId: "P-020",
    name: "Mihir Gokhale",
    type: "Person",
    age: 40,
    occupation: "Business Consultant",
    priorityScore: 63,
    network: "Network-C",
    lastActivity: "2026-08-21T19:10:00.000Z",
  },
];

const organizations = [
  {
    entityId: "O-001",
    name: "Western Route Logistics",
    type: "Organization",
    category: "Logistics",
    priorityScore: 72,
  },
  {
    entityId: "O-002",
    name: "Sahyadri Trade Solutions",
    type: "Organization",
    category: "Import Export",
    priorityScore: 67,
  },
  {
    entityId: "O-003",
    name: "BluePeak Consulting",
    type: "Organization",
    category: "Consulting",
    priorityScore: 54,
  },
  {
    entityId: "O-004",
    name: "Metroline Auto Works",
    type: "Organization",
    category: "Automobile",
    priorityScore: 61,
  },
  {
    entityId: "O-005",
    name: "Konkan Property Services",
    type: "Organization",
    category: "Real Estate",
    priorityScore: 59,
  },
  {
    entityId: "O-006",
    name: "Deccan Digital Systems",
    type: "Organization",
    category: "Technology",
    priorityScore: 48,
  },
  {
    entityId: "O-007",
    name: "Maharashtra Warehouse Network",
    type: "Organization",
    category: "Warehousing",
    priorityScore: 70,
  },
  {
    entityId: "O-008",
    name: "Harborview Financial Services",
    type: "Organization",
    category: "Financial Services",
    priorityScore: 63,
  },
];

const locations = [
  {
    entityId: "L-001",
    name: "Andheri East, Mumbai",
    type: "Location",
    region: "Mumbai Suburban",
  },
  {
    entityId: "L-002",
    name: "Navi Mumbai Industrial Area",
    type: "Location",
    region: "Thane",
  },
  {
    entityId: "L-003",
    name: "Pune Camp",
    type: "Location",
    region: "Pune",
  },
  {
    entityId: "L-004",
    name: "Pimpri-Chinchwad",
    type: "Location",
    region: "Pune",
  },
  {
    entityId: "L-005",
    name: "Nashik Road",
    type: "Location",
    region: "Nashik",
  },
  {
    entityId: "L-006",
    name: "Nagpur Central",
    type: "Location",
    region: "Nagpur",
  },
  {
    entityId: "L-007",
    name: "Aurangabad Industrial Area",
    type: "Location",
    region: "Chhatrapati Sambhajinagar",
  },
  {
    entityId: "L-008",
    name: "Kolhapur Market District",
    type: "Location",
    region: "Kolhapur",
  },
  {
    entityId: "L-009",
    name: "Thane West",
    type: "Location",
    region: "Thane",
  },
  {
    entityId: "L-010",
    name: "Vasai East",
    type: "Location",
    region: "Palghar",
  },
];

const vehicles = [
  {
    entityId: "V-001",
    registrationNumber: "MH-01-AB-2101",
    model: "Tata Nexon",
    type: "Vehicle",
    ownerId: "P-001",
  },
  {
    entityId: "V-002",
    registrationNumber: "MH-43-CD-3182",
    model: "Mahindra Scorpio",
    type: "Vehicle",
    ownerId: "P-003",
  },
  {
    entityId: "V-003",
    registrationNumber: "MH-12-EF-4427",
    model: "Toyota Innova Crysta",
    type: "Vehicle",
    ownerId: "P-005",
  },
  {
    entityId: "V-004",
    registrationNumber: "MH-14-GH-5274",
    model: "Hyundai Creta",
    type: "Vehicle",
    ownerId: "P-007",
  },
  {
    entityId: "V-005",
    registrationNumber: "MH-15-JK-6318",
    model: "Maruti Suzuki Baleno",
    type: "Vehicle",
    ownerId: "P-009",
  },
  {
    entityId: "V-006",
    registrationNumber: "MH-31-LM-7452",
    model: "Tata Harrier",
    type: "Vehicle",
    ownerId: "P-011",
  },
  {
    entityId: "V-007",
    registrationNumber: "MH-20-NP-8563",
    model: "Mahindra Bolero",
    type: "Vehicle",
    ownerId: "P-013",
  },
  {
    entityId: "V-008",
    registrationNumber: "MH-09-QR-9641",
    model: "Honda City",
    type: "Vehicle",
    ownerId: "P-015",
  },
  {
    entityId: "V-009",
    registrationNumber: "MH-04-ST-1736",
    model: "Kia Seltos",
    type: "Vehicle",
    ownerId: "P-017",
  },
  {
    entityId: "V-010",
    registrationNumber: "MH-46-UV-2859",
    model: "Force Traveller",
    type: "Vehicle",
    ownerId: "P-019",
  },
];

const phones = [
  {
    entityId: "PH-001",
    number: "+91-9000011001",
    type: "Phone",
    ownerId: "P-001",
  },
  {
    entityId: "PH-002",
    number: "+91-9000011002",
    type: "Phone",
    ownerId: "P-002",
  },
  {
    entityId: "PH-003",
    number: "+91-9000011003",
    type: "Phone",
    ownerId: "P-003",
  },
  {
    entityId: "PH-004",
    number: "+91-9000011004",
    type: "Phone",
    ownerId: "P-004",
  },
  {
    entityId: "PH-005",
    number: "+91-9000011005",
    type: "Phone",
    ownerId: "P-005",
  },
  {
    entityId: "PH-006",
    number: "+91-9000011006",
    type: "Phone",
    ownerId: "P-006",
  },
  {
    entityId: "PH-007",
    number: "+91-9000011007",
    type: "Phone",
    ownerId: "P-007",
  },
  {
    entityId: "PH-008",
    number: "+91-9000011008",
    type: "Phone",
    ownerId: "P-008",
  },
  {
    entityId: "PH-009",
    number: "+91-9000011009",
    type: "Phone",
    ownerId: "P-009",
  },
  {
    entityId: "PH-010",
    number: "+91-9000011010",
    type: "Phone",
    ownerId: "P-010",
  },
];

const accounts = [
  {
    entityId: "A-001",
    accountNumber: "ACCT-700001",
    bankName: "Sahyadri Crest Bank",
    type: "Bank Account",
    ownerId: "P-001",
    balance: 185000,
  },
  {
    entityId: "A-002",
    accountNumber: "ACCT-700002",
    bankName: "Western Horizon Bank",
    type: "Bank Account",
    ownerId: "P-002",
    balance: 245000,
  },
  {
    entityId: "A-003",
    accountNumber: "ACCT-700003",
    bankName: "Deccan Unity Bank",
    type: "Bank Account",
    ownerId: "P-003",
    balance: 318000,
  },
  {
    entityId: "A-004",
    accountNumber: "ACCT-700004",
    bankName: "Konkan Trust Bank",
    type: "Bank Account",
    ownerId: "P-005",
    balance: 127500,
  },
  {
    entityId: "A-005",
    accountNumber: "ACCT-700005",
    bankName: "Maharashtra Meridian Bank",
    type: "Bank Account",
    ownerId: "P-007",
    balance: 452000,
  },
  {
    entityId: "A-006",
    accountNumber: "ACCT-700006",
    bankName: "BlueRiver Cooperative Bank",
    type: "Bank Account",
    ownerId: "P-009",
    balance: 196500,
  },
  {
    entityId: "A-007",
    accountNumber: "ACCT-700007",
    bankName: "Sahyadri National Bank",
    type: "Bank Account",
    ownerId: "P-011",
    balance: 375000,
  },
  {
    entityId: "A-008",
    accountNumber: "ACCT-700008",
    bankName: "Urban Crest Finance Bank",
    type: "Bank Account",
    ownerId: "P-013",
    balance: 154000,
  },
  {
    entityId: "A-009",
    accountNumber: "ACCT-700009",
    bankName: "Deccan Valley Bank",
    type: "Bank Account",
    ownerId: "P-015",
    balance: 289000,
  },
  {
    entityId: "A-010",
    accountNumber: "ACCT-700010",
    bankName: "Western Arcadia Bank",
    type: "Bank Account",
    ownerId: "P-017",
    balance: 221000,
  },
];

const cases = [
  {
    caseId: "C-001",
    title: "Warehouse Inventory Discrepancy",
    category: "Property",
    status: "Open",
    priority: "High",
    locationId: "L-002",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    caseId: "C-002",
    title: "Unverified Freight Documentation",
    category: "Logistics",
    status: "Under Review",
    priority: "Medium",
    locationId: "L-003",
    createdAt: "2026-08-03T10:30:00.000Z",
  },
  {
    caseId: "C-003",
    title: "Digital Account Access Review",
    category: "Cyber",
    status: "Open",
    priority: "Medium",
    locationId: "L-006",
    createdAt: "2026-08-05T14:15:00.000Z",
  },
  {
    caseId: "C-004",
    title: "Commercial Vehicle Incident",
    category: "Transport",
    status: "Closed",
    priority: "Low",
    locationId: "L-004",
    createdAt: "2026-08-06T08:45:00.000Z",
  },
  {
    caseId: "C-005",
    title: "Property Document Dispute",
    category: "Property",
    status: "Under Review",
    priority: "High",
    locationId: "L-009",
    createdAt: "2026-08-08T12:20:00.000Z",
  },
  {
    caseId: "C-006",
    title: "Repeated Vendor Payments",
    category: "Financial",
    status: "Open",
    priority: "High",
    locationId: "L-001",
    createdAt: "2026-08-10T16:00:00.000Z",
  },
  {
    caseId: "C-007",
    title: "Import Record Mismatch",
    category: "Trade",
    status: "Open",
    priority: "Medium",
    locationId: "L-002",
    createdAt: "2026-08-12T11:10:00.000Z",
  },
  {
    caseId: "C-008",
    title: "Warehouse Access Review",
    category: "Security",
    status: "Under Review",
    priority: "Medium",
    locationId: "L-010",
    createdAt: "2026-08-14T18:25:00.000Z",
  },
  {
    caseId: "C-009",
    title: "Retail Payment Pattern Review",
    category: "Financial",
    status: "Open",
    priority: "Low",
    locationId: "L-008",
    createdAt: "2026-08-16T13:35:00.000Z",
  },
  {
    caseId: "C-010",
    title: "Fleet Movement Documentation",
    category: "Transport",
    status: "Closed",
    priority: "Low",
    locationId: "L-005",
    createdAt: "2026-08-18T09:50:00.000Z",
  },
];

const events = [
  {
    eventId: "E-001",
    entityId: "P-001",
    caseId: "C-001",
    eventType: "WAREHOUSE_VISIT",
    locationId: "L-002",
    description: "Person recorded a visit to the warehouse area.",
    timestamp: "2026-08-01T11:20:00.000Z",
  },
  {
    eventId: "E-002",
    entityId: "P-005",
    caseId: "C-001",
    eventType: "INVENTORY_REVIEW",
    locationId: "L-002",
    description:
      "Inventory records were reviewed during a scheduled inspection.",
    timestamp: "2026-08-02T15:10:00.000Z",
  },
  {
    eventId: "E-003",
    entityId: "P-003",
    caseId: "C-002",
    eventType: "DOCUMENT_SUBMISSION",
    locationId: "L-003",
    description: "Freight documentation was submitted for review.",
    timestamp: "2026-08-03T12:45:00.000Z",
  },
  {
    eventId: "E-004",
    entityId: "P-004",
    caseId: "C-003",
    eventType: "ACCOUNT_REVIEW",
    locationId: "L-006",
    description: "Digital account access records were reviewed.",
    timestamp: "2026-08-05T16:20:00.000Z",
  },
  {
    eventId: "E-005",
    entityId: "P-009",
    caseId: "C-004",
    eventType: "VEHICLE_INSPECTION",
    locationId: "L-004",
    description:
      "Vehicle documentation was inspected after a reported incident.",
    timestamp: "2026-08-06T10:30:00.000Z",
  },
  {
    eventId: "E-006",
    entityId: "P-007",
    caseId: "C-005",
    eventType: "PROPERTY_MEETING",
    locationId: "L-009",
    description: "A property-related meeting was recorded.",
    timestamp: "2026-08-08T14:40:00.000Z",
  },
  {
    eventId: "E-007",
    entityId: "P-002",
    caseId: "C-006",
    eventType: "FINANCIAL_REVIEW",
    locationId: "L-001",
    description:
      "Financial records were reviewed as part of a transaction analysis.",
    timestamp: "2026-08-10T17:15:00.000Z",
  },
  {
    eventId: "E-008",
    entityId: "P-011",
    caseId: "C-007",
    eventType: "IMPORT_DOCUMENT_CHECK",
    locationId: "L-002",
    description: "Import documentation was checked against available records.",
    timestamp: "2026-08-12T13:20:00.000Z",
  },
  {
    eventId: "E-009",
    entityId: "P-013",
    caseId: "C-008",
    eventType: "ACCESS_LOG_REVIEW",
    locationId: "L-010",
    description: "Warehouse access logs were reviewed.",
    timestamp: "2026-08-14T19:10:00.000Z",
  },
  {
    eventId: "E-010",
    entityId: "P-017",
    caseId: "C-009",
    eventType: "PAYMENT_REVIEW",
    locationId: "L-008",
    description: "Retail payment records were reviewed.",
    timestamp: "2026-08-16T15:00:00.000Z",
  },
  {
    eventId: "E-011",
    entityId: "P-019",
    caseId: "C-010",
    eventType: "FLEET_CHECK",
    locationId: "L-005",
    description: "Fleet movement records were checked against documentation.",
    timestamp: "2026-08-18T11:15:00.000Z",
  },
  {
    eventId: "E-012",
    entityId: "P-003",
    caseId: "C-001",
    eventType: "PHONE_CONTACT",
    locationId: "L-002",
    description:
      "A recorded phone contact was associated with the case review.",
    timestamp: "2026-08-19T09:30:00.000Z",
  },
  {
    eventId: "E-013",
    entityId: "P-001",
    caseId: "C-002",
    eventType: "LOGISTICS_MEETING",
    locationId: "L-003",
    description: "A logistics meeting was recorded during document review.",
    timestamp: "2026-08-19T14:05:00.000Z",
  },
  {
    eventId: "E-014",
    entityId: "P-005",
    caseId: "C-007",
    eventType: "WAREHOUSE_ENTRY",
    locationId: "L-002",
    description: "A warehouse entry was recorded during the review period.",
    timestamp: "2026-08-20T08:40:00.000Z",
  },
  {
    eventId: "E-015",
    entityId: "P-011",
    caseId: "C-006",
    eventType: "BANK_CONTACT",
    locationId: "L-001",
    description: "A banking-related contact was recorded.",
    timestamp: "2026-08-21T10:50:00.000Z",
  },
  {
    eventId: "E-016",
    entityId: "P-007",
    caseId: "C-005",
    eventType: "PROPERTY_DOCUMENT",
    locationId: "L-009",
    description: "Property documentation was submitted for review.",
    timestamp: "2026-08-22T13:30:00.000Z",
  },
  {
    eventId: "E-017",
    entityId: "P-004",
    caseId: "C-003",
    eventType: "SYSTEM_ACCESS",
    locationId: "L-006",
    description: "A system access event was recorded for analysis.",
    timestamp: "2026-08-23T09:25:00.000Z",
  },
  {
    eventId: "E-018",
    entityId: "P-008",
    caseId: "C-009",
    eventType: "DIGITAL_CONTACT",
    locationId: "L-008",
    description: "A digital communication event was recorded.",
    timestamp: "2026-08-23T16:45:00.000Z",
  },
  {
    eventId: "E-019",
    entityId: "P-015",
    caseId: "C-005",
    eventType: "CONTRACT_REVIEW",
    locationId: "L-009",
    description: "A commercial contract was reviewed.",
    timestamp: "2026-08-24T11:35:00.000Z",
  },
  {
    eventId: "E-020",
    entityId: "P-020",
    caseId: "C-010",
    eventType: "CONSULTATION",
    locationId: "L-005",
    description: "A consultation concerning fleet documentation was recorded.",
    timestamp: "2026-08-24T18:00:00.000Z",
  },
];

const transactions = [
  {
    transactionId: "T-001",
    sender: "A-001",
    receiver: "A-003",
    amount: 45000,
    timestamp: "2026-08-01T10:15:00.000Z",
    locationId: "L-002",
    category: "Logistics Payment",
  },
  {
    transactionId: "T-002",
    sender: "A-003",
    receiver: "A-005",
    amount: 32000,
    timestamp: "2026-08-03T13:20:00.000Z",
    locationId: "L-003",
    category: "Consulting Payment",
  },
  {
    transactionId: "T-003",
    sender: "A-005",
    receiver: "A-007",
    amount: 58000,
    timestamp: "2026-08-05T15:45:00.000Z",
    locationId: "L-001",
    category: "Property Services",
  },
  {
    transactionId: "T-004",
    sender: "A-007",
    receiver: "A-001",
    amount: 27000,
    timestamp: "2026-08-07T09:30:00.000Z",
    locationId: "L-002",
    category: "Vendor Payment",
  },
  {
    transactionId: "T-005",
    sender: "A-002",
    receiver: "A-006",
    amount: 18500,
    timestamp: "2026-08-09T11:10:00.000Z",
    locationId: "L-009",
    category: "Professional Services",
  },
  {
    transactionId: "T-006",
    sender: "A-006",
    receiver: "A-009",
    amount: 41000,
    timestamp: "2026-08-10T16:25:00.000Z",
    locationId: "L-008",
    category: "Construction Payment",
  },
  {
    transactionId: "T-007",
    sender: "A-009",
    receiver: "A-004",
    amount: 22500,
    timestamp: "2026-08-12T12:40:00.000Z",
    locationId: "L-004",
    category: "Vehicle Services",
  },
  {
    transactionId: "T-008",
    sender: "A-004",
    receiver: "A-008",
    amount: 17500,
    timestamp: "2026-08-13T14:05:00.000Z",
    locationId: "L-005",
    category: "Fleet Services",
  },
  {
    transactionId: "T-009",
    sender: "A-008",
    receiver: "A-010",
    amount: 36000,
    timestamp: "2026-08-15T17:30:00.000Z",
    locationId: "L-005",
    category: "Business Services",
  },
  {
    transactionId: "T-010",
    sender: "A-010",
    receiver: "A-002",
    amount: 19500,
    timestamp: "2026-08-16T10:50:00.000Z",
    locationId: "L-008",
    category: "Retail Services",
  },
  {
    transactionId: "T-011",
    sender: "A-001",
    receiver: "A-005",
    amount: 12000,
    timestamp: "2026-08-18T09:15:00.000Z",
    locationId: "L-002",
    category: "Logistics Payment",
  },
  {
    transactionId: "T-012",
    sender: "A-005",
    receiver: "A-003",
    amount: 14500,
    timestamp: "2026-08-19T11:35:00.000Z",
    locationId: "L-003",
    category: "Consulting Payment",
  },
  {
    transactionId: "T-013",
    sender: "A-003",
    receiver: "A-007",
    amount: 21000,
    timestamp: "2026-08-20T13:05:00.000Z",
    locationId: "L-001",
    category: "Vendor Payment",
  },
  {
    transactionId: "T-014",
    sender: "A-007",
    receiver: "A-009",
    amount: 33500,
    timestamp: "2026-08-21T15:20:00.000Z",
    locationId: "L-009",
    category: "Property Services",
  },
  {
    transactionId: "T-015",
    sender: "A-009",
    receiver: "A-006",
    amount: 16500,
    timestamp: "2026-08-22T10:40:00.000Z",
    locationId: "L-008",
    category: "Construction Payment",
  },
  {
    transactionId: "T-016",
    sender: "A-006",
    receiver: "A-001",
    amount: 28000,
    timestamp: "2026-08-23T12:15:00.000Z",
    locationId: "L-001",
    category: "Business Payment",
  },
  {
    transactionId: "T-017",
    sender: "A-002",
    receiver: "A-008",
    amount: 24000,
    timestamp: "2026-08-23T16:30:00.000Z",
    locationId: "L-005",
    category: "Fleet Services",
  },
  {
    transactionId: "T-018",
    sender: "A-008",
    receiver: "A-004",
    amount: 13000,
    timestamp: "2026-08-24T09:45:00.000Z",
    locationId: "L-004",
    category: "Vehicle Services",
  },
  {
    transactionId: "T-019",
    sender: "A-004",
    receiver: "A-010",
    amount: 29500,
    timestamp: "2026-08-24T14:20:00.000Z",
    locationId: "L-005",
    category: "Business Services",
  },
  {
    transactionId: "T-020",
    sender: "A-010",
    receiver: "A-002",
    amount: 11000,
    timestamp: "2026-08-24T18:10:00.000Z",
    locationId: "L-008",
    category: "Retail Services",
  },
];

const relationships = [
  {
    relationshipId: "R-001",
    sourceId: "P-001",
    targetId: "P-003",
    relationshipType: "KNOWS",
    strength: 0.82,
    date: "2026-08-01T10:00:00.000Z",
    source: "Case Records",
  },
  {
    relationshipId: "R-002",
    sourceId: "P-001",
    targetId: "O-001",
    relationshipType: "WORKS_WITH",
    strength: 0.91,
    date: "2026-08-02T11:30:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-003",
    sourceId: "P-003",
    targetId: "O-001",
    relationshipType: "WORKS_WITH",
    strength: 0.86,
    date: "2026-08-03T09:20:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-004",
    sourceId: "P-005",
    targetId: "O-007",
    relationshipType: "WORKS_WITH",
    strength: 0.88,
    date: "2026-08-04T14:00:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-005",
    sourceId: "P-007",
    targetId: "O-005",
    relationshipType: "WORKS_WITH",
    strength: 0.79,
    date: "2026-08-05T12:10:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-006",
    sourceId: "P-011",
    targetId: "O-002",
    relationshipType: "WORKS_WITH",
    strength: 0.84,
    date: "2026-08-06T16:25:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-007",
    sourceId: "P-013",
    targetId: "O-007",
    relationshipType: "WORKS_WITH",
    strength: 0.81,
    date: "2026-08-07T10:15:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-008",
    sourceId: "P-017",
    targetId: "O-006",
    relationshipType: "WORKS_WITH",
    strength: 0.67,
    date: "2026-08-08T13:45:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-009",
    sourceId: "P-004",
    targetId: "O-003",
    relationshipType: "WORKS_WITH",
    strength: 0.76,
    date: "2026-08-09T09:35:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-010",
    sourceId: "P-002",
    targetId: "O-008",
    relationshipType: "WORKS_WITH",
    strength: 0.73,
    date: "2026-08-10T11:20:00.000Z",
    source: "Organization Records",
  },
  {
    relationshipId: "R-011",
    sourceId: "P-001",
    targetId: "V-001",
    relationshipType: "OWNS",
    strength: 0.98,
    date: "2026-08-11T08:30:00.000Z",
    source: "Vehicle Records",
  },
  {
    relationshipId: "R-012",
    sourceId: "P-003",
    targetId: "V-002",
    relationshipType: "OWNS",
    strength: 0.98,
    date: "2026-08-12T08:45:00.000Z",
    source: "Vehicle Records",
  },
  {
    relationshipId: "R-013",
    sourceId: "P-005",
    targetId: "V-003",
    relationshipType: "OWNS",
    strength: 0.98,
    date: "2026-08-13T09:00:00.000Z",
    source: "Vehicle Records",
  },
  {
    relationshipId: "R-014",
    sourceId: "P-007",
    targetId: "V-004",
    relationshipType: "OWNS",
    strength: 0.98,
    date: "2026-08-14T09:15:00.000Z",
    source: "Vehicle Records",
  },
  {
    relationshipId: "R-015",
    sourceId: "P-009",
    targetId: "V-005",
    relationshipType: "OWNS",
    strength: 0.98,
    date: "2026-08-15T09:30:00.000Z",
    source: "Vehicle Records",
  },
  {
    relationshipId: "R-016",
    sourceId: "P-011",
    targetId: "A-007",
    relationshipType: "OWNS",
    strength: 0.97,
    date: "2026-08-16T10:00:00.000Z",
    source: "Bank Records",
  },
  {
    relationshipId: "R-017",
    sourceId: "P-001",
    targetId: "L-002",
    relationshipType: "VISITED",
    strength: 0.71,
    date: "2026-08-17T11:15:00.000Z",
    source: "Event Records",
  },
  {
    relationshipId: "R-018",
    sourceId: "P-003",
    targetId: "L-003",
    relationshipType: "VISITED",
    strength: 0.68,
    date: "2026-08-18T12:20:00.000Z",
    source: "Event Records",
  },
  {
    relationshipId: "R-019",
    sourceId: "P-007",
    targetId: "L-009",
    relationshipType: "VISITED",
    strength: 0.74,
    date: "2026-08-19T13:30:00.000Z",
    source: "Event Records",
  },
  {
    relationshipId: "R-020",
    sourceId: "P-011",
    targetId: "L-002",
    relationshipType: "VISITED",
    strength: 0.77,
    date: "2026-08-20T14:40:00.000Z",
    source: "Event Records",
  },
  {
    relationshipId: "R-021",
    sourceId: "P-001",
    targetId: "C-001",
    relationshipType: "ASSOCIATED_WITH",
    strength: 0.72,
    date: "2026-08-20T15:00:00.000Z",
    source: "Case Records",
  },
  {
    relationshipId: "R-022",
    sourceId: "P-003",
    targetId: "C-002",
    relationshipType: "ASSOCIATED_WITH",
    strength: 0.69,
    date: "2026-08-21T10:10:00.000Z",
    source: "Case Records",
  },
  {
    relationshipId: "R-023",
    sourceId: "P-004",
    targetId: "C-003",
    relationshipType: "ASSOCIATED_WITH",
    strength: 0.64,
    date: "2026-08-22T11:45:00.000Z",
    source: "Case Records",
  },
  {
    relationshipId: "R-024",
    sourceId: "P-007",
    targetId: "C-005",
    relationshipType: "ASSOCIATED_WITH",
    strength: 0.76,
    date: "2026-08-23T13:15:00.000Z",
    source: "Case Records",
  },
  {
    relationshipId: "R-025",
    sourceId: "P-011",
    targetId: "C-007",
    relationshipType: "ASSOCIATED_WITH",
    strength: 0.78,
    date: "2026-08-24T16:30:00.000Z",
    source: "Case Records",
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI!);

    console.log("MongoDB connected successfully.");

    console.log("Removing old demo data...");

    await Promise.all([
      Person.deleteMany({}),
      Organization.deleteMany({}),
      Location.deleteMany({}),
      Vehicle.deleteMany({}),
      Phone.deleteMany({}),
      Account.deleteMany({}),
      Case.deleteMany({}),
      Event.deleteMany({}),
      Transaction.deleteMany({}),
      Relationship.deleteMany({}),
    ]);

    console.log("Old demo data removed.");

    await Person.insertMany(persons);
    console.log(`Created ${persons.length} persons.`);

    await Organization.insertMany(organizations);
    console.log(`Created ${organizations.length} organizations.`);

    await Location.insertMany(locations);
    console.log(`Created ${locations.length} locations.`);

    await Vehicle.insertMany(vehicles);
    console.log(`Created ${vehicles.length} vehicles.`);

    await Phone.insertMany(phones);
    console.log(`Created ${phones.length} phones.`);

    await Account.insertMany(accounts);
    console.log(`Created ${accounts.length} bank accounts.`);

    await Case.insertMany(cases);
    console.log(`Created ${cases.length} cases.`);

    await Event.insertMany(events);
    console.log(`Created ${events.length} events.`);

    await Transaction.insertMany(transactions);
    console.log(`Created ${transactions.length} transactions.`);

    await Relationship.insertMany(relationships);
    console.log(`Created ${relationships.length} relationships.`);

    console.log("");
    console.log("==========================================");
    console.log("CrimeGraph AI dataset seeded successfully");
    console.log("==========================================");
    console.log("20 Persons");
    console.log("8 Organizations");
    console.log("10 Locations");
    console.log("10 Vehicles");
    console.log("10 Phones");
    console.log("10 Bank Accounts");
    console.log("10 Cases");
    console.log("20 Events");
    console.log("20 Transactions");
    console.log("25 Relationships");
    console.log("==========================================");
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

seedDatabase();
