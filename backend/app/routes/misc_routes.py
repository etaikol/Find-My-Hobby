from flask import Blueprint, jsonify

misc_bp = Blueprint("misc", __name__)

# Chrome DevTools probe
@misc_bp.route("/.well-known/appspecific/com.chrome.devtools.json")
def chrome_devtools_probe():
    return jsonify({})

# In the future you can dump other "junk" routes here...
# e.g. health check, monitoring hooks, debugging endpoints