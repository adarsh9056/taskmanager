import { useDeferredValue, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';
import StatsGrid from '../components/StatsGrid';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskFormModal from '../components/TaskFormModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/http';

const defaultFilters = {
  search: '',
  status: '',
  dueFrom: '',
  dueTo: '',
  sortBy: 'createdAt',
  order: 'desc'
};

const defaultStats = {
  total: 0,
  todo: 0,
  'in-progress': 0,
  completed: 0,
  dueSoon: 0,
  overdue: 0
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { pushToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [stats, setStats] = useState(defaultStats);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'create',
    task: null
  });

  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, filters.status, filters.dueFrom, filters.dueTo, filters.sortBy, filters.order]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setTasksLoading(true);
      setStatsLoading(true);

      try {
        const params = {
          page,
          limit: 6,
          sortBy: filters.sortBy,
          order: filters.order
        };

        if (deferredSearch) {
          params.search = deferredSearch;
        }

        if (filters.status) {
          params.status = filters.status;
        }

        if (filters.dueFrom) {
          params.dueFrom = filters.dueFrom;
        }

        if (filters.dueTo) {
          params.dueTo = filters.dueTo;
        }

        const [tasksResponse, statsResponse] = await Promise.all([
          api.get('/tasks', { params, signal: controller.signal }),
          api.get('/tasks/stats', { signal: controller.signal })
        ]);

        setTasks(tasksResponse.data.data.tasks);
        setPagination(tasksResponse.data.data.pagination);
        setStats(statsResponse.data.data.stats);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          pushToast(getApiErrorMessage(error), 'error');
        }
      } finally {
        setTasksLoading(false);
        setStatsLoading(false);
      }
    };

    loadDashboard();

    return () => {
      controller.abort();
    };
  }, [
    deferredSearch,
    filters.dueFrom,
    filters.dueTo,
    filters.order,
    filters.sortBy,
    filters.status,
    page,
    refreshKey
  ]);

  const openCreateModal = () => {
    setModalState({
      open: true,
      mode: 'create',
      task: null
    });
  };

  const openEditModal = (task) => {
    setModalState({
      open: true,
      mode: 'edit',
      task
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      mode: 'create',
      task: null
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  const handleSubmitTask = async (payload) => {
    setSaving(true);

    try {
      if (modalState.mode === 'create') {
        await api.post('/tasks', payload);
        pushToast('Task created successfully.', 'success');
        setPage(1);
      } else {
        await api.patch(`/tasks/${modalState.task._id}`, payload);
        pushToast('Task updated successfully.', 'success');
      }

      setRefreshKey((currentKey) => currentKey + 1);
      closeModal();
    } catch (error) {
      pushToast(getApiErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (task) => {
    const shouldDelete = window.confirm(`Delete "${task.title}"?`);

    if (!shouldDelete) {
      return;
    }

    setDeletingTaskId(task._id);

    try {
      await api.delete(`/tasks/${task._id}`);
      pushToast('Task deleted successfully.', 'success');

      if (tasks.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      setRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      pushToast(getApiErrorMessage(error), 'error');
    } finally {
      setDeletingTaskId('');
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <Navbar user={user} onCreateTask={openCreateModal} onLogout={handleLogout} logoutLoading={logoutLoading} />

      <StatsGrid stats={stats} loading={statsLoading} />

      <TaskFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

      <section className="tasks-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tasks</p>
            <h2>Execution board</h2>
          </div>
          <span className="results-count">{pagination.total} total results</span>
        </div>

        {tasksLoading ? (
          <div className="tasks-empty">
            <p>Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty">
            <h3>No tasks match the current view.</h3>
            <p>Create a new task or relax the filters to see more work items.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                deleting={deletingTaskId === task._id}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
      </section>

      <TaskFormModal
        open={modalState.open}
        mode={modalState.mode}
        task={modalState.task}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
      />
    </main>
  );
}
