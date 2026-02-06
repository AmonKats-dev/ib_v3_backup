"""Add project_classification to project table

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2024-01-15 15:00:00.000000

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # Check if column exists before adding it
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('project')]
    
    if 'project_classification' not in columns:
        op.add_column('project', sa.Column(
            'project_classification', sa.String(length=50), nullable=True))
        print("Added project_classification column to project table")
    else:
        print("project_classification column already exists in project table")


def downgrade():
    # Check if column exists before dropping it
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('project')]
    
    if 'project_classification' in columns:
        op.drop_column('project', 'project_classification')
        print("Dropped project_classification column from project table")
    else:
        print("project_classification column does not exist in project table")

