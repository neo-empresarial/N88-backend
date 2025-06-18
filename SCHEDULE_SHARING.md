# Schedule Sharing Feature

This document describes the implementation of the schedule sharing feature that allows users in the same group to share their saved schedules with each other.

## Overview

The schedule sharing feature enables users to:
- Share their saved schedules with other members of the same group
- Accept shared schedules from other users
- Decline shared schedules
- View all shared schedules (both sent and received)

## Database Schema

### SharedSchedules Entity

The `SharedSchedules` entity tracks all schedule sharing activities:

```typescript
{
  id: number;                    // Primary key
  scheduleId: number;           // Reference to the original schedule
  sharedByUserId: number;       // User who shared the schedule
  sharedWithUserId: number;     // User who received the schedule
  groupId: number;              // Group where the sharing occurred
  sharedAt: Date;               // When the schedule was shared
  isAccepted: boolean;          // Whether the schedule was accepted
  acceptedAt?: Date;            // When the schedule was accepted
}
```

## API Endpoints

### Share a Schedule
```
POST /shared-schedules/share
```

**Request Body:**
```json
{
  "scheduleId": 1,
  "groupId": 1,
  "userIds": [2, 3]  // Optional: specific users to share with
}
```

**Response:**
Returns an array of created shared schedule records.

### Get Received Shared Schedules
```
GET /shared-schedules/received
```

**Response:**
```json
[
  {
    "id": 1,
    "scheduleId": 1,
    "sharedByUserId": 2,
    "sharedByUserName": "John Doe",
    "sharedWithUserId": 1,
    "groupId": 1,
    "groupName": "Study Group",
    "sharedAt": "2024-01-15T10:30:00Z",
    "isAccepted": false,
    "originalSchedule": {
      "title": "My Schedule",
      "description": "A great schedule",
      "items": [...]
    }
  }
]
```

### Get Sent Shared Schedules
```
GET /shared-schedules/sent
```

Returns all schedules that the current user has shared with others.

### Accept a Shared Schedule
```
POST /shared-schedules/accept
```

**Request Body:**
```json
{
  "sharedScheduleId": 1
}
```

**Response:**
Returns the newly created schedule that was copied to the user's account.

### Decline a Shared Schedule
```
DELETE /shared-schedules/:id/decline
```

Removes the shared schedule record without creating a copy.

## Business Logic

### Sharing Rules
1. Users can only share schedules they own
2. Users can only share with members of the same group
3. If no specific `userIds` are provided, the schedule is shared with all group members (except the owner)
4. Duplicate shares are prevented (same schedule, same users, same group)

### Acceptance Process
1. When a user accepts a shared schedule, a copy is created in their account
2. The copy is marked with "(Shared)" in the title to distinguish it from original schedules
3. The shared schedule record is marked as accepted
4. All schedule items are copied to the new schedule

### Security
- All endpoints require JWT authentication
- Users can only access their own shared schedules
- Group membership is verified before allowing sharing

## Usage Examples

### Sharing a Schedule with All Group Members
```javascript
const response = await fetch('/shared-schedules/share', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    scheduleId: 1,
    groupId: 1
  })
});
```

### Accepting a Shared Schedule
```javascript
const response = await fetch('/shared-schedules/accept', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    sharedScheduleId: 1
  })
});
```

## Migration

To set up the database table, run:

```bash
npm run migration:run
```

This will create the `shared_schedules` table with all necessary foreign key constraints.

## Testing

Run the tests with:

```bash
npm test shared-schedules.service.spec.ts
```

The tests cover:
- Service instantiation
- Error handling for invalid schedules
- Error handling for invalid groups
- Retrieving shared schedules for users 