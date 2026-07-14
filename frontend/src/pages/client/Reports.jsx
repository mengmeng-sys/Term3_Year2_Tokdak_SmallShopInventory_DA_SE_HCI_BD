import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import '../../styles/adminDashboard.css';

const Reports = () => {
  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Reports" />
        <div className="dash-content">
          <div className="dash-page-header">
            <h1 className="dash-page-title">Reports</h1>
          </div>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888', fontSize: 16 }}>
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
