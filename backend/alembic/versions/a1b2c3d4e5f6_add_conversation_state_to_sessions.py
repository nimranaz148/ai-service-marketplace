"""add_conversation_state_to_sessions

Revision ID: a1b2c3d4e5f6
Revises: d8ee2d5e1212
Create Date: 2026-09-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'd8ee2d5e1212'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('sessions', sa.Column('area', sa.String(length=255), nullable=True))
    op.add_column('sessions', sa.Column('conversation_history', sa.JSON(), nullable=True))
    op.add_column('sessions', sa.Column('turns', sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column('sessions', 'turns')
    op.drop_column('sessions', 'conversation_history')
    op.drop_column('sessions', 'area')
