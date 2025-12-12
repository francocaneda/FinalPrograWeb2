// src/pages/PostDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import postService from '../services/post.service';
import { useAuth } from '../context/AuthContext';
import './post-detail.css';

function PostDetail() {
  const { id_post } = useParams(); // ID del post
  const navigate = useNavigate();
  const { user } = useAuth(); // Usuario logueado
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPost = async () => {
      try {
        const resp = await postService.getPostDetalle(Number(id_post));
        // Ajuste según lo que devuelva el backend
        setPost(resp.post || resp); 
      } catch (error) {
        console.error('Error al cargar post:', error);
        Swal.fire('Error', 'No se pudo cargar el post', 'error');
      } finally {
        setLoading(false);
      }
    };
    cargarPost();
  }, [id_post]);

  const eliminarPost = async () => {
    if (!post) return;

    if (user?.uid !== post.id_usuario && !user?.isAdmin) {
      return Swal.fire('Error', 'No tienes permisos para eliminar este post', 'error');
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas eliminar este post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await postService.eliminarPost(post.id_post);
        Swal.fire('Eliminado', 'El post fue eliminado correctamente', 'success');
        navigate(-1);
      } catch (error) {
        console.error('Error al eliminar post', error);
        Swal.fire('Error', 'No se pudo eliminar el post', 'error');
      }
    }
  };

  const getInitials = (nombre) => {
    if (!nombre) return '';
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase();
  };

  const formatFechaRelativa = (fecha) => {
    if (!fecha) return '';
    const fechaDate = new Date(fecha);
    const diffMs = Date.now() - fechaDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  if (loading) return <div>Cargando post...</div>;
  if (!post) return <div>Post no encontrado</div>;

  return (
    <div className="post-detail-container">
      {/* Breadcrumb */}
      <div className="post-breadcrumb">
        <Link to="/foro" className="breadcrumb-link">Foro</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/main-layout/categorias" className="breadcrumb-link">Categorías</Link>
        <span className="breadcrumb-separator">›</span>
        <span>{post.titulo}</span>
      </div>

      {/* Post */}
      <div className="post-detail-card">
        <div className="post-detail-header">
          <h1 className="post-detail-title">{post.titulo}</h1>

          <div className="post-detail-meta">
            <div className="post-detail-author">
              <div className="author-avatar-large">{getInitials(post.nombre_completo)}</div>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>{post.nombre_completo}</div>
                <div style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Usuario</div>
              </div>
            </div>
            <div className="post-detail-time">
              <span>🕒</span>
              <span>{formatFechaRelativa(post.fecha_creacion)}</span>
            </div>
          </div>

          <div className="post-detail-tags">
            <span className="post-detail-tag">{post.nombre_categoria}</span>
          </div>
        </div>

        <div className="post-detail-content">
          <p>{post.contenido}</p>
        </div>

        {(user?.uid === post.id_usuario || user?.isAdmin) && (
          <button
            className="btn btn-danger"
            style={{ marginTop: '1rem' }}
            onClick={eliminarPost}
          >
            Eliminar Post
          </button>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
