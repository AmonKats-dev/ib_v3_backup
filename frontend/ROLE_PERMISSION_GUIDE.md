# Role Permission Configuration Guide

## Overview

The role permission system allows you to control what actions users with specific roles can perform in the application.

## Accessing Role Configuration

### Method 1: Direct URL
Navigate to: `http://localhost:3000/#/roles/{role_id}`

Example: `http://localhost:3000/#/roles/1` (Administrator role)

### Method 2: Via Roles List
1. Go to `http://localhost:3000/#/roles`
2. Click on any role in the list
3. This opens the role detail page
4. Click the "Edit" button to configure permissions

## Configuring Role Permissions

### Step-by-Step Process

1. **Navigate to Role Edit Page**
   - From role list: Click role → Click "Edit" button
   - Or go directly to: `http://localhost:3000/#/roles/{id}/edit`

2. **View Permission Categories**
   - Permissions are organized into tabs:
     - **project**: Project-related permissions
     - **comments**: Comment permissions
     - **parameters**: System parameter permissions
     - **user**: User management permissions
     - **role**: Role management permissions
     - **organization**: Organization permissions
     - **workflow**: Workflow permissions
     - **reports**: Report and export permissions
     - **me_report**: M&E report permissions
     - **And many more...**

3. **Select Permissions**
   - Click on each tab to see available permissions
   - Check boxes for permissions you want to grant
   - Uncheck boxes for permissions you want to revoke
   - Each permission has a descriptive name (e.g., "Create Project", "Edit User")

4. **Configure Organization Level** (if enabled)
   - Select the appropriate organization level for the role
   - This controls which organizational hierarchy the role can access

5. **Set Phase Access**
   - Select which project phases this role can work with
   - Multiple phases can be selected

6. **Save Changes**
   - Click the "Save" button at the bottom
   - Changes take effect immediately for new logins

## Permission Examples

### Common Permission Sets

#### Administrator Role
```
Permissions: ["full_access"]
```
- Has access to everything
- Bypasses all permission checks

#### Standard User Role
```
Permissions: [
  "list_projects",
  "create_project", 
  "edit_project",
  "view_project",
  "submit_project",
  "list_users",
  "view_user",
  // ... and more
]
```
- Can manage their own projects
- Can view other users
- Cannot manage roles or workflows

#### Programme Head Role
```
Permissions: [
  "approve_project",
  "reject_project",
  "revise_project",
  "list_projects",
  "view_project",
  // ... and more
]
```
- Can approve/reject projects
- Can view all projects
- Has higher-level access

#### Global Viewer Role
```
Permissions: [
  "list_projects",
  "view_project",
  "view_report_builder",
  "export",
  // ... read-only permissions
]
```
- Read-only access
- Cannot create or modify anything
- Can view and export data

## Permission Categories Explained

### Project Permissions
- `create_project`: Create new projects
- `edit_project`: Modify existing projects
- `view_project`: View project details
- `delete_project`: Delete projects
- `submit_project`: Submit projects for approval
- `approve_project`: Approve submitted projects
- `revise_project`: Request revisions
- `reject_project`: Reject projects

### User Permissions
- `create_user`: Create new users
- `edit_user`: Modify user information
- `view_user`: View user details
- `delete_user`: Delete users
- `list_users`: View user list

### Role Permissions
- `create_role`: Create new roles
- `edit_role`: Modify role configuration
- `view_role`: View role details
- `delete_role`: Delete roles
- `list_roles`: View role list

### Report Permissions
- `view_report_builder`: Access report builder
- `export`: Export data
- `view_project_count_report`: View project statistics

## Best Practices

### 1. Principle of Least Privilege
- Only grant permissions that are absolutely necessary
- Start with minimal permissions and add as needed
- Review and audit permissions regularly

### 2. Role Hierarchy
- Create clear role hierarchies
- Higher-level roles should have more permissions
- Consider using organization levels to control access

### 3. Testing
- Test each role after configuration changes
- Verify users can access what they need
- Confirm restricted features are properly blocked

### 4. Documentation
- Document what each custom role is for
- Keep a record of permission changes
- Train users on their role capabilities

## Applying Permission Changes

### For Existing Users
Users need to **log out and log back in** for permission changes to take effect. This is because permissions are stored in the JWT token.

### Backend Restart Required
If you've made changes to the permission checking logic itself (not just role permissions), you need to restart the Flask backend:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
flask run
```

## Troubleshooting

### Issue: User can't see the Edit button
**Cause**: User doesn't have `edit_role` permission

**Solution**: 
1. Log in as administrator
2. Edit the user's role to include `edit_role` permission

### Issue: Permission changes not taking effect
**Cause**: JWT token still has old permissions

**Solution**:
1. Have the user log out completely
2. Log back in
3. New JWT token will have updated permissions

### Issue: Can't find a specific permission
**Cause**: Permission might be in a different category tab

**Solution**:
- Check all tabs in the permission configuration
- Use browser search (Ctrl+F) to find permission text
- Check `permissions_map.json` for the full list

## Permission Keys Reference

For developers, permissions are stored as keys. Here's where to find them:

- **JM permissions**: `frontend/src/views/resources/Roles/permissions_map.json`
- **UG permissions**: `frontend/src/views/resources/Roles/ug_permissions_map.json`

The permission maps include:
- `key`: The actual permission identifier used in code
- `name`: Human-readable name displayed in UI
- `id`: Numeric ID (for reference)

## Security Considerations

1. **Admin Access**: Keep `full_access` permission restricted to trusted administrators only

2. **Sensitive Operations**: Permissions like `delete_user`, `delete_project`, and `edit_role` should be carefully controlled

3. **Data Export**: `export` permission allows downloading potentially sensitive data

4. **User Management**: `create_user` and `edit_user` allow managing other users

5. **Role Management**: `edit_role` allows changing what others can do - very powerful

## Need Help?

If you need to:
- Add new permissions → Contact development team
- Bulk update roles → Use database scripts
- Create custom role → Use the role creation interface
- Debug permission issues → Check browser console and Flask logs

---

**Last Updated**: January 20, 2026
**Version**: 1.0
