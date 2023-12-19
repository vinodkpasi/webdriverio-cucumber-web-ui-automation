import cucumberJson from 'wdio-cucumberjs-json-reporter';
import  {AfterStep} from '@cucumber/cucumber';

AfterStep((scenarioResult) => {
  if (scenarioResult.result.status === 'FAILED') {
    // It will add the screenshot to the JSON so screen will be embedded in the report.
    browser.takeScreenshot().then((stream) => {
      cucumberJson.attach(stream, 'image/png',);
    })
  }
  return scenarioResult["status"];
});