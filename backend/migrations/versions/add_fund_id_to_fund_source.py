"""Add fund_id to fund_source table

Revision ID: c3d4e5f6a7b8
Revises: 7104944bd94b
Create Date: 2025-01-15 12:00:00.000000

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'c3d4e5f6a7b8'
down_revision = '7104944bd94b'
branch_labels = None
depends_on = None


def upgrade():
    # Check if column exists before adding it
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('fund_source')]
    
    if 'fund_id' not in columns:
        op.add_column('fund_source', sa.Column(
            'fund_id', sa.Integer(), nullable=True))
        op.create_foreign_key(
            'fund_source_fund_fk',
            'fund_source', 'fund',
            ['fund_id'], ['id']
        )
        print("Added fund_id column to fund_source table")
    else:
        print("fund_id column already exists in fund_source table")


def downgrade():
    # Check if column exists before dropping it
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('fund_source')]
    
    if 'fund_id' in columns:
        op.drop_constraint('fund_source_fund_fk', 'fund_source', type_='foreignkey')
        op.drop_column('fund_source', 'fund_id')
        print("Dropped fund_id column from fund_source table")
    else:
        print("fund_id column does not exist in fund_source table")

