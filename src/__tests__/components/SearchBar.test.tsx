import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../components/movie/SearchBar';
import type { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

const mockSearchMovies = vi.fn();
const mockClearSearch = vi.fn();

vi.mock('../../stores/useMovieStore', () => ({
  useMovieStore: vi.fn(() => ({
    searchMovies: mockSearchMovies,
    clearSearch: mockClearSearch,
    searchQuery: '',
  })),
}));

vi.mock('../../components/ui/Input', () => ({
  default: ({ value, onChange, onKeyPress, placeholder, className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
    <input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyPress}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}));

vi.mock('../../components/ui/Button', () => ({
  default: ({ children, onClick, disabled, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
  X: () => <svg data-testid="x-icon" />,
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search movies, actors, directors...');
    expect(searchInput).toBeInTheDocument();
  });

  it('calls searchMovies when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search movies, actors, directors...');
    await user.type(searchInput, 'Avengers');
    
    const searchButton = screen.getByTestId('search-icon').closest('button');
    expect(searchButton).toBeInTheDocument();
    
    await user.click(searchButton!);
    
    expect(mockSearchMovies).toHaveBeenCalledWith('Avengers', 1);
  });

  it('calls searchMovies when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search movies, actors, directors...');
    await user.type(searchInput, 'Avengers');
    await user.keyboard('{Enter}');
    
    expect(mockSearchMovies).toHaveBeenCalledWith('Avengers', 1);
  });

  it('shows X button when there is text and clears text when clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search movies, actors, directors...');
    await user.type(searchInput, 'test');
    
    const clearButton = screen.getByTestId('x-icon').closest('button');
    expect(clearButton).toBeInTheDocument();
    
    await user.click(clearButton!);
    expect(searchInput).toHaveValue('');
  });

  it('disables search button when input is empty', () => {
    render(<SearchBar />);
    
    const searchButton = screen.getByTestId('search-icon').closest('button');
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toBeDisabled();
  });

  it('calls onSearchStart when search is performed', async () => {
    const mockOnSearchStart = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearchStart={mockOnSearchStart} />);
    
    const searchInput = screen.getByPlaceholderText('Search movies, actors, directors...');
    await user.type(searchInput, 'Avengers');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearchStart).toHaveBeenCalled();
  });

  it('does not search with empty query', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchButton = screen.getByTestId('search-icon').closest('button');
    
    await user.click(searchButton!);
    
    expect(mockSearchMovies).not.toHaveBeenCalled();
  });

  it('does not search with whitespace only', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search movies, actors, directors...');
    await user.type(searchInput, '   ');
    
    const searchButton = screen.getByTestId('search-icon').closest('button');
    await user.click(searchButton!);
    
    expect(mockSearchMovies).not.toHaveBeenCalled();
  });
});