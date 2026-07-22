import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const SeminarEventForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    batchId: '',
    topic: '',
    date: '',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    mode: 'Offline',
    venue: '',
    venueMapLink: '',
    language: 'English & Gujarati/Hindi mix',
    totalSeats: 100,
    isActive: true
  });

  const [existingVenueImage, setExistingVenueImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const response = await api.get(`/admin/seminar-events/${id}`);
          const event = response.data.data;
          
          let formattedDate = '';
          if (event.date) {
            formattedDate = new Date(event.date).toISOString().split('T')[0];
          }

          setFormData({
            batchId: event.batchId || '',
            topic: event.topic || '',
            date: formattedDate,
            startTime: event.startTime || '4:00 PM',
            endTime: event.endTime || '6:00 PM',
            mode: event.mode || 'Offline',
            venue: event.venue || '',
            venueMapLink: event.venueMapLink || '',
            language: event.language || 'English & Gujarati/Hindi mix',
            totalSeats: event.totalSeats || 100,
            isActive: Boolean(event.isActive)
          });

          if (event.venueImage && event.venueImage !== 'no-photo.jpg') {
            setExistingVenueImage(event.venueImage.startsWith('http') ? event.venueImage : `http://localhost:5000/${event.venueImage}`);
          }
        } catch (error) {
          alert('Failed to fetch seminar event details');
          navigate('/seminar-events');
        } finally {
          setFetching(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const newErrors = {};
    if (!formData.batchId.trim()) newErrors.batchId = 'Please add a batch identifier';
    if (!formData.topic.trim()) newErrors.topic = 'Please add a topic';
    else if (formData.topic.length > 150) newErrors.topic = 'Topic cannot be more than 150 characters';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.startTime.trim()) newErrors.startTime = 'Please add a start time';
    if (!formData.endTime.trim()) newErrors.endTime = 'Please add an end time';
    if (!formData.venue.trim()) newErrors.venue = 'Please add a venue';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const submitData = new FormData();
    submitData.append('batchId', formData.batchId);
    submitData.append('topic', formData.topic);
    submitData.append('date', formData.date);
    submitData.append('startTime', formData.startTime);
    submitData.append('endTime', formData.endTime);
    submitData.append('mode', formData.mode);
    submitData.append('venue', formData.venue);
    submitData.append('venueMapLink', formData.venueMapLink);
    submitData.append('language', formData.language);
    submitData.append('totalSeats', formData.totalSeats);
    submitData.append('isActive', formData.isActive);

    if (imageFile) {
      submitData.append('venueImage', imageFile);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/seminar-events/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/seminar-events', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/seminar-events');
    } catch (error) {
      console.error('Save event error:', error);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} seminar event`;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading seminar event form...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/seminar-events" className="btn btn-secondary" style={{ padding: '10px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>{isEditing ? 'Edit Seminar Event' : 'Create Seminar Event'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isEditing ? 'Update event schedule, venue, and seat settings.' : 'Configure a new seminar event to display on the student registration page.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* Main Form Fields */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* General Info Card */}
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Event Information</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label htmlFor="batchId">Batch Identifier / Code *</label>
                  <input
                    type="text"
                    id="batchId"
                    name="batchId"
                    className="input-field"
                    style={{ fontSize: '15px', padding: '10px' }}
                    value={formData.batchId}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Aug-2026 or July 2026 Batch"
                  />
                  {errors.batchId && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.batchId}</p>}
                </div>

                <div className="input-group">
                  <label htmlFor="mode">Seminar Mode</label>
                  <select
                    id="mode"
                    name="mode"
                    className="input-field"
                    style={{ fontSize: '15px', padding: '10px' }}
                    value={formData.mode}
                    onChange={handleChange}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="topic">Seminar Topic / Title *</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  className="input-field"
                  style={{ fontSize: '15px', padding: '10px' }}
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cracking Your First Tech Career"
                />
                {errors.topic && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.topic}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="input-field"
                    style={{ fontSize: '14px', padding: '10px' }}
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  {errors.date && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.date}</p>}
                </div>

                <div className="input-group">
                  <label htmlFor="startTime">Start Time *</label>
                  <input
                    type="text"
                    id="startTime"
                    name="startTime"
                    className="input-field"
                    style={{ fontSize: '14px', padding: '10px' }}
                    value={formData.startTime}
                    onChange={handleChange}
                    placeholder="e.g. 4:00 PM"
                    required
                  />
                  {errors.startTime && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.startTime}</p>}
                </div>

                <div className="input-group">
                  <label htmlFor="endTime">End Time *</label>
                  <input
                    type="text"
                    id="endTime"
                    name="endTime"
                    className="input-field"
                    style={{ fontSize: '14px', padding: '10px' }}
                    value={formData.endTime}
                    onChange={handleChange}
                    placeholder="e.g. 6:00 PM"
                    required
                  />
                  {errors.endTime && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.endTime}</p>}
                </div>
              </div>
            </div>

            {/* Venue & Details Card */}
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Venue & Extra Details</h2>

              <div className="input-group">
                <label htmlFor="venue">Venue Address / Location *</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  className="input-field"
                  style={{ fontSize: '15px', padding: '10px' }}
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Alphabit Skill Studio, Rajkot"
                />
                {errors.venue && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{errors.venue}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="venueMapLink">Venue Map Link (Google Maps URL)</label>
                <input
                  type="url"
                  id="venueMapLink"
                  name="venueMapLink"
                  className="input-field"
                  style={{ fontSize: '14px', padding: '10px' }}
                  value={formData.venueMapLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label htmlFor="language">Medium / Language</label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    className="input-field"
                    style={{ fontSize: '14px', padding: '10px' }}
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="e.g. English & Gujarati/Hindi mix"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="totalSeats">Total Capacity / Seats *</label>
                  <input
                    type="number"
                    id="totalSeats"
                    name="totalSeats"
                    className="input-field"
                    style={{ fontSize: '14px', padding: '10px' }}
                    value={formData.totalSeats}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media & Settings Sidebar */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Active Status Card */}
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Setting</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  Set as Active Seminar
                </label>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                When checked, this event will be set as active and displayed on the public landing page card (deactivating any other active seminar).
              </p>
            </div>

            {/* Venue Image Upload Card */}
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Venue Image</h2>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                  background: 'var(--bg-main)'
                }}>
                  {imageFile ? (
                    <p style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px', fontWeight: '500' }}>
                      Selected: {imageFile.name}
                    </p>
                  ) : existingVenueImage ? (
                    <div style={{ marginBottom: '8px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <img src={existingVenueImage} alt="Venue Preview" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '120px', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <ImageIcon size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
                  )}
                  <input
                    type="file"
                    id="venueImage"
                    name="venueImage"
                    className="input-field"
                    style={{ padding: '4px', fontSize: '12px' }}
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-main) 0%, #e0e7ff 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <Link to="/seminar-events" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                  <Save size={18} />
                  {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Save Event')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default SeminarEventForm;
