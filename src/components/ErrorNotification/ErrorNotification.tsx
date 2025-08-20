import { useEffect, useState } from 'react';

type Props = {
  hidden: string;
  setError: (err: string) => {};
  error: string;
};

export const ErrorNotification: React.FC<Props> = ({
  hidden,
  setError,
  error,
}) => {
  const [hide, setHide] = useState(true);
  const ERROR_CLEANUP_TIMEOUT = 3000;

  useEffect(() => {
    if (hidden) {
      setHide(false);
      setTimeout(() => {
        setHide(true);
        setError('');
      }, ERROR_CLEANUP_TIMEOUT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${hide ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setHide(true);
        }}
      />
      {error}
    </div>
  );
};
