import logging
import os
from sys import stdout

logger = logging.getLogger('sari-sari-backend')
handler = logging.StreamHandler(stdout)
if os.getenv('AWS_EXECUTION_ENV'):
    logger.propagate = False
    log_formatter = logging.Formatter('[%(levelname)s] %(message)s')
else:
    log_formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s')
handler.setFormatter(log_formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)