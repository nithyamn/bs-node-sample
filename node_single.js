const webdriver = require('selenium-webdriver');

username = process.env.BROWSERSTACK_USERNAME;
accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
buildName = process.env.BROWSERSTACK_BUILD_NAME;
browserstackLocal = process.env.BROWSERSTACK_LOCAL;
browserstackLocalIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER;

// Input capabilities
const capabilities = {
 'os_version' : '10',
 'resolution' : '1920x1080',
 'browserName' : 'Chrome',
 'browser_version' : 'latest',
 'os' : 'Windows',
 'name': 'test',
 'build': buildName, // CI/CD job or build name
 'browserstack.local': browserstackLocal,
 'browserstack.localIdentifier': browserstackLocalIdentifier
}
async function runTestWithCaps () {
  let driver = new webdriver.Builder()
    .usingServer('http://'+username+':'+accessKey+'@hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build();
  await driver.get("http://localhost:8888");

  await driver.get("http://www.google.com");
  const inputField = await driver.findElement(webdriver.By.name("q"));
  await inputField.sendKeys("BrowserStack", webdriver.Key.ENTER); // this submits on desktop browsers
  try {
    await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
  } catch (e) {
    await inputField.submit(); // this helps in mobile browsers
  }
  try {
    await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
    console.log(await driver.getTitle());
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains BrowserStack!"}}'
    );
  } catch (e) {
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Page could not load in time"}}'
    );
  }
  await driver.quit();
}
runTestWithCaps(); 