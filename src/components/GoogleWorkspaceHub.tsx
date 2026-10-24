import { useState, useEffect } from 'react';
import {
  FileText,
  Mail,
  CheckSquare,
  Database,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Send,
  Trash2,
  AlertCircle,
  X,
  Share2,
  Car,
  Clock,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initFormsAuth,
  googleFormsSignIn,
  formsSignOut,
  listGoogleForms,
  getGoogleForm,
  getGoogleFormResponses,
  createWorkshopForm,
  GoogleFormMetadata,
  GoogleFormResponse,
} from '../lib/googleFormsService';
import {
  listGmailMessages,
  sendGmailMessage,
  GmailMessageSummary,
} from '../lib/gmailService';
import {
  getGoogleTaskLists,
  getGoogleTasks,
  createGoogleTask,
  toggleGoogleTaskStatus,
  deleteGoogleTask,
  GoogleTaskList,
  GoogleTask,
} from '../lib/tasksService';
import {
  subscribeToQuotes,
  updateQuoteStatus,
  StoredQuote,
} from '../lib/firebase';

interface GoogleWorkspaceHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'forms' | 'gmail' | 'tasks' | 'firestore';

export default function GoogleWorkspaceHub({ isOpen, onClose }: GoogleWorkspaceHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('forms');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Forms state
  const [formsList, setFormsList] = useState<{ id: string; name: string; modifiedTime?: string }[]>([]);
  const [selectedForm, setSelectedForm] = useState<GoogleFormMetadata | null>(null);
  const [responses, setResponses] = useState<GoogleFormResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gmail state
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Tasks state
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<string>('');
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Firestore quotes state
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  // Notifications & Confirmations (Mandatory for destructive/send operations)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    confirmText: string;
    danger?: boolean;
    action: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = initFormsAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAuthChecking(false);
        loadWorkspaceData(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setAuthChecking(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time quotes from Firestore only when user is authenticated
  useEffect(() => {
    if (!user) {
      setQuotes([]);
      setLoadingQuotes(false);
      return;
    }
    setLoadingQuotes(true);
    const unsub = subscribeToQuotes(
      (items) => {
        setQuotes(items);
        setLoadingQuotes(false);
      },
      (err) => {
        console.warn('Firestore quotes:', err);
        setLoadingQuotes(false);
      }
    );
    return () => unsub();
  }, [user]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadWorkspaceData = async (accessToken: string) => {
    setLoading(true);
    try {
      // Load Forms
      const forms = await listGoogleForms(accessToken);
      setFormsList(forms);

      // Load Task Lists
      const lists = await getGoogleTaskLists(accessToken);
      setTaskLists(lists);
      if (lists.length > 0) {
        setSelectedTaskListId(lists[0].id);
        const t = await getGoogleTasks(lists[0].id, accessToken);
        setTasks(t);
      }

      // Load Recent Gmail messages
      const msgs = await listGmailMessages(accessToken, 8);
      setMessages(msgs);
    } catch (err: any) {
      console.warn('Workspace sync warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleFormsSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        showNotification('success', `Conectado como ${result.user.email}`);
        await loadWorkspaceData(result.accessToken);
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error al autenticar con Google Workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await formsSignOut();
    setUser(null);
    setToken(null);
    setFormsList([]);
    setMessages([]);
    setTasks([]);
    setSelectedForm(null);
    showNotification('success', 'Sesión cerrada');
  };

  // Forms actions
  const handleSelectForm = async (formId: string) => {
    if (!token) return;
    setLoadingResponses(true);
    try {
      const meta = await getGoogleForm(formId, token);
      setSelectedForm(meta);
      const resps = await getGoogleFormResponses(formId, token);
      setResponses(resps);
    } catch {
      showNotification('error', 'Error al leer respuestas del formulario');
    } finally {
      setLoadingResponses(false);
    }
  };

  const triggerCreateForm = (type: 'inspeccion' | 'satisfaccion') => {
    const isInspection = type === 'inspeccion';
    setConfirmDialog({
      title: isInspection
        ? '¿Crear Formulario de Inspección de Recepción?'
        : '¿Crear Formulario de Entrega y Calidad?',
      description: isInspection
        ? 'Se generará en tu Google Drive el checklist oficial con kilometraje, nivel de gasolina, placas/VIN, reporte de daños y servicio solicitado.'
        : 'Se generará en tu Google Drive la encuesta de satisfacción para clientes al recibir su auto terminado.',
      confirmText: 'Crear en Google Drive',
      action: async () => {
        if (!token) return;
        setLoading(true);
        try {
          const newForm = await createWorkshopForm(type, token);
          showNotification('success', `Formulario "${newForm.info.title}" creado`);
          const forms = await listGoogleForms(token);
          setFormsList(forms);
          setSelectedForm(newForm);
        } catch (err: any) {
          showNotification('error', err?.message || 'Error al crear formulario');
        } finally {
          setLoading(false);
          setConfirmDialog(null);
        }
      },
    });
  };

  // Gmail actions (Mandatory user confirmation before sending email)
  const triggerSendEmail = () => {
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) {
      showNotification('error', 'Por favor llena destinatario, asunto y mensaje');
      return;
    }

    setConfirmDialog({
      title: `¿Enviar correo a ${emailTo}?`,
      description: `Se enviará el mensaje "${emailSubject}" desde tu cuenta oficial de Gmail (${user?.email}).`,
      confirmText: 'Confirmar y Enviar Correo',
      action: async () => {
        if (!token) return;
        setLoading(true);
        try {
          await sendGmailMessage(token, emailTo, emailSubject, emailBody);
          showNotification('success', '¡Correo enviado exitosamente!');
          setEmailTo('');
          setEmailSubject('');
          setEmailBody('');
          const msgs = await listGmailMessages(token, 8);
          setMessages(msgs);
        } catch (err: any) {
          showNotification('error', err?.message || 'Error al enviar correo');
        } finally {
          setLoading(false);
          setConfirmDialog(null);
        }
      },
    });
  };

  // Tasks actions
  const handleSelectTaskList = async (listId: string) => {
    setSelectedTaskListId(listId);
    if (!token) return;
    setLoadingTasks(true);
    try {
      const t = await getGoogleTasks(listId, token);
      setTasks(t);
    } catch {
      showNotification('error', 'Error al leer tareas');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedTaskListId || !newTaskTitle.trim()) return;
    setLoadingTasks(true);
    try {
      await createGoogleTask(
        selectedTaskListId,
        { title: newTaskTitle.trim(), notes: newTaskNotes.trim() },
        token
      );
      setNewTaskTitle('');
      setNewTaskNotes('');
      const updated = await getGoogleTasks(selectedTaskListId, token);
      setTasks(updated);
      showNotification('success', 'Tarea agregada a Google Tasks');
    } catch (err: any) {
      showNotification('error', err?.message || 'Error al crear tarea');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleToggleTask = async (task: GoogleTask) => {
    if (!token || !selectedTaskListId) return;
    try {
      await toggleGoogleTaskStatus(selectedTaskListId, task.id, task.status, token);
      const updated = await getGoogleTasks(selectedTaskListId, token);
      setTasks(updated);
    } catch {
      showNotification('error', 'Error al actualizar estado de la tarea');
    }
  };

  const triggerDeleteTask = (task: GoogleTask) => {
    setConfirmDialog({
      title: `¿Eliminar tarea "${task.title}"?`,
      description: 'Esta tarea se borrará de tu lista de Google Tasks.',
      confirmText: 'Eliminar Tarea',
      danger: true,
      action: async () => {
        if (!token || !selectedTaskListId) return;
        try {
          await deleteGoogleTask(selectedTaskListId, task.id, token);
          const updated = await getGoogleTasks(selectedTaskListId, token);
          setTasks(updated);
          showNotification('success', 'Tarea eliminada');
        } catch {
          showNotification('error', 'Error al eliminar tarea');
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0b0e14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top App Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#10141d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-blue-500/20 border border-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  Taller Digital • Google Workspace & Firebase
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  En Vivo
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Formularios de inspección, correos Gmail, tareas del taller y cotizaciones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161c28] border border-white/10 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="max-w-[180px] truncate">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  title="Cerrar sesión"
                  className="ml-1 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Feature Tabs */}
        <div className="border-b border-white/10 bg-[#0e121a] px-4 sm:px-6 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('forms')}
            className={`py-3 sm:py-3.5 px-3 rounded-t-lg text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'forms'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Google Forms</span>
            {formsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-[10px]">
                {formsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gmail')}
            className={`py-3 sm:py-3.5 px-3 rounded-t-lg text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'gmail'
                ? 'border-rose-500 text-rose-300 bg-rose-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-400" />
            <span>Gmail</span>
            {messages.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-[10px]">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 sm:py-3.5 px-3 rounded-t-lg text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-300 bg-blue-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span>Tareas & Notas (Tasks)</span>
            {tasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-[10px]">
                {tasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('firestore')}
            className={`py-3 sm:py-3.5 px-3 rounded-t-lg text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'firestore'
                ? 'border-amber-500 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Cotizaciones Web (Firestore)</span>
            {quotes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px]">
                {quotes.length}
              </span>
            )}
          </button>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-800'
                : 'bg-rose-950/80 text-rose-200 border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Sign in with Google (if not yet signed into Workspace) */}
          {!user && (
            <div className="py-10 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Conecta tu cuenta de Google Workspace</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Accede a tus formularios, correos de cotización de Gmail y pendientes de Google Tasks en una sola consola.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={loading || authChecking}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{loading ? 'Conectando...' : 'Iniciar sesión con Google Workspace'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: GOOGLE FORMS */}
          {user && activeTab === 'forms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Inspección de Recepción de Auto</h4>
                      <div className="text-[10px] text-amber-400 uppercase font-semibold">Checklist de entrada</div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Preguntas oficiales para registrar VIN, gasolina, pertenencias y daños antes de iniciar trabajo.
                  </p>
                  <button
                    onClick={() => triggerCreateForm('inspeccion')}
                    disabled={loading}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear Formulario de Inspección en Drive</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Encuesta de Calidad & Entrega</h4>
                      <div className="text-[10px] text-purple-400 uppercase font-semibold">Para clientes</div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Evalúa la satisfacción en pintura, brillo cerámico y puntualidad en Nogales, Sonora.
                  </p>
                  <button
                    onClick={() => triggerCreateForm('satisfaccion')}
                    disabled={loading}
                    className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear Encuesta de Calidad en Drive</span>
                  </button>
                </div>
              </div>

              {/* Forms and Responses viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-4 bg-[#121620] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Tus Formularios ({formsList.length})</span>
                    {token && (
                      <button
                        onClick={() => loadWorkspaceData(token)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
                    {formsList.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleSelectForm(f.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs truncate transition-all cursor-pointer ${
                          selectedForm?.formId === f.id
                            ? 'bg-purple-950/40 border-purple-500/50 text-white font-semibold'
                            : 'bg-[#181d2a] border-white/5 text-neutral-300 hover:border-white/20'
                        }`}
                      >
                        <div className="truncate">{f.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 bg-[#121620] border border-white/10 rounded-xl p-4 space-y-3">
                  {selectedForm ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#181d2a]">
                        <div className="truncate">
                          <h5 className="font-bold text-white text-sm truncate">{selectedForm.info.title}</h5>
                          <span className="text-[10px] text-neutral-400 font-mono">{selectedForm.formId}</span>
                        </div>
                        {selectedForm.responderUri && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedForm.responderUri || '');
                                setCopiedLink(true);
                                setTimeout(() => setCopiedLink(false), 2000);
                              }}
                              className="px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-neutral-200 hover:bg-white/15"
                            >
                              <Share2 className="w-3.5 h-3.5 inline mr-1" />
                              <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
                            </button>
                            <a
                              href={selectedForm.responderUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                            >
                              Abrir <ExternalLink className="w-3 h-3 inline ml-1" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-bold text-neutral-300">
                          Respuestas recibidas: {responses.length}
                        </div>
                        {loadingResponses ? (
                          <div className="py-8 text-center text-xs text-neutral-400">Cargando respuestas...</div>
                        ) : responses.length === 0 ? (
                          <div className="py-6 text-center text-xs text-neutral-500 bg-[#161a26] rounded-lg">
                            Sin respuestas registradas aún.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[280px] overflow-y-auto">
                            {responses.map((r, i) => (
                              <div key={r.responseId || i} className="p-3 rounded-lg bg-[#161a26] border border-white/5 text-xs space-y-1">
                                <div className="text-[10px] text-neutral-400">
                                  {new Date(r.lastSubmittedTime || r.createTime).toLocaleString()}
                                </div>
                                {r.answers &&
                                  Object.entries(r.answers).map(([qid, val]) => (
                                    <div key={qid} className="text-neutral-200">
                                      <span className="font-semibold text-white">
                                        {selectedForm.items?.find((it) => it.questionItem?.question.questionId === qid)?.title || qid}:
                                      </span>{' '}
                                      {val.textAnswers?.answers?.map((a) => a.value).join(', ')}
                                    </div>
                                  ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-neutral-400">
                      Selecciona un formulario de la izquierda para ver respuestas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GMAIL */}
          {user && activeTab === 'gmail' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Inbox Summary (5 cols) */}
              <div className="lg:col-span-5 bg-[#121620] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Correos Recientes en Gmail ({messages.length})</span>
                  {token && (
                    <button
                      onClick={async () => {
                        setLoadingMessages(true);
                        const msgs = await listGmailMessages(token, 8);
                        setMessages(msgs);
                        setLoadingMessages(false);
                      }}
                      className="text-neutral-400 hover:text-white"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg bg-[#181d2a] border border-white/5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-semibold text-neutral-300 truncate max-w-[160px]">{m.from}</span>
                        <span>{new Date(m.date).toLocaleDateString()}</span>
                      </div>
                      <div className="font-bold text-white truncate">{m.subject}</div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{m.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compose & Send Email to Customer (7 cols) */}
              <div className="lg:col-span-7 bg-[#121620] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Redactar Correo al Cliente</h4>
                  <p className="text-xs text-neutral-400">
                    Envía presupuestos, avisos de auto listo o seguimiento directamente desde <span className="text-amber-400 font-semibold">{user.email}</span>.
                  </p>
                </div>

                {/* Quick Templates */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setEmailSubject('Presupuesto de Pintura y Carrocería - Taller Nogales');
                      setEmailBody(
                        'Estimado cliente,\n\nLe enviamos el presupuesto detallado para la reparación de su vehículo en Carrocería y Pintura Nogales.\n\n- Servicio: Pintura en Horno y Hojalatería\n- Tiempo estimado: 3 a 4 días hábiles\n- Garantía en acabado de pintura y detallado\n\nQuedamos a sus órdenes en José Zazueta #16, Los Encinos, Nogales, Son. Tel: (631) 132-2616.'
                      );
                    }}
                    className="px-2.5 py-1 rounded bg-[#202738] hover:bg-[#2a344a] text-[11px] text-neutral-300 transition-colors"
                  >
                    + Plantilla: Presupuesto
                  </button>
                  <button
                    onClick={() => {
                      setEmailSubject('¡Tu vehículo está listo para entrega! - Carrocería y Pintura Nogales');
                      setEmailBody(
                        'Estimado cliente,\n\nNos complace informarle que el trabajo de hojalatería, pintura y detallado en su vehículo ha sido concluido con éxito y está listo para ser recogido.\n\nPuede pasar a nuestro taller en Los Encinos en nuestro horario habitual (Lun-Sáb 8am a 6pm).\n\n¡Gracias por su confianza!'
                      );
                    }}
                    className="px-2.5 py-1 rounded bg-[#202738] hover:bg-[#2a344a] text-[11px] text-neutral-300 transition-colors"
                  >
                    + Plantilla: Auto Listo
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Para (Correo del cliente):</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="cliente@gmail.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#181d2a] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Asunto:</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Asunto del correo..."
                      className="w-full px-3 py-2 rounded-lg bg-[#181d2a] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Mensaje:</label>
                    <textarea
                      rows={5}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Escribe el mensaje para el cliente..."
                      className="w-full px-3 py-2 rounded-lg bg-[#181d2a] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 resize-none font-sans"
                    />
                  </div>

                  <button
                    onClick={triggerSendEmail}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Correo vía Gmail (Requiere Confirmación)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE TASKS & KEEP */}
          {user && activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#121620] border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">Pendientes y Notas del Taller</h4>
                  <p className="text-xs text-neutral-400">
                    Organiza compras de pintura, autos en turno de horneado y entregas del día sincronizadas con Google Tasks.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://keep.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-colors flex items-center gap-1.5"
                  >
                    <span>Abrir Google Keep</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Lists picker */}
                <div className="lg:col-span-4 bg-[#121620] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-white">Listas de Tareas</div>
                  <div className="space-y-1.5">
                    {taskLists.map((tl) => (
                      <button
                        key={tl.id}
                        onClick={() => handleSelectTaskList(tl.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs truncate transition-all cursor-pointer ${
                          selectedTaskListId === tl.id
                            ? 'bg-blue-950/40 border-blue-500/50 text-white font-semibold'
                            : 'bg-[#181d2a] border-white/5 text-neutral-300 hover:border-white/20'
                        }`}
                      >
                        {tl.title}
                      </button>
                    ))}
                  </div>

                  {/* Add task form */}
                  <form onSubmit={handleCreateTask} className="pt-2 border-t border-white/10 space-y-2 text-xs">
                    <div className="font-semibold text-white">Agregar nuevo pendiente</div>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Ej. Pulir fascia GMC Sierra..."
                      className="w-full px-3 py-2 rounded-lg bg-[#181d2a] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={newTaskNotes}
                      onChange={(e) => setNewTaskNotes(e.target.value)}
                      placeholder="Notas adicionales (opcional)..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#181d2a] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-[11px]"
                    />
                    <button
                      type="submit"
                      disabled={loadingTasks || !newTaskTitle.trim()}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Guardar en Google Tasks</span>
                    </button>
                  </form>
                </div>

                {/* Tasks list */}
                <div className="lg:col-span-8 bg-[#121620] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Tareas en la lista ({tasks.length})</span>
                    {token && selectedTaskListId && (
                      <button
                        onClick={() => handleSelectTaskList(selectedTaskListId)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingTasks ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>

                  {loadingTasks ? (
                    <div className="py-10 text-center text-xs text-neutral-400">Cargando tareas...</div>
                  ) : tasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-500 bg-[#161a26] rounded-lg">
                      No hay tareas pendientes en esta lista.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[360px] overflow-y-auto">
                      {tasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#181d2a] border border-white/5 text-xs group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                            <input
                              type="checkbox"
                              checked={t.status === 'completed'}
                              onChange={() => handleToggleTask(t)}
                              className="w-4 h-4 rounded border-neutral-600 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                            <div className="truncate">
                              <span
                                className={`font-semibold ${
                                  t.status === 'completed'
                                    ? 'line-through text-neutral-500'
                                    : 'text-white'
                                }`}
                              >
                                {t.title}
                              </span>
                              {t.notes && <div className="text-[11px] text-neutral-400 truncate">{t.notes}</div>}
                            </div>
                          </div>
                          <button
                            onClick={() => triggerDeleteTask(t)}
                            title="Eliminar tarea"
                            className="p-1.5 rounded text-neutral-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FIRESTORE QUOTES */}
          {activeTab === 'firestore' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-[#121620] border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">Solicitudes de Presupuesto en Firebase</h4>
                  <p className="text-xs text-neutral-400">
                    Cotizaciones enviadas en tiempo real por visitantes de la página web.
                  </p>
                </div>
                {user && (
                  <div className="text-xs text-amber-400 font-bold">
                    {quotes.length} cotizaciones guardadas
                  </div>
                )}
              </div>

              {!user ? (
                <div className="py-12 px-4 text-center rounded-xl bg-[#121620] border border-dashed border-white/10 space-y-3 max-w-md mx-auto">
                  <Database className="w-8 h-8 text-amber-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Inicia sesión para gestionar cotizaciones</div>
                  <p className="text-xs text-neutral-400">
                    Para proteger los datos personales de los clientes, las cotizaciones en Firestore solo son accesibles con tu cuenta de taller autorizada.
                  </p>
                  <button
                    onClick={handleSignIn}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Iniciar sesión con Google</span>
                  </button>
                </div>
              ) : loadingQuotes ? (
                <div className="py-12 text-center text-xs text-neutral-400">Conectando con Firestore...</div>
              ) : quotes.length === 0 ? (
                <div className="py-10 text-center text-xs text-neutral-500 bg-[#121620] rounded-xl border border-dashed border-white/10">
                  Aún no se han enviado cotizaciones desde la calculadora web. Las solicitudes aparecerán aquí automáticamente.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div>
                          <span className="font-bold text-white text-sm">{q.clientName}</span>
                          <span className="text-[11px] text-neutral-400 ml-2">📞 {q.clientPhone}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            q.status === 'recibida'
                              ? 'bg-blue-500/20 text-blue-400'
                              : q.status === 'en_revision'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>

                      <div className="text-neutral-300">
                        <span className="text-neutral-400">Vehículo:</span>{' '}
                        <span className="font-semibold text-white">
                          {q.vehicleMake} {q.vehicleModel} ({q.vehicleYear})
                        </span>
                      </div>

                      <div className="text-neutral-300">
                        <span className="text-neutral-400">Servicio:</span> {q.serviceType}
                      </div>

                      {q.estimatedRange && (
                        <div className="text-emerald-400 font-semibold">
                          Estimado: {q.estimatedRange}
                        </div>
                      )}

                      {q.description && (
                        <div className="p-2 rounded bg-[#181d2a] text-[11px] text-neutral-300">
                          {q.description}
                        </div>
                      )}

                      {/* Status changer buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-neutral-400">Cambiar estado:</span>
                        {(['recibida', 'en_revision', 'presupuestada', 'en_taller'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateQuoteStatus(q.id, st)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                              q.status === st
                                ? 'bg-amber-500 text-neutral-950 font-bold'
                                : 'bg-white/5 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Mandatory User Confirmation Dialog */}
        {confirmDialog && (
          <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#161c28] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  confirmDialog.danger
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                }`}
              >
                {confirmDialog.danger ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{confirmDialog.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{confirmDialog.description}</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDialog.action}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
                    confirmDialog.danger
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {confirmDialog.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
