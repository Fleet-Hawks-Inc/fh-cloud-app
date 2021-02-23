import { AppPage } from './app.po';
describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('when login is successful', () => {
    page.navigateTo();
    page.fillCredentials();
    page.navigateToHomepage();
  });
});
