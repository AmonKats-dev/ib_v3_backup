"""Add component_ids to output table if missing

Revision ID: a1b2c3d4e5f6
Revises: 7104944bd94b
Create Date: 2024-01-15 12:00:00.000000

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '7104944bd94b'
branch_labels = None
depends_on = None


def upgrade():
    # Check if column exists before adding it
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('output')]
    
    if 'component_ids' not in columns:
        op.add_column('output', sa.Column(
            'component_ids', sa.JSON(), nullable=True))
        print("Added component_ids column to output table")
    else:
        print("component_ids column already exists in output table")


def downgrade():
    # Check if column exists before dropping it
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('output')]
    
    if 'component_ids' in columns:
        op.drop_column('output', 'component_ids')
        print("Dropped component_ids column from output table")
    else:
        print("component_ids column does not exist in output table")

