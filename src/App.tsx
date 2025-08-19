/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export type Filters = 'Completed' | 'Active' | 'All';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [todos, setTodos] = useState<Todo[] | undefined>();
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<Filters>('All');
  const [tempTodo, setTempTodo] = useState<Todo[] | null>();
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  let filteredTodos: Todo[] | undefined = todos;

  const changeFilter = (name: Filters) => {
    setFilter(name);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisableSubmit(true);
    const todo = {
      title: query.trim(),
      completed: false,
      userId: 3303,
    };

    setTempTodo([{ ...todo, id: 0 }]);

    if (query.trim().length === 0) {
      setError(true);
      setErrorMsg('Title should not be empty');
    }

    postTodo(todo)
      .then(res => {
        setQuery('');
        setTempTodo(null);
        setTodos(prev => {
          if (prev === undefined) {
            return [res];
          } else {
            return [...prev, res];
          }
        });
      })
      .catch(() => {
        setTempTodo(null);
        setError(true);
        setErrorMsg('Unable to add a todo');
      })
      .finally(() => {
        setDisableSubmit(false);
      });
  };

  const handleDelete = async (id: number[]) => {
    setTodosToDelete(id);
    for (let i = 0; i < id.length; i++) {
      try {
        await deleteTodo(id[i]);
        setTodos(prev => {
          if (prev === undefined) {
            return prev;
          } else {
            return prev.filter(todo => todo.id !== id[i]);
          }
        });
      } catch {
        setError(true);
        setErrorMsg('Unable to delete a todo');
      } finally {
        setTodosToDelete([]);
        inputRef.current?.focus();
      }
    }
  };

  filteredTodos = useMemo(() => {
    if (todos) {
      switch (filter) {
        case 'Completed':
          return filteredTodos?.filter(todo => todo.completed);

        case 'Active':
          return filteredTodos?.filter(todo => !todo.completed);

        case 'All':
          return todos;
      }
    }

    return undefined;
  }, [todos, filteredTodos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodos()
      .then(resp => {
        setTodos(resp);
      })
      .catch(() => {
        setErrorMsg('Unable to load todos');
        setError(true);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={item => setQuery(item)}
          handleSubmit={handleSubmit}
          disableSubmit={disableSubmit}
          inputRef={inputRef}
        />

        <Main
          todos={filteredTodos}
          handleDelete={handleDelete}
          todosToDelete={todosToDelete}
        />
        <Main
          todos={tempTodo}
          handleDelete={handleDelete}
          todosToDelete={todosToDelete}
        />
        {/* Hide the footer if there are no todos */}

        {todos && todos?.length > 0 && (
          <Footer
            count={todos.filter(todo => !todo.completed).length}
            setFilter={changeFilter}
            activeFilter={filter}
            Completed={todos.filter(todo => todo.completed)}
            handleDelete={handleDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        hidden={error}
        setError={async err => setError(err)}
        errorMsg={errorMsg}
      />
    </div>
  );
};
