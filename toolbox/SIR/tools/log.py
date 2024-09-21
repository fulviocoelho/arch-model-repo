import os
import sys
from datetime import datetime

def log(*args):
    if 'VERBOSE' in os.environ and eval(os.environ['VERBOSE']) == True:
        print(*args)
    if 'LOG_OUTPUT' in os.environ and eval(os.environ['LOG_OUTPUT']) == True and 'SetUp' not in sys.argv[0]:
        file = f'{os.getcwd()}/{sys.argv[0]}'
        with open(f'{os.environ["APP_PATH"]}/logs/{os.environ["EXECUTION_PROFILE"]}_{file[len(os.environ["BASE_PATH"])+1:-3].replace(" ", "_").replace("/", "_")}.txt', 'a', encoding='utf8') as f:
            line = ''
            for arg in args:
                line = f'{line}{arg} ' 
            f.write(f'[{datetime.now()}] {line}\n')