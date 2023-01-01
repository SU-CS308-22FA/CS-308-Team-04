import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import string

def get_random_string(length):
    ##### random string generator that can be used in test cases
    ##### Returns: random string with given "length"
    
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome("C:\chromedriver\chromedriver.exe")

    def test_for_reporting_posts(self):
        driver = self.driver
        driver.get("http://www.gencfootball.com/login")
        time.sleep(5)
        #login
        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys('denizumut@sabanciuniv.edu')
        actions.send_keys(Keys.TAB)
        actions.send_keys('Password1')
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        #moved to profile
        time.sleep(3)
        driver.get("http://www.gencfootball.com/Feed")
        #moved to feed
        #search for report button
        time.sleep(3)
        reportButton = driver.find_element(By.XPATH, '//button[normalize-space()="Report"]')
        self.assertIn("Report", reportButton.text, "Return button not found in post list")      
        time.sleep(3)
        #click report button
        reportButton.click()
        #alert = driver.switch_to.alert()
        alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
        time.sleep(1)
        self.assertIn("Success", alert.text, "Report mail not send.")
        alert.accept()
        #closed alert box
        time.sleep(1)
        
    def test_search_reporting_users(self):
        driver = self.driver
        driver.get("http://www.gencfootball.com/login")
        time.sleep(5)
        
        #login
        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys('denizumut@sabanciuniv.edu')
        actions.send_keys(Keys.TAB)
        actions.send_keys('Password1')
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        #moved to profile
        
        time.sleep(3)
        #move to another profile in order to report him
        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys('kaportacikoray12')
        actions.perform()
        time.sleep(2)
        actions = ActionChains(driver)
        actions.send_keys(Keys.DOWN)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        reportButton = driver.find_element(By.XPATH, '//button[normalize-space()="Report"]')
        self.assertIn("Report", reportButton.text, "Return button not found in profile")   
        time.sleep(3)
        #click report button
        reportButton.click()
        #alert = driver.switch_to.alert()
        alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
        time.sleep(1)
        self.assertIn("Success", alert.text, "Report mail not send.")
        alert.accept()
        #closed alert box
        time.sleep(1)

    def test_for_dm_refresh(self):
        driver = self.driver
        driver.get("http://www.gencfootball.com/login")
        time.sleep(5)

        #login
        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys('gdeniz@sabanciuniv.edu')
        actions.send_keys(Keys.TAB)
        actions.send_keys('asdf1234')
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        # user at their own profile

        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        # opened following list

        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)

        #currently at target user profile
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        #at dm page with target user

        time.sleep(20)
        refreshMsgExists = (any("Messages refreshed" in entry['message']) for entry in driver.get_log('browser'))
        #Check console logs for refresh message
        self.assertTrue(refreshMsgExists, "Message refresh - Unsuccesful")     
        time.sleep(1)

    def test_for_sending_messages(self):
        driver = self.driver
        driver.get("http://www.gencfootball.com/login")
        time.sleep(5)

        #login
        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys('gdeniz@sabanciuniv.edu')
        actions.send_keys(Keys.TAB)
        actions.send_keys('asdf1234')
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        # user at their own profile

        actions = ActionChains(driver)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        # opened following list

        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)

        #currently at target user profile
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(3)
        #at dm page with target user

        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        msgContent = 'testMsg#' + get_random_string(16)
        actions.send_keys(msgContent)
        actions.send_keys(Keys.TAB)
        actions.send_keys(Keys.ENTER)
        actions.perform()
        time.sleep(20)

        # find <p> elements in the page
        messages = driver.find_elements(By.ID, 'dmMessageContent')
        testMsgFound = (any(element == msgContent) for element in messages.reverse())

        self.assertTrue(testMsgFound, "Test message not found")        
        time.sleep(1)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()