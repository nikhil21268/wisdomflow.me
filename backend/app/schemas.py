from dataclasses import dataclass
from uuid import UUID
from datetime import datetime
from typing import List


@dataclass
class PrincipleOut:
    id: UUID
    text: str
    created_at: datetime
    similarity: float | None = None
