import { useEffect, useState } from 'react';

type Props = {
  hidden: boolean;
  setError: (err: boolean) => {};
  errorMsg: string | undefined;
};

export const ErrorNotification: React.FC<Props> = ({
  hidden,
  setError,
  errorMsg,
}) => {
  const [hide, setHide] = useState(true);

  useEffect(() => {
    if (hidden) {
      setHide(false);
      setTimeout(() => {
        setHide(true);
        setError(false);
      }, 3000);
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
      {/* show only one message at a time */}
      {/* Unable to load todos */}
      {errorMsg}
      {/* <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
