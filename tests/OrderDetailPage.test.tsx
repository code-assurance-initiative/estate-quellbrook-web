import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { fakeApi, json, order } from './support/fakeApi';

const id = '0198f1a2-0000-7000-8000-000000000001';

describe('order page', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the order', async () => {
    fakeApi({ [`/api/orders/${id}`]: () => json(200, order(id)) });
    window.history.replaceState(null, '', `/orders/${id}`);
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: 'Order for Halden Bikes ApS' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 parcels, 3.5 kg')).toBeInTheDocument();
    expect(screen.getByText('Placed')).toBeInTheDocument();
  });

  it('says so when the order does not exist', async () => {
    fakeApi({});
    window.history.replaceState(null, '', `/orders/${id}`);
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Not Found');
  });
});
