import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/store';
import { IntervalSliceActions } from '../store/IntervalSlice';
import Timer from '../components/Timer';

// Mocking useDispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
const renderTimerComponent = (props: any) => {
  return render(
    <Provider store={store}>
      <Timer {...props} />
    </Provider>
  );
};

describe('Timer Component', () => {
  let mockDispatch: any;

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.requireMock('react-redux').useDispatch.mockReturnValue(mockDispatch);
  });

  test('Dispatches toggleInterval action on clicking Pomodoro button', async () => {
    //Arrange
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

    //Act
    renderTimerComponent(commonProps);
    const pomodoroButton = screen.getByTestId('pomodoro-button');

    fireEvent.click(pomodoroButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        IntervalSliceActions.toggleInterval('Pomodoro')
      );
    });
  });

  test('Dispatches toggleInterval action on clicking Short Break button', async () => {
    //Arrange
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

    //Act
    renderTimerComponent(commonProps);
    const shortBreakButton = screen.getByTestId('short-break-button');

    fireEvent.click(shortBreakButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        IntervalSliceActions.toggleInterval('Short Break')
      );
    });
  });

  test('Dispatches toggleInterval action on clicking Pomodoro button', async () => {
    //Arrange
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

    //Act
    renderTimerComponent(commonProps);
    const LongBreakButton = screen.getByTestId('long-break-button');

    fireEvent.click(LongBreakButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        IntervalSliceActions.toggleInterval('Long Break')
      );
    });
  });
});
