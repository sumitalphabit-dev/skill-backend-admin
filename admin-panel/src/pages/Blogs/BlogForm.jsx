import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const BlogForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: ''
  });
  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        try {
          const response = await api.get(`/admin/blogs/${id}`);
          const blogData = response.data.data;
          setFormData({
            title: blogData.title || '',
            slug: blogData.slug || '',
            content: blogData.content || ''
          });
          if (blogData.image && blogData.image !== 'no-photo.jpg') {
            setExistingImage(blogData.image.startsWith('http') ? blogData.image : `http://localhost:5000/${blogData.image}`);
          }
        } catch (error) {
          alert('Failed to fetch blog details');
          navigate('/blogs');
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Please add a title';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Please add some content';
    }
    
    if (formData.slug && !formData.slug.trim()) {
      newErrors.slug = 'Slug cannot be empty if provided';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    if (formData.slug) {
      submitData.append('slug', formData.slug);
    }
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/blogs/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/blogs', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/blogs');
    } catch (error) {
      console.error(error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} blog`;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/blogs" className="btn btn-secondary" style={{ padding: '10px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>{isEditing ? 'Edit Blog' : 'Create New Blog'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isEditing ? 'Update the details of your blog below.' : 'Draft a new post for your audience.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Main Content Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>General Information</h2>
              <div className="input-group">
                <label htmlFor="title">Blog Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="input-field"
                  style={{ fontSize: '16px', padding: '12px' }}
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter an engaging title"
                />
                {errors.title && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.title}</p>}
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  className="input-field"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder="Write your amazing content here..."
                  rows={15}
                  style={{ resize: 'vertical', fontSize: '15px', lineHeight: '1.6' }}
                />
                {errors.content && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.content}</p>}
              </div>
            </div>
          </div>

          {/* Sidebar Settings Column */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Media</h2>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="image">Cover Image</label>
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--bg-main)'
                }}>
                  {imageFile ? (
                    <p style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '16px', fontWeight: '500' }}>
                      Selected: {imageFile.name}
                    </p>
                  ) : existingImage ? (
                    <div style={{ marginBottom: '16px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <img src={existingImage} alt="Current Cover" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '150px', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', wordBreak: 'break-word' }}>
                        Upload your cover image here
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="input-field"
                    style={{ padding: '8px', fontSize: '13px' }}
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>SEO & Routing</h2>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="slug">Custom Slug (Optional)</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  className="input-field"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. my-awesome-post"
                />
                {errors.slug && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.slug}</p>}
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Leave this blank to automatically generate a slug based on your title.
                </p>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-main) 0%, #e0e7ff 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <Link to="/blogs" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                  <Save size={18} />
                  {loading ? 'Saving...' : (isEditing ? 'Update Blog' : 'Publish Blog')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
