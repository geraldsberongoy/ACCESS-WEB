# Borrowing Workflow & Asset State Flowchart

This flowchart visualizes the continuous lifecycle of an Asset and the step-by-step process a Borrower and Admin go through during a single borrowing transaction.

```mermaid
graph TD
    classDef available fill:#d4edda,stroke:#28a745,stroke-width:2px;
    classDef reserved fill:#fff3cd,stroke:#ffc107,stroke-width:2px;
    classDef borrowed fill:#cce5ff,stroke:#007bff,stroke-width:2px;
    classDef unavailable fill:#f8d7da,stroke:#dc3545,stroke-width:2px;
    classDef userAction fill:#e2e3e5,stroke:#6c757d,stroke-width:2px,stroke-dasharray: 5 5;

    %% Setup Initial State
    A((Asset is Available)):::available
    
    %% User Actions
    B[Organization Selects Dates & Adds to Cart]:::userAction
    C[Organization Submits Request \n & Uploads Formal Letter]:::userAction
    
    A --> B
    B --> C
    
    %% Cancellation Path
    C -->|Borrower Cancels| X[Request: Cancelled]
    X --> A

    %% Admin Review
    C --> D{Admin Reviews \n Letter & Dates}
    
    %% Rejection Path
    D -->|Rejects| E[Request: Rejected \n Auto-Email Sent]
    E --> A
    
    %% Approval Path
    D -->|Approves| F((Asset becomes Reserved)):::reserved
    F -->|System sends Auto-Email| G[Borrower goes to ACCESS Office \n Shows ID & Hard Copy Letter]:::userAction
    
    %% Physical handoff
    G --> H{Admin Scans Asset QR Code \n to release item}
    H --> I((Asset becomes Borrowed)):::borrowed
    
    %% Usage and Return
    I --> J[Organization uses Asset \n for the Event]:::userAction
    J --> K[Organization Returns Asset \n to ACCESS Office]:::userAction
    
    %% Return Check
    K --> L{Admin Scans QR Code \n & Inspects Condition}
    
    %% Good Return
    L -->|Item is Fine| M[Request: Completed \n Asset condition recorded]
    M --> A
    
    %% Bad Return
    L -->|Item is Damaged/Lost| N((Asset becomes Unavailable)):::unavailable
    N --> O[Admin creates Incident Report \n & Initiates Repairs]
    
    %% Resolution
    O -->|Repaired/Replaced| A
```

### State Definitions:
1. **Available (Green)**: The asset is currently in the ACCESS office and can be booked by anyone for future dates.
2. **Reserved (Yellow)**: A request has been approved for this asset. It is still in the office, but it is "held" for a specific organization and cannot be booked by others for overlapping dates.
3. **Borrowed (Blue)**: The physical handoff has occurred. The asset is currently in the possession of the Organization.
4. **Unavailable (Red)**: The asset has been reported damaged, lost, or is undergoing maintenance. It cannot be booked by anyone until an Admin resolves the issue and marks it Available again.
