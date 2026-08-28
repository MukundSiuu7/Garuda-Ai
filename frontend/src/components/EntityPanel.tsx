interface EntityPanelProps {
  entity: any | null;
  connectionCount: number;
  onClose: () => void;
}

function EntityPanel({ entity, connectionCount, onClose }: EntityPanelProps) {
  if (!entity) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,

        width: 320,

        maxHeight: "80vh",

        overflowY: "auto",

        background: "#111827",

        color: "white",

        border: "1px solid #334155",

        borderRadius: 12,

        padding: 20,

        zIndex: 10,

        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
          }}
        >
          Entity Details
        </h2>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* ENTITY NAME */}

      <h3
        style={{
          marginBottom: 5,
        }}
      >
        {entity.name ||
          entity.number ||
          entity.accountNumber ||
          entity.registrationNumber ||
          entity.entityId}
      </h3>

      {/* TYPE */}

      <p
        style={{
          color: "#94a3b8",
          marginTop: 0,
        }}
      >
        {entity.type}
      </p>

      <hr
        style={{
          borderColor: "#334155",
        }}
      />

      {/* ENTITY ID */}

      <div
        style={{
          marginBottom: 15,
        }}
      >
        <strong>Entity ID</strong>

        <p
          style={{
            margin: "5px 0",
            color: "#cbd5e1",
          }}
        >
          {entity.entityId}
        </p>
      </div>

      {/* CONNECTIONS */}

      <div
        style={{
          marginBottom: 15,
        }}
      >
        <strong>Connections</strong>

        <p
          style={{
            margin: "5px 0",
            color: "#60a5fa",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {connectionCount}
        </p>
      </div>

      {/* PERSON FIELDS */}

      {entity.age !== undefined && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Age</strong>

          <p>{entity.age}</p>
        </div>
      )}

      {entity.occupation && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Occupation</strong>

          <p>{entity.occupation}</p>
        </div>
      )}

      {entity.priorityScore !== undefined && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Priority Score</strong>

          <p>{entity.priorityScore}</p>
        </div>
      )}

      {/* NETWORK */}

      {entity.network && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Network</strong>

          <p>{entity.network}</p>
        </div>
      )}

      {/* LAST ACTIVITY */}

      {entity.lastActivity && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Last Activity</strong>

          <p>{new Date(entity.lastActivity).toLocaleString()}</p>
        </div>
      )}

      {/* LOCATION */}

      {entity.region && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Region</strong>

          <p>{entity.region}</p>
        </div>
      )}

      {/* VEHICLE */}

      {entity.registrationNumber && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Registration</strong>

          <p>{entity.registrationNumber}</p>
        </div>
      )}

      {entity.model && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Model</strong>

          <p>{entity.model}</p>
        </div>
      )}

      {/* PHONE */}

      {entity.number && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Phone</strong>

          <p>{entity.number}</p>
        </div>
      )}

      {/* ACCOUNT */}

      {entity.accountNumber && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Account</strong>

          <p>{entity.accountNumber}</p>
        </div>
      )}

      {entity.bankName && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Bank</strong>

          <p>{entity.bankName}</p>
        </div>
      )}

      {entity.balance !== undefined && (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <strong>Balance</strong>

          <p>₹{entity.balance}</p>
        </div>
      )}
    </div>
  );
}

export default EntityPanel;
