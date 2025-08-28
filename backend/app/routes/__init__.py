from .main import main_bp
from .auth import auth_bp
from .misc_routes import misc_bp
from .test import bp_test

all_blueprints = [main_bp, auth_bp, misc_bp, bp_test]  # list of all your blueprints