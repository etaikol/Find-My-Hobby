from .main import main_bp
from .auth import auth_bp
from .misc_routes import misc_bp  # if you have other blueprints

all_blueprints = [main_bp, auth_bp, misc_bp]  # list of all your blueprints