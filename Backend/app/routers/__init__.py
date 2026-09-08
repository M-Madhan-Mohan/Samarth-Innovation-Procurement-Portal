from app.routers.auth_stub import router as auth_router
from app.routers.b1_contracts import router as contracts_router
from app.routers.b1_signatures import router as signatures_router
from app.routers.b2_milestones import router as milestones_router
from app.routers.b2_payments import router as payments_router
from app.routers.b3_validation import router as validation_router
from app.routers.b4_scale_up import router as scale_up_router
from app.routers.b5_gem import router as gem_router
from app.routers.b6_compliance import router as compliance_router
from app.routers.events_router import router as events_router

from app.routers.mipp_challenges_router import router as mipp_challenges_router
from app.routers.mipp_startups_router import router as mipp_startups_router
from app.routers.mipp_matching_router import router as mipp_matching_router
from app.routers.mipp_evaluations_router import router as mipp_evaluations_router
from app.routers.mipp_pilots_router import router as mipp_pilots_router
from app.routers.mipp_evidence_router import router as mipp_evidence_router
from app.routers.mipp_scale_router import router as mipp_scale_router
from app.routers.mipp_ml_router import router as mipp_ml_router

__all__ = [
    "auth_router",
    "contracts_router",
    "signatures_router",
    "milestones_router",
    "payments_router",
    "validation_router",
    "scale_up_router",
    "gem_router",
    "compliance_router",
    "events_router",
    "mipp_challenges_router",
    "mipp_startups_router",
    "mipp_matching_router",
    "mipp_evaluations_router",
    "mipp_pilots_router",
    "mipp_evidence_router",
    "mipp_scale_router",
    "mipp_ml_router"
]

