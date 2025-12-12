import { useEffect, useMemo, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import "./navbar.css";



/**

 * Navbar

 * Props opcionales:

 * - isAuthenticated, posts, notifications, unreadCount

 * - onMarkNotificationRead

 * - onLogout (Función que viene del AuthContext para cerrar la sesión global)

 * - avatarUrl, userName, role, isAdmin

 */

export default function Navbar({

  isAuthenticated = true,

  posts = [],

  notifications = [],

  unreadCount = 0,

  onMarkNotificationRead = () => {},

  onLogout, // ⬅️ Recibido del MainLayout/AuthContext

  avatarUrl = "/Access.ico",

  userName = "Usuario",

  role = "Miembro",

  isAdmin = false,

}) {

  const navigate = useNavigate();



  // ================== BÚSQUEDA ==================

  const [term, setTerm] = useState("");

  const [showSearch, setShowSearch] = useState(false);

  const blurTimer = useRef(null);



  const filteredPosts = useMemo(() => {

    if (!isAuthenticated || !term.trim()) return [];

    const t = term.toLowerCase();

    return posts

      .filter((p) => (p?.titulo || "").toLowerCase().includes(t))

      .slice(0, 10);

  }, [posts, term, isAuthenticated]);



  const goToPost = (id) => {

    navigate(`/post/${id}`);

    setShowSearch(false);

    setTerm("");

  };



  const handleSearchBlur = () => {

    blurTimer.current = setTimeout(() => setShowSearch(false), 120);

  };

  const handleSearchFocus = () => {

    if (blurTimer.current) clearTimeout(blurTimer.current);

    setShowSearch(true);

  };



  // ================== NOTIFICACIONES ==================

  const [showNotifs, setShowNotifs] = useState(false);

  const notifRef = useRef(null);



  const toggleNotifs = (e) => {

    e.stopPropagation();

    setShowNotifs((v) => !v);

  };



  useEffect(() => {

    const close = (e) => {

      if (!notifRef.current) return;

      if (!notifRef.current.contains(e.target)) setShowNotifs(false);

    };

    document.addEventListener("click", close);

    return () => document.removeEventListener("click", close);

  }, []);



  const handleClickNotif = (n) => {

    onMarkNotificationRead?.(n);

  };



  // ================== MENÚ DE USUARIO (NUEVA LÓGICA) ==================
  const [showUserMenu, setShowUserMenu] = useState(false); // ⬅️ NUEVO ESTADO
  const userMenuRef = useRef(null); // ⬅️ NUEVA REF

  const toggleUserMenu = (e) => { // ⬅️ NUEVA FUNCIÓN
    e.preventDefault();
    e.stopPropagation();
    setShowNotifs(false); // Cierra notificaciones
    setShowUserMenu((v) => !v);
  };

  // ================== CIERRE GLOBAL (COMBINADO) ==================
  useEffect(() => {
    const close = (e) => {
      // Cierre de Notificaciones
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      // Cierre de Menú de Usuario
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);


  // ================== LOGOUT ==================
  const handleLogout = async () => {
    setShowUserMenu(false); // ⬅️ Cierra el menú al hacer logout
    try {
      // 1. Ejecuta la función logout del contexto
      if (typeof onLogout === "function") {
        await onLogout();
      }
    } catch (_e) {
      // Ignoramos error de backend/contexto para no trabar el cierre local
    } finally {
      // 2. Limpieza local final y redirección
      try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.clear();
      } catch {}
      navigate("/", { replace: true });
    }
  };



  return (

    <div id="main-wrapper">

      <div className="modern-navbar">

        <div className="navbar-container">

          {/* Logo */}

          <div className="logo-section">

            <Link to="/foro" className="navbar-brand-link">

              <img src="/foro.png" alt="ForoRandomUces" className="logo" />

              <span className="brand-text">ForoRandomUces</span>

            </Link>

          </div>



          {/* Search */}

          <div className="search-container d-none d-md-flex">

            <div className="search-wrapper">

              <input

                type="text"

                className="search-input"

                placeholder="Busca una publicación..."

                value={term}

                onChange={(e) => setTerm(e.target.value)}

                onFocus={handleSearchFocus}

                onBlur={handleSearchBlur}

                autoComplete="off"

              />

              <i className="bi bi-search search-icon" />

            </div>



            <div

              className={`search-dropdown ${

                showSearch && isAuthenticated ? "show" : ""

              }`}

            >

              {!isAuthenticated ? (

                <div className="search-disabled">

                  Debes iniciar sesión para buscar publicaciones.

                </div>

              ) : (

                <div id="searchResults">

                  {filteredPosts.map((post) => (

                    <div

                      key={post.id_post}

                      className="search-item"

                      onMouseDown={() => goToPost(post.id_post)}

                    >

                      {post.titulo}

                    </div>

                  ))}

                  {term.length > 0 && filteredPosts.length === 0 && (

                    <div className="search-item search-item-disabled">

                      No se encontraron publicaciones

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>



          {/* Acciones */}

          <div className="nav-actions d-none d-md-flex">

            <Link to="/main-layout/categorias" className="nav-btn btn-primary">

              <i className="bi bi-list-task" />

              <span>Categorías</span>

            </Link>



            <Link to="/main-layout/create-post" className="nav-btn btn-outline">

              <i className="bi bi-plus-lg" />

              <span>Crear Publicación</span>

            </Link>

          </div>



          {/* Usuario */}

          <div className="user-section">

            {/* Notificaciones */}

            <div className="notification-container" ref={notifRef}>

              <button className="notification-btn" onClick={toggleNotifs}>

                <i className="bi bi-bell-fill" />

                {unreadCount > 0 && (

                  <span className="notification-badge">{unreadCount}</span>

                )}

              </button>



              <div className={`notification-dropdown ${showNotifs ? "show" : ""}`}>

                <h6 className="notification-header">Notificaciones</h6>



                {notifications.length === 0 ? (

                  <div className="no-notifications">Sin notificaciones</div>

                ) : (

                  notifications.map((n, idx) => (

                    <div

                      key={n.id ?? idx}

                      className={

                        "notification-item " +

                        ((n.leido === 0 || n.leido === "0") ? "notification-new" : "")

                      }

                      onClick={() => handleClickNotif(n)}

                    >

                      <div className="notification-message">

                        {n.usuario_origen}:{" "}

                        <span

                          dangerouslySetInnerHTML={{ __html: n.mensaje }}

                        />

                      </div>

                      <div className="notification-date">{n.fecha_envio}</div>

                    </div>

                  ))

                )}

              </div>

            </div>



            {/* Menú de usuario */}

            <div className="user-dropdown dropdown" ref={userMenuRef}>
              <button
                className="user-trigger"
                type="button"
                aria-expanded={showUserMenu}
                onClick={toggleUserMenu}
              >
                <i className="bi bi-person-circle user-avatar-icon" style={{ fontSize: "1.8rem" }} />
                <div className="user-info d-none d-md-block">
                  <div className="user-name">{userName}</div>
                  <div className="user-role">{role}</div>
                </div>
                <i className="bi bi-chevron-down" />
              </button>



              <ul className={`dropdown-menu dropdown-menu-end modern-dropdown ${showUserMenu ? 'show' : ''}`}>

                <li>

                  <Link to="/main-layout/profile" className="dropdown-item modern-dropdown-item" onClick={() => setShowUserMenu(false)} >
                <i className="bi bi-person-lines-fill" /> Perfil </Link>

                </li>



                {isAdmin && (

                  <li>

                    <Link to="/main-layout/admin-panel" className="dropdown-item modern-dropdown-item text-danger botonAdmin" onClick={() => setShowUserMenu(false)} >
                      <i className="bi bi-people-fill" /> Panel de usuarios
                    </Link>

                  </li>

                )}



                <li>
                  <button className="dropdown-item modern-dropdown-item" type="button" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left" /> Cerrar sesión
                  </button>
                </li>

              </ul>

            </div>

          </div>

          {/* /Usuario */}

        </div>

      </div>

    </div>

  );

}