import os
import sys
import yaml
import json
import time
import emoji
from datetime import datetime
from termcolor import colored

# def load_configs(BASE_PATH):
def load_configs(BASE_PATH = ""):
    file_path = ""
    if (not BASE_PATH):
        file_path = '.'
    else:
        file_path = BASE_PATH

    EXT = ['yaml', 'yml', 'json']
    for ext in EXT:
        if os.path.isfile(f'{file_path}/config.{ext}'):
            if ext in ['yaml', 'yml']:
                with open(f'{file_path}/config.{ext}', 'r') as file:
                    return yaml.safe_load(file)
            else:    
                return json.load(open('config.json'))
    return None

def find_parameter_value(parameter):
    try:
        return sys.argv[sys.argv.index(parameter)+1]
    except:
        print(f'parameter value not found ({parameter})')
        exit()

def run_tests(STYLES, TESTS = []):
    tests = [x.split('.')[0] for x in os.listdir() if '.py' in x]
    tests.sort()

    for test in tests:

        execute_before_each()

        start = get_now()
        test_result = os.system(f'{os.environ["PYTHON"]} {test}.py')
        end = get_now()
        test_duration = end - start
        duration_color = [x['color'] for x in STYLES["TEST_DURATION"] if x['threshold'] < test_duration]

        if test_result == 0:
            TESTS.append({ "test": test, "status": "PASS", "duration": test_duration })
            print(emoji.emojize(f'  {STYLES["PASS_TEST_STYLE"]["emoji"]} {colored(f"{test}: PASS", STYLES["PASS_TEST_STYLE"]["color"])} {colored(f"({test_duration} ms)", duration_color[len(duration_color)-1])}'))
        else:
            TESTS.append({ "test": test, "status": "FAIL", "duration": test_duration })
            print(emoji.emojize(f'  {STYLES["FAIL_TEST_STYLE"]["emoji"]} {colored(f"{test}: FAIL", STYLES["FAIL_TEST_STYLE"]["color"])} {colored(f"({test_duration} ms)", duration_color[len(duration_color)-1])}'))
            if 'STOP_ON_FAIL' in os.environ and eval(os.environ['STOP_ON_FAIL']) == True:
                exit()

        execute_after_each()

def run_tests_in_folders(BASE_PATH, STYLES, FOLDERS = []):
    tests_folders = [x for x in os.listdir() if '.' not in x and x != 'SetUp']
    tests_folders.sort()
    for folder in tests_folders:
        os.chdir(f'{BASE_PATH}/{folder}')
        FOLDERS.append({ "folder": folder, "tests": [] })
        print(emoji.emojize(f'{STYLES["FOLDER_STYLE"]["emoji"]} {colored(f"{folder}", STYLES["FOLDER_STYLE"]["color"])}'))
        run_tests(STYLES, FOLDERS[len(FOLDERS)-1]['tests'])

def generate_report(APP_PATH, OUTPUT_FORMAT, PROFILE, FOLDERS):
    os.chdir(APP_PATH)

    if OUTPUT_FORMAT is not None:
        FILE_NAME = ''
        if PROFILE is not None:
            FILE_NAME = f'{PROFILE}_output'
        else:
            FILE_NAME = f'output'

        if OUTPUT_FORMAT == 'csv':
            with open(f'./{FILE_NAME}.csv', 'w', encoding='utf8') as f:
                f.write(f'folder,test,status,duration\n')
                for folder in FOLDERS:
                    for test in folder['tests']:
                        f.write(f'{folder["folder"]},{test["test"]},{test["status"]},{test["duration"]}\n')
        else:
            with open(f'./{FILE_NAME}.json', 'w', encoding='utf8') as f:
                f.write(json.dumps(FOLDERS, indent=2))

def validate_output_format(OUTPUT_FORMAT):
    OUTPUT_FORMATS = ['json', 'csv']

    if OUTPUT_FORMAT is not None and OUTPUT_FORMAT not in OUTPUT_FORMATS:
        print(f'output format should be {OUTPUT_FORMATS[0]} or {OUTPUT_FORMATS[1]}')
        exit()

def get_now():
    return int(time.time() * 1000)

def execute_before_all():
    before_all_file = f'{os.environ["BASE_PATH"]}/SetUp/BeforeAll.py'
    if os.path.isfile(before_all_file):
        os.system(f'{os.environ["PYTHON"]} {before_all_file}')

def execute_after_all():
    after_all_file = f'{os.environ["BASE_PATH"]}/SetUp/AfterAll.py'
    if os.path.isfile(after_all_file):
        os.system(f'{os.environ["PYTHON"]} {after_all_file}')

def execute_before_each():
    before_each_file = f'{os.environ["BASE_PATH"]}/SetUp/BeforeEach.py'
    if os.path.isfile(before_each_file):
        os.system(f'{os.environ["PYTHON"]} {before_each_file}')

