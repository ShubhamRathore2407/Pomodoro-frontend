import { render, screen } from "@testing-library/react";
import ProgressBar from "../components/ProgressBar";
import { TaskInterface } from "../types";

const mockTaskList: TaskInterface[] = [
  {
    id: 1,
    status: "Complete",
    text: "test1",
    pomos: 0,
    isActive: false,
    totalBreakTime: 0,
  },
  {
    id: 2,
    status: "InComplete",
    text: "test2",
    pomos: 0,
    isActive: false,
    totalBreakTime: 0,
  },
];

test("Renders ProgressBar with correct fill width", () => {
  render(<ProgressBar taskList={mockTaskList} />);
  const barFill = screen.getByTestId("bar-fill");

  // Access the width of BarFill element
  const computedStyle = window.getComputedStyle(barFill);
  const barFillWidth = computedStyle.width;

  expect(barFillWidth).toBe("50%"); // Replace with the expected width
});

test("Renders ProgressBar with correct percentage text", () => {
  render(<ProgressBar taskList={mockTaskList} />);
  const percentageText = screen.getByText("50%");

  expect(percentageText).toBeDefined();
});
