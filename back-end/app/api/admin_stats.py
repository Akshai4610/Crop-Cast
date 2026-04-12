from fastapi import APIRouter, Depends
from app.database.mongodb import activities_collection
from app.core.dependencies import admin_required
from datetime import datetime

router = APIRouter(prefix="/admin/stats", tags=["Admin Stats"])

def serialize_activity(a):
    a["_id"] = str(a["_id"])
    
    # Calculate "time ago" string
    now = datetime.utcnow()
    diff = now - a["timestamp"]
    
    if diff.days > 0:
        a["time_ago"] = f"{diff.days}d ago"
    elif diff.seconds >= 3600:
        a["time_ago"] = f"{diff.seconds // 3600}h ago"
    elif diff.seconds >= 60:
        a["time_ago"] = f"{diff.seconds // 60}m ago"
    elif diff.seconds > 5:
        a["time_ago"] = f"{diff.seconds}s ago"
    else:
        a["time_ago"] = "Just now"
        
    return a

@router.get("/activities")
def get_recent_activities(admin=Depends(admin_required)):
    """Fetch the 20 most recent activity logs for the admin dashboard."""
    activities = list(
        activities_collection.find()
        .sort("timestamp", -1)
        .limit(20)
    )
    return [serialize_activity(a) for a in activities]
