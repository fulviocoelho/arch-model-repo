import os
import sys

sys.path.append(os.environ['APP_PATH'])

from tools import log

log('Execute log action before each test execution')