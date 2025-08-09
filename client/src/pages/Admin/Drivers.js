import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    title: "",
    message: "",
    action: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    vehicleColor: "",
    licenseNumber: "",
    image: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch drivers from an API
        // For now, we'll use mock data
        const mockDrivers = [
          {
            _id: "1",
            name: "خالد سالم",
            email: "khaled@example.com",
            phone: "0507778899",
            vehicleType: "سيارة",
            vehicleColor: "أبيض",
            licenseNumber: "ABC123",
            rating: 4.7,
            status: "active",
            createdAt: "2023-02-15T16:30:00Z",
            totalOrders: 125,
            totalEarnings: 3125,
          },
          {
            _id: "2",
            name: "سارة عبدالله",
            email: "sara@example.com",
            phone: "0501237890",
            vehicleType: "سيارة",
            vehicleColor: "أسود",
            licenseNumber: "XYZ789",
            rating: 4.5,
            status: "pending",
            createdAt: "2023-03-20T13:45:00Z",
            totalOrders: 0,
            totalEarnings: 0,
          },
          {
            _id: "3",
            name: "محمد أحمد",
            email: "mohamed@example.com",
            phone: "0504567890",
            vehicleType: "دراجة نارية",
            vehicleColor: "أحمر",
            licenseNumber: "MNO456",
            rating: 4.8,
            status: "active",
            createdAt: "2023-01-25T11:45:00Z",
            totalOrders: 210,
            totalEarnings: 5250,
          },
          {
            _id: "4",
            name: "فاطمة علي",
            email: "fatima@example.com",
            phone: "0509876543",
            vehicleType: "سيارة",
            vehicleColor: "أزرق",
            licenseNumber: "DEF456",
            rating: 4.3,
            status: "inactive",
            createdAt: "2023-01-10T09:15:00Z",
            totalOrders: 85,
            totalEarnings: 2125,
          },
        ];

        setDrivers(mockDrivers);
        setFilteredDrivers(mockDrivers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    let result = drivers;

    if (searchTerm) {
      result = result.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone.includes(searchTerm) ||
          driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((driver) => driver.status === statusFilter);
    }

    setFilteredDrivers(result);
  }, [drivers, searchTerm, statusFilter]);

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  const handleToggleDriverStatus = (driver) => {
    const action = driver.status === "active" ? "تعطيل" : "تفعيل";
    setConfirmAction({
      title: `${action} السائق`,
      message: `هل أنت متأكد من أنك تريد ${action} السائق ${driver.name}؟`,
      action: () => {
        const updatedDrivers = drivers.map((d) =>
          d._id === driver._id
            ? { ...d, status: d.status === "active" ? "inactive" : "active" }
            : d
        );
        setDrivers(updatedDrivers);
        setShowConfirmModal(false);
        toast.success(`تم ${action} السائق بنجاح`);
      },
    });
    setShowConfirmModal(true);
  };

  const handleApproveDriver = (driver) => {
    setConfirmAction({
      title: "الموافقة على السائق",
      message: `هل أنت متأكد من أنك تريد الموافقة على السائق ${driver.name}؟`,
      action: () => {
        const updatedDrivers = drivers.map((d) =>
          d._id === driver._id ? { ...d, status: "active" } : d
        );
        setDrivers(updatedDrivers);
        setShowConfirmModal(false);
        toast.success("تمت الموافقة على السائق بنجاح");
      },
    });
    setShowConfirmModal(true);
  };

  const handleDeleteDriver = (driver) => {
    setConfirmAction({
      title: "حذف السائق",
      message: `هل أنت متأكد من أنك تريد حذف السائق ${driver.name}؟ لا يمكن التراجع عن هذا الإجراء.`,
      action: () => {
        const updatedDrivers = drivers.filter((d) => d._id !== driver._id);
        setDrivers(updatedDrivers);
        setShowConfirmModal(false);
        toast.success("تم حذف السائق بنجاح");
      },
    });
    setShowConfirmModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();

    try {
      // In a real app, you would send the data to an API
      const newDriver = {
        ...formData,
        _id: Date.now().toString(),
        rating: 0,
        totalOrders: 0,
        totalEarnings: 0,
      };

      setDrivers([...drivers, newDriver]);
      setShowAddModal(false);
      toast.success("تمت إضافة السائق بنجاح");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicleType: "",
        vehicleColor: "",
        licenseNumber: "",
        image: "",
        status: "pending",
      });
    } catch (error) {
      toast.error(error.message || "فشل إضافة السائق");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "غير نشط";
      case "pending":
        return "في الانتظار";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-drivers">
      <div className="drivers-header mb-4">
        <div className="flex justify-between items-center">
          <h1>إدارة السائقين</h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            إضافة سائق جديد
          </Button>
        </div>

        <div className="drivers-filters">
          <Input
            type="text"
            placeholder="بحث عن سائق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filter-group">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">في الانتظار</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="mt-3"
          >
            إعادة المحاولة
          </Button>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="glass p-5 text-center">
          <h3>لا توجد سائقين</h3>
          <p>لا توجد سائقين تطابق معايير التصفية المحددة</p>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="mt-3"
          >
            إضافة سائق جديد
          </Button>
        </div>
      ) : (
        <div className="drivers-table">
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>نوع المركبة</th>
                <th>رقم الرخصة</th>
                <th>التقييم</th>
                <th>الطلبات</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.name}</td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td>
                    {driver.vehicleType} ({driver.vehicleColor})
                  </td>
                  <td>{driver.licenseNumber}</td>
                  <td>
                    <div className="rating">
                      <span>⭐ {driver.rating}</span>
                    </div>
                  </td>
                  <td>{driver.totalOrders}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        driver.status
                      )}`}
                    >
                      {getStatusLabel(driver.status)}
                    </span>
                  </td>
                  <td>
                    <div className="driver-actions">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleViewDriver(driver)}
                        className="me-2"
                      >
                        عرض
                      </Button>

                      {driver.status === "pending" && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleApproveDriver(driver)}
                          className="me-2"
                        >
                          موافقة
                        </Button>
                      )}

                      {driver.status !== "pending" && (
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleToggleDriverStatus(driver)}
                          className={
                            driver.status === "active" ? "warning" : "success"
                          }
                        >
                          {driver.status === "active" ? "تعطيل" : "تفعيل"}
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDeleteDriver(driver)}
                      >
                        حذف
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Driver Details Modal */}
      <Modal
        show={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        title={`تفاصيل السائق - ${selectedDriver?.name}`}
        size="large"
      >
        {selectedDriver && (
          <div className="driver-details">
            <div className="driver-info grid">
              <div className="info-section glass p-3">
                <h3>معلومات السائق</h3>
                <p>
                  <strong>الاسم:</strong> {selectedDriver.name}
                </p>
                <p>
                  <strong>البريد الإلكتروني:</strong> {selectedDriver.email}
                </p>
                <p>
                  <strong>الهاتف:</strong> {selectedDriver.phone}
                </p>
                <p>
                  <strong>نوع المركبة:</strong> {selectedDriver.vehicleType}
                </p>
                <p>
                  <strong>لون المركبة:</strong> {selectedDriver.vehicleColor}
                </p>
                <p>
                  <strong>رقم الرخصة:</strong> {selectedDriver.licenseNumber}
                </p>
                <p>
                  <strong>التقييم:</strong> ⭐ {selectedDriver.rating}
                </p>
                <p>
                  <strong>الحالة:</strong>
                  <span
                    className={`status-badge ${getStatusBadgeClass(
                      selectedDriver.status
                    )} ms-2`}
                  >
                    {getStatusLabel(selectedDriver.status)}
                  </span>
                </p>
              </div>

              <div className="info-section glass p-3">
                <h3>معلومات الأداء</h3>
                <p>
                  <strong>إجمالي الطلبات:</strong> {selectedDriver.totalOrders}
                </p>
                <p>
                  <strong>إجمالي الأرباح:</strong>{" "}
                  {selectedDriver.totalEarnings} ريال
                </p>
                <p>
                  <strong>متوسط الأرباح لكل طلب:</strong>{" "}
                  {selectedDriver.totalOrders > 0
                    ? (
                        selectedDriver.totalEarnings /
                        selectedDriver.totalOrders
                      ).toFixed(2)
                    : 0}{" "}
                  ريال
                </p>
              </div>

              <div className="info-section glass p-3">
                <h3>معلومات الحساب</h3>
                <p>
                  <strong>تاريخ الإنشاء:</strong>{" "}
                  {formatDate(selectedDriver.createdAt)}
                </p>
              </div>
            </div>

            <div className="driver-actions mt-4">
              {selectedDriver.status === "pending" && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApproveDriver(selectedDriver);
                    setShowDriverModal(false);
                  }}
                  className="me-2"
                >
                  موافقة
                </Button>
              )}

              {selectedDriver.status !== "pending" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleToggleDriverStatus(selectedDriver);
                    setShowDriverModal(false);
                  }}
                  className={
                    selectedDriver.status === "active" ? "warning" : "success"
                  }
                >
                  {selectedDriver.status === "active" ? "تعطيل" : "تفعيل"}
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() => {
                  handleDeleteDriver(selectedDriver);
                  setShowDriverModal(false);
                }}
                className="me-2"
              >
                حذف
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowDriverModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Driver Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة سائق جديد"
        size="large"
      >
        <form onSubmit={handleAddDriver}>
          <div className="form-grid grid">
            <Input
              type="text"
              label="الاسم الكامل"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              type="email"
              label="البريد الإلكتروني"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              type="tel"
              label="رقم الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            <div className="form-group">
              <label>نوع المركبة</label>
              <select
                className="form-control"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر نوع المركبة</option>
                <option value="سيارة">سيارة</option>
                <option value="دراجة نارية">دراجة نارية</option>
                <option value="دراجة هوائية">دراجة هوائية</option>
              </select>
            </div>

            <div className="form-group">
              <label>لون المركبة</label>
              <select
                className="form-control"
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر اللون</option>
                <option value="أبيض">أبيض</option>
                <option value="أسود">أسود</option>
                <option value="أحمر">أحمر</option>
                <option value="أزرق">أزرق</option>
                <option value="أخضر">أخضر</option>
                <option value="أصفر">أصفر</option>
                <option value="برتقالي">برتقالي</option>
                <option value="بنفسجي">بنفسجي</option>
              </select>
            </div>

            <Input
              type="text"
              label="رقم الرخصة"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
            />

            <div className="form-group">
              <label>الحالة</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">في الانتظار</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          <Input
            type="url"
            label="رابط الصورة"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />

          <div className="modal-actions mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowAddModal(false)}
            >
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              إضافة السائق
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmAction.title}
      >
        <div className="confirm-action">
          <p>{confirmAction.message}</p>
          <div className="modal-actions mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              إلغاء
            </Button>
            <Button
              variant={
                confirmAction.title.includes("حذف") ? "secondary" : "primary"
              }
              onClick={confirmAction.action}
            >
              تأكيد
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDrivers;
