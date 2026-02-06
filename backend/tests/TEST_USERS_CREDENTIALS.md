# Test Users Credentials

This file contains the login credentials for all test users created by `create_test_users.py`.

## Default Password
**All users use the same password**: `Test@1234`

## Test Users

| Username | Email | Role | Password |
|----------|-------|------|----------|
| `standard_user` | standard.user@test.com | Standard User | `Test@1234` |
| `programme_head` | programme.head@test.com | Programme Head | `Test@1234` |
| `accounting_officer` | accounting.officer@test.com | Accounting Officer | `Test@1234` |
| `pap_commissioner` | pap.commissioner@test.com | PAP Commissioner | `Test@1234` |
| `pap_assistant_commissioner` | pap.assistant@test.com | PAP Assistant Commissioner | `Test@1234` |
| `pap_principal` | pap.principal@test.com | PAP Principal | `Test@1234` |
| `pap_senior_economist` | pap.senior.economist@test.com | PAP Senior Economist | `Test@1234` |
| `pap_economist` | pap.economist@test.com | PAP Economist | `Test@1234` |
| `dc_member` | dc.member@test.com | DC Member | `Test@1234` |

## Quick Login Reference

### Forward Workflow Testing Order:
1. `standard_user` - Create and submit project
2. `programme_head` - Approve
3. `accounting_officer` - Approve
4. `pap_commissioner` - Approve
5. `pap_assistant_commissioner` - Approve
6. `pap_principal` - Approve
7. `pap_senior_economist` - Approve
8. `pap_economist` - Submit analysis
9. `dc_member` - Make DC decision

### Reverse Workflow Testing Order (After DC):
10. `pap_economist` - Submit after DC
11. `pap_senior_economist` - Approve (reverse)
12. `pap_principal` - Approve (reverse)
13. `pap_assistant_commissioner` - Approve (reverse)
14. `pap_commissioner` - Approve (reverse)
15. `accounting_officer` - Approve (reverse)
16. `programme_head` - Approve (reverse)
17. `standard_user` - Project returned

## Notes

- All users are created with the same password for easy testing
- Users are assigned to appropriate organizations automatically
- If a user already exists, the script will skip creation but may update roles
- To recreate users, delete them first or modify the script to handle updates

## Creating Users

Run the script to create all users:

```bash
cd backend
python tests/create_test_users.py
```

The script will display all credentials after successful creation.

