from .user import user_bp
from .auth import auth_bp
from .misc_routes import misc_bp
from .test import bp_test
from .hobby import hobby_bp
from .group import group_bp
from .event import event_bp
from .junction import junction_bp

all_blueprints = [user_bp, auth_bp, misc_bp, bp_test,
                  hobby_bp, group_bp, event_bp, junction_bp]  # list of all your blueprints