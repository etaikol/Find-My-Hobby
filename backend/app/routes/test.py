from flask import Blueprint, jsonify
import logging

bp_test = Blueprint("test", __name__, url_prefix="/test")
logger = logging.getLogger(__name__)

@bp_test.route("/")
def test_logs():
    logger.debug("This is a DEBUG log")
    logger.info("This is an INFO log")
    logger.warning("This is a WARNING log")
    logger.error("This is an ERROR log")
    logger.critical("This is a CRITICAL log")
    return jsonify({"message": "Logs emitted, check container output"})