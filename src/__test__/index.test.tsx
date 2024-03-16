import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

//Pages
import { LoginPage } from "../pages/login-page/LoginPage";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Cards } from "../components/Cards";
import { Graphics } from "../components/Graphics";
import { SideCards } from "../components/SideCards";

jest.mock("./mocks/mockEnv.ts", () => {
  return {
    getEnvironment: () => ({
      VITE_API_KEY: process.env.API_KEY,
      VITE_AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      VITE_PROJECT_ID: process.env.PROJECT_ID,
      VITE_STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      VITE_MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      VITE_APP_ID: process.env.APP_ID,
      VITE_MEASUREMENT_ID: process.env.MEASUREMENT_ID,
      VITE_DATABASE_URL: process.env.DATABASE_URL,
    }),
  };
});

jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="chart-mock">Chart Mock</div>,
}));

describe("Login Page", () => {
  it("Renders the login-page", () => {
    render(<LoginPage />);
    expect(true).toBeTruthy();
  });
  it("Check if the divs are being loaded", () => {
    const { getByTestId } = render(<LoginPage />);
    const bodyDiv = getByTestId("body-div");
    expect(bodyDiv).toBeInTheDocument();
    const container = getByTestId("container");
    expect(container).toBeInTheDocument();
    const userForm = getByTestId("user-form");
    expect(userForm).toBeInTheDocument();
    const imgDiv = getByTestId("img-div");
    expect(imgDiv).toBeInTheDocument();
  });
});

describe("DashBoard", () => {
  it("Renders the dashboard", () => {
    render(<Dashboard />);
    expect(true).toBeTruthy();
  });
  it("Check if the divs are being loaded ( DashBoard )", () => {
    const { getByTestId } = render(<Dashboard />);
    const mainContainer = getByTestId("main-container");
    expect(mainContainer).toBeInTheDocument();
    const itensContainer = getByTestId("itens-container");
    expect(itensContainer).toBeInTheDocument();
  });
  it("Check if the divs are being loaded ( Cards )", () => {
    const { getByTestId } = render(<Cards />);
    const cardContainer = getByTestId("card_container");
    expect(cardContainer).toBeInTheDocument();
    const cardOne = getByTestId("card-One");
    expect(cardOne).toBeInTheDocument();
    const cardTwo = getByTestId("card-Two");
    expect(cardTwo).toBeInTheDocument();
    const cardThree = getByTestId("card-Three");
    expect(cardThree).toBeInTheDocument();
  });

  /*  This test checks the table in mock  */

  it("Check if the divs are being loaded ( Graphics )", () => {
    const { getByTestId } = render(<Graphics />);
    const chartContainer = getByTestId("chart-mock");
    expect(chartContainer).toBeInTheDocument();
  });

  it("Check if the divs are being loaded ( SideCards )", () => {
    const { getByTestId } = render(<SideCards />);
    const divContainer = getByTestId("div-container");
    expect(divContainer).toBeInTheDocument();
    const cardOne = getByTestId("card-One");
    expect(cardOne).toBeInTheDocument();
    const cardTwo = getByTestId("card-Two");
    expect(cardTwo).toBeInTheDocument();
  })
});