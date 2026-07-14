// all module we use commonJS  const func = require('file path') and we dont have to put file ext too
const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const errorMiddleware = require('./middlewares/error.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');

// Routes
const authRoutes    = require('./routes/auth.routes');
const backupRoutes  = require('./routes/backup.routes');
const productRoutes = require('./routes/product.routes');
const stockRoutes   = require('./routes/stock.routes');
const shopRoutes    = require('./routes/shop.routes');
const reportRoutes  = require('./routes/report.routes');
const userRoutes    = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const alertRoutes = require('./routes/alert.routes')
const dashboardRoutes = require('./routes/dashboard.routes');
const shopSittingsRoutes = require('./routes/shop_settings.routes');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use('/uploads', express.static('uploads'));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/backups', backupRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock',    stockRoutes);
app.use('/api/shops',    shopRoutes);
app.use('/api/reports',  reportRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/alerts',alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shop-settings',shopSittingsRoutes);


// Error handler
app.use(errorMiddleware);

module.exports = app;
