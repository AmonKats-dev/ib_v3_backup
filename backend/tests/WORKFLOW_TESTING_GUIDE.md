# Normal Workflow Testing Guide

This guide explains how to set up and test the Normal Workflow system for project approvals.

## Workflow Overview

The Normal Workflow follows this pattern:

### Forward Flow (Steps 1-9)
1. **Standard User** - Creates and submits project
2. **Programme Head** - Reviews and approves
3. **Accounting Officer** - Reviews and approves
4. **PAP Commissioner** - Reviews and approves
5. **PAP Assistant Commissioner** - Reviews and approves
6. **PAP Principal** - Reviews and approves
7. **PAP Senior Economist** - Reviews and approves
8. **PAP Economist** - Submits project analysis
9. **DC Member** - Makes Development Committee decision

### Reverse Flow (Steps 10-17) - After DC Decision
10. **PAP Economist** - Submits after DC decision
11. **PAP Senior Economist** - Approves (reverse)
12. **PAP Principal** - Approves (reverse)
13. **PAP Assistant Commissioner** - Approves (reverse)
14. **PAP Commissioner** - Approves (reverse)
15. **Accounting Officer** - Approves (reverse)
16. **Programme Head** - Approves (reverse)
17. **Standard User** - Project returned to creator

## Prerequisites

1. **Database Setup**: Ensure your database is set up with:
   - Roles (Standard User, Programme Head, Accounting Officer, etc.)
   - Phases (Project Concept, Profile, Pre-feasibility, etc.)
   - Organizations
   - Programs
   - Workflow Instance (Main Workflow, ID: 1)

2. **Role IDs**: Verify these role IDs exist in your database:
   - Standard User: 7
   - Programme Head: 8
   - Accounting Officer: 22
   - PAP Commissioner: 19
   - PAP Assistant Commissioner: 23
   - PAP Principal: 24
   - PAP Senior Economist: 25
   - PAP Economist: 26
   - DC Member: 32

3. **Test Users**: Create test users for each role (see below)

## Setup Instructions

### Step 1: Create Test Users

Create test users with appropriate roles for testing:

```bash
cd backend
python tests/create_test_users.py
```

This script will create 9 test users, one for each role in the workflow:
- `standard_user` - Standard User role
- `programme_head` - Programme Head role
- `accounting_officer` - Accounting Officer role
- `pap_commissioner` - PAP Commissioner role
- `pap_assistant_commissioner` - PAP Assistant Commissioner role
- `pap_principal` - PAP Principal role
- `pap_senior_economist` - PAP Senior Economist role
- `pap_economist` - PAP Economist role
- `dc_member` - DC Member role

**Default Password for all users**: `Test@1234`

The script will display all login credentials after creation.

### Step 2: Set Up the Workflow

Run the setup script to create all workflow steps:

```bash
cd backend
python tests/setup_normal_workflow.py
```

This script will:
- Create 17 workflow steps (forward + reverse)
- Set up proper sequencing
- Configure actions for each step
- Set up revision paths

### Step 3: Verify Workflow Setup

Check that workflows were created:

```sql
SELECT step, role_id, status_msg, actions, project_status 
FROM workflow 
WHERE workflow_instance_id = 1 
ORDER BY step;
```

You should see 17 steps with the correct role assignments.

## Testing Instructions

### Automated Testing

Run the automated test script:

```bash
cd backend
python tests/test_normal_workflow.py
```

This script will:
1. Create a test project
2. Test forward workflow (steps 1-9)
3. Test reverse workflow (steps 10-17)
4. Verify final project state
5. Print a summary of results

### Manual Testing via UI

Use the test users created in Step 1. All users have password: `Test@1234`

1. **Login as Standard User** (`standard_user` / `Test@1234`)
   - Navigate to Projects
   - Create a new project
   - Fill in required fields
   - Submit the project

2. **Login as Programme Head** (`programme_head` / `Test@1234`)
   - Navigate to Projects
   - Find the submitted project
   - Review and approve

3. **Login as Accounting Officer** (`accounting_officer` / `Test@1234`)
   - Navigate to Projects
   - Find the project
   - Review and approve

4. **Continue through each role** in order:
   - PAP Commissioner (`pap_commissioner` / `Test@1234`)
   - PAP Assistant Commissioner (`pap_assistant_commissioner` / `Test@1234`)
   - PAP Principal (`pap_principal` / `Test@1234`)
   - PAP Senior Economist (`pap_senior_economist` / `Test@1234`)
   - PAP Economist (`pap_economist` / `Test@1234`)
   - DC Member (`dc_member` / `Test@1234`)

5. **After DC Decision**, continue in reverse order:
   - PAP Economist (`pap_economist` / `Test@1234`)
   - PAP Senior Economist (`pap_senior_economist` / `Test@1234`)
   - PAP Principal (`pap_principal` / `Test@1234`)
   - PAP Assistant Commissioner (`pap_assistant_commissioner` / `Test@1234`)
   - PAP Commissioner (`pap_commissioner` / `Test@1234`)
   - Accounting Officer (`accounting_officer` / `Test@1234`)
   - Programme Head (`programme_head` / `Test@1234`)
   - Standard User (`standard_user` / `Test@1234`)

### Testing Each Phase

The workflow applies to all phases (1-5). Test by:

1. Creating a project in Phase 1 (Project Concept)
2. Following the workflow through all steps
3. Creating another project in Phase 2 (Profile)
4. Repeating the workflow

## Workflow Actions

Each workflow step has specific actions available:

- **SUBMIT**: Submit project to next step
- **APPROVE**: Approve and forward to next step
- **REVISE**: Return project for revision
- **REJECT**: Reject the project
- **ASSIGN**: Assign project to a user (used by DC)

## Troubleshooting

### Workflow Step Not Found
- Ensure `setup_normal_workflow.py` ran successfully
- Check that `workflow_instance_id = 1` exists
- Verify step numbers are sequential

### Project Stuck at a Step
- Check that the user has the correct role
- Verify the role has the required permissions
- Check workflow step configuration

### Reverse Flow Not Working
- Ensure steps 10-17 are created
- Verify step numbers are correct
- Check that DC decision (step 9) properly transitions to step 10

## Workflow Configuration

### Modifying Workflow Steps

To modify a workflow step:

1. Navigate to `/workflows` in the UI
2. Filter by Workflow Instance: "Main Workflow"
3. Edit the desired step
4. Update:
   - Role
   - Actions
   - Status Message
   - Phases
   - Project Status

### Adding New Steps

To add new steps:

1. Determine the step number (must be sequential)
2. Create workflow via UI or script
3. Ensure proper role assignment
4. Set correct actions and phases

## API Testing

You can also test via API:

```bash
# Submit project (as Standard User)
POST /api/v1/projects/{project_id}/actions
{
  "action": "SUBMIT",
  "reason": "Initial submission"
}

# Approve project (as Programme Head)
POST /api/v1/projects/{project_id}/actions
{
  "action": "APPROVE",
  "reason": "Approved by Programme Head"
}

# Assign project (as DC Member)
POST /api/v1/projects/{project_id}/actions
{
  "action": "ASSIGN",
  "assigned_user_id": {user_id},
  "reason": "DC decision made"
}
```

## Notes

- The workflow uses step numbers to determine sequence
- Each step must have a unique step number
- Steps are filtered by phase_id to ensure correct workflow per phase
- The `max_step` field tracks the highest step reached
- Revision paths allow projects to be sent back to previous steps

## Support

If you encounter issues:
1. Check the test script output for errors
2. Verify database state matches expected values
3. Review workflow configuration in the UI
4. Check application logs for detailed error messages

