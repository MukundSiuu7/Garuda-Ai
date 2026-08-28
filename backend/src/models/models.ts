import mongoose, { Schema, Document } from "mongoose";

/* ==================================================
   PERSON
================================================== */

export interface IPerson extends Document {
  entityId: string;
  name: string;
  type: string;
  age: number;
  occupation: string;
  priorityScore: number;
  network: string;
  lastActivity: Date;
}

const PersonSchema = new Schema<IPerson>(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Person",
    },

    age: {
      type: Number,
      required: true,
    },

    occupation: {
      type: String,
      required: true,
    },

    priorityScore: {
      type: Number,
      required: true,
    },

    network: {
      type: String,
      required: true,
    },

    lastActivity: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Person = mongoose.model<IPerson>("Person", PersonSchema);

/* ==================================================
   ORGANIZATION
================================================== */

export interface IOrganization extends Document {
  entityId: string;
  name: string;
  type: string;
  category: string;
  priorityScore: number;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Organization",
    },

    category: {
      type: String,
      required: true,
    },

    priorityScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Organization = mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema,
);

/* ==================================================
   LOCATION
================================================== */

export interface ILocation extends Document {
  entityId: string;
  name: string;
  type: string;
  region: string;
}

const LocationSchema = new Schema<ILocation>(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Location",
    },

    region: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Location = mongoose.model<ILocation>("Location", LocationSchema);

/* ==================================================
   VEHICLE
================================================== */

export interface IVehicle extends Omit<Document, "model"> {
  entityId: string;
  registrationNumber: string;
  model: string;
  type: string;
  ownerId: string;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
    },

    registrationNumber: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Vehicle",
    },

    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);

/* ==================================================
   PHONE
================================================== */

export interface IPhone extends Document {
  entityId: string;
  number: string;
  type: string;
  ownerId: string;
}

const PhoneSchema = new Schema<IPhone>(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
    },

    number: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Phone",
    },

    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Phone = mongoose.model<IPhone>("Phone", PhoneSchema);

/* ==================================================
   ACCOUNT
================================================== */

export interface IAccount extends Document {
  entityId: string;
  accountNumber: string;
  bankName: string;
  type: string;
  ownerId: string;
  balance: number;
}

const AccountSchema = new Schema<IAccount>(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Bank Account",
    },

    ownerId: {
      type: String,
      required: true,
    },

    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Account = mongoose.model<IAccount>("Account", AccountSchema);

/* ==================================================
   CASE
================================================== */

export interface ICase extends Document {
  caseId: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  locationId: string;
  createdAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      required: true,
    },

    locationId: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Case = mongoose.model<ICase>("Case", CaseSchema);

/* ==================================================
   EVENT
================================================== */

export interface IEvent extends Document {
  eventId: string;
  entityId: string;
  caseId: string;
  eventType: string;
  locationId: string;
  description: string;
  timestamp: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },

    entityId: {
      type: String,
      required: true,
    },

    caseId: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    locationId: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Event = mongoose.model<IEvent>("Event", EventSchema);

/* ==================================================
   TRANSACTION
================================================== */

export interface ITransaction extends Document {
  transactionId: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: Date;
  locationId: string;
  category: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    sender: {
      type: String,
      required: true,
    },

    receiver: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
    },

    locationId: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema,
);

/* ==================================================
   RELATIONSHIP
================================================== */

export interface IRelationship extends Document {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  strength: number;
  date: Date;
  source: string;
}

const RelationshipSchema = new Schema<IRelationship>(
  {
    relationshipId: {
      type: String,
      required: true,
      unique: true,
    },

    sourceId: {
      type: String,
      required: true,
    },

    targetId: {
      type: String,
      required: true,
    },

    relationshipType: {
      type: String,
      required: true,
    },

    strength: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Relationship = mongoose.model<IRelationship>(
  "Relationship",
  RelationshipSchema,
);