def execute_after_each():
    after_each_file = f'{os.environ["BASE_PATH"]}/SetUp/AfterEach.py'
    if os.path.isfile(after_each_file):
        os.system(f'{os.environ["PYTHON"]} {after_each_file}')


def main():    
    OUTPUT_FORMAT = None
    PROFILE = None
    EXECUTION_PROFILE = 'default'
        
    if '--output' in sys.argv:
        OUTPUT_FORMAT = find_parameter_value('--output')
    if '--profile' in sys.argv:
        PROFILE = find_parameter_value('--profile')
    if '--verbose' in sys.argv:
         os.environ['VERBOSE'] = 'True'
    if '--stop-on-fail' in sys.argv:
        os.environ['STOP_ON_FAIL'] = 'True'
    if '--log-output' in sys.argv:
        os.environ['LOG_OUTPUT'] = 'True'

    STYLES = {
        "FOLDER_STYLE": {
            "emoji": "",
            "color": "white"
        },
        "PASS_TEST_STYLE": {
            "emoji": ":check_mark_button:",
            "color": "grey"
        },
        "FAIL_TEST_STYLE": {
            "emoji": ":cross_mark:",
            "color": "grey"
        },
        "TEST_DURATION": [
            {
                "threshold": 0,
                "color": "grey"
            }
        ],
        "TOTAL_DURATION": [
            {
                "threshold": 0,
                "color": "white"
            }
        ],
    }

    CONFIG = load_configs(f'{os.getcwd()}/toolbox/SIR')
    BASE_TEST_FOLDER = f'tests'

    if CONFIG is not None:
        if 'profiles' in CONFIG:
            if PROFILE is not None:
                try:
                    BASE_TEST_FOLDER = f'/{CONFIG["profiles"][PROFILE]}'
                    EXECUTION_PROFILE = PROFILE
                except:
                    print('Profile not found')
                    exit()
            elif 'default' in CONFIG['profiles']:
                BASE_TEST_FOLDER = f'/{CONFIG["profiles"]["default"]}'
        if 'styles' in CONFIG:
            if 'folder' in CONFIG['styles']:
                STYLES['FOLDER_STYLE'] = CONFIG['styles']['folder']
            if 'pass' in CONFIG['styles']:
                STYLES['PASS_TEST_STYLE'] = CONFIG['styles']['pass']
            if 'fail' in CONFIG['styles']:
                STYLES['FAIL_TEST_STYLE'] = CONFIG['styles']['fail']
            if 'test_duration' in CONFIG['styles']:
                STYLES['TEST_DURATION'] = CONFIG['styles']['test_duration']
            if 'total_duration' in CONFIG['styles']:
                STYLES['TOTAL_DURATION'] = CONFIG['styles']['total_duration']

    BASE_PATH = f'{os.getcwd()}/toolbox/SIR/{BASE_TEST_FOLDER}'
    APP_PATH = f'{os.getcwd()}/toolbox/SIR'
    
    TESTS = []
    FOLDERS = []
    
    os.environ['APP_PATH'] = APP_PATH
    os.environ['BASE_PATH'] = BASE_PATH
    os.environ['EXECUTION_PROFILE'] = EXECUTION_PROFILE

    validate_output_format(OUTPUT_FORMAT)

    os.chdir(BASE_PATH)

    print(emoji.emojize('What a distinguished gentleman :wine_glass::moai:'))
    print()

    start_sir_run = get_now()

    execute_before_all()

    run_tests(STYLES, TESTS)
    run_tests_in_folders(BASE_PATH, STYLES, FOLDERS)

    execute_after_all()

    end_sir_run = get_now()

    print()

    total_test_duration = end_sir_run - start_sir_run
    total_duration_color = [x['color'] for x in STYLES["TOTAL_DURATION"] if x['threshold'] < total_test_duration]

    print(f'SIR Total Run Duration {colored(f"{total_test_duration} ms", total_duration_color[len(total_duration_color)-1])}')
    if len(TESTS) > 0:
        FOLDERS.append({ "folder": "root", "tests": TESTS })

    generate_report(APP_PATH, OUTPUT_FORMAT, PROFILE, FOLDERS)

def error_log(e):
    print()
    print(colored('An error have occurred when executing SIR, is the error persists contact us on github (https://github.com/fulviocoelho/SIR)', 'red'))
    print(colored('For more information on this error check the file error_log.txt', 'red'))
    print()
    with open(f'{os.environ["APP_PATH"]}/error_log.txt', 'a', encoding='utf8') as f:
        f.write(f'[{datetime.now()}] {e}\n')


try:
    main()
except Exception as e:
    error_log(e)