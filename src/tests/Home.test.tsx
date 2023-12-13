import { render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/Home';
import { Provider } from 'react-redux';
import store from '../store/store';
import userEvent from '@testing-library/user-event';

const renderHomeComponent = () => {
  return render(
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    renderHomeComponent();
  });

  //Display tests
  test('Renders Home components', async () => {
    const headerComponent = screen.getByTestId('header-component');
    const timerComponent = screen.getByTestId('timer-component');
    const taskListComponent = screen.getByTestId('task-list-component');
    //  const addTaskButton = screen.getByTestId('add-task-button-inside');
    expect(headerComponent).toBeDefined();
    expect(timerComponent).toBeDefined();
    expect(taskListComponent).toBeDefined();
  });

  //Functional tests
  test('Analytics page is not rendered if open state is false', () => {
    const analyticsComp = screen.queryByTestId('analytics-component');

    expect(analyticsComp).toBeNull();
  });
  test('Renders Analytics page if open state is true', async () => {
    const openAnalyticsButton = screen.getByTestId('open-ana-page-button');

    await userEvent.click(openAnalyticsButton);

    const analyticsComponent = screen.getByTestId('analytics-component');
    expect(analyticsComponent).toBeDefined();
  });
  test('Progress bar is not rendered if taskList is empty', () => {
    const progressBar = screen.queryByTestId('progress-bar');

    expect(progressBar).toBeNull();
  });
  test('Renders Add task button if not adding task', async () => {
    const addTaskButtonComp = screen.getByTestId('add-task-button-component');
    const addTaskInputComp = screen.queryByTestId('add-task-input-component');

    expect(addTaskButtonComp).toBeDefined();
    expect(addTaskInputComp).toBeNull();

    if (addTaskButtonComp) {
      await userEvent.click(screen.getByTestId('add-task-button'));

      await waitFor(() => {
        expect(screen.getByTestId('add-task-input-component')).toBeDefined();
        expect(screen.queryByTestId('add-task-button-component')).toBeNull();
      });
    }
  });
});
