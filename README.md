# WebdriverIO Cucumber Web UI Automation

A **WebdriverIO + TypeScript + Cucumber** web UI automation framework using the Page Object Model (POM), Cucumber Scenario Outlines, and HTML/JSON reporting.

The project automates the login functionality of [The Internet](https://the-internet.herokuapp.com/) demo application and demonstrates positive and negative login scenarios.

## Tech Stack

- **WebdriverIO 8**
- **TypeScript**
- **Cucumber / Gherkin**
- **Node.js**
- **Chrome**
- **Page Object Model (POM)**
- **wdio-cucumberjs-json-reporter**
- **multiple-cucumber-html-reporter**
- **ts-node**

## Project Structure

```text
webdriverio-cucumber-web-ui-automation-main/
├── features/
│   └── login.feature
├── hooks/
│   └── screenshot.ts
├── page-objects/
│   ├── page.ts
│   ├── login.page.ts
│   └── secure.page.ts
├── step-definitions/
│   └── steps.ts
├── Reports/
│   ├── json-output-folder/
│   ├── report/
│   └── results.json
├── jsconfig.json
├── package.json
├── tsconfig.json
└── wdio.conf.ts
```

## Test Application

The framework uses:

**Application:** The Internet  
**Base URL:** `https://the-internet.herokuapp.com`

The login page is:

`https://the-internet.herokuapp.com/login`

The application provides known credentials for the demo login flow:

- Username: `tomsmith`
- Password: `SuperSecretPassword!`

## Test Scenarios

The feature uses a **Cucumber Scenario Outline** with an Examples table.

| Username | Password | Expected Result |
|---|---|---|
| `tomsmith` | `SuperSecretPassword!` | Successful login |
| `tomsmith` | `IncorrectPassword!` | Password validation message |
| `foobar` | `barfoo` | Username validation message |
| `foobar` | `SuperSecretPassword!` | Invalid username message |

> Note: The fourth scenario in the supplied project expects `Your username is invalids!`. This appears to be intentionally different from the application's normal message and may result in a failure if executed against the live demo site.

## Prerequisites

Install the following:

- Node.js 18+ recommended
- npm
- Google Chrome

Verify the installation:

```bash
node --version
npm --version
google-chrome --version
```

On Windows, Chrome should normally be installed in the standard Chrome installation location.

## Installation

Clone or extract the project and navigate to its root directory:

```bash
cd webdriverio-cucumber-web-ui-automation-main
```

Install dependencies:

```bash
npm install
```

## Run Tests

The project defines the following npm script:

```bash
npm run wdio
```

This executes:

```bash
wdio run ./wdio.conf.ts
```

The configured WebdriverIO spec pattern is:

```text
./features/**/*.feature
```

Therefore, all `.feature` files under the `features` directory are executed.

## Run Only the Login Suite

The WebdriverIO configuration defines a `login` suite:

```text
login: ['./features/login.feature']
```

You can run the suite directly with:

```bash
npx wdio run ./wdio.conf.ts --suite login
```

## Cucumber / Gherkin

The test scenario is written using a Scenario Outline:

```gherkin
Scenario Outline: As a user, I can log into the secure area
  Given I am on the login page
  When I login with <username> and <password>
  Then I should see a flash message saying <message>
```

This allows the same test flow to execute against multiple sets of login data.

## Step Definitions

The step definitions are located in:

```text
step-definitions/steps.ts
```

They map Gherkin steps to WebdriverIO actions.

Examples:

```text
Given I am on the login page
When I login with <username> and <password>
Then I should see a flash message saying <message>
```

The implementation uses WebdriverIO's `$` and `expect` APIs.

## Page Object Model

The project follows the **Page Object Model** pattern.

### Base Page

`page-objects/page.ts`

The base page contains common navigation functionality:

```typescript
public open(path: string) {
    return browser.url(`https://the-internet.herokuapp.com/${path}`)
}
```

### Login Page

`page-objects/login.page.ts`

The Login Page encapsulates:

- Username field
- Password field
- Submit button
- Login operation

Example:

```typescript
public async login(username: string, password: string) {
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
}
```

### Secure Page

`page-objects/secure.page.ts`

The Secure Page contains the flash message locator:

```typescript
public get flashAlert() {
    return $('#flash');
}
```

## Failed-Step Screenshots

The project includes:

```text
hooks/screenshot.ts
```

The Cucumber `AfterStep` hook checks whether a step failed.

When a step fails, WebdriverIO captures a screenshot and attaches it to the Cucumber JSON report:

```typescript
if (scenarioResult.result.status === 'FAILED') {
    browser.takeScreenshot().then((stream) => {
        cucumberJson.attach(stream, 'image/png');
    })
}
```

This provides useful visual evidence when debugging failed tests.

## Reporting

The framework uses two reporting components:

### Cucumber JSON Reporter

Package:

```text
wdio-cucumberjs-json-reporter
```

JSON output is stored under:

```text
Reports/json-output-folder/
```

### Multiple Cucumber HTML Reporter

Package:

```text
multiple-cucumber-html-reporter
```

The HTML report is generated under:

```text
Reports/report/
```

After execution, `onComplete` generates the report automatically.

The configuration also renames the generated merged JSON file to:

```text
Reports/results.json
```

## Viewing the HTML Report

After the test execution completes, open the generated report from:

```text
Reports/report/
```

The exact generated HTML entry point can depend on the reporter version/configuration. Open the generated HTML file in a browser to review:

- Feature results
- Scenario results
- Step status
- Execution duration
- Browser information
- Failure details
- Attached screenshots where available

## WebdriverIO Configuration

The main configuration file is:

```text
wdio.conf.ts
```

Important configuration includes:

```typescript
runner: 'local'
```

```typescript
framework: 'cucumber'
```

```typescript
specs: [
    './features/**/*.feature'
]
```

Chrome is configured as the browser capability:

```typescript
capabilities: [{
    browserName: 'chrome'
}]
```

The project also configures:

```text
maxInstances: 10
waitforTimeout: 10000
connectionRetryTimeout: 120000
connectionRetryCount: 3
```

## TypeScript Configuration

The project uses TypeScript with:

- ESNext modules
- ES2022 target
- Node.js types
- WebdriverIO types
- Cucumber types
- `strict: false`
- `noEmit: true`

The main configuration is:

```text
tsconfig.json
```

WebdriverIO automatically compiles TypeScript through:

```typescript
autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
        project: './tsconfig.json',
        transpileOnly: true
    }
}
```

## Useful Commands

### Install dependencies

```bash
npm install
```

### Execute all Cucumber tests

```bash
npm run wdio
```

### Execute login suite

```bash
npx wdio run ./wdio.conf.ts --suite login
```

### Execute a specific feature

```bash
npx wdio run ./wdio.conf.ts --spec ./features/login.feature
```

## Debugging

If tests fail, check the following:

1. Verify Chrome is installed and available.
2. Confirm internet connectivity.
3. Verify the demo application is accessible.
4. Run with increased WebdriverIO logging:

```typescript
logLevel: 'debug'
```

5. Review the generated JSON and HTML reports.
6. Check the screenshot attached for failed steps.
7. Verify selectors in the relevant page object.
8. Check whether the expected flash message exactly matches the application response.

## Design Principles

The framework demonstrates several maintainable automation practices:

- **Page Object Model** — UI locators and page actions are separated from test steps.
- **BDD with Gherkin** — business-readable test scenarios.
- **Scenario Outline** — reusable data-driven test execution.
- **Separation of concerns** — feature files, step definitions, page objects, hooks, and configuration are separated.
- **Centralized configuration** — browser, framework, timeouts, retries, and reporting are maintained in `wdio.conf.ts`.
- **Failure diagnostics** — screenshots are captured for failed Cucumber steps.
- **Automated reporting** — JSON and HTML reports are generated after execution.

## Potential Improvements

For a production-grade framework, consider adding:

- Environment-specific configuration (`dev`, `qa`, `stage`, `prod`)
- `.env` support for credentials and URLs
- Secrets management
- Additional browser capabilities such as Firefox and Edge
- CI/CD integration with GitHub Actions, Jenkins, or Azure DevOps
- Cucumber tags for selective execution
- Parallel execution strategy
- Retry configuration for flaky scenarios
- Allure reporting
- Centralized test data management
- API utilities for test-data setup
- Logging using a dedicated logger
- Screenshot and browser-log retention
- Docker-based execution
- BrowserStack/Sauce Labs integration for cross-browser and cloud execution

## Git Ignore Recommendations

Do not commit generated reports, logs, or local dependencies.

A suitable `.gitignore` includes:

```gitignore
node_modules/
Reports/report/
Reports/json-output-folder/
*.log
.env
.DS_Store
```

If `Reports/results.json` is generated during every test run, it can also be excluded:

```gitignore
Reports/results.json
```

## Troubleshooting

### `command not found: wdio`

Install the project dependencies:

```bash
npm install
```

Then run:

```bash
npm run wdio
```

### TypeScript type errors

Ensure dependencies are installed and the project is opened from its root directory:

```bash
npm install
```

Then verify:

```bash
npx tsc --noEmit
```

### Browser/session startup issues

Check Chrome installation and review WebdriverIO logs. Increasing:

```typescript
logLevel: 'debug'
```

can provide additional diagnostics.

### Test passes/fails unexpectedly

The expected text in the feature file must match the application's actual flash message. Review the scenario data in:

```text
features/login.feature
```

## Author

**Vinod Kumar**  
Lead SDET / QA Automation Engineer

Focus areas include:

- Web UI Automation
- WebdriverIO
- Selenium
- Playwright
- Cypress
- TypeScript
- JavaScript
- C#
- API Testing
- BDD / Cucumber
- CI/CD
- Cloud Testing
- Test Automation Framework Design

## License

This project is intended for learning, demonstration, and automation-framework reference purposes.
