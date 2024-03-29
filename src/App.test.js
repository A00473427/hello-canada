// App.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import fetchMock from 'jest-fetch-mock';

//Although the api will return the same respone, mocking it as it is how its normally done

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('Hello Canada App', () => {
  it('renders with initial state set to provinces', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ name: 'Ontario', capital: 'Toronto' }]));

    render(<App />);
    const provincesButton = screen.getByText(/provinces/i);

    expect(provincesButton).toBeInTheDocument();
    expect(screen.getByAltText("Canada's Flag")).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith('https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/provinces');
  });

  it('changes data when "Territories" is clicked', async () => {
    const mockProvincesData = [{ name: 'Ontario', capital: 'Toronto', flagUrl: 'flag-url-ontario' }];
    const mockTerritoriesData = [{ name: 'Yukon', capital: 'Whitehorse', flagUrl: 'flag-url-yukon' }];

    fetchMock.mockResponseOnce(JSON.stringify(mockProvincesData));

    render(<App />);

    await waitFor(() => screen.getByText('Ontario'));

    fetchMock.mockResponseOnce(JSON.stringify(mockTerritoriesData));

    fireEvent.click(screen.getByText(/territories/i));

    await waitFor(() => screen.getByText('Yukon'));

    expect(screen.getByText('Yukon')).toBeInTheDocument();
  });

  it('fetches and displays provinces data correctly after clicking provinces from territories', async () => {
    const mockProvincesData = [{ name: 'Ontario', capital: 'Toronto', flagUrl: 'flag-url-ontario' }];
    const mockTerritoriesData = [{ name: 'Yukon', capital: 'Whitehorse', flagUrl: 'flag-url-yukon' }];
    fetch.mockResponseOnce(JSON.stringify(mockProvincesData));

    render(<App />);
    
    await waitFor(() => screen.findByText('Ontario'));

    fetchMock.mockResponseOnce(JSON.stringify(mockTerritoriesData));

    fireEvent.click(screen.getByText(/territories/i));

    await waitFor(() => screen.getByText('Yukon'));

    fetch.mockResponseOnce(JSON.stringify(mockProvincesData));

    fireEvent.click(screen.getByText(/provinces/i));

    await waitFor(() => screen.findByText('Ontario'));

    const listItem = await screen.findByText('Ontario');
    expect(listItem).toBeInTheDocument();
    expect(screen.getByAltText("Ontario's Flag")).toHaveAttribute('src', 'flag-url-ontario');
  });

  it('shows and hides capital city when "Show Capital" button is clicked', async () => {
    const mockData = [{ name: 'Ontario', capital: 'Toronto', flagUrl: 'flag-url-ontario' }];
    fetch.mockResponseOnce(JSON.stringify(mockData));

    render(<App />);
    await screen.findByText('Ontario'); 

    const showCapitalButton = screen.getByText(/show capital/i);
    fireEvent.click(showCapitalButton);

    expect(screen.getByText('Toronto')).toBeInTheDocument();

    fireEvent.click(showCapitalButton);

    expect(screen.queryByText('Toronto')).toBeNull();
  });

  it('displays an error message when the data fetch fails', async () => {
    // This test should fail as there is no error handling in the app

    // Mock a fetch error response
    fetchMock.mockReject(new Error('API is down'));

    render(<App />);

    // Assuming error would be handled by alert
    await waitFor(() => {
      const alertMessage = screen.getByRole('alert');
      expect(alertMessage).toBeInTheDocument();
      expect(alertMessage).toHaveTextContent(/unable to load data/i);
    });
  });
  
});
