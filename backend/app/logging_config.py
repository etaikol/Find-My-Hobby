import logging
import sys
from pythonjsonlogger import jsonlogger
import os

class MaxLevelFilter(logging.Filter):
    """Filter out log records above a certain level (inclusive)."""
    def __init__(self, max_level):
        super().__init__()
        self.max_level = max_level

    def filter(self, record):
        return record.levelno <= self.max_level

def setup_logging():
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)  # capture everything, handlers decide

    # JSON formatter
    json_formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(name)s %(levelname)s %(message)s"
    )

    # Stdout handler (DEBUG, INFO, WARNING)
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.DEBUG)
    stdout_handler.addFilter(MaxLevelFilter(logging.WARNING))
    stdout_handler.setFormatter(json_formatter)

    # Stderr handler (ERROR, CRITICAL)
    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setLevel(logging.ERROR)
    stderr_handler.setFormatter(json_formatter)

    # File handler (all levels) — Promtail will tail this
    log_dir = "/var/log/flask-backend"
    os.makedirs(log_dir, exist_ok=True)
    file_handler = logging.FileHandler(os.path.join(log_dir, "app.log"))
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(json_formatter)

    # Avoid duplicate handlers if setup_logging() called twice
    if not root_logger.handlers:
        root_logger.addHandler(stdout_handler)
        root_logger.addHandler(stderr_handler)
        root_logger.addHandler(file_handler)
