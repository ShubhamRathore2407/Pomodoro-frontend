import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Timer from '../components/Timer';
import { Provider } from 'react-redux';
import store from '../store/store';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const commonProps = {
  state: {
    minutes: 25,
    seconds: 0,
  },
  timerStart: false,
  timerPause: true,
  setState: jest.fn(),
  setTimerStart: jest.fn(),
  setTimerPause: jest.fn(),
  handleReset: jest.fn(),
};
const renderTimerComponent = (props: any) => {
  return render(
    <Provider store={store}>
      <Timer {...props} />
    </Provider>
  );
};

//Display tests
test('Displays Pomodoro button', () => {
  renderTimerComponent({ ...commonProps });

  const pomodoroButton = screen.getByTestId('pomodoro-button');

  expect(pomodoroButton).toBeDefined();
});
test('Displays Short-break button', () => {
  renderTimerComponent({ ...commonProps });

  const shortBreakButton = screen.getByTestId('short-break-button');

  expect(shortBreakButton).toBeDefined();
});
test('Displays Long-break button', () => {
  renderTimerComponent({ ...commonProps });

  const longBreakButton = screen.getByTestId('long-break-button');

  expect(longBreakButton).toBeDefined();
});
test('Renders correct countdown in CountDown component', () => {
  renderTimerComponent({ ...commonProps });

  const countdownComponent = screen.getByTestId('countdown-component');

  // Expected countdown based on commonProps.state
  const expectedCountdown = '25:00';

  expect(countdownComponent).toBeDefined();
  expect(countdownComponent).toHaveTextContent(expectedCountdown);
});
test('Displays start button', () => {
  renderTimerComponent({ ...commonProps });

  const startButton = screen.getByTestId('start-pause-resume-button');

  expect(startButton).toBeDefined();
  expect(startButton).toHaveTextContent('Start');
});
test('Displays Pause button', () => {
  renderTimerComponent({ ...commonProps, timerStart: true, timerPause: false });

  const startButton = screen.getByTestId('start-pause-resume-button');

  expect(startButton).toBeDefined();
  expect(startButton).toHaveTextContent('Pause');
});
test('Displays Resume button', () => {
  renderTimerComponent({ ...commonProps, timerStart: true });

  const startButton = screen.getByTestId('start-pause-resume-button');

  expect(startButton).toBeDefined();
  expect(startButton).toHaveTextContent('Resume');
});
test('Displays reset button', () => {
  renderTimerComponent({ ...commonProps, timerStart: true });

  const resetButton = screen.getByTestId('reset-button');

  expect(resetButton).toBeDefined();
});

//Functional tests
test('Calls a callback to set states when Pomodoro button is clicked', async () => {
  const mockSetTimerStart = jest.fn();
  const mockSetTimerPause = jest.fn();

  renderTimerComponent({
    ...commonProps,
    setTimerStart: mockSetTimerStart,
    setTimerPause: mockSetTimerPause,
  });

  const pomodoroButton = screen.getByTestId('pomodoro-button');

  fireEvent.click(pomodoroButton);

  await waitFor(() => {
    expect(mockSetTimerPause).toHaveBeenCalledWith(true);
    expect(mockSetTimerStart).toHaveBeenCalledWith(false);
  });
});
test('Calls the callback to reset timer on clicking reset-button', async () => {
  const mockHandleReset = jest.fn();

  renderTimerComponent({
    ...commonProps,
    handleReset: mockHandleReset,
    timerStart: true,
  });

  const resetButton = screen.getByTestId('reset-button');

  fireEvent.click(resetButton);

  await waitFor(() => {
    expect(mockHandleReset).toHaveBeenCalled();
  });
});

//wrong
test('Handles Start, Pause, Resume button clicks', async () => {
  renderTimerComponent({ ...commonProps });
  const startPauseResumeButton = screen.getByTestId(
    'start-pause-resume-button'
  );
  console.log('Start value before clicking start');

  expect(startPauseResumeButton).toHaveTextContent('Start');
  console.log('Start value after clicking start');

  userEvent.click(startPauseResumeButton);

  await waitFor(() => {
    expect(startPauseResumeButton.textContent).toBe('Pause');
  });

  console.log('Pause value before clicking pause');
  userEvent.click(startPauseResumeButton);
  console.log('Pause value after clicking resume');

  await waitFor(() => {
    expect(startPauseResumeButton).toHaveTextContent('Resume');
  });

  await waitFor(() => {
    expect(startPauseResumeButton).toHaveTextContent('Pause');
  });
});
