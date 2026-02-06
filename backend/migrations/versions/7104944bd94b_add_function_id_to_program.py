"""Add function_id to program table

Revision ID: 7104944bd94b
Revises: ffb7f569b48c
Create Date: 2024-01-01 00:00:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '7104944bd94b'
down_revision = 'ffb7f569b48c'
branch_labels = None
depends_on = None


def upgrade():
    # Add function_id column to program table linking to coa_function table
    op.add_column('program', sa.Column(
        'function_id', sa.Integer(), nullable=True))
    # Create foreign key constraint linking program.function_id to coa_function.id
    op.create_foreign_key('program_function_id_fk',
                          'program', 'coa_function', ['function_id'], ['id'])


def downgrade():
    # Drop foreign key constraint
    op.drop_constraint('program_function_id_fk',
                       'program', type_='foreignkey')
    # Drop function_id column
    op.drop_column('program', 'function_id')

