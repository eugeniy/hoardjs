from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
import os

TIMEOUT = 10
RUNNER_BASENAME = 'index.html'
RUNNER_PATH = 'file:///%s/%s' % (os.getcwd(), RUNNER_BASENAME)


def get_result(result, name):
    return int(result.find_elements_by_class_name(name)[0].text)

def have_results(driver):
    try:
        result = driver.find_element_by_id('qunit-testresult')
        total = get_result(result, 'total')
        return total > 0
    except NoSuchElementException:
        return False


# create an instance of a firefox driver
driver = webdriver.Firefox()

# start the qunit runner
driver.get(RUNNER_PATH)

try:
    # wait for the tests to finish running
    WebDriverWait(driver, TIMEOUT).until(have_results)

    # locate the result box and parse get counts
    # TODO: This will throw all sorts of things, catch it.
    result = driver.find_element_by_id('qunit-testresult')
    total = get_result(result, 'total')
    passed = get_result(result, 'passed')
    failed = get_result(result, 'failed')

finally:
    driver.quit()

print "total: %d, passed: %d, failed: %d" % (total, passed, failed)
