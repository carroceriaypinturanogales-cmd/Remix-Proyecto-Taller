export interface GoogleTaskList {
  id: string;
  title: string;
  updated: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  updated: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
}

// 1. List user task lists
export async function getGoogleTaskLists(token: string): Promise<GoogleTaskList[]> {
  const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al obtener listas de tareas: ${res.status} ${errText}`);
  }
  const data = await res.json();
  return data.items || [];
}

// 2. List tasks in a list
export async function getGoogleTasks(taskListId: string, token: string): Promise<GoogleTask[]> {
  const safeListId = encodeURIComponent(taskListId.trim());
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${safeListId}/tasks?showCompleted=true&showHidden=true`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al leer tareas: ${res.status} ${errText}`);
  }
  const data = await res.json();
  return data.items || [];
}

// 3. Create a task (e.g. "Terminar pulido GMC Sierra", "Comprar transparente Sherwin Williams")
export async function createGoogleTask(
  taskListId: string,
  task: { title: string; notes?: string; due?: string },
  token: string
): Promise<GoogleTask> {
  const safeListId = encodeURIComponent(taskListId.trim());
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${safeListId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al crear tarea: ${res.status} ${errText}`);
  }
  return res.json();
}

// 4. Update task status (toggle complete)
export async function toggleGoogleTaskStatus(
  taskListId: string,
  taskId: string,
  currentStatus: 'needsAction' | 'completed',
  token: string
): Promise<GoogleTask> {
  const safeListId = encodeURIComponent(taskListId.trim());
  const safeTaskId = encodeURIComponent(taskId.trim());
  const nextStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';

  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${safeListId}/tasks/${safeTaskId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: nextStatus,
        completed: nextStatus === 'completed' ? new Date().toISOString() : null,
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al actualizar estado de tarea: ${res.status} ${errText}`);
  }
  return res.json();
}

// 5. Delete task
export async function deleteGoogleTask(
  taskListId: string,
  taskId: string,
  token: string
): Promise<void> {
  const safeListId = encodeURIComponent(taskListId.trim());
  const safeTaskId = encodeURIComponent(taskId.trim());
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${safeListId}/tasks/${safeTaskId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al eliminar tarea: ${res.status} ${errText}`);
  }
}
