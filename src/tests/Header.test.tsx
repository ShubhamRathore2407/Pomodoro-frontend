import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Header from "../components/Header";

test("Renders title", async () => {
  render(<Header setOpen={() => {}} />);
  const titleText = await screen.findByText(/pomodoro/i);

  expect(titleText).toBeDefined();
});

test("Clicking Analytics button calls setOpen", async () => {
  const mockSetOpen = jest.fn();
  render(<Header setOpen={mockSetOpen} />);
  const analyticsButton = screen.getByText(/analytics/i);

  await userEvent.click(analyticsButton);

  expect(mockSetOpen).toHaveBeenCalledWith(true);
});
