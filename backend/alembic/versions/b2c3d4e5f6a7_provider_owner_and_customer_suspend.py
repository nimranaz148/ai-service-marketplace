"""provider_owner_and_customer_suspend

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-09-12 00:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('is_suspended', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('providers', sa.Column('user_id', sa.String(length=36), nullable=True))
    op.create_index('ix_providers_user_id', 'providers', ['user_id'], unique=True)
    op.create_foreign_key('fk_providers_user_id_users', 'providers', 'users', ['user_id'], ['id'], ondelete='SET NULL')


def downgrade() -> None:
    op.drop_constraint('fk_providers_user_id_users', 'providers', type_='foreignkey')
    op.drop_index('ix_providers_user_id', table_name='providers')
    op.drop_column('providers', 'user_id')
    op.drop_column('users', 'is_suspended')
