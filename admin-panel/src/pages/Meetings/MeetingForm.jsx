import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const MeetingForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: ''
  });
  
  const [existingImage1, setExistingImage1] = useState(null);
  const [existingImage2, setExistingImage2] = useState(null);
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchMeeting = async () => {
        try {
          const response = await api.get(`/admin/meetings/${id}`);
          const meetingData = response.data.data;
          setFormData({
            title: meetingData.title || '',
            subtitle: meetingData.subtitle || ''
          });
          if (meetingData.image1 && meetingData.image1 !== 'no-photo.jpg') {
            setExistingImage1(meetingData.image1.startsWith('http') ? meetingData.image1 : `http://localhost:5000/${meetingData.image1}`);
          }
          if (meetingData.image2 && meetingData.image2 !== 'no-photo.jpg') {
            setExistingImage2(meetingData.image2.startsWith('http') ? meetingData.image2 : `http://localhost:5000/${meetingData.image2}`);
          }
        } catch (error) {
          alert('Failed to fetch meeting details');
          navigate('/meetings');
        } finally {
          setFetching(false);
        }
      };
      fetchMeeting();
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
    
    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Please add a subtitle';
    } else if (formData.subtitle.length > 200) {
      newErrors.subtitle = 'Subtitle cannot be more than 200 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('subtitle', formData.subtitle);
    if (imageFile1) {
      submitData.append('image1', imageFile1);
    }
    if (imageFile2) {
      submitData.append('image2', imageFile2);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/meetings/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/meetings', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/meetings');
    } catch (error) {
      console.error(error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} meeting`;
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
        <Link to="/meetings" className="btn btn-secondary" style={{ padding: '10px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>{isEditing ? 'Edit Meeting' : 'Create New Meeting'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isEditing ? 'Update the details of your meeting glance below.' : 'Draft a new meeting glance for your audience.'}
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
                <label htmlFor="title">Meeting Title / Heading</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="input-field"
                  style={{ fontSize: '16px', padding: '12px' }}
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. A Glance at yesterday's Meeting"
                />
                {errors.title && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.title}</p>}
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="subtitle">Subtitle / Subheading</label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  className="input-field"
                  style={{ fontSize: '16px', padding: '12px' }}
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Discussing progress of batch MERN-04"
                />
                {errors.subtitle && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Media & Actions Column */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Meeting Images</h2>
              
              {/* Image 1 Upload */}
              <div className="input-group">
                <label htmlFor="image1">First Image</label>
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                  background: 'var(--bg-main)',
                  marginBottom: '8px'
                }}>
                  {imageFile1 ? (
                    <p style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px', fontWeight: '500' }}>
                      Selected: {imageFile1.name}
                    </p>
                  ) : existingImage1 ? (
                    <div style={{ marginBottom: '8px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <img src={existingImage1} alt="Current Cover 1" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '100px', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
                    </>
                  )}
                  <input
                    type="file"
                    id="image1"
                    name="image1"
                    className="input-field"
                    style={{ padding: '4px', fontSize: '12px' }}
                    onChange={(e) => setImageFile1(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Image 2 Upload */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="image2">Second Image</label>
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                  background: 'var(--bg-main)'
                }}>
                  {imageFile2 ? (
                    <p style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px', fontWeight: '500' }}>
                      Selected: {imageFile2.name}
                    </p>
                  ) : existingImage2 ? (
                    <div style={{ marginBottom: '8px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <img src={existingImage2} alt="Current Cover 2" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '100px', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
                    </>
                  )}
                  <input
                    type="file"
                    id="image2"
                    name="image2"
                    className="input-field"
                    style={{ padding: '4px', fontSize: '12px' }}
                    onChange={(e) => setImageFile2(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-main) 0%, #e0e7ff 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <Link to="/meetings" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                  <Save size={18} />
                  {loading ? 'Saving...' : (isEditing ? 'Update' : 'Publish')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
