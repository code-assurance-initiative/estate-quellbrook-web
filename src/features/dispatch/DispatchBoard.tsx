import { useState } from 'react';
import { getBoard, startRoute } from '../../api/dispatch';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useLoad } from '../../useLoad';
import { RouteCard } from './RouteCard';

const today = () => new Date().toISOString().slice(0, 10);

export function DispatchBoard() {
  const [date, setDate] = useState(today);
  const [board, reload] = useLoad((signal) => getBoard(date, signal), date);
  const [actionError, setActionError] = useState<unknown>();

  const start = (routeId: string) => {
    startRoute(routeId).then(
      () => {
        setActionError(undefined);
        reload();
      },
      (error: unknown) => {
        setActionError(error);
      },
    );
  };

  return (
    <section aria-labelledby="board-heading">
      <h1 id="board-heading">Dispatch board</h1>
      <label htmlFor="board-date">Day</label>{' '}
      <input
        id="board-date"
        type="date"
        value={date}
        onChange={(event) => {
          setDate(event.target.value);
        }}
      />
      {actionError !== undefined && <ErrorMessage error={actionError} />}
      {board.state === 'loading' && <p role="status">Loading routes…</p>}
      {board.state === 'failed' && <ErrorMessage error={board.error} />}
      {board.state === 'loaded' &&
        (board.value.length === 0 ? (
          <p>No routes planned for this day.</p>
        ) : (
          <ul className="board">
            {board.value.map((route) => (
              <RouteCard key={route.routeId} route={route} onStart={start} />
            ))}
          </ul>
        ))}
    </section>
  );
}
