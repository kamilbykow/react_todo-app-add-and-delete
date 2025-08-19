import { useEffect } from 'react';

type Props = {
  query: string;
  setQuery: (item: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disableSubmit: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  query,
  setQuery,
  handleSubmit,
  disableSubmit,
  inputRef,
}) => {
  useEffect(() => {
    if (!disableSubmit) {
      inputRef.current?.focus();
    }
  }, [disableSubmit, inputRef]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={e => {
          handleSubmit(e);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputRef}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
          }}
          disabled={disableSubmit}
        />
      </form>
    </header>
  );
};
