import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const AdminFees = () => {
  const [fees, setFees] = useState({
    commission: {
      restaurant: 15, // percentage
      driver: 10 // percentage
    },
    delivery: {
      baseFee: 10,
      distanceFee: 2, // per km
      minFee: 5,
      maxFee: 30
    },
    zones: [
      {
        id: 1,
        name: 'الرياض - الشمال',
        baseFee: 10,
        distanceFee: 2,
        minFee: 5,
        maxFee: 25
      },
      {
        id: 2,
        name: 'الرياض - الجنوب',
        baseFee: 12,
        distanceFee: 2.5,
        minFee: 7,
        maxFee: 30
      },
      {
        id: 3,
        name: 'الرياض - الشرق',
        baseFee: 8,
        distanceFee: 1.5,
        minFee: 5,
        maxFee: 20
      },
      {
        id: 4,
        name: 'الرياض - الغرب',
        baseFee: 9,
        distanceFee: 1.8,
        minFee: 6,
        maxFee: 25
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneForm, setZoneForm] = useState({
    name: '',
    baseFee: '',
    distanceFee: '',
    minFee: '',
    maxFee: ''
  });

  useEffect(() => {
    // In a real app, you would fetch fees from an API
    // For now, we'll use the initial state
  }, []);

  const handleEditCommission = () => {
    setEditingFee({
      type: 'commission',
      title: 'نسب العمولة',
      fields: [
        { name: 'restaurant', label: 'عمولة المطعم (%)', value: fees.commission.restaurant },
        { name: 'driver', label: 'عمولة السائق (%)', value: fees.commission.driver }
      ]
    });
    setShowEditModal(true);
  };

  const handleEditDelivery = () => {
    setEditingFee({
      type: 'delivery',
      title: 'رسوم التوصيل',
      fields: [
        { name: 'baseFee', label: 'رسوم التوصيل الأساسية', value: fees.delivery.baseFee },
        { name: 'distanceFee', label: 'رسوم المسافة (لكل كم)', value: fees.delivery.distanceFee },
        { name: 'minFee', label: 'الحد الأدنى للرسوم', value: fees.delivery.minFee },
        { name: 'maxFee', label: 'الحد الأقصى للرسوم', value: fees.delivery.maxFee }
      ]
    });
    setShowEditModal(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name,
      baseFee: zone.baseFee,
      distanceFee: zone.distanceFee,
      minFee: zone.minFee,
      maxFee: zone.maxFee
    });
    setShowZoneModal(true);
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setZoneForm({
      name: '',
      baseFee: '',
      distanceFee: '',
      minFee: '',
      maxFee: ''
    });
    setShowZoneModal(true);
  };

  const handleSaveFee = async () => {
    try {
      setLoading(true);
      
      if (editingFee.type === 'commission') {
        const restaurant = editingFee.fields.find(f => f.name === 'restaurant').value;
        const driver = editingFee.fields.find(f => f.name === 'driver').value;
        
        setFees({
          ...fees,
          commission: {
            restaurant,
            driver
          }
        });
      } else if (editingFee.type === 'delivery') {
        const baseFee = editingFee.fields.find(f => f.name === 'baseFee').value;
        const distanceFee = editingFee.fields.find(f => f.name === 'distanceFee').value;
        const minFee = editingFee.fields.find(f => f.name === 'minFee').value;
        const maxFee = editingFee.fields.find(f => f.name === 'maxFee').value;
        
        setFees({
          ...fees,
          delivery: {
            baseFee,
            distanceFee,
            minFee,
            maxFee
          }
        });
      }
      
      setShowEditModal(false);
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل حفظ التغييرات');
    } finally {
      setLoading(false);
    }
  };

  const handleFeeFieldChange = (fieldName, value) => {
    setEditingFee({
      ...editingFee,
      fields: editingFee.fields.map(field =>
        field.name === fieldName ? { ...field, value } : field
      )
    });
  };

  const handleZoneFieldChange = (fieldName, value) => {
    setZoneForm({
      ...zoneForm,
      [fieldName]: value
    });
  };

  const handleSaveZone = async () => {
    try {
      setLoading(true);
      
      if (editingZone) {
        // Update existing zone
        const updatedZones = fees.zones.map(zone =>
          zone.id === editingZone.id
            ? {
                ...zone,
                name: zoneForm.name,
                baseFee: parseFloat(zoneForm.baseFee),
                distanceFee: parseFloat(zoneForm.distanceFee),
                minFee: parseFloat(zoneForm.minFee),
                maxFee: parseFloat(zoneForm.maxFee)
              }
            : zone
        );
        
        setFees({
          ...fees,
          zones: updatedZones
        });
      } else {
        // Add new zone
        const newZone = {
          id: fees.zones.length + 1,
          name: zoneForm.name,
          baseFee: parseFloat(zoneForm.baseFee),
          distanceFee: parseFloat(zoneForm.distanceFee),
          minFee: parseFloat(zoneForm.minFee),
          maxFee: parseFloat(zoneForm.maxFee)
        };
        
        setFees({
          ...fees,
          zones: [...fees.zones, newZone]
        });
      }
      
      setShowZoneModal(false);
      toast.success(editingZone ? 'تم تحديث المنطقة بنجاح' : 'تمت إضافة المنطقة بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل حفظ التغييرات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = (zoneId) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذه المنطقة؟')) {
      try {
        const updatedZones = fees.zones.filter(zone => zone.id !== zoneId);
        setFees({
          ...fees,
          zones: updatedZones
        });
        toast.success('تم حذف المنطقة بنجاح');
      } catch (error) {
        toast.error(error.message || 'فشل حذف المنطقة');
      }
    }
  };

  if (loading && !showEditModal && !showZoneModal) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <Button variant="primary" onClick={() => window.location.reload()} className="mt-3">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="admin-fees">
      <div className="fees-header mb-4">
        <h1>إدارة الرسوم</h1>
      </div>

      <div className="fees-grid grid">
        {/* Commission Fees */}
        <div className="fee-card glass p-4">
          <div className="fee-header">
            <h3>نسب العمولة</h3>
            <Button variant="outline" size="small" onClick={handleEditCommission}>
              تعديل
            </Button>
          </div>
          
          <div className="fee-details">
            <div className="fee-item">
              <span className="fee-label">عمولة المطعم</span>
              <span className="fee-value">{fees.commission.restaurant}%</span>
            </div>
            <div className="fee-item">
              <span className="fee-label">عمولة السائق</span>
              <span className="fee-value">{fees.commission.driver}%</span>
            </div>
          </div>
        </div>

        {/* Delivery Fees */}
        <div className="fee-card glass p-4">
          <div className="fee-header">
            <h3>رسوم التوصيل</h3>
            <Button variant="outline" size="small" onClick={handleEditDelivery}>
              تعديل
            </Button>
          </div>
          
          <div className="fee-details">
            <div className="fee-item">
              <span className="fee-label">الرسوم الأساسية</span>
              <span className="fee-value">{fees.delivery.baseFee} ريال</span>
            </div>
            <div className="fee-item">
              <span className="fee-label">رسوم المسافة</span>
              <span className="fee-value">{fees.delivery.distanceFee} ريال/كم</span>
            </div>
            <div className="fee-item">
              <span className="fee-label">الحد الأدنى</span>
              <span className="fee-value">{fees.delivery.minFee} ريال</span>
            </div>
            <div className="fee-item">
              <span className="fee-label">الحد الأقصى</span>
              <span className="fee-value">{fees.delivery.maxFee} ريال</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zones */}
      <div className="zones-section mt-4">
        <div className="zones-header flex justify-between items-center mb-4">
          <h2>المناطق والرسوم</h2>
          <Button variant="primary" onClick={handleAddZone}>
            إضافة منطقة جديدة
          </Button>
        </div>
        
        <div className="zones-grid grid">
          {fees.zones.map(zone => (
            <div key={zone.id} className="zone-card glass p-4">
              <div className="zone-header">
                <h3>{zone.name}</h3>
                <div className="zone-actions">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleEditZone(zone)}
                    className="me-2"
                  >
                    تعديل
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleDeleteZone(zone.id)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
              
              <div className="zone-details">
                <div className="zone-item">
                  <span className="zone-label">الرسوم الأساسية</span>
                  <span className="zone-value">{zone.baseFee} ريال</span>
                </div>
                <div className="zone-item">
                  <span className="zone-label">رسوم المسافة</span>
                  <span className="zone-value">{zone.distanceFee} ريال/كم</span>
                </div>
                <div className="zone-item">
                  <span className="zone-label">الحد الأدنى</span>
                  <span className="zone-value">{zone.minFee} ريال</span>
                </div>
                <div className="zone-item">
                  <span className="zone-label">الحد الأقصى</span>
                  <span className="zone-value">{zone.maxFee} ريال</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Fee Modal */}
      <Modal 
        show={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title={editingFee?.title}
      >
        {editingFee && (
          <div className="edit-fee-form">
            {editingFee.fields.map((field, index) => (
              <Input
                key={index}
                type="number"
                label={field.label}
                value={field.value}
                onChange={(e) => handleFeeFieldChange(field.name, parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            ))}
            
            <div className="modal-actions mt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                إلغاء
              </Button>
              <Button variant="primary" onClick={handleSaveFee} disabled={loading}>
                {loading ? <LoadingSpinner size="small" /> : 'حفظ'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Zone Modal */}
      <Modal 
        show={showZoneModal} 
        onClose={() => setShowZoneModal(false)} 
        title={editingZone ? 'تعديل المنطقة' : 'إضافة منطقة جديدة'}
      >
        <div className="edit-zone-form">
          <Input
            type="text"
            label="اسم المنطقة"
            value={zoneForm.name}
            onChange={(e) => handleZoneFieldChange('name', e.target.value)}
            required
          />
          
          <Input
            type="number"
            label="الرسوم الأساسية"
            value={zoneForm.baseFee}
            onChange={(e) => handleZoneFieldChange('baseFee', e.target.value)}
            min="0"
            step="0.01"
            required
          />
          
          <Input
            type="number"
            label="رسوم المسافة (لكل كم)"
            value={zoneForm.distanceFee}
            onChange={(e) => handleZoneFieldChange('distanceFee', e.target.value)}
            min="0"
            step="0.01"
            required
          />
          
          <Input
            type="number"
            label="الحد الأدنى للرسوم"
            value={zoneForm.minFee}
            onChange={(e) => handleZoneFieldChange('minFee', e.target.value)}
            min="0"
            step="0.01"
            required
          />
          
          <Input
            type="number"
            label="الحد الأقصى للرسوم"
            value={zoneForm.maxFee}
            onChange={(e) => handleZoneFieldChange('maxFee', e.target.value)}
            min="0"
            step="0.01"
            required
          />
          
          <div className="modal-actions mt-4">
            <Button variant="outline" onClick={() => setShowZoneModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleSaveZone} disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : (editingZone ? 'تحديث' : 'إضافة')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminFees;