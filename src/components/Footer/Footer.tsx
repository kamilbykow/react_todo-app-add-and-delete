import { Filter } from '../Filter/Filter';
import { Filters } from '../../App';
import { Todo } from '../../types/Todo';

type Props = {
  count: number;
  setFilter: (name: Filters) => void;
  activeFilter: Filters;
  Completed: Todo[];
  handleDelete: (id: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  count,
  setFilter,
  activeFilter,
  Completed,
  handleDelete,
}) => {
  const completedIds = Completed.map(todo => todo.id);

  return (
    // {/* Hide the footer if there are no todos */}
    <footer className={`todoapp__footer`} data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      {/* Active link should have the 'selected' class */}

      <Filter setFilter={setFilter} activeFilter={activeFilter} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!(Completed.length > 0)}
        onClick={() => handleDelete(completedIds)}
      >
        Clear completed
      </button>
    </footer>
  );
};
