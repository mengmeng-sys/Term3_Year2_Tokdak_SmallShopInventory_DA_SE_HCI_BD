const pool = require('../config/db');

const getClientStats = async (shopId) => {
      const [[totalProducts]] = await pool.query(
           'select count(*) as count from products where shop_id = ?',[shopId]
      );
      const [[lowStock]] = await pool.query(
           'select count(*) as count from products where shop_id = ? AND current_quantity<= min_quantity AND current_quantity > 0',[shopId]
      );
      const [[outOfStock]] = await pool.query(
           'select count(*) as count from products where shop_id = ? AND current_quantity = 0',[shopId]
      );
      const [[totalCategories]] = await pool.query (
           'select count(*) as count from categories where shop_id = ?' , [shopId]
      );
      const [recentAlerts] = await pool.query(
           `select a.* ,p.name as product_name, p.current_quantity
            from alerts a 
            join products p on a.product_id = p.product_id
            where a.shop_id = ? AND a.is_resolved = FALSE
            order by a.created_at DESC LIMIT 5     
           `,[shopId]
      );
      const [recentTransactions] = await pool.query(
           `select st.*, p.name as product_name
            from stock_transactions st
            join products p on st.product_id = p.product_id
            where p.shop_id =?
            order by st.created_at DESC LIMIT 5
           `,[shopId]
      );
      return {
       total_products: totalProducts.count,
       low_stock : lowStock.count,
       out_of_stock: outOfStock.count,
       total_categories: totalCategories.count,
       recent_alerts: recentAlerts,
       recent_transactions: recentTransactions
      };
};

const getAdminStats = async () =>{
    const [[totalShops]] = await pool.query('SELECT COUNT(*) AS count FROM shops');
    const [[totalClients]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'client'");
    const [[activeClients]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'client' AND is_active = TRUE");

    const [recentShops] = await pool.query(
        `SELECT s.shop_id, s.shop_name, s.created_at, s.phone,
                u.name AS owner_name, u.is_active AS active
         FROM shops s JOIN users u ON s.user_id = u.user_id
         ORDER BY s.created_at DESC LIMIT 5`
    );

    const [[ownerActivity]] = await pool.query(
        `SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN u.is_active = TRUE THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN u.is_active = FALSE THEN 1 ELSE 0 END) AS inactive
         FROM shops s
         JOIN users u ON s.user_id = u.user_id`
    );

    return {
        total_shops: totalShops.count,
        total_clients: totalClients.count,
        active_clients: activeClients.count,
        recent_shops: recentShops,
        owner_activity: {
            total: ownerActivity.total || 0,
            active: ownerActivity.active || 0,
            inactive: ownerActivity.inactive || 0
        }
    };
};

module.exports ={
       getClientStats,
       getAdminStats
}